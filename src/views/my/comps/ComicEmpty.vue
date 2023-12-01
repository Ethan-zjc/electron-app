<template>
    <div class="comic-empty">
        <div class="empty-history" v-if="type == 'history'">
            <img
                class="empty-img"
                src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/error/nohistory_bc780bc.png"
            />
        </div>
        <div class="empty-follow" v-if="type == 'follow'">
            <img
                class="empty-img"
                src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/error/nofollow_98dfde5.png"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    type: {
        type: String,
        default: '',
    },
});
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.comic-empty {
    padding: 0 vws(24);
    width: vws(702);
    .empty-img {
        display: block;
        width: vws(500);
        height: vws(500);
        margin: 0 auto;
    }
}
</style>
