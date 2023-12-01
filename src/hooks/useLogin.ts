/*
 * 联合登录
 */
import { utilShowToast, utilHideToast } from '@/helpers/utils';
import routerHooks from '@/router';
import store from '@/store';
import { mtLogin } from '@/helpers/trans';
import { rqs } from '@/helpers/request';
import { cookie } from '@kk/utils';
import { kksaIdentify } from '@/helpers/kksa';

const toLogin = (loginType: string) => {
    if (loginType != 'no') {
        routerHooks.push({ path: '/login' });
    }
};

const userInfoApi = (uid: string) => {
    return new Promise<void>((resolve, reject) => {
        rqs({
            url: '/v2/users/me',
            data: { user_id: uid },
        })
            .then((res: any) => {
                const { code, data } = res;
                if (code == 200) {
                    store.commit('setStore', {
                        key: 'userId',
                        value: uid,
                    });
                    store.commit('setStore', {
                        key: 'userInfo',
                        value: data,
                    });
                    kksaIdentify();
                    resolve();
                } else {
                    reject();
                }
            })
            .catch(() => {
                reject();
            });
    });
};

const signupApi = (code: any) => {
    const { channel } = store.state;
    const params = {
        code: code,
        data: '',
        phone_data: '',
        phone_iv: '',
        web_source: true,
    };
    return rqs({
        method: 'post',
        url: `/v2/passport/mini/${channel}_signup`,
        data: params,
    });
};

const loginSign = async (loginType: string) => {
    utilShowToast({ title: '登录中', type: 'loading' });
    const mtCode = await mtLogin();
    try {
        const { code, data } = await signupApi(mtCode);
        if (code == 200) {
            await userInfoApi(String(data.user.id));
            utilHideToast();
        } else {
            toLogin(loginType);
        }
    } catch (error: any) {
        utilShowToast({
            title: '服务异常',
            duration: 3000,
        });
        toLogin(loginType);
    }
};

const loginRemove = () => {
    localStorage.removeItem('header');
    store.commit('setStore', {
        key: 'userId',
        value: '',
    });
    store.commit('setStore', {
        key: 'userInfo',
        value: {},
    });
    cookie.remove('uid', '/');
    cookie.remove('session', '/');
    kksaIdentify();
};

const loginCheck = () => {
    const header: Partial<{
        session: string;
        uid: string;
    }> = JSON.parse(localStorage.getItem('header') || '{}');
    return new Promise<void>((resolve, reject) => {
        if (header.uid && header.session) {
            userInfoApi(header.uid)
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    loginRemove();
                    reject();
                });
        } else {
            loginRemove();
            reject();
        }
    });
};

/*
 * 登录初始化
 * type--登录类型；need:强制登录；deny:非强制；no:登录失败不跳转；
 */
const loginHandle = async (type = 'need') => {
    const { userId } = store.state;
    if (userId || ['deny'].includes(type)) {
        return false;
    } else {
        try {
            await loginCheck();
        } catch (error) {
            await loginSign(type);
        }
    }
};

export { loginHandle, loginCheck, loginRemove };
