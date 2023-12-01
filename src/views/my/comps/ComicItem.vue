<template>
    <div class="comic-item">
        <div class="item-history" v-if="type == 'history'" @click.stop="handleActive">
            <div class="item-pic">
                <img class="label" :src="item.labelImage" v-if="item.labelImage" />
                <img class="img" :src="item.url" />
            </div>
            <div class="item-info">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-subtitle">{{ item.subtitle }}</p>
            </div>
        </div>
        <div class="item-follow" v-else @click.stop="handleActive">
            <div class="item-pic">
                <div class="bottom">{{ item.bottom }}</div>
                <img class="label" :src="item.labelImage" v-if="item.labelImage" />
                <img class="img" :src="item.url" />
            </div>
            <div class="item-info">
                <p class="item-title">{{ item.title }}</p>
                <p class="item-subtitle">
                    <span
                        class="icon"
                        :class="item.remindText != '已读' ? 'icon-blue' : ''"
                        v-if="item.remindText"
                    >
                        {{ item.remindText }}
                    </span>
                    <span class="text">{{ item.subtitle }}</span>
                </p>
            </div>
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
});
const handleActive = () => {
    const { action, id: topicId } = props.item;
    const { target_id: id, type = 0, parent_target_id: parentid = 0 } = action;
    utilAction({
        type: !id ? 2 : type,
        id: !id ? topicId : id,
        parentid,
    });
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.comic-item {
    .item-history {
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
    .item-follow {
        display: flex;
        flex-direction: column;
        margin: 0 vws(4);
        width: vws(355);
        height: vws(342);
        .item-pic {
            position: relative;
            display: flex;
            align-items: center;
            overflow: hidden;
            width: vws(355);
            height: vws(222);
            border-radius: vws(8);
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
            .icon {
                display: inline-block;
                min-width: vws(56);
                height: vws(32);
                line-height: vws(32);
                background: rgba(205, 205, 215, 0.2);
                border-radius: vws(7);
                font-size: vws(20);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(173, 173, 185, 1);
                text-align: center;
                margin-right: vws(8);
            }
            .icon-blue {
                background: rgba(240, 249, 254, 1);
                color: rgba(77, 173, 255, 1);
            }
        }
    }
}
</style>
