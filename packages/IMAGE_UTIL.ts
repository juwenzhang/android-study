/**
 * @description 图片工具库
 * @author juwenzhang
 */

// 扩展Window接口声明，以支持React和Vue类型
interface Window {
    Vue?: any;
    React?: any;
    imageUtilsPreview?: HTMLElement;
    navigator?: Navigator;
}

// 框架组件选项接口定义
export interface FrameworkComponentOptions {
    type?: 'table' | 'image';
    framework?: 'react' | 'vue' | 'vanilla';
    [key: string]: any;
}

// 全局环境检测
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';
const isReact = isBrowser && typeof (window as any).React !== 'undefined' && typeof (window as any).React.createElement === 'function';
const isVue = isBrowser && typeof (window as any).Vue !== 'undefined';

// 跨端环境检测
const isAndroid = isBrowser && navigator.userAgent.toLowerCase().includes('android');
const isIOS = isBrowser && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isDesktop = isBrowser && !isAndroid && !isIOS;

/**
 * 获取当前操作系统平台
 */
export const getPlatform = (): 'android' | 'ios' | 'desktop' | 'unknown' => {
    if (isBrowser) {
        // 优先检查用户代理字符串
        const userAgent = navigator.userAgent.toLowerCase();
        
        // 更精确的移动设备检测
        if (/android/.test(userAgent)) {
            return 'android';
        } else if (/(iphone|ipad|ipod)/.test(userAgent)) {
            return 'ios';
        } 
        
        // 检测桌面环境
        const isMobile = /(mobile|tablet)/.test(userAgent) || 
                        window.innerWidth <= 768 || 
                        navigator.maxTouchPoints > 0;
        
        return isMobile ? 'unknown' : 'desktop';
    }
    return 'unknown';
};

// RequestIdleCallback相关类型定义
export interface RequestIdleCallbackOptions {
    timeout?: number;
}

export interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): number;
}

export type RequestIdleCallbackHandle = number;

export type RequestIdleCallbackCallback = (deadline: RequestIdleCallbackDeadline) => void;

/**
 * requestIdleCallback的polyfill实现
 */
export const requestIdleCallback: (callback: RequestIdleCallbackCallback, options?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle = 
    window.requestIdleCallback ||
    ((callback: RequestIdleCallbackCallback, options?: RequestIdleCallbackOptions) => {
        const startTime = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => {
                    return Math.max(0, 50 - (Date.now() - startTime));
                }
            });
        }, 1) as unknown as RequestIdleCallbackHandle;
    });

/**
 * cancelIdleCallback的polyfill实现
 */
export const cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void = 
    window.cancelIdleCallback ||
    ((handle: RequestIdleCallbackHandle) => {
        clearTimeout(handle as unknown as number);
    });

// 图片加载状态类型
export type ImageLoadStatus = 'success' | 'error' | 'loading';

// 图片加载结果接口
export interface ImageLoadResult {
    status: ImageLoadStatus;
    url: string;
    width?: number;
    height?: number;
    error?: Error;
    loadTime?: number;
}

// 图片加载选项接口
export interface ImageLoadOptions {
    timeout?: number;
    signal?: AbortSignal;
    onProgress?: (loaded: number, total: number, result: ImageLoadResult) => void;
    securityCheck?: boolean;
    maxSize?: number;
    quality?: number;
}

// 图片安全性验证选项
export interface ImageSecurityOptions {
    allowedDomains?: string[];
    checkContentType?: boolean;
    maxFileSize?: number;
}

// 图片质量选项
export interface ImageQualityOptions {
    quality?: number; // 0-1之间的值
    type?: string; // 'image/jpeg', 'image/png', 'image/webp'等
    maxWidth?: number;
    maxHeight?: number;
    preserveAspectRatio?: boolean;
}

// 图片加密选项
export interface ImageEncryptionOptions {
    password?: string;
    method?: 'simple' | 'advanced';
}

// 图片渲染配置
export interface ImageRenderConfig {
    containerId?: string; // DOM渲染时使用
    dataSource: Array<{[key: string]: any}>;
    imageColumns: string[];
    onRenderComplete?: () => void;
    maxWidth?: number;
    maxHeight?: number;
    renderMode?: 'dom' | 'html' | 'react' | 'vue';
    customCellRenderer?: (value: any, column: string, row: any) => string | HTMLElement | any; // 新增：自定义单元格渲染器
    customImageRenderer?: (url: string, row: any, column: string) => string | HTMLElement | any; // 新增：自定义图片渲染器
    className?: string;
}

// 框架组件包装接口
export interface _FrameworkComponentOptions {
    imageUtils?: ImageUtils;
    defaultProps?: any;
}

/**
 * 图片缓存管理器 - 单例模式
 * 避免相同链接重复加载，优化性能
 */
export class ImageCacheManager {
    private static instance: ImageCacheManager;
    private cacheResults: Map<string, ImageLoadResult>;
    private loadingPromises: Map<string, Promise<ImageLoadResult>>;

    private constructor() {
        this.cacheResults = new Map();
        this.loadingPromises = new Map();
    }

    /**
     * 获取单例实例
     */
    public static getInstance(): ImageCacheManager {
        if (!ImageCacheManager.instance) {
            ImageCacheManager.instance = new ImageCacheManager();
        }
        return ImageCacheManager.instance;
    }

    /**
     * 检查URL是否已缓存或正在加载
     */
    public has(url: string): boolean {
        return this.cacheResults.has(url) || this.loadingPromises.has(url);
    }

    /**
     * 获取缓存的图片结果
     */
    public get(url: string): ImageLoadResult | undefined {
        return this.cacheResults.get(url);
    }

    /**
     * 设置图片加载中状态
     */
    public setLoading(url: string, promise: Promise<ImageLoadResult>): void {
        this.loadingPromises.set(url, promise);
    }

    /**
     * 设置图片加载完成结果
     */
    public setComplete(url: string, result: ImageLoadResult): void {
        this.cacheResults.set(url, result);
        this.loadingPromises.delete(url);
    }

    /**
     * 清除指定URL的缓存
     */
    public clear(url: string): void {
        this.cacheResults.delete(url);
        this.loadingPromises.delete(url);
    }

    /**
     * 清除所有缓存
     */
    public clearAll(): void {
        this.cacheResults.clear();
        this.loadingPromises.clear();
    }
}

/**
 * 图片工具类
 */
