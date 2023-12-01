<template>
    <div class="find-container" ref="refContainer">
        <PullRefresh v-model="loadingPull" @refresh="refreshData">
            <List
                v-model:loading="loading"
                :finished="finished"
                :immediate-check="false"
                :offset="50"
                @load="handleList"
            >
                <Sticky>
                    <Search />
                </Sticky>
                <div
                    v-for="(item, index) in comicList"
                    :key="item.uuid"
                    class="find-observer"
                    :data-index="index"
                >
                    <Banner
                        :params="item"
                        v-if="item.module_type == 1"
                        @onTrack="handleModuleTrack"
                    />
                    <Nav :params="item" v-if="item.module_type == 2" @onTrack="handleModuleTrack" />
                    <TopicSix :params="item" v-if="item.module_type == 4" />
                    <TopicGuess :params="item" v-if="item.module_type == 8" />
                    <TopicRank
                        :sort="index"
                        :params="item"
                        v-if="item.module_type == 5"
                        @onChange="handleModuleChange"
                    />
                    <TopicClass
                        :sort="index"
                        :params="item"
                        v-if="item.module_type == 9"
                        @onChange="handleModuleChange"
                    />
                </div>
                <BottomLoading :finish="finished" :loading="loading" />
                <template #loading></template>
                <template #finished></template>
                <template #error></template>
            </List>
        </PullRefresh>
        <TabBar :active="1" />
        <AgreementPopup />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onBeforeMount, nextTick, onActivated } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { List, PullRefresh, Sticky } from 'vant';
import { FindListType } from './types';
import { getDiscoveryList } from './api';
import { utilShowToast } from '@/helpers/utils';
import { track } from '@/helpers/kksa';
import { utilOpenCount } from '@/helpers/behaviors';
import observe from '@/helpers/observe';

const TabBar = defineAsyncComponent(() => import('@/components/TabBar.vue'));
const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));
const Search = defineAsyncComponent(() => import('@/components/Search.vue'));
const Banner = defineAsyncComponent(() => import('./comps/Banner.vue'));
const Nav = defineAsyncComponent(() => import('./comps/Nav.vue'));
const TopicSix = defineAsyncComponent(() => import('./comps/TopicSix.vue'));
const TopicGuess = defineAsyncComponent(() => import('./comps/TopicGuess.vue'));
const TopicRank = defineAsyncComponent(() => import('./comps/TopicRank.vue'));
const TopicClass = defineAsyncComponent(() => import('./comps/TopicClass.vue'));
const AgreementPopup = defineAsyncComponent(() => import('./comps/AgreementPopup.vue'));

const pageIndex = ref<number>(1);
const finished = ref<boolean>(false);
const loading = ref<boolean>(false);
const coldBoot = ref<number>(1);
const count = ref<number>(4);
const comicList = ref<Array<FindListType> | []>([]);
const obList = ref<Array<number>>([]);
const loadingPull = ref(false);
const pageScrollTop = ref(0);
const refContainer = ref<any>(null);
const rankIndex = ref(0);
const classIndex = ref(0);

const moduleTypeMap = {
    0: '',
    1: '头部轮播图',
    2: '二级入口',
    3: '四图类型',
    4: '六图类型',
    5: '排行榜模块',
    6: '',
    7: '单图模块',
    8: '追更模块',
    9: '分类模块',
    10: '四图异形模块',
    11: '标签模块',
    12: '新作预约横滑模块',
};
const observeData = (index: number) => {
    const row = comicList.value[index];
    if (!row) {
        return false;
    }
    const type = row.module_type || 1;
    if ([1, 2].includes(type)) {
        return false;
    }
    const moduleId = row.module_id || 0;
    let moduleName = row.title;
    if (type == 5) {
        const childRow = row.banner_list[rankIndex.value];
        moduleName = childRow.title;
    }
    if (type == 9) {
        const childRow = row.banner_list[classIndex.value];
        moduleName = childRow.title;
    }
    const options = {
        TabModulePos: index,
        TabModuleID: String(moduleId),
        TabModuleType: (moduleTypeMap as any)[type] || '',
        ModuleName: moduleName,
        IsManualRecTopic: false,
        ManualRecTopicName: '',
    };
    track('UserDefinedTabFindPageModuleExp', options);
};

const observeTrigger = () => {
    nextTick(() => {
        observe({
            el: '.find-observer',
            rootMargin: '0px 0px -200px 0px',
            callback: (data: any) => {
                const index = Number(data.index);
                if (index > -1 && !obList.value.includes(index)) {
                    obList.value.push(index);
                    observeData(index);
                }
            },
        });
    });
};

