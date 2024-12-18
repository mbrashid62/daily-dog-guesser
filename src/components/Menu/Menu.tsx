import { useState, useEffect, useContext } from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Menu.css";
import { GoogleContext } from "../../App";

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
  console.log("user --> ", user);

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        {user ? (
          <>
            Welcome, <b>{user.displayName}</b>.
          </>
        ) : (
          <>Dog Guesser.</>
        )}
      </div>
      <ul className="nav-links">
        {user ? (
          <>
            <li className="nav-link">Settings</li>
            <li onClick={handleLogout} className="nav-link">
              Sign out
            </li>
          </>
        ) : (
          <>
            <li onClick={handleLogin} className="nav-link">
              Login
            </li>
            <li onClick={handleLogin} className="nav-link">
              Signup
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