export class ImageUtils {
    private cacheManager: ImageCacheManager;

    constructor() {
        this.cacheManager = ImageCacheManager.getInstance();
    }

    /**
     * 加载单个图片
     */
    public loadImage(url: string, options: ImageLoadOptions = {}): Promise<ImageLoadResult> {
        const { timeout = 30000 } = options;

        // 检查是否已有缓存结果
        if (this.cacheManager.has(url)) {
            const cachedResult = this.cacheManager.get(url);
            if (cachedResult) {
                // 如果已加载完成，直接返回缓存结果
                if (cachedResult.status === 'success' || cachedResult.status === 'error') {
                    return Promise.resolve({ ...cachedResult });
                }
                // 如果正在加载中，返回正在进行的Promise
                const loadingPromise = this.cacheManager.get(url) as any;
                if (loadingPromise && loadingPromise.then) {
                    return loadingPromise as Promise<ImageLoadResult>;
                }
            }
        }

        // 创建新的加载Promise
        const loadPromise = new Promise<ImageLoadResult>((resolve) => {
            const startTime = performance.now();
            const img = new Image();
            
            // 设置超时
            const timeoutId = setTimeout(() => {
                const result: ImageLoadResult = {
                    status: 'error',
                    url,
                    error: new Error(`图片加载超时: ${url}`),
                    loadTime: performance.now() - startTime
                };
                this.cacheManager.setComplete(url, result);
                resolve(result);
            }, timeout);

            // 处理加载成功
            img.onload = () => {
                clearTimeout(timeoutId);
                const result: ImageLoadResult = {
                    status: 'success',
                    url,
                    width: img.width,
                    height: img.height,
                    loadTime: performance.now() - startTime
                };
                this.cacheManager.setComplete(url, result);
                resolve(result);
            };

            // 处理加载失败
            img.onerror = () => {
                clearTimeout(timeoutId);
                const result: ImageLoadResult = {
                    status: 'error',
                    url,
                    error: new Error(`图片加载失败: ${url}`),
                    loadTime: performance.now() - startTime
                };
                this.cacheManager.setComplete(url, result);
                resolve(result);
            };

            // 支持中止操作
            if (options.signal) {
                options.signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                    const result: ImageLoadResult = {
                        status: 'error',
                        url,
                        error: new Error(`图片加载被中止: ${url}`),
                        loadTime: performance.now() - startTime
                    };
                    this.cacheManager.setComplete(url, result);
                    resolve(result);
                });
            }

            // 开始加载图片
            img.src = url;
            // 设置跨域属性以支持获取图片信息
            img.crossOrigin = 'anonymous';
        });

        // 记录正在加载的Promise
        this.cacheManager.setLoading(url, loadPromise);
        return loadPromise;
    }

    /**
     * 批量加载图片
     */
    public async batchLoadImages(
        urls: string[], 
        options: ImageLoadOptions & { concurrency?: number } = {}
    ): Promise<ImageLoadResult[]> {
        const { concurrency = 5, onProgress } = options;
        const results: ImageLoadResult[] = [];
        const total = urls.length;
        let index = 0;
        let activeJobs = 0;
        
        return new Promise((resolve) => {
            // 处理一个图片URL
            const processUrl = async () => {
                if (index >= total && activeJobs === 0) {
                    // 所有图片处理完成
                    resolve(results);
                    return;
                }

                while (index < total && activeJobs < concurrency) {
                    const url = urls[index];
                    index++;
                    activeJobs++;

                    try {
                        // 使用requestIdleCallback在空闲时间加载图片
                        await new Promise<void>((idleResolve) => {
                            requestIdleCallback(() => {
                                idleResolve();
                            }, { timeout: 100 });
                        });

                        const result = await this.loadImage(url, options);
                        results.push(result);

                        // 调用进度回调
                        if (onProgress) {
                            onProgress(results.length, total, result);
                        }
                    } catch (error) {
                        const result: ImageLoadResult = {
                            status: 'error',
                            url,
                            error: error instanceof Error ? error : new Error(String(error))
                        };
                        results.push(result);

                        // 调用进度回调
                        if (onProgress) {
                            onProgress(results.length, total, result);
                        }
                    } finally {
                        activeJobs--;
                        // 继续处理下一批
                        processUrl();
                    }
                }
            };

            // 开始处理
            processUrl();
        });
    }

    /**
     * 获取图片信息（不渲染到DOM）
     */
    public async getImageInfo(url: string, options: { timeout?: number } = {}): Promise<{
        width: number;
        height: number;
        aspectRatio: number;
        loadTime: number;
    }> {
        const result = await this.loadImage(url, options);
        
        if (result.status === 'error' || !result.width || !result.height) {
            throw result.error || new Error(`无法获取图片信息: ${url}`);
        }

        return {
            width: result.width,
            height: result.height,
            aspectRatio: result.width / result.height,
            loadTime: result.loadTime || 0
        };
    }

    /**
     * 图片安全性验证
     */
    public async validateImageSecurity(url: string, options: ImageSecurityOptions = {}): Promise<{
        isValid: boolean;
        message?: string;
    }> {
        try {
            // 验证域名
            if (options.allowedDomains && options.allowedDomains.length > 0) {
                const urlObj = new URL(url);
                const domain = urlObj.hostname;
                
                // 检查是否在允许的域名列表中
                const isAllowed = options.allowedDomains.some(allowedDomain => {
                    // 支持子域名通配符，例如 *.example.com
                    if (allowedDomain.startsWith('*.')) {
                        const baseDomain = allowedDomain.substring(2);
                        return domain === baseDomain || domain.endsWith('.' + baseDomain);
                    }
                    return domain === allowedDomain;
                });
                
                if (!isAllowed) {
                    return {
                        isValid: false,
                        message: `图片域名 ${domain} 不在允许的域名列表中`
                    };
                }
            }

            // 检查内容类型和文件大小
            if (options.checkContentType || options.maxFileSize) {
                const response = await fetch(url, { method: 'HEAD', signal: options.maxFileSize ? undefined : undefined });
                
                // 检查内容类型
                if (options.checkContentType) {
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.startsWith('image/')) {
                        return {
                            isValid: false,
                            message: `不是有效的图片文件类型: ${contentType || '未知'}`
                        };
                    }
                }

                // 检查文件大小
                if (options.maxFileSize) {
                    const contentLength = response.headers.get('content-length');
                    if (contentLength && parseInt(contentLength, 10) > options.maxFileSize) {
                        return {
                            isValid: false,
                            message: `图片大小超过限制: ${contentLength} 字节 > ${options.maxFileSize} 字节`
                        };
                    }
                }
            }

            return {
                isValid: true
            };
        } catch (error) {
            return {
                isValid: false,
                message: `验证失败: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    /**
     * 图片质量降级处理
     */
    public async degradeImageQuality(url: string, options: ImageQualityOptions = {}): Promise<string> {
        const { 
            quality = 0.7, 
            type = 'image/jpeg', 
            maxWidth = 1920, 
            maxHeight = 1080, 
            preserveAspectRatio = true 
        } = options;

        try {
            // 加载图片
            const result = await this.loadImage(url);
            if (result.status === 'error' || !result.width || !result.height) {
                throw result.error || new Error('图片加载失败');
            }

            // 创建canvas元素用于处理图片
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('无法创建Canvas上下文');
            }

            // 计算新的尺寸
            let newWidth = result.width;
            let newHeight = result.height;

            if (preserveAspectRatio) {
                // 按比例缩放
                if (newWidth > maxWidth) {
                    const ratio = maxWidth / newWidth;
                    newWidth = maxWidth;
                    newHeight = Math.floor(newHeight * ratio);
                }
                if (newHeight > maxHeight) {
                    const ratio = maxHeight / newHeight;
                    newHeight = maxHeight;
                    newWidth = Math.floor(newWidth * ratio);
                }
            } else {
                // 直接设置最大尺寸
                newWidth = Math.min(newWidth, maxWidth);
                newHeight = Math.min(newHeight, maxHeight);
            }

            // 设置canvas尺寸
            canvas.width = newWidth;
            canvas.height = newHeight;

            // 绘制图片到canvas
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                img.src = url;
            });

            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // 使用toDataURL获取降级后的图片数据
            return canvas.toDataURL(type, quality);
        } catch (error) {
            // 如果处理失败，返回原始URL
            console.warn('图片质量降级处理失败:', error);
            return url;
        }
    }

    /**
     * 获取图片的Base64编码信息
     */
    public async getImageBase64(url: string, options: { 
        format?: string;
        quality?: number;
        maxWidth?: number;
        maxHeight?: number;
    } = {}): Promise<string> {
        const { 
            format = 'image/png', 
            quality = 1.0,
            maxWidth,
            maxHeight
        } = options;

        try {
            // 创建Image对象
            const img = new Image();
            img.crossOrigin = 'anonymous';

            // 加载图片
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject(new Error(`无法加载图片: ${url}`));
                img.src = url;
            });

            // 创建canvas元素
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('无法创建Canvas上下文');
            }

            // 设置canvas尺寸
            let width = img.width;
            let height = img.height;

            // 处理尺寸限制
            if (maxWidth && width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = Math.floor(height * ratio);
            }

            if (maxHeight && height > maxHeight) {
                const ratio = maxHeight / height;
                height = maxHeight;
                width = Math.floor(width * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // 绘制图片到canvas
            ctx.drawImage(img, 0, 0, width, height);

            // 获取Base64数据
            return canvas.toDataURL(format, quality);
        } catch (error) {
            throw new Error(`获取Base64失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 简单的图片加密处理
     */
    public async encryptImage(url: string, options: ImageEncryptionOptions = {}): Promise<string> {
        const { password = 'default_password', method = 'simple' } = options;

        try {
            // 获取图片的Base64数据
            const base64Data = await this.getImageBase64(url);

            if (method === 'simple') {
                // 简单加密 - 基于Base64的简单变换
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();
                
                // 将Base64数据转换为ArrayBuffer
                const parts = base64Data.split(',');
                const mimeType = parts[0].split(':')[1].split(';')[0];
                const base64WithoutMime = parts[1];
                const binaryString = atob(base64WithoutMime);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // 使用密码生成简单的加密密钥
                let key = 0;
                for (let i = 0; i < password.length; i++) {
                    key += password.charCodeAt(i);
                }

                // 简单的XOR加密
                for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = bytes[i] ^ (key & 0xff);
                }

                // 将加密后的数据转换回Base64
                let encryptedBinaryString = '';
                for (let i = 0; i < bytes.length; i++) {
                    encryptedBinaryString += String.fromCharCode(bytes[i]);
                }
                const encryptedBase64 = btoa(encryptedBinaryString);

                return `data:${mimeType};base64,${encryptedBase64}`;
            }

            // 返回原始Base64（如果不需要加密）
            return base64Data;
        } catch (error) {
            console.error('图片加密失败:', error);
            return url;
        }
    }

    /**
     * 适配表格渲染的图片链接动态渲染功能
     */
    public async renderTableImages(config: ImageRenderConfig): Promise<void | string> {
        const { 
            containerId, 
            dataSource, 
            imageColumns = [], 
            onRenderComplete, 
            maxWidth = 120, 
            maxHeight = 80,
            renderMode = 'dom',
            customCellRenderer,
            customImageRenderer,
            className = 'image-utils-table'
        } = config;

        try {
            // 根据渲染模式选择不同的实现
            switch (renderMode) {
                case 'html':
                    // 返回HTML字符串
                    return this.renderTableAsHtml({
                        dataSource,
                        imageColumns,
                        maxWidth,
                        maxHeight,
                        customCellRenderer,
                        customImageRenderer,
                        className
                    });
                    
                case 'react':
                    // React模式 - 检查React是否可用
                    if (isReact && typeof (window as any).React === 'object') {
                        return this.renderTableForReact({
                            dataSource,
                            imageColumns,
                            maxWidth,
                            maxHeight,
                            customCellRenderer,
                            customImageRenderer,
                            className
                        });
                    } else {
                        console.warn('React环境未检测到，回退到DOM渲染模式');
                        return this.renderTableAsDom({
                            containerId,
                            dataSource,
                            imageColumns,
                            onRenderComplete,
                            maxWidth,
                            maxHeight,
                            customCellRenderer,
                            customImageRenderer,
                            className
                        });
                    }
                    
                case 'vue':
                    // Vue模式 - 检查Vue是否可用
                    if (isVue && typeof (window as Window).Vue === 'object') {
                        return this.renderTableForVue({
                            dataSource,
                            imageColumns,
                            maxWidth,
                            maxHeight,
                            customCellRenderer,
                            customImageRenderer,
                            className
                        });
                    } else {
                        console.warn('Vue环境未检测到，回退到DOM渲染模式');
                        return this.renderTableAsDom({
                            containerId,
                            dataSource,
                            imageColumns,
                            onRenderComplete,
                            maxWidth,
                            maxHeight,
                            customCellRenderer,
                            customImageRenderer,
                            className
                        });
                    }
                    
                case 'dom':
                default:
                    // 标准DOM渲染模式
                    return this.renderTableAsDom({
                        containerId,
                        dataSource,
                        imageColumns,
                        onRenderComplete,
                        maxWidth,
                        maxHeight,
                        customCellRenderer,
                        customImageRenderer,
                        className
                    });
            }
        } catch (error) {
            console.error('表格图片渲染失败:', error);
            
            // 错误处理
            if (renderMode === 'dom' && containerId) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = `<div style="color: red; padding: 20px;">渲染失败: ${error instanceof Error ? error.message : String(error)}</div>`;
                }
            }
            
            // 对于非DOM渲染模式，抛出错误让调用者处理
            if (renderMode !== 'dom') {
                throw error;
            }
        }
    }

    /**
     * 渲染表格为HTML字符串
     */
    private renderTableAsHtml(options: {
        dataSource: Array<{[key: string]: any}>;
        imageColumns: string[];
        maxWidth: number;
        maxHeight: number;
        customCellRenderer?: (value: any, column: string, row: any) => string;
        customImageRenderer?: (url: string, row: any, column: string) => string;
        className: string;
    }): string {
        const { 
            dataSource, 
            imageColumns, 
            maxWidth, 
            maxHeight,
            customCellRenderer,
            customImageRenderer,
            className
        } = options;

        // 获取所有列名
        const allColumns = new Set<string>();
        dataSource.forEach(item => {
            Object.keys(item).forEach(key => {
                allColumns.add(key);
            });
        });

        let html = `<table class="${className}" style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:14px;">`;

        if (dataSource.length === 0) {
            // 空数据提示
            html += `<tr><td colspan="1000" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
        } else {
            // 创建表头
            html += `<thead><tr style="background-color:#f5f5f5; border-bottom:2px solid #e0e0e0;">`;
            
            allColumns.forEach(column => {
                html += `<th style="padding:10px; text-align:left; font-weight:bold;">${column}</th>`;
            });
            
            html += `</tr></thead><tbody>`;

            // 创建表格主体
            dataSource.forEach((item, rowIndex) => {
                html += `<tr style="border-bottom:1px solid #e0e0e0; transition:background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9f9f9'" onmouseout="this.style.backgroundColor=''">`;
                
                allColumns.forEach(column => {
                    const value = item[column];
                    
                    // 尝试使用自定义单元格渲染器
                    if (customCellRenderer) {
                        try {
                            const cellContent = customCellRenderer(value, column, item);
                            html += `<td style="padding:10px;">${cellContent}</td>`;
                            return;
                        } catch (e) {
                            console.warn('自定义单元格渲染失败:', e);
                        }
                    }

                    // 处理图片列
                    if (imageColumns.includes(column) && typeof value === 'string' && 
                        (value.startsWith('http://') || value.startsWith('https://') || 
                        value.startsWith('data:image/'))) {
                        
                        // 尝试使用自定义图片渲染器
                        if (customImageRenderer) {
                            try {
                                const imageContent = customImageRenderer(value, item, column);
                                html += `<td style="padding:10px;">${imageContent}</td>`;
                                return;
                            } catch (e) {
                                console.warn('自定义图片渲染失败:', e);
                            }
                        }

                        // 标准图片渲染
                        html += `<td style="padding:10px;"><img src="${value}" style="max-width:${maxWidth}px; max-height:${maxHeight}px; border-radius:4px; object-fit:contain; cursor:pointer; transition:transform 0.2s;" onclick="window.imageUtilsPreview && window.imageUtilsPreview('${value}')" onerror="this.parentElement.textContent='[图片加载失败]'; this.parentElement.style.color='#999'; this.parentElement.style.fontSize='12px'" /></td>`;
                    } else {
                        // 文本内容渲染
                        html += `<td style="padding:10px;">${String(value ?? '')}</td>`;
                    }
                });
                
                html += `</tr>`;
            });
            
            html += `</tbody>`;
        }
        
        html += `</table>`;
        return html;
    }

    /**
     * 渲染表格为DOM元素
     */
    private async renderTableAsDom(options: {
        containerId?: string;
        dataSource: Array<{[key: string]: any}>;
        imageColumns: string[];
        onRenderComplete?: () => void;
        maxWidth: number;
        maxHeight: number;
        customCellRenderer?: (value: any, column: string, row: any) => string | HTMLElement;
        customImageRenderer?: (url: string, row: any, column: string) => string | HTMLElement;
        className: string;
    }): Promise<void> {
        const { 
            containerId, 
            dataSource, 
            imageColumns, 
            onRenderComplete, 
            maxWidth, 
            maxHeight,
            customCellRenderer,
            customImageRenderer,
            className
        } = options;

        if (!isBrowser) {
            throw new Error('DOM渲染模式需要在浏览器环境中运行');
        }

        if (!containerId) {
            throw new Error('DOM渲染模式需要提供containerId');
        }

        // 获取容器元素
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`容器元素未找到: ${containerId}`);
        }

        // 清空容器
        container.innerHTML = '';

        // 创建表格
        const table = document.createElement('table');
        table.className = className;
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.fontFamily = 'Arial, sans-serif';
        table.style.fontSize = '14px';

        if (dataSource.length === 0) {
            // 空数据提示
            const emptyRow = document.createElement('tr');
            const emptyCell = document.createElement('td');
            emptyCell.colSpan = 1000; // 足够大的跨度
            emptyCell.style.textAlign = 'center';
            emptyCell.style.padding = '20px';
            emptyCell.textContent = '暂无数据';
            emptyRow.appendChild(emptyCell);
            table.appendChild(emptyRow);
        } else {
            // 获取所有列名
            const allColumns = new Set<string>();
            dataSource.forEach(item => {
                Object.keys(item).forEach(key => {
                    allColumns.add(key);
                });
            });

            // 创建表头
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.style.backgroundColor = '#f5f5f5';
            headerRow.style.borderBottom = '2px solid #e0e0e0';
            
            allColumns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column;
                th.style.padding = '10px';
                th.style.textAlign = 'left';
                th.style.fontWeight = 'bold';
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // 创建表格主体
            const tbody = document.createElement('tbody');
            let processedCount = 0;
            
            // 批量处理数据行
            const batchProcessRows = async (startIndex: number, batchSize: number = 5) => {
                const batch = dataSource.slice(startIndex, startIndex + batchSize);
                
                for (const item of batch) {
                    const row = document.createElement('tr');
                    row.style.borderBottom = '1px solid #e0e0e0';
                    row.style.transition = 'background-color 0.2s';
                    row.addEventListener('mouseover', () => {
                        row.style.backgroundColor = '#f9f9f9';
                    });
                    row.addEventListener('mouseout', () => {
                        row.style.backgroundColor = '';
                    });

                    allColumns.forEach(column => {
                        const td = document.createElement('td');
                        td.style.padding = '10px';
                        const value = item[column];

                        // 尝试使用自定义单元格渲染器
                        if (customCellRenderer) {
                            try {
                                const cellContent = customCellRenderer(value, column, item);
                                if (typeof cellContent === 'string') {
                                    td.innerHTML = cellContent;
                                } else if (cellContent instanceof HTMLElement) {
                                    td.appendChild(cellContent);
                                }
                                row.appendChild(td);
                                return;
                            } catch (e) {
                                console.warn('自定义单元格渲染失败:', e);
                            }
                        }

                        // 处理图片列
                        if (imageColumns.includes(column) && typeof value === 'string' && 
                            (value.startsWith('http://') || value.startsWith('https://') || 
                            value.startsWith('data:image/'))) {
                            
                            // 尝试使用自定义图片渲染器
                            if (customImageRenderer) {
                                try {
                                    const imageContent = customImageRenderer(value, item, column);
                                    if (typeof imageContent === 'string') {
                                        td.innerHTML = imageContent;
                                    } else if (imageContent instanceof HTMLElement) {
                                        td.appendChild(imageContent);
                                    }
                                    row.appendChild(td);
                                    return;
                                } catch (e) {
                                    console.warn('自定义图片渲染失败:', e);
                                }
                            }

                            // 标准图片渲染
                            const img = document.createElement('img');
                            img.src = value;
                            img.style.maxWidth = `${maxWidth}px`;
                            img.style.maxHeight = `${maxHeight}px`;
                            img.style.borderRadius = '4px';
                            img.style.objectFit = 'contain';
                            img.style.cursor = 'pointer';
                            img.style.transition = 'transform 0.2s';
                            
                            // 添加点击放大效果
                            img.addEventListener('click', () => {
                                this.showImagePreview(img.src);
                            });
                            
                            // 图片加载失败时显示占位符
                            img.onerror = () => {
                                td.textContent = '[图片加载失败]';
                                td.style.color = '#999';
                                td.style.fontSize = '12px';
                            };
                            
                            td.appendChild(img);
                        } else {
                            // 渲染文本内容
                            td.textContent = String(value ?? '');
                        }

                        row.appendChild(td);
                    });

                    tbody.appendChild(row);
                    processedCount++;
                }

                // 继续处理下一批
                if (startIndex + batchSize < dataSource.length) {
                    await new Promise<void>(resolve => {
                        requestIdleCallback(() => {
                            batchProcessRows(startIndex + batchSize);
                            resolve();
                        }, { timeout: 100 });
                    });
                } else {
                    // 所有数据处理完成
                    table.appendChild(tbody);
                    container.appendChild(table);
                    
                    if (onRenderComplete) {
                        onRenderComplete();
                    }
                }
            };

            // 开始分批处理数据行
            batchProcessRows(0);
        }
    }

    /**
     * React专用渲染方法
     */
    private renderTableForReact<T extends Record<string, any>>(options: {
        dataSource: T[];
        imageColumns: Array<keyof T>;
        maxWidth: number;
        maxHeight: number;
        customCellRenderer?: (value: any, column: string, row: T) => any;
        customImageRenderer?: (url: string, row: T, column: string) => any;
        className: string;
    }): JSX.Element {
        if (!isReact || typeof (window as any).React !== 'object' || typeof (window as any).React.createElement !== 'function') {
            throw new Error('React环境未正确加载');
        }

        const { React } = window as any;
        const { createElement } = React;
        const { 
            dataSource, 
            imageColumns, 
            maxWidth, 
            maxHeight,
            customCellRenderer,
            customImageRenderer,
            className
        } = options;

        // 获取所有列名
        const allColumns = new Set<string>();
        dataSource.forEach(item => {
            Object.keys(item).forEach(key => {
                allColumns.add(key);
            });
        });

        // 创建React元素结构
        const tableProps = {
            className,
            style: {
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px'
            }
        };

        if (dataSource.length === 0) {
            // 空数据提示
            return createElement(
                'table',
                tableProps,
                createElement(
                    'tbody',
                    null,
                    createElement(
                        'tr',
                        null,
                        createElement(
                            'td',
                            { colSpan: 1000, style: { textAlign: 'center', padding: '20px' } },
                            '暂无数据'
                        )
                    )
                )
            );
        }

        // 表头行
        const headerRow = createElement(
            'tr',
            { style: { backgroundColor: '#f5f5f5', borderBottom: '2px solid #e0e0e0' } },
            Array.from(allColumns).map(column => 
                createElement(
                    'th',
                    { key: column, style: { padding: '10px', textAlign: 'left', fontWeight: 'bold' } },
                    column
                )
            )
        );

        // 表格内容行
        const tableRows = dataSource.map((item, rowIndex) => {
            const rowCells = Array.from(allColumns).map(column => {
                const value = item[column];
                
                // 尝试使用自定义单元格渲染器
                if (customCellRenderer) {
                    try {
                        const cellContent = customCellRenderer(value, column, item);
                        return createElement(
                            'td',
                            { key: column, style: { padding: '10px' } },
                            cellContent
                        );
                    } catch (e) {
                        console.warn('自定义单元格渲染失败:', e);
                    }
                }

                // 处理图片列
                if (imageColumns.includes(column) && typeof value === 'string' && 
                    (value.startsWith('http://') || value.startsWith('https://') || 
                    value.startsWith('data:image/'))) {
                    
                    // 尝试使用自定义图片渲染器
                    if (customImageRenderer) {
                        try {
                            const imageContent = customImageRenderer(value, item, column);
                            return createElement(
                                'td',
                                { key: column, style: { padding: '10px' } },
                                imageContent
                            );
                        } catch (e) {
                            console.warn('自定义图片渲染失败:', e);
                        }
                    }

                    // 标准图片渲染
                    return createElement(
                        'td',
                        { key: column, style: { padding: '10px' } },
                        createElement(
                            'img',
                            {
                                src: value,
                                style: {
                                    maxWidth: `${maxWidth}px`,
                                    maxHeight: `${maxHeight}px`,
                                    borderRadius: '4px',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s'
                                },
                                onClick: () => this.showImagePreview(value),
                                onError: (e: any) => {
                                    const target = e.target;
                                    target.parentElement.textContent = '[图片加载失败]';
                                    target.parentElement.style.color = '#999';
                                    target.parentElement.style.fontSize = '12px';
                                }
                            }
                        )
                    );
                }

                // 文本内容渲染
                return createElement(
                    'td',
                    { key: column, style: { padding: '10px' } },
                    String(value ?? '')
                );
            });

            return createElement(
                'tr',
                {
                    key: rowIndex,
                    style: {
                        borderBottom: '1px solid #e0e0e0',
                        transition: 'background-color 0.2s'
                    },
                    onMouseEnter: (e: any) => {
                        e.currentTarget.style.backgroundColor = '#f9f9f9';
                    },
                    onMouseLeave: (e: any) => {
                        e.currentTarget.style.backgroundColor = '';
                    }
                },
                rowCells
            );
        });

        return createElement(
            'table',
            tableProps,
            createElement('thead', null, headerRow),
            createElement('tbody', null, tableRows)
        );
    }

    /**
     * Vue专用渲染方法
     */
    private renderTableForVue(options: {
        dataSource: Array<{[key: string]: any}>;
        imageColumns: string[];
        maxWidth: number;
        maxHeight: number;
        customCellRenderer?: (value: any, column: string, row: any) => any;
        customImageRenderer?: (url: string, row: any, column: string) => any;
        className: string;
    }): any {
        if (!isVue || typeof (window as Window).Vue !== 'object') {
            throw new Error('Vue环境未正确加载');
        }

        const Vue = (window as Window).Vue as any;
        const { 
            dataSource, 
            imageColumns, 
            maxWidth, 
            maxHeight,
            customCellRenderer,
            customImageRenderer,
            className
        } = options;

        // 创建Vue组件配置对象
        const tableComponentConfig = {
            template: `
                <table :class="className" style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:14px;">
                    <thead v-if="hasData">
                        <tr style="background-color:#f5f5f5; border-bottom:2px solid #e0e0e0;">
                            <th v-for="column in columns" :key="column" style="padding:10px; text-align:left; font-weight:bold;">
                                {{ column }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!hasData">
                            <td colspan="1000" style="text-align:center; padding:20px;">暂无数据</td>
                        </tr>
                        <tr v-for="(item, rowIndex) in dataSource" :key="rowIndex"
                            style="border-bottom:1px solid #e0e0e0; transition:background-color 0.2s;"
                            @mouseenter="onRowMouseEnter($event)"
                            @mouseleave="onRowMouseLeave($event)">
                            <td v-for="column in columns" :key="column" style="padding:10px;">
                                <template v-if="renderCell(item[column], column, item)">
                                    {{ renderCell(item[column], column, item) }}
                                </template>
                                <template v-else-if="isImageColumn(column, item[column])">
                                    <template v-if="renderImage(item[column], item, column)">
                                        {{ renderImage(item[column], item, column) }}
                                    </template>
                                    <template v-else>
                                        <img 
                                            :src="item[column]" 
                                            :style="imageStyle"
                                            @click="showImagePreview(item[column])"
                                            @error="onImageError($event)"
                                        />
                                    </template>
                                </template>
                                <template v-else>
                                    {{ item[column] !== undefined ? item[column] : '' }}
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            `,
            data() {
                return {
                    dataSource,
                    imageColumns,
                    columns: Array.from(new Set(dataSource.flatMap(item => Object.keys(item)))),
                    className,
                    imageStyle: {
                        maxWidth: `${maxWidth}px`,
                        maxHeight: `${maxHeight}px`,
                        borderRadius: '4px',
                        objectFit: 'contain',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }
                };
            },
            computed: {
                hasData() {
                    return (this as any).dataSource.length > 0;
                }
            },
            methods: {
                isImageColumn(column: string, value: any) {
                    return (this as any).imageColumns.includes(column) && typeof value === 'string' &&
                           (value.startsWith('http://') || value.startsWith('https://') || 
                            value.startsWith('data:image/'));
                },
                renderCell(value: any, column: string, row: any) {
                    if (customCellRenderer) {
                        try {
                            return customCellRenderer(value, column, row);
                        } catch (e) {
                            console.warn('自定义单元格渲染失败:', e);
                        }
                    }
                    return null;
                },
                renderImage(url: string, row: any, column: string) {
                    if (customImageRenderer) {
                        try {
                            return customImageRenderer(url, row, column);
                        } catch (e) {
                            console.warn('自定义图片渲染失败:', e);
                        }
                    }
                    return null;
                },
                showImagePreview(imageUrl: string) {
                    // Vue环境中调用外部方法
                    if ((window as Window).imageUtilsPreview) {
                        (window as any).imageUtilsPreview(imageUrl);
                    } else {
                        console.warn('预览功能未初始化');
                    }
                },
                onImageError(event: any) {
                    const target = event.target;
                    target.parentElement.textContent = '[图片加载失败]';
                    target.parentElement.style.color = '#999';
                    target.parentElement.style.fontSize = '12px';
                },
                onRowMouseEnter(event: any) {
                    event.currentTarget.style.backgroundColor = '#f9f9f9';
                },
                onRowMouseLeave(event: any) {
                    event.currentTarget.style.backgroundColor = '';
                }
            }
        };

        // 在Vue 3中，使用defineComponent
        if (Vue.defineComponent) {
            return Vue.defineComponent(tableComponentConfig);
        }
        // 在Vue 2中，直接返回组件配置
        return tableComponentConfig;
    }

    /**
     * 显示图片预览
     */
    private showImagePreview(imageUrl: string): void {
        // 创建预览容器
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.cursor = 'pointer';
        
        // 创建预览图片
        const previewImg = document.createElement('img');
        previewImg.src = imageUrl;
        previewImg.style.maxWidth = '90%';
        previewImg.style.maxHeight = '90%';
        previewImg.style.objectFit = 'contain';
        previewImg.style.transition = 'transform 0.3s';
        
        // 添加关闭预览的事件
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        // 添加键盘ESC关闭预览
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        // 添加到文档
        overlay.appendChild(previewImg);
        document.body.appendChild(overlay);
    }

    /**
     * 清除指定图片的缓存
     */
    public clearCache(url: string): void {
        this.cacheManager.clear(url);
    }

    /**
     * 清除所有图片缓存
     */
    public clearAllCache(): void {
        this.cacheManager.clearAll();
    }
}

/**
 * 函数式编程风格的图片工具
 */
export const imageUtilsFP = {
    // requestIdleCallback相关函数
    requestIdleCallback,
    cancelIdleCallback,
    
    // 获取缓存管理器实例
    getCacheManager: (): ImageCacheManager => {
        return ImageCacheManager.getInstance();
    },
    
    // 创建图片加载函数
    createLoadImageFunction: (options: ImageLoadOptions = {}): ((url: string) => Promise<ImageLoadResult>) => {
        const imageUtils = new ImageUtils();
        return (url: string) => imageUtils.loadImage(url, options);
    },
    
    // 加载单个图片
    loadImage: async (url: string, options: ImageLoadOptions = {}): Promise<ImageLoadResult> => {
        const imageUtils = new ImageUtils();
        return imageUtils.loadImage(url, options);
    },
    
    // 批量加载图片
    batchLoadImages: async (
        urls: string[], 
        options: ImageLoadOptions & { concurrency?: number } = {}
    ): Promise<ImageLoadResult[]> => {
        const imageUtils = new ImageUtils();
        return imageUtils.batchLoadImages(urls, options);
    },
    
    // 获取图片信息
    getImageInfo: async (url: string, options: { timeout?: number } = {}): Promise<{
        width: number;
        height: number;
        aspectRatio: number;
        loadTime: number;
    }> => {
        const imageUtils = new ImageUtils();
        return imageUtils.getImageInfo(url, options);
    },
    
    // 图片安全性验证
    validateImageSecurity: async (url: string, options: ImageSecurityOptions = {}): Promise<{
        isValid: boolean;
        message?: string;
    }> => {
        const imageUtils = new ImageUtils();
        return imageUtils.validateImageSecurity(url, options);
    },

    // 图片质量降级处理
    degradeImageQuality: async (url: string, options: ImageQualityOptions = {}): Promise<string> => {
        const imageUtils = new ImageUtils();
        return imageUtils.degradeImageQuality(url, options);
    },

    // 获取图片的Base64编码信息
    getImageBase64: async (url: string, options: { 
        format?: string;
        quality?: number;
        maxWidth?: number;
        maxHeight?: number;
    } = {}): Promise<string> => {
        const imageUtils = new ImageUtils();
        return imageUtils.getImageBase64(url, options);
    },

    // 图片加密处理
    encryptImage: async (url: string, options: ImageEncryptionOptions = {}): Promise<string> => {
        const imageUtils = new ImageUtils();
        return imageUtils.encryptImage(url, options);
    },

    // 表格图片动态渲染
    renderTableImages: async (config: ImageRenderConfig): Promise<void | string> => {
        const imageUtils = new ImageUtils();
        return imageUtils.renderTableImages(config);
    },

    // 显示图片预览 - 支持移动端手势操作
    showImagePreview: (imageUrl: string): void => {
        if (isBrowser) {
            try {
                // 移除已存在的预览
                const existingPreview = document.getElementById('imageUtilsPreview') as HTMLElement;
                if (existingPreview && existingPreview.parentNode) {
                    existingPreview.parentNode.removeChild(existingPreview);
                }

                const previewContainer = document.createElement('div');
                previewContainer.style.position = 'fixed';
                previewContainer.style.top = '0';
                previewContainer.style.left = '0';
                previewContainer.style.width = '100%';
                previewContainer.style.height = '100%';
                previewContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                previewContainer.style.display = 'flex';
                previewContainer.style.alignItems = 'center';
                previewContainer.style.justifyContent = 'center';
                previewContainer.style.zIndex = '9999';
                previewContainer.style.cursor = 'pointer';
                previewContainer.style.transition = 'opacity 0.3s ease';
                previewContainer.style.opacity = '0';
                previewContainer.id = 'imageUtilsPreview';
                // 允许触摸滚动
                previewContainer.style.touchAction = 'none';

                // 创建关闭按钮
                const closeButton = document.createElement('button');
                closeButton.innerText = '×';
                closeButton.style.position = 'absolute';
                closeButton.style.top = '20px';
                closeButton.style.right = '20px';
                closeButton.style.width = '40px';
                closeButton.style.height = '40px';
                closeButton.style.border = 'none';
                closeButton.style.borderRadius = '50%';
                closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                closeButton.style.color = 'white';
                closeButton.style.fontSize = '24px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.transition = 'background-color 0.3s ease';

                closeButton.addEventListener('mouseenter', () => {
                    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                });

                closeButton.addEventListener('mouseleave', () => {
                    closeButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                });

                // 创建图片容器用于手势操作
                const imageWrapper = document.createElement('div');
                imageWrapper.style.position = 'relative';
                imageWrapper.style.overflow = 'visible';
                imageWrapper.style.transformOrigin = 'center center';
                
                // 创建图片元素
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                img.style.transform = 'scale(0.95)';
                img.style.transition = 'transform 0.3s ease';

                // 缩放和平移状态
                let scale = 1;
                let translateX = 0;
                let translateY = 0;
                let startX = 0;
                let startY = 0;
                let lastDistance = 0;
                let isPinching = false;
                
                // 添加到容器
                imageWrapper.appendChild(img);
                previewContainer.appendChild(closeButton);
                previewContainer.appendChild(imageWrapper);
                document.body.appendChild(previewContainer);

                // 淡入效果
                setTimeout(() => {
                    previewContainer.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 10);

                // 关闭预览的函数
                const closePreview = () => {
                    previewContainer.style.opacity = '0';
                    img.style.transform = 'scale(0.95)';
                    
                    setTimeout(() => {
                        if (document.body.contains(previewContainer)) {
                            document.body.removeChild(previewContainer);
                        }
                    }, 300);
                    
                    // 移除事件监听器
                    document.removeEventListener('keydown', handleEscKey);
                };

                // 点击关闭按钮关闭预览
                closeButton.addEventListener('click', (e: MouseEvent) => {
                    e.stopPropagation();
                    closePreview();
                });

                // 点击预览区域关闭预览
                previewContainer.addEventListener('click', closePreview);

                // 防止点击图片关闭预览
                img.addEventListener('click', (e: MouseEvent) => {
                    e.stopPropagation();
                });

                // ESC键关闭预览
                const handleEscKey = (e: KeyboardEvent) => {
                    if (e.key === 'Escape') {
                        closePreview();
                    }
                };

                document.addEventListener('keydown', handleEscKey);
                
                // 手势操作 - 触摸开始
                imageWrapper.addEventListener('touchstart', (e: TouchEvent) => {
                    e.preventDefault();
                    
                    if (e.touches.length === 1) {
                        // 单指拖动
                        startX = e.touches[0].clientX - translateX;
                        startY = e.touches[0].clientY - translateY;
                    } else if (e.touches.length === 2) {
                        // 双指缩放
                        isPinching = true;
                        const dx = e.touches[0].clientX - e.touches[1].clientX;
                        const dy = e.touches[0].clientY - e.touches[1].clientY;
                        lastDistance = Math.sqrt(dx * dx + dy * dy);
                    }
                });
                
                // 手势操作 - 触摸移动
                imageWrapper.addEventListener('touchmove', (e: TouchEvent) => {
                    e.preventDefault();
                    
                    if (e.touches.length === 1 && !isPinching) {
                        // 单指拖动
                        translateX = e.touches[0].clientX - startX;
                        translateY = e.touches[0].clientY - startY;
                        updateTransform();
                    } else if (e.touches.length === 2) {
                        // 双指缩放
                        const dx = e.touches[0].clientX - e.touches[1].clientX;
                        const dy = e.touches[0].clientY - e.touches[1].clientY;
                        const currentDistance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (lastDistance > 0) {
                            const scaleFactor = currentDistance / lastDistance;
                            scale *= scaleFactor;
                            // 限制缩放范围
                            scale = Math.max(1, Math.min(5, scale));
                            updateTransform();
                        }
                        
                        lastDistance = currentDistance;
                    }
                });
                
                // 手势操作 - 触摸结束
                imageWrapper.addEventListener('touchend', (e: TouchEvent) => {
                    e.preventDefault();
                    
                    if (e.touches.length === 0) {
                        isPinching = false;
                        lastDistance = 0;
                    } else if (e.touches.length === 1) {
                        // 从双指变为单指
                        isPinching = false;
                        startX = e.touches[0].clientX - translateX;
                        startY = e.touches[0].clientY - translateY;
                    }
                });
                
                // 更新变换
                function updateTransform() {
                    imageWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                }

                // 保存到window对象
                (window as any).imageUtilsPreview = previewContainer;
            } catch (error) {
                console.error('显示图片预览失败:', error);
            }
        }
    },

    // 框架组件适配器
    createFrameworkComponent: (options: FrameworkComponentOptions): any => {
        if (!options.type) {
            throw new Error('必须指定组件类型');
        }

        const { type, ...config } = options;

        // 简化版实现，仅提供基础功能
        switch (type) {
            case 'table':
                // 默认返回HTML渲染函数
                return (props: any) => {
                    const mergedConfig = { ...props, ...config };
                    try {
                        // 使用公共方法renderTableImages进行渲染
                        const tempContainer = document.createElement('div');
                        const instance = new ImageUtils();
                        instance.renderTableImages({
                            ...mergedConfig,
                            containerId: tempContainer.id
                        });
                        // 返回图片表格的HTML字符串
                        return tempContainer.innerHTML;
                    } catch (error) {
                        console.error('渲染表格失败:', error);
                        return `<div style="color: red;">表格渲染失败: ${error instanceof Error ? error.message : String(error)}</div>`;
                    }
                };
                
            case 'image':
                // 默认返回函数式图片组件
                return (props: any) => {
                    const { src, alt = '', onLoad, onError, onClick, className = '' } = props;
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = alt;
                    img.className = className;
                    
                    if (onLoad) img.addEventListener('load', onLoad);
                    if (onError) img.addEventListener('error', onError);
                    if (onClick) img.addEventListener('click', onClick);
                    
                    return img;
                };
                
            default:
                throw new Error(`不支持的组件类型: ${type}`);
        }
    },

    // 获取环境信息
    getEnvironmentInfo: (): { isBrowser: boolean; isReact: boolean; isVue: boolean; isAndroid: boolean; isIOS: boolean; isDesktop: boolean; platform: 'android' | 'ios' | 'desktop' | 'unknown' } => {
        return {
            isBrowser,
            isReact,
            isVue,
            isAndroid,
            isIOS,
            isDesktop,
            platform: getPlatform()
        };
    },

    // 获取平台信息
    getPlatformInfo: (): {
        platform: 'android' | 'ios' | 'desktop' | 'unknown';
        isMobile: boolean;
        userAgent: string;
    } => {
        const platform = getPlatform();
        return {
            platform,
            isMobile: platform === 'android' || platform === 'ios',
            userAgent: isBrowser ? navigator.userAgent : ''
        };
    },
    
    // 清除缓存
    clearCache: (url: string): void => {
        ImageCacheManager.getInstance().clear(url);
    },
    
    // 清除所有缓存
    clearAllCache: (): void => {
        ImageCacheManager.getInstance().clearAll();
    }
};

/**
 * 工具函数：生成图片报告
 */
export const generateImageReport = (results: ImageLoadResult[]): {
    total: number;
    success: number;
    error: number;
    averageLoadTime: number;
    successRate: number;
    details: ImageLoadResult[];
} => {
    const total = results.length;
    const success = results.filter(r => r.status === 'success').length;
    const error = results.filter(r => r.status === 'error').length;
    const successLoadTimes = results
        .filter(r => r.status === 'success' && r.loadTime)
        .map(r => r.loadTime!);
    const averageLoadTime = successLoadTimes.length > 0 
        ? successLoadTimes.reduce((a, b) => a + b, 0) / successLoadTimes.length 
        : 0;
    
    return {
        total,
        success,
        error,
        averageLoadTime,
        successRate: total > 0 ? (success / total) * 100 : 0,
        details: results
    };
};

// 导出默认类
export default ImageUtils;