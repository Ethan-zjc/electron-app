<template>
    <div class="vip-pay">
        <div class="head">
            <div class="title">快看VIP会员</div>
            <div class="desc" v-if="activeItem.combo == 1">到期自动续费，可随时取消</div>
        </div>
        <!-- 档位信息 -->
        <div class="lists">
            <div class="scroll-list" v-if="membersList.length">
                <div
                    :class="{
                        'item-wrap': true,
                        'first-item': !index,
                        active: item.id == activeItem.id,
                    }"
                    v-for="(item, index) in membersList"
                    :key="item.id"
                    @click="choiceGoodTap(item)"
                >
                    <div class="contain">
                        <!-- 商品标题 -->
                        <div class="title">{{ item.title }}</div>

                        <!-- 商品价格 -->
                        <div class="price">
                            <span class="text">￥</span>
                            <span class="num">
                                {{ (item.real_price || 0) / 100 }}
                            </span>
                            <span class="oriprice">￥{{ item.markPruice }}</span>
                        </div>

                        <!-- 显示的优惠信息 -->
                        <div class="discount-info">
                            <span class="txt" v-if="item.discount_tips || item.description">
                                {{ item.discount_tips ? item.discount_tips : item.description }}
                            </span>
                        </div>

                        <!-- 赠送的kkb -->
                        <div class="give-kkb">
                            <div class="content" v-if="item.banner">
                                <img
                                    data-index="{{ index }}"
                                    class="banner-icon"
                                    :src="item.banner"
                                />
                            </div>
                        </div>

                        <!-- 右上角 icon -->
                        <div class="right-icon" v-if="item.icon">
                            <img class="icon" :src="item.icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 协议信息 -->
        <div class="protocol">
            <text>开通前请阅读《</text>
            <text class="word" @click="questionAllTap(2)">自动续费协议</text>
            <text>》和《</text>
            <text class="word" @click="questionAllTap(3)">会员服务协议</text>
            <text>》</text>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { getVipGoodListApi } from '@/api/vip-center.api';
import { ActiveItemInter } from '@/typings/vip-center';
// import { activeItemData, membersList } from '../mock';

const Console = console;
const router = useRouter();
const activeItem = ref<Partial<ActiveItemInter>>({});
const membersList = ref<Partial<ActiveItemInter>[]>([]);

const emit = defineEmits(['handleChoiceItem', 'handleClickProtocol']);

const choiceGoodTap = (item: any) => {
    const { id } = item;
    const data = activeItem.value ? activeItem.value : { id: 0 };
    if (data.id == id) {
        return false;
    }
    activeItem.value = item;
    emit('handleChoiceItem', activeItem.value);
};

const initData = async () => {
    try {
        const { code, data = {} } = await getVipGoodListApi();
        if (code != 200) {
            return false;
        }
        let { members = [] } = data;
        members = members[0] ? members[0] : {};
        const { recharge_goods = [] } = members;

        let membersData = [...recharge_goods];
        membersData.forEach((item) => {
            item.coupon = item.coupon ? item.coupon : { usable_list: [], unreachable_list: [] };
            item.usableCouponFirst = item.coupon.usable_list[0] ? item.coupon.usable_list[0] : null;
            item.markPruice = item.mark_price / 100; // 以元为单位
            item.realPrice = item.real_price / 100;
        });
        membersData = membersData.sort((a, b) => {
            return a.sequence - b.sequence;
        });
        membersList.value = membersData;
        activeItem.value = membersData[0] || {};

        emit('handleChoiceItem', activeItem.value);
    } catch (err) {
        Console.log(err);
    }
};

// 跳转协议
const questionAllTap = (e: number) => {
    emit('handleClickProtocol', e);
    router.push({ path: '/vip-protocol', query: { type: e == 2 ? 'renew' : 'serve' } });
};

defineExpose({
    initData,
});

