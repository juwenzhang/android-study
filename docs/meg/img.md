# IMAGE 指南

> 1. https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/img

## 前端 img 标签
* `src` 是指定本次需要加载的图片的地址，可以是本地的链接的，也可以是网络上的 cdn 地址
* `alt` 就是对应的图片资源还没有实现加载的时候，会显示替代文本
* `width` 和 `height` 是指定图片的宽度和高度，单位是像素，指定的核心的目的是确保网页的布局不会因为图片的加载而发生变化，指标就是
    * 页面布局偏移指标：CLS (calculate layout shift)
* `sizes` 和 `srcset` 是用来指定图片的加载策略的，也就是最终的响应式图片的设置吧
> 这两个属性的话核心的目的就是：实现响应式图片的加载策略吧

> * 1. 让浏览器自动化的根据硬件的一些信息进行选择合适的资源进行加载，从而达到平衡加载速度和显示质量问题的解决

> * 2. srcset 实现的是设置加载图片的资源列表，sizes 决定的是根据什么条件去选择 srcset 中的资源，实现自动化选择最优的资源进行加载实现

```html
<!-- srcset 提供3个宽度不同的图片，sizes 定义不同屏幕下的显示宽度 -->
<img 
  src="img-400.jpg"  <!-- 降级方案：浏览器不支持时加载此图 -->
  srcset="img-400.jpg 400w,  <!-- 候选1：宽400px -->
          img-800.jpg 800w,  <!-- 候选2：宽800px -->
          img-1200.jpg 1200w" <!-- 候选3：宽1200px -->
  sizes="(max-width: 600px) 100vw,  <!-- 小屏：显示100vw宽 -->
         (max-width: 1200px) 50vw,  <!-- 中屏：显示50vw宽 -->
         600px"  <!-- 大屏默认：显示600px宽 -->
  alt="响应式图片"
>
```
> `w` 是宽度描述符，`x`是像素描述符

## 图片资源常见格式
* `APNG`(动态可移植网络图形) ： 是 PNG 格式的一种扩展，支持动画效果，但是不支持透明度。
* `GIF`(图形交换格式) ： 是一种支持动画效果的图片格式，但是不支持透明度。
* `JPEG`(联合图像专家组) ： 是一种有损压缩的图片格式，支持透明度。
* `PNG`(便携式网络图形) ： 是一种无损压缩的图片格式，支持透明度。
* `SVG`(可缩放矢量图形) ： 是一种基于 XML 语法的图片格式，支持动画效果。
* `WebP`(网络图片格式) ： 是一种由 Google 开发的图片格式，支持有损压缩和无损压缩，同时支持透明度。

> * 在实际的开发中，我们对于图片资源常用的就是应用 cdn 链接的形式进行的，cdn图片默认是具备缓存的，所以我们在使用 cdn 链接的图片资源的时候，不需要额外的配置，就可以实现缓存的效果。但是注意的是对于图片，音频，视频需要进行压缩处理后进行存储，因为都是比较占资源的
> * 图片资源的压缩可以使用一些工具进行压缩，比如 `tinypng`，`pngquant`，`jpegtran`,`ffmpeg` 等

> mdn 建议： 推荐使用诸如 WebP 和 AVIF 等图像格式，因为它们在静态图像和动画的性能均比 PNG、JPEG、JIF 好得多。WebP 得到了广泛的支持，而 AVIF 则缺乏 Safari 的支持。

* `loading` 属性，指定图片的加载策略，可选值有 `eager`，`lazy`，`auto`，可以实现最简单的图片懒加载实现吧
* `decoding` 属性，指定图片的解码策略，可选值有 `sync`，`async`，`auto`，可以实现图片的异步解码实现吧
* `fetchpriority` 属性，指定图片的加载优先级，可选值有 `high`，`low`，`auto`，可以实现图片的加载优先级的设置吧

## 图片资源的缓存
* 图片资源的缓存是指浏览器缓存图片资源的一种机制，浏览器会根据图片资源的地址，将图片资源缓存到浏览器的缓存中，下次再请求相同的图片资源的时候，就会直接从缓存中获取，而不会再去请求服务器。
* 图片资源的缓存可以提高网页的加载速度，减少服务器的压力，但是也会占用浏览器的缓存空间，所以需要根据实际的情况进行设置。
* 图片资源的缓存可以分为两种：
    * 强缓存： 浏览器会根据图片资源的地址，将图片资源缓存到浏览器的缓存中，下次再请求相同的图片资源的时候，就会直接从缓存中获取，而不会再去请求服务器。
    * 协商缓存： 浏览器会根据图片资源的地址，将图片资源缓存到浏览器的缓存中，下次再请求相同的图片资源的时候，会先发送一个请求到服务器，服务器会根据请求头中的缓存信息，判断是否需要返回图片资源的内容，如果不需要返回，就会返回一个 304 状态码，浏览器会直接从缓存中获取图片资源的内容。

## 前端 Image 对象
* 前端 Image 对象是用来创建图片元素的，它可以用来加载图片资源，实现图片的显示。
* 前端 Image 对象的使用方式和 img 标签的使用方式类似，但是它是一个对象，所以可以通过对象的方式来操作图片资源。
* 前端 Image 对象的使用方式如下：
    * 1. 创建一个 Image 对象
    * 2. 设置 Image 对象的属性
    * 3. 加载图片资源
    * 4. 显示图片资源
    * 5. 监听图片资源的加载事件
> HTMLImageElement 是前端 Image 对象的构造函数，它可以用来创建图片元素。

