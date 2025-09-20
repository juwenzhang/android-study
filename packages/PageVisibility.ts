// 自定义事件类型
export type VisibilityEventType = 
    'viewShow' 
    | 'viewHide' 
    | 'initialLoad' 
    | 'beforeUnload'
    | 'visibilitychange'
    | 'viewLoad'
    | 'viewUnload'
    | 'viewBeforeUnload';


// 定义事件触发来源
export type TriggerSource = 
    'visibilitychange' 
    | 'focus' 
    | 'blur' 
    | 'hybrid' 
    | 'load' 
    | 'unload'
    | 'beforeunload';

// 页面枚举状态定义    
export const PageState = {
    HIDDEN: 'hidden' as const,
    VISIBLE: 'visible' as const,
    LOADING: 'loading' as const,
    UNLOADED: 'unloaded' as const,
    UNLOADING: 'unloading' as const,
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
    priority: number;
    condition?: () => boolean;
    lastTriggered?: number;  // 最后的触发事件定义
}

// option interface
interface AdvancePageVisibilityOptions {
    debug?: boolean;
    defaultPageState?: number;
    hybirdCheckInterval?: number;
    maxCallbackExecutionTime?: number;  // 设置的是回调的最大时间设置
}

class PageVisibilityUtils {
    private static instance: PageVisibilityUtils;
    private callbacks: Map<string, CallbackWrapper> = new Map();
    private visibilityProps: { hidden: string; event: string };
    private currentState: PageState = PageState.LOADING; // 当前页面状态
    private previousState: PageState = PageState.LOADING; // 上一个页面状态
    private hybridInitialized: boolean = false;
    private isDestroyed: boolean = false;
    private options: Required<AdvancePageVisibilityOptions>;
    private eventIdCounter: number = 0;
    private hybridCheckTimer?: number;

    private constructor(options: AdvancePageVisibilityOptions) {
        this.options = {
            debug: options.debug ?? false,
            defaultPageState: options.defaultPageState ?? 5,
            hybirdCheckInterval: options.hybirdCheckInterval ?? 1000,
            maxCallbackExecutionTime: options.maxCallbackExecutionTime ?? 3000,
        }

        // 初始化可见性
        this.visibilityProps = this.getVisibilityProps();
        // 初始化事件监听
        this.initEventListeners();
        // 初始化页面状态
        this.trackInitialState();
    }

    // 单例模式
    static getInstance(option?: AdvancePageVisibilityOptions): PageVisibilityUtils {
        if (!PageVisibilityUtils.instance) {
            PageVisibilityUtils.instance = new PageVisibilityUtils(option ?? {});
        }
        return PageVisibilityUtils.instance;
    }

    // 处理浏览器兼容问题，获取得到最终的兼容工具
    private getVisibilityProps(): { hidden: string; event: string } {
        if (typeof document === 'undefined') {
            return {
                hidden: 'hidden',
                event: 'visibilitychange',
            }
        }

        if ('hidden' in document) {
            return {
                hidden: 'hidden',
                event: 'visibilitychange',
            }
        }

        // 处理 webkit 浏览器兼容问题
        if ('webkithidden' in document) {
            return {
                hidden: 'webkitHidden',
                event: 'webkitvisibilitychange',
            }
        }

        // 处理 moz
        if ('mozHidden' in document) {
            return {
                hidden: 'mozHidden',
                event: 'mozvisibilitychange',
            }
        }

        if ('msHidden' in document) {
            return {
                hidden: 'msHidden',
                event: 'msvisibilitychange',
            }
        }

        // 最后的兜底操作
        return {
            hidden: 'hidden',
            event: 'visibilitychange',
        }
    }

    // 初始化事件监听函数
    private initEventListeners(): void {
        // 监听页面的可见性
        document.addEventListener(
            this.visibilityProps.event,
            this.handleVisibilityChange.bind(this)
        )

        // 绑定点击事件
        window.addEventListener(
            'focus', 
            this.handleFocus.bind(this)
        )
        window.addEventListener(
            'blur',
            this.handleBlur.bind(this)
        )

        // 绑定页面的加载事件
        window.addEventListener(
            'load',
            this.handleLoad.bind(this)
        )
        window.addEventListener(
            'beforeunload', 
            this.handleBeforeUnload.bind(this)
        );
        window.addEventListener(
            'unload',
            this.handleUnload.bind(this)
        )

        // 初始化 Hybird 环境监听器
        this.initHybridListener();
        // 开启 Hybird 环境检查
        this.startHybridCheck()
    }

