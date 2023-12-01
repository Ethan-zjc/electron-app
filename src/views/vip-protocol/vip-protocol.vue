<template>
    <div class="protocol-container">
        <NavBar :title="pageTitle" />
        <Renew v-if="pageType == 'renew'" />
        <Serve v-if="pageType == 'serve'" />
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const Renew = defineAsyncComponent(() => import('./comps/Renew.vue'));
const Serve = defineAsyncComponent(() => import('./comps/Serve.vue'));

const { query } = useRoute();
const { type: PRO_TYPE = '' } = query as { [key: string]: string };
const typeMap: { [key: string]: string } = {
    renew: '快看漫画会员自动续费服务协议',
    serve: '快看漫画会员服务协议',
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
