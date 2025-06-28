import React, { useEffect, Suspense, ReactNode, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeComponents,
  selectComponentStateById,
  deactivateComponent,
  notifyComponent,
} from '../slice/dynamicComponentSlice';
import type { RootState } from '../slice/dynamicComponentSlice';

// --- Type Definitions ---
interface DynamicComponentProps {
  componentId: string;
  componentElement: ReactElement;
}

interface ProviderProps {
  components: Array<{ componentId: string; component: ReactElement }>;
  children: ReactNode;
  fallback?: ReactNode;
}

// --- Internal Renderer ---
function DynamicComponent({
  componentId,
  componentElement,
}: DynamicComponentProps) {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) =>
    selectComponentStateById(state, componentId)
  );

  if (!state || !state.isActive) {
    return null;
  }

  // Injected props for the component to use
  const injectedProps = {
    ...state.props,
    close: () => {
      dispatch(deactivateComponent({ componentId }));
    },
    notify: (notificationId: string | number, payload: any) => {
      dispatch(notifyComponent({ componentId, notificationId, payload }));
    },
  };

  return React.cloneElement(componentElement, injectedProps);
}

// --- Main Provider ---
export function DynamicComponentProvider({
  components,
  children,
  fallback = null,
}: ProviderProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    const componentIds = components.map((c) => c.componentId);
    dispatch(initializeComponents(componentIds));
  }, [dispatch, components]);

  return (
    <>
      {children}
      <Suspense fallback={fallback}>
        {components.map(({ componentId, component }) => (
          <DynamicComponent
            key={componentId}
            componentId={componentId}
            componentElement={component}
          />
        ))}
      </Suspense>
    </>
  );
}
