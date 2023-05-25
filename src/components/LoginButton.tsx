import { validateEvent, verifySignature } from "nostr-tools";

// const getPubKey = async () => {
//   return await window.nostr.getPublicKey();
// };

const signEvent = async () => {
  const nostrEvent = {
    kind: 1,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: "Sign this event to verify ownership of your public key",
  };
  return await window.nostr.signEvent(nostrEvent);
};

export const LoginButton = () => {
  const extensionDetected = !!window.nostr;

  const handleClick = async () => {
    if (extensionDetected) {
      // const pubkey = await getPubKey();
      // console.log(pubkey);

      const signedEvent = await signEvent();
      console.log(signedEvent);

      // signedEvent.sig =
      //   "e6273cf281a8f299d2a71b541005febf0e4f79b6e15034bd3e644bf8a7aabe76c1894d7450763a38e005006d3a3daba9aa06035ff3ff37398c8fa8f813cd0e8b";

      const eventOk = validateEvent(signedEvent);
      const signatureOk = verifySignature(signedEvent);

      console.log({
        eventOk,
        signatureOk,
      });
    }
  };

  return <button onClick={handleClick}>Login</button>;
};
