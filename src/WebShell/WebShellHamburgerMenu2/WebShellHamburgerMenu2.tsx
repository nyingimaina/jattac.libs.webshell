import React, { PureComponent, ReactNode } from 'react';
import { WebShellHamburgerMenuProps } from '../WebShellHamburgerMenu/WebShellHamburgerMenu';
import styles from './WebShellHamburgerMenu2.module.css';
import ReactDOM from 'react-dom';

interface IProps<TId> extends WebShellHamburgerMenuProps<TId> {}

export default class WebShellHamburgerMenu2<TId> extends PureComponent<IProps<TId>> {
  private get largeScreen(): ReactNode {
    
    return (
      <div className={`${styles.hamburgerMenu} ${this.props.isOpen ? styles.open : ''}`}>
        {this.props.items.map((item, index) => {
          return <div key={index}>{item.node}</div>;
        })}
      </div>
    );
  }

  private get container(): HTMLElement {
    const containerId = 'navigationItemContainerId';
    let cont = document.getElementById(containerId);
    if (cont) {
      return cont;
    } else {
      cont = document.createElement('div');
      cont.id = containerId;

      // Apply fixed positioning to keep the element in place even on scroll
      cont.style.position = 'fixed';
      if (this.props.overrides?.top) {
        cont.style.top = `${this.props.overrides.top}px`;
      }
      cont.style.left = '0'; // Optional: You can adjust this for horizontal alignment

      document.body.appendChild(cont); // Append to body for global positioning
      return cont;
    }
  }

  render(): ReactNode {
    return ReactDOM.createPortal(
      this.largeScreen,
      this.container, // or any other container where you want to render the content
    );
  }
}
