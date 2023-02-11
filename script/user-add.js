import fs from "fs";
import nostr from "../public/.well-known/nostr.json" assert { type: "json" };

const [_node, _filePath, username, pubkey] = process.argv;

if (!username || !pubkey) {
  console.log("Usage: node script/user-add.js <username> <pubkey>");
  process.exit(1);
}

console.log("--------------------------------");
console.log("Verifying new user");
console.log("Username:", username);
console.log("Pubkey:", pubkey);
console.log("--------------------------------");

const users = nostr.names;

if (users[username]) {
  console.log("This username already exists, exiting...");
  process.exit(1);
}

if (Object.values(users).includes(pubkey)) {
  console.log("This pubkey already exists, exiting...");
  process.exit(1);
}

let newUsers = { ...users };

// add user
newUsers[username] = pubkey;

// sort users alphabetically
newUsers = Object.fromEntries(Object.entries(newUsers).sort());

const json = JSON.stringify({ names: newUsers }, null, 2);

fs.writeFileSync("public/.well-known/nostr.json", json, { flag: "w+" });

console.log(`Added ${username}@nostr.industries`);

process.exit(0);
