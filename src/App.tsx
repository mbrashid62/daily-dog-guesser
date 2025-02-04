import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Analytics, getAnalytics } from "firebase/analytics";
import { createContext, useEffect } from "react";
import { LeaderBoardPage } from "./components/Pages/LeaderBoard/LeaderBoardPage";
import { AccountPage } from "./components/Pages/Account/AccountPage";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";
import { LoadingProvider } from "./components/Spinner/LoadingContext";
import { useLoading } from "./components/Spinner/useLoading";
import { Spinner } from "./components/Spinner/Spinner";
import { ToastProvider } from "./components/Toast/ToastProvider";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { HomePage } from "./components/Pages/Home/HomePage.tsx";
import { FirestoreProvider } from "./FireStoreProvider.tsx";

let localConfigApiKey: string | null = null;

// Dynamically import local config in dev mode
if (import.meta.env.DEV) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore skip typing here so the remote build passes
    const { LOCAL_CONFIG } = await import("../local.config.ts");
    localConfigApiKey = LOCAL_CONFIG.FIREBASE_API_KEY;
  } catch {
    console.warn(
      "Local config file not found. Make sure you have local.config.ts setup local development.",
    );
  }
}

export function safelyReadFirebaseApiKey(): string {
  if (import.meta.env.DEV) {
    if (localConfigApiKey) {
      console.log("Using local config API key in development mode");
      return localConfigApiKey;
    } else {
      throw new Error("Local config API key is missing in development mode.");
    }
  }

  const VITE_FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

  if (!VITE_FIREBASE_API_KEY) {
    throw new Error("VITE_FIREBASE_API_KEY is not set in production.");
  }

  console.log("Using environment API key in production mode");
  return VITE_FIREBASE_API_KEY;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: safelyReadFirebaseApiKey(),
  authDomain: "doggy-guesser.firebaseapp.com",
  projectId: "doggy-guesser",
  storageBucket: "doggy-guesser.firebasestorage.app",
  messagingSenderId: "680873888840",
  appId: "1:680873888840:web:4a049b1320bc54512c9c7d",
  measurementId: "G-2TZG1XDSGZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

type GoogleContextType = {
  analytics: Analytics;
  auth: Auth;
};

// Initialize Firebase Persistence
const initializeAuthPersistence = async (auth: Auth) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("Firebase auth persistence set to local.");
  } catch (error) {
    console.error("Error setting Firebase auth persistence:", error);
  }
};

export const GoogleContext = createContext<GoogleContextType>({
  analytics,
  auth,
});

function AppContainer() {
  const { isLoading } = useLoading();

  useEffect(() => {
    initializeAuthPersistence(auth);
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        {isLoading && <Spinner />}
        <TopNavigation />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/leaderboard" element={<LeaderBoardPage />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <GoogleContext.Provider
      value={{
        analytics,
        auth,
      }}
    >
      <FirestoreProvider db={db}>
        <ToastProvider>
          <LoadingProvider>
            <ErrorBoundary>
              <AppContainer />
            </ErrorBoundary>
          </LoadingProvider>
        </ToastProvider>
      </FirestoreProvider>
    </GoogleContext.Provider>
  );
}

export default App;
