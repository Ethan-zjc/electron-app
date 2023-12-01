<template>
    <div class="comic-bottom">
        <!-- 更新提示 -->
        <div class="hit" v-if="!!props.baseInfo.updateRemind">
            <span class="txt">{{ props.baseInfo.updateRemind }}</span>
            <img class="img" :src="comicImgs['comic_news_pen']" />
        </div>

        <!-- 上一话/下一话 -->
        <div class="page">
            <div class="up" @click.stop="actionPage('prev')">
                <img class="img" :src="require('@/assets/img/up-page.png')" />
                <span class="txt">上一话</span>
            </div>
            <div class="down" @click.stop="actionPage('next')">
                <span class="txt">下一话</span>
                <img class="img" :src="require('@/assets/img/down-page.png')" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { comicImgs } from '@/assets/js/cdn';
import { utilAction, utilShowToast } from '@/helpers/utils';
import { useRoute } from 'vue-router';
const route = useRoute();

const props = defineProps({
    baseInfo: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const emit = defineEmits(['handleBottomNext']);

const actionPage = (type: string) => {
    if ((type == 'prev' && !props.baseInfo.prevId) || (type == 'next' && !props.baseInfo.nextId)) {
        utilShowToast({
            title: type == 'prev' ? '没有上一话啦～' : '没有下一话啦～',
        });
        return;
    }
    const comicId = type == 'prev' ? props.baseInfo.prevId : props.baseInfo.nextId;
    const params = { autobuy: true };
    if (route.query.external) {
        Object.assign(params, { external: 1 });
    }
    emit('handleBottomNext');
    utilAction({ type: 3, id: comicId, redirect: true, params });
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';

.comic-bottom {
    padding-bottom: vws(100);
}
.hit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: vws(64) 0 0;
    width: 100%;
    .txt {
        margin-right: vws(8);
        font-size: vws(28);
    }
    .img {
        width: vws(44);
        height: vws(44);
    }
}
.bottom {
    display: flex;
    width: 100%;
    height: vws(170);
    .praise,
    .follow {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
        .img {
            width: vws(56);
            height: vws(56);
        }
        .txt {
            font-size: vws(24);
            font-weight: 500;
            color: #555;
            line-height: vws(34);
        }
        .count {
            margin-left: vws(6);
        }
    }
}

.page {
    display: flex;
    justify-content: space-between;
    margin: vws(48) 0;
    padding: 0 vws(24);
    width: 100%;
    height: vws(96);
    box-sizing: border-box;
    .up,
    .down {
        display: flex;
        justify-content: center;
        align-items: center;
        width: vws(342);
        height: vws(96);
        border-radius: vws(16);
        background: #f5f5f5;
        // flex: 1;
        .img {
            width: vws(24);
            height: vws(24);
        }
        .txt {
            height: vws(48);
            font-size: vws(24);
            font-weight: 500;
            color: #555;
            line-height: vws(48);
        }
    }
}
</style>
