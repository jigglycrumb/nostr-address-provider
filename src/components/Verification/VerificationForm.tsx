import { ChangeEvent, useEffect, useState } from "react";
import { loadUsers } from "../../utils";

import styles from "./VerificationStyles.css";

type VerificationFormProps = {
  disabled: boolean;
  host: string;
};

type UserDict = Record<string, string>;

export const VerificationForm = ({ disabled, host }: VerificationFormProps) => {
  const [users, setUsers] = useState<boolean | UserDict>(false);
  const [username, setUsername] = useState("");
  const [pubkey, setPubkey] = useState("");

  const [formError, setFormError] = useState<boolean | string>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    loadUsers(host).then(users => {
      setUsers(users);
    });
  }, []);

  const formDisabled = !users || disabled;
  const hasUsername = username.length > 0;
  const hasPubkey = pubkey.length > 0;

  // console.log("VerificationForm", users, formDisabled);

  const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
    // todo
    const username = event.target.value;
    setUsername(username);

    const usernameFormat = /[0-9a-z]{1,64}/i;
    // const usernameFormat = new RegExp("[0-9a-z]{1,64}", "gi");
    const isUsernameValid = usernameFormat.test(username);

    console.log("username", username, isUsernameValid, users as UserDict);

    if (!isUsernameValid) {
      setFormError("The username can only contain letters, numbers, _ and -");
      // return;
    } else if ((users as UserDict)[username]) {
      setFormError("Sorry, this username is already taken.");
      // return;
    } else {
      setFormError(false);
    }
  };

  const handlePubkey = (event: ChangeEvent<HTMLInputElement>) => {
    // todo
    const pubkey = event.target.value;
    setPubkey(pubkey);

    const hexKeyRegex = /[0-9a-f]{1,64}/i;
    const pubkeyIsHex = hexKeyRegex.test(pubkey);

    console.log("pubkey", pubkey, pubkeyIsHex);

    if (!pubkeyIsHex) {
      setFormError("Please enter the HEX version of your public key.");
      // return;
    } else if (Object.values(users).includes(pubkey)) {
      setFormError("Sorry, this pubkey is already taken.");
      // return;
    }
    // else {
    //   setFormError(false);
    // }
  };

  const handleVerification = () => {
    // todo
    console.log("YOYOYO");

    const hexKeyRegex = /[0-9A-Fa-f]{64}/g;
    const pubkeyIsHex = pubkey.match(hexKeyRegex);

    setFormSubmitted(true);
  };

  return (
    <>
      <form className="verify-form">
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
            <strong>@nostr.industries</strong>
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
            disabled={formDisabled || !hasUsername || !hasPubkey}
            onClick={handleVerification}
          >
            verify
          </button>
        </div>
      </form>

      <div className="verify-result">
        {formError && <div id="verify-error">{formError}</div>}

        {formSubmitted && (
          <div id="verify-success">
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
                Enter <strong id="success-username">username@{host}</strong>
                into the NIP-05 identifier field
              </li>
              <li>Save your profile</li>
            </ol>
            Congratulations, you are verified!
            <img
              src="favicon.png"
              className="mini-badge"
              alt="verification badge"
            />
          </div>
        )}
      </div>
    </>
  );
};
