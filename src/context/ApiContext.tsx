import React, { createContext, useCallback, useContext, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

type ApiContextType = {
  isLoading: boolean;
  apiCall: (
    method: "GET" | "POST" | "PUT" | "DELETE",
    paramUrl: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<any>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_BASE_API_URL || "";

  const apiCall = useCallback(
    async (
      method: "GET" | "POST" | "PUT" | "DELETE",
      paramUrl: string,
      data?: any,
      config?: AxiosRequestConfig
    ) => {
      setIsLoading(true);
      try {
        const url = apiBaseUrl + paramUrl;
        const response = await axios({ method, url, data, ...config });
        return response.data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [apiBaseUrl]
  );

  return (
    <ApiContext.Provider value={{ isLoading, apiCall }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
