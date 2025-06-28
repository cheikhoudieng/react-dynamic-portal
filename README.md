# React Dynamic Portal

[![GitHub](https://img.shields.io/badge/GitHub-react--dynamic--portal-blue?style=flat&logo=github)](https://github.com/cheikhoudieng/react-dynamic-portal)
[![npm version](https://img.shields.io/npm/v/react-dynamic-portal.svg)](https://www.npmjs.com/package/react-dynamic-portal)
[![npm downloads](https://img.shields.io/npm/dm/react-dynamic-portal.svg)](https://www.npmjs.com/package/react-dynamic-portal)
[![License](https://img.shields.io/npm/l/react-dynamic-portal.svg)](https://github.com/cheikhoudieng/react-dynamic-portal/blob/main/LICENSE)

A React library for dynamic component rendering using Redux Toolkit. This library provides a robust and scalable solution for managing and rendering React components dynamically, making it ideal for scenarios like modals, notifications, pop-ups, or any UI element that needs to be injected into the DOM at runtime based on application state.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Integrating with Redux Store](#integrating-with-redux-store)
  - [DynamicComponentProvider](#dynamiccomponentprovider)
  - [useDynamicComponent Hook](#usedynamiccomponent-hook)
  - [Component Props Injection](#component-props-injection)
  - [Notifications System](#notifications-system)
  - [Managing Multiple Dynamic Components](#managing-multiple-dynamic-components)
  - [Customizing Component Styles](#customizing-component-styles)
  - [Removing a Dynamic Component](#removing-a-dynamic-component)
  - [Lazy Loading Dynamic Components with React.lazy](#lazy-loading-dynamic-components-with-reactlazy)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)
  - [`<DynamicComponentProvider />`](#dynamiccomponentprovider-1)
  - [`useDynamicComponent(componentId: string)`](#usedynamiccomponentcomponentid-string)
  - [`dynamicComponentReducer`](#dynamiccomponentreducer)
  - [Types](#types)
- [Example Application](#example-application)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

This library leverages Redux Toolkit to provide a centralized state management solution for dynamic components, offering the following key features:

-   **Centralized State Management**: All dynamic components' states (active/inactive, props, notifications) are managed within a Redux store, ensuring a single source of truth and predictable state changes.
-   **Dynamic Activation/Deactivation**: Components can be activated or deactivated programmatically from any part of your application, triggering their rendering or unmounting.
-   **Props Injection**: Custom props can be passed to dynamic components upon activation, allowing for flexible and context-aware rendering.
-   **Component-Specific Notifications**: A built-in notification system allows dynamic components to receive and manage notifications, enabling complex interactions and communication patterns.
-   **Type-Safe Development**: Written in TypeScript, providing strong typing for enhanced developer experience and reduced errors.
-   **Easy Integration**: Designed for straightforward integration into existing React and Redux applications.
-   **Rollup Bundling**: Optimized for production with Rollup, generating CommonJS and ES module formats, along with TypeScript declaration files.

## Installation

To install the library, use npm or yarn:

```bash
npm install react-dynamic-portal @reduxjs/toolkit react-redux
# or
yarn add react-dynamic-portal @reduxjs/toolkit react-redux
```

**Peer Dependencies**: Ensure you have `react` and `react-dom` installed in your project, as they are peer dependencies.

```bash
npm install react react-dom
# or
yarn add react react-dom
```

## Usage

### Integrating with Redux Store

First, you need to add the `dynamicComponentReducer` to your Redux store.

```javascript
// src/app/store.js (Example from the `example` directory)
import { configureStore } from '@reduxjs/toolkit';
import { dynamicComponentReducer } from 'react-dynamic-portal';

export const store = configureStore({
  reducer: {
    dynamicComponent: dynamicComponentReducer,
    // ... other reducers
  },
});
```

### DynamicComponentProvider

Wrap your application or the relevant part of your component tree with the `DynamicComponentProvider`. This provider is responsible for rendering the dynamic components based on their state in the Redux store.

You need to pass an array of `components` to the provider. Each object in the array should have a unique `componentId` and the `component` (a React element) itself.

```jsx
// src/App.js (Example from the `example` directory)
import React, { useMemo } from 'react';
import {
  DynamicComponentProvider,
  useDynamicComponent,
} from 'react-dynamic-portal';
import Modal from './components/Modal'; // Your dynamic component

function App() {
  const { activate, deactivate, isActive, notifications } =
    useDynamicComponent('myModal');

  const dynamicComponents = useMemo(
    () => [
      {
        componentId: 'myModal',
        component: (
          <Modal
            title='My Dynamic Modal'
            message='This is a dynamically rendered modal!'
          />
        ),
      },
      // Add more dynamic components here
    ],
    []
  );

  return (
    <DynamicComponentProvider components={dynamicComponents}>
      {/* Your application content */}
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>React Dynamic Portal Example</h1>
        <button onClick={() => activate({ fromApp: true })} disabled={isActive}>
          Show Modal
        </button>
        <button
          onClick={deactivate}
          disabled={!isActive}
          style={{ marginLeft: '10px' }}
        >
          Hide Modal
        </button>
      </div>
    </DynamicComponentProvider>
  );
  // ...
}
```

### useDynamicComponent Hook

The `useDynamicComponent` hook allows you to interact with a specific dynamic component by its `componentId`. It provides methods to `activate`, `deactivate`, `notify`, `removeNotification`, and access its `isActive` status and `notifications`.

```jsx
// src/App.js (Example from the `example` directory)
import { useDynamicComponent } from 'react-dynamic-portal';

function MyComponent() {
  const { activate, deactivate, isActive, notifications } =
    useDynamicComponent('myModal');

  // ... use activate, deactivate, isActive, notifications
}
```

### Component Props Injection

When a dynamic component is activated using `activate(props)`, the `props` object passed to `activate` will be injected into the dynamic component. Additionally, the `close` and `notify` functions are automatically injected.

```jsx
// src/components/Modal.js (Example from the `example` directory)
import React from 'react';

const Modal = ({ title, message, close, notify, fromApp }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid black',
        zIndex: 1000,
      }}
    >
      <h2>{title}</h2>
      <p>{message}</p>
      {fromApp && <p>fromApp</p>} {/* Example of injected prop */}
      <button onClick={close}>Close Modal</button> {/* Injected close function */}
      <button
        onClick={() => notify('modalAction', 'User clicked something in modal')} // Injected notify function
      >
        Notify
      </button>
    </div>
  );
};

export default Modal;
```

- `close()`: A function to deactivate (close) the current dynamic component.
- `notify(notificationId: string | number, payload: any)`: A function to send a notification to the dynamic component's state.

### Notifications System

The `useDynamicComponent` hook also exposes a `notifications` array, which contains any notifications sent to that specific component. This allows for a decoupled way for components to receive updates or trigger actions based on external events.

```jsx
// src/App.js (Example from the `example` directory)
import React, { useEffect } from 'react';
import { useDynamicComponent } from 'react-dynamic-portal';

function App() {
  const { notifications, removeNotification } = useDynamicComponent('myModal');

  useEffect(() => {
    // Process notifications received from the dynamic component
    notifications.forEach(notification => {
      if (notification.id === 'modalAction') {
        console.log('Modal action received:', notification.payload);
        // Perform actions based on the notification
        // For example, show a global toast, log analytics, etc.

        // Important: Remove the notification after processing to avoid re-processing
        removeNotification(notification.id);
      }
    });
  }, [notifications, removeNotification]);

  // ... rest of your component
}
```

### Managing Multiple Dynamic Components

You can manage multiple dynamic components by defining them in the `components` array of the `DynamicComponentProvider` and interacting with each using its unique `componentId`.

```jsx
// In your main App.js or a parent component
import React, { useMemo } from 'react';
import { DynamicComponentProvider, useDynamicComponent } from 'react-dynamic-portal';
import Modal from './components/Modal';
import Sidebar from './components/Sidebar'; // Another dynamic component
import Toast from './components/Toast';     // Yet another dynamic component

function App() {
  const { activate: activateModal, deactivate: deactivateModal, isActive: isModalActive } = useDynamicComponent('myModal');
  const { activate: activateSidebar, deactivate: deactivateSidebar, isActive: isSidebarActive } = useDynamicComponent('mySidebar');
  const { activate: activateToast, deactivate: deactivateToast, isActive: isToastActive } = useDynamicComponent('myToast');

  const dynamicComponents = useMemo(
    () => [
      {
        componentId: 'myModal',
        component: <Modal title='Main Modal' message='This is the main modal.' />,
      },
      {
        componentId: 'mySidebar',
        component: <Sidebar title='App Sidebar' />,
      },
      {
        componentId: 'myToast',
        component: <Toast message='Operation successful!' />,
      },
    ],
    []
  );

  return (
    <DynamicComponentProvider components={dynamicComponents}>
      {/* ... your application content ... */}
      <button onClick={() => activateModal()} disabled={isModalActive}>Show Main Modal</button>
      <button onClick={() => deactivateModal()} disabled={!isModalActive}>Hide Main Modal</button>

      <button onClick={() => activateSidebar()} disabled={isSidebarActive}>Show Sidebar</button>
      <button onClick={() => deactivateSidebar()} disabled={!isSidebarActive}>Hide Sidebar</button>

      <button onClick={() => activateToast({ duration: 3000 })}>Show Toast</button>
    </DynamicComponentProvider>
  );
}
```

### Customizing Component Styles

Styling of your dynamic components is entirely up to you. The `react-dynamic-portal` library only handles the rendering and state management. You can use any CSS-in-JS library, CSS modules, or plain CSS.

For example, to style a modal, you would define the styles within your `Modal` component:

```jsx
// src/components/Modal.js
import React from 'react';

const Modal = ({ title, message, close }) => {
  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    zIndex: 1000,
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
```

### Removing a Dynamic Component

To remove a dynamic component from the DOM, simply call the `deactivate()` method provided by the `useDynamicComponent` hook for that specific `componentId`.

```jsx
// In any component that uses the hook
import { useDynamicComponent } from 'react-dynamic-portal';

function MyComponent() {
  const { deactivate } = useDynamicComponent('myModal');

  const handleCloseClick = () => {
    deactivate(); // This will remove the 'myModal' component from the DOM
  };

  return <button onClick={handleCloseClick}>Close Modal</button>;
}
```

### Lazy Loading Dynamic Components with React.lazy

For better performance, especially with larger dynamic components, you can use `React.lazy` to code-split and load them only when needed. The `DynamicComponentProvider` is designed to work seamlessly with `Suspense`.

First, define your lazy-loaded component:

```jsx
// src/components/LazyLoadedModal.js
import React from 'react';

const LazyLoadedModal = ({ title, message, close }) => {
  return (
    <div style={{ /* your modal styles */ }}>
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={close}>Close Lazy Modal</button>
    </div>
  );
};

export default LazyLoadedModal;
```

Then, use `React.lazy` and include it in your `DynamicComponentProvider`:

```jsx
// In your main App.js or a parent component
import React, { useMemo, lazy, Suspense } from 'react';
import { DynamicComponentProvider, useDynamicComponent } from 'react-dynamic-portal';

// Lazily load your component
const LazyModal = lazy(() => import('./components/LazyLoadedModal'));

function App() {
  const { activate, deactivate, isActive } = useDynamicComponent('lazyModal');

  const dynamicComponents = useMemo(
    () => [
      {
        componentId: 'lazyModal',
        component: <LazyModal title='Lazy Modal' message='Loaded on demand!' />,
      },
    ],
    []
  );

  return (
    <DynamicComponentProvider components={dynamicComponents} fallback={<div>Loading dynamic component...</div>}>
      {/* Your application content */}
      <button onClick={() => activate()} disabled={isActive}>
        Show Lazy Modal
      </button>
      <button onClick={deactivate} disabled={!isActive}>
        Hide Lazy Modal
      </button>
    </DynamicComponentProvider>
  );
}
```

## Error Handling

- **Missing `componentId`**: If you try to activate, deactivate, or interact with a `componentId` that has not been registered with the `DynamicComponentProvider`, a `console.warn` message will be logged, indicating that the component ID was not found. Ensure all `componentId`s used with `useDynamicComponent` are correctly defined in the `DynamicComponentProvider`'s `components` array.

  ```
  [dynamicComponentSlice] activateComponent: Component ID "nonExistentModal" not found.
  ```

- **Duplicate `componentId`s**: While the library itself won't throw an error for duplicate `componentId`s in the `components` array passed to `DynamicComponentProvider`, it will lead to unpredictable behavior as Redux state updates will only affect the last registered component with that ID. Always ensure `componentId`s are unique.

## Best Practices

- **Unique `componentId`s**: Always use unique and descriptive `componentId`s for each dynamic component to avoid conflicts and ensure predictable behavior.
- **Memoize `components` Array**: When passing the `components` array to `DynamicComponentProvider`, use `React.useMemo` to prevent unnecessary re-renders of the provider and its children. This is crucial for performance.
- **Keep Dynamic Components Simple**: Design your dynamic components (e.g., `Modal`, `Sidebar`) to be as stateless as possible. Their state should primarily come from the `props` injected by `activate()` or from the Redux store if they need to interact with global application state.
- **Clear Notifications**: If your dynamic components use the notification system, consider implementing logic to `removeNotification` after they have been processed to keep the state clean.
- **Error Boundaries**: For critical dynamic components, consider wrapping them in React Error Boundaries to gracefully handle rendering errors within the dynamic component itself, preventing the entire application from crashing.
- **Accessibility**: Ensure your dynamic components (especially modals and pop-ups) follow accessibility best practices (e.g., proper ARIA roles, keyboard navigation, focus management).
- **Performance**: For very complex dynamic components or a large number of them, consider using `React.lazy` and `Suspense` for code splitting to reduce initial bundle size and improve loading times.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.