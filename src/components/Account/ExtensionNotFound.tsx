export const ExtensionNotFound = () => (
  <section className="box">
    <div className="error">No NIP-07 compatible browser extension found.</div>
    <div>
      Please{" "}
      <a
        href="https://github.com/aljazceru/awesome-nostr#browser-extensions"
        target="_blank"
      >
        install your favourite one
      </a>{" "}
      and refresh this page.
    </div>
  </section>
);
