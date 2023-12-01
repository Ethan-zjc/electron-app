import { rqs } from './request';
import { utilShowToast } from './utils';
import { loginRemove } from '../hooks/useLogin';
import store from '../store';
import router from '../router';

/*
 * 通用关注方法
 * @params {Number|String} id    专题id，必填
 * @params {Object} _this  当前实例，必填
 * @params {notoast} Boolearn    是否不弹toast，非必填
 */
const utilHandleFollow = ({ id, notoast }: { id: number; notoast?: boolean }) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject();
            return false;
        }
        const { channel, follows } = store.state;
        const state = follows[id] || false;
        const isToast = !notoast;
        rqs({
            url: `/mini/v1/comic/${channel}/favourite/topic${state ? '/cancel' : ''}`,
            method: 'post',
            data: {
                topic_id: id,
            },
        }).then(() => {
            const newState = !state;
            follows[id] = newState;
            store.commit('setStore', {
                key: 'follows',
                value: follows,
            });

            if (isToast) {
                utilShowToast({
                    type: 'square',
                    // image: '/assets/images/toast-success.png',
                    title: newState ? '关注成功' : '取关成功',
                });
            }
            resolve(newState);
        });
    });
};

/*
 * 检测关注状态
 * @params {Array} list    专题id集合，必填
 * @params {Object} _this  当前实例，必填
 */
const utilCheckFollow = ({ list = [] }) => {
    return new Promise((resolve, reject) => {
        const topic_ids = list.filter((id) => !!id).join(',');
        if (!topic_ids) {
            reject();
            return;
        }
        const { channel, follows } = store.state;
        rqs({
            url: `/mini/v1/comic/${channel}/favourite/check_status`,
            data: { topic_ids },
        }).then((res: any) => {
            const newList = res.data.info_list;
            const followsMap: { [key: number]: boolean } = {};
            newList.forEach((item: { topic_id: number; favourite: boolean }) => {
                followsMap[item.topic_id] = item.favourite;
            });
            const newFollows = Object.assign({}, follows, followsMap);
            store.commit('setStore', {
                key: 'follows',
                value: newFollows,
            });
            resolve(newFollows);
        });
    });
};

/**
 * 通用内容点赞（详见target）
 * @param id {String} 这一条点赞对象的id
 * @param state {Boolean} 当前的状态，是否点赞（发起请求前）
 * @param target {Number} 点赞类型，默认漫画0，具体枚举如下：
 * 0: 漫画, 1: 动态, 2: 评论, 3: 漫评, 4: 专题, 5: 游戏, 7: 动漫, 8: 动漫剧集, 9: 社区帖子
 * @param list {Array} 仅id数组，举例：['123', '124', '125']
 */
const utilHandlePraise = ({
    id,
    state,
    target,
}: {
    id: string;
    state: boolean;
    target: number;
}) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject();
            return false;
        }
        const { channel } = store.state;
        rqs({
            method: 'post',
            url: `/v2/like/mini/${channel}/${state ? 'dislike' : 'add/safe'}`,
            data: {
                target_type: target || 0,
                target_id: id,
            },
        })
            .then((res: any) => {
                resolve({
                    count: res.data.like_count,
                    state: !state,
                });
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * 检测内容点赞状态（详见target）
 * @param target {Number} 点赞类型，默认漫画0，具体枚举如下：
 * 0: 漫画, 1: 动态, 2: 评论, 3: 漫评, 4: 专题, 5: 游戏, 7: 动漫, 8: 动漫剧集, 9: 社区帖子
 * @param list {Array} 仅id数组，举例：['123', '124', '125']
 */
const utilCheckPraise = ({ list, target }: { list: number[]; target: number }) => {
    return new Promise((resolve, reject) => {
        if (!list.length) {
            reject();
            return false;
        }
        const { channel } = store.state;
        // 默认target为0，如果其他类型点赞，需要传参覆盖
        const target_info = JSON.stringify(
            list.map((id) => {
                return {
                    target_id: id,
                    target_type: target || 0,
                };
            })
        );
        rqs({
            url: `/v2/like/mini/${channel}/get_infos`,
            data: { target_info },
        })
            .then((res: any) => {
                resolve(res.data.like_infos);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

const utilCheckWallet = async () => {
    if (!store.state.userId) {
        store.commit('setStore', { key: 'wallet', value: 0 });
        return Promise.resolve(0);
    }
    const res: any = await rqs({
        host: 'pay',
        url: '/v2/kb/mini/wallet',
        data: {
            from: store.state.payfrom,
        },
    });
    const data = res.data || {};
    const wallet = data?.wallet['nios_balance'];
    store.commit('setStore', { key: 'wallet', value: wallet });
    return Promise.resolve(data);
};

const utilGetPointCharge = ({ charge_time_idx = 1, comic_id = 0, topic_id = 0 } = {}) => {
    const url = '/v2/kb/point/charge',
        method = 'get',
        host = 'pay';
    const data: {
        comic_id?: number;
        topic_id?: number;
        charge_time_idx: number;
    } = {
        charge_time_idx,
    };
    if (comic_id) {
        data.comic_id = comic_id;
    }
    if (topic_id) {
        data.topic_id = topic_id;
    }
    const resData = {
        LastRechargeTime: -2, // 最后充值时间
        RechargeType: 0, // 累计充值次数
    };
    return new Promise((resolve) => {
        rqs({
            url,
            method,
            host,
            data,
        })
            .then((res: any) => {
                const data = res.data || {};
                const info = data.charge_values ? data.charge_values : {};
                const last_recharge_time = info.last_charge_time;
                const recharge_type = info.total_charge_cnt;
                resolve({
                    LastRechargeTime: last_recharge_time, // 最后充值时间
                    RechargeType: recharge_type, // 累计充值次数
                });
            })
            .catch(() => {
                resolve(resData);
            });
    });
};

const utilCheckVipInfo = async () => {
    const res: any = await rqs({
        host: 'pay',
        url: '/v1/vip/me',
    });
    const vip = res?.data?.vip || {};
    store.commit('setStore', { key: 'vipInfo', value: vip || {} });

    return Promise.resolve(vip);
};

// 退出登录
const utilLogout = (newlogout = false) => {
    rqs({
        url: '/v1/passport/mini/sign_out',
        method: 'get',
        data: {},
    });
    loginRemove();
    if (!newlogout) {
        router.push({ path: '/login' });
    }
};

// 打开次数
const utilOpenCount = () => {
    return new Promise((resolve) => {
        rqs({
            url: '/v2/passport/mini_open/record',
            method: 'post',
        }).then((res: any) => {
            const data = res.data || {};
            const { open_count } = data;
            resolve(open_count);
        });
    });
};

export {
    utilHandleFollow,
    utilCheckFollow,
    utilHandlePraise,
    utilCheckPraise,
    utilCheckWallet,
    utilGetPointCharge,
    utilCheckVipInfo,
    utilLogout,
    utilOpenCount,
};
