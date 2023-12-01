<template>
    <div class="pay-head">
        <!-- 顶部图片 -->
        <img v-if="props.popType == 1 || props.popType == 2" class="image" :src="images.comicpay" />

        <div :class="popType != 2 ? 'tips' : 'infos'" v-if="popType != 1" @click="openVip">
            <HalfHeadTxt :type="popType != 2 ? 2 : 1" />

            <img
                v-if="popType == 3 || popType == 4"
                class="image"
                :src="images[popType == 3 ? 'aheadLook' : 'vipFree']"
            />
        </div>
        <div class="text" v-else>
            <HalfHeadTxt :type="0" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const HalfHeadTxt = defineAsyncComponent(() => import('./HalfHeadTxt.vue'));
const props = defineProps({
    popType: {
        type: Number,
        default: 0,
    },
});
const emit = defineEmits(['handleActionVip']);
const prefix = 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/';
const images = {
    comicpay: `${prefix}pay/comicpay_8878a53.png`,
    aheadLook: `${prefix}vipdialog/vip-ahead_ab50cbb.png`,
    vipFree: `${prefix}vipdialog/vip-free_fd6e734.png`,
};
const openVip = () => {
    if (props.popType == 2) {
        emit('handleActionVip');
    }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';

.pay-head {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    .image {
        width: 100%;
    }
    .text {
        position: absolute;
        left: vws(98);
        z-index: 1;
        text-align: left;
        color: #fff;
    }
    // 会员限免
    .infos {
        position: absolute;
        left: vws(64);
        display: flex;
        align-items: center;
        overflow: hidden;
        overflow-y: scroll;
        padding-left: vws(30);
        width: vws(300);
        height: vws(140);
    }
    .tips {
        display: flex;
        justify-content: center;
        margin: auto;
        margin-bottom: vws(16);
        padding-left: vws(32);
        width: vws(718);
        height: vws(130);
        border-radius: vws(20);
        background: linear-gradient(90deg, rgba(6, 0, 27, 1) 0%, rgba(6, 0, 27, 0.6) 100%);
        flex-direction: column;
        box-sizing: border-box;
        img {
            position: absolute;
            right: 0;
            bottom: vws(-16);
            width: vws(360);
            height: vws(360);
        }
    }
}
</style>
