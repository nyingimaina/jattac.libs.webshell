// contexts/UserContext.tsx
import React, { createContext, ReactNode } from 'react';
import IWebShellUser from '../SignedOut/Data/IWebShellUser';
import { DeviceCryptoService } from '../DeviceCryptoService';

const userKey = 'user';

const getUserFromLocalStorageAsync = async (): Promise<IWebShellUser | null> => {
  try {
    const encryptedUserString = localStorage.getItem(userKey);
    const user = (await new DeviceCryptoService().decrypt(encryptedUserString || '')) as IWebShellUser;
    return user;
  } catch {
    return null;
  }
};

export { getUserFromLocalStorageAsync };

// Define the context value type
export interface WebShellUserContextType {
  user: IWebShellUser | null;
  login: (userData: IWebShellUser) => void;
  logout: () => void;
  isInitialized: boolean;
}

// Create the context with a default value (use null assertions since it will be provided later)
export const WebShellUserContext = createContext<WebShellUserContextType | undefined>(undefined);

// Define the provider's props type
interface UserProviderProps {
  children: ReactNode;
}

// Create the provider class component
export class UserProvider extends React.Component<UserProviderProps, WebShellUserContextType> {
  constructor(props: UserProviderProps) {
    super(props);
    this.state = {
      user: null,
      login: this.login,
      logout: this.logout,
      isInitialized: false,
    };
  }

  async componentDidMount() {
    const storedUser = await getUserFromLocalStorageAsync();
    this.setState({ user: storedUser, isInitialized: true });
  }

  // Login method
  login = (userData: IWebShellUser) => {
    this.setState({ user: userData });
    new DeviceCryptoService().encrypt(userData).then((encryptedUserString) => {
      localStorage.setItem(userKey, encryptedUserString);
    });
  };

  // Logout method
  logout = () => {
    this.setState({ user: null });
    localStorage.removeItem(userKey);
  };

  render() {
    return <WebShellUserContext.Provider value={this.state}>{this.props.children}</WebShellUserContext.Provider>;
  }
}
