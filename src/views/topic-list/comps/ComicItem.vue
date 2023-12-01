<template>
    <div class="topic-item" @click="handleActive">
        <div class="pic">
            <img class="img" :src="item.url" />
        </div>
        <div class="info">
            <div class="info-top">
                <div class="title">
                    <span>{{ item.title }}</span>
                </div>
                <div class="like" @click.stop="handleFav">
                    <div class="like-active" v-if="isFav">
                        <span>已关注</span>
                    </div>
                    <div class="like-center" v-else>
                        <span>关注</span>
                    </div>
                </div>
            </div>
            <div class="des" v-if="item.subtitle">
                <span>{{ item.subtitle }}</span>
            </div>
            <div class="tags" v-if="item.category">
                <div class="tags-item" v-for="tag in item.category" :key="tag">
                    <span>{{ tag }}</span>
                </div>
            </div>
            <div class="putaway" v-if="item.publishTime">
                <span>{{ item.publishTime }}</span>
            </div>
            <div class="fav">
                <span class="fav-active">{{ item.favCount }}</span>
                <span>关注</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { utilAction } from '@/helpers/utils';
import { utilHandleFollow } from '@/helpers/behaviors';
import { useStore } from 'vuex';
const store = useStore();
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
    follows: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const isFav = computed(() => {
    const { follows } = store.state;
    const id = props.item.id;
    return follows[id] || false;
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
const handleFav = () => {
    utilHandleFollow({
        id: props.item.id,
    });
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.topic-item {
    padding: vws(48) vws(24) vws(16);
    width: 100%;
    box-sizing: border-box;
    display: flex;
    .pic {
        flex-shrink: 0;
        width: vws(200);
        height: vws(265);
        border-radius: vws(12);
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .info {
        flex: 1;
        min-width: 0;
        padding-left: vws(24);
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &-top {
            padding-top: vws(4);
            height: vws(52);
            display: flex;
        }
    }
    .title {
        flex: 1;
        min-width: 0;
        height: vws(48);
        line-height: vws(48);
        margin-right: vws(10);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: PingFangSC-Medium, PingFang SC;
            font-size: vws(32);
            color: #333333;
            font-weight: 500;
        }
    }
    .like {
        flex-shrink: 0;
    }
    .like-center {
        display: flex;
        align-items: center;
        justify-content: center;
        height: vws(48);
        border-radius: vws(100);
        width: vws(96);
        border: 1px solid #e6e6e6;
        span {
            font-weight: 400;
            font-size: vws(22);
            color: #333;
        }
    }
    .like-active {
        display: flex;
        align-items: center;
        justify-content: center;
        height: vws(48);
        border-radius: vws(100);
        width: vws(96);
        background-color: #f7f9fa;
        border: 1px solid #f7f9fa;
        span {
            font-weight: 400;
            font-size: vws(22);
            color: #ccc;
        }
    }
    .des {
        height: vws(30);
        line-height: vws(30);
        margin-top: vws(22);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #999999;
        span {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            font-size: vws(24);
            color: #999999;
        }
    }
    .tags {
        display: flex;
        flex-wrap: wrap;
        padding-top: vws(10);
        .tags-item {
            background-color: #f2f2f2;
            border-radius: vws(22);
            font-size: vws(20);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            padding: 0 vws(16);
            margin-right: vws(16);
            white-space: nowrap;
            height: vws(40);
            line-height: vws(40);
            margin-top: vws(10);
            span {
                font-size: vws(20);
                color: #666666;
            }
        }
    }
    .fav {
        height: vws(44);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        position: absolute;
        bottom: 0;
        left: vws(24);
        display: flex;
        align-items: center;
        span {
            font-size: vws(22);
            color: #999999;
        }
        .fav-active {
            font-size: vws(28);
            color: #333;
            font-weight: 500;
            padding-right: vws(4);
        }
    }
    .putaway {
        height: vws(44);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        position: absolute;
        bottom: 0;
        left: vws(24);
        display: flex;
        align-items: center;
        span {
            font-size: vws(22);
            color: #999999;
        }
    }
}
</style>
