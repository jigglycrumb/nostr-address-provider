/// <reference types="astro/client" />

import { EventTemplate, Event } from "nostr-tools";

declare global {
  interface Window {
    nostr: Nostr;
  }
}

type Nostr = {
  getPublicKey(): Promise<string>;
  signEvent(event: EventTemplate): Promise<Event>;
};
