import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

import config from "../../../site.config";

// Connection URL
const dbUrl = import.meta.env.MONGODB_URI;
const client = new MongoClient(dbUrl);
const { dbName, dbCollection } = config;

export const post: APIRoute = async function post({ request }) {
  if (request.headers.get("Content-Type") === "application/json") {
    let hasError = false;
    const body = await request.json();
    const { username, pubkey, lightningAddress } = body;

    const usernameFormat = /^[0-9a-z-_\.]{1,64}$/g;
    const isUsernameValid = usernameFormat.test(username);

    const pubkeyFormat = /^[0-9a-f]{1,64}$/g;
    const isPubkeyValid = pubkeyFormat.test(pubkey);

    // stop here if username or pubkey are invalid
    if (!isUsernameValid || !isPubkeyValid) {
      hasError = true;
    }

    // Use connect method to connect to the server
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(dbCollection);

    // find by username
    const existingUsers = await collection.find({ username }).toArray();
    // stop here if username exists
    if (existingUsers.length > 0) {
      hasError = true;
    }

    // find by pubkey
    const existingPubkeys = await collection.find({ pubkey }).toArray();
    // stop here if username exists
    if (existingPubkeys.length > 0) {
      hasError = true;
    }

    if (!hasError) {
      const registeredAt = new Date().toISOString();
      await collection.insertOne({
        username,
        pubkey,
        lightningAddress,
        registeredAt,
      });
    }

    client.close();

    return new Response(
      JSON.stringify({
        success: !hasError,
      }),
      {
        status: hasError ? 400 : 200,
      }
    );
  }

  return new Response(null, { status: 400 });
};
