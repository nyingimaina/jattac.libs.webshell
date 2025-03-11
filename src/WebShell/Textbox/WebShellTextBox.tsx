import React, { ReactNode } from 'react';
import styles from './WebShellTextBox.module.css'; // Ensure this is the correct path to your CSS module.
import TextboxTypes from './TextboxTypes';

type WebShellTextBoxProps = {
  type: TextboxTypes;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  width?: string; // Optional width prop
  required?: boolean; // Optional required prop
  autoFocus?: boolean;
  suffixElement?: ReactNode;
  prefixElement?: ReactNode;
};

type WebShellTextBoxState = {
  hasInteracted: boolean; // Track if the user has interacted with the input
  isValid: boolean; // Track if the input is valid
};

class WebShellTextBox extends React.Component<WebShellTextBoxProps, WebShellTextBoxState> {
  private inputRef = React.createRef<HTMLInputElement>();

  constructor(props: WebShellTextBoxProps) {
    super(props);
    this.state = {
      hasInteracted: false, // Initialize as false
      isValid: true, // Initialize validity to true
    };
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e); // Trigger the onChange prop to update state in the parent component
  };

  handleBlur = () => {
    this.setState({ hasInteracted: true }, this.validateInput); // Validate after setting hasInteracted
  };

  private get effectiveTextboxType(): TextboxTypes {
    if (this.props.type === 'number') {
      return 'tel';
    } else {
      return this.props.type;
    }
  }

  validateInput = () => {
    const input = this.inputRef.current;
    let isValid = true;

    if (input) {
      if (this.props.required && !input.value) {
        isValid = false; // Required field is empty
      } else if (this.effectiveTextboxType === 'email' && input.validity.patternMismatch) {
        isValid = false; // Invalid email format
      } else if (this.props.type === 'tel' && input.validity.patternMismatch) {
        isValid = false; // Invalid phone format
      } else {
        isValid = true; // Valid input
      }

      this.setState({ isValid }); // Update isValid state
      input.setCustomValidity(isValid ? '' : 'Please enter a valid value.'); // Set custom validity
      input.reportValidity(); // Show native validation message if invalid
    }
  };

  render() {
    const { type, placeholder, value, disabled, width, required } = this.props;
    const { hasInteracted, isValid } = this.state; // Get interaction and validity state

    return (
      <div className={styles.textBoxWrapper} style={{ width: width || '100%' }}>
        <span
          style={{
            position: 'absolute',
            left: '0',
            top: '13px', // Adjust to control the vertical alignment
            padding: this.props.prefixElement ? '0 0.5rem' : '', // Optional for aesthetics
          }}
        >
          {this.props.prefixElement}
        </span>

        <input
          ref={this.inputRef} // Attach the ref to the input
          className={styles.textBox}
          type={this.effectiveTextboxType}
          placeholder={placeholder}
          value={value}
          onChange={this.handleInput}
          onBlur={this.handleBlur} // Trigger validation on blur
          disabled={disabled}
          required={required}
          autoFocus={this.props.autoFocus}
          style={{
            paddingRight: this.props.suffixElement ? '2rem' : '', // Add some padding to avoid overlap
            paddingLeft: this.props.prefixElement ? '2rem' : '',
          }}
          pattern={this.effectiveTextboxType === 'email' ? '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' : undefined} // Set pattern conditionally
        />
        {hasInteracted && !isValid && (
          <span className={`${styles.validationMessage} ${!isValid ? styles.show : ''}`}>
            This field is required or invalid.
          </span>
        )}
        <span
          style={{
            position: 'absolute',
            right: '0',
            top: '10px', // Adjust to control the vertical alignment
            padding: this.props.suffixElement ? '0 0.5rem' : '', // Optional for aesthetics
          }}
        >
          {this.props.suffixElement}
        </span>
      </div>
    );
  }
}

export default WebShellTextBox;
