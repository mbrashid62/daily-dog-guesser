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

import { LOCAL_CONFIG } from "../local.config";

function safelyReadFirebaseApiKey(): string {
  if (import.meta.env.DEV) {
    if (!LOCAL_CONFIG.FIREBASE_API_KEY) {
      throw new Error(
        "Uh oh! Looks like your local config isn't setup correctly.",
      );
    }

    console.log("Using Firebase API key from local config.");
    return LOCAL_CONFIG.FIREBASE_API_KEY;
  }

  const VITE_FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

  if (!VITE_FIREBASE_API_KEY) {
    throw new Error(
      "import.meta.env.VITE_FIREBASE_API_KEY is not set in production.",
    );
  }

  console.log("Using environment API key in production mode");
  return import.meta.env.VITE_FIREBASE_API_KEY;
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
