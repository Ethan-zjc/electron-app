<!-- eslint-disable sonarjs/cognitive-complexity -->
<!-- eslint-disable sonarjs/cognitive-complexity -->
<template>
    <div class="catalog">
        <div class="bg" @touchmove.prevent @click="eventTap()"></div>
        <div :class="{ warp: true, pd: props.page === 'comic' }">
            <div class="top-txt">
                <div class="body-title">
                    <div class="left">
                        <div id="tabRef" class="tabs">
                            <div
                                :class="{ single: true, [item.key]: true }"
                                v-for="item in tabs"
                                :key="item"
                                @click="toggleTab(item.seasonIndex)"
                            >
                                <div class="name">
                                    <span
                                        :class="{
                                            txt: true,
                                            'active-txt': activeId == item.seasonIndex,
                                        }"
                                    >
                                        {{ item.title }}
                                    </span>
                                </div>
                                <div
                                    :class="{
                                        'active-sign':
                                            tabs.length > 1 && activeId == item.seasonIndex,
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div class="shadow" v-if="tabs.length >= 5"></div>
                    <div class="sort">
                        <div class="sort-btn" @click="sortFunc(sort == 'asc' ? 'desc' : 'asc')">
                            <img
                                class="sort-img"
                                :src="`https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/mulu-${
                                    sort == 'asc' ? 'asc_402e9a5' : 'desc_f852926'
                                }.png`"
                            />
                            <span class="txt">{{ sort == 'asc' ? '正序' : '倒序' }}</span>
                        </div>
                    </div>
                </div>
                <div class="sub-title">
                    <span v-if="listAry.length" class="txt">{{ updateRemind }}</span>
                </div>
            </div>

            <!-- list -->
            <div class="scroll-wrap" @touchmove="(e) => e.stopPropagation()" @scroll="onScroll">
                <div type="bottom" v-if="upperLoading">
                    <BottomLoading :loading="upperLoading" />
                </div>
                <div
                    :class="{ comic: true, [item.key]: true }"
                    v-for="item in listAry"
                    :key="item.id"
                    @click="actionTap(item.id)"
                >
                    <div class="pic">
                        <img class="topic-cover" :src="item.imgUrl" />
                        <div
                            v-if="item.forbidden"
                            :class="{ forbidden: true, [item.forbiddenType]: true }"
                        >
                            <img class="img" :src="comDireImgs[item.forbiddenType]" />
                        </div>
                    </div>
                    <div class="txt">
                        <div class="descLine">
                            <span v-if="item.label" class="label" :style="item.label.style">
                                {{ item.label.text }}
                            </span>
                            <span :class="{ title: true, readed: item.readed }">
                                {{ item.tit }}
                            </span>
                        </div>
                        <div class="infos">
                            <span class="time">{{ item.time }}</span>
                        </div>
                    </div>
                    <div class="clock" v-if="item.clock">
                        <img class="img" :src="comDireImgs['topic-clock']" />
                    </div>
                </div>

                <!-- 当数据是空时展示 -->
                <div class="no-data" v-if="isEmpty">
                    <img
                        class="cover"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/video/popup-empty_df8cc7d.png"
                    />
                    <div class="tips"><span>呜呜，再怎么找也找不到啦...T_T</span></div>
                </div>
                <div type="bottom" v-if="lowerLoading">
                    <BottomLoading :loading="lowerLoading" :finish="finished" />
                </div>
            </div>

            <!-- 新增顶部/当前前 -->
            <div
                v-if="listAry.length"
                class="suspend"
                :style="`top: ${comicCount <= 15 ? '300' : '245'}px`"
            >
                <div v-if="comicCount > 15" @click="changeStatus('top')">
                    <img
                        class="img-local"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/location-top_3e65ce6.png"
                    />
                </div>
                <div @click="changeStatus('cur')">
                    <img
                        class="img-local"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/location-cur_ca06358.png"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useStore } from 'vuex';
import { ref, defineAsyncComponent, onMounted, nextTick } from 'vue';
// import { Tab, Tabs } from 'vant';
import { comDireImgs } from '@/assets/js/cdn';
import { ComicItemInter } from '@/typings/index';
import { utilFormatTime, utilAction } from '@/helpers/utils';
import { getTopicCatalogListApi, getTopicReadRecordApi } from '@/api/topic.api';
import { track } from '@/helpers/kksa';

const BottomLoading = defineAsyncComponent(() => import('@/components/BottomLoading.vue'));

const store = useStore();
const props = defineProps<{
    topicId: number;
    comicId?: number;
    page?: string;
    isBonusChapter?: false;
}>();
const emit = defineEmits(['handleCloseCatalog']);

const { userId } = store.state;
const sort = ref('asc');
const updateRemind = ref('');
const comicCount = ref(0);
const isEmpty = ref(false);
const upperLoading = ref(false);
const lowerLoading = ref(false);
const loading = ref(false);
const finished = ref(false);
const listAry = ref<Array<any>>([]);
const historyList = ref<Array<any>>([]);
const activeId = ref(-1);
const tabs = ref<Array<any>>([]);
const continueId = ref(-1);
const pageSize = 20;
const quarterCount: any = {};
let bonusList: any = [],
    bsort = true, // 彩蛋正倒序
    tsort = true; // 正文正倒序
let basePage = 0;
let upperPage = 0,
    lowerPage = 0,
    totalPage = 0,
    initMore = true,
    lowerMore = true,
    upperMore = true,
    trailerSubTitle = '';

interface ComicFetchParams {
    action: number;
    page_size: number;
    sort: string;
    comic_id?: number;
    topic_id: number;
    season_index?: number;
}
// 目录点击埋点
const direClickReport = (name: string) => {
    const data = {
        CurPage: props.page == 'comic' ? '漫画详情页' : '漫画专题页',
        popupName: '目录页半屏弹窗',
        ButtonName: name,
    };
    track('ClickButton', data);
};
const fetchData = async (params: ComicFetchParams) => {
    try {
        loading.value = true;
        isEmpty.value = false;
        if (params.action == 2) {
            upperLoading.value = true;
        } else {
            lowerLoading.value = true;
        }
        const { data = {} } = await getTopicCatalogListApi(params);
        const {
            total_page,
            current_page,
            topic_basic_info,
            comic_list: comicList = [],
            trailer_comic_list = [],
            season_info = [],
        } = data;

        loading.value = false;
        updateRemind.value = topic_basic_info.catalog_update_remind;
        comicCount.value = topic_basic_info.comic_count;
        trailerSubTitle = topic_basic_info.trailer_sub_title || '';

        return {
            total_page,
            current_page,
            comicList,
            trailer_comic_list,
            season_info,
            trailer_sub_title: trailerSubTitle,
        };
    } catch (err) {
        loading.value = false;
        return {
            total_page: 0,
            current_page: 0,
            comicList: [],
            trailer_comic_list: [],
            season_info: [],
            trailer_sub_title: '',
        };
    }
};
const formatData = (
    data: (ComicItemInter & { created_at: Date; label_info: any })[],
    isBonus?: boolean
) => {
    return data.map((item, index) => ({
        key: `pic_${item.id}_${index}`,
        id: item.id,
        tit: item.title,
        imgUrl: item.cover_image_url,
        clock: isBonus ? false : item.id == continueId.value,
        time:
            parseInt(utilFormatTime(item.created_at, 'yyyy')) <
            parseInt(utilFormatTime(new Date(), 'yyyy'))
                ? utilFormatTime(item.created_at, 'yyyy-MM-dd')
                : utilFormatTime(item.created_at, 'MM-dd'),
        forbidden: !item.is_free || item.vip_exclusive,
        forbiddenType: item.can_view ? 'unlock' : 'locked',
        readed: historyList.value.map((item) => item.id).indexOf(item.id) != -1,
        label: item.label_info
            ? {
                  ...item.label_info,
                  style: `background: -webkit-linear-gradient(left, ${item.label_info.background_color}, ${item.label_info.background_gradual_color}); color: ${item.label_info.text_color};`,
              }
            : '',
    }));
};
const scrollToClockItem = () => {
    const clockItem = listAry.value.filter((item) => item.clock);
    if (clockItem.length) {
        const targetElement = document.querySelector(`.${clockItem[0].key}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'instant' });
        }
    }
};
const noMoreData = (comicList: ComicItemInter[], action: number) => {
    if (comicList.length < pageSize) {
        const actions: { [key: number]: string } = {
            1: 'initMore',
            2: 'upperMore',
            3: 'lowerMore',
            4: 'initMore',
        };
        const obj = actions[action];
        switch (obj) {
            case 'initMore':
                initMore = false;
                break;
            case 'upperMore':
                upperMore = false;
                break;
            case 'lowerMore':
                lowerMore = false;
                break;
        }
    }
};

