<template>
    <div class="rank-container" ref="refContainer" @scroll.passive="onScroll">
        <NavBar title="排行榜" />
        <div class="rank-top">
            <img class="top-bg" :src="rankActive.url" />
            <div class="top-centered">
                <div class="content">
                    <img
                        class="img"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-icon_799cea7.png"
                    />
                    <span class="title">{{ rankActive.title }}</span>
                    <span class="update-time">{{ rankActive.update }}</span>
                </div>
            </div>
        </div>
        <div class="rank-content">
            <div class="rank-nav">
                <Sticky :offset-top="`${topBarHei / 100}rem`">
                    <div class="nav-wrap">
                        <div class="nav-scroll" :style="`height:${navHei}px`">
                            <div class="nav-cell" v-for="item in rankList" :key="item.id">
                                <div
                                    class="nav-item"
                                    :class="rankActive.id == item.id ? 'active' : ''"
                                    :style="`background-color:${
                                        rankActive.id == item.id ? item.color : '#fff'
                                    }`"
                                    @click="handleNav(item)"
                                >
                                    {{ item.title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </Sticky>
            </div>
            <div class="rank-right">
                <div class="rank-list">
                    <ComicItem
                        v-for="(item, index) in topicList"
                        :key="item"
                        :item="item"
                        :sort="index + 1"
                    />
                </div>
                <Empty v-if="finished && topicList.length < 1" style="margin-top: 50px" />
                <BottomLoading :finish="finished" :loading="loading" v-else />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    onBeforeMount,
    defineAsyncComponent,
    computed,
    nextTick,
    onActivated,
} from 'vue';
import { getRankList } from './api';
import jointImageSuffix from '@kk/image-format';
import { throttle } from '@kk/utils';
import { Sticky } from 'vant';
import { RankNavType } from './types';
import { useStore } from 'vuex';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { track } from '@/helpers/kksa';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const ComicItem = defineAsyncComponent(() => import('./comps/ComicItem.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const Empty = defineAsyncComponent(() => import('@/components/Empty.vue'));

const store = useStore();
const route = useRoute();
const { query } = route;
const { id: RANK_ID = 0 } = query;

const rankList = ref<Array<RankNavType> | []>([]);
const since = ref(0);
const limit = ref(20);
const needRanks = ref(true);
const rankId = ref(Number(RANK_ID));
const rankActive = reactive({
    id: 0,
    title: '',
    url: '',
    update: '',
    color: '',
});

const topicList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refContainer = ref<any>(null);
const navHei = ref<number>(300);
const pageScrollTop = ref(0);

const topBarHei = computed(() => {
    return store.state.topBarHei + store.state.topBarOffset;
});

const rankTrackPv = () => {
    track('RankingPagePV', {
        ContentName: rankActive.title,
    });
};

const getApiData = async () => {
    if (loading.value) {
        return false;
    }
    loading.value = true;
    const { data } = await getRankList({
        need_ranks: needRanks.value,
        since: since.value,
        limit: limit.value,
        rank_id: rankId.value,
    });
    const { ranks = [], topics = [], since: nextSince = -1, default_rank: defRank = 0 } = data;
    const list = topics.map((item: any) => {
        const category = item.category || [];
        return {
            id: item.id,
            title: item.title || '',
            subtitle: item.description || '',
            url: jointImageSuffix({ src: item.image_url, width: 350 }),
            bottom: item.right_bottom,
            labels: category.slice(0, 3),
            rankIcon: item.rank_icon,
            rankText: item.rank_message,
            action: {
                type: 68,
                parent_target_id: item.id,
            },
        };
    });
    topicList.value = topicList.value.concat(list);
    loading.value = false;
    since.value = nextSince;
    if (nextSince <= 0 || list.length <= 0) {
        finished.value = true;
    }
    if (needRanks.value) {
        needRanks.value = false;
        rankList.value = ranks.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                url: item.image_url,
                color: item.main_color,
                update: item.next_update_date,
            };
        });
        const rankIdArr = rankList.value.filter((item) => item.id == rankId.value);
        const defaultRankArr = rankList.value.filter((item) => item.id == defRank);
        let ranksData = {};
        if (rankIdArr.length > 0) {
            ranksData = rankIdArr[0] ? rankIdArr[0] : {};
        } else {
            ranksData = defaultRankArr[0] ? defaultRankArr[0] : {};
        }
        Object.assign(rankActive, ranksData);
        rankTrackPv();
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
    since.value = 0;
    loading.value = false;
    finished.value = false;
    topicList.value = [];
    getApiData();
};

const handleNav = (item: RankNavType) => {
    rankId.value = item.id;
    Object.assign(rankActive, item);
    rankTrackPv();
    refreshScroll();
    refreshData();
};

const setNavHei = () => {
    const size = 750 / window.innerWidth;
    const hei = window.innerHeight - 490 / size;
    navHei.value = parseInt(hei as any);
};

onActivated(() => {
    nextTick(() => {
        refContainer.value.scrollTop = pageScrollTop.value;
    });
});

onBeforeRouteLeave((to, from, next) => {
    pageScrollTop.value = refContainer.value.scrollTop;
    next();
});

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
    setNavHei();
    refreshData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.rank-container {
    overflow-y: scroll;
    height: 100vh;
    min-height: 100vh;
    background-color: #fff;
    .rank-top {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: vws(334);
        .top-bg {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .top-centered {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: flex;
            //align-items: center;
            justify-content: center;
            overflow: hidden;
            width: 100%;
            height: 100%;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(56, 56, 69, 1) 100%);
            .content {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: vws(54) 0;
                flex-direction: column;
                .img {
                    width: vws(160);
                    height: vws(160);
                    object-fit: cover;
                }
                .title {
                    margin-top: vws(-22);
                    font-size: vws(44);
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                }
                .update-time {
                    height: vws(24);
                    font-size: vws(14);
                    font-size: vws(20);
                    color: rgba(255, 255, 255, 1);
                }
            }
        }
    }
    .rank-content {
        display: flex;
        overflow: hidden;
    }
    .rank-nav {
        width: vws(176);
        background: #fff;
        flex-shrink: 0;
        .nav-wrap {
            overflow: hidden;
            width: vws(176);
        }
        .nav-scroll {
            overflow-y: scroll;
            padding: vws(32) 0;
            width: vws(200);
            height: 100vh;
            box-sizing: border-box;
        }
        .nav-cell {
            margin-bottom: vws(42);
            padding: vws(16) 0;
        }
        .nav-item {
            overflow: hidden;
            padding: vws(11) 0 vws(11) vws(32);
            width: vws(144);
            font-size: vws(26);
            font-family: PingFangSC-Medium, ' PingFang S';
            font-weight: 400;
            border-radius: 0 vws(100) vws(100) 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
            box-sizing: border-box;
            word-break: break-all;
        }
        .active {
            color: #fff;
        }
    }
    .rank-right {
        width: vws(574);
    }
    .rank-list {
        display: flex;
        min-width: 0;
        flex-wrap: wrap;
    }
}
</style>
