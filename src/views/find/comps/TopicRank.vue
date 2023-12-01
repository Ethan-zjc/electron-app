<template>
    <div class="ranking-topics">
        <div class="nav-list">
            <div
                class="nav-tap"
                :class="navActive == index ? 'active' : ''"
                v-for="(item, index) in navList"
                :key="item.id"
                @click="handleNav(index)"
            >
                <span class="name">{{ item.title }}</span>
            </div>
            <div class="right-more" @click="handleMore">
                <span class="text">全部</span>
                <img
                    class="icon"
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/arrow-right_29d3caf.png"
                />
            </div>
        </div>
        <div class="topics-line"></div>
        <div class="topics-list-box">
            <img
                style="width: 100%; height: 100%; object-fit: cover"
                class="ranking-top-bg"
                src="https://f12stag.kkmh.com/image/161216/l183wja1u.webp"
            />
            <div class="topics-list">
                <div
                    class="topics-item"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="handleAction(item)"
                >
                    <div class="topic-cover">
                        <img :src="item.image" />
                        <div class="ranking-icon">
                            <span class="icon-bg" :class="'bg-' + index"></span>
                            <span class="text">{{ index + 1 }}</span>
                        </div>
                        <div class="bottom">
                            <span>{{ item.bottom }}</span>
                        </div>
                    </div>
                    <div class="topic-name">
                        <span>{{ item.title }}</span>
                    </div>
                    <div class="topic-des">
                        <img v-if="item.icon" :src="item.icon" />
                        <span>{{ item.subtitle }}</span>
                    </div>
                </div>
            </div>
            <div class="topics-more" @click="handleMore">全部榜单</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FindTopicType, FindRankNavType } from '../types';
import jointImageSuffix from '@kk/image-format';
import { utilAction } from '@/helpers/utils';
import { track } from '@/helpers/kksa';
const emits = defineEmits(['onChange']);
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

const moduleTitle = ref<string>('');
const moduleId = ref<number>(0);
const list = ref<Array<FindTopicType> | []>([]);
const navList = ref<Array<FindRankNavType> | []>([]);
const navActive = ref<number>(0);

const handleTrack = (value: any) => {
    const options = {
        ModuleID: moduleId.value,
        ModuleName: moduleTitle.value,
        ObjectId: 0,
        ObjectType: 0,
        ButtonName: '',
        TabModuleType: '排行榜模块',
    };
    Object.assign(options, value);
    track('UserDefinedTabFindPageClk', options);
};

const formatData = () => {
    const { banner_list: bannerList = [] } = props.params;
    const row = bannerList[navActive.value] || {};
    const { banner_children: childList = [] } = row;
    return childList.map((item: any) => {
        return {
            id: item.id,
            title: item.title || '',
            subtitle: item.sub_title || '',
            image: jointImageSuffix({ src: item.image, width: 350 }),
            action: item.action_type || {},
            icon: item.icon || '',
            bottom: item.right_bottom || '',
        };
    });
};
const initData = () => {
    const { banner_list: bannerList = [], title = '', module_id = 0 } = props.params;
    navList.value = bannerList.map((item: any) => {
        return {
            id: item.id,
            title: item.title,
        };
    });
    moduleTitle.value = title;
    moduleId.value = module_id;
    list.value = formatData();
};
const handleNav = (index: number) => {
    navActive.value = index;
    list.value = formatData();
    emits('onChange', {
        type: 'rank',
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
    handleTrack({
        ButtonName: '更多榜单',
    });
    utilAction({ type: 66 });
};
initData();
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.ranking-topics {
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    padding: 0 0 vws(32);
    .ranking-top-bg {
        filter: blur(20px);
    }
    //排行头部导航
    .nav-list {
        position: relative;
        padding: 0px vws(24);
        display: flex;
        align-items: center;
        height: vws(112);
        .nav-tap {
            margin-right: vws(34);
            height: vws(112);
            position: relative;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .name {
                font-size: vws(30);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666;
            }
            &:after {
                content: '';
                display: none;
                width: vws(40);
                height: vws(8);
                border-radius: vws(4);
                background: #fde23d;
                position: absolute;
                left: 50%;
                margin-left: vws(-20);
                top: vws(84);
            }
        }
        .active {
            padding-top: 0;
            .name {
                font-size: vws(36);
                font-weight: 600;
                color: #333;
            }
            &:after {
                display: block;
            }
        }
        .right-more {
            position: absolute;
            top: 50%;
            right: vws(24);
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            .text {
                font-size: vws(26);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
            }
            .icon {
                position: relative;
                width: vws(24);
                height: vws(24);
            }
        }
    }
    .topics-line {
        height: 1px;
        width: 100%;
        background-color: #fff;
    }
    .topics-list-box {
        position: relative;
        width: 100%;
        height: vws(830);
        overflow: hidden;
    }
    .topics-list {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: vws(32) vws(24) vws(110);
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(0, 64, 114, 0.3) 0%, rgba(0, 6, 75, 0.7) 100%);
    }
    .topics-item {
        width: vws(222);
        // flex-direction: column;
        // height: 332px;
        // height: vws(340);
        flex-shrink: 0;
        overflow: hidden;
        .topic-cover {
            position: relative;
            width: vws(222);
            height: vws(222);
            border-radius: vws(12);
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
        }
        //排行榜小标位置
        .topic-cover .ranking-icon {
            position: absolute;
            left: 0;
            top: 0;
            width: vws(50);
            height: vws(50);
            z-index: 1;
            border-top-left-radius: vws(12);
            border-top-right-radius: 0px;
            border-bottom-right-radius: vws(14);
            border-bottom-left-radius: 0px;
            .icon {
                position: relative;
                left: -2px;
                top: -2px;
            }
            .text {
                box-sizing: border-box;
                position: absolute;
                top: 0;
                left: 0;
                padding-top: vws(6);
                padding-left: vws(12);
                width: vws(48);
                line-height: vws(32);
                font-size: vws(28);
                font-family: FZDHTJW--GB1-0, FZDHTJW--GB1;
                font-weight: normal;
                color: rgba(255, 255, 255, 1);
            }
            .icon-bg {
                display: block;
                width: vws(50);
                height: vws(50);
            }
            .bg-0 {
                background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-1_a66680c.png')
                    no-repeat;
                background-size: cover;
            }
            .bg-1 {
                background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-2_c463541.png')
                    no-repeat;
                background-size: cover;
            }
            .bg-2 {
                background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-3_ae2bdbb.png')
                    no-repeat;
                background-size: cover;
            }
            .bg-3,
            .bg-4,
            .bg-5 {
                background: url('https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/rank-seat-4_76c1a88.png')
                    no-repeat;
                background-size: cover;
            }
            .text-all {
                padding-left: 0px;
                text-align: center;
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
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .topic-name {
            overflow: hidden;
            display: flex;
            align-items: center;
            height: vws(58);
            span {
                font-size: vws(30);
                color: #fff;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .topic-des {
            display: flex;
            align-items: center;
            opacity: 0.7;
            height: vws(30);
            img {
                width: vws(24);
                height: vws(24);
            }
            span {
                font-size: vws(24);
                color: #fff;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-left: vws(4);
            }
        }
    }
    .topics-more {
        position: absolute;
        left: vws(24);
        bottom: vws(30);
        width: vws(702);
        height: vws(80);
        line-height: vws(80);
        text-align: center;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: vws(12);
        font-size: vws(24);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        z-index: 3;
    }
}
</style>
