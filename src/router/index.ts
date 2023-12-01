import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import store from '../store';
import useInit from '../hooks/useInit';
import { mtGetLaunchOptionsSync } from '@/helpers/trans';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'find',
        component: () => import('@/views/find/find.vue'),
        meta: {
            name: '发现页',
            keepAlive: true,
        },
    },
    {
        path: '/find',
        redirect: '/',
    },
    {
        path: '/:catchAll(.*)*',
        name: '404',
        component: () => import('@/views/error/error.vue'),
        meta: {
            name: '404页',
        },
    },
    {
        path: '/class',
        name: 'class',
        component: () => import('@/views/class/class.vue'),
        meta: {
            name: '分类页',
            keepAlive: true,
        },
    },
    {
        path: '/search',
        name: 'search',
        component: () => import('@/views/search/search.vue'),
        meta: {
            name: '搜索页',
            keepAlive: true,
        },
    },
    {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/my.vue'),
        meta: {
            name: '书架页',
        },
    },
    {
        path: '/rank',
        name: 'rank',
        component: () => import('@/views/rank/rank.vue'),
        meta: {
            name: '排行榜页',
            keepAlive: true,
        },
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting/setting.vue'),
        meta: {
            name: '设置页',
        },
    },
    {
        path: '/licence',
        name: 'licence',
        component: () => import('@/views/licence/licence.vue'),
        meta: {
            name: '许可证',
        },
    },
    {
        path: '/licence-detail',
        name: 'licence-detail',
        component: () => import('@/views/licence-detail/licence-detail.vue'),
        meta: {
            name: '许可证详情页',
        },
    },
    {
        path: '/protocol',
        name: 'protocol',
        component: () => import('@/views/protocol/protocol.vue'),
        meta: {
            name: '协议页',
        },
    },
    {
        path: '/topic-list',
        name: 'topic-list',
        component: () => import('@/views/topic-list/topic-list.vue'),
        meta: {
            name: '专题列表页',
            keepAlive: true,
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/login.vue'),
        meta: {
            name: '登录页',
        },
    },
    {
        path: '/topic',
        name: 'topic',
        component: () => import('@/views/topic/topic.vue'),
        meta: {
            name: '专题页',
        },
    },
    {
        path: '/comic',
        name: 'comic',
        component: () => import('@/views/comic/comic.vue'),
        meta: {
            name: '漫画详情页',
        },
    },
    {
        path: '/vip-center',
        name: 'vip-center',
        component: () => import('@/views/vip-center/vip-center.vue'),
        meta: {
            name: '会员中心页',
        },
    },
    {
        path: '/buykkb',
        name: 'buykkb',
        component: () => import('@/views/buykkb/buykkb.vue'),
        meta: {
            name: 'KK币充值',
        },
    },
    {
        path: '/wallet',
        name: 'wallet',
        component: () => import('@/views/wallet/wallet.vue'),
        meta: {
            name: '我的钱包',
        },
    },
    {
        path: '/bought',
        name: 'bought',
        component: () => import('@/views/bought/bought.vue'),
        meta: {
            name: '购买管理',
        },
    },
    {
        path: '/order',
        name: 'order',
        component: () => import('@/views/order/order.vue'),
        meta: {
            name: '我的订单',
        },
    },
    {
        path: '/vip-protocol',
        name: 'vip-protocol',
        component: () => import('@/views/vip-protocol/vip-protocol.vue'),
        meta: {
            name: '协议页',
        },
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const { userId, logoutFlag, isLaunch } = store.state;
    const action = async () => {
        if (isLaunch) {
            store.commit('setStore', {
                key: 'isLaunch',
                value: false,
            });
            const data: any = await mtGetLaunchOptionsSync();
            const query = data.query || {};
            if (query.path) {
                const options = { path: decodeURIComponent(query.path), query: {} };
                const optionsQuery: any = {
                    external: 1, // 投放直达标识
                };
                if (query.id) {
                    optionsQuery.id = query.id;
                }
                if (query.parentId) {
                    optionsQuery.parentId = query.parentId;
                }
                options.query = optionsQuery;
                next(options);
            } else {
                next();
            }
        } else {
            next();
        }
    };
    if (!userId && to.path !== '/login' && !logoutFlag) {
        await useInit();
        if (store.state.userId) {
            action();
        } else {
            next({ path: '/login' });
        }
    } else {
        action();
    }
});

export default router;
