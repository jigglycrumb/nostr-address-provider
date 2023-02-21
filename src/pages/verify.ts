import type { APIRoute } from "astro";
import { MongoClient } from "mongodb";

// Connection URL
const url = import.meta.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = "verification";
const dbCollection = "names";

// import fs from "fs";
// import nostr from "../data/nostr.json" assert { type: "json" };

// type NostrData = {
//   names: Record<string, string>;
// };

export const get: APIRoute = async function get({ params, request }) {
  // console.log({ request, params });

  // console.log(nostr);

  // console.log("db uri", import.meta.env.MONGODB_URI);
  // console.log("client", client);

  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(dbCollection);

  // log all
  const findResult = await collection.find({}).toArray();
  console.log("Found documents =>", findResult);

  // find by username
  const filteredDocs = await collection
    .find({ username: "jigglycrumb" })
    .toArray();
  console.log("Found documents filtered =>", filteredDocs);

  // console.log("collection", collection);
  // the following code examples can be pasted here...

  // return "done.";

  return new Response(
    JSON.stringify({
      name: "Astro",
      url: "https://astro.build/",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const post: APIRoute = async function post({ request }) {
  // console.log(request);

  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const { username, pubkey } = body;

    const usernameFormat = /^[0-9a-z-_\.]{1,64}$/g;
    const isUsernameValid = usernameFormat.test(username);

    const pubkeyFormat = /^[0-9a-f]{1,64}$/g;
    const isPubkeyValid = pubkeyFormat.test(pubkey);

    // stop here if username or pubkey are invalid
    if (!isUsernameValid || !isPubkeyValid) {
      return new Response(
        JSON.stringify({
          success: false,
        }),
        {
          status: 400,
        }
      );
    }

    // const users = (nostr as NostrData).names;

    // console.log("users", users);

    // stop here if username or pubkey already exist
    // if (users[username] || Object.values(users).includes(pubkey)) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //     }),
    //     {
    //       status: 400,
    //     }
    //   );
    // }

    console.log("yo", { username, pubkey });
    // return new Response(
    //   JSON.stringify({
    //     success: false,
    //   }),
    //   {
    //     status: 400,
    //   }
    // );

    // let newUsers = { ...users };

    // add user
    // newUsers[username] = pubkey;

    // sort users alphabetically
    // newUsers = Object.fromEntries(Object.entries(newUsers).sort());

    // const json = JSON.stringify({ names: newUsers }, null, 2);

    // fs.writeFileSync("../data/nostr.json", json, { flag: "w+" });

    // fs.writeFile(".well-known/nostr.json", json, { flag: "w+" }, err => {
    //   if (err) console.log(err);
    //   else {
    //     console.log("File written successfully\n");
    //     console.log("The written has the following contents:");
    //   }
    // });

    // console.log(`Added ${username}@nostr.industries`);

    // console.log(json);

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
      }
    );
  }

  return new Response(null, { status: 400 });
};
