<template>
    <div class="class-container" ref="refContainer" @scroll.passive="onScroll">
        <NavBar :title="pageTitle" />
        <div class="topic-list">
            <ComicItem v-for="item in topicList" :key="item" :item="item" />
        </div>
        <Empty v-if="finished && topicList.length < 1" />
        <BottomLoading :finish="finished" :loading="loading" v-else />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, nextTick, onActivated } from 'vue';
import { getModuleMore, getRecommendMore } from './api';
import jointImageSuffix from '@kk/image-format';
import { utilTransNum } from '@/helpers/utils';
import { throttle } from '@kk/utils';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useStore } from 'vuex';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const ComicItem = defineAsyncComponent(() => import('./comps/ComicItem.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const Empty = defineAsyncComponent(() => import('@/components/Empty.vue'));

const store = useStore();

const topicList = ref([]);
const loading = ref(false);
const finished = ref(false);
const refContainer = ref<any>(null);
const pageScrollTop = ref(0);
const pageLoad = ref(true);
const since = ref(0);
const limit = ref(10);

const pageTitle = ref('');
const pageType = ref('');
const subtitle = ref('');
const cardType = ref('');
const moduleId = ref(0);
const recommendBy = ref('');
const recommendType = ref('');

const getApiData = async () => {
    if (loading.value) {
        return false;
    }
    loading.value = true;
    let res = {};
    if (pageType.value == 'feed') {
        res = await getRecommendMore({
            recommend_by: recommendBy.value,
            recommend_type: recommendType.value,
            since: since.value,
            limit: limit.value,
        });
    } else {
        res = await getModuleMore({
            moduleId: moduleId.value,
            cardType: cardType.value,
            subtitle: subtitle.value,
            since: since.value,
            limit: limit.value,
        });
    }
    const data = (res as any).data || {};
    const { topics = [], since: nextSince = -1 } = data;
    const list = topics.map((item: any) => {
        const id = item.id;
        const fav_count = item.favourite_count || 0;
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
            category: item.category || [],
            publishTime: item.publish_time || '',
            favCount: utilTransNum(fav_count),
        };
    });
    topicList.value = topicList.value.concat(list);
    loading.value = false;
    since.value = nextSince;
    if (nextSince <= 0) {
        finished.value = true;
    }
};

const onReachBottom = () => {
    if (!loading.value && !finished.value) {
        getApiData();
    }
};

const refreshData = () => {
    const route = useRoute();
    const { query = {} } = route;
    const {
        type: PAGE_TYPE = 'find',
        moduleId: MODULE_ID = 0,
        cardType: CARD_TYPE = '',
        subtitle: SUBTITLE = '',
        title: TITLE = '',
        recommend_by: RECOMMEND_BY = '',
        recommend_type: RECOMMEND_TYPE = '',
    } = query;
    pageTitle.value = String(TITLE);
    pageType.value = String(PAGE_TYPE);
    subtitle.value = String(SUBTITLE);
    cardType.value = String(CARD_TYPE);
    moduleId.value = Number(MODULE_ID);
    recommendBy.value = String(RECOMMEND_BY);
    recommendType.value = String(RECOMMEND_TYPE);

    since.value = 0;
    loading.value = false;
    finished.value = false;
    topicList.value = [];
    getApiData();
};

onActivated(() => {
    const route = useRoute();
    const { query = {} } = route;
    const queryType = query.type || 'find';
    if (pageLoad.value || queryType != pageType.value) {
        refreshData();
    } else {
        nextTick(() => {
            refContainer.value.scrollTop = pageScrollTop.value;
        });
    }
});

onBeforeRouteLeave((to, from, next) => {
    pageLoad.value = to.name != 'comic';
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
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.class-container {
    overflow-y: scroll;
    height: 100vh;
    min-height: 100vh;
    background-color: #fff;
    .topic-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 vws(12);
    }
}
</style>
