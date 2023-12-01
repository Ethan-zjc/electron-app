<template>
    <div class="find-banner">
        <Swipe class="swipe-pic" :autoplay="5000" :show-indicators="false" @change="handleChange">
            <SwipeItem v-for="item in list" :key="item.id">
                <div class="pic" @click="handleAction(item)">
                    <img :src="item.image" />
                </div>
            </SwipeItem>
            <template #indicator="{ active, total }">
                <div class="swipe-indicator">
                    <p
                        v-for="(item, index) in total"
                        :class="{ active: active == index }"
                        :key="index"
                    ></p>
                </div>
            </template>
        </Swipe>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Swipe, SwipeItem } from 'vant';
import { FindBannerType } from '../types';
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
const flag = ref([-1]);
const list = ref<Array<FindBannerType> | []>([]);
const initData = () => {
    const { banner_list: bannerList = [] } = props.params;
    list.value = bannerList.map((item: any) => {
        return {
            id: item.id,
            image: jointImageSuffix({ src: item.image, width: 750 }),
            action: item.action_type || {},
        };
    });
};

const handleChange = (index: number) => {
    if (!flag.value.includes(index)) {
        flag.value.push(index);
        emits('onTrack', {
            eventType: 'click',
            moduleInfo: props.params,
            moreInfo: list.value[index],
        });
    }
};

const handleAction = (row: FindBannerType) => {
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
.swipe-pic {
    margin: vws(8) vws(16) 0;
    width: vws(718);
    height: vws(404);
    overflow: hidden;
    border-radius: vws(12);
    .pic {
        position: relative;
        width: 100%;
        height: 100%;
        display: block;
        align-items: center;
        img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: cover;
        }
    }
    .swipe-indicator {
        position: absolute;
        left: 0;
        bottom: vws(26);
        width: 100%;
        z-index: 10;
        display: flex;
        justify-content: center;
        p {
            width: vws(15);
            height: vws(6);
            border-radius: 1px;
            overflow: hidden;
            margin: 0 vws(10);
            background: #fde23d;
        }
        p:not(.active) {
            background: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>
