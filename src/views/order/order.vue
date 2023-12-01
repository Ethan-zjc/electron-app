<template>
    <NavBar title="我的订单" />
    <Tabs
        :border="true"
        v-model:active="active"
        title-inactive-color="#999"
        title-active-color="#222222"
        swipeable
        :line-height="0"
    >
        <Tab title="充值记录">
            <List
                class="order-list"
                style="height: 100%"
                v-model:loading="loading"
                :finished="rechargeSince == -1"
                @load="loadNextPage"
                :offset="50"
            >
                <div v-if="rechargeList.length > 0">
                    <div class="order-item" v-for="(item, index) in rechargeList" :key="index">
                        <div class="order-up">
                            <div class="order-id">订单号:{{ item.order_id }}</div>
                            <div class="order-status">{{ orderStatus[item.order_status] }}</div>
                        </div>
                        <div class="order-line"></div>
                        <div class="order-down">
                            <div class="order-down-left">
                                <div class="order-title">{{ item.order_title }}</div>
                                <div class="order-time">{{ item.pay_at_text }}</div>
                            </div>
                            <div class="order-down-right">
                                <div class="order-price">花费：¥{{ item.price / 100 }}</div>
                                <div class="order-gift" v-if="item.present_kkb > 0">
                                    赠送{{ item.present_kkb }}币
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="error">
                        <img class="error-image" :src="cdnIconsImgs['order-error']" />
                        <div class="error-text">近6个月你还没有订单哦～T_T</div>
                    </div>
                </div>
            </List>
        </Tab>
        <Tab title="VIP购买记录">
            <List
                class="order-list"
                v-model:loading="loading"
                :finished="vipSince == -1"
                @load="loadNextPage"
                :offset="50"
            >
                <div v-if="vipList.length > 0">
                    <div
                        id="{{ item.order_id }}"
                        class="order-item"
                        v-for="(item, index) in vipList"
                        :key="index"
                    >
                        <div class="order-up">
                            <div class="order-id">订单号:{{ item.order_id }}</div>
                            <div class="order-status">{{ orderStatus[item.order_status] }}</div>
                        </div>
                        <div class="order-line"></div>
                        <div class="order-down">
                            <div class="order-down-left">
                                <div class="order-title">{{ item.order_title }}</div>
                                <div class="order-time">{{ item.pay_at_text }}</div>
                            </div>
                            <div class="order-down-right">
                                <div class="order-price">花费：¥{{ item.price / 100 }}</div>
                                <div class="order-gift" v-if="item.discount_price > 0">
                                    抵扣¥{{ item.discount_price / 100 }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="error">
                        <img class="error-image" :src="cdnIconsImgs['order-error']" />
                        <div class="error-text">近6个月你还没有订单哦～T_T</div>
                    </div>
                </div>
            </List>
        </Tab>
    </Tabs>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, defineAsyncComponent } from 'vue';
import { Tab, Tabs, List } from 'vant';
import { cdnIconsImgs } from '@/assets/js/cdn';
import { utilFormatTime } from '@/helpers/utils';
import { rqs } from '@/helpers/request';
import { useStore } from 'vuex';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));

const store = useStore();
const active = ref(0);
const vipSince = ref(0);
const rechargeSince = ref(0);
const loading = ref(false);
const rechargeList = ref<any>([]);
const vipList = ref<any>([]);
const orderStatus: { [key: number]: string } = {
    1: '已取消',
    2: '已完成',
};

const getOrderData = async () => {
    const params = {
        order_type: active.value === 0 ? 1 : 2,
        since: active.value === 0 ? rechargeSince.value : vipSince.value,
        platform: store.state.isiOS ? 2 : 1,
    };
    if (params.since < 0) {
        return;
    } else {
        loading.value = true;
    }
    const lastOrderData = active.value === 0 ? rechargeList.value : vipList.value;
    try {
        // loading.value = false;
        const res = await rqs({
            host: 'pay',
            url: '/v1/video_buy/video_mini/recent_orders',
            method: 'get',
            data: params,
        });
        loading.value = false;
        const { code, data } = res;
        if (code == 200) {
            const handleOrderData = data.orders.map((item: any) => {
                item.pay_at_text = utilFormatTime(item.pay_at, 'yyyy-MM-dd hh:mm');
                return item;
            });
            const newOrderData = lastOrderData.concat(handleOrderData);
            if (active.value === 0) {
                rechargeList.value = newOrderData;
                rechargeSince.value = data.next_since;
            }
            if (active.value === 1) {
                vipList.value = newOrderData;
                vipSince.value = data.next_since;
            }
        }
    } catch (e: any) {
        loading.value = false;
        if (active.value) {
            vipSince.value = -1;
        } else {
            rechargeSince.value = -1;
        }
    }
};

const loadNextPage = () => {
    getOrderData();
};

watch(
    () => active.value,
    () => {
        getOrderData();
    }
);

onBeforeMount(() => {
    getOrderData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.order-list {
    .order-item {
        margin: vws(24);
        border-radius: vws(16);
        background-color: #fff;
        .order-up {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: vws(24);
            font-size: vws(22);
            color: #999;
            // border-bottom: solid vws(1) #EAEAEA;
        }
        .order-line {
            margin: 0 vws(24);
            height: vws(2);
            background-color: #eaeaea;
            transform: scaleY(0.5);
        }
        .order-down {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: vws(32) vws(24);
            .order-down-left {
                .order-title {
                    //   width: vws(350);
                    overflow: hidden;
                    font-size: vws(28);
                    font-weight: 500;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #222;
                    line-height: vws(39);
                }
                .order-time {
                    margin-top: vws(12);
                    font-size: vws(24);
                    color: #999;
                    line-height: vws(34);
                }
            }
            .order-down-right {
                //   margin-left: vws(100);
                text-align: right;
                .order-price {
                    font-size: vws(28);
                    color: #222;
                    line-height: vws(39);
                }
                .order-gift {
                    margin-top: vws(12);
                    font-size: vws(24);
                    color: #999;
                    line-height: vws(34);
                }
            }
        }
    }
}
.error {
    margin-top: vws(300);
    text-align: center;
    .error-image {
        width: 100%;
        height: vws(373);
    }
    .error-text {
        font-size: vws(28);
        color: #999;
    }
}
</style>
