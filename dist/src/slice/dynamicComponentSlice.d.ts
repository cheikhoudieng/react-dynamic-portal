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
export interface RootState {
    dynamicComponent: ComponentsState;
}
export declare const initializeComponents: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "dynamicComponent/initializeComponents">, activateComponent: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    componentId: string;
    props?: Record<string, any> | null;
}, "dynamicComponent/activateComponent">, deactivateComponent: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    componentId: string;
}, "dynamicComponent/deactivateComponent">, notifyComponent: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    componentId: string;
    notificationId: string | number;
    payload: any;
}, "dynamicComponent/notifyComponent">, removeComponentNotification: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    componentId: string;
    notificationId: string | number;
}, "dynamicComponent/removeComponentNotification">;
export declare const selectComponentStateById: ((state: RootState, componentId: string) => DynamicComponentState) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState;
    memoizedResultFunc: ((resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => DynamicComponentState;
    dependencies: [(state: RootState) => Record<string, DynamicComponentState>, (_: RootState, componentId: string) => string];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectIsComponentActiveById: ((state: RootState, componentId: string) => boolean) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: DynamicComponentState) => boolean;
    memoizedResultFunc: ((resultFuncArgs_0: DynamicComponentState) => boolean) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => boolean;
    dependencies: [((state: RootState, componentId: string) => DynamicComponentState) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    } & {
        resultFunc: (resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState;
        memoizedResultFunc: ((resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState) & {
            clearCache: () => void;
            resultsCount: () => number;
            resetResultsCount: () => void;
        };
        lastResult: () => DynamicComponentState;
        dependencies: [(state: RootState) => Record<string, DynamicComponentState>, (_: RootState, componentId: string) => string];
        recomputations: () => number;
        resetRecomputations: () => void;
        dependencyRecomputations: () => number;
        resetDependencyRecomputations: () => void;
    } & {
        memoize: typeof import("reselect").weakMapMemoize;
        argsMemoize: typeof import("reselect").weakMapMemoize;
    }];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
export declare const selectComponentNotificationsById: ((state: RootState, componentId: string) => Notification[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: DynamicComponentState) => Notification[];
    memoizedResultFunc: ((resultFuncArgs_0: DynamicComponentState) => Notification[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => Notification[];
    dependencies: [((state: RootState, componentId: string) => DynamicComponentState) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    } & {
        resultFunc: (resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState;
        memoizedResultFunc: ((resultFuncArgs_0: Record<string, DynamicComponentState>, resultFuncArgs_1: string) => DynamicComponentState) & {
            clearCache: () => void;
            resultsCount: () => number;
            resetResultsCount: () => void;
        };
        lastResult: () => DynamicComponentState;
        dependencies: [(state: RootState) => Record<string, DynamicComponentState>, (_: RootState, componentId: string) => string];
        recomputations: () => number;
        resetRecomputations: () => void;
        dependencyRecomputations: () => number;
        resetDependencyRecomputations: () => void;
    } & {
        memoize: typeof import("reselect").weakMapMemoize;
        argsMemoize: typeof import("reselect").weakMapMemoize;
    }];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    memoize: typeof import("reselect").weakMapMemoize;
    argsMemoize: typeof import("reselect").weakMapMemoize;
};
declare const _default: import("redux").Reducer<ComponentsState>;
export default _default;
