<template>
    <div class="vip-lists">
        <div class="head">
            <div class="title">{{ props.title }}</div>
        </div>
        <div class="heddenbar">
            <div class="list">
                <div
                    :class="{ topic: true, 'first-item': !index }"
                    v-for="(item, index) in props.lists"
                    :key="index"
                    @click="actionTap(item)"
                >
                    <div class="cover">
                        <img class="cover-img" :src="item.cover_image" />
                        <image
                            v-if="props.type == 2"
                            class="play"
                            src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/vip-center/play_26f9512.png"
                        />
                    </div>
                    <div class="title">{{ item.title }}</div>
                    <img
                        class="top-icon"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/vip-center/label_95b2607.png"
                    />
                </div>
            </div>
        </div>
        <div class="progress">
            <div class="prog">
                <!-- TODO -->
                <!-- <progress
                    class="info"
                    border-radius="46"
                    percent="{{ percent }}"
                    activeColor="#775BFA"
                    color="#F7F5FF"
                    active
                    stroke-width="4"
                    active-mode="forwards"
                    duration="10"
                ></progress> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TopicItemDataInter } from '@/typings/vip-center';

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    lists: {
        type: Array as () => TopicItemDataInter[],
        default: () => [],
    },
    type: {
        type: Number,
        default: 1,
    },
});
const emit = defineEmits(['handleActionTap']);

const actionTap = (item: TopicItemDataInter) => {
    emit('handleActionTap', item);
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-lists {
    margin-top: vws(32);
    width: 100%;
    .head {
        display: flex;
        align-items: center;
        padding-left: vws(24);
        width: 100%;
        height: vws(88);
        box-sizing: border-box;
        .title {
            overflow: hidden;
            width: 100%;
            font-size: vws(30);
            font-weight: bold;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #222;
        }
    }
    .heddenbar {
        overflow-x: scroll;
        overflow-y: hidden;
        width: 100%;
        height: vws(322);
        white-space: nowrap;
    }
    .list {
        height: vws(350);
        .stick {
            width: vws(24);
            height: 100%;
        }
        .topic {
            position: relative;
            display: inline-block;
            margin-right: vws(16);
            width: vws(200);
            height: vws(352);
            &.first-item {
                margin-left: vws(24);
            }
            .cover {
                position: relative;
                overflow: hidden;
                border-radius: vws(12);
                &-img {
                    width: vws(200);
                    height: vws(268);
                }
            }
            .play {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 4;
                width: vws(56);
                height: vws(56);
                transform: translateX(-50%) translateY(-50%);
            }
            .title {
                overflow: hidden;
                margin-top: vws(12);
                width: 100%;
                font-size: vws(28);
                font-weight: 500;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #222;
                line-height: vws(34);
            }
            .labels {
                overflow: hidden;
                margin-top: vws(8);
                width: 100%;
                height: vws(30);
                // text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
                line-height: vws(30);
                .label {
                    margin-right: vws(8);
                    font-size: vws(24);
                    color: #999;
                }
            }
            .top-icon {
                position: absolute;
                top: vws(12);
                right: vws(12);
                z-index: 1;
                width: vws(88);
                height: vws(32);
            }
        }
    }
    .progress {
        display: flex;
        justify-content: center;
        margin-top: vws(30);
        .prog {
            overflow: hidden;
            width: vws(90);
            height: vws(8);
            border-radius: vws(16);
        }
        .info {
            width: vws(90);
        }
    }
}
::-webkit-scrollbar {
    display: none;
}
</style>
