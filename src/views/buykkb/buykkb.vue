<template>
    <div class="container" style="display: flex; flex-direction: column">
        <NavBar title="KK币充值" />

        <!--内容部分/顶部图-->
        <div class="kk-head">
            <!-- 背景图 -->
            <img class="top-bg" :src="kkbImgs.topBg" />

            <!-- 用户信息 -->
            <div class="user-box">
                <!-- 用户信息展示 -->
                <div class="user-info" @click="topLoginTap">
                    <img class="avatar" :src="avatar" />
                    <div class="infos" v-if="userInfo">
                        <div class="name">
                            <span>
                                {{ userInfo.nickname || '点击登录' }}
                            </span>
                        </div>
                        <div class="kkb">
                            <span class="title">余额:</span>
                            <span>{{ wallet || 0 }}KK币</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 充值选项 -->
        <div class="kk-recharge-option">
            <!-- 充值模块标题 -->
            <div class="recharge-title">
                <div class="name"><span>充值金额</span></div>
                <div class="subtitle" v-if="wordsInfo && wordsInfo.wallet_word">
                    <span>{{ wordsInfo.wallet_word }}</span>
                </div>
            </div>

            <!-- 充值选项列表 -->
            <div class="recharge-list">
                <div
                    v-for="(item, index) in rechargeList"
                    :key="item.id"
                    @click="choiceGoodTap(item)"
                    :class="{ 'list-items-wrap': true, isLeft: (index + 1) % 3 != 1 }"
                >
                    <div
                        :class="{
                            'list-item': true,
                            'items-active': item.id == activeItem.id,
                            'shot-activity': item.words_info && item.words_info.explain_text,
                        }"
                    >
                        <!-- 要充值的kkb -->
                        <div class="kkb">
                            <img class="kkb-icon" :src="item.kb_image_url" alt="" />
                            <span>{{ item.recharge_value }}</span>
                        </div>

                        <!-- 人民币 -->
                        <span class="rmb">￥{{ item.realPrice }}</span>

                        <!-- 赠送的KK币 -->
                        <div
                            class="free-kkb"
                            if="{{ item.words_info && item.words_info.explain_text  }}"
                        >
                            <span>{{ item.words_info.explain_text }}</span>
                        </div>

                        <!-- 角标 -->
                        <img
                            v-if="item.image_info?.icon_image"
                            class="items-label"
                            :src="item.image_info.icon_image"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 充值说明 -->
        <div class="explain-text" v-if="rechargeDesc">
            <div class="txt" v-html="rechargeDesc"></div>
        </div>

        <!-- 底部浮层 -->
        <div class="fixed-base" @click="clickPay">立即支付</div>
    </div>
</template>

<script setup lang="ts">
// const Console = console;
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { kkbImgs } from '@/assets/js/cdn';
import { getKkbListApi } from '@/api/buykkb.api';
import { utilGetDynamicData } from '@/helpers/utils';
import { ref, onMounted, defineAsyncComponent } from 'vue';
import usePay from '@/hooks/usePay';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));

interface KkbItemInter {
    id: number;
    kb_image_url: string;
    realPrice: number;
    words_info: {
        explain_text: string;
    };
    recharge_value: number;
    image_info: {
        icon_image: string;
    };
    real_price: number;
    present_value: number;
    sequence: number;
}

const store = useStore();
const router = useRouter();
const { payfrom, userId } = store.state;
const rechargeDesc = ref(
    '<p>购买说明：<br>1、本平台人民币与书币兑换比率：1元=100KK币。<br>2、购买书币时所赠送的KK币存在有效期，请参考具体活动说明；赠币逾期未消费的，将自动失效；您在本平台阅读付费漫画章节时将优先扣除赠送币。<br>3、若您是未满十八周岁的未成年人，在本平台购买书币前需获得法定监护人的同意，点击购买书币即视为您已经获得您法定监护人的明确同意。<br>4、本平台倡导理性消费，书币充值属于用户自主行为，购买成功后，本平台不支持退费服务，敬请谅解。<br>5、充值遇到问题，关注微信公众号“快看漫画club”会话框内输入问题可得到回复。</p>'
);
const wordsInfo = ref<
    Partial<{
        wallet_word: string;
    }>