### 构造函数
* 前端 Image 对象的构造函数如下：
```js
const image = new Image();
const image_1 = new Image(100, 100);  // 指定宽度 width 和 高度 height
const image_2 = new Image();
image_2.src = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png';
```

### 创建并且加载图片
```javascript
// 1. 实现创建图片
const ImageInstance = new Image()

// 2. 定义需要加载的图片链接常量和报错文本描述
const ImageLink = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
const ImageErrorText = '图片加载失败'

// 3. 实现监听事件
ImageInstance.addEventListener('load', () => {
    console.log('图片加载成功，以及图片的宽度和高度', ImageInstance.width, ImageInstance.height)
    document.body.appendChild(ImageInstance)
})

// 4. 实现错误监听事件
ImageInstance.addEventListener('error', () => {
    console.log('图片加载失败')
    document.body.appendChild(DocumentFragment)
    document.createTextNode(ImageErrorText)
})
```

### 图片预加载
#### 基础版本
```javascript
// 1. 准备图片资源列表
const LoadingImageSourceList = [
    'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
    'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
]

const PreloadImageResultList = []
// 2. 定义加载函数
function PreloadImageFunc(preloadImageSourceList) {
    preloadImageSourceList.forEach((item) => {
        // 1. 实现创建图片
        const ImageInstance = new Image()
        ImageInstance.src = item

        // 2. 实现事件监听
        ImageInstance.addEventListener('load', () => {
            PreloadImageResultList.push({
                status: 'success',
                url: item,
            })
        })

        // 3. 实现错误监听事件
        ImageInstance.addEventListener('error', () => {
            PreloadImageResultList.push({
                status: 'error',
                url: item,
            })
        })

        // 在这里判断是否加载完成，同时也是可以进行日志收集的呐
        if (PreloadImageResultList.length === preloadImageSourceList.length) {
            console.log('图片预加载完成', PreloadImageResultList)
        }
    })
}

// 3. 调用加载函数
PreloadImageFunc(LoadingImageSourceList)
// 最后进行收集操作后的结果，进行日志记录
sendLogs({
    type: 'preload_image',
    data: PreloadImageResultList,
})
```

