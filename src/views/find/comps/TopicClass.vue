<template>
    <div class="classify-topics">
        <div class="topics-bg find-module-9">
            <div class="topics-bg-pic">
                <img
                    style="width: 100%; height: 100%; object-fit: cover"
                    :src="navList[navActive].firstBg"
                />
            </div>
            <div class="topics-bg-mark" :class="`t-${navActive % 5}`"></div>
        </div>
        <div class="topics-info">
            <div class="topics-title">
                <span>{{ moduleTitle }}</span>
            </div>
            <div class="topics-nav">
                <div class="topics-nav-content">
                    <div class="topics-nav-list">
                        <div class="topics-nav-scroll">
                            <div
                                class="nav-tap"
                                :class="navActive == index ? 'active' : ''"
                                v-for="(item, index) in navList"
                                :key="item.id"
                                @click="handleNav(index)"
                            >
                                <span>{{ item.title }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="topics-list-box">
                <div class="topics-list">
                    <div
                        class="topics-item"
                        v-for="(item, index) in navList[navActive].list"
                        :key="index"
                        @click="handleAction(item)"
                    >
                        <div class="topic-cover">
                            <img :src="item.image" />
                            <div class="bottom">
                                <span>{{ item.bottom }}</span>
                            </div>
                        </div>
                        <div class="topic-name">
                            <span>{{ item.title }}</span>
                        </div>
                        <div class="topic-des">
                            <span>{{ item.subtitle }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="topics-bottom">
            <div class="topics-bottom-box">
                <div class="left" @click="handleMore">
                    <span>查看更多</span>
                </div>
                <div class="right" @click="handleChange">
                    <span>换一换</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FindTopicType, FindClassType } from '../types';
import jointImageSuffix from '@kk/image-format';
import { utilAction } from '@/helpers/utils';
import { getDiscoveryModuleChange } from '../api';
import { useRouter } from 'vue-router';
import { track } from '@/helpers/kksa';
const emits = defineEmits(['onChange']);
const router = useRouter();
const props = defineProps({
    params: {
        type: Object,
        default: () => {
            return {};
        },
    },
    sort: {
        type: Number,
        default: 0,
    },
});
const moduleTitle = ref('');
const moduleId = ref<number>(0);
const cardType = ref<string>('');
const navList = ref<Array<FindClassType> | []>([]);
const navActive = ref(0);
const changeLoading = ref(false);

const handleTrack = (value: any) => {
    const row = navList.value[navActive.value] || {};
    const options = {
        ModuleID: moduleId.value,
        ModuleName: row.title,
        ObjectId: 0,
        ObjectType: 0,
        ButtonName: '',
        TabModuleType: '分类模块',
    };
    Object.assign(options, value);
    track('UserDefinedTabFindPageClk', options);
};

const formatData = (value = []) => {
    return value
        .map((item: any) => {
            return {
                id: item.id,
                title: item.title || '',
                subtitle: item.sub_title || '',
                image: jointImageSuffix({ src: item.image, width: 350 }),
                action: item.action_type || {},
                icon: item.icon || '',
                bottom: item.right_bottom || '',
            };
        })
        .slice(0, 6);
};

const initData = () => {
    const { banner_list: bannerList = [], title = '', module_id, card_type } = props.params;
    navList.value = bannerList.map((item: any) => {
        const list = formatData(item.banner_children);
        const firstBg = list[0] ? list[0].image : '';
        return {
            id: item.id,
            title: item.title,
            filterIds: item.filter_ids,
            list: formatData(item.banner_children),
            firstBg,
        };
    });
    moduleTitle.value = title;
    moduleId.value = module_id;
    cardType.value = card_type;
};
const handleNav = (index: number) => {
    navActive.value = index;
    emits('onChange', {
        type: 'class',
        detail: {
            index,
            sort: props.sort,
        },
    });
};
const handleAction = (row: FindTopicType) => {
    const { action, id: topicId } = row;
    const { target_id: id, type = 0, parent_target_id: parentid } = action;
    handleTrack({
        ObjectId: topicId,
        ObjectType: type,
    });
    utilAction({
        parentid,
        type,
        id,
    });
};
const handleMore = () => {
    const row = navList.value[navActive.value] || {};
    handleTrack({
        ButtonName: '查看更多',
    });
    router.push({
        path: '/topic-list',
        query: {
            moduleId: moduleId.value,
            cardType: cardType.value,
            subtitle: row.title,
            title: row.title,
        },
    });
};
const handleChange = () => {
    if (changeLoading.value) {
        return false;
    }
    changeLoading.value = true;
    const row = navList.value[navActive.value] || {};
    getDiscoveryModuleChange({
        module_id: moduleId.value,
        filter_ids: row.filterIds,
        card_type: cardType.value,
        subtitle: row.title,
    })
        .then((res: { code: number; data: any }) => {
            const { code, data = {} } = res;
            const { module_info: item = {} } = data;
            if (code != 200) {
                return false;
            }
            const { banner_list: bannerList = [], filter_ids: childIds = '[]' } = item;
            navList.value.splice(
                navActive.value,
                1,
                Object.assign({}, row, {
                    list: formatData(bannerList),
                    filterIds: childIds,
                })
            );
            changeLoading.value = false;
            handleTrack({
                ButtonName: '换一换',
            });
        })
        .catch(() => {
            changeLoading.value = false;
        });
};
initData();
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.classify-topics {
    padding: 0 vws(24) vws(32);
    box-sizing: border-box;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    margin-top: vws(16);
    overflow: hidden;
    .topics-bg {
        position: relative;
        border-radius: vws(16);
        overflow: hidden;
        z-index: 2;
        height: vws(1100);
        &-mark {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 5;
            opacity: 0.92;
            background-color: #2288a4;
            border-radius: vws(16);
            overflow: hidden;
        }
        &-pic {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            filter: blur(10px);
        }
        .t-0 {
            background-color: #2288a4;
        }
        .t-1 {
            background-color: #644ab2;
        }
        .t-2 {
            background-color: #7b6552;
        }
        .t-3 {
            background-color: #4990e2;
        }
        .t-4 {
            background-color: #de5e5e;
        }
    }
    .topics-info {
        position: absolute;
        width: vws(702);
        left: vws(24);
        top: 0;
        z-index: 3;
        display: flex;
        flex-direction: column;
    }
    .topics-title {
        padding: vws(32) vws(24) 0;
        width: 100%;
        box-sizing: border-box;
        span {
            font-family: PingFangSC-Semibold, PingFang SC;
            color: #fff;
            font-size: vws(36);
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: block;
        }
    }

    .topics-list-box {
        position: relative;
        width: 100%;
        // height: 788px;
        height: vws(796);
    }
    .topics-list {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        padding: vws(8) vws(24);
        box-sizing: border-box;
        // width:672px;
        width: vws(702);
    }
    .topics-item {
        width: vws(207);
        height: vws(386);
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        .topic-cover {
            width: vws(207);
            height: vws(278);
            position: relative;
            border-radius: vws(12);
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
        }
        .topic-cover .bottom {
            box-sizing: border-box;
            padding: vws(46) 0px vws(12);
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.01) 10%,
                rgba(0, 0, 0, 0.04) 20%,
                rgba(0, 0, 0, 0.07) 30%,
                rgba(0, 0, 0, 0.11) 40%,
                rgba(0, 0, 0, 0.16) 49%,
                rgba(0, 0, 0, 0.21) 58%,
                rgba(0, 0, 0, 0.26) 67%,
                rgba(0, 0, 0, 0.31) 75%,
                rgba(0, 0, 0, 0.36) 82%,
                rgba(0, 0, 0, 0.4) 88%,
                rgba(0, 0, 0, 0.44) 93%,
                rgba(0, 0, 0, 0.47) 97%,
                rgba(0, 0, 0, 0.49) 99%,
                rgba(0, 0, 0, 0.5) 100%
            );
            border-bottom-left-radius: vws(12);
            border-bottom-right-radius: vws(12);
            color: rgba(255, 255, 255, 1);
            display: flex;
            justify-content: flex-end;
            span {
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                font-size: vws(24);
                height: vws(30);
                line-height: vws(30);
                overflow: hidden;
                margin: 0 vws(12);
                color: #fff;
            }
        }
        .topic-name {
            margin-top: vws(8);
            overflow: hidden;
            height: vws(48);
            display: flex;
            align-items: center;
            span {
                font-size: vws(30);
                color: #fff;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .topic-des {
            overflow: hidden;
            opacity: 0.6;
            height: vws(36);
            display: flex;
            align-items: center;
            span {
                font-size: vws(28);
                color: #fff;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .topics-nav {
        position: relative;
        padding: vws(24) vws(24) vws(20);
        &-content {
            height: vws(60);
            overflow: hidden;
        }
        &-scroll {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            white-space: nowrap;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .nav-tap {
            border: 0px solid #fff;
            padding: 0 vws(28);
            height: vws(56);
            display: flex;
            align-items: center;
            // box-sizing: border-box;
            border-radius: vws(28);
            opacity: 0.6;
            flex-shrink: 0;
            span {
                font-family: PingFangSC-Regular, PingFang SC;
                color: #fff;
                font-weight: 400;
                font-size: vws(28);
                position: relative;
                top: -1px;
            }
        }
        .active {
            opacity: 1;
            border: 1px solid #fff;
            text {
                font-weight: 600;
            }
        }
    }
    .topics-bottom {
        position: absolute;
        left: 0;
        bottom: vws(64);
        z-index: 3;
        width: 100%;
        padding: 0 vws(24);
        box-sizing: border-box;
    }
    .topics-bottom-box {
        display: flex;
        align-items: center;
        padding: 0 vws(24);
        .left {
            margin-right: vws(8);
        }
        .right {
            margin-left: vws(8);
        }
        .left,
        .right {
            width: 50%;
            box-sizing: border-box;
            height: vws(84);
            line-height: vws(84);
            background-color: #f7f7f8;
            border-radius: vws(8);
            display: flex;
            justify-content: center;
            background-color: rgba(255, 255, 255, 0.15);
            span {
                font-size: vws(26);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                text-align: center;
                color: #fff;
                opacity: 0.75;
            }
        }
    }
}
</style>
