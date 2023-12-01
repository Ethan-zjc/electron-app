<template>
    <div class="anthology">
        <div class="intro">
            <div class="left">
                <div class="title">
                    <span class="name">漫画选集</span>
                </div>
                <div v-if="props.anLists.length" class="update">
                    <span class="day" v-if="props.anInfos.updateTime">
                        {{ props.anInfos.updateTime }}
                    </span>
                    <span v-if="props.anInfos.count">已更{{ props.anInfos.count }}集</span>
                </div>
            </div>
            <div v-if="props.anLists.length" class="right" @click="directory">
                <span class="more-text">展开选集</span>
                <img class="more-icon" :src="cdnIconsImgs['common-arrow']" />
            </div>
        </div>

        <div class="topic-list">
            <div class="scroll" v-if="props.anLists.length">
                <!-- 查看更多 -->
                <div v-if="props.anInfos.hasPrevious" class="more befor" @click="directory">
                    <img class="more-icon" :src="cdnIconsImgs['circle-arrow']" />
                    <span class="txt">查看更多</span>
                </div>

                <!-- list -->
                <div
                    v-for="(item, index) in anLists"
                    :class="{
                        single: true,
                        'has-first': anInfos.hasPrevious && index == 0,
                        'no-first': !anInfos.hasPrevious && index == 0,
                        [item.key]: true,
                    }"
                    :key="item.id"
                    @click="anthologyAction(item.id)"
                >
                    <div class="img">
                        <img class="topic-cover" :src="item.imgUrl" />
                        <!-- 已看过 -->
                        <div v-if="item.readed" :class="{ place: true, shadow: item.readed }"></div>

                        <!-- 续读标签 -->
                        <img
                            v-if="item.clock"
                            class="sign"
                            :src="cdnIconsImgs['topic-new-clock']"
                        />

                        <!-- 锁住/续读标签 -->
                        <div
                            v-if="item.forbidden"
                            :class="{
                                place: true,
                                forbidden: true,
                                [item.forbiddenType]: true,
                            }"
                        >
                            <!-- 解锁/锁住 -->
                            <img
                                v-if="!item.clock"
                                class="icon"
                                :src="cdnIconsImgs[`topic-${item.forbiddenType}`]"
                            />
                        </div>
                    </div>
                    <span class="title">{{ item.title }}</span>
                </div>

                <!-- 查看更多 -->
                <div v-if="anInfos.hasNext" class="more after" @click="directory">
                    <img class="more-icon" :src="cdnIconsImgs['circle-arrow']" />
                    <span class="txt">查看更多</span>
                </div>
            </div>

            <!-- 没有选集 -->
            <div class="no-list" v-else>
                <img
                    class="img"
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/new-icon/list-null_0e17c9e.png"
                />
            </div>
        </div>
    </div>

    <!-- 目录 -->
    <TopicCatalog
        v-if="showCatalog"
        :page="'topic'"
        :topicId="topicId"
        :comicId="comicId"
        @handleCloseCatalog="closeCatalog"
    />
</template>

<script setup lang="ts">
import { ref, nextTick, watch, defineAsyncComponent } from 'vue';
import { cdnIconsImgs } from '@/assets/js/cdn';
import { AnListsItemInter } from '@/typings/topic';
import { utilAction } from '@/helpers/utils';
import { track } from '@/helpers/kksa';

const TopicCatalog = defineAsyncComponent(() => import('@/components/TopicCatalog/index.vue'));

interface ComicItemObj extends AnListsItemInter {
    imgUrl: string;
    readed: boolean;
    forbidden: boolean;
    forbiddenType: string;
    clock: boolean;
    key: string;
}

const props = defineProps({
    anInfos: {
        type: Object,
        default: () => {
            return {};
        },
    },
    anLists: {
        type: Array as () => ComicItemObj[],
        default: () => [],
    },
    topicId: {
        type: Number,
        default: 0,
    },
    comicId: {
        type: Number,
        default: 0,
    },
    initialIndex: {
        type: Number,
        default: 0,
    },
});
const showCatalog = ref(false);