#### 进阶版本
```javascript
/**
 * 图片预加载器 - 提供面向对象(OOP)和函数式编程(FP)两种实现方式
 */

// ==========================================
// 第一部分: 面向对象实现
// ==========================================
/**
 * 面向对象的图片预加载器类
 */
class ImagePreloader {
  /**
   * 构造函数
   * @param {Object} defaultOptions - 全局默认配置项
   */
  constructor(defaultOptions = {}) {
    this.defaultOptions = {
      timeout: 30000,
      concurrency: 5,
      ...defaultOptions
    };
  }

  /**
   * 预加载图片资源
   * @param {Array<string>} imageUrls - 图片URL数组
   * @param {Object} options - 配置选项
   * @param {number} options.timeout - 单个图片加载超时时间（毫秒）
   * @param {number} options.concurrency - 并发加载数量
   * @param {Function} options.onProgress - 进度回调函数，接收(current, total, result)参数
   * @returns {Promise<Array<{status: 'success'|'error', url: string, width?: number, height?: number, error?: Error}>>} 
   * 包含所有图片加载结果的Promise
   */
  async preload(imageUrls, options = {}) {
    // 合并默认配置和传入配置
    const { timeout, concurrency, onProgress } = { ...this.defaultOptions, ...options };
    const results = [];
    const total = imageUrls.length;
    let current = 0;

    // 创建一个加载单个图片的函数
    const loadImage = (url) => {
      return new Promise((resolve) => {
        // 设置超时定时器
        const timeoutId = setTimeout(() => {
          resolve({
            status: 'error',
            url,
            error: new Error(`图片加载超时: ${url}`)
          });
        }, timeout);

        const img = new Image();

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve({
            status: 'success',
            url,
            width: img.width,
            height: img.height
          });
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          resolve({
            status: 'error',
            url,
            error: new Error(`图片加载失败: ${url}`)
          });
        };

        // 开始加载图片
        img.src = url;
        // 设置crossOrigin以支持跨域图片获取宽高等信息
        img.crossOrigin = 'anonymous';
      });
    };

    // 实现并发控制的函数
    const loadWithConcurrency = async () => {
      const queue = [...imageUrls];
      const activeRequests = new Set();

      while (queue.length > 0 || activeRequests.size > 0) {
        // 当活跃请求数小于并发数且队列有任务时，创建新的请求
        while (activeRequests.size < concurrency && queue.length > 0) {
          const url = queue.shift();
          const request = loadImage(url).then(result => {
            activeRequests.delete(request);
            results.push(result);
            current++;
            
            // 调用进度回调
            if (typeof onProgress === 'function') {
              onProgress(current, total, result);
            }
          });
          
          activeRequests.add(request);
        }

        // 等待任一请求完成
        if (activeRequests.size > 0) {
          await Promise.race(activeRequests);
        }
      }
    };

    // 开始加载
    await loadWithConcurrency();
    return results;
  }

  /**
   * 预加载单个图片
   * @param {string} url - 图片URL
   * @param {Object} options - 配置选项
   * @returns {Promise<{status: 'success'|'error', url: string, width?: number, height?: number, error?: Error}>}
   */
  async preloadSingle(url, options = {}) {
    const [result] = await this.preload([url], options);
    return result;
  }

  // 静态方法，方便不创建实例直接使用
  static async preload(imageUrls, options = {}) {
    const preloader = new ImagePreloader();
    return preloader.preload(imageUrls, options);
  }

  static async preloadSingle(url, options = {}) {
    const preloader = new ImagePreloader();
    return preloader.preloadSingle(url, options);
  }
}

// ==========================================
// 第二部分: 函数式编程实现
// ==========================================
/**
 * 函数式编程风格的图片预加载工具
 */
const imagePreloaderFP = {
  /**
   * 创建加载单个图片的函数
   * @param {number} timeout - 超时时间
   * @returns {Function} 加载单个图片的函数
   */
  createLoadImageFunction: (timeout = 30000) => {
    return (url) => {
      return new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve({
            status: 'error',
            url,
            error: new Error(`图片加载超时: ${url}`)
          });
        }, timeout);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve({
            status: 'success',
            url,
            width: img.width,
            height: img.height
          });
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          resolve({
            status: 'error',
            url,
            error: new Error(`图片加载失败: ${url}`)
          });
        };

        img.src = url;
      });
    };
  },

  /**
   * 创建并发控制函数
   * @param {number} concurrency - 并发数
   * @returns {Function} 带并发控制的任务执行函数
   */
  createConcurrencyControl: (concurrency = 5) => {
    return async (tasks, onProgress) => {
      const results = [];
      const queue = [...tasks];
      const activeRequests = new Set();
      const total = tasks.length;
      let completed = 0;

      while (queue.length > 0 || activeRequests.size > 0) {
        while (activeRequests.size < concurrency && queue.length > 0) {
          const task = queue.shift();
          const resultPromise = task();
          
          activeRequests.add(resultPromise);
          
          resultPromise.then(result => {
            activeRequests.delete(resultPromise);
            results.push(result);
            completed++;
            
            if (typeof onProgress === 'function') {
              onProgress(completed, total, result);
            }
          });
        }

        if (activeRequests.size > 0) {
          await Promise.race(activeRequests);
        }
      }

      return results;
    };
  },

  /**
   * 预加载图片资源的纯函数
   * @param {Array<string>} imageUrls - 图片URL数组
   * @param {Object} options - 配置选项
   * @returns {Promise<Array<{status: 'success'|'error', url: string, width?: number, height?: number, error?: Error}>>}
   */
  preloadImages: (imageUrls, options = {}) => {
    const { timeout = 30000, concurrency = 5, onProgress = null } = options;
    
    const loadImage = imagePreloaderFP.createLoadImageFunction(timeout);
    
    const executeWithConcurrency = imagePreloaderFP.createConcurrencyControl(concurrency);
    
    const tasks = imageUrls.map(url => () => loadImage(url));
    
    return executeWithConcurrency(tasks, onProgress);
  },

  /**
   * 预加载单个图片的纯函数
   * @param {string} url - 图片URL
   * @param {Object} options - 配置选项
   * @returns {Promise<{status: 'success'|'error', url: string, width?: number, height?: number, error?: Error}>}
   */
  preloadSingleImage: (url, options = {}) => {
    return imagePreloaderFP.preloadImages([url], options).then(results => results[0]);
  }
};

const preloadImages = imagePreloaderFP.preloadImages;
const preloadSingleImage = imagePreloaderFP.preloadSingleImage;

// 工程化开发
export { 
  ImagePreloader, 
  preloadImages, 
  preloadSingleImage, 
  imagePreloaderFP 
};

// 浏览器环境的开发，直接 window 对象上进行注入就可以了
typeof window !== 'undefined' && (window.ImagePreloader = ImagePreloader);
typeof window !== 'undefined' && (window.preloadImages = preloadImages);
typeof window !== 'undefined' && (window.preloadSingleImage = preloadSingleImage);
typeof window !== 'undefined' && (window.imagePreloaderFP = imagePreloaderFP);
```

### 获取图片信息
* 在很多时候，我们需要获取图片的信息，比如图片的宽度、高度、大小等，进行一些进一步的操作实现吧
    * 我们可以使用 `Image` 对象来获取图片的信息，比如图片的宽度、高度、大小等
    * 我们可以使用 `File` 对象来获取图片的信息，比如图片的名称、大小、类型等
    * 我们可以使用 `URL` 对象来获取图片的信息，比如图片的路径、文件名等
    * 我们可以使用 `Blob` 对象来获取图片的信息，比如图片的大小、类型等
    * 我们可以使用 `Canvas` 对象来获取图片的信息，比如图片的宽度、高度、大小等
    * 我们可以使用 `ImageData` 对象来获取图片的信息，比如图片的像素数据等
    * 我们可以使用 `OffscreenCanvas` 对象来获取图片的信息，比如图片的宽度、高度、大小等
    * 我们可以使用 `WebGLRenderingContext` 对象来获取图片的信息，比如图片的宽度、高度、大小等
