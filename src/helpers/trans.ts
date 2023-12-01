import store from '@/store';
const { environment } = store.state;
const dev = environment == 'dev';

// 获取code码
const mtLogin = () => {
    return new Promise((resolve) => {
        if (dev) {
            resolve('123456');
        } else {
            mt.login({
                success: (res: any) => {
                    if (res && res.code) {
                        resolve(res.code);
                    }
                },
            });
        }
    });
};

// 获取设备信息
const mtGetSystemInfo = () => {
    return new Promise((resolve) => {
        if (dev) {
            resolve({});
        } else {
            mt.getSystemInfo({
                success: (res: any) => {
                    const { log } = console;
                    log('判断登录态授权4');
                    resolve(res);
                },
            });
        }
    });
};

// 获取右上角胶囊信息
const mtGetMenuButtonBoundingClientRect = () => {
    return new Promise((resolve) => {
        if (dev) {
            resolve({
                top: 0,
                bottom: 0,
                width: 0,
                height: 0,
                left: 0,
                right: 0,
            });
        } else {
            resolve(mt.getMenuButtonBoundingClientRect());
        }
    });
};

// 检测登录态
const mtCheckSession = () => {
    return new Promise<void>((resolve, reject) => {
        if (dev) {
            resolve();
        } else {
            mt.checkSession({
                success: () => {
                    resolve();
                },
                fail: () => {
                    reject();
                },
            });
        }
    });
};

// 获取运行参数
const mtGetLaunchOptionsSync = () => {
    return new Promise((resolve) => {
        if (dev) {
            const data: {
                scene: number;
                query: any;
            } = {
                scene: 0,
                query: {},
            };
            resolve(data);
        } else {
            const data = mt.getLaunchOptionsSync();
            resolve(data);
        }
    });
};

// 监听系统返回
const mtOnBeforeClosePage = (callback: any) => {
    const { isiOS } = store.state;
    if (dev || isiOS) {
        return false;
    }
    mt.onBeforeClosePage(callback);
};

// 退出小程序
const mtExitMiniProgram = () => {
    if (dev) {
        return false;
    }
    mt.exitMiniProgram();
};

export {
    mtLogin,
    mtGetSystemInfo,
    mtGetMenuButtonBoundingClientRect,
    mtCheckSession,
    mtGetLaunchOptionsSync,
    mtOnBeforeClosePage,
    mtExitMiniProgram,
};
