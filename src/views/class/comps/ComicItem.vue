<template>
    <div class="comic-item">
        <div class="item-pic" @click="handleActive">
            <div class="bottom" v-if="props.tagId !== 0">{{ item.bottom }}</div>
            <img class="img" :src="item.url" />
        </div>
        <div class="item-info" @click="handleActive">
            <p class="item-title">{{ item.title }}</p>
            <p class="item-subtitle">{{ sortId == 3 ? item.remindText : item.subtitle }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { utilAction } from '@/helpers/utils';
const props = defineProps({
    type: {
        type: String,
        default: '',
    },
    item: {
        type: Object,
        default: () => {
            return {};
        },
    },
    tagId: {
        type: Number,
        default: 0,
    },
    sortId: {
        type: Number,
        default: 0,
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
    flex-direction: column;
    margin: 0 vws(4);
    width: vws(234);
    height: vws(438);
    .item-pic {
        position: relative;
        display: flex;
        align-items: center;
        overflow: hidden;
        width: vws(234);
        height: vws(310);
        border-radius: vws(4);
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
        padding-top: vws(12);
        height: vws(78);
    }
    .item-title {
        overflow: hidden;
        font-size: vws(30);
        font-family: 'PingFang SC';
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #222;
        font-style: normal;
        line-height: vws(46);
    }
    .item-subtitle {
        overflow: hidden;
        font-size: vws(26);
        font-family: 'PingFang SC';
        font-weight: 400;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #999;
        font-style: normal;
        line-height: vws(36);
    }
}
</style>
