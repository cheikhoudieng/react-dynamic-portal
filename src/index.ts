import { DynamicComponentProvider } from './components/DynamicComponentProvider';
import useDynamicComponent from './hooks/useDynamicComponent';
import dynamicComponentReducer, { 
    type Notification, 
    type DynamicComponentState, 
    type ComponentsState 
} from './slice/dynamicComponentSlice';

// Export the provider and the hook for public use
export { DynamicComponentProvider, useDynamicComponent };

// Export the reducer to be added to the user's store
export { dynamicComponentReducer };

// Export types for advanced users
export type { Notification, DynamicComponentState, ComponentsState };
