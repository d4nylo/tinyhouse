import { IResolvers } from "@graphql-tools/utils";
import { Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: () => {
      return "Query.listing";
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
  },
};
