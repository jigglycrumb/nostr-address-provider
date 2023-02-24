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
  const [submittedUsername, setSubmittedUsername] = useState("");

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
      return false;
    }

    const usernameFormat = /^[0-9a-z-_\.]{1,64}$/g;
    const isUsernameValid = usernameFormat.test(username);

    if (!isUsernameValid) {
      return "The username can only contain lowercase letters, numbers, _, - and .";
    } else if ((users as UserDict)[username]) {
      return "Sorry, this username is already taken.";
    } else {
      return false;
    }
  };

  const checkPubkey = (pubkey: string) => {
    if (pubkey.length === 0) {
      return false;
    }

    const pubkeyFormat = /^[0-9a-f]{1,64}$/g;
    const isPubkeyValid = pubkeyFormat.test(pubkey);

    if (!isPubkeyValid) {
      return "Please enter the HEX version of your public key.";
    } else if (pubkey.length !== 64) {
      return "Your public key should be 64 characters long.";
    } else if (Object.values(users).includes(pubkey)) {
      return "Sorry, this pubkey is already taken.";
    } else {
      return false;
    }
  };

  const handleInput = (
    field: "username" | "pubkey",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value.toLowerCase();

    // update values
    if (field === "username") setUsername(inputValue);
    else if (field === "pubkey") setPubkey(inputValue);

    // check username
    const usernameError = checkUsername(
      field === "username" ? inputValue : username
    );
    if (usernameError) {
      setFormError(usernameError);
      return;
    }

    // check pubkey
    const pubkeyError = checkPubkey(field === "pubkey" ? inputValue : pubkey);
    if (pubkeyError) {
      setFormError(pubkeyError);
      return;
    }

    // hide error message if everything looks good
    setFormError(false);
  };

  const handleVerification = () => {
    if (hasUsername && hasPubkey) {
      submitForm(username, pubkey).then(response => {
        if (response.success) {
          setSubmittedUsername(username);
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
            disabled={formDisabled || formSubmitted}
            value={username}
            onChange={event => handleInput("username", event)}
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
            disabled={formDisabled || formSubmitted}
            value={pubkey}
            onChange={event => handleInput("pubkey", event)}
          />
          <button
            type="button"
            disabled={
              formDisabled ||
              formSubmitted ||
              !!formError ||
              !hasUsername ||
              !hasPubkey
            }
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
            <VerificationSuccess username={submittedUsername} host={host} />
          )}
        </div>
      )}
    </>
  );
};
