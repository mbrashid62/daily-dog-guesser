import { useState, useEffect, useContext } from "react";

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

const GoBackNavLink = () => {
  return (
    <li>
      <Link className="go-back-link nav-link fourth-color" to="/">
        <img
          src="/back-arrow.png"
          style={{ width: 20, height: 20, paddingRight: 16 }}
        />
        Back
      </Link>
    </li>
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
          {location.pathname !== "/" && <GoBackNavLink />}
          <img
            alt="Help Icon"
            src="/question.png"
            onClick={() => setShowHelp(true)}
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
          <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
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
      <ul className="nav-links">
        {location.pathname !== "/" && <GoBackNavLink />}
        <img
          alt="Info Icon"
          src="/question.png"
          onClick={() => setShowHelp(true)}
          style={{ width: 20, height: 20, cursor: "pointer" }}
        />
        <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
      </ul>
      <ul className="nav-links">
        <li>
          <Link className="nav-link fourth-color" to="Privacy">
            Account
          </Link>
        </li>
        <li className="nav-link fourth-color" onClick={handleLogout}>
          Sign out
        </li>
        {user.photoURL && (
          <li className="profile-photo-container">
            <Link to="/">
              <img src={user.photoURL} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
