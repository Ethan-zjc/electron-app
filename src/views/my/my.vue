<template>
    <div class="my-container" ref="refContainer" @scroll.passive="onScroll">
        <div class="my-header" :style="`height:${topBarHei / 100}rem`"></div>
        <div class="my-top">
            <div class="user">
                <div class="user-left" v-if="!isLogin">
                    <img src="@/assets/img/avatar-default.png" />
                </div>
                <div class="user-left" v-longpress="{ cb: handleLongPressAvatar }" v-else>
                    <img :src="avatarUrl" />
                </div>
                <div class="user-right">
                    <div class="no-login" v-if="!isLogin" @click="handleLogin">点击登录</div>
                    <div class="login" v-else>
                        <p class="nickname">
                            <span class="text">{{ nickname }}</span>
                            <span class="vip" v-if="isVip">
                                <img :src="vipIcon" />
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="entry">
                <div class="entry-cell" @click="handleJump('wallet')">
                    <img
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/my-wallet_95ae90e.png"
                    />
                    <span>{{ wallet }}KK币</span>
                </div>
                <div class="entry-cell" @click="handleJump('vip')">
                    <img
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/my-vip_d19472e.png"
                    />
                    <span>会员中心</span>
                </div>
            </div>
        </div>
        <div class="control" :style="`top:${topBarHei / 100}rem`">
            <div class="control-tab">
                <div
                    class="control-tab-cell"
                    :class="{ active: item.type == controlActive }"
                    v-for="(item, index) in controlList"
                    :key="index"
                    @click="handleControl(item)"
                >
                    <span>{{ item.name }}</span>
                </div>
            </div>
            <div class="control-dev" v-if="develop">
                <span class="developers" @click="handleClickSwitch">开发者选项</span>
            </div>
            <div class="control-setting" @click="handleSetting">
                <span class="setting-icon">
                    <img
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/setting_d7cb90e.png"
                    />
                </span>
                <span class="setting-text">设置</span>
            </div>
        </div>
        <div class="list">
            <ComicItem
                :item="item"
                :type="controlActive"
                v-for="(item, index) in comicList"
                :key="item.id"
                v-longpress="{ cb: handleLongPressItem, duration: 800, options: { index } }"
            />
        </div>
        <Empty v-if="finished && comicList.length < 1" :type="controlActive" />
        <BottomLoading :finish="finished" :loading="loading" v-else />
        <TabBar :active="2" />
    </div>
    <ActionSheet
        v-model:show="isShowSheet"
        :actions="sheetList"
        cancel-text="取消"
        close-on-click-action
        @select="handleSheet"
    />
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ListType, ControlType } from './types';
import jointImageSuffix from '@kk/image-format';
import { getMyList, getVip, postHistoryDelete } from './api';
import store from '@/store';
import { throttle } from '@kk/utils';
import { utilAction, utilShowToast } from '@/helpers/utils';
import { utilCheckWallet } from '@/helpers/behaviors';
import { track } from '@/helpers/kksa';
import { ActionSheet } from 'vant';

// 自定义长按事件指令
const vLongpress = {
    beforeMount(el: HTMLElement, binding: any) {
        const params = binding.value;
        const cb = params.cb;
        const options = params.options || {};
        const duration = params.duration || 2000;
        if (typeof cb !== 'function') return;
        let timer: any = null;
        const cancel = () => {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
        };
        const start = (e: any) => {
            if (e instanceof MouseEvent && e.type === 'click' && e.button !== 0) {
                return;
            }
            if (timer === null) {
                timer = setTimeout(() => {
                    cb(options);
                    timer = null;
                }, duration);
            }
        };
        el.addEventListener('touchstart', start);
        el.addEventListener('mousedown', start);
        el.addEventListener('click', cancel);
        el.addEventListener('touchmove', cancel);
        el.addEventListener('touchend', cancel);
        el.addEventListener('touchcancel', cancel);
        el.addEventListener('mouseup', cancel);
    },
    unmounted(el: HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const fn = () => {};
        el.removeEventListener('mousedown', fn);
        el.removeEventListener('touchstart', fn);
        el.removeEventListener('click', fn);
        el.removeEventListener('mouseout', fn);
        el.removeEventListener('touchend', fn);
        el.removeEventListener('touchcancel', fn);
    },
};

