import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

import config from "../../../../site.config";

// Connection URL
const dbUrl = import.meta.env.MONGODB_URI;
const client = new MongoClient(dbUrl);
const { dbName, dbCollection } = config;

export const get: APIRoute = async function get({ params }) {
  const localUsername = params.username;

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);

  const findResult = await collection
    .find({ username: localUsername })
    .toArray();

  const { lightningAddress } = findResult?.[0] ?? {};

  if (!lightningAddress) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const [redirectUsername, redirectDomain] = lightningAddress.split("@");

  const response = await fetch(
    `https://${redirectDomain}/.well-known/lnurlp/${redirectUsername}`
  );
  const json = await response.json();

  return {
    body: JSON.stringify(json),
  };
};
