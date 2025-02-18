import React, {
  useMemo,
  useState,
  ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react";
import { DOGGIES } from "../../constants";
import { Dog } from "../../global-types";
import { getRandomInt } from "../../utils";

type MetricsProviderProps = {
  children: ReactNode;
};

export type MetricsAppData = {
  correctGuesses: number;
  remaining: number;
  streak: number;
};

export type MetricsContextValue = {
  activeDog: Dog | null;
  metrics: MetricsAppData;
  setCursor: React.Dispatch<React.SetStateAction<number>>;
  setSuccessCount: React.Dispatch<React.SetStateAction<number>>;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
  setDogsRemaining: React.Dispatch<React.SetStateAction<Dog[]>>;
};

export const MetricsContext = createContext<MetricsContextValue>({
  activeDog: null,
  metrics: { correctGuesses: 0, remaining: 0, streak: 0 },
  setCursor: () => {},
  setSuccessCount: () => {},
  setStreak: () => {},
  setDogsRemaining: () => {},
});

export const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [dogsRemaining, setDogsRemaining] = useState<Dog[]>(DOGGIES);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  const [cursor, setCursor] = useState(getRandomInt(0, DOGGIES.length - 1));

  const activeDog = useMemo<Dog>(() => {
    if (dogsRemaining[cursor]) {
      return dogsRemaining[cursor];
    }
    return dogsRemaining[dogsRemaining.length - 1];
  }, [dogsRemaining, cursor]);

  const metrics = useMemo<MetricsAppData>(
    () => ({
      correctGuesses: successCount,
      remaining: dogsRemaining.length,
      streak,
    }),
    [successCount, dogsRemaining.length, streak],
  );

  const contextValue = useMemo<MetricsContextValue>(
    () => ({
      activeDog,
      metrics,
      setCursor,
      setDogsRemaining,
      setSuccessCount,
      setStreak,
    }),
    [
      activeDog,
      metrics,
      setCursor,
      setSuccessCount,
      setStreak,
      setDogsRemaining,
    ],
  );

  useEffect(() => {
    setCursor((previousInt) => {
      if (metrics.remaining === 1) {
        return 0;
      }

      if (metrics.remaining === 0) {
        return 1;
      }

      let newInt = previousInt;

      // Keep generating a new random integer until it's different from the previous one
      while (newInt === previousInt) {
        newInt = getRandomInt(0, metrics.remaining - 1);
      }

      return newInt;
    });
  }, [dogsRemaining, metrics.remaining]);

  return (
    <MetricsContext.Provider value={contextValue}>
      {children}
    </MetricsContext.Provider>
  );
};

export const useMetrics = (): MetricsContextValue => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error("useMetrics must be used within a MetricsProvider");
  }
  return context;
};
