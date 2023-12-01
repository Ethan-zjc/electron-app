<template>
    <transition name="expandup">
        <NavBar v-if="!fullScreen" isShowHome :title="baseInfo.comicTit" />
    </transition>
    <div class="comic-page" @click="handleClick" @scroll="handleScroll">
        <ComicImgList v-if="imgList.length" :imgList="imgList" />

        <!-- 漫底操作 -->
        <ComicBottom
            v-if="imgList.length"
            :baseInfo="baseInfo"
            @handleBottomNext="handleBottomNext"
        />
    </div>

    <transition name="expand">
        <ComicTools
            v-if="!fullScreen && baseInfo.topicId"
            :topicId="baseInfo.topicId"
            :follows="store.state.follows"
            @handleToolsCallback="toolsCallback"
        />
    </transition>

    <!-- 目录 -->
    <TopicCatalog
        v-if="showCatalog && baseInfo.topicId"
        :page="'comic'"
        :topicId="baseInfo.topicId"
        :comicId="baseInfo.comicId"
        :isBonusChapter="isBonusChapter"
        @handleCloseCatalog="closeCatalog"
    />

    <!-- 返回首页 -->
    <ComicHome :fullScreen="fullScreen" @handleHome="toHome" />

    <!-- 付费半屏 -->
    <PayHalf v-if="showPayHalf" :baseInfo="baseInfo" />
</template>

<script setup lang="ts">
// const Console = console;
import {
    ref,
    defineAsyncComponent,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
    watch,
    provide,
} from 'vue';
import { utilTransNum, utilShowToast, utilAction } from '@/helpers/utils';
import { utilHandleFollow, utilCheckWallet } from '@/helpers/behaviors';
import {
    getComicDetailApi,
    comicReportApi,
    getPayInfoApi,
    autoPaidApi,
    getPopTypeApi,
} from '@/api/comic.api';
import {
    PaidCallbackInter,
    BaseInfoInter,
    ComicImgListInter,
    ComicReadListInter,
    TopicReadListInter,
    BookReadListInter,
    ReportComicReadInter,
} from '@/typings/comic';
import { track } from '@/helpers/kksa';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { showDialog } from 'vant';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const ComicImgList = defineAsyncComponent(() => import('./components/ComicImgList.vue'));
const ComicBottom = defineAsyncComponent(() => import('./components/ComicBottom.vue'));
const ComicTools = defineAsyncComponent(() => import('./components/ComicTools.vue'));
const ComicHome = defineAsyncComponent(() => import('./components/ComicHome.vue'));
const PayHalf = defineAsyncComponent(() => import('./components/PayHalf.vue'));
const TopicCatalog = defineAsyncComponent(() => import('@/components/TopicCatalog/index.vue'));

const store = useStore();
const route = useRoute();
const router = useRouter();
let userId = store.state.userId || '';
let comicId = Number(route.query.id || 0);
let parentId = Number(route.query.parentId || 0);
let autobuy = Boolean(route.query.autobuy) || false;

const autoPay = ref(false);
const showCatalog = ref(false);
const fullScreen = ref(false);
const showPayHalf = ref(false);
const isBonusChapter = ref(false);
const trackProps = ref<any>({});
const baseInfo = ref<Partial<BaseInfoInter>>({});
const imgList = ref<Array<Partial<ComicImgListInter>>>([]);
const container = ref<HTMLElement | null>(null);
let pageHeight = window.innerHeight;
let maxScroll = { top: 0, time: 0 };
let scrollTop = 0;
let hasDialog = false;
let timestamp = new Date().getTime();

let historyForTopic: Partial<TopicReadListInter> = {},
    historyForMy: BookReadListInter[] = [],
    historyForPost: ReportComicReadInter[] = [];

const initializeData = () => {
    userId = store.state.userId;
    comicId = Number(route.query.id || 0);
    parentId = Number(route.query.parentId || 0);
    autobuy = Boolean(route.query.autobuy) || false;

    autoPay.value = false;
    showCatalog.value = false;
    fullScreen.value = false;
    showPayHalf.value = false;
    trackProps.value = {};
    baseInfo.value = {};
    imgList.value = [];
    container.value = null;
    pageHeight = window.innerHeight;
    maxScroll = { top: 0, time: 0 };
    scrollTop = 0;
    hasDialog = false;
    timestamp = new Date().getTime();
    (historyForTopic = {}), (historyForMy = []), (historyForPost = []);
};