* 在开发中常见的使用场景
    * 获取得到图片资源的元信息，进行动态的计算得到图片加载导致的布局偏移（CLS）
        * 所以说在前端进行开发的时候，一般是严格遵守 UI 的设计稿来的，先书写结构，然后实现填充内容，从而避免 CLS 导致的页面回流和重绘，因为对于这些资源我们想要的是页面进行加载他们即可，不要印象原本的布局
    * 响应式处理
        * 我们可以使用 `window.matchMedia` 来监听窗口的变化，从而实现响应式处理
        * 我们可以使用 `window.innerWidth` 和 `window.innerHeight` 来获取窗口的宽度和高度
        * 我们可以使用 `window.devicePixelRatio` 来获取设备的像素比
        * 我们可以使用 `window.scrollX` 和 `window.scrollY` 来获取滚动条的位置
        * 我们可以使用 `window.getComputedStyle` 来获取元素的计算样式
        * 我们可以使用 `window.getBoundingClientRect` 来获取元素的位置和大小
        * 我们可以使用 `window.requestAnimationFrame` 来实现动画效果
        * 我们可以使用 `window.cancelAnimationFrame` 来取消动画效果
        * 我们可以使用 `window.matchMedia` 来监听媒体查询的变化
        * 我们可以使用 `window.addEventListener` 来添加事件监听器
        * 我们可以使用 `window.removeEventListener` 来移除事件监听器
        * 我们可以使用 `window.dispatchEvent` 来触发事件
        * 我们可以使用 `window.setTimeout` 来实现延时执行
        * 我们可以使用 `window.setInterval` 来实现循环执行
        * 我们可以使用 `window.clearTimeout` 来取消延时执行
        * 我们可以使用 `window.clearInterval` 来取消循环执行
        * 我们可以使用 `window.encodeURIComponent` 来编码 URL 组件
    * 资源优化
    * 性能监控

#### 基础版本
```javascript
const img = new Image();
img.src = "product.jpg";
img.onload = function() {
  const originalWidth = img.naturalWidth;
  const originalHeight = img.naturalHeight;
  console.log("图片原始尺寸：", originalWidth, "x", originalHeight);

  if (originalWidth > 800) {
    img.style.width = "800px";
    img.style.height = "auto"; // 保持比例
  }
};
```

