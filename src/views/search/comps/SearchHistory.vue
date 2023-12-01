<template>
    <div class="searchnew-history" style="flex-direction: column" v-if="list.length">
        <div class="search-tit" style="align-items: center">
            <div class="title"><text>搜索历史</text></div>
            <div class="ico-clear" @click="clearHistory">
                <img
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/ico-clear-new_7deba99.png"
                />
            </div>
        </div>
        <div class="searchnew-history-content" style="flex-wrap: wrap">
            <div class="searchnew-history-item" v-for="(item, index) in hisList" :key="index">
                <div class="tag" @click="clickHistory(item)">
                    <span>{{ item }}</span>
                </div>
            </div>
            <div class="searchnew-history-item" v-if="isShowMore" @click="clickMore">
                <div class="tag tag-more">
                    <img
                        class="ico-more"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/ico-more_c651c72.png"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { utilArrayArrange } from '@/helpers/utils';
const emits = defineEmits(['onClear', 'onSearch']);
const list = ref([]);
const maxNum = ref(6);
const isShowMore = ref(false);
const hisList = computed(() => {
    if (!isShowMore.value) {
        return list.value;
    } else {
        return list.value.slice(0, maxNum.value);
    }
});

const handleStorage = (key: string, value?: any) => {
    const name = 'searchHis';
    if (key == 'set') {
        localStorage.setItem(name, JSON.stringify(value));
    } else if (key == 'remove') {
        localStorage.removeItem(name);
    } else {
        return JSON.parse(localStorage.getItem(name) || '[]');
    }
};

const clickHistory = (item: string) => {
    emits('onSearch', {
        value: item,
    });
};
const clickMore = () => {
    isShowMore.value = false;
};
const clearHistory = () => {
    list.value = [];
    isShowMore.value = false;
    handleStorage('remove');
};

const triggerAdd = (val: string) => {
    if (!val) {
        return false;
    }
    const newList = utilArrayArrange([val, ...list.value]);
    (list.value as any) = newList;
    handleStorage('set', list.value);
};
const initData = () => {
    list.value = handleStorage('get');
    isShowMore.value = list.value.length > maxNum.value;
};
defineExpose({
    triggerAdd,
});
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
.searchnew-history {
    display: flex;
    flex-direction: column;
    margin-bottom: vws(24);
    &-content {
        display: flex;
        margin-top: vws(-12);
        padding: 0 vws(24) vws(8);
        flex-wrap: wrap;
    }
    &-item {
        .tag {
            overflow: hidden;
            margin: vws(24) vws(16) 0 0;
            padding: 0 vws(24);
            max-width: vws(260);
            height: vws(60);
            line-height: vws(60);
            border-radius: vws(30);
            // box-sizing: border-box;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            background-color: #f7f7f8;
            span {
                font-size: vws(26);
                color: #333;
            }
        }
        .tag-more {
            display: flex;
            align-items: center;
        }
        .ico-more {
            width: vws(32);
            height: vws(32);
        }
    }
}
</style>