const onTrack = (event: string, params?: any) => {
    const {
        comicTit: ComicName,
        comicId: ComicID,
        topicId: TopicID,
        topicTit: TopicName,
        signingStatus,
        totalCount = 0,
        topicFree,
        isFree = true,
    } = baseInfo.value;

    // 停留时长
    const date = new Date().getTime();
    const stayDuration = date - timestamp;

    // 是否付费作品
    const IsPaidComic = !isFree ? 1 : 0;

    // 是否付费专题
    const IsPaidTopic = !topicFree ? 1 : 0;

    // 签约状态
    const WorksSigningState = signingStatus || '';

    // 阅读进度
    const maxReadHeight = maxScroll.top + pageHeight;
    const maxReadCount = imgList.value.findIndex(
        (item: Partial<ComicImgListInter>) => item.top && item.top > maxReadHeight
    );
    const readCount = maxReadCount / totalCount;
    const ReadPer = readCount > 0 ? readCount.toFixed(2) : 0;

    const options = {
        ComicID,
        ComicName,
        TopicID,
        TopicName,
    };

    if (event == 'ReadComic') {
        Object.assign(options, {
            stayDuration,
            IsPaidComic,
            IsPaidTopic,
            WorksSigningState,
            ReadPer,
            IfTopic: false,
        });
        track(event, options);
    } else if (event == 'FavTopic' || event == 'RemoveFavTopic') {
        Object.assign(options, {
            IsPaidComic,
            NickName: '',
            AuthorID: '',
            Category: '',
        });
        track(event, options);
    } else if (event == 'Like') {
        Object.assign(options, {
            LikeObject: '漫画',
            TriggerPage: '漫画详情页',
            ...params,
        });

        // 神策点赞/取消点赞上报
        track(event, options);
    }
};
const requestPayInfo = async () => {
    const { topicId, comicId } = baseInfo.value;
    try {
        const res = await getPayInfoApi({ topicId, comicId });
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject();
    }
};

const requestPaid = async ({
    comicId,
    encrypt,
    report,
}: {
    comicId: number;
    encrypt: string;
    report: any;
}) => {
    try {
        const { topicId } = baseInfo.value;
        const res = await autoPaidApi({ comicId, encrypt, report, autoPay: autoPay.value });
        const data = res.data;
        if (topicId && !store.state.follows[topicId]) {
            utilHandleFollow({
                id: topicId,
            }).then(() => {
                return Promise.resolve(data);
            });
        } else {
            return Promise.resolve(data);
        }
    } catch (err) {
        return Promise.reject();
    }
};

const handlePay = async (params: any) => {
    const { baseInfo, comicInfo, comicAuth } = params || {};

    // 判断是否冻结kkb 0正常 1冻结
    if (comicAuth && comicAuth.status == 1) {
        hasDialog = true;
        showDialog({
            lockScroll: true,
            message:
                comicAuth.toast || '您的账号已被冻结，冻结期间无法阅读付费漫画，请联系客服处理~',
            confirmButtonColor: '#FF751A',
        }).then(() => {
            // 返回上一层级路径
        });
    }
    let status;
    const { reason, can_view: canView } = comicInfo;
    const { isPay, isvip, topicId, topicTit, comicId, comicTit, temporaryVip } = baseInfo;

    if (!canView) {
        const { code, data } = await getPopTypeApi({ topicId, comicId, autobuy: autobuy });
        if (code === 200) {
            status = data.pop_ups[0];
        }
    }

    if (comicInfo.vip_exclusive) {
        // 非会员用户
        let vipToast = '';
        if (!isvip) {
            vipToast = '本章节内容仅限会员可以阅读';
        } else if (reason && [103, 104].includes(reason)) {
            vipToast = temporaryVip
                ? '您当前的身份是"体验会员", 开通正式会员后可享受全部会员权益'
                : '开通正式会员后可继续阅读本章节';
        }
        if (vipToast) {
            await utilCheckWallet();
            trackProps.value = {
                isvip,
                TopicName: topicTit,
                ComicName: comicTit,
                LatestBalance: store.state.wallet,
            };
            showPayHalf.value = status == 3 || status == 4;
            fullScreen.value = false;
            return;
        }
    }

    // 付费章节的处理
    showPayHalf.value = isPay && !hasDialog;
};

