<template>
    <!-- 顶部图 -->
    <div class="top-img">
        <img class="cover-banner" :src="props.baseInfo.banner" />

        <!-- 浮层 -->
        <div class="super">
            <div class="contain">
                <div class="left">
                    <div class="title">{{ baseInfo.topicTit }}</div>
                    <div class="desc">
                        <span
                            class="txt"
                            v-for="(item, index) in ['popular', 'comment', 'follow']"
                            :key="item"
                        >
                            {{ baseInfo[item] || 0
                            }}{{ index == 0 ? '人气值' : index == 1 ? '总评论' : '关注' }}
                        </span>
                    </div>
                </div>
                <div class="right">
                    <div
                        :class="{ follow: true, followed: follows[props.topicId] }"
                        @click="followClick"
                    >
                        <span>{{ follows[props.topicId] ? '已关注' : '+关注' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 简介 -->
    <div class="new-about">
        <div class="lables">
            <span v-for="(item, index) in props.baseInfo.tags" :key="index">{{ item }}</span>
        </div>
        <div class="body">
            <!-- <TextEllipsis
                rows="3"
                :content="props.baseInfo.intro"
                expand-text="展开"
                collapse-text="收起"
            /> -->
            <span id="toggle-content">{{ props.baseInfo.intro }}</span>
        </div>
        <div class="author">
            <div class="author-list">
                <div class="single" v-for="item in props.baseInfo.authors" :key="item">
                    <img class="avatar" :src="item.avatar_url" />
                    <span class="name">{{ item.nickname }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { utilHandleFollow } from '@/helpers/behaviors';
import { track } from '@/helpers/kksa';
// import { TextEllipsis } from 'vant';
const props = defineProps({
    topicId: {
        type: Number,
        default: 0,
    },
    baseInfo: {
        type: Object,
        default: null,
    },
});
const router = useRouter();
const store = useStore();
const follows = store.state.follows;

const trackEvent = (name: string) => {
    const options = {
        ButtonName: name,
    };
    track('TopicPageClk', options);
};
const followClick = () => {
    if (!store.state.userId) {
        router.push({ path: '/login' });
        return false;
    }
    // 执行关注操作
    utilHandleFollow({
        id: props.topicId,
    }).then((res) => {
        if (res) {
            trackEvent('关注');
        } else {
            trackEvent('取消关注');
        }
    });
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';

.top-img {
    position: relative;
    width: 100%;
    height: vws(455);
    .cover-banner {
        width: 100%;
        height: 100%;
    }
    .super {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: vws(280);
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
        filter: blur(0);
        .contain {
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: vws(24);
            width: 100%;
            max-height: vws(280);
            box-sizing: border-box;
        }
        .left {
            flex: 1;
            flex-wrap: nowrap;
            overflow: hidden;
            padding-right: vws(24);
            box-sizing: border-box;
            .title {
                font-size: vws(36);
                font-weight: 500;
                color: #fff;
                line-height: vws(50);
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
            }
            .desc {
                margin-top: vws(12);
                height: vws(38);
            }
            .txt {
                display: inline-block;
                font-size: vws(26);
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #fff;
                line-height: vws(38);
                vertical-align: top;
                &:nth-of-type(1),
                &:nth-of-type(2) {
                    &::after {
                        display: inline-block;
                        margin: 0 vws(16);
                        width: vws(2);
                        height: vws(16);
                        text-align: center;
                        background: rgba(255, 255, 255, 0.6);
                        content: '';
                    }
                }
            }
        }
        .right {
            display: flex;
            align-items: center;
            width: vws(114);
            height: 100%;
            .follow {
                width: vws(114);
                height: vws(54);
                font-size: vws(26);
                font-weight: bold;
                border-radius: vws(52);
                // padding: 10) 26);
                text-align: center;
                color: #442509;
                background: #fde23d;
                line-height: vws(54);
            }
            .followed {
                font-weight: 500;
                border-radius: vws(28);
                color: rgba(255, 255, 255, 0.8);
                background: rgba(255, 255, 255, 0.3);
            }
        }
    }
}
.new-about {
    padding: vws(32) vws(24);
    box-sizing: border-box;
    .lables {
        overflow-x: scroll;
        margin-bottom: vws(24);
        width: 100%;
        max-height: vws(40);
        white-space: nowrap;
        span {
            display: inline-block;
            margin-right: vws(16);
            padding: vws(0) vws(16);
            width: auto;
            font-size: vws(24);
            border-radius: vws(22);
            text-align: center;
            color: #333;
            background: #f5f5f5;
            vertical-align: top;
            box-sizing: border-box;
            line-height: vws(41);
        }
    }
    .body {
        position: relative;
        font-size: vws(26);
        text-align: justify;
        color: #333;
        line-height: vws(42);
        span {
            display: block;
            overflow: hidden;
        }
        .expand {
            max-height: vws(84);
            &::after {
                position: absolute;
                right: 0;
                bottom: vws(0);
                display: block;
                width: vws(120);
                height: vws(42);
                font-size: vws(26);
                text-align: right;
                color: #999;
                background: -webkit-gradient(
                    linear,
                    left top,
                    right top,
                    from(rgba(255, 255, 255, 0)),
                    to(rgba(255, 255, 255, 1)),
                    color-stop(0.45, #fff)
                );
                content: '更多';
                line-height: vws(42);
            }
        }
    }
    .author {
        overflow: hidden;
        margin-top: vws(16);
        height: vws(40);
        .author-list {
            width: 100%;
            height: vws(52);
            white-space: nowrap;
        }
        .single {
            display: inline-block;
            margin-right: vws(40);
        }
        .avatar {
            display: inline-block;
            margin-right: vws(12);
            vertical-align: top;
            width: vws(40);
            height: vws(40);
            border-radius: 50%;
        }
        .name {
            display: inline-block;
            font-size: vws(26);
            color: #999;
            line-height: vws(40);
            vertical-align: top;
        }
    }
}
::-webkit-scrollbar {
    display: none;
}
</style>
