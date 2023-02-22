type VerificationSuccessProps = {
  username: string;
  host: string;
};

export const VerificationSuccess = ({
  username,
  host,
}: VerificationSuccessProps) => {
  return (
    <div className="verify-success">
      <strong>Your verification was successful!</strong>
      <br />
      Next steps:
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