const fetchData = async () => {
    const sendData = {
        topic_id: parentId,
        comic_id: parentId ? '' : comicId,
    };

    try {
        const { code = 0, data = {} } = await getComicDetailApi(sendData);
        if (code === 200) {
            const {
                    vip_user: isvip,
                    comic_basic_info: comicInfo,
                    topic_basic_info: topicInfo,
                    comic_image_list: imageList,
                    next_comic_id: nextComicId,
                    previous_comic_id: preComicId,
                    temporary_vip_user: temporaryVip,
                    comic_auth: comicAuth,
                } = data,
                {
                    id: topicId,
                    title: topicTit,
                    is_free: topicFree,
                    comic_count: comicCount,
                    cover_image_url: coverUrl,
                    vertical_image_url: verticalUrl,
                    is_favourite: followed,
                    update_remind: updateRemind,
                    signing_status: signingStatus,
                } = topicInfo,
                {
                    id: comicId,
                    is_liked: praised,
                    like_count: praiseNum,
                    title: comicTit,
                    comic_property_code: comicProperty,
                } = comicInfo;

            const { follows } = store.state;
            follows[topicId] = followed;
            store.commit('setStore', {
                key: 'follows',
                value: follows,
            });

            // 章节无法观看，需要弹窗
            const isPay = !comicInfo.is_free && !comicInfo.can_view;

            // 图片列表数据
            let top = 0;
            const screenWidth = window.screen.width;
            imageList.forEach((item: ComicImgListInter) => {
                const height = screenWidth * (item.height / item.width);
                item.top = top;
                // 1px容易出现文字折叠，做1px拉伸
                item.height =
                    Math.round(height) % 2 === 1 ? Math.round(height) + 1 : Math.round(height);
                top += height;
            });
            imgList.value = imageList;
            isBonusChapter.value = comicProperty && comicProperty == 6;
            baseInfo.value = {
                isPay,
                isvip,
                topicId,
                comicId,
                praised,
                topicTit,
                comicTit,
                followed,
                comicCount,
                coverUrl,
                verticalUrl,
                updateRemind,
                likeCount: praiseNum,
                praiseNum: utilTransNum(praiseNum),
                totalCount: imgList.value.length,
                prevId: preComicId || '',
                nextId: nextComicId || '',
                isFree: comicInfo.is_free,
                topicFree,
                signingStatus,
                temporaryVip,
            };

            return { isPay, baseInfo: baseInfo.value, comicInfo, comicAuth };
        }
    } catch (err: any) {
        utilShowToast({ title: err.message });
    }
};

const autoPayComic = async (comicInfo: any, params: any) => {
    const { id: comicId, title: comicTit } = comicInfo;
    // 自动购买逻辑
    try {
        const payInfo = await requestPayInfo();
        const { autoPay: isAutoPay } = payInfo;
        let { kk_currency_balance: wallet } = payInfo;
        wallet = wallet < 0 ? 0 : wallet;
        const listItem = payInfo.batch_purchase_list[0];
        const encrypt = listItem.comicbuy_encrypt_str;
        const prize = listItem.price_info.selling_kk_currency;
        if (isAutoPay && wallet >= prize) {
            autoPay.value = true;
            try {
                const data = await requestPaid({
                    comicId,
                    encrypt,
                    report: {
                        comic_name: comicTit,
                        current_price: prize,
                        auto_paid: 1,
                    },
                });
                utilShowToast({
                    title:
                        data.auto_pay_time > 0 ? '买好啦，请愉快食用！' : '自动购买，可在钱包设置',
                    duration: 1500,
                });
                if (showPayHalf.value) {
                    showPayHalf.value = false;
                }
                fetchData();
            } catch (err) {
                handlePay(params);
            }
        } else {
            handlePay(params);
        }
    } catch (err) {
        handlePay(params);
    }
};

const initData = async () => {
    const params: any = await fetchData();
    if (params && params.comicInfo) {
        if (params.isPay && autobuy) {
            autoPayComic(params.comicInfo, params);
        } else {
            handlePay(params);
        }
    }
};

const transPage = (type: string) => {
    const transY = (window.innerHeight * 2) / 3;

    if (!fullScreen.value) fullScreen.value = true;
    if (container.value) {
        container.value.scrollBy({
            top: type == 'up' ? -transY : transY,
            behavior: 'smooth',
        });
    }
};

const handleClick = (e: MouseEvent) => {
    const clickY = e.clientY;
    const windowHeight = window.innerHeight;
    const position = Math.floor((clickY / windowHeight) * 3);

    // 根据 position 处理翻页逻辑
    if (position == 1) {
        fullScreen.value = !fullScreen.value;
    } else {
        transPage(`${position ? 'down' : 'up'}`);
    }
};

const handleScroll = (event: Event) => {
    const scrollContainer = event.target as HTMLElement;

    scrollTop = scrollContainer.scrollTop;
    maxScroll.top = Math.max(scrollTop, maxScroll.top);
    maxScroll.time = new Date().getTime();

    if (scrollTop >= 50) {
        if (!fullScreen.value) {
            fullScreen.value = true;
        }
    } else {
        if (fullScreen.value) {
            fullScreen.value = false;
        }
    }
};

