<template>
    <div class="super-left">
        <div class="btn-home" v-if="!props.fullScreen" @click="goHomeFun">
            <span>返回首页</span>
            <img :src="comicImgs['tools-arrow']" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { comicImgs } from '@/assets/js/cdn';
const props = defineProps({
    fullScreen: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['handleHome']);
const goHomeFun = () => {
    emit('handleHome');
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';

.super-left {
    position: fixed;
    bottom: vws(190);
    left: vws(0);
    display: flex;
    justify-content: space-between;
    padding-bottom: vws(114);
    flex-direction: column;
    box-sizing: border-box;
    .btn-home {
        display: flex;
        align-items: center;
        padding: 0 vws(32) 0 vws(24);
        height: vws(60);
        border-radius: 0 vws(100) vws(100) 0;
        background: #ffe23d;
        box-shadow: 0 vws(8) vws(12) 0 rgba(0, 0, 0, 0.06);
        animation: backHome 0.3s 0.3s 1 normal both;
        img {
            width: vws(24);
            height: vws(24);
        }
        span {
            font-size: vws(26);
            font-family: PingFangSC-Medium, 'PingFang SC';
            font-weight: 500;
            color: #442509;
            line-height: vws(26);
        }
        &-hidden {
            opacity: 0;
        }
    }
}
</style>
