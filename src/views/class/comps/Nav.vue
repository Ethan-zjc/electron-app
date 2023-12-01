<template>
    <div class="class-nav" :class="isFixed ? 'class-nav-fixed' : ''">
        <div :style="`width:100%;height:${topOffset / 100}rem`" v-if="isFixed"></div>
        <block v-if="isMiniNav">
            <div class="mini-nav" @click="handleExpand">
                <div class="mini-nav-item" v-if="tagName">
                    <span class="text">{{ tagName }}</span>
                    <span class="line"></span>
                </div>
                <div class="mini-nav-item" v-if="regionName">
                    <span class="text">{{ regionName }}</span>
                    <span class="line"></span>
                </div>
                <div class="mini-nav-item" v-if="payName">
                    <span class="text">{{ payName }}</span>
                    <span class="line"></span>
                </div>
                <div class="mini-nav-item" v-if="updateName">
                    <span class="text">{{ updateName }}</span>
                    <span class="line"></span>
                </div>
                <div class="mini-nav-item" v-if="sortName">
                    <span class="text">{{ sortName }}</span>
                    <img
                        class="transform"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/arrow_b929d17.png"
                    />
                </div>
            </div>
        </block>
        <block v-if="!isMiniNav">
            <!-- 分类 -->
            <div class="tag-filter">
                <span
                    v-for="(item, index) in tagList"
                    :key="index"
                    class="tag-filter-item"
                    :class="[item.tagId === tagId ? 'active' : '']"
                    @click="handleClick('tag', item)"
                >
                    {{ item.title.slice(0, 3) }}
                </span>
            </div>

            <!-- 地区 -->
            <div v-if="showFilter" class="pay-filter filter">
                <div
                    v-for="(item, index) in regionList"
                    :key="index"
                    class="filter-item"
                    @click="handleClick('region', item)"
                >
                    <span :class="item.value === regionId ? 'active' : ''">
                        {{ item.label }}
                    </span>
                    <span v-if="Number(index) < regionList.length - 1" class="cut">|</span>
                </div>
            </div>

            <!-- 付费状态 -->
            <div v-if="showFilter" class="pay-filter filter">
                <div
                    v-for="(item, index) in payList"
                    :key="index"
                    class="filter-item"
                    @click="handleClick('pay', item)"
                >
                    <span :class="item.value === payId ? 'active' : ''">
                        {{ item.label }}
                    </span>
                    <span v-if="Number(index) < payList.length - 1" class="cut">|</span>
                </div>
            </div>

            <!-- 更新状态 -->
            <div v-if="showFilter" class="update-filter filter">
                <div
                    v-for="(item, index) in updateList"
                    :key="index"
                    class="filter-item"
                    @click="handleClick('update', item)"
                >
                    <span :class="item.value === updateId ? 'active' : ''">
                        {{ item.label }}
                    </span>
                    <span v-if="Number(index) < updateList.length - 1" class="cut">|</span>
                </div>
            </div>

            <!-- 推荐状态 -->
            <div class="sort-filter filter">
                <div
                    v-for="(item, index) in sortList"
                    :key="index"
                    class="filter-item"
                    @click="handleClick('sort', item)"
                >
                    <span :class="item.value === sortId ? 'active' : ''">
                        {{ item.label }}
                    </span>
                    <span v-if="Number(index) < sortList.length - 1" class="cut">|</span>
                </div>
                <span class="handle-button" @click="handleFilterShow">
                    {{ showFilter ? '收起' : '展开' }}
                </span>
                <img
                    :class="showFilter ? '' : 'transform'"
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/arrow_b929d17.png"
                />
            </div>
        </block>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
const emits = defineEmits(['onTap', 'onMiniTap']);
const props = defineProps({
    params: {
        type: Object,
        default: () => {
            return {};
        },
    },
    tagList: {
        type: Object,
        default: () => {
            return [];
        },
    },
    tagId: {
        type: Number,
        default: 0,
    },
    regionList: {
        type: Object,
        default: () => {
            return [];
        },
    },
    regionId: {
        type: Number,
        default: 0,
    },
    payList: {
        type: Object,
        default: () => {
            return [];
        },
    },
    payId: {
        type: Number,
        default: 0,
    },
    updateList: {
        type: Object,
        default: () => {
            return [];
        },
    },
    updateId: {
        type: Number,
        default: 0,
    },
    sortList: {
        type: Object,
        default: () => {
            return [];
        },
    },
    sortId: {
        type: Number,
        default: 0,
    },
    isMiniNav: {
        type: Boolean,
        default: false,
    },
    isFixed: {
        type: Boolean,
        default: false,
    },
    topOffset: {
        type: Number,
        default: 0,
    },
});

