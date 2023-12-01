<template>
    <div class="guess-topics">
        <div class="topics-title">
            <span>{{ moduleTitle }}</span>
        </div>
        <div class="guess-topics-content">
            <div class="guess-topics-list">
                <div
                    class="guess-topics-item"
                    v-for="(item, index) in list"
                    :key="index"
                    @click="handleAction(item)"
                >
                    <div class="topic-cover">
                        <img :src="item.image" />
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
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { FindTopicType } from '../types';
import jointImageSuffix from '@kk/image-format';
import { utilAction } from '@/helpers/utils';
import { track } from '@/helpers/kksa';

const props = defineProps({
    params: {
        type: Object,
        default: () => {
            return {};
        },
    },
});

const moduleId = ref<number>(0);
const moduleTitle = ref<string>('');
const list = ref<Array<FindTopicType> | []>([]);

const handleTrack = (value: any) => {
    const options = {
        ModuleID: moduleId.value,
        ModuleName: moduleTitle.value,
        ObjectId: '',
        ObjectType: '',
        ButtonName: '',
        TabModuleType: '追更模块',
    };
    Object.assign(options, value);
    track('UserDefinedTabFindPageClk', options);
};

const initData = () => {
    const { banner_list: bannerList = [], title = '', module_id = 0 } = props.params;
    moduleTitle.value = title;
    moduleId.value = module_id;
    list.value = bannerList.map((item: any) => {
        return {
            id: item.id,
            title: item.title || '',
            subtitle: item.sub_title || '',
            image: jointImageSuffix({ src: item.image, width: 350 }),
            action: item.action_type || {},
        };
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
initData();
</script>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.guess-topics {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    padding: 0 0 vws(32);
    margin-top: vws(16);
    .topics-title {
        padding: vws(24);
        span {
            line-height: vws(50);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            font-size: vws(36);
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    &-content {
        overflow: hidden;
        height: vws(274);
    }
    &-list {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        white-space: nowrap;
        padding-left: vws(24);
    }
    &-item {
        width: vws(296);
        height: vws(300);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        .topic-cover {
            width: vws(280);
            height: vws(176);
            border-radius: vws(12);
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                display: block;
                object-fit: cover;
            }
        }
        .topic-name {
            margin-top: vws(12);
            overflow: hidden;
            display: flex;
            align-items: center;
            height: vws(42);
            span {
                font-size: vws(30);
                color: #222;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-weight: bold;
            }
        }
        .topic-des {
            overflow: hidden;
            margin-top: vws(4);
            height: vws(36);
            display: flex;
            align-items: center;
            span {
                font-size: vws(28);
                color: #999;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
}
</style>
