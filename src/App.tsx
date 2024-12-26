import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Analytics, getAnalytics } from "firebase/analytics";
import { createContext } from "react";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { HomePage } from "./HomePage";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";
import { LoadingProvider } from "./components/Spinner/LoadingContext";
import { useLoading } from "./components/Spinner/useLoading";
import { Spinner } from "./components/Spinner/Spinner";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFpciMnyZ9hVNtO311TygA7BzmsPI-4S8",
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
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
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
      <LoadingProvider>
        <AppContainer />
      </LoadingProvider>
    </GoogleContext.Provider>
  );
}

export default App;
