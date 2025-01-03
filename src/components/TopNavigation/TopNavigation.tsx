import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./TopNavigation.css";
import { GoogleContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import { HelpModal } from "../HelpModal/HelpModal";
import { useLoading } from "../Spinner/useLoading";
import { useToast } from "../Toast/ToastProvider";

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
    <Link className="go-back-link top-nav-link fourth-color" to="/">
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

const MenuPopover = ({
  children,
  pathname,
}: {
  children: React.ReactElement;
  pathname: string;
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target as Node)
    ) {
      setOpenMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    if (openMenu) {
      setOpenMenu(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="menu-popover-trigger-container">
      <img
        alt="More Options Icon"
        onClick={() => setOpenMenu(!openMenu)}
        src="/menu.png"
      />
      <div
        className={`menu-popover-children-container ${openMenu ? "open" : "closed"}`}
        ref={popoverRef}
      >
        {children}
      </div>
    </div>
  );
};

export const TopNavigation = () => {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const { auth } = useContext(GoogleContext);

  const { startLoading, stopLoading } = useLoading();

  const location = useLocation();
  const { showToast } = useToast();

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser === null) {
        setUser(null);

        showToast("Logged out.", "success");
      } else {
        const user = mapAuthUserToInternalUser(currentUser);
        setUser(user);

        showToast(`Logged in as ${user.email}.`, "success");
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

  // when user authenticated
  // 1. if not on home, back button
  // 2. help icon
  // 3. sign out btn
  // 4. profile icon
  return (
    <div className="top-nav-container">
      <div className="top-nav-left-col">
        <GoBackNavLinkItem showBack={location.pathname !== "/"} />
        <HelpLinkItem showHelpState={[showHelp, setShowHelp]} />
      </div>
      <div className="top-nav-right-col">
        <MenuPopover pathname={location.pathname}>
          <div className="popover-menu-container">
            <div className="popover-menu-item">
              <Link to="account">Account</Link>
            </div>
            <div className="popover-menu-item" onClick={handleLogout}>
              <a href="javascript:void(0);">Sign out</a>
            </div>
          </div>
        </MenuPopover>
        {user.photoURL && (
          <div className="profile-photo-container">
            <Link to="/">
              <img alt="Profile Photo." src={user.photoURL} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
