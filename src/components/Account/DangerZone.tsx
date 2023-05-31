import type { Event as NostrEvent } from "nostr-tools";
import { useState } from "react";
import { createPortal } from "react-dom";

import { signEvent } from "../../utils";

const USER_DELETE_API_URL = "/api/user-delete";

const deleteUser = async (signedEvent: NostrEvent) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ signedEvent }),
  };
  const response = await fetch(USER_DELETE_API_URL, options);
  const json = await response.json();
  return json;
};

export const DangerZone = ({ username }: { username: string }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const deletionConfirmText = `delete ${username}`;

  const checkDeletionConfirmed = (input: string) => {
    setDeleteInputValue(input);
    setDeleteButtonDisabled(input !== deletionConfirmText);
    return input === deletionConfirmText;
  };

  const handleDelete = async () => {
    if (checkDeletionConfirmed(deleteInputValue)) {
      const signedEvent = await signEvent("Delete my account");

      if (signedEvent) {
        const userUpdateResponse = await deleteUser(signedEvent);

        if (userUpdateResponse.success) {
          document.location.href = "/";
        }
      }
    }
  };

  return (
    <>
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
              <p>
                Type "<strong>{deletionConfirmText}</strong>" to proceed.
              </p>
              <input
                type="text"
                value={deleteInputValue}
                onChange={(event) => checkDeletionConfirmed(event.target.value)}
                autoFocus
              />
              <button
                className="delete"
                disabled={deleteButtonDisabled}
                onClick={handleDelete}
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
