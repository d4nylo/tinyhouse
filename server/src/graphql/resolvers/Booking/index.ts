import { IResolvers } from "@graphql-tools/utils";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Stripe } from "../../../lib/api";
import { Booking, Database, Listing } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { CreateBookingArgs } from "./types";

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    listing: (booking: Booking, _args: {}, { db }: { db: Database }): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
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

        const host = await db.users.findOne({
          _id: listing.host,
        });

        if (!host) {
          throw new Error("the host can't be found");
        }

        if (!host.walletId) {
          throw new Error("the host is not connected with Stripe");
        }

        // 86400000 => Milliseconds in a Day => 24h * 60m * 60s * 1000ms
        const totalPrice = listing.price * ((checkOutDate.getTime() - checkInDate.getTime()) / 86400000 + 1);

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

        // Update the host user document to increment ("$inc") the income field by the totalPrice
        await db.users.updateOne({ _id: host._id }, { $inc: { income: totalPrice } });

        // Update the viewer user document to push ("$push") a new booking to the bookings field
        await db.users.updateOne({ _id: viewer._id }, { $push: { bookings: insertedBooking._id } });

        // TODO
        //const bookingsIndex = resolveBookingsIndex(listing.bookingsIndex, checkIn, checkOut);

        await db.listings.updateOne(
          { _id: listing._id },
          {
            //$set: { bookingsIndex }, // TODO
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
