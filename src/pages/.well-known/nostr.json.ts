import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

import config from "../../../site.config";

// Connection URL
const dbUrl = import.meta.env.MONGODB_URI;
const client = new MongoClient(dbUrl);
const { dbName, dbCollection } = config;

export const get: APIRoute = async function get({ request }) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);

  const params = new URL(request.url).searchParams;
  const searchUser = params.get("name");

  const queryParams = searchUser ? { username: searchUser } : {};

  const findResult = await collection.find(queryParams).toArray();
  const userMap: Record<string, string> = {};

  findResult.forEach((entry) => {
    userMap[entry.username] = entry.pubkey;
  });

  const json = {
    names: Object.fromEntries(Object.entries(userMap).sort()),
  };

  client.close();

  return {
    body: JSON.stringify(json),
  };
};
