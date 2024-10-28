# Jattac Libraries WebShell

![Version](https://img.shields.io/badge/version-0.0.7-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)  
![React Version](https://img.shields.io/badge/react-18.2.0%2B-blue)

**Jattac Libraries WebShell** is a simple authentication screen and navigation UI component library for React. It provides a set of reusable components that facilitate user authentication and navigation in your applications, making it easier to implement these features consistently and efficiently.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Components](#components)
    - [WebShellButton](#webshellbutton)
    - [WebShell](#webshell)
    - [WebShellTextBox](#webshelltextbox)
  - [User Context](#user-context)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Reusable Components**: Modular components for buttons, text boxes, and authentication screens.
- **TypeScript Support**: Built with TypeScript for type safety and better development experience.
- **Customizable**: Easily customizable components to fit your design needs.
- **User Context**: Manage user state and context across your application effortlessly.

## Installation

You can install the library using npm or yarn:

```bash
# Using npm
npm install jattac.libs.webshell

# Using yarn
yarn add jattac.libs.webshell

```

## Usage

### Components

#### WebShellButton

The WebShellButton component is a customizable button that you can use in your application. The mandatory props include onClick and label.

```tsx
import React from 'react';
import { WebShellButton } from 'jattac.libs.webshell';

const App = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div>
      <WebShellButton
        onClick={handleClick}
        label="Click Me"
        // Optional props
        style={{ backgroundColor: 'blue', color: 'white' }}
        disabled={false}
      />
    </div>
  );
};

export default App;
```

#### WebShell

The WebShell component provides a complete layout for authenticated users. It requires the userService prop.

```tsx
import React from 'react';
import { WebShell, WebShellUserService } from 'jattac.libs.webshell';

const App = () => {
  const userService = new WebShellUserService();

  return (
    <WebShell userService={userService}>
      <h1>Welcome to the WebShell!</h1>
      <p>This is your dashboard.</p>
    </WebShell>
  );
};

export default App;
```

#### WebShellTextBox

The WebShellTextBox component is a styled input field. The mandatory props include value and onChange.

```tsx
import React, { useState } from 'react';
import { WebShellTextBox } from 'jattac.libs.webshell';

const App = () => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <WebShellTextBox
        value={value}
        onChange={handleChange}
        placeholder="Enter your text here"
        // Optional props
        type="text"
        maxLength={100}
        style={{ border: '1px solid gray' }}
      />
    </div>
  );
};

export default App;
```

#### User Context

The library provides a context for managing user authentication states. You can use the UserProvider to wrap your application and access user-related data via WebShellUserContext.

```tsx
import React from 'react';
import { UserProvider, WebShellUserContext } from 'jattac.libs.webshell';

const App = () => {
  return (
    <UserProvider>
      <UserConsumerComponent />
    </UserProvider>
  );
};

const UserConsumerComponent = () => {
  const { user } = React.useContext(WebShellUserContext);

  return <div>{user ? `Hello, ${user.name}` : 'Not logged in'}</div>;
};
```

## Examples

### Complete Authentication Flow

Here’s how you can implement a simple authentication flow using the components provided:

```tsx
import React, { useState } from 'react';
import { UserProvider, WebShellButton, WebShellTextBox, WebShellUserService } from 'jattac.libs.webshell';

const AuthApp = () => {
  const userService = new WebShellUserService();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    userService.login(username, password);
  };

  return (
    <UserProvider>
      <div>
        <WebShellTextBox
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          type="text"
        />
        <WebShellTextBox
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <WebShellButton onClick={handleLogin} label="Login" />
      </div>
    </UserProvider>
  );
};

export default AuthApp;
```

## API Reference

### WebShellButton

- Props:
  - onClick: Function to handle button click (mandatory).
  - label: Text to display on the button (mandatory).
  - style: Optional custom styles for the button.
  - disabled: Optional prop to disable the button.

### WebShell

- Props:
  - userService: An instance of WebShellUserService to manage user sessions (mandatory).

### WebShellTextBox

- Props:
  - value: Current value of the text box (mandatory).
  - onChange: Function to handle input changes (mandatory).
  - placeholder: Placeholder text for the input (optional).
  - type: Input type, such as "text" or "password" (optional).
  - maxLength: Maximum length of the input (optional).
  - style: Optional custom styles for the text box.

### UserProvider

Wraps your application to provide user context.

### WebShellUserContext

Context to access user state across your application.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
