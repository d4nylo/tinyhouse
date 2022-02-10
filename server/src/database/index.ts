import { MongoClient } from "mongodb";

const user = "user_01";
const userPassword = "R8yQXZQqXYaSGYOV";
const cluster = "tinyhouse-cluster";
const url = `mongodb+srv://${user}:${userPassword}@${cluster}.odpgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

export const connectDatabase = async () => {
  const client = await MongoClient.connect(url); // { useNewUrlParser: true, useUnifiedTopology: true }

  const db = client.db("main");

  return {
    listings: db.collection("test_listings"),
  };
};
