# Router 指南

## 路由介绍
* 前端路由分为两类：
    * 基于 `hash` 的路由
    * 基于 `history` 的路由
* 区分：
    * 基于 `hash` 的路由：
        * 路由的路径中包含 `#` 符号
        * 例如：`http://localhost:8080/#/home`
        * hash 路由的话是仅作用于当前的页面，hash 值的变化是不会触发页面的刷新的
        * 基于 `hash` 的路由的实现原理是：
            * 监听 `hashchange` 事件
            * 当 `hash` 值发生变化时，根据 `hash` 值来渲染不同的页面
            * 例如：
                * `http://localhost:8080/#/home`
                * `http://localhost:8080/#/about`
                * `http://localhost:8080/#/contact`
        * 兼容性：
            * 所有的浏览器都支持 `hash` 路由
    * 基于 `history` 的路由：
        * 路由的路径中不包含 `#` 符号
        * 例如：`http://localhost:8080/home`
        * `history` 路由的话是作用于整个应用的，路由的变化会触发页面的刷新
        * 基于 `history` 的路由的实现原理是：
            * 监听 `popstate` 事件
            * 当 `history` 栈发生变化时，根据 `history` 栈来渲染不同的页面
            * 例如：
                * `http://localhost:8080/home`
                * `http://localhost:8080/about`
                * `http://localhost:8080/contact`
        * 兼容性：
            * 所有的浏览器都支持 `history` 路由
            * 但是 `history` 路由在 `IE10` 以下的浏览器是不支持的

## 实际开发中混合使用（Vue版本）
### 1. 配置外层的 history 模式
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // /*webpackChunkName: "home"*/ 意思是将组件进行splitchunk到 home 部分
    { path: '/', component: () => import(/*webpackChunkName: "home"*/'@/views/home.vue') },
    { path: '/about', component: () => import(/*webpackChunkName: "about"*/'@/views/about.vue') },
    { path: '/contact', component: () => import(/*webpackChunkName: "contact"*/'@/views/contact.vue') }
  ]
})

export default router
```

### 2. 在页面中主动调度 hash 
```vue
<template>
  <div class="user-info">
    <button @click="changeMode('big')">Big 模式</button>
    <button @click="changeMode('nice')">Nice 模式</button>
    <button @click="changeMode('custom')">自定义模式</button>

    <div v-if="currentMode === 'big'">Big 模式的用户信息渲染...</div>
    <div v-else-if="currentMode === 'nice'">Nice 模式的用户信息渲染...</div>
    <div v-else-if="currentMode === 'custom'">自定义模式的用户信息渲染...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentMode = ref('big');
const getModeFromHash = () => {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  return params.get('mode') || 'big';
};

const handleHashChange = () => {
  currentMode.value = getModeFromHash();
};

onMounted(() => {
  currentMode.value = getModeFromHash();
  window.addEventListener('hashchange', handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});

const changeMode = (mode) => {
  window.location.hash = `mode=${mode}`;
};
</script>
```

## 实际开发中的混合使用（React版本）
### 1. 配置外层的 history 模式
```javascript
import React, { lazy } from 'react';
import { RouterProvider } from 'react-router-dom';

const Home = lazy(() => import('@/views/home'));
const About = lazy(() => import('@/views/about'));
const Contact = lazy(() => import('@/views/contact'));
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> }
]);

export default router;

export function App() {
    return (
        <RouterProvider router={router} />
    )
}
```

### 2. 在页面中主动调度 hash 
```javascript
import { useState, useEffect } from 'react';

