<template>
    <div class="vip-exclusive">
        <div class="title_info">
            <text class="tit">VIP权益</text>
            <text class="sub_tit">专享作品免费看</text>
        </div>
        <div class="intro">
            <div class="temp" v-for="item in [1, 2]" :key="item">
                <img
                    :class="`bg-${item}`"
                    :src="`https://static3w.kuaikanmanhua.com/assets/img/remote_images/vip-center/icon${
                        item == 2 ? '2_9cdd605' : '1_d65a6c3'
                    }.png`"
                />
                <div class="desc">
                    <div class="m-tit">
                        <text>超</text>
                        <text class="color">{{ item == 1 ? 180 : 300 }}</text>
                        <text>部{{ item == 1 ? '漫剧' : '漫画' }}</text>
                    </div>
                    <div class="s-tit">
                        <text>价值超</text>
                        <text class="color">{{ item == 1 ? 20000 : 30000 }}</text>
                        <text>KK币</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-exclusive {
    padding: 0 vws(24);
    width: 100%;
    box-sizing: border-box;
    .title_info {
        display: flex;
        align-items: center;
        height: vws(88);
        .tit {
            margin-right: vws(12);
            font-size: vws(30);
            font-weight: bold;
            color: #222;
        }
        .sub_tit {
            font-size: vws(24);
            color: #775bfa;
        }
    }
    .intro {
        display: flex;
        justify-content: space-between;
        margin-bottom: vws(16);
        .temp {
            position: relative;
            overflow: hidden;
            width: vws(342);
            height: vws(120);
            border-radius: vws(16);
            background: #f7f7f7;
            .bg-1 {
                position: absolute;
                right: vws(-10);
                bottom: vws(-10);
                width: vws(84);
                height: vws(94);
            }
            .bg-2 {
                position: absolute;
                right: vws(-6);
                bottom: vws(-6);
                width: vws(114);
                height: vws(90);
            }
        }
        .desc {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            display: flex;
            padding-top: vws(26);
            padding-left: vws(24);
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            flex-direction: column;
        }
        .m-tit {
            display: flex;
            align-items: flex-end;
            margin-bottom: vws(4);
            height: vws(38);
            text {
                font-size: vws(30);
                font-weight: bold;
                color: #222;
                line-height: vws(36);
            }
            .color {
                margin: 0 vws(4);
                margin-top: vws(-6);
                font-size: vws(46);
                font-weight: 700;
                color: #775bfa;
                line-height: vws(40);
            }
        }
        .s-tit {
            font-size: vws(24);
            color: #999;
        }
        .color {
            color: #775bfa;
        }
    }
}
</style>
