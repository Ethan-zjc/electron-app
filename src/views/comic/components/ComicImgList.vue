<template>
    <div class="imglist">
        <div
            class="block"
            v-for="item in props.imgList"
            :style="`height: ${item.height}px`"
            :key="item.key"
        >
            <img v-lazy="item.image_url" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ComicImgListInter } from '@/typings/comic';
const props = defineProps({
    imgList: {
        type: Array as () => Partial<ComicImgListInter>[],
        default: () => [],
    },
});
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.imglist {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: column;
    flex-wrap: wrap;
    .block {
        display: flex;
        font-size: 0;
        line-height: 0;
    }
    img {
        display: block;
        width: 100%;
        flex: 1;
        // object-fit: fill;
    }
}
</style>