    private initHybridListener(): void {
        if (this.hybridInitialized) {
            return;
        }
        // 注意，这里会根据原生NA端的动态实现判断
        // 因为原生NA端是可以为我们提供原生APP的事件监听的，注入我们的 window object 的呐：
        /**
         * 微信：micromessageJSHybird
         * 微博：weiboJSHybird
         * 淘宝：taobaoJSHybird
         * 网盘：wpJSHybird
         * ....
         */
        this.hybridInitialized = true;
    }

    private startHybridCheck(): void {
        if (this.hybridCheckTimer) {
            return;
        }
        this.hybridCheckTimer = window.setInterval(() => {
            if (!this.hybridInitialized) {
                return;
            }
            else {
                window.clearInterval(this.hybridCheckTimer);
                this.hybridCheckTimer = undefined;
            }
        }, this.options.hybirdCheckInterval);
    }

    private trackInitialState(): void {
        if (document.readyState === 'complete') {
            this.handleLoad();
        }
        else {
            // 页面还处于加载中
            this.updateState(PageState.LOADING);
        }
    }

    // 可见性变化函数
    private handleVisibilityChange(): void {
        const isHidden = document[this.visibilityProps.hidden];
        const source: TriggerSource = 'visibilitychange';

        if (isHidden && this.currentState !== PageState.HIDDEN) {
            this.updateState(PageState.HIDDEN, source);
            this.triggerCallbacks('viewHide', source);
        }
        else if (!isHidden && this.currentState !== PageState.VISIBLE) {
            this.updateState(PageState.VISIBLE, source);
            this.triggerCallbacks('viewShow', source);
        }
    }

    // 处理焦点获取
    private handleFocus(): void {
        const source: TriggerSource = 'focus';
        if (this.currentState !== PageState.VISIBLE) {
            this.updateState(PageState.VISIBLE, source);
            this.triggerCallbacks('viewShow', source);
        }
    }

    // 处理焦点丢失
    private handleBlur(): void {
        const source: TriggerSource = 'blur';
        if (this.currentState !== PageState.HIDDEN) {
            this.updateState(PageState.HIDDEN, source);
            this.triggerCallbacks('viewHide', source);
        }
    }

    private handleLoad(): void {
        const source: TriggerSource = 'load';
        if (this.currentState !== PageState.VISIBLE) {
            this.updateState(PageState.VISIBLE, source);
            this.triggerCallbacks('viewShow', source);
        }
    }

    // 处理页面卸载
    private handleUnload(): void {
        const source: TriggerSource = 'unload';
        if (this.currentState !== PageState.UNLOADED) {
            this.updateState(PageState.UNLOADED, source);
            this.triggerCallbacks('viewUnload', source);
        }
    }

    private handleBeforeUnload(): void {
        const source: TriggerSource = 'beforeunload';
        if (this.currentState !== PageState.UNLOADING) {
            this.updateState(PageState.UNLOADING, source);
            this.triggerCallbacks('viewBeforeUnload', source);
        }
    }

    private handleHybridVisibilityChange(isVisible: boolean): void {
        const source: TriggerSource = 'hybrid';
        
        if (isVisible && this.currentState !== PageState.VISIBLE) {
            this.updateState(PageState.VISIBLE, source);
            this.triggerCallbacks('viewShow', source);
        } else if (!isVisible && this.currentState !== PageState.HIDDEN) {
            this.updateState(PageState.HIDDEN, source);
            this.triggerCallbacks('viewHide', source);
        }
    }

    private updateState(newState: PageState, source?: TriggerSource): void {
        if (this.currentState === newState) {
            return;
        }
        this.previousState = this.currentState;
        this.currentState = newState;
    }

    private async triggerCallbacks(type: VisibilityEventType, source: TriggerSource): Promise<void> {
        if (this.isDestroyed) {
            return;
        }
        const timestamp = performance.now();
        const callbacks = Array.from(this.callbacks.values())
            .filter(callback => callback.type === type)  // 过滤出需要的部分
            .sort(((a, b) => b.priority - a.priority));  // 进行优先级排序

        for (const cb of callbacks) {
            if (cb.condition && !cb.condition()) {
                continue;
            }
            try {
                const start_time = performance.now();
                const res = cb.callback({
                    type,
                    source,
                    timestamp,
                    previousState: this.previousState,
                    currentState: this.currentState,
                });

                if (res instanceof Promise) {
                    await Promise.race([
                        res as Promise<void>,
                        new Promise((_, reject) => {
                            setTimeout(() => 
                                reject(new Error('Callback timeout')), this.options.maxCallbackExecutionTime
                            );
                        }),
                    ]);
                }
                cb.lastTriggered = timestamp;
                if (cb.once) {
                    this.offById(cb.id);
                }
            }
            catch (_) {
                console.error(`Error in ${type} callback:`, _);
                continue;
            }
        }
    }

