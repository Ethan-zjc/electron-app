<template>
    <div class="topic-page">
        <NavBar isShowHome :title="baseInfo.topicTit" />

        <div class="new" v-if="baseInfo.banner">
            <!-- 漫画介绍相关 -->
            <TopicIntrol :baseInfo="baseInfo" :topicId="topicId" />

            <!-- 漫画选集 -->
            <TopicAnthology
                :topicId="topicId"
                :comicId="continueId"
                :anInfos="anInfos"
                :anLists="anLists"
                :initialIndex="initialIndex"
            />

            <!-- 漫画推荐 -->
            <TopicReacommend
                :border="false"
                :topicId="baseInfo.topicId"
                :topicTitle="baseInfo.topicTit"
            />
        </div>
    </div>

    <!-- 固定底部新增实验组改版 -->
    <div class="fixed-base-new" v-if="continueId">
        <div class="infos">
            <div class="title">{{ continueTitle }}</div>
            <div class="btn" @click="actionComic(continueId)">
                {{
                    historyList.length || (userInfo && baseInfo?.continueObj?.id) ? '继续' : '开始'
                }}阅读
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// const Console = console;
import { ref, defineAsyncComponent, onBeforeMount } from 'vue';
import { ComicItemInter, StorageTopicInter, ReadListInter } from '@/typings/index';
import { BaseInfoInter, AnInfosInter, AnListsItemInter } from '@/typings/topic';
import { utilAction, utilShowToast, utilTransNum } from '@/helpers/utils';
import { getTopicDetailApi } from '@/api/topic.api';
import { track } from '@/helpers/kksa';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const TopicIntrol = defineAsyncComponent(() => import('./components/TopicIntrol.vue'));
const TopicAnthology = defineAsyncComponent(() => import('./components/TopicAnthology.vue'));
const TopicReacommend = defineAsyncComponent(
    () => import('@/components/RecommendList/TopicReacommend.vue')
);

const store = useStore();
const route = useRoute();
const { userInfo, userId } = store.state;
const topicId = Number(route.query.id || 0);

const baseInfo = ref<Partial<BaseInfoInter>>({});
const anInfos = ref<Partial<AnInfosInter>>({});
const anLists = ref<Array<AnListsItemInter>>([]);
const comicList = ref<Array<ComicItemInter>>([]);
const continueId = ref(-1);
const continueTitle = ref('');
const historyList = ref<Array<Partial<ReadListInter>>>([]);
const initialIndex = ref(0);

