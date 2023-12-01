<template>
    <div>
        <div :class="{ [`title_${props.type}`]: true }">
            <template v-for="(item, index) in headData.text1" :key="index">
                <span v-if="index % 2 == 0" class="txt">{{ item }}</span>
                <span v-else class="txt color">{{ item }}</span>
            </template>
        </div>
        <div :class="{ [`desc_${props.type}`]: true }">
            <template v-for="(item, index) in headData.text2" :key="index">
                <span v-if="index % 2 == 0" class="txt">{{ item }}</span>
                <span v-else class="txt color">{{ item }}</span>
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import { inject } from 'vue';
import { HalfHeadDataInter } from '@/typings/comic';

const headData = inject('headData') as HalfHeadDataInter;
const props = defineProps({
    type: {
        type: Number,
        default: 0,
    },
});
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';
.title_0 {
    .txt {
        font-size: vws(34);
        color: rgba(255, 255, 255, 1);
    }
}
.desc_0 {
    .txt {
        font-size: vws(20);
        color: rgba(255, 255, 255, 1);
    }
}
.title_0,
.desc_0 {
    .color {
        color: #ffe23d;
    }
}
.title_1 {
    .txt {
        font-size: vws(36);
        color: rgba(255, 255, 255, 1);
        line-height: vws(48);
    }
}
.desc_1 {
    .txt {
        font-size: vws(28);
        color: rgba(255, 255, 255, 1);
        line-height: vws(34);
    }
}
.title_1,
.desc_1 {
    .color {
        color: rgba(172, 174, 255, 1);
    }
}

.title_2 {
    .txt {
        font-size: vws(32);
        font-family: PingFangSC-Medium, 'PingFang SC';
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: vws(32);
    }
}
.desc_2 {
    .txt {
        margin-top: vws(16);
        font-size: vws(24);
        font-family: PingFangSC-Medium, 'PingFang SC';
        color: rgba(255, 255, 255, 1);
        line-height: vws(24);
    }
}

.title_2,
.desc_2 {
    .color {
        color: rgba(255, 231, 81, 1);
    }
}
</style>
