<template>
    <div :class="{ 'vip-header': true, 'is-vip': props.isVip }">
        <div class="card">
            <img
                class="bg-card"
                :src="`https://static3w.kuaikanmanhua.com/assets/img/remote_images/vip-center/bg${
                    props.isVip ? '2_c5a0b99' : '1_605d53b'
                }.png`"
            />
            <div class="user-info">
                <img class="user-face" :src="props.userInfo?.user?.avatar_url" />
                <div class="user-name">
                    <div class="name">
                        <text>{{ props.userInfo?.user?.nickname }}</text>
                        <img class="vip-icon" :src="props.vipInfo?.vip_big_icon" />
                    </div>
                    <div v-if="props.vipInfo.vip_info?.length" class="info">
                        {{ props.vipInfo?.vip_info[0] }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    isVip: {
        type: Boolean,
        default: false,
    },
    userInfo: {
        type: Object,
        default: null,
    },
    vipInfo: {
        type: Object,
        default: () => {
            return {};
        },
    },
});
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-header {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: vws(360);
    background: linear-gradient(
            106.18deg,
            rgba(255, 255, 255, 0.7) -0.45%,
            rgba(255, 255, 255, 0.5) 100%
        ),
        #775bfa;
    .card {
        position: absolute;
        bottom: 0;
        left: vws(24);
        z-index: 2;
        overflow: hidden;
        width: vws(702);
        height: vws(168);
        border-radius: vws(16) vws(16) vws(0) vws(0);
        .bg-card {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .user-info {
        position: relative;
        z-index: 1;
        display: flex;
        padding: vws(36);
        .user-face {
            flex-shrink: 0;
            box-sizing: border-box;
            width: vws(100);
            height: vws(100);
            border: vws(2) solid #fff;
            border-radius: vws(50);
        }
        .user-name {
            display: flex;
            justify-content: center;
            overflow: hidden;
            padding: 0 vws(16);
            flex-grow: 1;
            flex-direction: column;
            .name {
                position: relative;
                display: flex;
                align-items: center;
                overflow: hidden;
                max-width: 100%;
                font-size: vws(32);
                font-weight: bold;
                color: #222;
                box-sizing: border-box;
                line-height: vws(40);
                text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .vip-icon {
                    padding-left: vws(8);
                    height: vws(38);
                    flex-shrink: 0;
                }
            }
            .info {
                display: flex;
                float: left;
                margin-top: vws(12);
                width: 100%;
                font-size: vws(22);
                font-weight: 300;
                color: rgba(34, 34, 34, 0.8);
                line-height: vws(22);
                img {
                    width: vws(8);
                    height: vws(14);
                }
            }
        }
        .ios-user-name {
            display: flex;
            align-items: center;
        }
    }
}

.is-vip {
    background: linear-gradient(
            106.18deg,
            rgba(255, 255, 255, 0.3) -0.45%,
            rgba(255, 255, 255, 0) 100%
        ),
        #775bfa;
    .user-name {
        .name {
            color: #fff !important;
        }
        .info {
            color: rgba(255, 255, 255, 0.8) !important;
        }
    }
}
</style>
