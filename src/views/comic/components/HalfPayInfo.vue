<template>
    <div :class="{ 'kk-pay-info': true, 'vip-kk-pay-info': payData.isvip }">
        <!-- 需要的kkb和折扣 -->
        <div class="pay-info-title">
            <div class="icon-img">
                <img
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/pay/kkb_b9c228a.png"
                />
            </div>
            <div class="kkb">{{ payData.price || 0 }}</div>
            <div class="vip-icon" @click="tapButtonVip" v-if="payData.isvip">
                <div class="mark">{{ payData.discountInfo.discount_left || 'VIP' }}</div>
                <div class="text">{{ payData.discountInfo.discount_right || '会员' }}</div>
            </div>
            <div
                class="discount-icon"
                v-else-if="
                    payData.priceInfo.total_discounts &&
                    payData.priceInfo.total_discounts > 0 &&
                    payData.priceInfo.total_discounts < 10
                "
            >
                <img
                    class="icon"
                    src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/buyvip/discount_abb9369.png"
                />
                <div class="icon-text">{{ payData.priceInfo.total_discounts }}折</div>
            </div>
        </div>

        <!-- 折扣的价格信息 -->
        <div class="pay-info-subtitle" v-if="payData.discountInfo.discount_text">
            <div :class="{ line: true, delete: payData.discountInfo.market_delete }">
                {{ payData.discountInfo.market_text }}
            </div>
            <div class="text">{{ payData.discountInfo.discount_text }}</div>
            <div
                class="more"
                v-if="payData.priceInfo.deduction_texts && payData.priceInfo.deduction_texts.length"
            >
                <div class="tips-icon" @click="tapButtonMore">
                    <img
                        class="icon"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/sign-help_5abdf5c.png"
                    />
                </div>
                <div class="tips" v-if="showTips">
                    <div
                        class="tips-text"
                        v-for="(item, index) in payData.priceInfo.deduction_texts"
                        :key="index"
                    >
                        {{ item }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, inject } from 'vue';
import { utilAction } from '@/helpers/utils';
import { HalfPayDataInter } from '@/typings/comic';

const payData = inject('payData') as HalfPayDataInter;

const showTips = ref(false);
const tapButtonMore = () => {
    if (showTips.value) {
        return false;
    }
    showTips.value = true;
    const timer = setTimeout(() => {
        clearTimeout(timer);
        showTips.value = false;
    }, 3000);
};

const tapButtonVip = () => {
    utilAction({ type: 44 });
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';

// 需要的kkb和折扣
.pay-info-title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: vws(48);
    .icon-img {
        overflow: hidden;
        width: vws(36);
        height: vws(36);
        img {
            width: 100%;
            height: 100%;
        }
    }
    .kkb {
        margin: 0 vws(16) 0 vws(8);
        font-size: vws(40);
        font-family: PingFangSC-Medium, 'PingFang SC', sans-serif;
        font-weight: 500;
        color: #ff751a;
        line-height: vws(48);
    }
    .discount-icon {
        position: relative;
        display: flex;
        width: vws(64);
        height: vws(28);
        img {
            width: 100%;
            height: 100%;
        }
        .icon-text {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            font-size: vws(20);
            font-family: PingFangSC-Medium, 'PingFang SC', sans-serif;
            font-weight: 500;
            text-align: center;
            color: #fff;
            line-height: vws(28);
            vertical-align: top;
        }
    }
    .vip-icon {
        position: relative;
        display: flex;
        align-items: center;
        .mark {
            padding: 0 vws(6);
            height: vws(28);
            font-size: vws(20);
            font-family: PingFangSC-Medium, 'PingFang SC', sans-serif;
            color: #fff;
            background-color: #ca00d5;
            line-height: vws(28);
            box-sizing: border-box;
        }
        .text {
            padding: 0 vws(4);
            max-width: vws(450);
            height: vws(24);
            font-size: vws(20);
            font-family: PingFangSC-Medium, 'PingFang SC', sans-serif;
            font-weight: 500;
            border: vws(2) solid #ca00d5;
            border-radius: 0 vws(4) vws(4) vws(0);
            text-align: center;
            color: #9a00d2;
            background: rgba(207, 0, 214, 0.08);
            line-height: vws(24);
        }
    }
}

// 折扣的价格
.pay-info-subtitle {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: vws(16) 0 0;
    justify-items: center;
    height: vws(32);
    .coupon {
        width: vws(30);
        height: vws(30);
        font-size: vws(20);
        font-family: PingFangSC-Medium, 'PingFang SC', sans-serif;
        font-weight: 500;
        border-radius: vws(4);
        text-align: center;
        color: #ff751a;
        background: rgba(255, 117, 26, 0.1);
        line-height: vws(30);
    }
    .line {
        margin-right: vws(8);
        padding-left: vws(8);
        height: vws(28);
        font-size: vws(28);
        font-family: PingFangSC-Regular, 'PingFang SC', sans-serif;
        font-weight: 400;
        color: #b2b4c4;
        line-height: vws(28);
    }
    .delete {
        text-decoration: line-through;
    }
    .text {
        margin-right: vws(4);
        padding-left: vws(8);
        height: vws(28);
        font-size: vws(28);
        font-family: PingFangSC-Regular, 'PingFang SC', sans-serif;
        font-weight: 400;
        color: #b2b4c4;
        line-height: vws(28);
    }
    .more {
        position: relative;
        height: vws(32);
        .tips-icon {
            display: flex;
            align-items: center;
            height: 100%;
        }
        img {
            width: vws(30);
            height: vws(30);
        }
        .tips {
            position: absolute;
            top: 50%;
            right: -100%;
            margin-right: vws(68);
            padding: vws(20) vws(24);
            border-radius: vws(12);
            color: #fff;
            background-color: rgba(0, 0, 0, 0.7);
            transform: translateY(-50%);
            box-sizing: content-box;
            &-text {
                overflow: hidden;
                max-width: vws(300);
                height: vws(36);
                font-size: vws(28);
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: vws(36);
            }
        }
    }
}

// vip样式
.vip-kk-pay-info {
    .pay-info-title {
        .kkb {
            color: #d223d7;
        }
    }
}
</style>
