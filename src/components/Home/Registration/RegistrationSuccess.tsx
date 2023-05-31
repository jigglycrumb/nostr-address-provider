import { CopyWrapper } from "../CopyWrapper";

type RegistrationSuccessProps = {
  username: string;
  host: string;
};

export const RegistrationSuccess = ({
  username,
  host,
}: RegistrationSuccessProps) => {
  const address = `${username}@${host}`;

  return (
    <div className="registration-success">
      <p>
        <strong>Your registration was successful!</strong>
      </p>
      <div>
        This is your nostr address:
        <CopyWrapper text={address} className="nip-05">
          <div className="box copy-box">
            <strong>{address}</strong>
            <button>
              <img src="images/copy-icon.svg" />
            </button>
          </div>
        </CopyWrapper>
      </div>
      <p>
        Copy that address into the <span className="text-gradient">NIP-05</span>{" "}
        field of your nostr profile and save.
      </p>
    </div>
  );
};
