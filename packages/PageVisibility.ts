// 自定义事件类型
export type VisibilityEventType = 
    'viewShow' 
    | 'viewHide' 
    | 'initialLoad' 
    | 'beforeUnload';

// 定义事件触发来源
export type TriggerSource = 
    'visibilityChange'
    | 'focus'
    | 'hybird'
    | 'load'
    | 'unload';

// 页面枚举状态定义    
export const PageState = {
    HIDDEN: 'hidden' as const,
    VISIBLE: 'visible' as const,
    LOADING: 'loading' as const,
    UNLOADED: 'unloaded' as const
};
export type PageState = typeof PageState[keyof typeof PageState];

// 定义事件回调类型
export type VisibilityCallback = (
    event: {
        type: VisibilityEventType;
        source: TriggerSource;
        timestamp: number;
        previousState: PageState;
        currentState: PageState;
    }
 ) => void | Promise<void>;

// 事件包装器
interface CallbackWrapper {
    id: string;
    type: VisibilityEventType;
    callback: VisibilityCallback;
    once?: boolean;
    namespace?: string;
    priority?: number;
    condition?: () => boolean;
    lastTriggered?: number;  // 最后的触发事件定义
}

// option interface
interface AdvancePageVisibilityOptions {
    debug?: boolean;
    defaultPageState?: number;
    hybirdCheckInterval?: number;
    maxCallbackExecutionTime?: number;
}