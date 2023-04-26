import { CopyWrapper } from "../CopyWrapper";

type RegistrationSuccessProps = {
  username: string;
  host: string;
};

export const RegistrationSuccess = ({
  username,
  host,
}: RegistrationSuccessProps) => {
  const handle = `${username}@${host}`;

  return (
    <div className="registration-success">
      <p>
        <strong>Your registration was successful!</strong>
      </p>
      <p>
        This is your NIP-05 handle:
        <CopyWrapper text={handle} className="nip-05">
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
      </p>
    </div>
  );
};
