import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";
import { createContext } from "react";
import { LeaderBoardPage } from "./components/Pages/LeaderBoard/LeaderBoardPage";
import { AcccountPage } from "./components/Pages/Account/AccountPage";
import { HomePage } from "./HomePage";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";
import { LoadingProvider } from "./components/Spinner/LoadingContext";
import { useLoading } from "./components/Spinner/useLoading";
import { Spinner } from "./components/Spinner/Spinner";
import { ToastProvider } from "./components/Toast/ToastProvider";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);

type GoogleContextType = {
  firebase: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
};

export const GoogleContext = createContext<GoogleContextType>({
  firebase: app,
  analytics,
  auth,
});

function AppContainer() {
  const { isLoading } = useLoading();

  return (
    <div className="app-container">
      <BrowserRouter>
        {isLoading && <Spinner />}
        <TopNavigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<AcccountPage />} />
          <Route path="/leaderboard" element={<LeaderBoardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <GoogleContext.Provider
      value={{
        firebase: app,
        analytics,
        auth,
      }}
    >
      <ToastProvider>
        <LoadingProvider>
          <AppContainer />
        </LoadingProvider>
      </ToastProvider>
    </GoogleContext.Provider>
  );
}

export default App;