const formatListData = (list = []) => {
    const pageList: any = [];
    list.map((item: any) => {
        item.id = item.id || 0;
        item.module_type = item.module_type || 0;
        item.title = item.title || '';
        item.subtitle = item.subtitle || '';
        item.banner_list = item.banner_list || [];
        item.uuid = `${Date.now().toString(36)}_${item.module_type}_${Math.random().toString(36)}`;

        // 轮播图模块
        if (item.module_type == 1) {
            pageList.push(item);
        }

        // 入口模块
        if (item.module_type == 2) {
            item.banner_list = item.banner_list.slice(0, 2);
            pageList.push(item);
        }

        // 竖图6图模块
        if (item.module_type == 4) {
            item.banner_list = item.banner_list.slice(0, 6);
            pageList.push(item);
        }

        // 排行榜模块
        if (item.module_type == 5) {
            item.banner_list = item.banner_list.slice(0, 3);
            pageList.push(item);
        }

        // 猜你喜欢
        if (item.module_type == 8) {
            item.banner_list = item.banner_list.slice(0, 20);
            pageList.push(item);
        }

        // 分类模块
        if (item.module_type == 9) {
            pageList.push(item);
        }
    });
    comicList.value = comicList.value.concat(pageList);
    coldBoot.value = 0;
    loading.value = false;
    finished.value = false;
    loadingPull.value = false;
    observeTrigger();
};

const handleList = () => {
    getDiscoveryList({
        cold_boot: coldBoot.value,
        page: pageIndex.value,
        count: count.value,
    })
        .then((res: any) => {
            const { code, data } = res;
            const infos = (data.infos || []) as any;
            pageIndex.value = pageIndex.value + 1;
            if (infos.length <= 0 && pageIndex.value > 1) {
                loading.value = false;
                finished.value = true;
                loadingPull.value = false;
                return false;
            }
            if (code == 200) {
                formatListData(infos);
            }
        })
        .catch(() => {
            utilShowToast({
                title: '服务异常',
            });
        });
};

const refreshData = () => {
    pageIndex.value = 1;
    loading.value = true;
    finished.value = false;
    comicList.value = [];
    obList.value = [];
    rankIndex.value = 0;
    classIndex.value = 0;
    handleList();
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

const openTrack = async () => {
    const count = await utilOpenCount();
    track('OpenProgram', {
        OpenCount: count,
    });
};

const handleModuleChange = (value: any) => {
    const { type, detail = {} } = value;
    const { sort, index = 0 } = detail;
    if (type == 'rank') {
        rankIndex.value = index;
    } else if (type == 'class') {
        classIndex.value = index;
    }
    observeData(sort);
};

const handleModuleTrack = (value: any) => {
    const { eventType, moduleInfo, moreInfo = {} } = value;
    const eventMap = {
        click: 'CommonItemClk',
        imp: 'CommonItemImp',
    };
    const event = (eventMap as any)[eventType] || '';
    const moduleType = moduleInfo.module_type;
    const actionTypeMap = {
        2: '漫画专题',
        3: '漫画章节',
        9: '漫画分类页',
        18: 'hybrid跳转',
        19: 'hybrid跳转',
        44: '会员中心',
        66: 'native 专题排行榜',
        68: '漫画续读',
        2000: '小程序',
        2001: '小程序',
        2002: '小程序',
    };
    const action = moreInfo.action || {};
    const { type, target_id: id, target_web_url: url, parent_target_id: parentId } = action;

    // 点击内容类型
    const ClkItemType = (actionTypeMap as any)[type] || '';

    // 来源模块类型
    const TabModuleType = (moduleTypeMap as any)[moduleType] || '';

    let ContentID = '';
    let RelatedContentID = '';

    if ([2].includes(type)) {
        ContentID = String(id);
    }
    if ([68].includes(type)) {
        ContentID = String(parentId);
    }
    if ([18, 19, 2000, 2001, 2002, 2003, 2004].includes(type)) {
        ContentID = String(url);
    }
    if ([3].includes(type)) {
        RelatedContentID = String(id);
    }

    const options = {
        CurPage: 'FindPage',
        TabModuleType,
        ClkItemType,
        ContentID,
        RelatedContentID,
    };
    track(event, options);
};

onBeforeMount(() => {
    refreshData();
    openTrack();
    track('VisitFindPage');
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.find-container {
    overflow-y: scroll;
    height: 100vh;
}
</style>
