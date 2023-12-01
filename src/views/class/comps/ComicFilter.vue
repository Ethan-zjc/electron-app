<template>
    <div class="comic-filter" @click="handleFilterFav">
        <img
            src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/selection_ba8c102.png"
            v-if="filterFav"
        />
        <img
            src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/unchecked_2631ef0.png"
            v-else
        />
        <span>过滤已关注漫画</span>
    </div>
</template>
<script setup lang="ts">
const emits = defineEmits(['onTap']);
defineProps({
    filterFav: {
        type: Boolean,
        default: false,
    },
});
const handleFilterFav = () => {
    emits('onTap');
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.comic-filter {
    display: flex;
    align-items: center;
    padding: vws(32) vws(28);
    height: vws(34);
    span {
        padding-left: vws(8);
        height: vws(34);
        line-height: vws(34);
        font-size: vws(24);
        color: #999;
    }
    img {
        width: vws(32);
        height: vws(32);
    }
}
</style>
