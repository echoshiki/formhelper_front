interface AppConfig {
    VITE_APP_PREFIX: string;
    VITE_API_URL: string;
}

// 从 .env 加载的默认配置
const defaultConfig: AppConfig = {
    VITE_APP_PREFIX: import.meta.env.VITE_APP_PREFIX || '/',
    VITE_API_URL: import.meta.env.VITE_API_URL || '/',
}

let config: AppConfig = defaultConfig;

const loadConfig = async () => {
    try {
        const response = await fetch(`${defaultConfig.VITE_APP_PREFIX}/config.json`);
        if (response.ok) {
            // 尝试加载 config.json
            const jsonConfig = await response.json();
            // 合并默认配置与加载配置，如果有冲突则覆盖默认配置
            config = { ...defaultConfig, ...jsonConfig };
            console.log('Loaded config from config.json', config);
        } else {
            console.warn('Failed to load config.json, falling back to default config from .env');
        }
    } catch (error) {
        console.warn('Failed to load config.json, falling back to default config from .env');
    }
}

// 获取配置
const getConfig: () => AppConfig = () => config;

export { getConfig, loadConfig };