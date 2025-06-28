import type { Notification } from '../slice/dynamicComponentSlice';
interface UseDynamicComponentAPI {
    isActive: boolean;
    activate: (props?: Record<string, any> | null) => void;
    deactivate: () => void;
    notify: (notificationId: string | number, payload: any) => void;
    removeNotification: (notificationId: string | number) => void;
    notifications: Notification[];
}
export default function useDynamicComponent(componentId: string): UseDynamicComponentAPI;
export {};
