import { format } from "date-fns";
import type { Event } from "nostr-tools";
import { ChangeEvent, useState } from "react";

import { useRegisteredUsers } from "../../hooks";
import { checkUsername, signEvent } from "../../utils";

import { ExtensionNotFound } from "./ExtensionNotFound";
import { LoginForm } from "./LoginForm";
import type { UserData } from "./LoginForm";
import { createPortal } from "react-dom";

type AccountViewProps = {
  host: string;
};

const USER_UPDATE_API_URL = "/api/user-update";

const updateUserData = async (signedEvent: Event) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signedEvent }),
  };
  const response = await fetch(USER_UPDATE_API_URL, options);
  const json = await response.json();
  return json;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "do 'of' MMMM',' yyyy");
  // const year = date.getFullYear();
  // const month = date.getMonth();
  // const day = date.getDay();
  // return `${year}-${month}-${day}`;
};

export const AccountView = ({ host }: AccountViewProps) => {
  const users = useRegisteredUsers();

  const extensionDetected = !!window.nostr;

  const [isAuthed, setIsAuthed] = useState(false);

  const [pubkey, setPubkey] = useState("");
  const [registedUsername, setRegisteredUsername] = useState("");
  const [username, setUsername] = useState("");
  const [registeredAt, setRegisteredAt] = useState("");
  const [lightningAddress, setLightningAddress] = useState("");

  const [formError, setFormError] = useState<boolean | string>(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const hasUsername = username.length > 0;

  const showFormResult = !!formError || !!formSubmitted;

  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const deletionConfirmText = `delete ${username}`;

  const checkDeletionConfirmed = (input: string) => {
    setDeleteInputValue(input);
    setDeleteButtonDisabled(input !== deletionConfirmText);
  };

  const handleInput = (
    field: "username" | "pubkey" | "lightningAddress",
    event: ChangeEvent<HTMLInputElement>
  ) => {
    // sanitize input
    const inputValue = event.target.value.toLowerCase();

    // update values
    if (field === "username") setUsername(inputValue);
    else if (field === "lightningAddress") {
      setLightningAddress(inputValue);
    }

    // check username
    const usernameError = checkUsername(
      field === "username" ? inputValue : username,
      users
    );

    if (usernameError && registedUsername !== inputValue) {
      setFormError(usernameError);
      return;
    }

    // hide error message if everything looks good
    setFormError(false);
  };

  const handleLogin = (response: {
    success: boolean;
    message?: string;
    data: UserData;
  }) => {
    const { success, message, data } = response;

    if (success) {
      setPubkey(data.pubkey);
      setUsername(data.username);
      setRegisteredUsername(data.username);
      setRegisteredAt(data.registeredAt);

      if (data.lightningAddress) {
        setLightningAddress(data.lightningAddress);
      }

      setIsAuthed(true);
    } else {
      // TODO show "user not found" in UI
      console.log("login failed", message);
    }
  };

  const handleSave = async () => {
    if (hasUsername) {
      const eventContent = JSON.stringify({ username, lightningAddress });
      const signedEvent = await signEvent(eventContent);

      if (signedEvent) {
        const userUpdateResponse = await updateUserData(signedEvent);

        console.log({ userUpdateResponse });

        if (userUpdateResponse.success) {
          setFormSubmitted(true);
        }
      }
    }
  };

  if (!extensionDetected) {
    return <ExtensionNotFound />;
  }

  if (!isAuthed) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <form className="box user-form">
        <div>
          <strong>Hello, {registedUsername}!</strong>

          <p>
            <small>
              <div className="muted">{pubkey}</div>

              {registeredAt && (
                <div className="registered-since">
                  Registered since {formatDate(registeredAt)}
                </div>
              )}
            </small>
          </p>
        </div>

        <div>Your username</div>

        <div className="address">
          <input
            type="text"
            placeholder="username"
            maxLength={64}
            value={username}
            onChange={(event) => handleInput("username", event)}
          />
          <label>
            <strong>@{host}</strong>
          </label>
        </div>

        <div>Your lightning address</div>
        <div>
          <small>
            <div>
              Enter your existing lightning address to enable redirection.
            </div>
            <div>
              You can then use your nostr address as your lightning address.
            </div>
            <div>Leave the field empty to disable this feature.</div>
          </small>
        </div>
        <div>
          <input
            type="text"
            placeholder="janedoe69@walletofsatoshi.com"
            maxLength={64}
            value={lightningAddress}
            onChange={(event) => handleInput("lightningAddress", event)}
          />
        </div>

        <div>
          <button
            type="button"
            disabled={!!formError || !hasUsername}
            onClick={handleSave}
          >
            save
          </button>
        </div>
      </form>

      {showFormResult && (
        <div className="box user-update-result">
          {formError && <div className="error">{formError}</div>}
          {formSubmitted && (
            <div className="registration-success">
              <p>
                <strong>Save successful!</strong>
              </p>
            </div>
          )}
        </div>
      )}

      <section className="box danger-zone">
        <div className="danger">DANGER ZONE</div>
        <p>Delete my account and all associated data.</p>
        <button onClick={() => setShowDeleteModal(true)}>DELETE</button>
      </section>

      {showDeleteModal &&
        createPortal(
          <div className="modal-wrapper">
            <div className="box modal-delete-account">
              <button
                className="secondary close"
                onClick={() => {
                  setDeleteButtonDisabled(true);
                  setDeleteInputValue("");
                  setShowDeleteModal(false);
                }}
              >
                &times;
              </button>

              <div className="danger">
                Warning! You are about to delete your account.
              </div>
              <p>
                When you proceed, all of your data will be deleted and you wil
                be redirected to the home page.
              </p>
              <p>Type "{deletionConfirmText}" to proceed.</p>
              <input
                type="text"
                value={deleteInputValue}
                onChange={(event) => checkDeletionConfirmed(event.target.value)}
              />
              <button
                className="delete"
                disabled={deleteButtonDisabled}
                onClick={() => {
                  console.log("delete account");
                }}
              >
                I understand, delete my account
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
