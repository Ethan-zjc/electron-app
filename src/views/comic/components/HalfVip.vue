<template>
    <div class="vip-body {{ popType == 2 ? 'vip-limit' : 'vip-enjoy' }}">
        <!-- title -->
        <div class="title">
            <template
                v-for="(item, index) in popType == 2
                    ? props.vipData.suggestTitle
                    : props.vipData.vipTitle"
                :key="index"
            >
                <span v-if="index % 2 == 0">{{ item }}</span>
                <span v-else class="color">{{ item }}</span>
            </template>
        </div>

        <!-- conten区分三种情况、会员免费、提前看、限免 -->
        <!-- 限免 -->
        <div class="limit-view" v-if="popType == 2">
            <div class="hidden-scrollbar">
                <div class="scroll-view-x">
                    <div
                        class="list-view"
                        v-for="(item, index) in props.vipData.vipTopicList"
                        :key="index"
                    >
                        <div class="img">
                            <img class="img-cover" :src="item.image" />
                        </div>
                        <span class="name">{{ item.title }}</span>
                        <span class="tag">{{ item.icon_text }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="free-view" v-else>
            <img class="pic" :src="props.vipData.coverUrl" />
            <span class="txt">{{ props.vipData.topicTitle }}</span>
        </div>

        <!-- 按钮 -->
        <div class="btn" @click="actionVip">
            <div v-if="props.vipData.btnLeftText?.length" class="now">
                <template v-for="(item, index) in props.vipData.btnLeftText" :key="index">
                    <span v-if="index % 2 == 0">{{ item }}</span>
                    <span v-else class="color">{{ item }}</span>
                </template>
            </div>
            <div v-else class="now">
                <span>开通特惠</span>
            </div>
            <div class="ori">
                <template v-for="(item, index) in props.vipData.originalPrice" :key="index">
                    <span v-if="index % 2 != 0" class="del">{{ item }}</span>
                </template>
            </div>
            <span class="bubble" v-if="props.vipData.bubbleText">
                {{ props.vipData.bubbleText }}
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { utilAction } from '@/helpers/utils';
import { HalfVipDataInter } from '@/typings/comic';

const props = defineProps({
    vipData: {
        type: Object as () => Partial<HalfVipDataInter>,
        default: () => {
            return {};
        },
    },
    popType: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(['handleActionVip']);

const actionVip = () => {
    emit('handleActionVip');
    utilAction({ type: 44 });
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-body {
    // padding: vws(34) 0 vws(60) 0;
    &.vip-limit {
        padding: vws(0) 0 vws(10);
        background: #fff;
    }
}
.title {
    display: flex;
    justify-content: center;
    margin: vws(9) 0 vws(39);
    span {
        display: inline-block;
        font-size: vws(36);
        font-family: PingFangSC-Medium, 'PingFang SC';
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: vws(36);
        &.color {
            color: #5b29f4;
        }
    }
}
.limit-view {
    width: 100%;
    .hidden-scrollbar {
        overflow: hidden;
        width: 100%;
        height: vws(175);
    }
    .scroll-view-x {
        overflow-x: scroll;
        width: 100%;
        height: vws(188);
        white-space: nowrap;
        .list-view {
            position: relative;
            display: inline-block;
            margin-right: vws(20);
            width: vws(110);
            .img {
                overflow: hidden;
                width: vws(110);
                height: vws(133);
                border-radius: vws(8);
            }
        }
        .list-view:first-child {
            margin-left: vws(60);
        }
        .name {
            display: block;
            overflow: hidden;
            margin-top: vws(20);
            width: 100%;
            font-size: vws(22);
            text-overflow: ellipsis;
            white-space: nowrap;
            color: rgba(128, 128, 128, 1);
            line-height: vws(24);
        }
        .tag {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 2;
            padding: 0 vws(4);
            font-size: vws(20);
            border-radius: 0 0 0 vws(8);
            color: rgba(255, 255, 255, 1);
            background: rgba(0, 0, 0, 1);
            opacity: 0.7;
            line-height: vws(28);
            border-top-right-radius: vws(4);
            border-bottom-left-radius: vws(4);
        }
    }
}
.free-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    .pic {
        width: vws(240);
        height: vws(148);
        border-radius: vws(12);
    }
    .txt {
        overflow: hidden;
        margin-top: vws(12);
        max-width: vws(500);
        font-size: vws(28);
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
        line-height: vws(40);
    }
}
.btn {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: vws(48) auto vws(32);
    width: vws(646);
    height: vws(118);
    border-radius: vws(56);
    background: #ffe120;
    flex-direction: column;
    .now {
        font-size: vws(32);
        font-weight: bold;
        color: #222;
        line-height: vws(40);
    }
    .ori {
        margin-top: vws(4);
        font-size: vws(24);
        text-decoration: line-through;
        color: rgba(34, 34, 34, 0.5);
        line-height: vws(30);
    }
    .bubble {
        position: absolute;
        top: vws(-8);
        right: vws(0);
        padding: 0 vws(12);
        // width: vws(118);
        height: vws(34);
        font-size: vws(18);
        font-weight: 500;
        border-radius: vws(15) vws(15) vws(15) vws(4);
        text-align: center;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(90deg, rgba(255, 37, 127, 1) 0%, rgba(255, 0, 71, 1) 100%);
        line-height: vws(34);
    }
}
</style>
