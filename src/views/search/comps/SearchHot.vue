<template>
    <div class="searchnew-hot" style="flex-direction: column" v-if="hotsList.length">
        <div class="search-tit" style="align-items: center">
            <div class="title"><text>热门搜索</text></div>
            <div class="ico-clear" @click="hotExchange">
                <img
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/ico-refresh-new_4b2b423.png"
                />
            </div>
        </div>
        <div class="searchnew-hot-content" style="flex-wrap: wrap; justify-content: space-between">
            <div
                class="searchnew-hot-item"
                v-for="(item, index) in hotsList"
                :key="index"
                @click="jumpHot(item)"
            >
                <div class="searchnew-hot-img" style="flex-shrink: 0" v-if="item.url">
                    <img :src="item.url" />
                </div>
                <div class="searchnew-hot-info" style="flex-direction: column" v-if="item.url">
                    <span class="searchnew-hot-title">
                        {{ item.title }}
                    </span>
                    <span class="searchnew-hot-subtitle">
                        {{ item.count }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { getSearchHot } from '../api';
import jointImageSuffix from '@kk/image-format';
import { SearchHotType } from '../types';
import { utilAction } from '@/helpers/utils';
import { track } from '@/helpers/kksa';

const since = ref(0);
const hotsList = ref<Array<SearchHotType>>([]);

const jumpHot = (item: SearchHotType) => {
    const { action, title } = item;
    const { parent_target_id: parentid, type = 0 } = action;
    utilAction({
        type,
        parentid,
    });
    track('Search', {
        SearchSrc: 1,
        SearchKeyword: title,
    });
};

const getList = async () => {
    const { data } = await getSearchHot({
        since: since.value,
    });
    const { since: nextSince, hot_word = [] } = data || {};
    hotsList.value = hot_word.map((item: any) => {
        return {
            title: item.title || '',
            count: item.heat_count || '',
            url: jointImageSuffix({ src: item.cover_image_url, width: 200 }),
            action: item.action_type,
        };
    });
    since.value = nextSince || 0;
};

const hotExchange = () => {
    if (since.value >= 0) {
        getList();
    }
};

const initData = () => {
    getList();
};
onBeforeMount(() => {
    initData();
});
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.search-tit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: vws(24) 0;
    padding: 0 vws(24);
    height: vws(50);
    .title {
        flex: 1;
        span {
            font-size: vws(36);
            font-weight: 500;
            color: #333;
            line-height: vws(50);
        }
    }
    .ico-clear,
    .ico-refresh {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: vws(50);
        height: vws(50);
        img {
            width: vws(24);
            height: vws(24);
        }
    }
}
.searchnew-hot {
    padding-top: vws(24);
    &-content {
        padding: vws(12) vws(24) 0;
        display: flex;
    }
    &-item {
        width: vws(330);
        display: flex;
        margin-bottom: vws(32);
    }
    &-img {
        width: vws(100);
        height: vws(100);
        border-radius: vws(12);
        overflow: hidden;
        background-color: #eee;
        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &-info {
        display: flex;
        padding-left: vws(16);
        min-width: 0;
        flex: 1;
    }
    &-title {
        font-size: vws(30);
        color: #333;
        font-weight: 500;
        height: vws(42);
        line-height: vws(42);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &-subtitle {
        font-size: vws(26);
        color: #999;
        line-height: vws(38);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: vws(12);
    }
}
</style>