    on(
        type: VisibilityEventType,
        callback: VisibilityCallback,
        options: {
            once?: boolean;
            namespace?: string;
            priority?: number;
            condition?: () => boolean;
        } = {}
    ): string | undefined {
        if (this.isDestroyed) {
            return;
        }
        if (typeof callback !== 'function') {
            return;
        }

        const UniqueId = `event_${this.eventIdCounter}_${performance.now()}`;

        const cb = {
            id: UniqueId,
            type,
            callback,
            once: options.once ?? false,
            namespace: options.namespace ?? '',
            priority: options.priority ?? 0,
            condition: options.condition ?? (() => true),
            lastTriggered: 0,
        };
        this.callbacks.set(UniqueId, cb);
        return UniqueId;
    }

    once(
        type: VisibilityEventType,
        callback: VisibilityCallback,
        options: Omit<Parameters<PageVisibilityUtils['on']>[2], 'once'> = {}
    ): string | undefined {
        return this.on(type, callback, {
            ...options,
            once: true,
        });
    }

    offById(id: string): boolean {
        if (this.callbacks.has(id)) {
            this.callbacks.delete(id);
            return true;
        }
        return false;
    }

    off(
        type: VisibilityEventType,
        callback?: VisibilityCallback,
        namespace?: string
    ): number {
        let removedCount = 0;
        for (const [id, cb] of this.callbacks) {
            if (cb.type !== type) continue;
            if (callback && cb.callback !== callback) continue;
            if (namespace && cb.namespace !== namespace) continue;
            this.callbacks.delete(id);
            removedCount++;
        }
        return removedCount;
    }

    offByNamespace(namespace: string): number {
        let removedCount = 0;
        for (const [id, cb] of this.callbacks) {
            if (cb.namespace !== namespace) continue;
            this.callbacks.delete(id);
            removedCount++;
        }
        return removedCount;
    }

    getCurrentState(): PageState {
        return this.currentState;
    }

    getStatus(): {
        total: number;
        byType: Record<VisibilityEventType, number>,
        byNamespace: Record<string, number>,
    } {
        const status = {
            total: this.callbacks.size,
            byType: {} as Record<VisibilityEventType, number>,
            byNamespace: {} as Record<string, number>,
        }

        const visibilityEventTypes: VisibilityEventType[] = [
            'viewShow',
            'viewHide',
            'initialLoad',
            'beforeUnload'
        ];
        visibilityEventTypes.forEach(type => {
            status.byType[type as VisibilityEventType] = 0;
        })

        this.callbacks.forEach(cb => {
            status.byType[cb.type]++;
            if (cb.namespace) {
                status.byNamespace[cb.namespace] = (status.byNamespace[cb.namespace] || 0) + 1;
            }
        })

        return status;
    }

    private log(message: string, level: 'log' | 'warn' | 'error' = 'log'): void {
        if (this.options.debug) {
            console[level](`[AdvancedPageVisibility] ${message}`);
        }
    }

    destroy(): void {
        if (this.isDestroyed) {
            return
        };
        this.callbacks.clear();
        document.removeEventListener(
            this.visibilityProps.event,
            this.handleVisibilityChange.bind(this)
        );
        window.removeEventListener('focus', this.handleFocus.bind(this));
        window.removeEventListener('blur', this.handleBlur.bind(this));
        window.removeEventListener('load', this.handleLoad.bind(this));
        window.removeEventListener('unload', this.handleUnload.bind(this));
        window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        if (this.hybridCheckTimer) {
        window.clearInterval(this.hybridCheckTimer);
        this.hybridCheckTimer = undefined;
        }
        this.isDestroyed = true;
    
        PageVisibilityUtils.instance = null as unknown as PageVisibilityUtils;
    }
}

const getPageVisibilityUtils = (options: AdvancePageVisibilityOptions) => {
    return PageVisibilityUtils.getInstance(options);
}
