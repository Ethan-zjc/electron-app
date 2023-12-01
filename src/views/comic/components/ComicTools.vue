<template>
    <div class="tools-bar">
        <div class="item" v-for="(item, index) in toolArry" :key="index" @click="itemClick(index)">
            <img
                class="icon"
                :src="
                    index == 3
                        ? comicImgs[`${props.follows[props.topicId] ? 'followed' : 'follow'}`]
                        : item.icon
                "
            />
            <span class="txt">{{ item.text }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { comicImgs } from '@/assets/js/cdn';

const emit = defineEmits(['handleToolsCallback']);
const props = defineProps({
    topicId: {
        type: Number,
        default: 0,
    },
    follows: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const toolArry = ref([
    {
        text: '上一话',
        icon: comicImgs['pre'],
    },
    {
        text: '目录',
        icon: comicImgs['catalog'],
    },
    {
        text: '下一话',
        icon: comicImgs['next'],
    },
    {
        text: '关注',
        icon: comicImgs['follow'],
    },
    {
        text: '详情',
        icon: comicImgs['tools-detail'],
    },
]);
const itemClick = (index: number) => {
    emit('handleToolsCallback', index);
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';

.tools-bar {
    position: fixed;
    bottom: 0;
    left: 50%;
    z-index: 199;
    display: flex;
    width: 100%;
    max-width: vws(750);
    height: vws(96);
    transform: translateX(-50%);
    background-color: white;
    box-shadow: 0 -1px 0 0 #e6e6e6;
    .item {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
        flex-direction: column;
        .icon {
            width: vws(48);
            height: vws(48);
        }
        .txt {
            font-size: vws(20);
            font-weight: bold;
        }
    }
}
</style>
