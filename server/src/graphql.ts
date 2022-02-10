import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello from query!",
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello from mutation!",
    },
  },
});

export const schema = new GraphQLSchema({ query, mutation });
