import { CopyWrapper } from "../CopyWrapper";

type VerificationSuccessProps = {
  username: string;
  host: string;
};

export const VerificationSuccess = ({
  username,
  host,
}: VerificationSuccessProps) => {
  const handle = `${username}@${host}`;

  return (
    <div className="verify-success">
      <p>
        <strong>Your verification was successful!</strong>
      </p>
      <p>
        This is your verification handle:
        <CopyWrapper text={handle}>
          <div className="box copy-box">
            <strong>{handle}</strong>
            <button>
              <img src="images/copy-icon.svg" />
            </button>
          </div>
        </CopyWrapper>
      </p>
      <p>
        Copy that handle into the{" "}
        <span className="text-gradient">NIP-05 identifier</span> field of your
        nostr profile and save.
        <br />
        Congratulations, you are verified!
        <img
          src="favicon.png"
          className="mini-badge"
          alt="verification badge"
        />
      </p>
    </div>
  );
};
