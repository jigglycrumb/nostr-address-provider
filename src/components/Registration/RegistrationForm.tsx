import { nip19 } from "nostr-tools";
import { ChangeEvent, useEffect, useState } from "react";

import { loadUsers } from "../../utils";
import { Toggle } from "../Toggle";

import { ExtensionDetected } from "./ExtensionDetected";
import { RegistrationSuccess } from "./RegistrationSuccess";

type RegistrationFormProps = {
  disabled: boolean;
  host: string;
};

type UserDict = Record<string, string>;

const isNpub = (value: string) => value.startsWith("npub");

const convertNpubToHex = (npub: string) => {
  try {
    const hexKeyObj = nip19.decode(npub);
    return hexKeyObj.data as string;
  } catch (error) {
    return false;
  }
};

const submitForm = async (
  username: string,
  pubkey: string,
  lightningAddress: string
) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, pubkey, lightningAddress }),
  };
  const response = await fetch("/register", options);
  const json = await response.json();
  return json;
};

export const RegistrationForm = ({ disabled, host }: RegistrationFormProps) => {
  const [users, setUsers] = useState<boolean | UserDict>(false);
  const [username, setUsername] = useState("");

  const [pubkey, setPubkey] = useState("");
  const [pubkeyHex, setPubkeyHex] = useState("");

  const [lightningAddress, setLightningAddress] = useState("");
  const [lightningAddressVisible, setLightningAddressVisible] = useState(false);

  const [formError, setFormError] = useState<boolean | string>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedUsername, setSubmittedUsername] = useState("");

  const [extensionBoxVisible, setExtensionBoxVisible] = useState(
    !!window.nostr
  );

  // initially load users
  useEffect(() => {
    loadUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  const formDisabled = !users || disabled;
  const hasUsername = username.length > 0;
  const hasPubkey = pubkeyHex.length > 0;

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

    const pubkeyFormatNpub = /^npub[0-3][qpzry9x8gf2tvdw0s3jn54khce6mua7l]+/;
    const pubkeyFormatHex = /^[0-9a-f]{64}$/g;

    if (isNpub(pubkey)) {
      const isPubkeyValidNpub = pubkeyFormatNpub.test(pubkey);

      if (!isPubkeyValidNpub) {
        return "Invalid npub public key.";
      } else {
        const hexKey = convertNpubToHex(pubkey);

        if (!hexKey) {
          return "Invalid npub public key.";
        } else if (Object.values(users).includes(hexKey)) {
          return "Sorry, this pubkey is already taken.";
        }

        return false;
      }
    } else {
      const isPubkeyValidHex = pubkeyFormatHex.test(pubkey);

      if (!isPubkeyValidHex) {
        return "Invalid public key.";
      } else if (Object.values(users).includes(pubkey)) {
        return "Sorry, this pubkey is already taken.";
      }

      return false;
    }
  };

  const handleInput = (
    field: "username" | "pubkey" | "lightningAddress",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // sanitize input
    const inputValue = event.target.value.toLowerCase();

    // update values
    if (field === "username") setUsername(inputValue);
    else if (field === "pubkey") setPubkey(inputValue);
    else if (field === "lightningAddress") {
      setLightningAddress(inputValue);
    }

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
    // if there is no error, we set the pubkeyHex
    else {
      if (isNpub(inputValue)) {
        try {
          const hexKeyObj = nip19.decode(pubkey);
          const hexKey = hexKeyObj.data as string;
          setPubkeyHex(hexKey);
        } catch (error) {
          setFormError("Invalid npub public key.");
        }
      } else {
        setPubkeyHex(inputValue);
      }
    }

    // hide error message if everything looks good
    setFormError(false);
  };

  const handleRegistration = () => {
    if (hasUsername && hasPubkey) {
      submitForm(username, pubkeyHex, lightningAddress).then((response) => {
        if (response.success) {
          setSubmittedUsername(username);
          setUsername("");
          setPubkey("");
          setLightningAddress("");
          setFormSubmitted(true);
        }
      });
    }
  };

  return (
    <>
      {extensionBoxVisible && (
        <ExtensionDetected
          onAccept={() => {
            window.nostr.getPublicKey().then((hexKey: string) => {
              setPubkey(hexKey);
              setPubkeyHex(hexKey);
              setExtensionBoxVisible(false);
            });
          }}
          onReject={() => {
            setExtensionBoxVisible(false);
          }}
        />
      )}
      <form className="box registration-form">
        <div>
          <input
            type="text"
            placeholder="public key"
            maxLength={64}
            disabled={formDisabled || formSubmitted}
            value={pubkey}
            onChange={(event) => handleInput("pubkey", event)}
          />
        </div>

        <div className="address">
          <input
            type="text"
            placeholder="username"
            maxLength={64}
            disabled={formDisabled || formSubmitted}
            value={username}
            onChange={(event) => handleInput("username", event)}
          />
          <label>
            <strong>@{host}</strong>
          </label>
        </div>

        <div>
          <Toggle
            id="lightning-address-redirect"
            label="use as lightning address"
            isOn={lightningAddressVisible}
            onChange={(event) =>
              setLightningAddressVisible(event.target.checked)
            }
          />
        </div>

        {lightningAddressVisible && (
          <>
            <div>
              <small>
                Enter your existing lightning address to enable redirection.{" "}
                <br />
                You can then use you nostr address as your lightning address.
              </small>
            </div>
            <div>
              <input
                type="text"
                placeholder="janedoe69@walletofsatoshi.com"
                maxLength={64}
                disabled={formDisabled || formSubmitted}
                value={lightningAddress}
                onChange={(event) => handleInput("lightningAddress", event)}
              />
            </div>
          </>
        )}

        <div>
          <button
            type="button"
            disabled={
              formDisabled ||
              formSubmitted ||
              !!formError ||
              !hasUsername ||
              !hasPubkey
            }
            onClick={handleRegistration}
          >
            register
          </button>
        </div>
      </form>

      {showFormResult && (
        <div className="box registration-result">
          {formError && <div className="error">{formError}</div>}
          {formSubmitted && (
            <RegistrationSuccess username={submittedUsername} host={host} />
          )}
        </div>
      )}
    </>
  );
};
