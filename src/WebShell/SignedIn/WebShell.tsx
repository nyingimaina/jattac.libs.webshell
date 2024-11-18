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
  usernameType: TextboxTypes;
  menuItems?: Omit<MenuItem<TMenuId>, 'id'>[];
  hideSignOut?: boolean;
  onSignInAsync: (credentials: IWebShellCredentials) => Promise<IWebShellUser | undefined>;
  onBeforeSignOutAsync: () => Promise<boolean>;
}

export default class WebShell<TMenuId> extends PureComponent<IProps<TMenuId>> {
  static contextType = WebShellUserContext;
  context!: React.ContextType<typeof WebShellUserContext>;
  render(): ReactNode {
    const { user } = this.context as WebShellUserContextType;
    return user ? (
      this.signedInUI
    ) : (
      <div className={styles.signedOut}>
        {' '}
        <SignedOut {...this.props} />
      </div>
    );
  }

  private get menuItems(): MenuItem<string>[] {
    let id = 0;
    const menuItems = (this.props.menuItems ?? []).map((a) => {
      const menuItem = a as MenuItem<string>;
      menuItem.id = ++id + '';
      return menuItem;
    });
    if (this.props.hideSignOut !== true) {
      menuItems.push({
        id: ++id + '',
        node: (
          <WebShellButton
            buttonType="negative"
            onClick={async () => {
              if (await this.props.onBeforeSignOutAsync()) {
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
    const { logout } = this.context as WebShellUserContextType;
    return (
      <div className={styles.container}>
        <WebShellHamburgerMenu
          onItemClick={(e) => {
            if (e.id === 'logout') {
              logout();
            }
          }}
          items={this.menuItems}
        />
        <div className={styles.workspace}>{this.props.children}</div>
      </div>
    );
  }
}
