import gs from './gs';
import store from '../store';
import request from '@kk/request';
import { cookie } from '@kk/utils';
import { utilShowToast } from './utils';
import { utilLogout } from './behaviors';

const { environment } = store.state;
const env = environment == 'dev';

const cacheCookie = (cookieStr = '', key = '') => {
    if (!key) {
        return;
    }
    const reg = new RegExp(key + '=([^;]*)');
    const matchRes = cookieStr.match(reg);
    if (matchRes) {
        store.commit('setStore', {
            key,
            value: decodeURIComponent(matchRes[1]),
        });
    }
};

const responseData = ({
    res,
    header,
    cacheHeader,
    url,
    resolve,
    reject,
}: {
    res: any;
    header: any;
    cacheHeader: any;
    url: string;
    resolve: any;
    reject: any;
}) => {
    const { code = 0, data = {} } = res;
    const responseCookies = header['Set-Cookie'] || header['set-cookie'] || `kk_s_t=${Date.now()}`;
    cacheCookie(responseCookies, 'kk_s_t');
    if (code === 200) {
        // 设置本地存储header
        if (!cacheHeader.uid) {
            const headerCookie = header['Set-Cookie'] || header['set-cookie'];
            if (headerCookie) {
                const sessionIndex = headerCookie.indexOf('session=');
                const uidIndex = headerCookie.indexOf('uid=');
                if (sessionIndex !== -1 && uidIndex !== -1) {
                    let session = headerCookie.substring(sessionIndex + 8);
                    session = session.substring(0, session.indexOf(';'));
                    let uid = headerCookie.substring(uidIndex + 4);
                    uid = uid.substring(0, uid.indexOf(';'));
                    localStorage.setItem('header', JSON.stringify({ session, uid }));
                }
            }
        }
        resolve(res);
    } else {
        if (code === 401 || code === 402) {
            if (url !== '/v2/users/me') {
                utilLogout();
                return false;
            }
        } else {
            if ([6002, 6003, 10552].includes(code)) {
                utilShowToast({ title: data['message'] });
            }
        }
        reject(res);
    }
};

const rqs = ({
    url,
    data,
    host,
    method,
    json = false,
}: {
    url: string;
    data?: object;
    host?: string;
    method?: string;
    json?: boolean;
}) => {
    return new Promise<void>((resolve, reject) => {
        const { userAgent, openId, environment, channel, kk_s_t } = store.state;

        // 设置header信息
        const header: { [key: string]: string } = {
            'Package-Id': 'com.kuaikan.main',
            'User-Agent-Mini': userAgent,
        };
        if (env) {
            if ((method || 'get').toUpperCase() !== 'POST' || json) {
                header['Content-Type'] = json
                    ? 'application/json'
                    : 'application/x-www-form-urlencoded';
            }
        } else {
            header['Content-Type'] = json
                ? 'application/json'
                : 'application/x-www-form-urlencoded';
        }

        if (openId) {
            let gsParams = data;
            if (!env && gsParams) {
                const reqParams: any = gsParams;
                Object.keys(gsParams).map((key) => {
                    if (typeof reqParams[key] == 'boolean') {
                        Object.assign(reqParams, {
                            [key]: reqParams[key] ? 1 : 0,
                        });
                    }
                });
                gsParams = reqParams;
            }
            const kkst = kk_s_t || '';
            header['Mini-Id'] = `${channel}:${openId}`;
            header['Mini-App-Info'] = gs(`${channel}:${openId}`, kkst, gsParams);
            cookie.set('kk_s_t', kkst, '', 24, '');
        }

        // 读取成功（已登录），则置入请求Cookie,否则（未登录），则在请求回调中，将header放入本地缓存
        const cacheHeader: Partial<{
            session: string;
            uid: string;
        }> = JSON.parse(localStorage.getItem('header') || '{}');
        if (cacheHeader.uid && cacheHeader.session) {
            if (env) {
                cookie.set('session', cacheHeader.session, '', 24 * 60 * 60, '');
                cookie.set('uid', cacheHeader.uid, '', 24 * 60 * 60, '');
            } else {
                header['Cookie'] = `session=${cacheHeader.session}; uid=${cacheHeader.uid};`;
            }
        }
        // 拼接请求url
        let requesturl = 'https://';
        host = host || 'api';
        const preiview: { [key: string]: string } = {
            api: 'api-preview',
            pay: 'pay',
            search: 'search-preview',
        };
        requesturl += {
            prod: `${host}.kkmh.com`,
            preview: `${preiview[host]}.kkmh.com`,
            stag: `${host}.quickcan.cn`,
            dev: `dev-${host}.quickcan.cn`,
        }[environment];
        requesturl += url[0] === '/' ? url : `/${url}`;

        const reqObj: {
            url: string;
            data?: object;
            method?: string;
            dataType?: string;
            header?: object;
            type?: string;
            headers?: object;
            withCredentials?: boolean;
            crossDomain?: boolean;
        } = {
            url: env ? (url[0] === '/' ? url : `/${url}`) : requesturl,
            data: data || {},
        };
        if (env) {
            // 待确定
            Object.assign(request.defaults, {
                withCredentials: true,
                headers: {
                    ...header,
                    'X-Device': openId,
                },
            });
            reqObj.type = (method || 'get').toUpperCase();
            request(reqObj).then(
                (res: any) => {
                    responseData({
                        res,
                        header: res.header || {},
                        cacheHeader,
                        url,
                        resolve,
                        reject,
                    });
                },
                (err: any) => {
                    reject(err);
                }
            );
        } else {
            reqObj.dataType = 'json';
            reqObj.header = header;
            reqObj.method = (method || 'get').toUpperCase();
            mt.request({
                ...reqObj,
                success: (res: any) => {
                    responseData({
                        res: res.data,
                        header: res.header,
                        cacheHeader,
                        url,
                        resolve,
                        reject,
                    });
                },
                fail: (err: any) => {
                    reject(err);
                },
            });
        }
    });
};

export { rqs };
