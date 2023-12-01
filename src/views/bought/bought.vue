<template>
    <NavBar :title="title" />
    <PullRefresh v-model="isRefresh" @refresh="onPullDownRefresh">
        <List
            v-model:loading="loading"
            :finished="finished"
            :immediate-check="true"
            :offset="50"
            @load="onScrollLoad"
            style="height: calc(100vh - 88px)"
        >
            <div class="kkmh-empty" v-if="empty">
                <div class="kkmh-empty_img">
                    <img
                        class="img"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/empty-img_5537d1d.png"
                    />
                    <img
                        class="text"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/empty-text_ef811e1.png"
                    />
                </div>
            </div>

            <div class="topic-list" v-for="item in list" :key="item.id">
                <div class="topic" @click="toTopic(item.id, item.type)">
                    <div class="cover">
                        <img class="img" :src="item.cover" />
                    </div>
                    <div class="info">
                        <div class="title">
                            <span class="txt">{{ item.title }}</span>
                            <span
                                class="button"
                                v-if="type == 'manage'"
                                @click.stop="cancelAuto(item.id)"
                            >
                                取消
                            </span>
                        </div>
                        <div
                            class="text purchased"
                            :style="`padding-right: ${type == 'manage' ? '52px' : 0}`"
                        >
                            <span>{{ item.text1 }}</span>
                        </div>
                        <div class="text update">
                            <span>{{ item.text2 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </List>
    </PullRefresh>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { utilAction, utilShowToast } from '@/helpers/utils';
import { PullRefresh, List, showConfirmDialog } from 'vant';
import { rqs } from '@/helpers/request';
import { useRoute } from 'vue-router';
// import { listApi } from './mock.js';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));

const route = useRoute();
const type = route.query.type;
const title = ref('');
const list = ref<any>([]);
const offset = ref(0);
const limit = ref(20);
const empty = ref(false); // 空状态
const loading = ref(false);
const isRefresh = ref(false);
const finished = ref(false); // 有数据且没有更多了
const complete = ref(false); // 当前接口返回没有更多数据了
const canceled = ref(false);
const cancelId = ref(0);

const getDataApi = async () => {
    try {
        const { data } = await rqs({
            host: 'pay',
            url: `/v2/comicbuy/${type == 'manage' ? 'auto_pay/list' : 'get_purchased_topics'}`,
            data: {
                since: offset.value,
                limit: limit.value,
            },
        });
        const isManage = type == 'manage';
        const since = data?.offset || data.since || 0;
        const listAry = data.topics.map((item: any) => {
            return {
                id: item.id,
                cover: item.cover_image_url,
                title: item.title,
                text1: isManage
                    ? item?.user?.nickname
                    : '\u5DF2\u8D2D' + item?.purchased_comic_count + '\u8BDD',
                text2: isManage
                    ? item?.purchased_comic_info
                    : '\u66F4\u65B0\u81F3\uFF1A' + item?.latest_comic_title,
            };
        });
        if (listAry.length) {
            list.value = list.value.concat(listAry);
        }

        const length = list.value.length;
        const emt = length == 0;
        const oft = emt ? -1 : listAry.length < limit.value ? -1 : since;
        const comp = oft === -1;
        offset.value = oft;
        loading.value = false;
        complete.value = comp;
        empty.value = emt;
        isRefresh.value = false;
        finished.value = complete.value || empty.value;
    } catch (e) {
        loading.value = false;
        isRefresh.value = false;
        empty.value = true;
    }
};
const initPageData = () => {
    list.value = [];
    offset.value = 0;
    complete.value = false;
    empty.value = false;
    loading.value = true;
    getDataApi();
};
const refreshData = () => {
    finished.value = true;
    initPageData();
};
const onPullDownRefresh = () => {
    !loading.value && refreshData();
};
const onScrollLoad = () => {
    if (!complete.value) {
        loading.value = true;
        getDataApi();
    }
};
const toTopic = (id: number, type = 2) => {
    utilAction({ type, id });
};
const cancelRequest = (id: number) => {
    rqs({
        method: 'post',
        host: 'pay',
        url: '/v2/comicbuy/auto_pay',
        data: {
            topic_id: id,
        },
    })
        .then(() => {
            const listAry = list.value.filter((item: { id: number }) => {
                return item.id !== id;
            });
            const length = listAry.length;
            offset.value--;
            list.value = listAry;
            empty.value = length === 0;
            finished.value = true;

            utilShowToast({
                title: '取消成功',
                type: 'success',
            });
        })
        .catch(() => {
            utilShowToast({
                title: '取消失败',
            });
        });
};
const cancelAuto = (id: number) => {
    if (canceled.value) {
        cancelRequest(id);
    } else {
        cancelId.value = id;
        showConfirmDialog({
            title: '提示',
            lockScroll: true,
            message: '取消后，每次购买章节都会出现支付KK币的确认弹窗',
            confirmButtonColor: '#FF751A',
        })
            .then(() => {
                // on confirm
                canceled.value = true;
                cancelRequest(id);
            })
            .catch(() => {
                // on cancel
                canceled.value = false;
            });
    }
};

onBeforeMount(() => {
    title.value = type === 'bought' ? '已购漫画' : '自动购买管理';
    // initPageData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.kkmh-empty {
    padding-top: vws(240);
    width: 100%;
    font-size: vws(24);
    text-align: center;
    color: #81858a;
}
.kkmh-empty_img {
    position: relative;
    align-items: center;
    width: 100%;
    flex-direction: column;
    .img {
        width: vws(240);
        height: vws(240);
    }
    .text {
        margin-top: vws(20);
        width: vws(596);
        height: vws(66);
    }
}
.topic-list {
    padding: 0 vws(24);
}
.topic {
    position: relative;
    display: flex;
    padding: vws(16) 0 vws(17);
    width: 100%;
    border-bottom: vws(1) solid #eee;
    .cover {
        padding-right: vws(20);
        width: vws(248);
        height: vws(156);
        flex-shrink: 0;
        .img {
            width: 100%;
            height: 100%;
        }
    }
    .info {
        flex-grow: 1;
        overflow: hidden;
        span {
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .purchased {
            margin-top: vws(3);
            line-height: vws(24);
        }
        .update {
            line-height: vws(24);
            margin-top: vws(24);
        }
    }
    .title {
        display: flex;
        width: 100%;
        color: #000;
        .txt {
            overflow: hidden;
            font-size: vws(32);
            line-height: vws(50);
            text-overflow: ellipsis;
            flex: 1;
        }
        .button {
            width: vws(104);
            height: vws(50);
            line-height: vws(50);
            font-size: vws(24);
            border-radius: vws(25);
            text-align: center;
            color: #666;
            background-color: #f7f7f8;
        }
    }
    .text {
        span {
            overflow: hidden;
            font-size: vws(24);
            text-overflow: ellipsis;
            color: #999;
        }
    }
}
</style>
