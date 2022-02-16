import { IResolvers } from "@graphql-tools/utils";
import { Booking, Database, Listing } from "../../../lib/types";

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
};
