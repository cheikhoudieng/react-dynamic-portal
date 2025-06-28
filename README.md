# React Dynamic Portal

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
import { DynamicComponentProvider, useDynamicComponent } from 'react-dynamic-portal';
import Modal from './components/Modal'; // Your dynamic component

function App() {
  const { activate, deactivate, isActive, notifications } = useDynamicComponent('myModal');

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
  const { activate, deactivate, isActive, notifications } = useDynamicComponent('myModal');

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

-   `close()`: A function to deactivate (close) the current dynamic component.
-   `notify(notificationId: string | number, payload: any)`: A function to send a notification to the dynamic component's state.

### Notifications System

The `useDynamicComponent` hook also exposes a `notifications` array, which contains any notifications sent to that specific component. This allows for a decoupled way for components to receive updates or trigger actions based on external events.

```jsx
// src/App.js (Example from the `example` directory)
import { useDynamicComponent } from 'react-dynamic-portal';

function App() {
  const { notifications } = useDynamicComponent('myModal');

  // notifications will be an array of { id: string | number, payload: any }
  console.log(notifications);

  // You can then process these notifications in your component
  // For example, to react to a 'modalAction' notification from the Modal component:
  // useEffect(() => {
  //   const modalActionNotification = notifications.find(n => n.id === 'modalAction');
  //   if (modalActionNotification) {
  //     console.log('Modal action:', modalActionNotification.payload);
  //     // Optionally remove the notification after processing
  //     // removeNotification('modalAction');
  //   }
  // }, [notifications]);

  // ...
}
```

## API Reference

### `<DynamicComponentProvider />`

A React Context Provider that manages the lifecycle and rendering of dynamic components.

#### Props

-   `components`: `Array<{ componentId: string; component: ReactElement }>` (required)
    An array of objects, where each object defines a dynamic component:
    -   `componentId`: A unique string identifier for the component.
    -   `component`: The React element to be rendered dynamically.
-   `children`: `ReactNode` (required)
    The child elements that will be rendered normally within the provider's scope.
-   `fallback`: `ReactNode` (optional)
    A fallback UI to display while dynamic components are being loaded (e.g., during code splitting with `React.lazy`). Defaults to `null`.

### `useDynamicComponent(componentId: string)`

A custom React hook to interact with a specific dynamic component.

#### Parameters

-   `componentId`: `string` (required)
    The unique identifier of the dynamic component you want to control or get information about.

#### Returns

An object with the following properties:

-   `isActive`: `boolean`
    Indicates whether the component is currently active (rendered) or not.
-   `activate(props?: Record<string, any> | null)`: `function`
    Activates the component, making it visible. You can optionally pass an object of `props` that will be injected into the dynamic component.
-   `deactivate()`: `function`
    Deactivates the component, removing it from the DOM.
-   `notify(notificationId: string | number, payload: any)`: `function`
    Sends a notification to the component's state.
    -   `notificationId`: A unique identifier for the notification. If a notification with the same ID already exists, its payload will be updated.
    -   `payload`: Any data associated with the notification.
-   `removeNotification(notificationId: string | number)`: `function`
    Removes a specific notification from the component's state.
-   `notifications`: `Notification[]`
    An array of notifications currently associated with the component. Each `Notification` object has an `id` and a `payload`.

### `dynamicComponentReducer`

The Redux reducer that manages the state of all dynamic components. It should be added to your Redux store's `reducer` map.

### Types

The library exports several TypeScript types for better type safety:

-   `Notification`: `{ id: string | number; payload: any; }`
    Represents a notification object.
-   `DynamicComponentState`: `{ id: string; isActive: boolean; props: Record<string, any> | null; notifications: Notification[]; }`
    Represents the state of a single dynamic component.
-   `ComponentsState`: `{ components: Record<string, DynamicComponentState>; }`
    The overall state managed by `dynamicComponentReducer`.

## Example Application

The `example/` directory contains a simple React application demonstrating how to use `react-dynamic-portal` to manage a modal component.

To run the example:

1.  Navigate to the `example` directory:
    ```bash
    cd example
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Start the development server:
    ```bash
    npm start
    # or
    yarn start
    ```
    This will open the example application in your browser, typically at `http://localhost:3000`.

## Development

This project uses Rollup for bundling.

-   **`package.json`**: Defines project metadata, scripts, and dependencies.
    -   `"main": "dist/index.js"`: CommonJS entry point.
    -   `"module": "dist/index.mjs"`: ES Module entry point.
    -   `"types": "dist/index.d.ts"`: TypeScript declaration file entry point.
    -   `"scripts.build"`: Runs Rollup to build the library.
    -   `"scripts.dev"`: Runs Rollup in watch mode for development.
    -   `"peerDependencies"`: Specifies `react` and `react-dom` as peer dependencies, meaning they should be installed by the consuming application.
    -   `"dependencies"`: Includes `@reduxjs/toolkit`, `react-redux`, Rollup plugins, and `tslib`.
    -   `"devDependencies"`: Includes `@types/react` and `@types/react-dom` for TypeScript support.

-   **`rollup.config.cjs`**: Rollup configuration file.
    -   Uses `rollup-plugin-peer-deps-external` to automatically externalize peer dependencies.
    -   Uses `@rollup/plugin-node-resolve` to resolve third-party modules in `node_modules`.
    -   Uses `@rollup/plugin-commonjs` to convert CommonJS modules to ES6, allowing them to be included in the bundle.
    -   Uses `@rollup/plugin-typescript` to compile TypeScript files.
    -   Generates two main bundles: CommonJS (`dist/index.js`) and ES Module (`dist/index.mjs`).
    -   Generates TypeScript declaration files (`dist/index.d.ts`) using `rollup-plugin-dts`.

-   **`tsconfig.json`**: TypeScript configuration file.
    -   `"target": "es5"`: Compiles to ES5 for broader compatibility.
    -   `"lib"`: Includes necessary DOM and ESNext libraries.
    -   `"jsx": "react-jsx"`: Configures JSX compilation for React 17+ transform.
    -   `"declaration": true`: Enables generation of `.d.ts` files.
    -   `"declarationDir": "dist"`: Specifies the output directory for `.d.ts` files.
    -   `"outDir": "dist"`: Specifies the output directory for compiled JavaScript files.
    -   `"strict": true`: Enables all strict type-checking options.

### Core Logic Files

-   **`src/index.ts`**: The main entry point of the library. It exports the `DynamicComponentProvider`, `useDynamicComponent` hook, `dynamicComponentReducer`, and relevant TypeScript types.
-   **`src/components/DynamicComponentProvider.tsx`**:
    -   This is the core React component that acts as the provider.
    -   It takes an array of `components` (React elements with `componentId`) as props.
    -   It dispatches `initializeComponents` action to the Redux store on mount to register the dynamic components.
    -   It uses `useSelector` to get the state of each dynamic component from the Redux store.
    -   It dynamically renders `DynamicComponent` instances only if they are `isActive`.
    -   It uses `React.cloneElement` to inject `close` and `notify` functions, along with any custom `props` from the Redux state, into the rendered dynamic component.
    -   Includes `Suspense` for potential lazy loading of dynamic components.
-   **`src/hooks/useDynamicComponent.ts`**:
    -   A custom React hook that provides an API to interact with a specific dynamic component identified by its `componentId`.
    -   It uses `useDispatch` to dispatch Redux actions (`activateComponent`, `deactivateComponent`, `notifyComponent`, `removeComponentNotification`).
    -   It uses `useSelector` with memoized selectors (`selectIsComponentActiveById`, `selectComponentNotificationsById`) to efficiently retrieve the `isActive` status and `notifications` for the given `componentId` from the Redux store.
    -   The returned functions (`activate`, `deactivate`, `notify`, `removeNotification`) are memoized using `useCallback` to prevent unnecessary re-renders.
-   **`src/slice/dynamicComponentSlice.ts`**:
    -   This file defines the Redux Toolkit slice for managing the state of dynamic components.
    -   **State Structure**:
        ```typescript
        interface ComponentsState {
          components: Record<string, DynamicComponentState>;
        }

        interface DynamicComponentState {
          id: string;
          isActive: boolean;
          props: Record<string, any> | null;
          notifications: Notification[];
        }

        interface Notification {
          id: string | number;
          payload: any;
        }
        ```
    -   **Reducers**:
        -   `initializeComponents(state, action: PayloadAction<string[]>)`: Initializes the state for a list of component IDs, setting them to inactive with no props or notifications.
        -   `activateComponent(state, action: PayloadAction<{ componentId: string; props?: Record<string, any> | null }>)`: Sets `isActive` to `true` and stores `props` for the specified component.
        -   `deactivateComponent(state, action: PayloadAction<{ componentId: string }>)`: Sets `isActive` to `false` and clears `props` for the specified component.
        -   `notifyComponent(state, action: PayloadAction<{ componentId: string; notificationId: string | number; payload: any }>)`: Adds or updates a notification for the specified component.
        -   `removeComponentNotification(state, action: PayloadAction<{ componentId: string; notificationId: string | number }>)`: Removes a specific notification from the component's state.
    -   **Selectors**:
        -   `selectComponentStateById`: Selects the entire state object for a given component ID.
        -   `selectIsComponentActiveById`: Selects only the `isActive` status of a component.
        -   `selectComponentNotificationsById`: Selects the `notifications` array of a component.
        -   All selectors are created using `createSelector` for memoization, ensuring efficient re-computation only when relevant parts of the state change.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
