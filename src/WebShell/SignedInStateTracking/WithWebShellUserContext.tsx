import React from 'react';
import { UserProvider, WebShellUserContext, WebShellUserContextType } from './WebShellUserContext';

interface WithUserContextProps {
  children: (context: WebShellUserContextType | undefined) => React.ReactNode;
}

const WithWebShellUserContext: React.FC<WithUserContextProps> = ({ children }) => {
  return (
    <UserProvider>
      <WebShellUserContext.Consumer>
        {(context: WebShellUserContextType | undefined) => children(context)}
      </WebShellUserContext.Consumer>
    </UserProvider>
  );
};

export default WithWebShellUserContext;
