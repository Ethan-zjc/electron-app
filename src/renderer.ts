/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import './assets/css/index.css';

import 'vant/lib/index.css';
import { Lazyload } from 'vant';
// import initSa from '@kk/sa/src/index.es.js';

// let serverUrl = '',
//     environment = '',
//     showLog = false;
// if (process.env.NODE_ENV === 'production') {
//     serverUrl = 'https://sa.kkmh.com/sa?project=applet_prod';
//     environment = 'prod';
//     showLog = false;
// } else {
//     serverUrl = 'https://sa.kkmh.com/sa?project=default';
//     environment = 'stag';
//     showLog = true;
// }

// initSa({
//     server_url: serverUrl,
//     project_id: 3,
//     show_log: showLog,
//     environment,
// });

createApp(App).use(Lazyload, {
    preLoad: 1.5,
    attempt: 3,
})
    .use(store)
    .use(router).mount('#app');