>({});
const rechargeList = ref<Array<KkbItemInter>>([]);
const activeItem = ref<Partial<KkbItemInter>>({});
const avatar = ref('');
const wallet = ref(0);
const userInfo = ref<any>({});

const getRechargeDesc = async () => {
    const id = store.state.onRelease ? 102 : 59;
    const { data } = await utilGetDynamicData({ id });
    const { order_froms, desc } = data;

    if (desc && order_froms.includes(3)) {
        rechargeDesc.value = desc;
    }
};

const initData = async () => {
    const sendData = {
        from: payfrom,
    };
    try {
        getRechargeDesc();
        const { code = 0, data = {} } = await getKkbListApi(sendData);
        if (code == 200) {
            let { recharges = [] } = data;

            // 用户信息和余额
            wallet.value = data.user_account.non_ios_balance || 0;
            userInfo.value = data.user;
            avatar.value = data.user.avatar_url
                ? data.user.avatar_url
                : require('@/assets/img/avatar-default.png');

            // 充值信息S
            recharges = recharges[0] ? recharges[0] : {};
            const {
                words_info,
                recharge_goods,
                // recharge_type_desc,
            } = recharges;

            wordsInfo.value = words_info ? words_info : {};

            // 充值类型
            const rechargeListData = recharge_goods ? recharge_goods : [];

            // 格式化充值列表 S
            rechargeListData.forEach((item: any) => {
                item.realPrice = item.real_price / 100;
                item.words_info = item.words_info ? item.words_info : { explain_text: '' };
            });

            activeItem.value = rechargeListData[0];
            rechargeList.value = rechargeListData.sort((a: KkbItemInter, b: KkbItemInter) => {
                return a.sequence - b.sequence;
            });
        }
    } catch (error) {
        // Console.log(error);
    }
};

const topLoginTap = () => {
    if (!userId) {
        router.push({ path: '/login' });
    }
    return false;
};
const choiceGoodTap = (item: KkbItemInter) => {
    const { id } = item;
    const data = activeItem.value ? activeItem.value : { id: 0 };
    if (data.id == id) {
        return false;
    }
    activeItem.value = item;
};
const clickPay = async () => {
    const { id = 0, real_price = 0, recharge_value = 0, present_value = 0 } = activeItem.value;
    try {
        await usePay({
            good_item: {
                id,
                real_price,
                recharge_value,
                present_value,
            },
        });
        initData();
    } catch (e) {
        // Console.log('支付失败回调');
    }
};

