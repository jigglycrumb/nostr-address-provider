import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

import config from "../../../site.config";

// Connection URL
const dbUrl = import.meta.env.MONGODB_URI;
const client = new MongoClient(dbUrl);
const { dbName, dbCollection } = config;

export const get: APIRoute = async function get() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);
  const findResult = await collection.find({}).toArray();
  const userMap: Record<string, string> = {};

  findResult.forEach((entry) => {
    userMap[entry.username] = entry.pubkey;
  });

  const json = {
    names: userMap,
  };

  client.close();

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
