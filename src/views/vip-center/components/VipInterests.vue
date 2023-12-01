<template>
    <div class="vip-interests">
        <div class="title">更多会员权益</div>
        <div class="vip-rights">
            <div class="candy-line" v-for="(candies, ind1) in candyList" :key="ind1">
                <div class="candy" v-for="(candy, ind2) in candies" :key="ind2">
                    <img :src="images[`vip${ind1 + 1}_${ind2 + 1}`]" />
                    <span>{{ candy }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const images: Record<string, string> = {
    vip1_1: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/1_1_02eb219.png',
    vip1_2: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/1_2_e447016.png',
    vip1_3: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/1_3_e8fca64.png',
    vip1_4: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/1_4_b129267.png',
    vip1_5: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/1_5_b607de2.png',
    vip2_1: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/2_1_8d38fbe.png',
    vip2_2: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/2_2_5a3209a.png',
    vip2_3: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/2_3_f4cebc6.png',
    vip2_4: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/2_4_dabfb07.png',
    vip2_5: 'https://static3w.kuaikanmanhua.com/assets/img/remote_images/vipcenter/2_5_4704b8e.png',
};
const candyList = [
    ['每日礼包', '作品限免', '会员折扣', '提前阅读', '签到特权'],
    ['会员弹幕', '卡券特权', '会员挂件', '免费代金券', '尊贵身份'],
];
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-interests {
    position: relative;
    margin-top: vws(32);
    padding: 0 vws(24);
    box-sizing: border-box;
    .title {
        width: 100%;
        height: vws(88);
        font-size: vws(30);
        font-weight: bold;
        color: #222;
        line-height: vws(88);
    }
    .vip-rights {
        padding-bottom: vws(200);
        height: vws(160);
        .candy-line {
            display: flex;
        }
    }
    .candy {
        padding: vws(16) 0 vws(16);
        flex-grow: 1;
        img {
            display: block;
            margin: 0 auto vws(16);
            width: vws(88);
            height: vws(88);
        }
        span {
            display: block;
            font-size: vws(24);
            text-align: center;
            color: #333;
            line-height: vws(24);
        }
    }
}
</style>
