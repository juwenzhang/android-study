// 路由记录
export interface RouteRecord<T> {
    path: string;
    name?: string;
    component: T;
    children?: RouteRecord<T>[];
    redirect?: string;
    meta?: Record<string, unknown>;  // 元数据
}

// 路由匹配信息
export interface RouteMatch<T> {
    route: RouteRecord<T>;
    params?: Record<string, string>;  // 动态路由
    path: string;
    fullpath: string;
}

// 定义导航守卫类型
export type NavigationGuard<T> = (
    to: RouteMatch<T> | null,
    from: RouteMatch<T> | null,
    next: (to?: string | false) => void
) => void;

// 定义路由事件类型
export type RouterEvent = 'beforeEach' | 'afterEach';

// hash 路由的实现
class HashRouter<T> {
    private routes: RouteRecord<T>[];
    private currentRoute: RouteMatch<T> | null = null;
    private beforeEachGuards: NavigationGuard<T>[] = [];
    private afterEachGuards: NavigationGuard<T>[] = [];
    private isInitialized: boolean = true;

    private constructor(routes: RouteRecord<T>[]) {
        this.routes = this.flattenRoutes(routes);
        this.init();
    }

    // 静态方法，创建路由实例
    static getInstance<T>(routes: RouteRecord<T>[]): HashRouter<T> {
        return new HashRouter<T>(routes);
    }

    // 初始化路由
    private init() {
        // 当hash 为空时，默认跳转到首页
        if (!window.location.hash) {
            window.location.hash = '/';
        }

        // 全局监视hash的变化
        window.addEventListener('hashchange', this.handleHashChange.bind(this));

        // 初始化的时候，触发一次hashchange 事件
        this.handleHashChange();
    }

    // 实现扁平化路由
    private flattenRoutes(routes: RouteRecord<T>[], parentPath = ''): RouteRecord<T>[] {
        let flattened: RouteRecord<T>[] = [];
        
        // 获取得到每个路由
        for (const route of routes) {
            const fullpath = parentPath 
                ? `${parentPath}/${this.trimPath(route.path)}` 
                : this.trimPath(route.path);
            flattened.push({ 
                ...route, 
                path: fullpath 
            });
            // 子路由的处理
            if (route.children && route.children.length > 0) {
                // 这里不要直接推送 push 进入数组
                flattened = [...flattened, ...this.flattenRoutes(route.children, fullpath)]
            }
        }
        return flattened;
    }

    private trimPath(path: string): string {
        return path.replace(/^\/+|\/+$/g, '');
    }

    private getCurrentHash(): string {
        return window.location.hash.slice(1) || '/';
    }

    // 处理hash 的变化
    private handleHashChange(): void {
        const currentHash = this.getCurrentHash();
        const matchedRoute = this.matchRoute(currentHash);

        if (!matchedRoute) {
            return;
        }

        if (matchedRoute.route.redirect) {
            this.push(matchedRoute.route.redirect);
            return;
        }

        // 执行路由导航
        this.runBeforeEachHooks(matchedRoute, () => {
            const previousRoute = this.currentRoute;
            this.currentRoute = matchedRoute;
            
            this.runAfterEachHooks(matchedRoute, previousRoute);

            if (this.isInitialized) {
                this.isInitialized = false;
            }
            else {
                window.dispatchEvent(new PopStateEvent(
                    'popstate', 
                    {
                        state: matchedRoute
                    }
                ));
            }
        })
    }

    private matchRoute(path: string): RouteMatch<T> | null | undefined {
        const normalizedPath = this.normalizePath(path);

        for (const route of this.routes) {
            const normalizedRoutePath = this.normalizePath(route.path);
            const params: Record<string, string> | null = this.extractParams(normalizedRoutePath, normalizedPath);
            if (normalizedRoutePath === normalizedPath) {
                return {
                    route,
                    params: params || {},
                    path: normalizedPath,
                    fullpath: `#${normalizedPath}`
                }
            }
        }

        return null;
    }

    private normalizePath(path: string): string {
        let normalized = this.trimPath(path).toLowerCase();
        return normalized ? `/${normalized}/` : '/';
    }

    // 获取得到对应的动态路由参数
    private extractParams(routePath: string, currentPath: string): Record<string, string> | null {
        const routeSegments = routePath.split('/').filter(Boolean);
        const currentSegments = currentPath.split('/').filter(Boolean);
        
        if (routeSegments.length !== currentSegments.length) {
            return null;
        }

        const params: Record<string, string> = {};
        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const currentSegment = currentSegments[i];
            
            if (routeSegment.startsWith(':')) {
                params[routeSegment.slice(1)] = currentSegment;
            }
            else if (routeSegment !== currentSegment) {
                return null;
            }
        }
        return params;
    }

    private runBeforeEachHooks(to: RouteMatch<T>, callback: () => void): void {
        const from = this.currentRoute;
        let index = 0;

        // 这里使用的是箭头函数，但是如何使用的是 function 函数的形式的话就需要提前预留 this 
        // 自己的基础知识的运用了
        // const _this = this;
        const next = (path?: string | boolean) => {
            if (typeof path === 'string') {
                this.push(path);
                return;
            }

            if (typeof path === 'boolean' && path === false) {
                return;
            }

            if (index < this.beforeEachGuards.length) {
                this.beforeEachGuards[index++](to, from, next);
            }
            else {
                callback();
            }
        }
        // 初始化的时候需要调用一次
        next();
    }

    private runAfterEachHooks(to: RouteMatch<T>, from: RouteMatch<T> | null): void {
        this.afterEachGuards.forEach(hook => {
            hook(to, from, () => {
                // 不做任何的处理， chalk 的日志处理是可以的（但是这不是node环境，直接 console.log()就行了）
            });
        })
    }

    push(path: string): void {
        window.location.hash = path;        
    }

    replace(path: string): void {
        const newUrl = window.location.href.replace(/#.*/, `#${path}`);
        window.history.replaceState(null, '', newUrl);
        this.handleHashChange();
    }

    goBack(): void {
        window.history.back();
    }

    goForward(): void {
        window.history.forward();
    }

    // 注册事件
    on(event: 'beforeEach', hook: NavigationGuard<T>): void;
    on(event: 'afterEach', hook: NavigationGuard<T>): void;
    on(event: RouterEvent, hook: NavigationGuard<T>): void {
        if (event === 'beforeEach') {
            this.beforeEachGuards.push(hook);
        }
        else if (event === 'afterEach') {
            this.afterEachGuards.push(hook);
        }
    }

    get getCurrentRoute(): RouteMatch<T> | null {
        return this.currentRoute;
    }

    destory(): void {
        window.removeEventListener('hashchange', this.handleHashChange.bind(this));
        this.beforeEachGuards = [];
        this.afterEachGuards = [];
        this.currentRoute = null;
    }
}

// 使用的是单例模式
export const InitHashRouter = <T>(routes: RouteRecord<T>[]) => {
    return HashRouter.getInstance(routes);
}