const actionPageJump = (type: string) => {
    const { prevId, nextId } = baseInfo.value;
    if ((type == 'prev' && !prevId) || (type == 'next' && !nextId)) {
        utilShowToast({
            title: type == 'prev' ? '没有上一话啦～' : '没有下一话啦～',
        });
        return;
    }

    const comicId = type == 'prev' ? prevId : nextId;
    const params = { autobuy: true };
    if (route.query.external) {
        Object.assign(params, { external: 1 });
    }
    utilAction({
        type: 3,
        id: comicId,
        redirect: true,
        params,
    });
};

const handleFav = () => {
    if (baseInfo.value.topicId) {
        utilHandleFollow({ id: baseInfo.value.topicId }).then((res) => {
            onTrack(res ? 'FavTopic' : 'RemoveFavTopic');
        });
    }
};

const closeCatalog = () => {
    showCatalog.value = false;
    document.body.style.overflow = 'auto';
};

const init = () => {
    container.value = document.querySelector('.comic-page');
    historyForTopic = JSON.parse(localStorage.getItem('historyForTopic') || '{}');
    historyForMy = JSON.parse(localStorage.getItem('historyForMy') || '[]');
    historyForPost = JSON.parse(localStorage.getItem('historyForPost') || '[]');
};

// 存储专题页所用存储数据
const setTopicHistory = () => {
    const { comicId, topicId, isPay } = baseInfo.value;
    if (!topicId || userId || isPay) return;
    const readTopic: any = historyForTopic[topicId] || {};
    const readList = readTopic?.readList || [];

    let readHeight = 0,
        readCount = -1,
        readComic = {};
    readHeight = scrollTop + pageHeight;
    readCount = imgList.value.findIndex(
        (item: Partial<ComicImgListInter>) => item.top && item.top > readHeight
    );

    readComic = {
        id: comicId,
        read_count: readCount >= 0 ? readCount : imgList.value.length,
        has_read: true,
        continue_read_comic: true,
    };

    const comicIndex = readList.findIndex((item: ComicReadListInter) => item.id == comicId);
    if (comicIndex >= 0) {
        readList.splice(comicIndex, 1);
    }
    readList.forEach((item: ComicReadListInter) => {
        item.continue_read_comic = false;
    });
    readList.push(readComic);

    historyForTopic[topicId] = {
        readList: readList,
        lastId: comicId,
    };

    // Console.log('存储的专题页使用阅读数据', historyForTopic);
    localStorage.setItem('historyForTopic', JSON.stringify(historyForTopic));
};

// 个人页阅读历史使用封装存储、阅读历史页使用、根据登录情况
const setMyHistory = () => {
    const { isPay, topicId, topicTit, comicId, comicTit, comicCount, verticalUrl } = baseInfo.value;
    if (userId || isPay || !topicId) return;

    const readHeight = scrollTop + pageHeight;
    const readCount = imgList.value.findIndex(
        (item: Partial<ComicImgListInter>) => item.top && item.top > readHeight
    );
    const continue_read_comic: any = {
        id: comicId,
        title: comicTit,
        read_count: readCount >= 0 ? readCount : imgList.value.length,
    };
    const historyObj: BookReadListInter = {
        id: topicId,
        title: topicTit || '',
        vertical_image_url: verticalUrl || '',
        comics_count: comicCount || 0,
        continue_read_comic,
        read_count: historyForTopic[topicId]?.readList.length || 1,
    };

    const exitIndex = historyForMy.findIndex((item) => item.id == topicId);
    if (exitIndex >= 0) {
        historyForMy.splice(exitIndex, 1);
    }
    historyForMy.unshift(historyObj);
    localStorage.setItem('historyForMy', JSON.stringify(historyForMy));

    // Console.log('书架页使用阅读数据', historyForMy);
};

