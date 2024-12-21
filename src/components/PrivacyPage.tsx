import { useContext, useState } from "react";
import { GoogleContext } from "../App";
import { Button } from "../toolbox/Button/Button";
import { Modal } from "../toolbox/Modal/Modal";
import { deleteUser } from "firebase/auth";
import { useLoading } from "./Spinner/useLoading";
import { useNavigate } from "react-router-dom";

export const PrivacyPage = () => {
  const { auth } = useContext(GoogleContext);
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  navigate("/");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const providerData = auth.currentUser?.providerData[0];

  return (
    <div className="privacy-page-container">
      <h3>Privacy</h3>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div>Are you sure?</div>
      </Modal>
      <div className="privacy-page-container-section">
        <p>
          This game does not collect your personal data and never will. We have
          access to basic profile information from the provider through which
          you logged in with.
        </p>
        <p>
          You are currently signed in through <b>{providerData?.providerId}</b>.
          You are able to delete your account at any point.
        </p>
        <Button
          label="Delete your account"
          onClick={async () => {
            if (!auth.currentUser) {
              // navigate("/");
              return;
            }

            try {
              await deleteUser(auth.currentUser);
              navigate("/");
            } catch (error) {
              alert(`Uh Oh! ${error.message}`);
            } finally {
              stopLoading();
            }
          }}
        />
      </div>
    </div>
  );
};
