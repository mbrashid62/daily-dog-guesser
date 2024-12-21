import { useState, useEffect, useContext, ReactElement } from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Menu.css";
import { GoogleContext } from "../../App";
import { Link, useLocation, useRoutes } from "react-router-dom";
import { InfoModal } from "../Info/InfoModal";
import { useLoading } from "../Spinner/useLoading";

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

// function renderLogoSectionByLocation(location: Location): ReactElement {
//   const { pathname } = location;

//   switch pathname {
//     case '/':
//       return (
//         <>
//             Welcome, <b>{user.displayName}</b>.
//           </>
//       )
//   }
// }

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

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        {location.pathname === "/" ? (
          <>
            {user && (
              <>
                Welcome, <b>{user?.displayName}</b>.
              </>
            )}
          </>
        ) : (
          <Link className="nav-link fourth-color" to="/">
            Go Back
          </Link>
        )}
      </div>
      <ul className="nav-links">
        <>
          {user ? (
            <>
              <li>
                <Link className="nav-link fourth-color" to="/privacy">
                  Privacy
                </Link>
              </li>
              <li className="nav-link fourth-color" onClick={handleLogout}>
                Sign out
              </li>
            </>
          ) : (
            <li className="nav-link fourth-color" onClick={handleLogin}>
              Sign in
            </li>
          )}
          <li style={{ display: "flex" }}>
            <img
              alt="Info Icon"
              src="/info.png"
              onClick={() => setShowHelp(true)}
              style={{ width: 20, height: 20, cursor: "pointer" }}
            />
            <InfoModal showHelp={showHelp} setShowHelp={setShowHelp} />
          </li>
        </>
      </ul>
    </nav>
  );
};
