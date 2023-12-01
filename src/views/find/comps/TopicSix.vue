<template>
    <div class="topics-six">
        <div class="topics-title">
            <span>{{ moduleTitle }}</span>
        </div>
        <div class="topics-list">
            <div
                class="topics-item"
                v-for="(item, index) in list"
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
        <div class="topics-button" v-if="showMore">
            <div class="left" @click="handleMore">
                <span>查看更多</span>
            </div>
            <div class="right" @click="handleChange">
                <span>换一换</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FindTopicType } from '../types';
import jointImageSuffix from '@kk/image-format';
import { utilAction } from '@/helpers/utils';
import { getDiscoveryModuleChange } from '../api';
import { useRouter } from 'vue-router';
import { track } from '@/helpers/kksa';

const router = useRouter();
const props = defineProps({
    params: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const moduleTitle = ref<string>('');
const moduleId = ref<number>(0);
const filterIds = ref<string>('[]');
const cardType = ref<string>('');
const changeLoading = ref<boolean>(false);
const showMore = ref(true);
const list = ref<Array<FindTopicType> | []>([]);
const formatData = (value = []) => {
    return value.map((item: any) => {
        return {
            id: item.id,
            title: item.title || '',
            subtitle: item.sub_title || '',
            bottom: item.right_bottom || '',
            image: jointImageSuffix({ src: item.image, width: 350 }),
            action: item.action_type || {},
        };
    });
};
const initData = () => {
    const {
        banner_list = [],
        title = '',
        card_type = '',
        module_id = 0,
        filter_ids = '[]',
        show_more = false,
    } = props.params;
    moduleTitle.value = title;
    moduleId.value = module_id;
    cardType.value = card_type;
    filterIds.value = filter_ids;
    showMore.value = show_more;
    list.value = formatData(banner_list);
};

const handleTrack = (value: any) => {
    const options = {
        ModuleID: moduleId.value,
        ModuleName: moduleTitle.value,
        ObjectId: 0,
        ObjectType: 0,
        ButtonName: '',
        TabModuleType: '六图类型',
    };
    Object.assign(options, value);
    track('UserDefinedTabFindPageClk', options);
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
        ButtonName: '查看更多',
    });
    router.push({
        path: '/topic-list',
        query: {
            moduleId: moduleId.value,
            cardType: cardType.value,
            title: moduleTitle.value,
        },
    });
};
const handleChange = () => {
    if (changeLoading.value) {
        return false;
    }
    changeLoading.value = true;
    getDiscoveryModuleChange({
        module_id: moduleId.value,
        filter_ids: filterIds.value,
        card_type: cardType.value,
    })
        .then((res: { code: number; data: any }) => {
            const { code, data = {} } = res;
            const { module_info: item = {} } = data;
            changeLoading.value = false;
            if (code != 200) {
                return false;
            }
            const { banner_list: bannerList = [], filter_ids: childIds = '[]' } = item;
            list.value = formatData(bannerList);
            filterIds.value = childIds;
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
.topics-six {
    padding: 0 vws(24) vws(32);
    display: flex;
    flex-direction: column;
    .topics-title {
        padding: vws(24) 0;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        span {
            line-height: vws(50);
            height: vws(50);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            font-size: vws(36);
            color: #333;
        }
    }
    .topics-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-bottom: vws(8);
    }
    .topics-item {
        width: vws(224);
        flex-direction: column;
        padding-bottom: vws(24);
        height: auto;
        // height: vws(415);
        .topic-cover {
            width: vws(224);
            height: vws(298);
            border-radius: vws(12);
            overflow: hidden;
            position: relative;
            img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
        }
        .topic-cover .bottom {
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
            margin-top: vws(12);
            overflow: hidden;
            display: flex;
            align-items: center;
            height: vws(42);
            span {
                font-weight: bold;
                font-size: vws(30);
                color: #222;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .topic-des {
            overflow: hidden;
            margin-top: vws(4);
            display: flex;
            align-items: center;
            height: vws(36);
            span {
                font-weight: 400;
                font-size: vws(26);
                color: #999;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .topics-button {
        display: flex;
        align-items: center;
        .left {
            margin-right: vws(8);
        }
        .right {
            margin-left: vws(8);
        }
        .left,
        .right {
            width: 50%;
            height: vws(84);
            line-height: vws(84);
            background-color: #f7f7f8;
            border-radius: vws(8);
            display: flex;
            justify-content: center;
            span {
                font-size: vws(26);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666;
                text-align: center;
                opacity: 0.86;
            }
        }
    }
}
</style>
