<template>
    <div class="find-nav">
        <div
            v-for="(item, index) in list"
            :key="index"
            class="nav-item"
            @click="handleAction(item)"
        >
            <div class="nav-item-cell">
                <img :src="item.image" />
                <span class="text">{{ item.title }}</span>
            </div>
            <div class="nav-item-line" v-if="index + 1 < list.length"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FindNavType } from '../types';
import jointImageSuffix from '@kk/image-format';
import { utilAction } from '@/helpers/utils';
const emits = defineEmits(['onTrack']);
const props = defineProps({
    params: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const list = ref<Array<FindNavType> | []>([]);
const initData = () => {
    const { banner_list: bannerList = [] } = props.params;
    list.value = bannerList.map((item: any) => {
        const child = {
            id: item.id,
            title: item.title,
            image: jointImageSuffix({ src: item.image, width: 200 }),
            action: item.action_type || {},
        };
        emits('onTrack', {
            eventType: 'imp',
            moduleInfo: props.params,
            moreInfo: child,
        });
        return child;
    });
};
const handleAction = (row: FindNavType) => {
    const { action } = row;
    const { target_id: id, type = 0 } = action;
    emits('onTrack', {
        eventType: 'click',
        moduleInfo: props.params,
        moreInfo: row,
    });
    utilAction({
        type,
        id,
    });
};
initData();
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.find-nav {
    display: flex;
    justify-content: space-around;
    padding: 0 vws(24);
    .nav-item {
        width: vws(368);
        height: vws(112);
        display: flex;
        align-items: center;
        position: relative;
        &-cell {
            width: vws(368);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        img {
            width: vws(64);
            height: vws(64);
        }
        span.text {
            font-size: vws(28);
            color: #333;
            margin-left: vws(8);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: vws(168);
        }
        &-line {
            height: vws(28);
            width: 1px;
            background: #e1e1e1;
            border-radius: 50%;
            display: block;
        }
    }
}
</style>
