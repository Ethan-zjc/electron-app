import { createStore } from 'vuex';
import { miniInfo } from '../mini.config';

// const channel = 'wechat';
const channel = 'meituan';
const packageId = 'com.kuaikan.main';
const onRelease = miniInfo.release;
const onReleaseVersion = miniInfo.version;
const env: string = import.meta.env.VITE_VUE_APP_HOST_ENV ? process.env.VUE_APP_HOST_ENV : 'dev';
// 定义 state 的类型
type State = {
    onRelease: boolean;
    onReleaseVersion: string;
    environment: string;
    channel: string;
    packageId: string;
    payfrom: number;
    openId: string;
    userId: string;
    gender: number;
    appletName: string;
    appId: string;
    accessToken: string;
    cps: string;
    systemInfo: any;
    topBarHei: number;
    topBarOffset: number;
    myActive: any;
    isiOS: boolean;
    iPhoneX: boolean;
    logoutFlag: boolean;
    userAgent: string;
    kk_s_t: string;
    userInfo: {
        user: {
            id: number;
            nickname: string;
            avatar_url: string;
        };
    };
    vipInfo: {
        vip_type: number;
        vip_big_icon: string;
        vip_info: string[];
    };
    follows: {
        [key: string]: boolean;
    };
    wallet: number;
    isLaunch: boolean;
};
const store = createStore({
    state: {
        onRelease, // 用于提审包阶段，提审包阶段设置为 true , 开发阶段设置为 false
        onReleaseVersion, // 线上小程序版本号
        environment: onRelease ? 'prod' : env, // 环境变量，prod/preview/stag/dev
        channel,
        packageId,
        payfrom: 28,
        openId: '',
        userId: '',
        gender: 3,
        cps: '',
        appletName: '快看mini',
        appId: 'mgc8kdz56n16mal2',
        accessToken: '',
        systemInfo: {},
        topBarHei: 88,
        topBarOffset: 0,
        myActive: 'history',
        isiOS: false,
        userInfo: {},
        vipInfo: {},
        iPhoneX: false,
        logoutFlag: false,
        userAgent: '',
        kk_s_t: '',
        follows: {},
        wallet: 0,
        isLaunch: true,
    } as State,
    mutations: {
        setStore(state: State, parms: { key: string; value: any }) {
            if (parms.key) {
                (state as any)[parms.key] = parms.value;
            }
        },
        setFollows(state: State, parms: { key: string; value: any }) {
            if (parms.key) {
                (state as any).follows[parms.key] = parms.value;
            }
        },
    },
});
export default store;
