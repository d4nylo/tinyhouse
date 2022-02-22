import { IResolvers } from "@graphql-tools/utils";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Stripe } from "../../../lib/api";
import { Booking, BookingsIndex, Database, Listing, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { CreateBookingArgs } from "./types";

const MILISECONDS_PER_DAY = 60 * 60 * 24 * 1000; // 86400000

// Create a new `bookingsIndex` from the check-in and check-out dates of a booking
const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth(); // 0 to 11 (0: Jan., ..., 11: Dec.)
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) {
      newBookingsIndex[y] = {};
    }

    if (!newBookingsIndex[y][m]) {
      newBookingsIndex[y][m] = {};
    }

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error("selected dates can't overlap dates that have already been booked");
    }

    dateCursor = new Date(dateCursor.getTime() + MILISECONDS_PER_DAY);
  }

  return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    listing: (booking: Booking, _args: {}, { db }: { db: Database }): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    tenant: (booking: Booking, _args: {}, { db }: { db: Database }): Promise<User | null> => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;

        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        if (!listing) {
          throw new Error("listing can't be found");
        }

        if (listing.host === viewer._id) {
          throw new Error("viewer can't book own listing");
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate < checkInDate) {
          throw new Error("check out date can't be before check in date");
        }

        const bookingsIndex = resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host) {
          throw new Error("the host can't be found");
        }

        if (!host.walletId) {
          throw new Error("the host is not connected with Stripe");
        }

        const totalPrice = listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / MILISECONDS_PER_DAY + 1);

        await Stripe.charge(totalPrice, source, host.walletId);

        const insertRes = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        const insertedBooking = await db.bookings.findOne({ _id: insertRes.insertedId });

        if (!insertedBooking) {
          throw new Error("Failed to insert booking");
        }

        // Update the host user document to increment ("$inc") the `income` field by the totalPrice
        await db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } });

        // Update the viewer user document to push ("$push") the new booking id to the `bookings` field
        await db.users.updateOne({ _id: viewer._id }, { $push: { bookings: insertedBooking._id } });

        // Update the listing document `bookingsIndex` field & push the new booking id to the `bookings` array field
        await db.listings.updateOne(
          { _id: listing._id },
          {
            $set: { bookingsIndex },
            $push: { bookings: insertedBooking._id },
          }
        );

        return insertedBooking;
      } catch (error) {
        throw new Error(`Failed to create a booking: ${error}`);
      }
    },
  },
};
