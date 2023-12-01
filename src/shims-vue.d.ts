/* eslint-disable */
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@kkmh/utils';
declare module '@kk/request';
declare module 'spark-md5';
declare module '@/helpers/request';
declare module '@kk/sa/src/index.es.js';

declare const mt: any;

interface Window {
    kksa: any;
    request: any;
    skeletonScreen: any;
}
