<template>
    <div class="protocol-container">
        <NavBar :title="pageTitle" />
        <Private v-if="pageType == 'private'" />
        <Serve v-if="pageType == 'serve'" />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const Private = defineAsyncComponent(() => import('./comps/Private.vue'));
const Serve = defineAsyncComponent(() => import('./comps/Serve.vue'));

const { query } = useRoute();
const { type: PRO_TYPE = '' } = query;
const typeMap = {
    private: '隐私协议',
    serve: '用户服务协议',
};
const pageTitle = ref(typeMap[PRO_TYPE]);
const pageType = ref(PRO_TYPE);
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.class-container {
    overflow-y: scroll;
    height: 100vh;
    min-height: 100vh;
    background-color: #fff;
    .topic-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 vws(12);
    }
}
</style>