#### 进阶版本
```javascript
/**
 * 图片工具库 - 提供性能监控计算、图片原数据上报等功能
 * @author: juwenzhang
 */

// ==========================================
// 第一部分: 面向对象实现
// ==========================================
/**
 * 图片工具类 - 提供图片信息获取、性能监控和原数据上报功能
 */
class ImageTools {
  /**
   * 构造函数
   * @param {Object} defaultOptions - 全局默认配置项
   */
  constructor(defaultOptions = {}) {
    this.defaultOptions = {
      timeout: 30000,
      reportUrl: '',
      ...defaultOptions
    };
    
    // 性能监控数据存储
    this.performanceData = {};
  }

  /**
   * 获取图片信息
   * @param {string} url - 图片URL
   * @param {Object} options - 配置选项
   * @returns {Promise<{width: number, height: number, naturalWidth: number, naturalHeight: number, size?: number, type?: string, loadTime?: number}>}
   */
  async getImageInfo(url, options = {}) {
    const { timeout = this.defaultOptions.timeout } = options;
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`获取图片信息超时: ${url}`));
      }, timeout);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        clearTimeout(timeoutId);
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // 存储性能数据
        this.performanceData[url] = {
          loadTime,
          startTime,
          endTime,
          timestamp: Date.now()
        };

        resolve({
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          loadTime
        });
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`获取图片信息失败: ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * 获取图片详细信息
   * @param {string} url - 图片URL
   * @param {Object} options - 配置选项
   * @returns {Promise<{width: number, height: number, naturalWidth: number, naturalHeight: number, size: number, type: string, loadTime: number, headers?: Object}>}
   */
  async getImageDetails(url, options = {}) {
    const startTime = performance.now();
    
    try {
      // 先通过fetch获取文件信息
      const response = await fetch(url, {
        method: 'HEAD',
        ...options.fetchOptions
      });
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`);
      }
      
      // 获取文件大小和类型
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      // 获取图片尺寸信息
      const imageInfo = await this.getImageInfo(url, options);
      const endTime = performance.now();
      const totalLoadTime = endTime - startTime;
      
      const details = {
        ...imageInfo,
        size: contentLength ? parseInt(contentLength, 10) : 0,
        type: contentType || 'unknown',
        totalLoadTime,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      // 合并性能数据
      this.performanceData[url] = {
        ...this.performanceData[url],
        ...details,
        timestamp: Date.now()
      };
      
      return details;
    } catch (error) {
      console.error('获取图片详细信息失败:', error);
      throw error;
    }
  }

  /**
   * 计算图片加载性能指标
   * @param {string} url - 图片URL
   * @returns {Object|null} 性能指标对象或null
   */
  getPerformanceMetrics(url) {
    if (!this.performanceData[url]) {
      return null;
    }
    
    const data = this.performanceData[url];
    
    return {
      loadTime: data.loadTime || 0,
      totalLoadTime: data.totalLoadTime || 0,
      timestamp: data.timestamp,
      startTime: data.startTime,
      endTime: data.endTime,
      size: data.size || 0,
      throughput: data.size && data.loadTime ? (data.size / data.loadTime) * 1000 : 0 // 字节/秒
    };
  }

  /**
   * 上报图片原数据
   * @param {string} url - 图片URL
   * @param {Object} additionalData - 额外上报的数据
   * @param {string} reportUrl - 上报URL，优先级高于默认配置
   * @returns {Promise<void>}
   */
  async reportImageData(url, additionalData = {}, reportUrl = this.defaultOptions.reportUrl) {
    if (!reportUrl) {
      console.warn('上报URL未配置，无法上报图片数据');
      return;
    }
    
    const metrics = this.getPerformanceMetrics(url);
    const imageInfo = this.performanceData[url];
    
    if (!metrics || !imageInfo) {
      console.warn('未找到图片数据，无法上报');
      return;
    }
    
    const reportData = {
      url,
      ...metrics,
      ...imageInfo,
      ...additionalData,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      devicePixelRatio: window.devicePixelRatio,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };
    
    try {
      await fetch(reportUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });
      console.debug('图片数据上报成功:', url);
    } catch (error) {
      console.error('图片数据上报失败:', error);
    }
  }

  /**
   * 计算图片导致的布局偏移（CLS相关）
   * @param {string} url - 图片URL
   * @param {number} expectedWidth - 预期宽度
   * @param {number} expectedHeight - 预期高度
   * @returns {number|null} 布局偏移分数或null
   */
  calculateLayoutShift(url, expectedWidth, expectedHeight) {
    const data = this.performanceData[url];
    
    if (!data || !data.naturalWidth || !data.naturalHeight) {
      return null;
    }
    
    // 简化的CLS计算：比较实际尺寸与预期尺寸的差异
    const widthDiff = Math.abs(data.naturalWidth - expectedWidth);
    const heightDiff = Math.abs(data.naturalHeight - expectedHeight);
    
    // 计算偏移面积占视口面积的比例
    const viewportArea = window.innerWidth * window.innerHeight;
    const shiftArea = widthDiff * heightDiff;
    
    return viewportArea > 0 ? shiftArea / viewportArea : 0;
  }

  /**
   * 获取所有性能监控数据
   * @returns {Object} 所有图片的性能数据
   */
  getAllPerformanceData() {
    return { ...this.performanceData };
  }

  /**
   * 清除性能监控数据
   * @param {string} url - 可选，指定要清除的图片URL，不指定则清除所有
   */
  clearPerformanceData(url) {
    if (url) {
      delete this.performanceData[url];
    } else {
      this.performanceData = {};
    }
  }
}

// ==========================================
// 第二部分: 函数式编程实现
// ==========================================
/**
 * 函数式编程风格的图片工具
 */
const imageToolsFP = {
  // 存储性能数据
  performanceStore: {},
  
  /**
   * 创建获取图片信息的函数
   * @param {number} timeout - 超时时间
   * @returns {Function} 获取图片信息的函数
   */
  createGetImageInfo: (timeout = 30000) => {
    return async (url) => {
      const startTime = performance.now();
      
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`获取图片信息超时: ${url}`));
        }, timeout);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          clearTimeout(timeoutId);
          const endTime = performance.now();
          const loadTime = endTime - startTime;
          
          const result = {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            loadTime
          };
          
          // 存储性能数据
          imageToolsFP.performanceStore[url] = {
            ...result,
            startTime,
            endTime,
            timestamp: Date.now()
          };

          resolve(result);
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`获取图片信息失败: ${url}`));
        };

        img.src = url;
      });
    };
  },

  /**
   * 获取图片详细信息
   * @param {Function} getImageInfo - 获取图片信息的函数
   * @param {Object} fetchOptions - fetch配置选项
   * @returns {Function} 获取图片详细信息的函数
   */
  createGetImageDetails: (getImageInfo, fetchOptions = {}) => {
    return async (url) => {
      const startTime = performance.now();
      
      try {
        // 先通过fetch获取文件信息
        const response = await fetch(url, {
          method: 'HEAD',
          ...fetchOptions
        });
        
        if (!response.ok) {
          throw new Error(`请求失败: ${response.status}`);
        }
        
        // 获取文件大小和类型
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        
        // 获取图片尺寸信息
        const imageInfo = await getImageInfo(url);
        const endTime = performance.now();
        const totalLoadTime = endTime - startTime;
        
        const details = {
          ...imageInfo,
          size: contentLength ? parseInt(contentLength, 10) : 0,
          type: contentType || 'unknown',
          totalLoadTime,
          headers: Object.fromEntries(response.headers.entries())
        };
        
        // 合并性能数据
        if (imageToolsFP.performanceStore[url]) {
          imageToolsFP.performanceStore[url] = {
            ...imageToolsFP.performanceStore[url],
            ...details,
            timestamp: Date.now()
          };
        }
        
        return details;
      } catch (error) {
        console.error('获取图片详细信息失败:', error);
        throw error;
      }
    };
  },

  /**
   * 创建获取性能指标的函数
   * @returns {Function} 获取性能指标的函数
   */
  createGetPerformanceMetrics: () => {
    return (url) => {
      if (!imageToolsFP.performanceStore[url]) {
        return null;
      }
      
      const data = imageToolsFP.performanceStore[url];
      
      return {
        loadTime: data.loadTime || 0,
        totalLoadTime: data.totalLoadTime || 0,
        timestamp: data.timestamp,
        startTime: data.startTime,
        endTime: data.endTime,
        size: data.size || 0,
        throughput: data.size && data.loadTime ? (data.size / data.loadTime) * 1000 : 0
      };
    };
  },

  /**
   * 创建图片数据上报函数
   * @param {string} defaultReportUrl - 默认上报URL
   * @returns {Function} 图片数据上报函数
   */
  createReportImageData: (defaultReportUrl = '') => {
    const getMetrics = imageToolsFP.createGetPerformanceMetrics();
    
    return async (url, additionalData = {}, reportUrl = defaultReportUrl) => {
      if (!reportUrl) {
        console.warn('上报URL未配置，无法上报图片数据');
        return;
      }
      
      const metrics = getMetrics(url);
      const imageInfo = imageToolsFP.performanceStore[url];
      
      if (!metrics || !imageInfo) {
        console.warn('未找到图片数据，无法上报');
        return;
      }
      
      const reportData = {
        url,
        ...metrics,
        ...imageInfo,
        ...additionalData,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        devicePixelRatio: window.devicePixelRatio,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height
      };
      
      try {
        await fetch(reportUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reportData)
        });
        console.debug('图片数据上报成功:', url);
      } catch (error) {
        console.error('图片数据上报失败:', error);
      }
    };
  },

  /**
   * 创建布局偏移计算函数
   * @returns {Function} 布局偏移计算函数
   */
  createCalculateLayoutShift: () => {
    return (url, expectedWidth, expectedHeight) => {
      const data = imageToolsFP.performanceStore[url];
      
      if (!data || !data.naturalWidth || !data.naturalHeight) {
        return null;
      }
      
      const widthDiff = Math.abs(data.naturalWidth - expectedWidth);
      const heightDiff = Math.abs(data.naturalHeight - expectedHeight);
      
      const viewportArea = window.innerWidth * window.innerHeight;
      const shiftArea = widthDiff * heightDiff;
      
      return viewportArea > 0 ? shiftArea / viewportArea : 0;
    };
  },

  /**
   * 获取所有性能数据
   * @returns {Object} 所有图片的性能数据
   */
  getAllPerformanceData: () => {
    return { ...imageToolsFP.performanceStore };
  },

  /**
   * 清除性能数据
   * @param {string} url - 可选，指定要清除的图片URL
   */
  clearPerformanceData: (url) => {
    if (url) {
      delete imageToolsFP.performanceStore[url];
    } else {
      imageToolsFP.performanceStore = {};
    }
  }
};

// 创建常用的工具函数
const getImageInfo = imageToolsFP.createGetImageInfo(30000);
const getImageDetails = imageToolsFP.createGetImageDetails(getImageInfo);
const getPerformanceMetrics = imageToolsFP.createGetPerformanceMetrics();
const reportImageData = imageToolsFP.createReportImageData();
const calculateLayoutShift = imageToolsFP.createCalculateLayoutShift();

// 统一模块导出方案
// 适配不同环境的模块导出
(function() {
  try {
    // 检查是否支持CommonJS模块
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = {
        ImageTools,
        imageToolsFP,
        getImageInfo,
        getImageDetails,
        getPerformanceMetrics,
        reportImageData,
        calculateLayoutShift
      };
    } 
    // 检查是否支持AMD模块
    else if (typeof define === 'function' && define.amd) {
      define([], function() {
        return {
          ImageTools,
          imageToolsFP,
          getImageInfo,
          getImageDetails,
          getPerformanceMetrics,
          reportImageData,
          calculateLayoutShift
        };
      });
    } 
    // 浏览器环境，挂载到全局window对象
    else if (typeof window !== 'undefined') {
      window.ImageTools = ImageTools;
      window.imageToolsFP = imageToolsFP;
      window.getImageInfo = getImageInfo;
      window.getImageDetails = getImageDetails;
      window.getPerformanceMetrics = getPerformanceMetrics;
      window.reportImageData = reportImageData;
      window.calculateLayoutShift = calculateLayoutShift;
    }
  } catch (error) {
    console.warn('模块导出适配失败:', error);
  }
})();


// ==========================================
// 第三部分: 使用示例
// ==========================================
// 创建ImageTools实例
const imageTools = new ImageTools({
  timeout: 15000,
  reportUrl: 'https://example.com/api/report'
});

// 获取图片信息
async function exampleOOPGetImageInfo() {
  try {
    const imageUrl = 'https://example.com/image.jpg';
    const info = await imageTools.getImageInfo(imageUrl);
    console.log('图片信息:', info);
    
    // 输出示例: { width: 800, height: 600, naturalWidth: 1200, naturalHeight: 900, loadTime: 123.45 }
  } catch (error) {
    console.error('获取图片信息失败:', error);
  }
}

// 获取图片详细信息
async function exampleOOPGetImageDetails() {
  try {
    const imageUrl = 'https://example.com/image.jpg';
    const details = await imageTools.getImageDetails(imageUrl, {
      fetchOptions: {
        credentials: 'include'
      }
    });
    console.log('图片详细信息:', details);
    
    // 输出示例包含文件大小、类型等更多信息
  } catch (error) {
    console.error('获取图片详细信息失败:', error);
  }
}

// 获取图片性能指标和上报
async function exampleOOPPerformanceAndReport() {
  try {
    const imageUrl = 'https://example.com/image.jpg';
    await imageTools.getImageDetails(imageUrl);
    
    // 获取性能指标
    const metrics = imageTools.getPerformanceMetrics(imageUrl);
    console.log('性能指标:', metrics);
    
    // 计算布局偏移
    const cls = imageTools.calculateLayoutShift(imageUrl, 800, 600);
    console.log('布局偏移分数:', cls);
    
    // 上报数据
    await imageTools.reportImageData(imageUrl, {
      page: window.location.href,
      elementId: 'hero-image',
      expectedWidth: 800,
      expectedHeight: 600
    });
  } catch (error) {
    console.error('操作失败:', error);
  }
}


// 基本使用
async function exampleFPBasicUsage() {
  try {
    const imageUrl = 'https://example.com/image.jpg';
    const info = await getImageInfo(imageUrl);
    console.log('图片信息(FP):', info);
  } catch (error) {
    console.error('获取图片信息失败:', error);
  }
}

// 自定义配置
async function exampleFPCustomConfig() {
  try {
    // 创建自定义配置的工具函数
    const customGetImageInfo = imageToolsFP.createGetImageInfo(10000);
    const customGetDetails = imageToolsFP.createGetImageDetails(customGetImageInfo, {
      headers: {
        'Authorization': 'Bearer token123'
      }
    });
    const customReport = imageToolsFP.createReportImageData('https://custom-api.com/report');
    
    const imageUrl = 'https://example.com/secure-image.jpg';
    const details = await customGetDetails(imageUrl);
    console.log('自定义配置获取图片详情:', details);
    
    // 自定义上报
    await sendLogs(imageUrl, {
      source: 'custom-module',
      priority: 'high'
    });
  } catch (error) {
    console.error('自定义配置操作失败:', error);
  }
}

// 批量处理和性能分析
async function exampleFPBatchProcessing() {
  const imageUrls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ];
  
  try {
    // 并行获取所有图片信息
    const promises = imageUrls.map(url => getImageDetails(url));
    const results = await Promise.all(promises);
    
    // 分析性能数据
    const allMetrics = imageToolsFP.getAllPerformanceData();
    
    // 计算平均加载时间
    const totalLoadTime = results.reduce((sum, result) => sum + result.loadTime, 0);
    const avgLoadTime = totalLoadTime / results.length;
    
    // 计算总大小
    const totalSize = results.reduce((sum, result) => sum + result.size, 0);
    
    console.log('批量处理结果:');
    console.log('平均加载时间:', avgLoadTime.toFixed(2), 'ms');
    console.log('总大小:', (totalSize / 1024).toFixed(2), 'KB');
    console.log('所有性能数据:', allMetrics);
    
    // 清除特定图片的性能数据
    imageToolsFP.clearPerformanceData(imageUrls[0]);
  } catch (error) {
    console.error('批量处理失败:', error);
  }
}


// 图片资源优化分析
async function exampleImageOptimizationAnalysis() {
  try {
    const imageUrl = 'https://example.com/large-image.jpg';
    const details = await getImageDetails(imageUrl);
    
    // 分析图片是否需要优化
    const sizeInKB = details.size / 1024;
    const resolution = details.naturalWidth * details.naturalHeight;
    const dpr = window.devicePixelRatio;
    
    // 判断标准示例
    const shouldOptimize = {
      sizeTooLarge: sizeInKB > 500, // 大于500KB
      resolutionTooHigh: resolution > 2000 * 1500 * dpr * dpr, // 超过设备所需分辨率
      loadTimeTooLong: details.loadTime > 2000 // 加载时间超过2秒
    };
    
    console.log('图片优化建议:', {
      ...shouldOptimize,
      currentSizeKB: sizeInKB.toFixed(2),
      currentResolution: `${details.naturalWidth}x${details.naturalHeight}`,
      loadTimeMS: details.loadTime.toFixed(2),
      recommendations: [
        shouldOptimize.sizeTooLarge ? '压缩图片文件大小' : '',
        shouldOptimize.resolutionTooHigh ? '提供合适分辨率的图片' : '',
        shouldOptimize.loadTimeTooLong ? '使用CDN加速或WebP格式' : ''
      ].filter(Boolean)
    });
  } catch (error) {
    console.error('图片优化分析失败:', error);
  }
}

// 示例3.2: 响应式图片加载策略
async function exampleResponsiveImageLoading() {
  try {
    // 根据设备像素比选择合适的图片
    const dpr = window.devicePixelRatio;
    const viewportWidth = window.innerWidth;
    
    // 计算合适的图片尺寸
    const targetWidth = Math.min(viewportWidth * 0.8, 1200); // 最大1200px宽度
    const idealWidth = Math.ceil(targetWidth * dpr); // 根据DPR调整
    
    // 选择最合适的图片URL
    let selectedImageUrl = 'https://example.com/image-800w.jpg'; // 默认
    
    if (idealWidth <= 800) {
      selectedImageUrl = 'https://example.com/image-800w.jpg';
    } else if (idealWidth <= 1200) {
      selectedImageUrl = 'https://example.com/image-1200w.jpg';
    } else {
      selectedImageUrl = 'https://example.com/image-1600w.jpg';
    }
    
    console.log('根据设备选择的图片:', {
      dpr,
      viewportWidth,
      targetWidth,
      idealWidth,
      selectedImageUrl
    });
    
    // 加载选择的图片
    const image = new Image();
    image.src = selectedImageUrl;
    
    // 获取图片信息并监控性能
    const info = await getImageInfo(selectedImageUrl);
    
    // 上报选择策略和结果
    await reportImageData(selectedImageUrl, {
      strategy: 'responsive-dpr',
      targetWidth,
      idealWidth,
      viewportWidth,
      dpr
    });
    
    return image;
  } catch (error) {
    console.error('响应式图片加载失败:', error);
  }
}
```

### 优化思考
* 使用 Image 函数的时候，如何避免无效的加载呢？？？
    * 1. 使用 set 数据结构或者自己进行构造得出缓存依赖收集即可
    * 2. 结合 srcset sizes 进行使用，实现最后的硬件层的优化加载实现

#### 基础版本
```javascript
const imgCache = new Set(); // 缓存已加载的图片地址
function loadImage(url) {
    if (imgCache.has(url)) return Promise.resolve(url); // 已加载，直接返回
    return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
            imgCache.add(url);
            resolve(url);
        };
        img.onerror = () => {
            reject(new Error(`加载失败：${url}`));
        };
    });
}
```

### 最终工具
> Image 加载是 异步非阻塞 的（不会阻塞 JS 执行和 DOM 解析），但大量图片同时加载会占用网络带宽，可能导致关键资源（如 CSS、JS）加载延迟。
> 优化：使用 “懒加载”（Lazy Loading），仅加载视口内的图片；或通过 requestIdleCallback 延迟加载非关键图片。

> 问题：若图片来自不同域名（跨域），且服务器未配置 Access-Control-Allow-Origin，则 Image 对象的以下操作会被禁止：
> 调用 img.toDataURL() 或 ctx.drawImage(img, ...)（Canvas 绘制），会触发 “污染资源” 错误。
> 服务器端配置 CORS：在图片响应头中添加 Access-Control-Allow-Origin: *（或指定域名）。
> 加载图片时添加 crossOrigin 属性（需与服务器 CORS 配置匹配）

#### 基础工具
```typescript
/**
 * 图片工具库 - 包含 requestIdleCallback 及 polyfill、避免重复加载等功能
 * 作者: juwenzhang
 */

/**
 * 定义 requestIdleCallback 及相关类型
 */
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
 * requestIdleCallback polyfill 实现
 */
export const requestIdleCallback: (callback: RequestIdleCallbackCallback, options?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle = (
    window && window.requestIdleCallback.bind(window)
) || (
    (callback: RequestIdleCallbackCallback, options?: RequestIdleCallbackOptions) => {
        const startTime = Date.now();
        return window.setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - startTime))
            });
        }, options?.timeout || 1);
    }
);

/**
 * cancelIdleCallback polyfill 实现
 */
export const cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void = (
    window && window.cancelIdleCallback.bind(window)
) || (
    (handle: RequestIdleCallbackHandle) => {
        window.clearTimeout(handle);
    }
);

/**
 * 图片加载状态类型
 */
export type ImageLoadStatus = 'loading' | 'success' | 'error';

/**
 * 图片加载结果接口
 */
export interface ImageLoadResult {
    status: ImageLoadStatus;
    url: string;
    width?: number;
    height?: number;
    error?: Error;
    loadTime?: number;
}

/**
 * 图片加载选项接口
 */
export interface ImageLoadOptions {
    timeout?: number;
    onProgress?: (current: number, total: number, result: ImageLoadResult) => void;
    signal?: AbortSignal;
}

/**
 * 图片加载缓存管理器
 * 用于避免相同链接重复加载
 */
export class ImageCacheManager {
    private static instance: ImageCacheManager;
    private loadingPromises: Map<string, Promise<ImageLoadResult>> = new Map();
    private cacheResults: Map<string, ImageLoadResult> = new Map();

    private constructor() {}

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
     * 检查图片是否正在加载或已加载
     */
    public has(url: string): boolean {
        return this.loadingPromises.has(url) || this.cacheResults.has(url);
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
 * 图片工具类 - 提供图片加载相关功能
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
     * 批量加载图片（使用requestIdleCallback优化性能）
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

export default ImageUtils;
```

#### 进阶工具
```typescript
/**
 * @description 图片工具库
 * @author juwenzhang
 */

// 扩展Window接口声明，以支持React和Vue类型
interface Window {
  Vue?: any;
  React?: any;
  imageUtilsPreview?: HTMLElement;
}

// 框架组件选项接口定义
// @ts-ignore
interface FrameworkComponentOptions {
  type?: 'table' | 'image';
  framework?: 'react' | 'vue' | 'vanilla';
  [key: string]: any;
}

// 全局环境检测 - 使用更安全的类型检查
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const isReact = isBrowser && typeof window !== 'undefined' && typeof (window as any).React !== 'undefined';
const isVue = isBrowser && typeof window !== 'undefined' && typeof (window as any).Vue !== 'undefined';

// 跨端环境检测
const isAndroid = isBrowser && navigator.userAgent.toLowerCase().includes('android');
const isIOS = isBrowser && /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
const isDesktop = isBrowser && !isAndroid && !isIOS;

/**
 * 获取当前操作系统平台
 */
const getPlatform = (): 'android' | 'ios' | 'desktop' | 'unknown' => {
    if (isBrowser) {
        if (isAndroid) return 'android';
        if (isIOS) return 'ios';
        if (isDesktop) return 'desktop';
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
    renderMode?: 'dom' | 'html' | 'react' | 'vue'; // 新增：支持多种渲染模式
    customCellRenderer?: (value: any, column: string, row: any) => string | HTMLElement | any; // 新增：自定义单元格渲染器
    customImageRenderer?: (url: string, row: any, column: string) => string | HTMLElement | any; // 新增：自定义图片渲染器
    className?: string; // 新增：表格容器类名
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
                    if (isReact && typeof window.React === 'object') {
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
    private renderTableForReact(options: {
        dataSource: Array<{[key: string]: any}>;
        imageColumns: string[];
        maxWidth: number;
        maxHeight: number;
        customCellRenderer?: (value: any, column: string, row: any) => any;
        customImageRenderer?: (url: string, row: any, column: string) => any;
        className: string;
    }): any {
        if (!isReact || typeof window.React !== 'object' || typeof window.React.createElement !== 'function') {
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

    // 显示图片预览 - 直接在函数式API中实现
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

                // 创建图片元素
                const img = document.createElement('img');
                img.src = imageUrl;
                img.style.maxWidth = '90%';
                img.style.maxHeight = '90vh';
                img.style.objectFit = 'contain';
                img.style.transition = 'transform 0.3s ease';
                img.style.transform = 'scale(0.95)';

                // 添加到容器
                previewContainer.appendChild(closeButton);
                previewContainer.appendChild(img);
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
                        document.removeEventListener('keydown', handleEscKey);
                    }
                };

                document.addEventListener('keydown', handleEscKey);

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
```