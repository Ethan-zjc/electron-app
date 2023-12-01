import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';


const proxy = {};
const proxys = {
    '/v1': 'https://api.quickcan.cn/',
    '/v2': 'https://api.quickcan.cn/',
    '/mini': 'https://api.quickcan.cn/',
    '/v2/kb': 'https://pay.quickcan.cn/',
    '/v1/vip': 'https://pay.quickcan.cn/',
    '/v1/video_buy': 'https://pay.quickcan.cn/',
    '/v2/comicbuy': 'https://pay.quickcan.cn/',
};
for (let key in proxys) {
    proxy[key] = {
        target: proxys[key],
        changeOrigin: true,
    };
}

// https://vitejs.dev/config
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    server: {
        port: 8090,
        host: '0.0.0.0',
        proxy,
    }
});
