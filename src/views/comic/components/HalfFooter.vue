<template>
    <div class="footer">
        <div class="pay-bottom pay-wallet">
            <span
                :class="{ 'topic-btn': true, 'topic-btn-vip': props.payData.isvip }"
                @click="topicBtnTap"
            >
                全集
            </span>
            <span class="text">KK币余额：{{ props.payData.wallet }}</span>
            <div class="invest" @click="goInvest">
                <span class="invest-text">充值</span>
                <img :src="images.arrowRight" />
            </div>
            <div class="stance"></div>
            <div class="auto-pay" v-if="!props.payData.isReadCoupon" @click="switchAuto">
                <img :src="autoPay ? images.icoRadioTrue : images.icoRadioFalse" />
                <span>自动购买下一话</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { utilAction } from '@/helpers/utils';
const props = defineProps({
    payData: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
const emit = defineEmits(['handleAutoPay']);

const autoPay = ref(props.payData.autoPay);
const images = {
    arrowRight:
        'https://static3w.kuaikanmanhua.com/assets/img/remote_images/pay/arrow-right_30bc9ad.png',
    icoRadioFalse:
        'https://static3w.kuaikanmanhua.com/assets/img/remote_images/pay/ico-radio-false_4e14c70.png',
    icoRadioTrue:
        'https://static3w.kuaikanmanhua.com/assets/img/remote_images/pay/ico-radio-true_01d5b23.png',
};

const topicBtnTap = () => {
    utilAction({ type: 2, id: props.payData.topicId });
};
const goInvest = () => {
    utilAction({ type: 22 });
};
const switchAuto = () => {
    autoPay.value = !autoPay.value;
    emit('handleAutoPay', autoPay.value);
};
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';

.footer {
    background-color: #fff;
    flex-shrink: 0;
    .pay-bottom {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-right: vws(32);
        width: 100%;
        height: vws(80);
        background-color: #fff;
        box-shadow: vws(0) vws(-2) vws(8) vws(0) #0000000a;
        .topic-btn {
            margin-right: vws(12);
            width: vws(110);
            height: vws(80);
            line-height: vws(80);
            font-size: vws(24);
            font-family: PingFangSC-Regular, 'PingFang SC';
            font-weight: 400;
            text-align: center;
            color: rgba(68, 37, 9, 1);
            background-color: rgba(255, 252, 251, 1);
        }
        .topic-btn-vip {
            color: rgba(91, 41, 244, 1);
            background-color: rgba(252, 251, 255, 1);
        }
        .text {
            font-size: vws(24);
            color: #b2b4c4;
        }
        .invest {
            display: flex;
            align-items: center;
            padding: 0 vws(24);
            .invest-text {
                padding-right: vws(8);
                font-size: vws(24);
                color: #333;
            }
            img {
                width: vws(8);
                height: vws(14);
            }
        }

        //站位符
        .stance {
            flex: 1;
        }

        // 自动支付
        .auto-pay {
            display: flex;
            align-items: center;
            span {
                padding-left: vws(8);
                font-size: vws(24);
                color: #333;
            }
            //padding: 0 vws(24);
            img {
                width: vws(30);
                height: vws(30);
            }
            // .btn {
            //     image {
            //         width: vws(24);
            //         height: vws(24);
            //     }
            // }
        }
    }
}
</style>
