import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";
import nostr from "../../data/nostr.json" assert { type: "json" };

// Connection URL
const url = import.meta.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "verification";
const dbCollection = "names";

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

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