// 处理tabs排序和定位
const tabsSort = ({ oTabs, location, onFirst }: any = {}) => {
    // 查看是否存在分季
    let newTabs = oTabs.map((item: any) => ({
        seasonIndex: item.season_index,
        title: item.title,
        focus: item.focus,
        key: `tab${item.season_index}`,
    }));

    if (newTabs.length) {
        // 查询当前正序，倒序，用哪个排序值，先用正文
        if (!tsort) {
            newTabs = [...newTabs].reverse();
        }
    } else {
        newTabs.push({
            seasonIndex: -1,
            title: '漫画选集',
            focus: true,
            key: 'tab-1',
        });
    }
    if (bonusList.length) {
        newTabs.push({
            seasonIndex: -2,
            title: '彩蛋',
            focus: false,
            key: 'tab-2',
        });
    }

    // 初始化，章节是彩蛋，且是漫画详情页打开目录，此时服务端下发焦点在季度上面，需要定位到彩蛋tab上面
    if (onFirst && props.isBonusChapter) {
        newTabs.forEach((item: any) => {
            item.focus = item.seasonIndex == -2;
        });
    }
    const focusIndex = newTabs.findIndex((item: any) => item.focus);
    tabs.value = newTabs;
    activeId.value = newTabs[focusIndex > -1 ? focusIndex : 0].seasonIndex;

    // tabs定位
    if (location != 'click') {
        nextTick(() => {
            const container: HTMLElement | null = document.getElementById('tabRef');
            const targetElement: HTMLElement | null = document.querySelector(
                `.${tabs.value.filter((item: any) => item.seasonIndex == activeId.value)[0].key}`
            );
            const scrollLeft = targetElement?.offsetLeft || 0;
            if (container) {
                container.scrollTo({
                    left: scrollLeft,
                    behavior: 'instant',
                });
            }
        });
    }
};

