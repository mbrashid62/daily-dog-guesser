import React, { createContext, useState } from "react";

type LoadingProviderProps = {
  children: React.ReactElement;
};

type LoadingContextProps = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
