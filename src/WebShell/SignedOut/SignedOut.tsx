import React, { PureComponent, ReactNode } from 'react';
import formStyles from '../Styles/WebShellForms.module.css';
import WebShellButton from '../Buttons/WebShellButton';
import WebShellTextBox from '../Textbox/WebShellTextBox';
import { WebShellUserContext, WebShellUserContextType } from '../SignedInStateTracking/WebShellUserContext';
import styles from './Styles/SignedOut.module.css';
import IWebShellCredentials from './Data/IWebShellCredentials';
import IWebShellUser from './Data/IWebShellUser';
import TextboxTypes from '../Textbox/TextboxTypes';

interface IProps {
  onSignIn: (credentials: IWebShellCredentials) => IWebShellUser | undefined;
  usernameType: TextboxTypes;
}

interface IState {
  credentials: IWebShellCredentials;
}
export default class SignedOut extends PureComponent<IProps, IState> {
  static contextType = WebShellUserContext;
  context!: React.ContextType<typeof WebShellUserContext>;
  constructor(props: IProps) {
    super(props);
    this.state = {
      credentials: {
        username: '',
        password: '',
      },
    };
  }

  handleLogin = () => {
    const { login } = this.context as WebShellUserContextType;

    const signInResult = this.props.onSignIn(this.state.credentials);
    if (signInResult) {
      login(signInResult);
    }
  };

  private get canSubmit(): boolean {
    return this.state.credentials.password && this.state.credentials.username ? true : false;
  }

  render(): ReactNode {
    return (
      <div className={`${styles.formWidth} ${formStyles.formContainer}`}>
        <h2 className={formStyles.formTitle}>Sign In</h2>
        <form>
          <label className={formStyles.formLabel} htmlFor="name">
            Username
          </label>
          <WebShellTextBox
            onChange={(e) => {
              this.setState({
                credentials: {
                  username: e.target.value,
                  password: this.state.credentials.password,
                },
              });
            }}
            type={this.props.usernameType}
            value={this.state.credentials.username}
            placeholder="Enter your username or email"
            required={true}
          />

          <label className={formStyles.formLabel} htmlFor="email">
            Password
          </label>
          <WebShellTextBox
            onChange={(e) => {
              this.setState({
                credentials: {
                  username: this.state.credentials.username,
                  password: e.target.value,
                },
              });
            }}
            type="password"
            value={this.state.credentials.password}
            placeholder="Enter your password"
            required={true}
          />

          <div className={formStyles.buttonBar}>
            <WebShellButton
              buttonType="positive"
              disabled={this.canSubmit === true ? false : true}
              onClick={this.handleLogin}
            >
              Sign In
            </WebShellButton>
          </div>
        </form>
      </div>
    );
  }
}