const router = useRouter();
const TabBar = defineAsyncComponent(() => import('@/components/TabBar.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const ComicItem = defineAsyncComponent(() => import('./comps/ComicItem.vue'));
const Empty = defineAsyncComponent(() => import('./comps/ComicEmpty.vue'));

const CONTROL_LIST = [
    {
        name: '阅读历史',
        type: 'history',
    },
    {
        name: '我的关注',
        type: 'follow',
    },
];

const topBarHei = computed(() => {
    return store.state.topBarHei + store.state.topBarOffset;
});

const wallet = computed(() => {
    return store.state.wallet;
});

const controlActive = computed(() => {
    return store.state.myActive;
});

const develop = computed(() => {
    return !store.state.onRelease;
});

const isShowSheet = ref(false);
const sheetList = ref([{ name: '删除' }]);
const sheetActive = ref(0);

const avatarUrl = ref('');
const nickname = ref<string>('');
const isLogin = ref<boolean>(false);
const uid = ref<string>('');
const isVip = ref<boolean>(false);
const vipIcon = ref('');
const finished = ref<boolean>(false);
const loading = ref<boolean>(false);
const controlList = ref<Array<ControlType> | []>(CONTROL_LIST);
const pageSince = ref<number>(0);
const pageSize = ref<number>(12);

const refContainer = ref<any>(null);
const comicList = ref<Array<ListType> | []>([]);

// 格式化主接口数据
const formatListData = (value: any) => {
    const { topics: list = [], since } = value;
    const type = controlActive.value;
    const newList = list.map((item: any) => {
        if (type == 'history') {
            return {
                id: item.id,
                title: item.title || '',
                subtitle: `${item.read_count || 0}话/${item.comics_count || 0}话`,
                url: jointImageSuffix({ src: item.vertical_image_url, width: 350 }),
                labelImage: item.label_image || '',
                bottom: '',
                remindText: '',
                action: {
                    type: 3,
                    target_id: item.continue_read_comic.id,
                },
            };
        } else {
            return {
                id: item.topic_id,
                title: item.topic_title || '',
                subtitle: item.latest_comic_title || '',
                url: jointImageSuffix({ src: item.cover_image_url, width: 500 }),
                labelImage: item.label_image || '',
                bottom: item.unread_count ? `更新${item.unread_count || 0}话` : '暂无更新',
                remindText: item.remind_label || '',
                action: {
                    type: 68,
                    parent_target_id: item.topic_id,
                },
            };
        }
    });
    pageSince.value = since;
    comicList.value = [...comicList.value, ...newList];
    if (newList.length < 1 || since < 0) {
        finished.value = true;
    }
};

const getApiData = () => {
    if (!isLogin.value) {
        finished.value = true;
        return false;
    }
    if (loading.value) {
        return false;
    }
    loading.value = true;
    getMyList({
        type: controlActive.value,
        since: pageSince.value,
        size: pageSize.value,
        uid: uid.value,
    })
        .then((res: any) => {
            const { code, data = {} } = res;
            if (code == 200) {
                formatListData(data);
            } else {
                finished.value = true;
            }
        })
        .catch(() => {
            finished.value = true;
        })
        .finally(() => {
            loading.value = false;
        });
};

const setVipData = async () => {
    if (!isLogin.value) {
        return false;
    }
    try {
        const { data = {} } = await getVip();
        const vip = data.vip || {};
        isVip.value = !!vip.vip_type;
        vipIcon.value = vip.vip_big_icon || '';
    } catch (error) {
        isVip.value = false;
        vipIcon.value = '';
    }
};

const onReachBottom = () => {
    if (!loading.value && !finished.value) {
        getApiData();
    }
};

const refreshScroll = () => {
    const elem = refContainer.value;
    if (elem) {
        refContainer.value.scrollTo({
            top: 0,
            behavior: 'auto',
        });
    }
};

const refreshData = () => {
    const { userId, userInfo } = store.state;
    const userGroup = userInfo.user || {};
    uid.value = userId || '';
    nickname.value = userGroup.nickname;
    avatarUrl.value = userGroup.avatar_url;
    isLogin.value = !!uid.value;
    pageSince.value = 0;
    loading.value = false;
    finished.value = false;
    comicList.value = [];
    sheetActive.value = 0;
    setVipData();
    utilCheckWallet();
    getApiData();
};

const handleLogin = () => {
    router.push({ path: '/login' });
};
const handleSetting = () => {
    router.push({ path: '/setting' });
};
const handleJump = (value: string) => {
    const typeMap = {
        wallet: {
            type: 21,
            name: 'KK币',
        },
        vip: {
            type: 44,
            name: '会员中心',
        },
    };
    const item = (typeMap as any)[value] || {};
    const type = item.type || 0;
    utilAction({ type });
    track('PublicClk', {
        TriggerPage: 'BookshelfPage',
        ButtonName: item.name || '',
    });
};
const handleControl = (row: ControlType) => {
    if (loading.value) {
        return false;
    }
    refreshScroll();
    store.commit('setStore', {
        key: 'myActive',
        value: row.type,
    });
    refreshData();
};
const handleClickSwitch = () => {
    router.push({ path: '/login' });
};

const handleLongPressItem = (options: any) => {
    if (controlActive.value != 'history') {
        return false;
    }
    const { index } = options;
    isShowSheet.value = true;
    sheetActive.value = index;
};

const handleSheet = () => {
    const row = comicList.value[sheetActive.value] || {};
    const topicId = row.id || 0;
    postHistoryDelete(topicId)
        .then((res: any) => {
            const { code } = res;
            if (code == 200) {
                comicList.value.splice(sheetActive.value, 1);
            } else {
                utilShowToast({
                    title: '删除失败，请重试',
                });
            }
        })
        .catch(() => {
            utilShowToast({
                title: '删除失败，请重试',
            });
        });
};

const handleLongPressAvatar = () => {
    utilShowToast({
        title: `uid: ${store.state.userId}`,
    });
};

const onScroll = throttle(
    () => {
        const { clientHeight, scrollTop, scrollHeight } = refContainer.value || {};
        const diffBottom = scrollHeight - clientHeight - scrollTop;
        if (diffBottom < 100) {
            onReachBottom();
        }
    },
    200,
    true
);

onBeforeMount(() => {
    refreshData();
    track('VisitBookshelfPage');
});
</script>

<style lang="scss" scoped>
/* stylelint-disable */
@import '../../assets/sass/common';
.my-container {
    font-size: vws(24);
    overflow-y: scroll;
    height: 100vh;
}

.my-header {
    position: sticky;
    top: 0;
    left: 0;
    background: #ffe120;
    width: 100%;
    z-index: 999;
}

.my-top {
    position: relative;
    background: #ffe120;
    // height: vws(252);
    height: vws(276);
    padding: vws(24) vws(32) 0;
    box-sizing: border-box;
    border-bottom: vws(60) solid #fff;
}

.entry {
    height: vws(108);
    width: vws(686);
    box-sizing: border-box;
    margin: vws(24) auto 0;
    border-radius: vws(12);
    background: #fff;
    box-shadow: 0 0 vws(8) 0 rgba(123, 123, 123, 0.1);
    display: flex;
    justify-content: space-between;
    padding: 0 vws(120);
    box-sizing: border-box;
    &-cell {
        box-sizing: content-box;
        position: relative;
        display: flex;
        margin-top: vws(8);
        padding: vws(26) 0 vws(8);
        width: auto;
        height: vws(48);
        line-height: vws(48);
        justify-content: center;
        align-items: center;
        img {
            flex-shrink: 0;
            width: vws(48);
            height: vws(48);
            margin-right: vws(8);
        }
        span {
            white-space: nowrap;
            text-align: left;
            color: #333;
            font-size: vws(26);
            font-weight: bold;
        }
    }
}

.user {
    position: relative;
    display: flex;
    align-items: center;
    height: vws(114);
    &-left {
        width: vws(114);
        height: vws(114);
        flex-shrink: 0;
        img {
            box-sizing: border-box;
            border: vws(3) solid #fff;
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    &-right {
        flex: 1;
        margin-left: vws(24);
        display: flex;
        .no-login {
            font-size: vws(40);
            font-family: 'PingFang SC';
            font-weight: 500;
            color: #222;
            font-style: normal;
            line-height: vws(58);
        }
        .login {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .nickname {
            display: flex;
            align-items: center;
            font-size: vws(40);
            font-family: 'PingFang SC';
            font-weight: 500;
            color: #222;
            font-style: normal;
            line-height: vws(58);
            .text {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: vws(340);
            }
            .vip {
                width: auto;
                height: vws(36);
                margin-left: vws(16);
                img {
                    display: block;
                    height: 100%;
                }
            }
            .icon {
                display: block;
                margin-left: vws(20);
                width: vws(40);
                height: vws(40);
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
.control {
    position: sticky;
    top: 0;
    z-index: 10;
    padding-top: vws(16);
    height: vws(74);
    background-color: #fff;
    &-tab {
        display: flex;
        padding-left: vws(32);
        height: vws(64);
        &-cell {
            position: relative;
            display: flex;
            align-items: center;
            margin-right: vws(56);
            height: vws(64);
            span {
                font-size: vws(32);
                font-family: 'PingFang SC';
                color: #999;
                font-style: normal;
                line-height: vws(44);
                font-weight: bold;
            }
            &::after {
                position: absolute;
                bottom: 0;
                left: 50%;
                display: none;
                margin-left: vws(-20);
                width: vws(40);
                height: vws(6);
                border-radius: vws(4);
                content: '';
                background-color: #fde23d;
            }
        }
        .active {
            span {
                color: #000;
            }
            &::after {
                display: block;
            }
        }
    }
    &-dev {
        position: absolute;
        top: 50%;
        right: vws(150);
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        span {
            font-size: vws(28);
            color: #17b4ea;
        }
    }
    &-setting {
        position: absolute;
        top: 50%;
        right: vws(32);
        display: flex;
        align-items: center;
        transform: translateY(-50%);
        .setting-icon {
            width: vws(32);
            height: vws(32);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .setting-text {
            margin-left: vws(4);
            font-size: vws(26);
            font-family: 'PingFang SC';
            font-weight: 400;
            color: #999;
            font-style: normal;
            line-height: vws(24);
        }
    }
}
.list {
    position: relative;
    z-index: 5;
    display: flex;
    margin-top: vws(10);
    padding-left: vws(12);
    flex-wrap: wrap;
}
</style>
