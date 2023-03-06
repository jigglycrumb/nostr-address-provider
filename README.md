# nostr-verify

A [NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md) verification service for [nostr](https://github.com/nostr-protocol/nostr).

## Overview

The project is a website built with [Astro](https://astro.build/).  
The default setup is hosted on [Vercel](https://vercel.com/) and uses a [MongoDB](https://www.mongodb.com/) backend.  
Both Vercel & MongoDB offer free plans which should be sufficient to run this.  
You will still need a domain name if you want to offer this service on a TLD, though.

## Setup

1. Fork this repository
2. Sign up or login with Vercel and add the forked repo as a project.
3. Set up your domain name with Vercel
4. Add the MongoDB integration on Vercel and create your database  
   Note: You might have to change your access control list and add 0.0.0.0/24 to allow access
5. In your forked repository, create a file called `.env` with the following content:
   `MONGODB_URI="mongodb+srv://<your connection link>"`  
   (you get your connection link from MongoDB and/or Vercel)
6. Edit `site.config.js` and set your domain, monthly costs and donation LNURL
7. Commit & push
8. Watch Vercel doing magic (don't blink, they are fast)
9. Enjoy your new self-hosted NIP-05 verification service
10. Announce it on nostr!

## Development

Everything is by Astro standards.

To run locally:

    node run dev

For more, check the Astro docs.

## Credits

- Copy to clipboard hook by [usehooks-ts.com](https://usehooks-ts.com/react-hook/use-copy-to-clipboard)
- Copy icon by [online web fonts](http://www.onlinewebfonts.com), licensed by CC BY 3.0

## Reaching out

If you have questions, comments, complaints, etc hit me up on nostr:

    npub1g9k2rya223yt3n9p7zty9qrhvhxqac5evz0ewt0sv9x0hr4z72csd8sezh
