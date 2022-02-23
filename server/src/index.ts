import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  // Increase the request body size to 2MB
  app.use(bodyParser.json({ limit: "2mb" }));

  app.use(cookieParser(process.env.SECRET));

  app.use(compression());

  app.use(express.static(`${__dirname}/client`));
  app.get("/*", (_req, res) => res.send(`${__dirname}/client/index.html`));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    context: ({ req, res }) => ({ db, req, res }),
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
