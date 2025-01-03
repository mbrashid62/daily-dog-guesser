import { useContext, useState } from "react";
import { GoogleContext } from "../../../App";
import { Button } from "../../../toolbox/Button/Button";
import { Modal } from "../../../toolbox/Modal/Modal";
import "./AccountPage.css";

export const AcccountPage = () => {
  const { auth } = useContext(GoogleContext);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const providerData = auth.currentUser?.providerData[0];

  return (
    <div className="account-page-container">
      <h3>Account</h3>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div>Are you sure?</div>
      </Modal>
      <div className="account-page-container-section">
        <p>
          You are currently signed in through <b>{providerData?.providerId}</b>.
          You are able to delete your account at any point. If you delete your
          account you will lose your high scores for the game.
        </p>
        <div style={{ paddingTop: 32 }}>
          <Button
            label="Delete your account"
            onClick={() => {
              alert("this is under constructions");
              // if (!auth.currentUser) {
              //   // navigate("/");
              //   return;
              // }

              // try {
              //   await deleteUser(auth.currentUser);
              //   navigate("/");
              // } catch (error) {
              //   alert(`Uh Oh! ${error.message}`);
              // } finally {
              //   stopLoading();
              // }
            }}
          />
        </div>
      </div>
    </div>
  );
};
