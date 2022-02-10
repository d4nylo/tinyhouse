import { IResolvers } from "@graphql-tools/utils";
import { listings } from "../listings";

export const resolvers: IResolvers = {
  Query: {
    listings: () => {
      return listings;
    },
  },
  Mutation: {
    deleteListing: (_root: undefined, { id }: { id: string }) => {
      for (let idx = 0; idx < listings.length; idx++) {
        if (listings[idx].id === id) {
          return listings.splice(idx, 1)[0];
        }
      }

      throw new Error("failed to delete listing");
    },
  },
};
