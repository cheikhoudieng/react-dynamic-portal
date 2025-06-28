import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  activateComponent as activateComponentAction,
  deactivateComponent as deactivateComponentAction,
  notifyComponent as notifyComponentAction,
  removeComponentNotification as removeNotificationAction,
  selectIsComponentActiveById,
  selectComponentNotificationsById,
} from '../slice/dynamicComponentSlice';
import type {
  ComponentsState,
  Notification,
} from '../slice/dynamicComponentSlice';

interface RootState {
  dynamicComponent: ComponentsState;
}

interface UseDynamicComponentAPI {
  isActive: boolean;
  activate: (props?: Record<string, any> | null) => void;
  deactivate: () => void;
  notify: (notificationId: string | number, payload: any) => void;
  removeNotification: (notificationId: string | number) => void;
  notifications: Notification[];
}

export default function useDynamicComponent(
  componentId: string
): UseDynamicComponentAPI {
  const dispatch = useDispatch();

  const isActive = useSelector((state: RootState) =>
    selectIsComponentActiveById(state, componentId)
  );

  const notifications = useSelector((state: RootState) =>
    selectComponentNotificationsById(state, componentId)
  );

  const activate = useCallback(
    (props?: Record<string, any> | null) => {
      dispatch(activateComponentAction({ componentId, props }));
    },
    [dispatch, componentId]
  );

  const deactivate = useCallback(() => {
    dispatch(deactivateComponentAction({ componentId }));
  }, [dispatch, componentId]);

  const notify = useCallback(
    (notificationId: string | number, payload: any) => {
      dispatch(notifyComponentAction({ componentId, notificationId, payload }));
    },
    [dispatch, componentId]
  );

  const removeNotification = useCallback(
    (notificationId: string | number) => {
      dispatch(removeNotificationAction({ componentId, notificationId }));
    },
    [dispatch, componentId]
  );

  return {
    isActive,
    activate,
    deactivate,
    notify,
    removeNotification,
    notifications,
  };
}
