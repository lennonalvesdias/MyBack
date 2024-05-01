import React, { createContext, useContext, useState } from 'react';

interface ApiConfiguration {
  id: string;
  url: string;
}

const IntegrationContext = createContext<{ apis: ApiConfiguration[]; addApi: (url: string) => void } | undefined>(undefined);

export const IntegrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apis, setApis] = useState<ApiConfiguration[]>([]);

  const addApi = (url: string) => {
    setApis(apis => [...apis, { id: `${apis.length + 1}`, url }]);
  };

  return (
    <IntegrationContext.Provider value={{ apis, addApi }}>
      {children}
    </IntegrationContext.Provider>
  );
};

export const useIntegrations = () => {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegrations must be used within an IntegrationProvider');
  }
  return context;
};
