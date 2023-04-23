import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

import config from "../../../site.config";

// @ts-expect-error this file only exists when added by the user
import nostr from "./nostr.json" assert { type: "json" };

// Connection URL
const dbUrl = import.meta.env.MONGODB_URI;
const client = new MongoClient(dbUrl);
const { dbName, dbCollection } = config;

export const get: APIRoute = async function get() {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);

  const users = nostr.names;

  const data = Object.entries(users).map(([username, pubkey]) => {
    return { username, pubkey };
  });

  collection.insertMany(data);

  const json = {
    message: "Done!",
  };

  client.close();

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
