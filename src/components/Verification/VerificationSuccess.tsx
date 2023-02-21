type VerificationSuccessProps = {
  username: string;
  host: string;
};

export const VerificationSuccess = ({
  username,
  host,
}: VerificationSuccessProps) => {
  return (
    <div>
      <strong>Please read this carefully</strong>
      <br />
      Your request has been submitted, thank you!
      <br />
      Verification is currently a manual process and might take a while.
      <br />
      You will receive a notification on nostr when it is done.
      <br />
      <br />
      After receiving the notification:
      <br />
      <ol>
        <li>Edit your nostr profile</li>
        <li>
          Enter{" "}
          <strong>
            {username}@{host}
          </strong>{" "}
          into the NIP-05 identifier field
        </li>
        <li>Save your profile</li>
      </ol>
      Congratulations, you are verified!
      <img src="favicon.png" className="mini-badge" alt="verification badge" />
    </div>
  );
};
