<template>
    <!-- 普通支付 -->
    <div class="kk-pay-wrap">
        <!-- 批量购档位 -->
        <div
            v-if="props.payData.batchPriceList.length >= 1"
            :class="{ 'kk-batch-buy': true, 'vip-kk-batch-buy': props.payData.isvip }"
        >
            <div
                v-for="(item, index) in props.payData.batchPriceList"
                :key="index"
                :class="{ gear: true, selected: props.payData.batchPriceIndex === index }"
                @click="tapChangeGear(index)"
            >
                <span class="section">{{ item.text }}</span>
                <span class="icon" v-if="item.price_info.icon_text">
                    {{ item.price_info.icon_text }}
                </span>
            </div>
        </div>

        <!-- 支付金额、优惠信息 -->
        <HalfPayInfo />

        <!-- 支付按钮 -->
        <div class="kk-button-buy">
            <div
                :class="[
                    'baseBtn',
                    props.payData.isvip ? 'vip-kk-button-base' : 'kk-button-base',
                    payBtnType,
                ]"
                @click="onPayClick"
            >
                {{ props.payData.payBtnText }}
            </div>
            <div class="pay-btn-icon" v-if="props.payData.payIconUrl">
                <img class="icon" :src="props.payData.payIconUrl" />
            </div>
        </div>

        <!-- 底部强提示按钮 -->
        <div
            v-if="props.payData.bottomVipBanner && props.payData.bottomVipBanner.text_type < 3"
            :class="{ 'bottom-banner-box': true, 'vip-style': props.payData.isvip }"
        >
            <div class="btn-pay" @click="jumpVip">
                <img
                    v-if="props.payData.bottomVipBanner.icon"
                    :src="props.payData.bottomVipBanner.icon"
                />
                {{ props.payData.bottomVipBannerText[0] }}
                <span>{{ props.payData.bottomVipBannerText[1] }}</span>
                {{ props.payData.bottomVipBannerText[2] }}
            </div>
            <div class="bubble" v-if="props.payData.bottomVipBanner.label_text">
                {{ props.payData.bottomVipBanner.label_text }}
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, inject } from 'vue';
import { utilAction } from '@/helpers/utils';
import { autoPaidApi } from '@/api/comic.api';
import { utilGetPointCharge } from '@/helpers/behaviors';
import { PaidCallbackInter, PointChargeInter } from '@/typings/comic';
import { track } from '@/helpers/kksa';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

interface PaidEvent {
    (e: PaidCallbackInter): void;
}

const HalfPayInfo = defineAsyncComponent(() => import('./HalfPayInfo.vue'));

const props = defineProps({
    payData: {
        type: Object,
        default: () => {
            return {};
        },
    },
    payBtnType: {
        type: String,
        default: 'solid', // solid:实心; border:边框
    },
});
const store = useStore();
const router = useRouter();
const emit = defineEmits(['handleSwitch', 'handleClickPay']);
const paidCallback = inject('emitPaidEvent') as PaidEvent;

let payLoading = false;

const tapChangeGear = (index: number) => {
    emit('handleSwitch', index);
};

const jumpVip = () => {
    if (!store.state.userId) {
        router.push({ path: '/login' });
        return false;
    }
    const { action_target = {} } = props.payData.bottomVipBanner;
    const { target_id, action_type } = action_target;
    utilAction({ type: action_type, id: target_id });
};

const requestPaid = async () => {
    if (payLoading) {
        return false; // 防止重复购买
    }
    const { comicId, autoPay, encrypt, spendCouponId, spendCouponRecordId } = props.payData;
    payLoading = true;
    const postData = {
        spendCouponId,
        spendCouponRecordId,
        encrypt,
        autoPay,
        report: {
            auto_paid: 1,
        },
        comicId,
    };
    try {
        const res = await autoPaidApi(postData);
        payLoading = false;

        const trackData = (await utilGetPointCharge()) as PointChargeInter;
        const consume_info = res.data.consume_info ? res.data.consume_info : {};
        const comic_order = res.data.comic_order || {};
        const dataTrack = {
            TopicName: props.payData.TopicName, // 专题名称
            ComicName: props.payData.ComicName, // 漫画名称
            AutoPaid: 0,
            CurrentPrice: props.payData.price, // 实际支付价格
            SpendGiveCurrency: consume_info.activity_consume ? consume_info.activity_consume : 0, // 消费赠币数量
            SpendRecharge: consume_info.kb_consume ? consume_info.kb_consume : 0, // 消费充值币数量
            LastRechargeTime: trackData.LastRechargeTime, // 最后充值时间
            TechargeType: trackData.RechargeType, // 累计充值次数
            MembershipClassify: props.payData.isvip, // 是否为会员
            // VoucherPaid: payTrackData.VoucherPaid, // 是否有代金券优惠  1有，0没有
            // VoucherCount: payTrackData.VoucherCount, // 代金券优惠金额
            TriggerPage: 'ComicPage', // 触发的页面
            TriggerButton: props.payData.payBtnText, // 点击的按钮
            BatchPaid: comic_order.product_type === 2, // 是否是批量购买
            BatchDiscount: consume_info.batch_discount || 0, // 批量购买优惠金额
        };

        // 用户手动购买
        track('Consume', dataTrack);

        const toast = '买好啦，请愉快食用！';
        paidCallback({
            type: 'kkb',
            state: true,
            toast: { show: true, message: toast },
        });
    } catch (err) {
        paidCallback({
            type: 'kkb',
            state: false,
            toast: { show: true, message: '购买失败' },
        });
        payLoading = false;
    }
};

