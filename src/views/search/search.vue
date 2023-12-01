<template>
    <div class="search-container">
        <NavBar title="搜索页" :is-custom-back="true" @onBack="onCancel" />
        <div class="search-fixed" :style="`top:${topBarHei / 100}rem`">
            <div class="search-fixed-content">
                <Search
                    v-model="searchVal"
                    :placeholder="searchHolder"
                    @clear="onClear"
                    @update:model-value="onChange"
                    @search="onSearch"
                />
            </div>
            <div class="search-fixed-cancel" @click="onCancel">取消</div>
        </div>
        <div class="search-mask" v-if="isShowMask">
            <div :style="`width:100%;height:${topBarHei / 100}rem`"></div>
            <div class="search-mask-content">
                <div class="mask-button" @click="onSearch" v-if="searchVal">
                    <span class="text">搜索</span>
                    <span class="hot">"{{ searchVal }}"</span>
                </div>
                <div
                    class="mask-item"
                    v-for="(item, index) in sugList"
                    :key="index"
                    @click="handleSugTap(item)"
                >
                    {{ item.title }}
                </div>
            </div>
        </div>
        <div class="search-list" ref="refContainer" @scroll.passive="onScroll" v-if="isShowList">
            <div :style="`width:100%;height:${topBarHei / 100}rem`"></div>
            <ComicItem v-for="item in topicList" :key="item" :item="item" />
            <Empty v-if="finished && topicList.length < 1" style="margin-top: 100px" />
            <BottomLoading :finish="finished" :loading="loading" v-else />
        </div>
        <div class="search-content">
            <SearchHistory ref="refHistory" @on-search="handleHisSearch" />
            <SearchHot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent, computed, nextTick, onActivated } from 'vue';
import { Search } from 'vant';
import { throttle } from '@kk/utils';
import jointImageSuffix from '@kk/image-format';
import { utilTransNum, utilAction } from '@/helpers/utils';
import { getSearchTopic, getSearchSug } from './api';
import { SearchSugType } from './types';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useStore } from 'vuex';
import { track } from '@/helpers/kksa';

