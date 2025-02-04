import React, { createContext, useContext, ReactNode } from "react";
import {
  collection,
  doc,
  setDoc,
  Firestore,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { MetricsAppData } from "./components/Pages/Home/HomePage";

type UserSavedProperties = Pick<User, "displayName" | "photoURL">;

export type LeaderBoardEntry = {
  metrics: MetricsAppData;
  user: UserSavedProperties;
  version: string;
};

type FireStoreContextType = {
  fetchLeaderBoard: (
    type: "correctGuesses" | "streak",
  ) => Promise<LeaderBoardEntry[]>;
  fetchUserDoc: (userId: string) => Promise<LeaderBoardEntry | null>;
  saveUserScore: (userId: string, entry: LeaderBoardEntry) => Promise<void>;
  deleteUserDoc: (userId: string) => Promise<void>;
};

const FireStoreContext = createContext<FireStoreContextType | null>(null);

export const FireStoreProvider: React.FC<{
  db: Firestore;
  children: ReactNode;
}> = ({ db, children }) => {
  const metricsCollection = collection(db, "metrics");

  const deleteUserDoc = async (userId: string) => {
    const docRef = doc(metricsCollection, userId);
    return deleteDoc(docRef);
  };

  const fetchLeaderBoard = async (
    type: "correctGuesses" | "streak",
  ): Promise<LeaderBoardEntry[]> => {
    const queryConstraint =
      type === "correctGuesses"
        ? orderBy("metrics.correctGuesses", "desc")
        : orderBy("metrics.streak", "desc");

    const q = query(metricsCollection, queryConstraint, limit(10));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as LeaderBoardEntry);
  };

  const fetchUserDoc = async (
    userId: string,
  ): Promise<LeaderBoardEntry | null> => {
    const docRef = doc(metricsCollection, userId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return null;
    }

    return docSnapshot.data() as LeaderBoardEntry;
  };

  const saveUserScore = async (
    userId: string,
    entry: LeaderBoardEntry,
  ): Promise<void> => {
    const metricsDoc = doc(metricsCollection, userId);
    await setDoc(metricsDoc, { ...entry }, { merge: true });
  };

  return (
    <FireStoreContext.Provider
      value={{
        fetchLeaderBoard,
        fetchUserDoc,
        saveUserScore,
        deleteUserDoc,
      }}
    >
      {children}
    </FireStoreContext.Provider>
  );
};

export const useFireStore = (): FireStoreContextType => {
  const context = useContext(FireStoreContext);
  if (!context) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }
  return context;
};
