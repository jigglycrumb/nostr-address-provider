import { ChangeEvent, useEffect, useState } from "react";
import { loadUsers } from "../../utils";
import { VerificationSuccess } from "./VerificationSuccess";

type VerificationFormProps = {
  disabled: boolean;
  host: string;
};

type UserDict = Record<string, string>;

const submitForm = async (username: string, pubkey: string) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, pubkey }),
  };
  const response = await fetch("/verify", options);
  const json = await response.json();
  return json;
};

export const VerificationForm = ({ disabled, host }: VerificationFormProps) => {
  const [users, setUsers] = useState<boolean | UserDict>(false);
  const [username, setUsername] = useState("");
  const [pubkey, setPubkey] = useState("");

  const [formError, setFormError] = useState<boolean | string>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    loadUsers().then(users => {
      setUsers(users);
    });
  }, []);

  const formDisabled = !users || disabled;
  const hasUsername = username.length > 0;
  const hasPubkey = pubkey.length > 0;

  const showFormResult = !!formError || !!formSubmitted;

  const checkUsername = (username: string) => {
    if (username.length === 0) {
      setFormError(false);
      return;
    }

    const usernameFormat = /^[0-9a-z-_\.]{1,64}$/g;
    const isUsernameValid = usernameFormat.test(username);

    if (!isUsernameValid) {
      setFormError(
        "The username can only contain lowercase letters, numbers, _, - and ."
      );
    } else if ((users as UserDict)[username]) {
      setFormError("Sorry, this username is already taken.");
    } else {
      setFormError(false);
    }
  };

  const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const newUsername = event.target.value.toLowerCase();

    if (newUsername.length === 0) {
      setFormError(false);
      checkPubkey(pubkey);
    } else {
      checkUsername(newUsername);
    }

    setUsername(newUsername);
  };

  const checkPubkey = (pubkey: string) => {
    if (pubkey.length === 0) {
      setFormError(false);
      return;
    }

    const pubkeyFormat = /^[0-9a-f]{1,64}$/g;
    const isPubkeyValid = pubkeyFormat.test(pubkey);

    if (!isPubkeyValid) {
      setFormError("Please enter the HEX version of your public key.");
    } else if (pubkey.length !== 64) {
      setFormError("Your public key should be 64 characters long.");
    } else if (Object.values(users).includes(pubkey)) {
      setFormError("Sorry, this pubkey is already taken.");
    } else {
      setFormError(false);
    }
  };

  const handlePubkey = (event: ChangeEvent<HTMLInputElement>) => {
    const newPubkey = event.target.value.toLowerCase();

    if (newPubkey.length === 0) {
      setFormError(false);
      checkUsername(username);
    } else {
      checkPubkey(newPubkey);
    }

    setPubkey(newPubkey);
  };

  const handleVerification = () => {
    if (hasUsername && hasPubkey) {
      submitForm(username, pubkey).then(response => {
        if (response.success) {
          setUsername("");
          setPubkey("");
          setFormSubmitted(true);
        }
      });
    }
  };

  return (
    <>
      <form className="box verify-form">
        <div>
          <input
            type="text"
            placeholder="your-name"
            maxLength={64}
            disabled={formDisabled}
            value={username}
            onChange={handleUsername}
          />
          <label htmlFor="username">
            <strong>@{host}</strong>
          </label>
        </div>

        <div>
          <input
            type="text"
            placeholder="your public key in HEX format*"
            maxLength={64}
            disabled={formDisabled}
            value={pubkey}
            onChange={handlePubkey}
          />
          <button
            type="button"
            disabled={formDisabled || !!formError || !hasUsername || !hasPubkey}
            onClick={handleVerification}
          >
            verify
          </button>
        </div>
      </form>

      {showFormResult && (
        <div className="box verify-result">
          {formError && <div className="error">{formError}</div>}
          {formSubmitted && (
            <VerificationSuccess username={username} host={host} />
          )}
        </div>
      )}
    </>
  );
};
