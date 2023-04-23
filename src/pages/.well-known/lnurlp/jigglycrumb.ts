import type { APIRoute } from "astro";

const json = {
  callback:
    "https://livingroomofsatoshi.com/api/v1/lnurl/payreq/4bd8855a-ab84-45a5-9a0e-de094b7ee3c2",
  maxSendable: 100000000000,
  minSendable: 1000,
  metadata:
    '[["text/plain","Pay to Wallet of Satoshi user: ghastlymass71"],["text/identifier","ghastlymass71@walletofsatoshi.com"]]',
  commentAllowed: 32,
  tag: "payRequest",
  allowsNostr: true,
  nostrPubkey:
    "be1d89794bf92de5dd64c1e60f6a2c70c140abac9932418fee30c5c637fe9479",
};

export const get: APIRoute = async function get() {
  return {
    body: JSON.stringify(json),
  };
};
