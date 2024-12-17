import React, { PureComponent, ReactNode } from 'react';
import { WebShellUserContext, WebShellUserContextType } from '../SignedInStateTracking/WebShellUserContext';
import SignedOut from '../SignedOut/SignedOut';
import WebShellHamburgerMenu, { MenuItem } from '../WebShellHamburgerMenu/WebShellHamburgerMenu';
import styles from './WebShell.module.css';
import IWebShellCredentials from '../SignedOut/Data/IWebShellCredentials';
import IWebShellUser from '../SignedOut/Data/IWebShellUser';
import TextboxTypes from '../Textbox/TextboxTypes';
import WebShellButton from '../Buttons/WebShellButton';

interface IProps<TMenuId> {
  children: ReactNode;
  menuItems?: Omit<MenuItem<TMenuId>, 'id'>[];
  hideSearch?: boolean;
  iconColor?: string;
  authentication?: {
    usernameType: TextboxTypes;
    onSignInAsync: (credentials: IWebShellCredentials) => Promise<IWebShellUser | undefined>;
    onBeforeSignOutAsync: () => Promise<boolean>;
    hideSignOut?: boolean;
  };
}

export default class WebShell<TMenuId> extends PureComponent<IProps<TMenuId>> {
  static contextType = WebShellUserContext;
  context: React.ContextType<typeof WebShellUserContext>;

  private get supportsAuthentication() {
    return this.props.authentication ? true : false;
  }

  render(): ReactNode {
    if (this.supportsAuthentication) {
      const { user } = this.context as WebShellUserContextType;
      return user ? (
        this.signedInUI
      ) : (
        <div className={styles.signedOut}>
          {' '}
          <SignedOut {...this.props.authentication!} />
        </div>
      );
    } else {
      return this.signedInUI;
    }
  }

  private get menuItems(): MenuItem<string>[] {
    let id = 0;
    const menuItems = (this.props.menuItems ?? []).map((a) => {
      const menuItem = a as MenuItem<string>;
      menuItem.id = ++id + '';
      return menuItem;
    });
    if (this.props.authentication && this.props.authentication.hideSignOut !== true) {
      menuItems.push({
        id: ++id + '',
        node: (
          <WebShellButton
            buttonType="negative"
            className={styles.signOutButton}
            onClick={async () => {
              if (await this.props.authentication!.onBeforeSignOutAsync()) {
                const { logout } = this.context as WebShellUserContextType;
                logout();
              }
            }}
          >
            Sign Out
          </WebShellButton>
        ),
      });
    }
    return menuItems;
  }

  private get signedInUI(): ReactNode {
    const { logout } = this.supportsAuthentication
      ? (this.context as WebShellUserContextType)
      : {
          logout: () => {
            throw new Error('Authentication support has not been configured');
          },
        };
    return (
      <div className={styles.container}>
        <WebShellHamburgerMenu
          onItemClick={(e) => {
            if (e.id === 'logout') {
              logout();
            }
          }}
          items={this.menuItems}
          {...this.props}
        />
        <div className={styles.workspace}>{this.props.children}</div>
      </div>
    );
  }
}
