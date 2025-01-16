import React, { useState, useContext } from "react";
import {
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from "firebase/auth";
import { GoogleContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import { useLoading } from "../Spinner/useLoading";
import { useToast } from "../Toast/ToastProvider";
import "./TopNavigation.css";
import { HelpLinkItem } from "./HelpLinkItem";
import { MenuPopover } from "./MenuPopover";
import { GoBackNavLinkItem } from "./GoBackNavLinkItem";

// TODO: Should this be moved to Context?
const provider = new GoogleAuthProvider();

export const TopNavigation: React.FC = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const { auth } = useContext(GoogleContext);

  const location = useLocation();

  const { startLoading, stopLoading } = useLoading();

  const [user, setUser] = useState<FirebaseUser | null>(null);

  const { showToast } = useToast();

  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogout = async () => {
    try {
      startLoading();

      await signOut(auth);

      setUser(null);

      showToast("Logged out.", "success");
    } catch (error) {
      console.error("Error signing out:", error);
      showToast("Uh Oh! There was an issue logging out.", "error");
    } finally {
      stopLoading();
    }
  };

  const handleLogin = async () => {
    if (isSigningIn) {
      return; // Prevent multiple sign-in attempts
    }

    setIsSigningIn(true);

    try {
      startLoading();

      const { user } = await signInWithPopup(auth, provider);

      setUser(user);

      showToast(`Logged in as ${user.displayName}.`, "success");
    } catch (error) {
      console.error("Error signing in:", error);
      showToast("Uh Oh! There was an issue logging in.", "error");
    } finally {
      stopLoading();

      setIsSigningIn(false);
    }
  };

  if (!user) {
    return (
      <div className="top-nav-container">
        <div className="left-col">
          <GoBackNavLinkItem showBack={location.pathname !== "/"} />
          <HelpLinkItem showHelpState={[showHelp, setShowHelp]} />
        </div>
        <div className="right-col">
          <div className="top-nav-link fourth-color" onClick={handleLogin}>
            Sign in
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="top-nav-container">
      <div className="top-nav-left-col">
        <GoBackNavLinkItem showBack={location.pathname !== "/"} />
        <HelpLinkItem showHelpState={[showHelp, setShowHelp]} />
      </div>
      <div className="top-nav-right-col">
        <MenuPopover pathname={location.pathname}>
          <div className="popover-menu-container">
            <div className="popover-menu-item" onClick={handleLogout}>
              <a href="javascript:void(0);">Sign out</a>
            </div>
          </div>
        </MenuPopover>
        {user.photoURL && (
          <div className="profile-photo-container">
            <Link to="/">
              <img alt="Profile" src={user.photoURL} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
