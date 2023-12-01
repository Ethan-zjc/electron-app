<template>
    <NavBar title="404" />
    <div class="error-container">
        <div class="info">
            <span>未找到当前页面</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.error-container {
    min-height: 100vh;
    background: #fafafa;
    .info {
        padding: vws(20);
        span {
            overflow: hidden;
            font-size: vws(24);
            font-family: PingFangSC-Regular, 'PingFang SC';
            font-weight: 400;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303030;
            flex: 1;
        }
    }
}
</style>
