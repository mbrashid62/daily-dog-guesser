import { useContext, useState } from "react";
import { GoogleContext } from "../../../App";
import { Button } from "../../../toolbox/Button/Button";
import { Modal } from "../../../toolbox/Modal/Modal";
import "./AccountPage.css";
import { useToast } from "../../Toast/ToastProvider";
import { useFirestore } from "../../../FireStoreProvider";
import { useLoading } from "../../Spinner/useLoading";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Flex } from "../../../toolbox/Flex/Flex";

export const AccountPage = () => {
  const { auth } = useContext(GoogleContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { showToast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const { deleteUserDoc } = useFirestore();

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) {
      showToast("You must be logged in to delete your account.", "error");
      return;
    }

    try {
      startLoading();

      // Get current user
      const user = auth.currentUser;

      // Determine authentication provider
      let credential;
      if (user.providerData[0].providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        credential = GoogleAuthProvider.credentialFromResult(
          await signInWithPopup(auth, provider),
        );
      } else {
        throw new Error(
          "Unexpected auth provider found when attempting to reauthenticate.",
        );
      }

      // Reauthenticate the user
      if (credential) {
        await reauthenticateWithCredential(user, credential);
      }

      // Delete Firestore document
      await deleteUserDoc(user.uid);

      // Delete Firebase user
      await deleteUser(user);

      showToast("Success! Your account has been deleted.", "success");
      navigate("/");
      location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(`Error deleting account`, "error");
    } finally {
      stopLoading();
      setShowDeleteModal(false); // Close modal after deletion attempt
    }
  };

  return (
    <div className="account-page-container">
      <h3>Account</h3>

      {/* Modal for account deletion confirmation */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Flex
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
        >
          <h3>Are you sure?</h3>
          <p>
            If you disconnect your account,
            <b>
              {" "}
              you will lose all of your game data, including your high scores.
            </b>{" "}
            You can always play again anonymously or sign back in with Google in
            the future.
          </p>
          <div style={{ display: "flex", columnGap: 16, paddingTop: 16 }}>
            <Button label="Cancel" onClick={() => setShowDeleteModal(false)} />
            <Button label="Yes, I'm sure" onClick={handleDeleteAccount} />
          </div>
        </Flex>
      </Modal>

      <div className="account-page-container-section">
        <p>
          This game uses Google to authenticate you as a user. From Google, we
          read basic profile information like your name and profile photo. If
          you wish to disconnect your Google account, you can do so at any point
          by clicking the button below.
        </p>
        <div style={{ paddingTop: 32 }}>
          <Button
            label="Disconnect your account"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>
    </div>
  );
};