const getList = async ({
    action = 1,
    baseId = 0,
    sign = false,
    onFirst = false,
    location = '',
}: {
    action: number;
    baseId?: number;
    sign?: boolean;
    onFirst?: boolean;
    location?: string;
    // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
    try {
        let baseComicId = 0;
        if (onFirst) {
            // 漫画页拉起是当前章节id，专题页拉起是续读id或0
            baseComicId = props.comicId || 0;
        } else {
            if (action == 1) {
                if (sign) {
                    // 排序
                    baseComicId = 0;
                } else {
                    // 当前
                    baseComicId = continueId.value || 0;
                }
            } else if (action == 2 || action == 3) {
                // 翻页
                baseComicId = baseId || 0;
            } else {
                // tab点击
                baseComicId = 0;
            }
        }

        const params: ComicFetchParams = {
            action,
            page_size: pageSize,
            sort: sort.value,
            comic_id: baseComicId, // sign ? 0 : action == 1 ? props.comicId : baseId,
            topic_id: props.topicId,
        };
        if (activeId.value && activeId.value != -1 && activeId.value != -2) {
            params.season_index = Number(activeId.value);
        }
        const {
            total_page,
            current_page,
            comicList = [],
            trailer_comic_list = [],
            season_info = [],
            trailer_sub_title = '',
        } = await fetchData(params);

        if (onFirst && trailer_comic_list.length) {
            bonusList = formatData(trailer_comic_list, true);
        }

        // 处理tab展示
        tabsSort({ oTabs: season_info, location, onFirst });

        // 存储当前季度章节数量
        tabs.value.forEach((item) => {
            if (item.seasonIndex == -1 || item.seasonIndex == -2) {
                quarterCount[item.seasonIndex] =
                    item.seasonIndex == -2 ? trailer_comic_list.length : comicCount;
            } else {
                quarterCount[item.seasonIndex] =
                    season_info.filter((item1: any) => item1.season_index == item.seasonIndex)[0]
                        .comic_count || 0;
            }
        });

        // 处理彩蛋章节详情页拉起目录定位
        if (onFirst && props.isBonusChapter) {
            lowerLoading.value = false;
            activeId.value = -2;
            sort.value = bsort ? 'asc' : 'desc';
            if (bsort) {
                listAry.value = [...bonusList];
            } else {
                listAry.value = [...bonusList.reverse()];
            }
            initMore = true;
            lowerMore = false;
            upperMore = false;
            updateRemind.value = trailer_sub_title;
            comicCount.value = quarterCount[-2];

            // 定位滚动到彩蛋章节
            const oriIndex = bonusList.findIndex((item: any) => item.key == props.comicId);
            nextTick(() => {
                const targetElement = document.querySelector(
                    `.${bonusList[oriIndex > -1 ? oriIndex : 0].key}`
                );
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'instant' });
                }
            });
            return;
        }

        // 记录初始化值
        if ((!totalPage || action == 1) && total_page > 0) {
            totalPage = total_page;
            basePage = upperPage = lowerPage = current_page;
        }

        if (action == 1) {
            if (!basePage) {
                upperMore = false;
                upperLoading.value = false;
                if (comicList.length < pageSize) {
                    lowerMore = false;
                }
            }
        } else {
            if (action == 2) {
                upperPage = upperPage > 0 && comicList.length ? upperPage - 1 : upperPage;
            } else if (action == 3) {
                lowerPage = comicList.length ? lowerPage + 1 : lowerPage;
            }
        }
        if ((action == 1 || action == 4) && !comicList.length) {
            // 设置是否展示没有数据
            isEmpty.value = true;
        }

        noMoreData(comicList, action);

        // 获取list数据格式化
        const list = formatData(comicList);

        if (!list.length) {
            upperLoading.value = false;
            lowerLoading.value = false;
            return;
        }

        if (action == 2) {
            upperLoading.value = false;
            listAry.value = [...list, ...listAry.value];
        } else if (action == 3) {
            lowerLoading.value = false;
            listAry.value = [...listAry.value, ...list];
        } else {
            lowerLoading.value = false;
            listAry.value = list;
        }

        // 定位相关
        if (action == 1 && !sign) {
            nextTick(() => scrollToClockItem());
        }
    } catch (err) {
        loading.value = false;
    }
};
const onScroll = (event: Event) => {
    const scrollContainer = event.target as HTMLElement;
    if (!initMore || loading.value) {
        return;
    }

    if (scrollContainer.scrollTop == 0) {
        if (!upperMore || !upperPage) {
            // 触顶没有更多数据
            return;
        }
        getList({ action: 2, baseId: listAry.value[0].id });
    } else if (
        scrollContainer.scrollHeight - scrollContainer.scrollTop <=
        scrollContainer.clientHeight + 10
    ) {
        if (!lowerMore) {
            return;
        }
        getList({ action: 3, baseId: listAry.value.slice(-1)[0].id });
    }
};
const eventTap = () => {
    emit('handleCloseCatalog');
};
const sortFunc = (val: string) => {
    if (val == sort.value) {
        return;
    }
    direClickReport('排序按钮');
    if (activeId.value == -2) {
        // 彩蛋tab正序、倒序
        bsort = val == 'asc';
        sort.value = val;
        if (bsort) {
            listAry.value = [...bonusList];
        } else {
            listAry.value = [...bonusList].reverse();
        }
        initMore = true;
        lowerMore = false;
        upperMore = false;
        return;
    }
    tsort = val == 'asc';
    sort.value = val;
    listAry.value = [];
    initMore = true;
    lowerMore = true;
    upperMore = true;
    getList({ action: 1, sign: true });
};
const commonReset = (type?: string, behavior?: string) => {
    sort.value = tsort ? 'asc' : 'desc';
    listAry.value = [];
    initMore = true;
    lowerMore = true;
    upperMore = true;
    const options: any = {
        action: type == 'top' ? 4 : 1,
        location: behavior || type,
    };
    if (type == 'top') {
        options.baseId = 0;
    }
    getList(options);
};

