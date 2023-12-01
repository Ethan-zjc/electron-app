<template>
    <div class="class-container" ref="refContainer" @scroll.passive="onScroll">
        <NavBar title="分类" :isShowLeft="false" />
        <Nav
            :tagId="tagId"
            :tagList="tagList"
            :regionId="regionId"
            :regionList="regionList"
            :payId="payId"
            :payList="payList"
            :updateId="updateId"
            :updateList="updateList"
            :sortId="sortId"
            :sortList="sortList"
            :isMiniNav="isMiniNav"
            :isFixed="true"
            :top-offset="topBarHei"
            v-if="isShowNav"
            @onTap="handleNavTap"
            @onMiniTap="handleNavMini"
        />
        <Nav
            ref="refNav"
            :tagId="tagId"
            :tagList="tagList"
            :regionId="regionId"
            :regionList="regionList"
            :payId="payId"
            :payList="payList"
            :updateId="updateId"
            :updateList="updateList"
            :sortId="sortId"
            :sortList="sortList"
            :isMiniNav="false"
            @onTap="handleNavTap"
        />
        <ComicFilter :filterFav="filterFav" @onTap="handleFilterFav" />
        <div class="topic-list">
            <ComicItem
                v-for="item in topicList"
                :key="item"
                :item="item"
                :tagId="tagId"
                :sortId="sortId"
            />
        </div>
        <Empty v-if="finished && topicList.length < 1" />
        <BottomLoading :finish="finished" :loading="loading" v-else />
        <TabBar :active="0" />
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent, computed, nextTick, onActivated } from 'vue';
import { getMultiFilter } from './api';
import jointImageSuffix from '@kk/image-format';
import { utilTransNum } from '@/helpers/utils';
import { throttle } from '@kk/utils';
import { useStore } from 'vuex';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { track } from '@/helpers/kksa';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const TabBar = defineAsyncComponent(() => import('@/components/TabBar.vue'));
const Nav = defineAsyncComponent(() => import('./comps/Nav.vue'));
const ComicItem = defineAsyncComponent(() => import('./comps/ComicItem.vue'));
const ComicFilter = defineAsyncComponent(() => import('./comps/ComicFilter.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const Empty = defineAsyncComponent(() => import('@/components/Empty.vue'));

const REGION_LIST = [
    { label: '全部', value: 1 },
    { label: '国漫', value: 2 },
    { label: '韩漫', value: 3 },
    { label: '日漫', value: 4 },
];
const PAY_FILTER_LIST = [
    { label: '全部', value: 0 },
    { label: '免费', value: 1 },
    { label: '付费', value: 2 },
    { label: '抢先看', value: 3 },
];
const UPDATE_FILTER_LIST = [
    { label: '全部', value: 0 },
    { label: '连载中', value: 1 },
    { label: '已完结', value: 2 },
];
const SORT_FILTER_LIST = [
    { label: '推荐', value: 1 },
    { label: '最火热', value: 2 },
    { label: '新上架', value: 3 },
];

const store = useStore();
const route = useRoute();
const { query } = route;
const { id: TAG_ID = 0 } = query;

const topBarHei = computed(() => {
    return store.state.topBarHei + store.state.topBarOffset;
});
const tagId = ref(Number(TAG_ID));
const tagName = ref('');
const regionId = ref(1);
const payId = ref(0);
const updateId = ref(0);
const sortId = ref(1);

const tagList = ref([]);
const regionList = ref(REGION_LIST);
const payList = ref(PAY_FILTER_LIST);
const updateList = ref(UPDATE_FILTER_LIST);
const sortList = ref(SORT_FILTER_LIST);

const page = ref(1);
const size = ref(20);

const topicList = ref([]);
const filterFav = ref(false);
const loading = ref(false);
const finished = ref(false);
const isMiniNav = ref(true);
const isShowNav = ref(false);
const refContainer = ref<any>(null);
const refNav = ref<any>(null);
const isFirst = ref(true);
const pageScrollTop = ref(0);

const classTrackPv = () => {
    track('VisitSubFindCat', {
        CategoryPage: tagName.value,
    });
};

const getApiData = async () => {
    if (loading.value) {
        return false;
    }
    loading.value = true;
    const res = await getMultiFilter({
        page: page.value,
        size: size.value,
        tagId: tagId.value,
        region: regionId.value,
        payStatus: payId.value,
        updateStatus: updateId.value,
        sort: sortId.value,
        favFilter: filterFav.value ? 1 : 0,
    });
    const { topicCategories = [], topicMessageList = [] } = res.hits;
    const list = topicMessageList.map((item: any) => {
        return {
            id: item.id,
            title: item.title || '',
            subtitle: utilTransNum(item.favourite_count) + '人在追',
            url: jointImageSuffix({ src: item.vertical_image_url, width: 350 }),
            labelImage: '',
            bottom: `已更新${item.comics_count}话`,
            remindText: `${item.first_comic_publish_time}上架`,
            action: {
                type: !item.comics_count ? 2 : 68,
                target_id: item.id,
                parent_target_id: item.id,
            },
        };
    });
    topicList.value = topicList.value.concat(list);
    tagList.value = topicCategories;
    loading.value = false;
    if (list.length <= 0) {
        finished.value = true;
    }
    if (isFirst.value) {
        isFirst.value = false;
        const tagItem =
            topicCategories.find((i: { tagId: number }) => i.tagId === tagId.value) || {};
        tagName.value = tagItem.title || '';
        classTrackPv();
    }
};

const onReachBottom = () => {
    if (!loading.value && !finished.value) {
        page.value++;
        getApiData();
    }
};

const refreshData = () => {
    page.value = 1;
    loading.value = false;
    finished.value = false;
    topicList.value = [];
    getApiData();
};

const handleNavTap = (row: any) => {
    const { type, item } = row;
    if (type == 'tag') {
        tagId.value = item.tagId;
        tagName.value = item.title;
        classTrackPv();
    } else if (type == 'region') {
        regionId.value = item.value;
    } else if (type == 'pay') {
        payId.value = item.value;
    } else if (type == 'update') {
        updateId.value = item.value;
    } else if (type == 'sort') {
        sortId.value = item.value;
    }
    refreshData();
};

const handleNavMini = (detail: any) => {
    isMiniNav.value = detail.value;
};

const handleNavScroll = (scrollTop: number) => {
    const navHei = refNav.value.$el.clientHeight || 100;
    if (scrollTop >= navHei) {
        isShowNav.value = true;
        isMiniNav.value = true;
    } else {
        isShowNav.value = false;
    }
};

const handleFilterFav = () => {
    filterFav.value = !filterFav.value;
    refreshData();
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
        handleNavScroll(scrollTop);
    },
    200,
    true
);

onBeforeMount(() => {
    refreshData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.class-container {
    overflow-y: scroll;
    height: 100vh;
    min-height: 100vh;
    background-color: #fafbfc;
    .topic-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 vws(12);
    }
}
</style>