const UserInfo = () => {
  const [currentMode, setCurrentMode] = useState('big');

  const getModeFromHash = () => {
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    return params.get('mode') || 'big';
  };

  useEffect(() => {
    setCurrentMode(getModeFromHash());

    const handleHashChange = () => {
      setCurrentMode(getModeFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const changeMode = (mode) => {
    window.location.hash = `mode=${mode}`;
  };

  return (
    <div className="user-info">
      <button onClick={() => changeMode('big')}>Big 模式</button>
      <button onClick={() => changeMode('nice')}>Nice 模式</button>
      <button onClick={() => changeMode('custom')}>自定义模式</button>

      {currentMode === 'big' && <div>Big 模式的用户信息渲染...</div>}
      {currentMode === 'nice' && <div>Nice 模式的用户信息渲染...</div>}
      {currentMode === 'custom' && <div>自定义模式的用户信息渲染...</div>}
    </div>
  );
};

export default UserInfo;
```

## 自定义hashRouter
```typescript
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
```

## 路由跳转的意义
* 对于前端的开发模式中，具备 SPA, MPA两个大的模式
    * SPA 模式： 单页应用模式，整个应用只有一个 html 页面，所有的页面切换都是通过 js 来实现的，比如： vue, react 等
    * MPA 模式： 多页应用模式，每个页面都有一个 html 页面，页面之间的切换是通过 a 标签来实现的，比如： 传统的 html 页面

## MPA
### MPA详解

MPA（Multi-Page Application，多页面应用）是传统Web应用的典型架构，由多个独立的HTML页面组成，每个页面都是一个完整的资源单元，包含自身的HTML结构、CSS样式和JavaScript逻辑。页面之间的跳转本质是从一个HTML文档切换到另一个HTML文档，会触发浏览器的完整页面加载流程。


### 一、MPA的核心特点
1. **独立资源**：每个页面是独立的HTML文件，拥有自己的`head`和`body`
2. **完整刷新**：页面跳转时浏览器会重新请求资源并刷新整个页面
3. **数据隔离**：页面间数据共享依赖全局存储（Cookie、LocalStorage等）
4. **URL直接访问**：每个页面有独立URL，可直接通过URL访问


### 二、MPA中触发页面跳转的方式及行为

#### 1. `<a>`标签跳转（最常用）
通过`<a>`标签的`href`属性指定目标页面，是HTML原生的跳转方式。

```html
<!-- 基本用法 -->
<a href="page2.html">跳转到页面2</a>

<!-- 带参数的跳转 -->
<a href="user.html?id=123&name=test">用户详情</a>

<!-- 跨域跳转 -->
<a href="https://example.com/other.html">跳转到其他域名</a>
```

**关键属性对跳转行为的影响**：
- `target`属性：控制跳转的目标窗口
  - `_self`（默认）：在当前窗口加载新页面，替换当前历史记录
  - `_blank`：在新窗口（或新标签页）加载页面，当前页面保留
  - `_parent`：在父框架中加载（适用于frameset/iframe）
  - `_top`：在顶层框架中加载，打破所有嵌套框架

  ```html
  <!-- 在新标签页打开 -->
  <a href="page2.html" target="_blank">新窗口打开</a>
  
  <!-- 在当前窗口打开 -->
  <a href="page2.html" target="_self">当前窗口打开</a>
  ```

- `rel`属性：指定与目标页面的关系，安全性相关
  - `noopener`：防止新页面通过`window.opener`访问原页面，增强安全性
  - `noreferrer`：不发送Referer头信息，保护来源隐私

  ```html
  <!-- 安全的新窗口跳转 -->
  <a href="page2.html" target="_blank" rel="noopener noreferrer">安全打开新窗口</a>
  ```


#### 2. JavaScript控制跳转
通过`window.location`对象或`window.open()`方法实现跳转，可在跳转前添加逻辑处理。

**(1) `window.location`系列方法**
```javascript
// 1. 最常用，等价于<a href>，会在当前窗口加载新页面
window.location.href = "page2.html";

// 2. 替换当前历史记录，无法通过后退回到原页面
window.location.replace("page2.html");

// 3. 重新加载当前页面（可传入true强制从服务器加载）
window.location.reload();

// 4. 设置hash值（不会触发页面刷新，仅滚动到锚点）
window.location.hash = "#section1";
```

**(2) `window.open()`方法**
专门用于在新窗口/标签页打开页面，返回新窗口的引用。

```javascript
// 基本用法：在新窗口打开page2.html
const newWindow = window.open("page2.html");

// 带参数的用法
const newWindow = window.open(
  "page2.html",        // URL
  "newPage",           // 窗口名称（可用于target属性引用）
  "width=500,height=300,top=100,left=100"  // 窗口特征
);

// 关闭新窗口
if (newWindow) newWindow.close();
```

**与`<a target="_blank">`的区别**：
- `window.open()`可在JS逻辑中动态控制（如验证通过后才打开）
- 可指定新窗口的尺寸、位置等特征
- 可能被浏览器 popup 拦截器阻止（用户主动触发的事件中调用更安全）


#### 3. 表单提交跳转
通过表单提交数据到服务器，服务器返回新页面或重定向到其他页面。

```html
<form action="submit.html" method="get">
  <input type="text" name="username">
  <button type="submit">提交（GET方式）</button>
</form>

<form action="submit.html" method="post">
  <input type="text" name="username">
  <button type="submit">提交（POST方式）</button>
</form>
```

**特点**：
- `method="get"`：参数会拼接在URL上（`submit.html?username=xxx`）
- `method="post"`：参数在请求体中发送，URL不显示
- 提交后会在当前窗口加载`action`指定的页面
- 可通过`target`属性指定在新窗口打开结果页


#### 4. 服务器端重定向
服务器处理请求后返回重定向响应（状态码301/302），浏览器自动跳转到新URL。

**常见场景**：
- 登录后跳转到首页（302临时重定向）
- 页面永久迁移到新地址（301永久重定向）

**实现示例（Node.js/Express）**：
```javascript
// 临时重定向
app.get('/old', (req, res) => {
  res.redirect(302, '/new'); // 状态码可省略，默认302
});

// 永久重定向
app.get('/permanent-old', (req, res) => {
  res.redirect(301, '/permanent-new');
});
```


### 三、页面跳转涉及的关键技术点

#### 1. 浏览器处理流程
无论哪种跳转方式，浏览器处理新页面的核心流程一致：
```
1. 解析新URL，判断是否同域
2. 若跨域，检查是否允许跳转（如CORS限制）
3. 中断当前页面的所有网络请求和JS执行
4. 发送新页面的HTTP请求
5. 接收并解析新HTML，重新构建DOM树和CSSOM树
6. 请求HTML中引用的所有资源（JS、CSS、图片等）
7. 执行新页面的JS代码，触发DOMContentLoaded和load事件
```


#### 2. 历史记录管理
- `_self`跳转：新页面会替换当前历史记录条目（除非使用`pushState`）
- `_blank`跳转：新窗口有独立的历史记录，与原窗口无关
- 后退/前进按钮：只能操作当前窗口的历史记录栈


#### 3. 数据传递方式
MPA页面间数据共享受限于HTTP协议特性，常见方式：

| 方式 | 特点 | 适用场景 |
|------|------|----------|
| URL参数 | 明文显示，长度有限制 | 简单参数（ID、页码等） |
| Cookie | 容量小（4KB），随请求发送 | 身份认证、用户偏好 |
| LocalStorage | 容量较大（5-10MB），持久化 | 复杂数据、离线存储 |
| SessionStorage | 会话级存储，关闭窗口消失 | 同会话内的页面共享 |
| PostMessage | 跨窗口通信，可用于不同域名间通信 | 不同窗口/标签页间数据传递 |
| 服务器存储 | 数据库/缓存中保存 | 敏感数据、跨设备共享 |


#### 4. 性能与用户体验
- **白屏问题**：跳转时会出现短暂白屏（取决于资源加载速度）
- **优化手段**：
  - 资源缓存（合理设置Cache-Control）
  - 减少关键资源体积（压缩HTML/CSS/JS）
  - 预加载关键资源（`<link rel="preload">`）
  - 骨架屏/loading状态提示


#### 5. 安全性考量
- **XSS风险**：URL参数需要过滤，避免插入恶意脚本
- **CSRF防护**：重要操作（如支付）需要验证Token
- **新窗口安全**：使用`rel="noopener"`防止`window.opener`被滥用
- **跨域限制**：浏览器同源策略限制跨域页面的直接交互


### 四、`_self`与`_blank`跳转的核心区别

| 维度 | `_self`跳转 | `_blank`跳转 |
|------|-------------|--------------|
| 窗口行为 | 在当前窗口加载新页面 | 打开新窗口/标签页加载 |
| 历史记录 | 替换当前历史条目（普通跳转） | 新窗口有独立历史记录 |
| 资源释放 | 当前页面资源被完全释放 | 原页面资源保持加载状态 |
| 数据共享 | 可通过localStorage等共享 | 需通过postMessage跨窗口通信 |
| 性能影响 | 单次页面加载开销 | 额外窗口的内存占用 |
| 适用场景 | 应用内正常导航 | 外部链接、辅助页面 |


### 总结
MPA的页面跳转本质是HTML文档的完整替换，触发浏览器的标准加载流程。不同的跳转方式（`<a>`标签、JS控制、表单提交等）各有适用场景，而`target`属性（尤其是`_self`和`_blank`）直接影响跳转的窗口行为和资源处理方式。

在实际开发中，需根据业务需求选择合适的跳转方式，并关注性能优化（如缓存策略）和安全性（如跨域限制、参数过滤）等关键问题。

## 注意事项
* 在 MPA 的架构的开发中我们是将多个 SPA 畸形内嵌实现的
* 通过 SPA 实现内部的单独每个页面的跳转
* 但是在 MPA 中的话，我们通过的是很多原生 API 来实现的跳转逻辑
* 通过我们在 MPA 中可能会在某些时刻进行重新加载一些逻辑，此时就需要监听很多其他的事件了
    * 比如：
        * 页面重新加载
        * 页面关闭
        * 页面切换