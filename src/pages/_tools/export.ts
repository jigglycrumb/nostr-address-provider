import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

// Connection URL
const url = import.meta.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "verification";
const dbCollection = "names";

export const get: APIRoute = async function get({ params, request }) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);
  const findResult = await collection.find({}).toArray();
  const userMap: Record<string, string> = {};

  findResult.forEach(entry => {
    userMap[entry.username] = entry.pubkey;
  });

  const json = {
    names: userMap,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
