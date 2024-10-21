// contexts/UserContext.tsx
import React, { createContext, ReactNode } from 'react';
import IWebShellUser from '../SignedOut/Data/IWebShellUser';

// Define the context value type
export interface WebShellUserContextType {
  user: IWebShellUser | null;
  login: (userData: IWebShellUser) => void;
  logout: () => void;
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
    };
  }

  componentDidMount() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.setState({ user: JSON.parse(storedUser) });
    }
  }

  // Login method
  login = (userData: IWebShellUser) => {
    this.setState({ user: userData });
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout method
  logout = () => {
    this.setState({ user: null });
    localStorage.removeItem('user');
  };

  render() {
    return <WebShellUserContext.Provider value={this.state}>{this.props.children}</WebShellUserContext.Provider>;
  }
}
