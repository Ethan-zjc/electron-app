<template>
    <NavBar :title="title" />
    <div class="licence">
        <div class="licence-detail">
            <img v-if="imgUrl" :src="imgUrl" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
const { query = {} } = useRoute();
const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const imgUrl = ref<string>('');
const title = computed(() => {
    return (query.title as string) || '';
});
const typeUrl = computed(() => {
    return query.type || '';
});
onBeforeMount(() => {
    imgUrl.value = `https://festatic.v3mh.com/static-resource/img/remote/licence/${typeUrl.value}`;
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.licence {
    min-height: 100vh;
    background: #fafafa;
    &-detail {
        padding: vws(16);
        img {
            width: 100%;
        }
    }
}
</style>