const onPayClick = () => {
    emit('handleClickPay');
    if (!store.state.userId) {
        router.push({ path: '/login' });
        return false;
    }
    const { price, wallet } = props.payData;
    if (wallet >= price) {
        requestPaid();
    } else {
        utilAction({ type: 22 });
    }
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';
.kk-pay-wrap {
    padding-bottom: vws(60);
    .kk-batch-buy {
        display: flex;
        justify-content: center;
        margin-bottom: vws(40);
        padding: 0 vws(30);
        .gear {
            position: relative;
            margin: 0 vws(10);
            width: vws(240);
            max-width: vws(240);
            // width: vws(152);
            height: vws(96);
            font-size: vws(24);
            border-style: solid;
            border-width: vws(2);
            border-color: rgba(255, 117, 26, 0.08);
            border-radius: vws(8);
            text-align: center;
            color: #333;
            line-height: vws(96);
            box-sizing: border-box;

            &.selected {
                font-weight: bold;
                border-color: #ff751a;
                background: #fffaf6;
            }
            .icon {
                position: absolute;
                top: 0;
                left: 0;
                padding: 0 vws(8);
                height: vws(28);
                font-size: vws(18);
                border-radius: vws(8) 0;
                color: #fff;
                background: #ff751a;
                line-height: vws(28);
            }
        }
        &.vip-kk-batch-buy {
            .gear {
                border-color: rgba(210, 35, 215, 0.08);
                &.selected {
                    border-color: #d223d7;
                    background: #f9f6ff;
                }
                .icon {
                    background: linear-gradient(to right, #d223d7, #730ed2);
                }
            }
        }
    }
}

.kk-button-buy {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    padding-top: vws(32);
    width: vws(530);
    .pay-btn-icon {
        position: absolute;
        top: 0;
        right: vws(40);
    }
}
.baseBtn {
    position: relative;
    margin: 0 auto;
    width: vws(530);
    height: vws(88);
    font-size: vws(30);
    border-radius: vws(44);
    text-align: center;
    line-height: vws(88);
}
.kk-button-base {
    &.solid {
        color: #fff;
        background: #ff751a;
    }
    &.border {
        border: vws(2) solid #ff751a;
        color: #ff751a;
    }
}

.vip-kk-button-base {
    &.solid {
        color: #fff;
        background: linear-gradient(135deg, rgba(209, 0, 214, 1) 0%, rgba(108, 1, 207, 1) 100%);
    }
    &.border {
        border: vws(2) solid #5d04b5;
        color: #5d04b5;
    }
}
.bottom-banner-box {
    position: relative;
    margin: 0 auto;
    width: vws(530);
    .bubble {
        position: absolute;
        top: vws(-8);
        right: vws(-40);
        padding: 0 vws(12);
        height: vws(34);
        font-size: vws(18);
        font-weight: 500;
        border-radius: vws(15) vws(15) vws(15) vws(4);
        text-align: center;
        color: rgba(255, 255, 255, 1);
        background: linear-gradient(90deg, rgba(255, 37, 127, 1) 0%, rgba(255, 0, 71, 1) 100%);
        line-height: vws(34);
    }
    .btn-pay {
        margin-top: vws(20) !important;
        width: vws(530);
        height: vws(88);
        font-size: vws(30);
        border: vws(2) solid #ff751a;
        border-radius: vws(44);
        text-align: center;
        color: #ff751a;
        line-height: vws(88);
        box-sizing: border-box;
        img {
            display: inline-block;
            margin-right: vws(6);
            width: vws(30);
            height: vws(30);
        }
        span {
            font-weight: bolder;
        }
    }
    &.vip-style {
        .btn-pay {
            border: vws(2) solid #5d04b5;
            color: #5d04b5;
        }
    }
}
</style>