const trackEvent = (name: string) => {
    const options = {
        ButtonName: name,
    };
    track('TopicPageClk', options);
};
const readTopicTrack = (options: { isvip: boolean; isTempVip: boolean; topic: any }) => {
    const { isvip, isTempVip, topic } = options;
    const {
        id: TopicID,
        title: TopicName,
        signing_status: WorksSigningState = '',
        self_upload: SelfUpload = false,
    } = topic;
    const MembershipClassify = isvip || isTempVip ? 1 : 0;
    track('ReadTopic', {
        WorksSigningState,
        SelfUpload,
        TopicID,
        TopicName,
        MembershipClassify,
    });
};
const newTopicLocation = (sign: boolean) => {
    if (continueId.value && anLists.value.length) {
        const index = anLists.value.findIndex(
            (item: AnListsItemInter) => item.id == continueId.value
        );
        if (index >= 0) {
            initialIndex.value = index != 0 ? index + (anInfos.value.hasPrevious ? 2 : 1) : 0;
            if (sign) {
                const historyListIds = historyList.value.map((item) => item.id);
                const newAnLists: AnListsItemInter[] = anLists.value.map((item: any, ind) => {
                    return Object.assign(item, {
                        clock: index == ind,
                        readed:
                            index == ind || item.readed || historyListIds.indexOf(item.id) != -1,
                    });
                });
                anLists.value = newAnLists;
            }
        } else {
            initialIndex.value = 0;
        }
    }
};
const checkHasRead = async () => {
    // 检查是否存在阅读
    const topicHistory: Partial<{ [key: number]: object }> = JSON.parse(
        localStorage.getItem('historyForTopic') || '{}'
    );

    const obj: Partial<StorageTopicInter> = topicHistory[topicId] || {};
    if (obj) {
        let index = 0;
        if (obj.lastId) {
            index = comicList.value.findIndex((item: ComicItemInter) => item.id == obj.lastId);
        }

        historyList.value =
            (obj.readList &&
                obj.readList.map((item) => ({
                    id: item.id,
                    read_count: item.read_count || 0,
                }))) ||
            [];
        continueId.value = obj.lastId ? comicList.value[index].id : comicList.value[0].id;
        continueTitle.value = obj.lastId ? comicList.value[index].title : comicList.value[0].title;

        // 新版本选集定位
        newTopicLocation(true);
    }
};
const initData = async () => {
    const sendData = {
        topic_id: topicId,
        sort: 'asc',
        page_source: 0,
    };

    try {
        const { data = {} } = await getTopicDetailApi(sendData);
        const {
            selections,
            first_comic,
            comic_list: comics,
            topic_info: topic,
            vip_user: isvip,
            temporary_vip_user: isTempVip = false,
            continue_read_comic: continueObj = {},
        } = data;
        comicList.value = comics;
        const { follows } = store.state;
        follows[topicId] = topic.is_favourite;
        store.commit('setStore', {
            key: 'follows',
            value: follows,
        });

        // 处理专题相关信息展示
        baseInfo.value = {
            continueObj,
            topicId: topic.id,
            topicTit: topic.title,
            banner: topic.cover_image_url,
            intro: topic.description,
            count: topic.comic_count,
            authors: topic.related_author.length
                ? topic.related_author
                : topic.user
                ? [].concat(topic.user)
                : [],
            tags: topic.category,
            popular: utilTransNum(topic.popularity), // 人气
            comment: utilTransNum(topic.comment_count), // 评论
            follow: utilTransNum(topic.favourite_count), // 关注
        };

        anInfos.value = {
            count: topic.comic_count,
            updateTime: topic.update_day,
            hasNext: selections.has_next,
            hasPrevious: selections.has_previous,
        };

        if (userId) {
            historyList.value = [];
            continueId.value = continueObj.id || first_comic.id;
            continueTitle.value = continueObj.title || first_comic.title;
        }

        anLists.value = selections.selections_comic_list.map((item: ComicItemInter) => {
            const obj = {
                id: item.id,
                key: `comic_${item.id}`,
                title: item.title,
                imgUrl: item.cover_image_url,
                clock: false,
                forbidden: !item.is_free || item.vip_exclusive,
                forbiddenType: item.can_view ? 'lock-off' : 'lock-on',
                readed: false,
            };
            if (userId) {
                obj.clock = item.id == continueId.value;
                obj.readed = item.has_read;
            }
            return obj;
        });

        readTopicTrack({ topic, isvip, isTempVip });

        // 选集定位
        if (!userId) {
            checkHasRead();
        } else {
            newTopicLocation(false);
        }
    } catch (err: any) {
        utilShowToast({ title: err.message });
    }
};

const actionComic = (id: number) => {
    trackEvent('阅读');
    utilAction({ type: 3, id });
};

onBeforeMount(() => {
    initData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.topic-page {
    position: relative;
    overflow: scroll;
    width: 100%;
    height: 100vh;
}

// 新版
.new {
    padding-bottom: vws(144);
}
.fixed-base-new {
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: vws(750);
    height: vws(96);
    border-top: 1px solid #eaeef0;
    background: #fff;
    transition: transform 0.6s;
    box-sizing: border-box;
    .infos {
        display: flex;
        justify-items: flex-start;
        height: vws(96);
        .title {
            overflow: hidden;
            padding: 0 vws(48) vws(0) vws(24);
            font-size: vws(26);
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #999;
            flex: 1;
            box-sizing: border-box;
            line-height: vws(96);
        }
        .btn {
            width: vws(264);
            font-size: vws(30);
            font-weight: 500;
            text-align: center;
            color: #442509;
            background: #fce23d;
            line-height: vws(96);
        }
    }
}
::-webkit-scrollbar {
    display: none;
}
</style>
