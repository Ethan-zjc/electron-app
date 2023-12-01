<template>
    <NavBar title="设置" />
    <div class="setting" @click="openDebug">
        <div class="setting-list">
            <div v-for="(item, index) in list" :key="index">
                <div
                    class="list-item"
                    @click="handleAction(item.type)"
                    v-if="item.type !== CLEAR_STORAGE || enableDebug"
                >
                    <p class="text">{{ item.title }}</p>
                    <img
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/item-btn_96f6c65.png"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ListType } from './types';
import { utilAction, utilShowToast } from '@/helpers/utils';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const router = useRouter();

const JUMP_PAGE = 1;
const CLEAR_STORAGE = 2;

const data = [
    {
        title: '相关许可证',
        type: JUMP_PAGE,
    },
    {
        title: '一键清除缓存',
        type: CLEAR_STORAGE,
    },
];
const list = ref<Array<ListType> | []>(data);
const enableDebug = ref<boolean>(false);
const versionClickTime = ref<number>(0);
const versionClickCount = ref<number>(0);

const handleAction = (type: number) => {
    if (type === JUMP_PAGE) {
        router.push({ path: '/licence' });
    }
    if (type === CLEAR_STORAGE) {
        localStorage.clear();

        utilShowToast({
            title: '清除成功',
            type: 'success',
        });

        setTimeout(() => {
            utilAction({
                type: 15,
            });
        }, 1500);
    }
};

const openDebug = () => {
    // 监听每隔200ms之内连续点击10次版本号，触发debug模式
    const now = Date.now();

    if (enableDebug.value) return false;

    if (versionClickCount.value > 8) {
        enableDebug.value = true;
        return false;
    }

    if (!versionClickTime.value || now - versionClickTime.value < 1000) {
        versionClickCount.value++;
        versionClickTime.value = now;
    } else {
        versionClickCount.value = 0;
        versionClickTime.value = 0;
    }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.setting {
    min-height: 100vh;
    background: #fafafa;
    &-list {
        padding-top: vws(16);
    }
    .list-item {
        display: flex;
        align-items: center;
        padding: 0 vws(32);
        height: vws(112);
        background: #fff;
        .text {
            overflow: hidden;
            font-size: vws(32);
            font-family: PingFangSC-Regular, 'PingFang SC';
            font-weight: 400;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #303030;
            flex: 1;
        }
        img {
            width: vws(32);
            height: vws(32);
        }
    }
}
</style>
