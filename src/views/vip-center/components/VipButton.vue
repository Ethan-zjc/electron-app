<template>
    <div class="payBtn">
        <div class="left">
            <div class="price">
                <span class="unit">合计：</span>
                <span class="num">
                    ¥{{
                        (props.activeItem.real_price -
                            ((props.activeItem.usableCouponFirst &&
                                props.activeItem.usableCouponFirst.amount) ||
                                0)) /
                        100
                    }}
                </span>
            </div>
            <div class="desc">
                <span class="txt" v-if="props.activeItem?.usableCouponFirst?.amount">
                    已抵扣¥{{ props.activeItem.usableCouponFirst.amount / 100 }}
                </span>
                <span
                    class="txt"
                    v-else-if="props.activeItem.discount_tips || props.activeItem.description"
                >
                    {{
                        props.activeItem.discount_tips
                            ? props.activeItem.discount_tips
                            : props.activeItem.description
                    }}
                </span>
            </div>
        </div>
        <div class="right" @click="surePay">
            <span class="txt">{{ props.isVip ? '立即续费' : '立即支付' }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import usePay from '@/hooks/usePay';
const store = useStore();
const router = useRouter();

const Console = console;
const props = defineProps({
    isVip: {
        type: Boolean,
        default: false,
    },
    activeItem: {
        type: Object,
        default: null,
    },
});
const emit = defineEmits(['handlePaySuccess', 'handleClickPay']);

const paying = ref<boolean>(false);
const interceptLogin = () => {
    if (!store.state.userId) {
        router.push({ path: '/login' });
        return true;
    }
};
const surePay = async () => {
    if (interceptLogin()) return;
    emit('handleClickPay');
    const item = props.activeItem;
    const {
        id,
        real_price = 0,
        recharge_value = 0,
        present_value = 0,
        title = '', // 会员下单必传，埋点使用
        mark_price = 0, // 会员下单必传，埋点使用
        coupon = {}, // 会员下单必传，埋点使用
    } = item;
    const data = {
        good_type: 2,
        good_item: {
            id,
            title,
            coupon,
            real_price,
            mark_price,
            recharge_value,
            present_value,
        },
        sa_infos: {},
        pay_info: {},
    };
    if (paying.value) {
        return;
    }
    paying.value = true;
    try {
        await usePay(data);
        paying.value = false;
        emit('handlePaySuccess');
    } catch (err) {
        Console.log('支付异常', err);
    } finally {
        paying.value = false;
    }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.payBtn {
    display: flex;
    margin: auto;
    padding: vws(12);
    width: vws(702);
    height: vws(108);
    border-radius: vws(52);
    background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(255, 255, 255, 0.3) 0.01%,
            rgba(255, 255, 255, 0) 100%
        ),
        #775bfa;
    box-sizing: border-box;
}
.left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: vws(36);
    box-sizing: border-box;
    flex: 1;
    text-align: left;
    .price {
        display: flex;
        align-items: center;
        height: vws(40);
        .unit {
            font-size: vws(24);
            font-weight: bold;
            color: #f9f9f9;
            line-height: vws(32);
        }
        .num {
            font-size: vws(40);
            font-family: 'PingFang SC';
            font-weight: bold;
            color: #fff;
            line-height: vws(40);
        }
    }
    .desc {
        margin-top: vws(6);
        font-size: vws(22);
        text-align: center;
        text-align: left;
        color: #f9f9f9;
        line-height: vws(22);
    }
}
.right {
    display: flex;
    justify-content: center;
    align-items: center;
    width: vws(212);
    height: vws(84);
    border-radius: vws(52);
    color: #222;
    background: #ffe120;
    .txt {
        font-size: vws(32);
        font-weight: bold;
        text-align: center;
    }
}
</style>
