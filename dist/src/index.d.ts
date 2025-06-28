import { DynamicComponentProvider } from './components/DynamicComponentProvider';
import useDynamicComponent from './hooks/useDynamicComponent';
import dynamicComponentReducer, { type Notification, type DynamicComponentState, type ComponentsState } from './slice/dynamicComponentSlice';
export { DynamicComponentProvider, useDynamicComponent };
export { dynamicComponentReducer };
export type { Notification, DynamicComponentState, ComponentsState };
