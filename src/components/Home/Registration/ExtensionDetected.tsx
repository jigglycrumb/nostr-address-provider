export const ExtensionDetected = ({
  onAccept,
  onReject,
  disabled,
}: {
  onAccept: VoidFunction;
  onReject: VoidFunction;
  disabled: boolean;
}) => {
  return (
    <div className="box nip07-extension">
      Compatible browser extension detected.
      <br />
      Fill in public key?
      <button disabled={disabled} onClick={onAccept}>
        Yes
      </button>
      <button disabled={disabled} className="secondary" onClick={onReject}>
        No
      </button>
    </div>
  );
};
