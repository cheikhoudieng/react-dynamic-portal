import { ReactNode, ReactElement } from 'react';
interface ProviderProps {
    components: Array<{
        componentId: string;
        component: ReactElement;
    }>;
    children: ReactNode;
    fallback?: ReactNode;
}
export declare function DynamicComponentProvider({ components, children, fallback, }: ProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
