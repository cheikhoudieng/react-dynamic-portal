import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactElement, ReactNode } from 'react';
import * as redux from 'redux';

interface ProviderProps {
    components: Array<{
        componentId: string;
        component: ReactElement;
    }>;
    children: ReactNode;
    fallback?: ReactNode;
}
declare function DynamicComponentProvider({ components, children, fallback, }: ProviderProps): react_jsx_runtime.JSX.Element;

interface Notification {
    id: string | number;
    payload: any;
}
interface DynamicComponentState {
    id: string;
    isActive: boolean;
    props: Record<string, any> | null;
    notifications: Notification[];
}
interface ComponentsState {
    components: Record<string, DynamicComponentState>;
}
declare const _default: redux.Reducer<ComponentsState>;

interface UseDynamicComponentAPI {
    isActive: boolean;
    activate: (props?: Record<string, any> | null) => void;
    deactivate: () => void;
    notify: (notificationId: string | number, payload: any) => void;
    removeNotification: (notificationId: string | number) => void;
    notifications: Notification[];
}
declare function useDynamicComponent(componentId: string): UseDynamicComponentAPI;

export { DynamicComponentProvider, _default as dynamicComponentReducer, useDynamicComponent };
export type { ComponentsState, DynamicComponentState, Notification };
