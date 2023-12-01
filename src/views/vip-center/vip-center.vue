<template>
    <div class="vipCenter">
        <NavBar title="会员中心" position="fixed" bgColor="transparent" whrite />

        <!-- 头部区域 -->
        <VipHeader :is-vip="isVip" :user-info="userInfo" :vip-info="vipInfo" />

        <!-- 会员专享区域 -->
        <VipExclusive v-if="!isVip" />

        <!-- 会员付费档位区域 -->
        <VipPay
            ref="payComp"
            @handleChoiceItem="onChoiceItem"
            @handleClickProtocol="clickProtocol"
        />

        <!-- 会员专享区域 -->
        <div class="exclusive" v-if="isVip">
            <VipExclusive />
        </div>

        <!-- 作品list区域 -->
        <template v-if="topicDataList && topicDataList.length > 0">
            <VipList
                v-for="(item, index) in topicDataList"
                :key="index"
                :type="1"
                :title="item.title"
                :lists="item.banner_children"
                @handleActionTap="topicActionTap"
            />
        </template>

        <!-- 更多会员权益区域 -->
        <VipInterests />

        <!-- 悬浮按钮区域 -->
        <!-- v-if="!!activeItem.id" -->
        <div class="fix-bottom">
            <VipButton
                :isVip="isVip"
                :activeItem="activeItem"
                @handlePaySuccess="onPaySuccess"
                @handleClickPay="clickPay"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onBeforeMount } from 'vue';
import { utilAction, utilShowToast } from '@/helpers/utils';
import { utilCheckVipInfo } from '@/helpers/behaviors';
import { getVipTopicListApi } from '@/api/vip-center.api';
import { ActiveItemInter, TopicTemplateInter, TopicItemDataInter } from '@/typings/vip-center';
import { track } from '@/helpers/kksa';
import { useStore } from 'vuex';
// import { isVip, userInfo, vipInfo } from './mock';

// 引入组件
const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const VipHeader = defineAsyncComponent(() => import('./components/VipHeader.vue'));
const VipPay = defineAsyncComponent(() => import('./components/VipPay.vue'));
const VipList = defineAsyncComponent(() => import('./components/VipList.vue'));
const VipExclusive = defineAsyncComponent(() => import('./components/VipExclusive.vue'));
const VipInterests = defineAsyncComponent(() => import('./components/VipInterests.vue'));
const VipButton = defineAsyncComponent(() => import('./components/VipButton.vue'));

const store = useStore();
const { userInfo = {} } = store.state;
const isVip = ref(false);
const vipInfo = ref({});
const payComp = ref();
const activeItem = ref<Partial<ActiveItemInter>>({});
const topicDataList = ref<Array<TopicTemplateInter>>([]);

const clickTrack = (name: string) => {
    const data = {
        CurPage: '小程序新会员中心页面',
        name,
    };
    track('ClickButton', data);
};
const initUser = async () => {
    const res = await utilCheckVipInfo();
    vipInfo.value = res;
    isVip.value = !!res.vip_type;
};

const initData = async () => {
    const sendData = {
        offset: 0,
        limit: 20,
        order_from: store.state.payfrom,
    };

    try {
        const { data = {} } = await getVipTopicListApi(sendData);
        const { banner_list = [] } = data;
        const list: Array<TopicTemplateInter> = banner_list.filter(
            (item: TopicTemplateInter) => item.banner_type == 6 || item.banner_type == 5
        );
        topicDataList.value = list;
    } catch (err: any) {
        utilShowToast({ title: err.message });
    }
};
const topicActionTap = (e: TopicItemDataInter) => {
    const { action_type: type, target_id: id, parent_target_id: pid } = e.action_target || {};
    clickTrack('漫画作品');
    utilAction({ type, id, parentid: pid });
};
const onChoiceItem = (e: ActiveItemInter) => {
    clickTrack('会员档位卡片');
    activeItem.value = e;
};
const clickPay = () => {
    clickTrack('一键开通按钮');
};
const clickProtocol = (e: number) => {
    clickTrack(e == 2 ? '自动续费协议' : '会员服务协议');
};
const onPaySuccess = () => {
    // TODO: 支付成功回调
    initUser();
    if (payComp.value) {
        payComp.value.initData();
    }
};

onBeforeMount(async () => {
    await Promise.all([initUser(), initData()]);
    track('CommonPageOpen', {
        MembershipClassify: isVip.value ? 1 : 0, // 1会员，0非会员
        CurPage: '小程序新会员中心页面',
    });
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.vipCenter {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    padding-bottom: vws(200);
    width: vws(750);
    max-width: vws(750);
    min-height: 100vh;
    background: #fff;
    .exclusive {
        margin-top: vws(32);
    }
}
.fix-bottom {
    position: fixed;
    bottom: vws(80);
    left: 0;
    z-index: 10;
    width: 100%;
    height: vws(108);
}
</style>
