# nostr-address-provider

Web based [nostr](https://github.com/nostr-protocol/nostr) address ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) provider service.

Users can enter their exisiting lightning address when registering and then use their nostr address as lightning address.

## Tech

The project is a website built with [Astro](https://astro.build/).  
By default it is hosted on [Vercel](https://vercel.com/) and uses a [MongoDB](https://www.mongodb.com/) backend.  
Both Vercel & MongoDB offer free plans which should be sufficient to run this.  
You will still need a domain name if you want to offer this service on a TLD, though.

## Setup

### Prerequisites

1. Fork this repository

### Vercel

1. Sign up or login with Vercel and add the forked repo as a project.
2. Go to `Settings -> Domains` and set up your domain name with Vercel
3. Go to `Settings -> Integrations`  
   Add the `MongoDB Atlas` integration on Vercel and create your cluster (see `MongoDB` below)
4. Go to `Settings -> Environment Variables` and check if the `MONGODB_URI` has been added. This variable is needed to connect to the database.

### MongoDB

1.  When asked `Where would you like to connect from?` during setup, choose `Cloud Environment`, then `IP Access List` and add `0.0.0.0/0` to allow access from everywhere.

2.  Select your cluster, open the tab `Collections` and choose `Add My Own Data`.
    Enter `users` as database name, `registered` as collection name and create the database.  
    If you want to choose different names, you can do so. In this case, update the corresponding values in `site.config.ts` (see `Final touches` below).

### Final touches

1. Edit `site.config.ts` and set your domain, slogan and donation LNURL
2. Commit & push
3. Watch Vercel doing magic (don't blink, they are fast)
4. Enjoy your new nostr address service
5. Announce it on nostr!

### Tools

Basic tools for importing and exporting are included.  
[Check the README](https://github.com/jigglycrumb/nostr-verify/blob/main/src/pages/_tools/README.md) for more information.

## Development

Everything is by Astro standards.

To run the page locally, you'll have to create a file called `.env` in the project root and add your MongoDB connection string:

`MONGODB_URI="mongodb+srv://<your connection link>"`

You can get your connection link from MongoDB and/or Vercel.

To start the local server, run:

    node run dev

For more, check the Astro docs.

## Credits

- Copy to clipboard hook by [usehooks-ts.com](https://usehooks-ts.com/react-hook/use-copy-to-clipboard)
- Copy icon by [online web fonts](http://www.onlinewebfonts.com), licensed by CC BY 3.0
