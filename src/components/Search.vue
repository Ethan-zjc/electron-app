<template>
    <div class="search">
        <div :style="`width:100%;height:${topBarOffset / 100}rem`"></div>
        <div class="search-content" :style="`height:${topBarHei / 100}rem;`">
            <img src="@/assets/img/logo.png" class="logo" />
            <div class="search-box">
                <img
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/search_12beece.png"
                    class="icon"
                />
                <div class="search-list">
                    <NoticeBar
                        class="search-notice"
                        color="#999"
                        background="none"
                        :scrollable="false"
                    >
                        <Swipe
                            vertical
                            class="notice-swipe"
                            :autoplay="3000"
                            :touchable="false"
                            :show-indicators="false"
                        >
                            <SwipeItem
                                class="notice-swipe-item"
                                v-for="(item, index) in list"
                                :key="item"
                                @click="handleSearch(index)"
                            >
                                {{ item }}
                            </SwipeItem>
                        </Swipe>
                    </NoticeBar>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { NoticeBar, Swipe, SwipeItem } from 'vant';
import { rqs } from '@/helpers/request';
const DEF_HOT = '搜索作品名';
const router = useRouter();
const store = useStore();

const list = ref<Array<string> | []>([]);
const searchWord = ref<string>('');
const topBarOffset = computed(() => {
    return store.state.topBarOffset;
});
const topBarHei = computed(() => {
    return store.state.topBarHei;
});

const handleSearch = (index: number) => {
    const item = list.value[index];
    const value = item ? item.split('|')[0] : DEF_HOT;
    router.push({ path: '/search', query: { holder: value.trim() } });
};

const defHot = () => {
    list.value = [DEF_HOT];
    searchWord.value = DEF_HOT;
};

const initData = async () => {
    const { code, hits = {} } = await rqs({
        url: '/search/mini/hot_word',
        host: 'search',
        data: {
            page: 1,
            size: 100,
        },
    });
    if (code != 200) {
        defHot();
        return false;
    }
    const { hot_word: backhotword = [] } = hits;
    const hotwords = [];
    for (let i = 0; i < backhotword.length; i++) {
        if (i % 2 === 0) {
            if (i + 1 < backhotword.length) {
                backhotword[i].target_title += ' | ' + backhotword[i + 1].target_title;
            }
            hotwords.push(backhotword[i].target_title);
        }
    }
    if (hotwords.length > 0) {
        list.value = hotwords;
        searchWord.value = hotwords[0].split('|')[0];
    } else {
        defHot();
    }
};
initData();
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.search {
    position: relative;
    width: 100%;
    left: 0;
    top: 0;
    background: #fff;
    .search-content {
        overflow: hidden;
        display: flex;
        align-items: center;
        padding-bottom: vws(12);
        box-sizing: border-box;
        .logo {
            flex-shrink: 0;
            width: vws(54);
            height: vws(54);
            margin-left: vws(24);
        }
    }
    .search-box {
        // flex-grow: 1;
        position: relative;
        margin-left: vws(24);
        margin-right: vws(24);
        background-color: #f7f9fa;
        border-radius: vws(32);
        padding: 0 vws(18);
        height: 100%;
        max-height: vws(64);
        display: flex;
        align-items: center;
        width: vws(380);
        &-hover {
            opacity: 0.8;
        }
        .icon {
            position: absolute;
            left: vws(18);
            width: vws(36);
            height: vws(36);
            top: 50%;
            margin-top: vws(-18);
        }
    }
    .search-list {
        position: relative;
        margin-left: vws(54);
        height: vws(64);
        width: 100%;
    }
    .search-notice {
        height: vws(64);
        padding: 0;
    }
    .notice-swipe {
        height: vws(64);
        &-item {
            line-height: vws(64);
            font-size: vws(26);
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            white-space: nowrap;
        }
    }
}
</style>