onMounted(async () => {
    initData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.container {
    display: flex;
    padding-bottom: vws(96);
    width: 100%;
    height: 100%;
    background-color: #f7f9fa;
    flex-direction: column;
}

// 头部背景图(用户信息) S
.kk-head {
    position: relative;
    width: 100%;
    height: vws(184);
    background-color: #fff;
    .top-bg {
        width: 100%;
        height: vws(184);
        background: linear-gradient(180deg, rgba(255, 231, 38, 1) 0%, rgba(255, 231, 38, 1) 100%);
    }
    .user-box {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        height: vws(184);
        .user-info {
            display: flex;
            align-items: center;
            padding: vws(32);
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            .avatar {
                width: vws(120);
                height: vws(120);
                border: vws(4) solid white;
                border-radius: 50%;
            }
        }
        .infos {
            display: flex;
            justify-content: center;
            padding-left: vws(24);
            width: vws(360);
            height: vws(120);
            flex-direction: column;
            .name,
            .kkb {
                span {
                    overflow: hidden;
                    font-family: PingFangSC-Medium, 'PingFang SC';
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .name {
                span {
                    line-height: vws(32);
                    font-size: vws(32);
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                }
            }
            .kkb {
                span {
                    font-size: vws(24);
                    line-height: vws(24);
                    color: rgba(255, 255, 255, 1);
                }
            }
        }
    }
}

// 充值选项 S
.kk-recharge-option {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: vws(32) vws(32) vws(2);
    width: 100%;
    background-color: #fff;
    flex-direction: column;

    //模块标题
    .recharge-title {
        display: flex;
        align-items: flex-start;
        width: 100%;
        height: vws(38);
        flex-direction: row;
        .name {
            display: flex;
            align-items: center;
            height: 100%;
            flex-direction: row;
            span {
                padding-right: vws(8);
                font-size: vws(32);
                font-family: PingFangSC-Medium, 'PingFang SC';
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
            }
        }
        .subtitle {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 vws(10);
            height: vws(36);
            border-radius: vws(19);
            background-color: rgba(255, 122, 21, 0.08);
            span {
                overflow: hidden;
                max-width: vws(600);
                font-size: vws(24);
                text-overflow: ellipsis;
                color: #ff7a15;
                line-height: vws(24);
            }
        }
    }

    //充值列表 S
    .recharge-list {
        display: flex;
        padding-top: vws(32);
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        .list-items-wrap {
            position: relative;
            overflow: hidden;
            margin-bottom: vws(30);
            width: vws(220);
            height: vws(168);
        }
        .isLeft {
            margin-left: vws(13);
        }
        .list-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            // overflow: hidden;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border: vws(2) solid rgba(249, 246, 255, 1);
            border-radius: vws(12);
            background-color: #f9f6ff;
            flex-direction: column;
            .kkb {
                display: flex;
                justify-content: center; //中间适应
                align-items: center;
                .kkb-icon {
                    margin-right: vws(2);
                    width: vws(36);
                    height: vws(36);
                }
                span {
                    line-height: vws(40);
                    font-size: vws(40);
                    font-family: PingFangSC-Medium, 'PingFang SC';
                    font-weight: 500;
                    color: rgba(51, 51, 51, 1);
                }
            }
            .rmb {
                padding-top: vws(8);
                font-size: vws(24);
                font-family: PingFangSC-Regular, 'PingFang SC';
                text-align: center;
                color: rgba(153, 153, 153, 1);
                line-height: vws(24);
            }
            .free-kkb {
                padding-top: vws(8);
                span {
                    width: 100%;
                    font-size: vws(24);
                    font-family: PingFangSC-Regular, 'PingFang SC';
                    text-align: center;
                    color: #ff7a15;
                    line-height: vws(24);
                }
            }
            .items-label {
                position: absolute;
                top: vws(-2);
                right: vws(-2);
                z-index: 10;
                height: vws(32);
                background-position: right;
                background-repeat: no-repeat;
            }
        }
        .items-active {
            border: vws(2) solid rgba(255, 122, 21, 1);
            background-color: rgba(255, 255, 255, 1);
        }

        // 命中活动时的充值信息
        .shot-activity {
            .kkb {
                margin-top: vws(20);
            }
        }
    }
}

// 说明文案
.explain-text {
    padding: vws(32);
    width: 100%;
    background-color: #f7f9fa;
    box-sizing: border-box;
    .txt {
        padding-bottom: vws(100);
        width: 100%;
        font-size: vws(24);
        font-family: PingFangSC-Regular, 'PingFang SC';
        font-weight: 400;
        white-space: pre-wrap;
        color: #999;
        line-height: vws(36);
    }
}
.fixed-base {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: vws(96);
    font-size: vws(32);
    line-height: vws(96);
    font-family: PingFangSC-Medium, 'PingFang SC';
    font-weight: 500;
    border-top: vws(2) solid #eaeef0;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    background-color: rgba(255, 122, 21, 1);
    box-sizing: border-box;
}
</style>
