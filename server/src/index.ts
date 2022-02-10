import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const port = 9000;

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

  app.listen(port);

  console.log(`[app]: http://localhost:${port}`);

  // # Example: Accessing the database
  // const listings = await db.listings.find({}).toArray();
  // console.log(listings);
};

mount(express());
