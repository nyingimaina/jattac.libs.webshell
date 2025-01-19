// components/WebShellButton.tsx
import React, { Component } from 'react';
import styles from './WebShellButton.module.css';

interface WebShellButtonProps {
  buttonType: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string; // Allow users to pass their own styles
  isDefault?: boolean;
}

export class WebShellButton extends Component<WebShellButtonProps> {
  componentDidMount() {
    if (this.props.isDefault) {
      // Add the event listener for Enter key when the component is mounted
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    // Clean up by removing the event listener when the component is unmounted
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    const { isDefault, onClick, disabled } = this.props;

    // If the Enter key is pressed and the button is enabled and isDefault is true
    if (isDefault && event.key === 'Enter' && !disabled) {
      event.preventDefault(); // Prevent default action (form submission if inside a form)
      if (onClick) {
        onClick(); // Trigger the button's onClick handler
      }
    }
  };

  render() {
    const { buttonType, disabled, children, className } = this.props;

    // Determine the button class based on the buttonType prop
    const buttonClass = `${styles.formButton} ${
      buttonType === 'positive'
        ? styles.formButtonPositive
        : buttonType === 'negative'
          ? styles.formButtonNegative
          : styles.formButtonNeutral
    } ${className ? className : ''}`; // Combine with custom className if provided

    // Apply disabled styling if necessary
    const finalClass = disabled ? `${buttonClass} ${styles.formButtonDisabled}` : buttonClass;

    return (
      <button
        className={finalClass.trim()} // Ensure no extra spaces
        onClick={(event) => {
          event.stopPropagation();
          if (this.props.onClick) {
            this.props.onClick();
          }
        }}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

export default WebShellButton;
