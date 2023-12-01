<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name" />
    </router-view>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store';
import { mtOnBeforeClosePage, mtExitMiniProgram } from '@/helpers/trans';
const router = useRouter();
const route = useRoute();
const handleClose = () => {
    mtOnBeforeClosePage(() => {
        const { name, query } = route as any;
        if (query.external) {
            router.push({ path: '/find' });
        } else if (['find', 'class', 'my'].includes(name)) {
            mtExitMiniProgram();
        } else {
            router.back();
        }
    });
};
watch(
    () => store.state.openId,
    () => {
        handleClose();
    }
);
</script>

<style lang="scss">
@import './assets/sass/common';
body {
    margin: 0 auto !important;
    max-width: 750px;
    background-color: #fff;
}
</style>
