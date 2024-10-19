// components/WebShellButton.tsx
import React, { Component } from 'react';
import styles from './WebShellButton.module.css';

interface WebShellButtonProps {
  buttonType: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string; // Allow users to pass their own styles
}

export class WebShellButton extends Component<WebShellButtonProps> {
  render() {
    const { buttonType, onClick, disabled, children, className } = this.props;

    // Determine the button class based on the buttonType prop
    const buttonClass = `${styles.formButton} ${
      buttonType === 'positive'
        ? styles.formButtonPositive
        : buttonType === 'negative'
        ? styles.formButtonNegative
        : styles.formButtonNeutral
    } ${className ? className : ''}`; // Combine with custom className if provided

    // Apply disabled styling if necessary
    const finalClass = disabled
      ? `${buttonClass} ${styles.formButtonDisabled}`
      : buttonClass;

    return (
      <button
        className={finalClass.trim()} // Ensure no extra spaces
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

export default WebShellButton;
