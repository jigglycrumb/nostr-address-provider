const defaultContent =
  "Please sign this event to verify ownership of your public key";

export const signEvent = async (content = defaultContent) => {
  if (!window.nostr) {
    console.error("Cannot sign event: No NIP-07 compatible extension found");
    return false;
  }

  const nostrEvent = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content,
  };

  return await window.nostr.signEvent(nostrEvent);
};
