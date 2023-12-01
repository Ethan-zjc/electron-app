/*
 * 页面初始化
 */
import { utilShowToast } from '@/helpers/utils';
import store from '@/store';
import { mtLogin, mtCheckSession } from '@/helpers/trans';
import { rqs } from '@/helpers/request';

const openIdApi = (code: any) => {
    const { channel, environment } = store.state;
    const isDev = environment == 'dev';
    if (isDev) {
        return Promise.resolve({
            code: 200,
            data: {
                open_id: '12345678',
                session_key: 'kktest',
            },
        });
    } else {
        return rqs({
            url: '/v2/passport/oauth/code_info',
            data: {
                code,
                source: channel,
            },
        });
    }
};

const setOpenId = async () => {
    const mtCode = await mtLogin();
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
        try {
            const { code, data } = await openIdApi(mtCode);
            if (code == 200) {
                const openId = data.open_id;
                const token = data.session_key;
                store.commit('setStore', {
                    key: 'openId',
                    value: openId,
                });
                store.commit('setStore', {
                    key: 'accessToken',
                    value: token,
                });
                resolve();
            } else {
                reject();
            }
        } catch (error: any) {
            reject();
        }
    });
};

const getOpenId = async () => {
    const { openId } = store.state;
    if (openId) {
        return false;
    }
    try {
        await setOpenId();
    } catch (error) {
        utilShowToast({
            title: 'openId fail',
            duration: 3000,
        });
    }
};

const checkOpenId = async () => {
    const { openId } = store.state;
    if (openId) {
        try {
            const { log } = console;
            log('判断登录态授权3');
            await mtCheckSession();
        } catch (error: any) {
            await setOpenId();
        }
    } else {
        await setOpenId();
    }
};

export { getOpenId, setOpenId, checkOpenId };
