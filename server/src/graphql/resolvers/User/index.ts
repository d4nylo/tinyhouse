import { IResolvers } from "@graphql-tools/utils";

export const userResolvers: IResolvers = {
  Query: {
    user: () => {
      return "Query.user";
    },
  },
};
