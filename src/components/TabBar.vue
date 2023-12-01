<template>
    <div class="footer">
        <div class="footer-row">
            <div
                class="footer-cell"
                v-for="item in list"
                :key="item.id"
                @click="handleSwitch(item)"
            >
                <img
                    class="icon"
                    :src="
                        require(`@/assets/img/icons/tab-${item.type}${
                            item.id == active ? '-active' : ''
                        }.png`)
                    "
                />
                <p class="text">{{ item.title }}</p>
            </div>
        </div>
        <div class="place" v-if="iPhoneX"></div>
    </div>
    <div class="footer-placeholder" :class="iPhoneX ? 'footer-placeholder-iphone' : ''"></div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { TabBarType } from '@/types';
const store = useStore();
const router = useRouter();
defineProps({
    active: {
        type: Number,
        default: 0,
    },
});
const iPhoneX = computed(() => {
    return store.state.iPhoneX;
});
const defaultData = [
    {
        id: 0,
        type: 'class',
        title: '分类',
    },
    {
        id: 1,
        type: 'find',
        title: '发现',
    },
    {
        id: 2,
        type: 'my',
        title: '书架',
    },
];
const list = ref<Array<TabBarType> | []>(defaultData);
const handleSwitch = (row: TabBarType) => {
    router.push({ path: `/${row.type}` });
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.footer {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 997;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    background-color: #fff;
    &-row {
        display: flex;
        justify-content: space-around;
        height: vws(98);
    }
    &-cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon {
            display: block;
            overflow: hidden;
            width: vws(54);
            height: vws(54);
        }
        .text {
            margin-top: vws(4);
            font-size: vws(20);
            font-family: 'PingFang SC';
            font-weight: 400;
            text-align: center;
            color: #222;
            font-style: normal;
            line-height: vws(20);
        }
    }
    .place {
        overflow: hidden;
        width: 100%;
        height: vws(48);
    }
}
.footer-placeholder {
    width: 100%;
    height: vws(98);
    overflow: hidden;
    &-iphone {
        height: vws(146);
    }
}
</style>