onMounted(() => {
    initData();
});
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.vip-pay {
    margin-top: vws(30);
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 vws(24);
        height: vws(88);
        box-sizing: border-box;
        .title {
            font-size: vws(30);
            font-weight: bold;
            color: #222;
        }
        .desc {
            font-size: vws(24);
            color: #999;
        }
    }
    .lists {
        overflow-y: hidden;
        width: 100%;
        height: vws(252);
    }
    .protocol {
        margin-top: vws(24);
        text-align: center;
        line-height: vws(30);
        text {
            font-size: vws(24);
            font-weight: 400;
            color: #999;
        }
        .word {
            color: #222;
        }
    }
}
.scroll-list {
    // width: 100%;
    height: vws(280);
    white-space: nowrap;
    .item-wrap {
        position: relative;
        display: inline-block;
        overflow: hidden;
        margin-right: vws(16);
        width: vws(212);
        height: vws(252);
        box-sizing: border-box;
        &.active {
            .contain {
                border: vws(4) solid #775bfa;
                background: #f7f5ff;
                .price {
                    .text,
                    .num {
                        color: #775bfa;
                    }
                }
            }
        }
        &.first-item {
            margin-left: vws(24);
        }
        .contain {
            width: vws(212);
            height: vws(252);
            border: vws(2) solid #eee;
            border-radius: vws(12);
            box-sizing: border-box;
        }
        .title {
            overflow: hidden;
            margin-top: vws(36);
            width: 100%;
            font-size: vws(28);
            font-weight: bold;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #222;
            line-height: vws(34);
        }
        .price {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            overflow: hidden;
            margin-top: vws(12);
            width: 100%;
            height: vws(62);
            font-family: 'PingFang SC';
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-style: normal;
            .text {
                display: inline-block;
                font-size: vws(24);
                font-weight: bold;
                font-weight: 700;
                color: #222;
                line-height: vws(42);
            }
            .num {
                font-size: vws(52);
                font-weight: 700;
                color: #222;
                line-height: vws(62);
            }
            .oriprice {
                display: inline-block;
                margin-left: vws(4);
                font-size: vws(24);
                color: #999;
                line-height: vws(40);
                text-decoration-line: line-through;
            }
        }

        //折扣信息
        .discount-info {
            display: flex;
            justify-content: center;
            margin-top: vws(16);
            .txt {
                overflow: hidden;
                max-width: 100%;
                font-size: vws(22);
                border-radius: vws(19);
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #666;
                line-height: vws(28);
            }
        }
        .give {
            display: flex;
            justify-content: center;
            margin-top: vws(8);
            text {
                margin: auto;
                padding: vws(4) vws(12);
                font-size: vws(20);
                border: vws(1) solid rgba(255, 117, 26, 0.1);
                border-radius: vws(100);
                color: #ff751a;
                background: #fff2e9;
            }
        }

        //赠送的kkb
        .give-kkb {
            display: flex;
            padding-top: vws(8);
            .content {
                position: relative;
                //padding: 0 14);
                display: flex;
                align-items: center;
                .banner-icon {
                    position: absolute;
                    top: 0;
                    left: vws(-12);
                    width: vws(210);
                    height: vws(68);
                    background: none;
                }
            }
        }
        .combo {
            position: absolute;
            top: vws(-2);
            right: vws(-2);
            z-index: 2;
            width: vws(96);
            height: vws(32);
            font-size: vws(20);
            border-radius: vws(0) vws(16) 0 vws(12);
            text-align: center;
            color: #fff;
            background: linear-gradient(90deg, #ff257f 0.17%, #ff0047 100%);
            line-height: vws(32);
        }

        //右上角的icon
        .right-icon {
            position: absolute;
            top: vws(3);
            right: 0;
            width: auto;
            height: vws(32);
            background: none;
            img {
                position: relative;
                top: vws(-3);
                right: 0;
                width: vws(210);
                height: vws(32);
            }
        }
    }
}
::-webkit-scrollbar {
    display: none;
}
</style>
