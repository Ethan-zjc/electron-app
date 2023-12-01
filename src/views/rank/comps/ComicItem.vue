<template>
    <div class="comic-item">
        <div class="item-pic" @click="handleActive">
            <div class="icon" :class="sort > 4 ? 'icon-4' : 'icon-' + sort">
                {{ sort }}
            </div>
            <div class="bottom" v-if="item.bottom">{{ item.bottom }}</div>
            <img class="img" :src="item.url" />
        </div>
        <div class="item-info" @click="handleActive">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-subtitle">{{ item.subtitle }}</p>
            <p class="item-label" v-if="item.labels.length">
                <span v-for="(child, index) in item.labels" :key="index">{{ child }}</span>
            </p>
            <p class="item-bottom">
                <img :src="item.rankIcon" />
                <span>{{ item.rankText }}</span>
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { utilAction } from '@/helpers/utils';
const props = defineProps({
    sort: {
        type: Number,
        default: 1,
    },
    item: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const handleActive = () => {
    const { action } = props.item;
    const { target_id: id, parent_target_id: parentid, type = 0 } = action;
    utilAction({
        type,
        id,
        parentid,
    });
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.comic-item {
    display: flex;
    width: 100%;
    height: vws(265);
    padding: vws(32) 0;
    .item-pic {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        width: vws(200);
        height: vws(265);
        border-radius: vws(6);
        flex-shrink: 0;
        .icon {
            position: absolute;
            width: vws(50);
            height: vws(50);
            left: 0;
            top: 0;
            z-index: 99;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            font-size: vws(28);
            font-weight: 600;
        }
        .icon-1 {
            background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-1_a66680c.png')
                no-repeat;
            background-size: cover;
        }
        .icon-2 {
            background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-2_c463541.png')
                no-repeat;
            background-size: cover;
        }
        .icon-3 {
            background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-3_ae2bdbb.png')
                no-repeat;
            background-size: cover;
        }
        .icon-4 {
            background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-4_76c1a88.png')
                no-repeat;
            background-size: cover;
        }
        .bottom {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            box-sizing: border-box;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 5;
            width: 100%;
            height: vws(56);
            padding: 0 vws(7);
            color: #fff;
            font-size: vws(22);
            text-shadow: 0px 1rpx 8rpx rgba(0, 0, 0, 0.24);
            background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.5) 100%);
        }
        .img {
            position: relative;
            z-index: 1;
            display: block;
            width: 100%;
            height: 100%;
        }
        .label {
            position: absolute;
            right: vws(8);
            top: vws(8);
            z-index: 5;
            height: vws(36);
            width: auto;
            display: block;
        }
    }
    .item-info {
        flex: 1;
        min-width: 0;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 vws(48) vws(12) vws(24);
    }
    .item-title {
        overflow: hidden;
        font-size: vws(32);
        font-family: 'PingFang SC';
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #222;
        font-style: normal;
        line-height: vws(48);
        margin-bottom: vws(6);
    }
    .item-subtitle {
        overflow: hidden;
        font-size: vws(24);
        font-family: 'PingFang SC';
        font-weight: 400;
        color: #999;
        font-style: normal;
        line-height: vws(28);
        height: vws(56);
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .item-label {
        display: flex;
        align-items: center;
        justify-items: center;
        padding-top: vws(20);
        width: 100%;
        height: vws(40);
        span {
            display: block;
            margin-right: vws(12);
            padding: 0 vws(8);
            height: vws(32);
            line-height: vws(32);
            border-radius: vws(2);
            border: 1px solid #cccccc;
            font-size: vws(24);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            overflow: hidden;
        }
    }
    .item-bottom {
        position: absolute;
        left: vws(24);
        bottom: vws(12);
        display: flex;
        align-items: center;
        justify-items: center;
        box-sizing: border-box;
        height: vws(20);
        img {
            width: vws(20);
            height: vws(20);
        }
        span {
            font-size: vws(20);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
        }
    }
}
</style>