// 更改目录排序状态
const changeStatus = (type: string) => {
    // 数据还在加载中避免快速切换
    if (upperLoading.value || lowerLoading.value) {
        return;
    }

    direClickReport(type == 'top' ? '顶部按钮' : '定位按钮');

    // 彩蛋回到顶部
    if (activeId.value == -2 && type == 'top') {
        nextTick(() => {
            const clockItem = listAry.value.length ? listAry.value[0] : [];
            if (clockItem) {
                const targetElement = document.querySelector(`.${clockItem.key}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'instant' });
                }
            }
        });
        return;
    }

    commonReset(type);
};

const actionTap = (id: number) => {
    utilAction({ type: 3, id, redirect: props.page === 'comic' });
    emit('handleCloseCatalog');
};

// 检查是否存在阅读
const checkHasRead = async () => {
    const topicHistory: Partial<{ [key: number]: object }> = JSON.parse(
        localStorage.getItem('historyForTopic') || '{}'
    );
    const obj: any = topicHistory[props.topicId];
    if (obj) {
        historyList.value = obj.readList.map((item: { id: number; read_count: number }) => ({
            id: item.id,
            read_count: item.read_count || 0,
        }));
        continueId.value = obj.lastId;
    }
};

// 已登陆拉取阅读历史
const pullOriginRead = async () => {
    try {
        const { data = {} } = await getTopicReadRecordApi({ topic_id: props.topicId });
        const { comic_records } = data;
        historyList.value = comic_records
            .filter((item: { has_read: boolean }) => !!item.has_read)
            .map((item: { id: number; read_count: number }) => ({
                id: item.id,
                read_count: item.read_count || 0,
            }));
        continueId.value = comic_records.filter((item: any) => item.continue_read_comic).length
            ? comic_records.filter((item: any) => item.continue_read_comic)[0].id
            : '';
    } catch (err: any) {
        // Console.log('error', err);
    }
};
const getReadStorage = async () => {
    if (userId) {
        await pullOriginRead();
    } else {
        checkHasRead();
    }
};

// 目录优化改版
const toggleTab = (id: number) => {
    if (id == activeId.value) {
        return;
    }
    activeId.value = id;

    // 彩蛋列表不做请求
    if (id == -2) {
        direClickReport('彩蛋tab');
        sort.value = bsort ? 'asc' : 'desc';
        if (bsort) {
            listAry.value = [...bonusList];
        } else {
            listAry.value = [...bonusList].reverse();
        }
        isEmpty.value = false;
        initMore = true;
        lowerMore = false;
        upperMore = false;
        updateRemind.value = trailerSubTitle;
        comicCount.value = quarterCount[id];
        return;
    }

    direClickReport('分季tab');
    commonReset('top', 'click');
};

onMounted(async () => {
    document.body.style.overflow = 'hidden';
    await getReadStorage(); // 拉取阅读历史
    // 将当前话作为已读, 在数组中push当前章节id
    if (
        props.page == 'comic' &&
        !historyList.value.map((item) => item.id).includes(props.comicId)
    ) {
        historyList.value.push({
            id: props.comicId,
            read_count: 0,
        });
    }
    getList({ action: 1, onFirst: true });
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.catalog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 88;
    display: flex;
    width: 100%;
    flex-direction: column;
}
.bg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    pointer-events: auto;
}
.warp {
    position: absolute;
    bottom: 0;
    z-index: 10;
    display: flex;
    width: 100%;
    border-radius: vws(24) vws(24) vws(0) vws(0);
    background-color: #fff;
    flex-direction: column;
    &.pd {
        padding-bottom: vws(98);
    }
}

.top-txt {
    position: relative;
    padding: vws(38) vws(24) vws(0);
    width: auto;
    flex-direction: column;
}
.body-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: vws(70);
    box-sizing: border-box;
    .left {
        overflow: hidden;
        flex: 1;
        height: vws(56);
        .tabs {
            overflow-x: scroll;
            width: 100%;
            height: vws(76);
            white-space: nowrap;
        }
        .single {
            position: relative;
            display: inline-block;
            justify-content: center;
            margin-right: vws(32);
            height: vws(56);
            vertical-align: top;
            .name {
                display: flex;
                align-items: center;
                height: vws(44);
                .txt {
                    font-size: vws(34);
                    font-weight: 500;
                    color: #999;
                }
                .active-txt {
                    color: #222;
                }
            }
            .active-sign {
                position: absolute;
                bottom: 0;
                left: 50%;
                width: vws(32);
                height: vws(6);
                border-radius: vws(4);
                background-color: #ffe120;
                transform: translateX(-50%);
            }
        }
    }
    .shadow {
        position: absolute;
        top: vws(28);
        right: vws(130);
        z-index: 10;
        width: vws(46);
        height: vws(64);
        background: linear-gradient(270deg, #fff 31.25%, rgba(255, 255, 255, 0) 100%);
    }
    .sort {
        display: flex;
        justify-content: center;
        align-items: center;
        width: vws(108);
        height: vws(44);
        .sort-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            // width: vws(76);
            height: vws(44);
            .sort-img {
                width: vws(24);
                height: vws(24);
            }
            .txt {
                margin-left: vws(4);
                font-size: vws(24);
                color: #666;
            }
        }
    }
}
.sub-title {
    position: relative;
    height: vws(72);
    .txt {
        font-size: vws(28);
        line-height: vws(34);
        color: #999;
    }
}

.scroll-wrap {
    position: relative;
    overflow-y: scroll;
    height: vws(850);
    .bottom {
        width: 100%;
        height: vws(80);
    }
    .comic {
        position: relative;
        display: flex;
        padding: vws(24) 0 vws(24) vws(32);
        width: 100%;
        height: vws(144);
        box-sizing: border-box;
    }
    .pic {
        position: relative;
        overflow: hidden;
        width: vws(158);
        height: vws(96);
        border-radius: vws(8);
        .topic-cover {
            width: 100%;
            height: 100%;
        }
        .forbidden {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
        }
        .locked {
            .img {
                position: absolute;
                top: vws(28);
                left: vws(60);
                width: vws(38);
                height: vws(38);
                // margin: vws(-19) 0 0 vws(-19);
            }
        }
        .unlock {
            background-color: transparent;
            .img {
                position: absolute;
                top: 0;
                left: 0;
                width: vws(70);
                height: vws(48);
            }
        }
    }
    .txt {
        display: flex;
        justify-content: space-between;
        padding-left: vws(32);
        flex: 1;
        flex-direction: column;
        .descLine {
            display: flex;
            align-items: center;
        }
        .label {
            display: inline-block;
            margin-right: vws(12);
            padding: 0 vws(10);
            height: vws(36);
            font-size: vws(20);
            font-family: PingFangSC-Medium, 'PingFang SC';
            font-weight: bold;
            border-radius: vws(8);
            line-height: vws(36);
            box-sizing: border-box;
        }
        .title {
            display: inline-block;
            overflow: hidden;
            width: 100%;
            max-width: vws(360);
            font-size: vws(32);
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333;
            line-height: vws(40);
        }
        .readed {
            color: #999;
        }
        .infos {
            .time {
                font-size: vws(24);
                color: rgba(153, 153, 153, 1);
                line-height: vws(30);
            }
        }
    }
    .clock {
        position: absolute;
        top: vws(32);
        right: 0;
        z-index: 1;
        .img {
            width: vws(50);
            height: vws(44);
        }
    }
}

.no-data {
    display: flex;
    align-items: center;
    margin-top: vws(180);
    width: 100%;
    flex: 1;
    flex-direction: column;
    .cover {
        width: vws(450);
        height: vws(236);
    }
    .tips {
        display: flex;
        justify-content: center;
        overflow: hidden;
        padding: 0 vws(20);
        width: 100%;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        span {
            font-size: vws(28);
            line-height: vws(34);
            color: #999;
        }
    }
}

.suspend {
    position: absolute;
    top: vws(490);
    right: 0;
    z-index: 10;
    width: vws(136);
    .img-local {
        width: 100%;
        height: vws(136);
    }
}
</style>
