import { useState } from "react";
import { createPortal } from "react-dom";

export const DangerZone = ({ username }: { username: string }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const deletionConfirmText = `delete ${username}`;

  const checkDeletionConfirmed = (input: string) => {
    setDeleteInputValue(input);
    setDeleteButtonDisabled(input !== deletionConfirmText);
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
              />
              <button
                className="delete"
                disabled={deleteButtonDisabled}
                onClick={() => {
                  // TODO
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