const tagName = computed(() => {
    if (props.tagId) {
        const currentTag =
            props.tagList.find((i: { tagId: number }) => i.tagId === props.tagId) || {};
        return currentTag.title || '';
    } else {
        return '';
    }
});

const sortName = computed(() => {
    if (props.sortId) {
        const currentTag =
            props.sortList.find((i: { value: number }) => i.value === props.sortId) || {};
        return currentTag.label || '';
    } else {
        return '';
    }
});

const regionName = computed(() => {
    if (props.regionId > 1) {
        const currentTag =
            props.regionList.find((i: { value: number }) => i.value === props.regionId) || {};
        return currentTag.label || '';
    } else {
        return '';
    }
});

const payName = computed(() => {
    if (props.payId) {
        const currentTag =
            props.payList.find((i: { value: number }) => i.value === props.payId) || {};
        return currentTag.label || '';
    } else {
        return '';
    }
});

const updateName = computed(() => {
    if (props.updateId) {
        const currentTag =
            props.updateList.find((i: { value: number }) => i.value === props.updateId) || {};
        return currentTag.label || '';
    } else {
        return '';
    }
});

const showFilter = ref(true);
const handleExpand = () => {
    emits('onMiniTap', { value: false });
};
const handleClick = (type: string, item: any) => {
    emits('onTap', {
        type,
        item,
    });
};
const handleFilterShow = () => {
    if (props.isFixed) {
        emits('onMiniTap', { value: true });
    } else {
        showFilter.value = !showFilter.value;
    }
};
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.class-nav {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: #fff;
    &-fixed {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
    }
    .mini-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        height: vws(80);
        &-item {
            display: flex;
            align-items: center;
        }
        .text {
            font-size: vws(28);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
        }
        img {
            top: vws(4);
            width: vws(32);
            height: vws(32);
        }
        .sort {
            display: flex;
            align-items: center;
        }
        .transform {
            -webkit-transform: rotateX(-180deg);
            transform: rotateX(-180deg);
        }
        .line {
            margin: 0 vws(24);
            width: 1px;
            height: vws(16);
            background: #e6e6e6;
            border-radius: 1px;
        }
    }
    .tag-filter {
        padding: vws(8) 0 0 vws(24);
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        border-bottom: 1px solid #f3f3f3;
        background-color: #ffffff;
        .tag-filter-item {
            text-overflow: clip;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: vws(4);
            margin: 0 vws(8);
            width: vws(84);
            height: vws(48);
            line-height: vws(40);
            // border-bottom: vws(4) solid transparent;
            color: #666666;
            font-size: vws(26);
            text-align: center;
            margin: 0 vws(14) vws(16) 0;
            position: relative;
            &:after {
                content: '';
                display: none;
                height: vws(4);
                width: vws(40);
                border-radius: vws(3);
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: vws(-20);
                background-color: #fde23d;
            }
        }
        .active {
            color: #000000;
            font-weight: 600;
            &:after {
                display: block;
            }
        }
    }

    .filter {
        display: flex;
        align-items: center;
        padding-top: vws(12);
        padding-bottom: vws(12);
        padding-left: vws(30);
        padding-right: vws(30);
        background-color: #ffffff;
        .filter-item {
            line-height: vws(40);
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                color: #666;
                font-size: vws(26);
            }
            .active {
                color: #000000;
                font-weight: 600;
            }
            .cut {
                top: 4px;
                padding-left: vws(24);
                padding-right: vws(24);
                font-size: vws(16);
                color: #e6e6e6;
            }
        }
        .handle-button {
            flex: 1;
            text-align: right;
            font-size: vws(22);
            color: #999999;
        }
        img {
            top: vws(4);
            width: vws(32);
            height: vws(32);
        }
        .transform {
            transform: rotate(180deg);
        }
    }

    .update-filter {
        top: -1px;
    }

    .sort-filter {
        top: -1px;
        padding-bottom: vws(22);
    }
}
</style>
