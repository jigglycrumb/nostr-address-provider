export const ExtensionDetected = ({
  onAccept,
  onReject,
}: {
  onAccept: VoidFunction;
  onReject: VoidFunction;
}) => {
  return (
    <div className="box nip07-extension">
      Compatible extension detected. Fill in public key?
      <button onClick={onAccept}>Yes</button>
      <button className="secondary" onClick={onReject}>
        No
      </button>
    </div>
  );
};
