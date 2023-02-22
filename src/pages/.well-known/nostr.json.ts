import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

// Connection URL
const url = import.meta.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "verification";
const dbCollection = "names";

export const get: APIRoute = async function get({ request }) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);

  const params = new URL(request.url).searchParams;
  const searchUser = params.get("name");

  const queryParams = searchUser ? { username: searchUser } : {};

  const findResult = await collection.find(queryParams).toArray();
  const userMap: Record<string, string> = {};

  findResult.forEach(entry => {
    userMap[entry.username] = entry.pubkey;
  });

  const json = {
    names: Object.fromEntries(Object.entries(userMap).sort()),
  };

  return {
    body: JSON.stringify(json),
  };
};
