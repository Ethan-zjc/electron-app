<template>
    <NavBar title="相关许可证" />
    <div class="setting">
        <div class="setting-list">
            <div
                class="list-item"
                v-for="(item, index) in list"
                :key="index"
                @click="handleAction(item)"
            >
                <p class="text">{{ item.title }}</p>
                <img
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/item-btn_96f6c65.png"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ListType } from './types';
const router = useRouter();
const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const data = [
    { title: '增值电信业务经营许可证', type: 'servicelicense.jpg' },
    { title: '网络文化经营许可证', type: 'culture.png' },
    { title: '营业执照', type: 'businesslicense.png' },
    { title: '出版物经营许可证', type: 'publicationlicense.jpg' },
    { title: '互联网药品信息服务资格证', type: 'druglicense.png' },
    { title: '食品经营许可证', type: 'foodlicense.png' },
];
const list = ref<Array<ListType> | []>(data);
const handleAction = (item: ListType) => {
    router.push({
        path: '/licence-detail',
        query: { type: item.type, title: item.title },
    });
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