const directory = () => {
    track('TopicPageClk', {
        ButtonName: '目录',
    });
    showCatalog.value = !showCatalog.value;
};
const closeCatalog = () => {
    showCatalog.value = false;
};
const anthologyAction = (id: number) => {
    utilAction({ type: 3, id });
};

const loction = () => {
    if (!props.initialIndex) return;
    nextTick(() => {
        const item = props.anLists[props.initialIndex];
        if (item && item.key) {
            const targetElement = document.querySelector(`.${item.key}`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'instant' });
            }
        }
    });
};

watch(
    () => props.initialIndex,
    () => {
        loction();
    },
    {
        immediate: true,
    }
);
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.anthology {
    margin: vws(24) 0;
    width: 100%;
    .intro {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: vws(24);
        height: vws(138);
        box-sizing: border-box;
    }
    .left {
        flex: 1;
        max-width: vws(550);
        .title {
            display: flex;
            align-items: center;
            height: vws(50);
            .name {
                font-size: vws(36);
                font-weight: 500;
                color: #333;
                line-height: vws(50);
            }
            .batchBuy {
                display: inline-block;
                margin-left: vws(8);
                width: vws(98);
                height: vws(40);
                font-size: vws(22);
                border-radius: vws(20);
                text-align: center;
                color: #222;
                background: #ffe120;
                line-height: vws(40);
            }
        }
        .update {
            overflow: hidden;
            width: 100%;
            font-size: vws(28);
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #999;
            line-height: vws(40);
            .day {
                &::after {
                    display: inline-block;
                    margin: 0 vws(8);
                    width: vws(14);
                    height: vws(40);
                    text-align: center;
                    content: '·';
                }
            }
        }
    }
    .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: vws(136);
        height: 100%;
        .more-text {
            font-size: vws(26);
            color: #999;
        }
        .more-icon {
            width: vws(24);
            height: vws(24);
        }
    }
    .topic-list {
        overflow: hidden;
        height: vws(278);
    }
    .scroll {
        overflow-x: scroll;
        height: vws(294);
        // padding-left: vws(24);
        white-space: nowrap;
        .more {
            display: inline-block;
            padding: vws(24) vws(20);
            max-width: vws(180);
            border-radius: vws(12);
            background: #f2f2f2;
            box-sizing: border-box;
            vertical-align: top;
            .more-icon {
                display: block;
                margin-bottom: vws(4);
                width: vws(24);
                height: vws(24);
            }
            .txt {
                display: inline-block;
                width: vws(26);
                font-size: vws(22);
                text-align: center;
                white-space: normal;
                color: #999;
                word-wrap: break-word;
                line-height: vws(26);
            }
            &.befor {
                margin-left: vws(24);
                .more-icon {
                    transform: rotate(180deg);
                }
            }
            &.after {
                margin-right: vws(24);
            }
        }
        .single {
            display: inline-block;
            margin-right: vws(16);
            &.has-first {
                margin-left: vws(16);
            }
            &.no-first {
                margin-left: vws(24);
            }
            .img {
                position: relative;
                overflow: hidden;
                margin-bottom: vws(12);
                width: vws(320);
                height: vws(180);
                border-radius: vws(12);
                .topic-cover {
                    width: 100%;
                    height: 100%;
                }
                .place {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: vws(12);
                }
                .shadow {
                    background: rgba(255, 255, 255, 0.6);
                }
                .forbidden {
                    &.lock-off {
                        .icon {
                            position: absolute;
                            top: 0;
                            left: vws(16);
                            width: vws(56);
                            height: vws(56);
                        }
                    }
                    &.lock-on {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: rgba(0, 0, 0, 0.6);
                        .icon {
                            width: vws(38);
                            height: vws(38);
                        }
                    }
                }
                .sign {
                    position: absolute;
                    top: 0;
                    left: vws(20);
                    z-index: 10;
                    width: vws(44);
                    height: vws(44);
                }
            }
            .title {
                display: inline-block;
                overflow: hidden;
                max-width: vws(320);
                font-size: vws(30);
                font-weight: 500;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                line-height: vws(42);
            }
        }
    }
    .no-list {
        display: flex;
        justify-content: center;
        align-items: center;
        .img {
            width: vws(326);
            height: vws(254);
        }
    }
}
</style>
