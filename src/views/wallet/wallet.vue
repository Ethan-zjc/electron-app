<template>
    <div class="container">
        <NavBar title="我的钱包" />
        <div>
            <div class="top">
                <img class="banner" :src="cdnIconsImgs['wallet']" />
                <div class="money">
                    <span class="count">{{ wallet || 0 }}</span>
                    <span class="txt">KK币</span>
                </div>
            </div>

            <div class="button-wrap">
                <input type="button" @click="routeBuykkb" :value="buttonTxt" />
            </div>
            <div class="handles">
                <div class="handle" @click="routeBought('bought')">
                    <img class="icon" :src="cdnIconsImgs['wallet-paid']" />
                    <div class="content"><span class="desc">已购漫画</span></div>
                    <img class="arrow" :src="require('@/assets/img/arrow-right.png')" />
                </div>
                <div class="handle" @click="routeBought('manage')">
                    <img class="icon" :src="cdnIconsImgs['wallet-autopay']" />
                    <div class="content"><span class="desc">自动购买管理</span></div>
                    <img class="arrow" :src="require('@/assets/img/arrow-right.png')" />
                </div>
                <div class="handle" @click="routeOrderPage">
                    <img class="icon" :src="cdnIconsImgs['my-order']" />
                    <div class="content"><span class="desc">我的订单</span></div>
                    <img class="arrow" :src="require('@/assets/img/arrow-right.png')" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// const Console = console;
import { ref, onBeforeMount, defineAsyncComponent } from 'vue';
import { cdnIconsImgs } from '@/assets/js/cdn';
import { utilAction } from '@/helpers/utils';
import { utilCheckWallet, utilGetPointCharge } from '@/helpers/behaviors';
import { track } from '@/helpers/kksa';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { PointChargeInter } from '@/typings/comic';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));

const store = useStore();
const router = useRouter();
const wallet = ref(0);
const buttonTxt = ref('立即充值');

const routeBuykkb = () => {
    utilAction({ type: 22 });
};
const routeBought = (type: string) => {
    router.push({
        path: `/bought`,
        query: {
            type,
        },
    });
};
const routeOrderPage = () => {
    router.push({
        path: '/order',
    });
};

const checkTrack = async () => {
    const trackData = (await utilGetPointCharge()) as PointChargeInter;
    track('VisitCheckout', {
        LastRechargeTime: trackData.LastRechargeTime, // 最后充值时间
        TechargeType: trackData.RechargeType, // 累计充值次数
        LatestBalance: wallet.value,
    });
};

const checkWallet = async () => {
    // 代金券配置文案和小红点
    try {
        const data = await utilCheckWallet();
        if (data) {
            wallet.value = store.state.wallet;
            buttonTxt.value = data?.activity?.button_title;
        }
    } catch (err: any) {
        // Console.log(err);
    }
    checkTrack();
};

onBeforeMount(() => {
    checkWallet();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.container {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #fff;
    flex-direction: column;
}
.top {
    position: relative;
    width: 100%;
    .banner {
        margin-top: vws(-128);
        width: 100%;
        height: vws(500);
    }
    .money {
        position: absolute;
        top: vws(80);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding: 0 vws(70);
        width: 100%;
        height: vws(120);
        box-sizing: border-box;
        .count {
            margin-right: vws(16);
            font-size: vws(120);
            font-weight: 500;
            text-align: center;
            color: #fff;
            line-height: vws(120);
        }
        .txt {
            font-size: vws(24);
            color: #fff;
            opacity: 0.8;
            line-height: vws(52);
        }
    }
}

.button-wrap {
    padding: vws(20) vws(40);
    border-bottom: vws(8) solid #f7f9fa;
    input {
        width: 100%;
        height: vws(88);
        font-size: vws(32);
        border-radius: vws(44);
        color: #fff;
        background-color: #ff751a;
    }
}

.handles {
    display: flex;
    overflow: hidden;
    padding: 0 vws(28);
    background-color: #fff;
    flex-direction: column;
    .handle {
        position: relative;
        display: flex;
        padding: vws(32) 0;
        width: 100%;
        border: 0;
        border-bottom: vws(1) solid #eee;
        text-align: left;
        background-color: transparent;
        .icon {
            width: vws(44);
            height: vws(44);
        }
        .arrow {
            margin-top: vws(12);
            width: vws(12);
            height: vws(21);
        }
        .content {
            position: relative;
            display: flex;
            flex-grow: 1;
            padding: 0 vws(24) 0 vws(20);
            .desc {
                height: vws(44);
                font-size: vws(32);
                color: #333;
                flex-grow: 1;
                line-height: vws(44);
            }
            .recharge {
                padding: 0 vws(6) 0 vws(10);
                height: vws(32);
                font-size: vws(18);
                color: #fff;
                background: linear-gradient(
                    90deg,
                    rgba(255, 37, 127, 1) 0%,
                    rgba(255, 0, 71, 1) 100%
                );
                flex-shrink: 0;
                line-height: vws(32);
                border-top-left-radius: vws(16);
                border-top-right-radius: vws(16);
                border-bottom-right-radius: vws(16);
            }
            .bubble {
                width: vws(220);
                font-size: vws(24);
                text-align: right;
                color: #999;
                line-height: vws(44);
            }
            .reddot {
                position: absolute;
                top: 0;
                right: vws(-12);
                width: vws(16);
                height: vws(16);
                border-radius: vws(8);
                background-color: #f43530;
            }
        }
    }
    .last-handle {
        border-bottom: 0;
    }
}
</style>