const router = useRouter();
const store = useStore();

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const ComicItem = defineAsyncComponent(() => import('./comps/ComicItem.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const Empty = defineAsyncComponent(() => import('@/components/Empty.vue'));
const SearchHistory = defineAsyncComponent(() => import('./comps/SearchHistory.vue'));
const SearchHot = defineAsyncComponent(() => import('./comps/SearchHot.vue'));

const topBarHei = computed(() => {
    return store.state.topBarHei + store.state.topBarOffset;
});

const searchHolder = ref('');
const searchVal = ref('');
const isShowMask = ref(false);
const isShowList = ref(false);
const isStopChange = ref(false);
const topicList = ref([]);
const loading = ref(true);
const finished = ref(false);
const refContainer = ref<any>(null);

const pageScrollTop = ref(0);
const sugList = ref<Array<SearchSugType>>([]);
const refHistory = ref<any>(null);
const page = ref(1);
const size = ref(10);

const searchTrack = (type: string, params?: any) => {
    const eventMap = {
        exp: 'SearchPageExp',
        search: 'Search',
    };
    const event = (eventMap as any)[type];
    const options: any = {};

    if (type != 'exp') {
        options.SearchKeyword = searchVal.value;
    }
    if (params) {
        Object.assign(options, params);
    }
    if (event) {
        track(event, options);
    }
};

const getApiData = async () => {
    if (loading.value) {
        return false;
    }
    loading.value = true;
    const res = await getSearchTopic({
        q: searchVal.value,
        page: page.value,
        size: size.value,
    });
    const { hits: topics = [], total = 0 } = res;
    const list = topics.map((item: any) => {
        const id = item.id;
        const fav_count = item.favourite_count || 0;
        const category = item.category || [];
        store.commit('setFollows', {
            key: id,
            value: item.is_favourite,
        });
        return {
            id,
            title: item.title || '',
            subtitle: item.recommend_text || item.subtitle || item.description || '',
            url: jointImageSuffix({ src: item.vertical_image_url, width: 350 }),
            action: {
                type: 68,
                parent_target_id: item.id,
            },
            category: category.slice(0, 5),
            author: item.author_name || '',
            favCount: utilTransNum(fav_count),
            praise: utilTransNum(item.likes_count),
            comment: utilTransNum(item.comments_count),
        };
    });
    topicList.value = topicList.value.concat(list);
    loading.value = false;
    finished.value = list.length == 0 || page.value >= Math.ceil(total / size.value);
};

const getSugData = async () => {
    const res = await getSearchSug({
        q: searchVal.value,
    });
    const { hits = [] } = res;
    sugList.value = hits;
};

const handleSugTap = (item: SearchSugType) => {
    const { topic_id, title } = item;
    refHistory.value.triggerAdd(title);
    utilAction({
        type: 2,
        id: topic_id,
    });
    searchTrack('search', {
        SearchSrc: 4,
        SearchKeyword: title,
    });
};

const refreshData = () => {
    page.value = 1;
    loading.value = false;
    finished.value = false;
    topicList.value = [];
    getApiData();
};

const onSearchRequest = () => {
    if (!searchVal.value) {
        return false;
    }
    isShowMask.value = false;
    isShowList.value = true;
    refHistory.value.triggerAdd(searchVal.value);
    refreshData();
};

const onSearch = () => {
    if (!searchVal.value) {
        searchVal.value = searchHolder.value;
    }
    onSearchRequest();
    searchTrack('search', {
        SearchSrc: 3,
    });
};

const onChange = () => {
    if (isStopChange.value) {
        return false;
    }
    isShowMask.value = true;
    getSugData();
};

const onClear = () => {
    isShowMask.value = false;
    isShowList.value = false;
};

const onCancel = () => {
    isShowMask.value = false;
    isShowList.value = false;
    searchVal.value = '';
    router.push({ path: '/find' });
};

const onReachBottom = () => {
    if (!loading.value && !finished.value) {
        page.value += 1;
        getApiData();
    }
};

const handleHisSearch = (options: any) => {
    const { value } = options;
    isStopChange.value = true;
    searchVal.value = value;
    onSearchRequest();
    searchTrack('search', {
        SearchSrc: 2,
    });
    const timer = setTimeout(() => {
        clearTimeout(timer);
        isStopChange.value = false;
    }, 300);
};

onActivated(() => {
    const { query } = useRoute();
    const { holder = '' } = query;
    searchHolder.value = String(holder);
    nextTick(() => {
        if (refContainer.value) {
            refContainer.value.scrollTop = pageScrollTop.value;
        }
    });
});

onBeforeRouteLeave((to, from, next) => {
    const { scrollTop = 0 } = refContainer.value || {};
    pageScrollTop.value = scrollTop;
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
    searchTrack('exp');
});
</script>

<style lang="scss">
@import '../../assets/sass/common';

.search-container {
    position: relative;
    height: 100vh;
    min-height: 100vh;
    .search-fixed {
        // position: fixed;
        position: sticky;
        top: 0;
        left: 0;
        z-index: 8;
        display: flex;
        padding: vws(32) 0;
        width: 100%;
        height: vws(64);
        background-color: #fff;
        &-content {
            padding: 0 0 0 vws(24);
            flex: 1;
        }
        &-cancel {
            margin: 0 vws(24);
            padding: 0;
            width: vws(72);
            height: vws(64);
            font-size: vws(30);
            text-align: right;
            color: #333;
            line-height: vws(64);
        }
        .van-search {
            padding: 0;
            background: none;
            .van-search__content {
                border-radius: vws(64);
                background: #f5f5f5;
                .van-search__field {
                    height: vws(64);
                }
            }
        }
    }
    .search-mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 6;
        overflow-y: scroll;
        padding-top: vws(128);
        box-sizing: border-box;
        width: 100%;
        height: 100vh;
        background-color: #fff;
        &-content {
            padding: 0 vws(40);
        }
        .mask-button {
            display: flex;
            align-items: center;
            padding: vws(10) 0;
            height: vws(40);
            font-size: vws(24);
            color: #4a90e2;
        }
        .mask-item {
            overflow: hidden;
            height: vws(80);
            font-size: vws(28);
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            line-height: vws(80);
        }
    }
    .search-list {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 5;
        overflow-y: scroll;
        padding-top: vws(128);
        box-sizing: border-box;
        width: 100%;
        height: 100vh;
        background-color: #fff;
    }
    .search-content {
        padding-top: vws(24);
    }
}
</style>
