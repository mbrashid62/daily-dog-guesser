import { useState, useEffect, useContext, ReactElement } from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Menu.css";
import { GoogleContext } from "../../App";
import { Link } from "react-router-dom";

const provider = new GoogleAuthProvider(); // Google Auth Provider

interface User {
  email: string;
  displayName: string;
}

// Type guard to check if authUser is valid
function isValidAuthUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authUser: any,
): authUser is { email: string; displayName: string } {
  return (
    typeof authUser === "object" &&
    authUser !== null &&
    typeof authUser.email === "string" &&
    typeof authUser.displayName === "string"
  );
}

function mapAuthUserToInternalUser(authUser: unknown): User {
  if (!isValidAuthUser(authUser)) {
    throw new Error("Unexpected user type");
  }

  return {
    email: authUser.email,
    displayName: authUser.displayName,
  };
}

function getRouterLinks(): ReactElement[] {
  return [
    <li key="home">
      <Link className="nav-link fourth-color" to="/">
        Home
      </Link>
    </li>,
    <li key="leaderboard">
      <Link className="nav-link fourth-color" to="/leaderboard">
        Leaderboard
      </Link>
    </li>,
    <li key="info">
      <Link className="nav-link fourth-color" to="/info">
        Info
      </Link>
    </li>,
  ];
}

export const Menu = () => {
  const [user, setUser] = useState<User | null>(null);

  const { auth } = useContext(GoogleContext);

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
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        {user && (
          <>
            Welcome, <b>{user.displayName}</b>.
          </>
        )}
      </div>
      <ul className="nav-links">
        <>
          {getRouterLinks()}{" "}
          {user ? (
            <li className="nav-link fourth-color" onClick={handleLogout}>
              Sign out
            </li>
          ) : (
            <li className="nav-link fourth-color" onClick={handleLogin}>
              Sign in
            </li>
          )}
        </>
      </ul>
    </nav>
  );
};
