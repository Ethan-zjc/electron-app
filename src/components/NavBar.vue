<!-- 自定义导航组件
* {title} 标题
* {bgColor} 背景色，默认#fff，可选rgba、transparent等色值
* {position} 导航显示模式，默认sticky; 可选fixed、absolute等定位属性
* {whrite} 是否显示左侧白色返回箭头，默认false
* {isShowLeft} 是否显示左侧图标，默认true
* {isShowHome} 是否显示返回首页图标，默认false
* {isCustomBack} 是否自定义左侧图标点击事件
* 左侧点击回调：onBack
-->
<template>
    <div class="nav-bar" :style="`background-color:${bgColor};position:${position}`">
        <div :style="`width:100%;height:${topBarOffset / 100}rem`"></div>
        <div class="nav-bar-content" :style="`height:${topBarHei / 100}rem;`">
            <div class="left" v-if="isShowLeft">
                <div class="icon icon-whrite" @click="handleBack" v-if="whrite">
                    <img src="@/assets/img/nav-back-whrite.png" />
                </div>
                <div class="home" v-else-if="isShowHome">
                    <div class="icon icon-home" @click="handleBack">
                        <img src="@/assets/img/nav-home-back.png" />
                    </div>
                    <div class="icon icon-home" @click="handleHome">
                        <img src="@/assets/img/nav-home.png" />
                    </div>
                </div>
                <div class="icon icon-default" @click="handleBack" v-else>
                    <img src="@/assets/img/nav-back.png" />
                </div>
            </div>
            <div class="center">
                <span :class="{ title: true, color: whrite }">{{ title }}</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const store = useStore();
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    bgColor: {
        type: String,
        default: '#fff',
    },
    position: {
        type: String,
        default: 'sticky',
    },
    whrite: {
        type: Boolean,
        default: false,
    },
    isShowLeft: {
        type: Boolean,
        default: true,
    },
    isShowHome: {
        type: Boolean,
        default: false,
    },
    isCustomBack: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(['onBack']);
const topBarOffset = computed(() => {
    return store.state.topBarOffset;
});
const topBarHei = computed(() => {
    return store.state.topBarHei;
});
const handleHome = () => {
    if (props.isCustomBack) {
        emits('onBack', { type: 'home' });
    } else {
        router.push({ path: `/find` });
    }
};
const handleBack = () => {
    const { environment, isiOS } = store.state;
    const isDev = environment == 'dev';
    const query = route.query || {};
    if (props.isCustomBack) {
        emits('onBack', { type: 'back' });
    } else {
        if ((!isDev && isiOS) || query.external) {
            router.push({ path: `/find` });
        } else {
            router.go(-1);
        }
    }
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.nav-bar {
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
    background-color: #fff;
    &-content {
        position: relative;
        width: 100%;
        height: vws(88);
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: vws(12);
        box-sizing: border-box;
    }
    .left {
        display: flex;
        align-items: center;
        height: vws(64);
        padding: 0 vws(24);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        .home {
            display: flex;
            align-items: center;
            height: vws(64);
            flex-direction: row;
        }
        .icon {
            img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .icon-whrite {
            width: vws(44);
            height: vws(38);
        }
        .icon-default {
            width: vws(36);
            height: vws(36);
        }
        .icon-home {
            width: vws(44);
            height: vws(44);
            margin-right: vws(14);
        }
    }
    .center {
        width: 40%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        .title {
            font-size: vws(34);
            font-weight: 400;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #000000;
            &.color {
                color: #fff;
            }
        }
    }
}
</style>
