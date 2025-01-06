import React, { PureComponent, ReactNode } from 'react';
import { WebShellHamburgerMenuProps } from '../WebShellHamburgerMenu/WebShellHamburgerMenu';
import styles from './WebShellHamburgerMenu2.module.css';

interface IProps<TId> extends WebShellHamburgerMenuProps<TId> {}

export default class WebShellHamburgerMenu2<TId> extends PureComponent<IProps<TId>> {
  private get largeScreen(): ReactNode {
    return (
      <>
        {this.props.items.map((item, index) => {
          return <div key={index}>{item.node}</div>;
        })}
      </>
    );
  }

  render(): ReactNode {
    const effectiveStyle = this.props.overrides?.top
      ? {
          top: this.props.overrides?.top,
        }
      : {};
    return (
      <div className={styles.hamburgerMenu} style={effectiveStyle}>
        {this.largeScreen}
      </div>
    );
  }
}
