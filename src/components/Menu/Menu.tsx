import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Menu.css";
import { GoogleContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import { HelpModal } from "../HelpModal/HelpModal";
import { useLoading } from "../Spinner/useLoading";

const provider = new GoogleAuthProvider(); // Google Auth Provider

type User = {
  email: string;
  displayName: string;
  photoURL: string | null;
};

// Type guard to check if authUser is valid
function isValidAuthUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authUser: any,
): authUser is User {
  return (
    typeof authUser === "object" &&
    authUser !== null &&
    typeof authUser.email === "string" &&
    typeof authUser.displayName === "string" &&
    typeof authUser?.photoURL === "string"
  );
}

function mapAuthUserToInternalUser(authUser: unknown): User {
  if (!isValidAuthUser(authUser)) {
    throw new Error("Unexpected user type");
  }

  return {
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL ?? null,
  };
}

const GoBackNavLinkItem = ({ showBack }: { showBack: boolean }) => {
  if (!showBack) {
    return null;
  }

  return (
    <Link className="go-back-link nav-link fourth-color" to="/">
      <img
        src="/back-arrow.png"
        style={{ width: 20, height: 20, paddingRight: 16 }}
      />
      Back
    </Link>
  );
};

const HelpLinkItem = ({
  showHelpState,
}: {
  showHelpState: [boolean, Dispatch<SetStateAction<boolean>>];
}) => {
  const [showHelp, setShowHelp] = showHelpState;
  return (
    <div style={{ display: "inline-flex" }}>
      <img
        alt="Help Icon"
        src="/question.png"
        onClick={() => setShowHelp(true)}
        style={{ width: 20, height: 20, cursor: "pointer" }}
      />
      <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
    </div>
  );
};

const ProfilePhotoLinkItem = ({ url }: { url: string | null }) => {
  if (!url) {
    return null;
  }

  return (
    <div className="profile-photo-container">
      <Link to="/">
        <img alt="Profile Photo." src={url} />
      </Link>
    </div>
  );
};

export const MenuOptions = ({ children }: { children: React.ReactElement }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="more-options-container">
      <div
        className="more-options-trigger"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <img alt="More Options Icon" src="/menu.png" />
      </div>
      <div
        className={`more-options-list-container ${openMenu ? "open" : "closed"}`}
      >
        {children}
      </div>
    </div>
  );
};

export const Menu = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const { auth } = useContext(GoogleContext);

  const { startLoading, stopLoading } = useLoading();

  const location = useLocation();

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser === null) {
        setUser(null);
      } else {
        const user = mapAuthUserToInternalUser(currentUser);
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      startLoading();

      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      stopLoading();
    }
  };

  const handleLogin = async () => {
    try {
      startLoading();

      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      stopLoading();
    }
  };

  // when user is unauthenticated
  // 1. if not on home, back button
  // 2. help icon
  // 4. sign in button
  if (!user) {
    return (
      <nav className="nav-container">
        <ul className="nav-links">
          <GoBackNavLinkItem showBack={location.pathname !== "/"} />
          <HelpLinkItem showHelpState={[showHelp, setShowHelp]} />
        </ul>
        <ul className="nav-links">
          <li className="nav-link fourth-color" onClick={handleLogin}>
            Sign in
          </li>
        </ul>
      </nav>
    );
  }

  // when user authenticated
  // 1. if not on home, back button
  // 2. help icon
  // 3. sign out btn
  // 4. profile icon
  return (
    <nav className="nav-container">
      <div className="nav-links">
        <GoBackNavLinkItem showBack={location.pathname !== "/"} />
        <HelpLinkItem showHelpState={[showHelp, setShowHelp]} />
      </div>
      <div className="right-col">
        <MenuOptions>
          <div className="menu-links">
            <div className="menu-link-item">
              <Link to="Privacy">Account</Link>
            </div>
            <div className="menu-link-item" onClick={handleLogout}>
              <a href="javascript:void(0);">Sign out</a>
            </div>
          </div>
        </MenuOptions>
        <ProfilePhotoLinkItem url={user.photoURL} />
      </div>
    </nav>
  );
};
