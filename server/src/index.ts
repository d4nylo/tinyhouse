import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: () => ({ db }),
  });

  server.start().then(() => {
    server.applyMiddleware({ app, path: "/api" });
  });

  app.listen(process.env.PORT);

  console.log(`[app]: http://localhost:${process.env.PORT}`);

  // # Example: Accessing the database
  // const listings = await db.listings.find({}).toArray();
  // console.log(listings);
};

mount(express());
