import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

// --- Type Definitions ---
export interface Notification {
  id: string | number;
  payload: any;
}

export interface DynamicComponentState {
  id: string;
  isActive: boolean;
  props: Record<string, any> | null;
  notifications: Notification[];
}

export interface ComponentsState {
  components: Record<string, DynamicComponentState>;
}

// Typage global du state Redux pour éviter l'utilisation de 'any' dans les sélecteurs
export interface RootState {
  dynamicComponent: ComponentsState;
}

// --- Initial State ---
const generateInitialState = (registeredIds: string[] = []): ComponentsState => {
  const initialState: ComponentsState = {
    components: {},
  };
  registeredIds.forEach((id) => {
    initialState.components[id] = {
      id: id,
      isActive: false,
      props: null,
      notifications: [],
    };
  });
  return initialState;
};

// --- Slice Definition ---
const dynamicComponentSlice = createSlice({
  name: 'dynamicComponent',
  initialState: generateInitialState(),
  reducers: {
    initializeComponents: (state: ComponentsState, action: PayloadAction<string[]>) => {
      const registeredIds = action.payload;
      const initialState = generateInitialState(registeredIds);
      state.components = initialState.components;
    },

    activateComponent: (
      state: ComponentsState,
      action: PayloadAction<{ componentId: string; props?: Record<string, any> | null }>
    ) => {
      const { componentId, props = null } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.isActive = true;
        component.props = props;
      } else {
        console.warn(`[dynamicComponentSlice] activateComponent: Component ID "${componentId}" not found.`);
      }
    },

    deactivateComponent: (
      state: ComponentsState,
      action: PayloadAction<{ componentId: string }>
    ) => {
      const { componentId } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.isActive = false;
        component.props = null;
      } else {
        console.warn(`[dynamicComponentSlice] deactivateComponent: Component ID "${componentId}" not found.`);
      }
    },

    notifyComponent: (
      state: ComponentsState,
      action: PayloadAction<{ componentId: string; notificationId: string | number; payload: any }>
    ) => {
      const { componentId, notificationId, payload } = action.payload;
      const component = state.components[componentId];
      if (component) {
        const existingIndex = component.notifications.findIndex((n: Notification) => n.id === notificationId);
        const newNotification: Notification = { id: notificationId, payload };

        if (existingIndex !== -1) {
          component.notifications[existingIndex] = newNotification;
        } else {
          component.notifications.push(newNotification);
        }
      } else {
        console.warn(`[dynamicComponentSlice] notifyComponent: Component ID "${componentId}" not found.`);
      }
    },

    removeComponentNotification: (
      state: ComponentsState,
      action: PayloadAction<{ componentId: string; notificationId: string | number }>
    ) => {
      const { componentId, notificationId } = action.payload;
      const component = state.components[componentId];
      if (component) {
        component.notifications = component.notifications.filter((n: Notification) => n.id !== notificationId);
      }
    },
  },
});

// --- Actions ---
export const {
  initializeComponents,
  activateComponent,
  deactivateComponent,
  notifyComponent,
  removeComponentNotification,
} = dynamicComponentSlice.actions;

// --- Selectors ---
const selectComponentsState = (state: RootState) => state.dynamicComponent.components;

export const selectComponentStateById = createSelector(
  [selectComponentsState, (_: RootState, componentId: string) => componentId],
  (components: Record<string, DynamicComponentState>, componentId: string) => components[componentId]
);

export const selectIsComponentActiveById = createSelector(
  [selectComponentStateById],
  (componentState: DynamicComponentState | undefined) => !!componentState?.isActive
);

export const selectComponentNotificationsById = createSelector(
  [selectComponentStateById],
  (componentState: DynamicComponentState | undefined): Notification[] => componentState?.notifications ?? []
);

// --- Reducer ---
export default dynamicComponentSlice.reducer;