// 阅读进度上报、或本地存储、根据登录情况
const reportedData = () => {
    let readCount = 0,
        maxReadCount = 0;
    const { isPay, topicId, comicId, totalCount } = baseInfo.value;
    if (!topicId || !comicId) return;

    const readHeight = scrollTop + pageHeight;
    const maxReadHeight = maxScroll.top + pageHeight;

    readCount = imgList.value.findIndex(
        (item: Partial<ComicImgListInter>) => item.top && item.top > readHeight
    );
    maxReadCount = imgList.value.findIndex(
        (item: Partial<ComicImgListInter>) => item.top && item.top > maxReadHeight
    );

    const data = {
        topic_id: topicId || 0,
        comic_id: comicId || 0,
        max_read_count_time: maxScroll.time,
        read_count: readCount >= 0 ? readCount : imgList.value.length,
        max_read_count: maxReadCount >= 0 ? maxReadCount : imgList.value.length,
        read_time: new Date().getTime(), // 退出详情页\即触发上报时机(翻页／退出)
        total_count: totalCount || 0,
    };

    const comicIndex = historyForPost.findIndex((item) => item.comic_id == comicId);
    if (comicIndex >= 0) {
        historyForPost.splice(comicIndex, 1);
    }
    historyForPost.unshift(data); // 最新阅读的放在最前面

    if (!userId && !isPay) {
        localStorage.setItem('historyForPost', JSON.stringify(historyForPost));
    }
    // console.log('上报服务端的数据', historyForPost);

    // 已登陆未登录都上报、无权限不上报（存在付费弹窗、存在会员弹窗都认为无权限）
    if (!isPay) {
        store.commit('setStore', { key: 'historyPosting', value: true });
        comicReportApi(data)
            .then(() => {
                store.commit('setStore', { key: 'historyPosting', value: false });
                if (store.state.historyCallback) {
                    store.state.historyCallback();
                    store.commit('setStore', { key: 'historyCallback', value: null });
                }
            })
            .catch(() => {
                // 上报失败再次存储
                localStorage.setItem('historyForPost', JSON.stringify(historyForPost));
            });
    }
};
const clickTrack = ({ type = 3 } = {}) => {
    const types: { [key: number]: string } = {
        1: '上一篇',
        2: '目录',
        3: '下一篇',
        5: '分享',
        6: '首页悬浮按钮',
        7: '专题详情',
    };
    track('ReadPageClk', {
        TopicName: baseInfo.value.topicTit || '',
        ButtonName: types[type],
    });
};
const comicModuleTrack = (event: string, value: { type: string }) => {
    const { type: ModuleType } = value;
    const {
        comicTit: ComicName,
        comicId: ComicID,
        topicId: TopicID,
        topicTit: TopicName,
    } = baseInfo.value;
    const options = {
        ComicID,
        ComicName,
        TopicID,
        TopicName,
        ModuleType,
    };
    track(event, options);
};
const handleBottomNext = () => {
    comicModuleTrack('ComicPageModuleClick', {
        type: '下一话-漫底按钮',
    });
};
const toolsCallback = (index: number) => {
    if (index == 0) {
        clickTrack({ type: 1 });
        actionPageJump('prev');
    } else if (index == 1) {
        clickTrack({ type: 2 });
        showCatalog.value = !showCatalog.value;
    } else if (index == 2) {
        clickTrack({ type: 3 });
        comicModuleTrack('ComicPageModuleClick', {
            type: '下一话-工具栏按钮',
        });
        actionPageJump('next');
    } else if (index == 3) {
        handleFav();
    } else if (index == 4) {
        clickTrack({ type: 7 });
        utilAction({ type: 2, id: baseInfo.value.topicId });
    }
};

const paidCallback = async (e: PaidCallbackInter) => {
    const { state, toast } = e;
    if (toast && toast.show) {
        utilShowToast({ title: toast.message });
    }
    if (state) {
        // 购买成功
        showPayHalf.value = false;
        await initData();
        const { topicId } = baseInfo.value;

        if (topicId && !store.state.follows[topicId]) {
            utilHandleFollow({ id: topicId });
        }
    }
};
provide('emitPaidEvent', paidCallback);

const leaveTrack = () => {
    setTopicHistory();
    setMyHistory();
    reportedData();
};
const toHome = () => {
    router.push({ path: `/find` });
};

watch(
    () => route.query,
    () => {
        if (route.name != 'comic') return;
        leaveTrack();
        initializeData();
        init();
        initData();
        track('VisitComicPage');
    }
);

onBeforeMount(() => {
    initData();
    track('VisitComicPage');
});
onMounted(() => {
    init();
});
onBeforeUnmount(() => {
    leaveTrack();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.comic-page {
    overflow: scroll;
    width: 100%;
    height: 100vh;
}
.expand-enter-active,
.expand-leave-active {
    transition: transform 0.3s;
}
.expand-enter,
.expand-leave-to {
    transform: translateY(vws(100));
}

.expandup-enter-active,
.expandup-leave-active {
    transition: transform 0.3s;
}
.expandup-enter,
.expandup-leave-to {
    transform: translateY(vws(-100));
}
</style>
