import React, { createContext, useContext, ReactNode } from "react";
import {
  collection,
  doc,
  setDoc,
  Firestore,
  getDocs,
  query,
  where,
} from "firebase/firestore";

type Metrics = {
  userId: string;
  correctGuesses: number;
  remaining: number;
  streak: number;
};

type FirestoreContextType = {
  getMetrics: (userId: string) => Promise<Metrics | null>;
  saveMetrics: (
    userId: string,
    metrics: Omit<Metrics, "userId">,
  ) => Promise<void>;
};

const FirestoreContext = createContext<FirestoreContextType | null>(null);

export const FirestoreProvider: React.FC<{
  db: Firestore;
  children: ReactNode;
}> = ({ db, children }) => {
  const metricsCollection = collection(db, "metrics");

  const getMetrics = async (userId: string): Promise<Metrics | null> => {
    const q = query(metricsCollection, where("userId", "==", userId));

    const queryResult = await getDocs(q);

    const docSnapshot = queryResult.docs[0];

    if (!docSnapshot.exists()) {
      return null;
    }

    return docSnapshot.data() as Metrics;
  };

  const saveMetrics = async (
    userId: string,
    metrics: Omit<Metrics, "userId">,
  ): Promise<void> => {
    const metricsDoc = doc(metricsCollection, userId);
    await setDoc(metricsDoc, { userId, ...metrics }, { merge: true });
  };

  return (
    <FirestoreContext.Provider value={{ getMetrics, saveMetrics }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = (): FirestoreContextType => {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error("useFirestore must be used within a FirestoreProvider");
  }
  return context;
};
