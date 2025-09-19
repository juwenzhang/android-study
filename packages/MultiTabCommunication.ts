// 定义消息类型接口
interface BaseMessage {
    type: string;
    timestamp: number;
    senderId: string;
    channel?: string;
}

// 带数据的消息接口
export interface MessageWithData<T = any> extends BaseMessage {
    data: T;
}

// 配置选型
interface TabCommunicatorConfig {
    allowedOrigins: string[];  // 收集允许通信的域名列表
    channel: string;  // 通信通道名称
}

class TabCommunicator {
    private allowedOrigins: string[];
    private channel?: string;
    private senderId: string;
    private listeners: Map<
        string, 
        Array<<T = any>(data: T) => void>
    > = new Map();

    private constructor(options: TabCommunicatorConfig) {
        this.allowedOrigins = options.allowedOrigins;
        this.channel = options.channel;

        // 为了区分每个页面的单独的身份信息，
        // 我们需要做的是为每个页面实现生成一个唯一的 senderId
        this.senderId = this.generateSenderId();

        // 初始化事件监听中的消息监听
        this.initMessageEventListeners();

        // 初始化存储类的事件监听
        this.initStorageEventListeners();
    }

    public static create(options: TabCommunicatorConfig): TabCommunicator {
        return new TabCommunicator(options);
    }

    private generateSenderId(): string {
        // 根据实际需求进行 senderId 生成
        return `tab_${this.channel}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    private initMessageEventListeners() {
        window.addEventListener('message', e => {
            // 获取得到一些元数据: data: 是信息， origin: 是发送方的域名， source: 是发送方的 window 对象
            const { origin } = e;

            // 校验是否是在授权列表中的呐
            if (!this.allowedOrigins.includes(origin) 
                && this.allowedOrigins.includes('*')) {
                return;
            }

            try {
                const message = e.data as MessageWithData;

                // 排出自己
                if (message.senderId === this.senderId) {
                    return;
                }

                // 校验消息类型和时间戳
                if (!message.type || !message.timestamp) {
                    return;
                }

                if (this.channel && message.channel !== this.channel) {
                    return;
                }

                this.triggerEvent(message.type, message.data);
            }
            catch (e: unknown) {
                console.error('TabCommunicator 接收消息失败:', e);
            }
        })
    }

    private initStorageEventListeners() {
        window.addEventListener('storage', e => {
            if (e.key === `tab_${this.channel}`) {
                try {
                    const data = JSON.parse(e.newValue || '{}') as MessageWithData;

                    if (data.senderId === this.senderId) {
                        return;
                    }
                    this.triggerEvent(e.key, data);
                }
                catch (e: unknown) {
                    console.error('TabCommunicator 接收存储消息失败:', e);
                }
            }
        })
    }

    private triggerEvent<T = any>(type: string, data: T) {
        const handlers = this.listeners.get(type);
        if (handlers) {
            handlers.forEach(handler => handler(data));
        }
    }

    send<T = any>(type: string, data: T) {
        const message: MessageWithData<T> = {
            type,
            timestamp: Date.now(),
            senderId: this.senderId,
            channel: this.channel,
            data,
        };

        // 通过 postMessage 进行发送信息尝试
        if (window.opener) {
            try {
                this.allowedOrigins.forEach(origin => {
                    window.opener.postMessage(message, origin);
                })
            }
            catch (e: unknown) {
                console.error('TabCommunicator 发送消息失败:', e);
            }
        }

        // localStorage 广播机制实现传递
        try {
            localStorage.setItem(`tab_${this.channel}`, JSON.stringify(message));
            setTimeout(() => {
                localStorage.removeItem(`tab_${this.channel}`);
            }, 1000);
        }
        catch (e: unknown) {
            console.error('TabCommunicator 发送存储消息失败:', e);
        }
    }

    on<T = any>(type: string, handler: (data: T) => void) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type)?.push(handler as () => void);
    }

    off(type: string, callback?: (data: any) => void) {
        if (!this.listeners.has(type)) return;
        
        if (callback) {
            const callbacks = this.listeners.get(type)?.filter(cb => cb !== callback);
            if (callbacks) {
                this.listeners.set(type, callbacks);
            }
        } 
        else {
            this.listeners.delete(type);
        }
    }

    destroy() {
        this.listeners.clear();
        this.channel = undefined;
        window.removeEventListener('message', this.initMessageEventListeners);
        window.removeEventListener('storage', this.initStorageEventListeners);
    }
}

const getTabCommunicator = (channel: string) => {
    return TabCommunicator.create({
        channel,
        allowedOrigins: ['*'],
    });
}