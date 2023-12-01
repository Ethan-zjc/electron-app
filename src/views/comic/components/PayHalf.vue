<template>
    <div class="pay-main">
        <div v-if="popType" :class="{ 'pay-content': true, anim: isShowPopup }">
            <HalfHead v-if="popType" :popType="popType" @handleActionVip="actionVip" />

            <div :class="{ 'pay-middle': true, 'border-m': popType == 3 || popType == 4 }">
                <!-- 1、普通付费弹窗类型 -->
                <HalfNormal
                    v-if="popType == 1"
                    :payData="payData"
                    @handleSwitch="tapChangeGear"
                    @handleClickPay="clickPayCallback"
                />

                <!-- 2、会员限免弹窗 3、会员专享提前看弹窗 4、会员专享固定话弹窗 -->
                <HalfVip
                    v-if="popType && popType != 1"
                    :popType="popType"
                    :vipData="vipData"
                    @handleActionVip="actionVip"
                />
            </div>

            <HalfFooter v-if="popType == 1" :payData="payData" @handleAutoPay="autoPaySwitch" />
        </div>
    </div>
</template>
<script setup lang="ts">
// const Console = console;
import { useStore } from 'vuex';
import { ref, onBeforeMount, defineAsyncComponent, provide } from 'vue';
import {
    HalfHeadDataInter,
    HalfVipDataInter,
    HalfPayDataInter,
    PointChargeInter,
} from '@/typings/comic';
import { getPayPopApi, getPayBtnGoodsApi } from '@/api/comic.api';
import { utilGetPointCharge } from '@/helpers/behaviors';
import { track } from '@/helpers/kksa';

const HalfHead = defineAsyncComponent(() => import('./HalfHead.vue'));
const HalfNormal = defineAsyncComponent(() => import('./HalfNormal.vue'));
const HalfVip = defineAsyncComponent(() => import('./HalfVip.vue'));
const HalfFooter = defineAsyncComponent(() => import('./HalfFooter.vue'));

const store = useStore();
const props = defineProps({
    baseInfo: {
        type: Object,
        default: () => ({}),
    },
});

// 付费弹窗类型（1: 普通付费 2: 会员限免 3: 会员提前看 4: 会员固定锁住）
const popType = ref(0);
const isShowPopup = ref(false);
const headData = ref<Partial<HalfHeadDataInter>>({});
const vipData = ref<Partial<HalfVipDataInter>>({});
const payData = ref<Partial<HalfPayDataInter>>({});
provide('payData', payData);
provide('headData', headData);

const textHandle = (str: string, separator: string) => {
    if (!str) {
        return '';
    }
    return str.split(separator);
};
const commonTrack = async ({ behavior = 0, eventName = 'PayPopup', clickParams = {} } = {}) => {
    const { topicId, comicId } = props.baseInfo;
    const res = (await utilGetPointCharge({
        comic_id: comicId,
        topic_id: topicId,
    })) as PointChargeInter;
    const { wallet = 0, price = 0, isvip, topicTit, comicTit } = payData.value;
    const { text1, text2 } = headData.value;

    // 付费相关通用埋点数据
    const payTrackData = {
        TriggerPage: 'ComicPage',
        TopicName: topicTit,
        ComicName: comicTit,
        LatestBalance: wallet, // 我的余额
        LastRechargeTime: res.LastRechargeTime, // 最后充值时间
        RechargeType: res.RechargeType, // 累计充值次数
        MembershipClassify: isvip ? 1 : 0, // 会员的身份 1会员，0非会员
    };

    let popActivityName = '',
        NoticeType = '付费';
    if (!store.state.userId) {
        popActivityName = (text1 && text1.join('')) + '您需要先登录才能查看哦';
        NoticeType = '登录';
        Object.assign({}, payTrackData, {
            NoticeType,
        });
    } else {
        if (!behavior) {
            // behavior为0是曝光
            if (popType.value == 1) {
                // 普通付费, 浮层运营位曝光上报参数
                const text11 = (text1 && text1.join('')) || '';
                const text22 = (text2 && text2.join('')) || '';
                popActivityName = text11 + text22;
                NoticeType = wallet < price ? '充值' : '付费';
            } else if (popType.value == 2) {
                popActivityName =
                    ((text1 && text1.join('')) || '') + ((text2 && text2.join('')) || '');
                NoticeType = '会员限免';
            }
            Object.assign({}, payTrackData, {
                NoticeType,
            });
        } else {
            Object.assign({}, payTrackData, {
                NoticeType,
                ...clickParams,
            });
        }
    }

    if (!behavior) {
        // 浮层运营位曝光上报(人物气泡)
        track('PayPopup', {
            PayActivityName: popActivityName,
            NoticeType: NoticeType || '',
            OperationName: '浮层运营文案',
            IsPayPopupShow: false,
            IsBatchPaidShow: false,
        });
    }

    const data = { ...payTrackData };

    // 限免类型弹窗
    if (popType.value == 2) {
        Object.assign({}, data, {
            IsVIPDiscount: vipData.value.IsVIPDiscount,
            VIPDiscountName: vipData.value.VIPDiscountName,
            VIPPrice: vipData.value.VIPPrice,
        });
    }
    Object.assign({}, data, {
        IsPayPopupShow: true,
        IsBatchPaidShow: false,
    });

    // console.log('付费弹窗上报埋点', eventName, data);
    track(eventName, data); // 埋点
};
const formatPayBase = (opitons: { index: number; batchPriceList: any[] }) => {
    const { index, batchPriceList } = opitons;

    const listItem = batchPriceList[index]; // 付费档位信息
    const encrypt = listItem.comicbuy_encrypt_str; // 支付(购买签名) 漫画购买加密串
    const priceInfo = listItem.price_info; // 价格信息
    const price = priceInfo.selling_kk_currency; // 实际需要支付的价格

    // 底部运营位信息 强提示
    const bottomVipBanner = listItem.text_info.bottom_vip_banners
        ? listItem.text_info.bottom_vip_banners[0]
        : '';
    const bottomVipBannerText = bottomVipBanner ? textHandle(bottomVipBanner.button_text, '@') : '';
    const activityName = bottomVipBanner ? bottomVipBanner.activity_name : '';

    // 返币icon，购买按钮的角标
    const iconInfo = listItem.icon || {};
    const payIconUrl = iconInfo.icon_url || '';

    // 满减卷信息
    const spend_coupon_view_list = listItem.spend_coupon_view_list || [];
    const spend_coupon_info = spend_coupon_view_list[0] || {};
    const spend_coupon_id = spend_coupon_info.spend_coupon_id || 0;
    const spend_coupon_record_id = spend_coupon_info.spend_coupon_record_id || 0;

    // 优惠信息
    const textInfo = listItem.text_info || {};
    const discountLabel = textInfo.discount_label || {};
    const marketInfo = textInfo.market_text || {};
    const market_text = marketInfo.text || '';

    const discountInfo = {
        discount_text: marketInfo.discount_text, // 优惠多少
        discount_left: discountLabel.left_text || '', // vip图标
        discount_right: discountLabel.right_text || '', // vip类型
        market_text, // 原价多少，删除线
        market_delete: false,
    };

    if (market_text) {
        discountInfo.market_delete = market_text.indexOf('$') > -1; // 优惠信息是否带删除线
        discountInfo.market_text = market_text.replace(/\$/g, ''); // 优惠信息左侧（原价）
    }

    // 优惠折扣
    if (priceInfo.total_discount) {
        priceInfo.total_discounts = parseFloat(String(priceInfo.total_discount / 10));
    }

    // 存储的折扣信息
    const discountIcons = marketInfo.icon_types.map((id: number) => {
        const typeMap: { [key: number]: string } = {
            2: '会员8.5折',
            3: '代金券免单',
            4: '券',
            6: '阅读币抵扣',
        };
        const label = typeMap[id] || '';
        const options = {
            id,
            label,
            color: '#FF751A',
            bgColor: 'rgba(255, 117, 26, 0.08)',
        };
        if (id == 2) {
            Object.assign(options, {
                color: '#6C01CF',
                bgColor: 'rgba(108, 1, 207, 0.08)',
            });
        }
        return options;
    });

    // 顶部通用运营位信息
    // const payTop = formatTopOperate({ data: textInfo.top_banners });

    return {
        price, // 实际需要支付的价格
        priceInfo, // 价格信息
        encrypt, // 支付(购买签名) 漫画购买加密串
        bottomVipBanner, // 底部运营位
        bottomVipBannerText, // 底部运营位处理文案
        activityName, // 活动名称
        payIconUrl, // 购买按钮角标
        discountIcons, // 折扣信息
        spendCouponId: spend_coupon_id, // 满减卷信息
        spendCouponRecordId: spend_coupon_record_id, // 满减卷信息
        discountInfo, // 优惠信息
    };
};
const formatHeadBubble = ({ pic_text_banners = [] }: { pic_text_banners: any[] }) => {
    const {
        text1 = '',
        text2 = '',
        action_target = {},
    } = pic_text_banners.length ? pic_text_banners[0] : {};
    const headData: Partial<HalfHeadDataInter> = {
        text1: ['章节尚未解锁'],
        text2: [store.state.userId ? '解锁后即可阅读哦' : '您需要先登录才能查看哦'],
    };

    if (text1 || text2) {
        const textInfos = {
            text1: textHandle(text1, '#'),
            text2: textHandle(text2, '#'),
        };
        Object.assign(headData, textInfos);

        // 有跳转相关
        if (action_target.action_type) {
            const params = {
                action_type: action_target.action_type,
                target_id: action_target.action_type,
                target_web_url: action_target.target_web_url,
            };
            Object.assign(headData, { action_target: params });
        }
    }

    return headData;
};
const getBtnText = async (price: number) => {
    try {
        const res = await getPayBtnGoodsApi({
            comic_price_list: JSON.stringify([price]),
            topic_id: props.baseInfo.topicId,
        });
        if (res.code == 200) {
            const { data = {} } = res,
                { recharges = [] } = data,
                { recharge_goods = [] } = recharges[0],
                { buy_title } = recharge_goods[0] || {};

            Object.assign({}, payData.value, {
                payBtnText: buy_title || '余额不足，立即充值',
            });
        }
    } catch (err) {
        // Console.log(err);
    }
};
const formatPayInfo = ({ data = {} }: any) => {
    const balance = data.kk_currency_balance;
    const wallet = balance < 0 ? 0 : balance; // 当前用户kk币余额
    const batchPriceList = data.batch_purchase_list; // 批量购档位
    const bannerInfo = data.pic_text_banners || []; // 运营位信息  主要获取对话框展示的信息
    const remember = data.auto_pay_reminder; // 是否支持自动购买/是否主动显示自动购买

    // 阅读券信息
    const readCoupon = data.coupon || {};
    const readCouponCount = readCoupon.coupon_count || 0;
    const isReadCoupon = readCouponCount > 0;

    const options = formatPayBase({
        index: 0, // 购买列表索引
        batchPriceList, // 批量购列表
    });

    // 需要存储的数据
    headData.value = formatHeadBubble({ pic_text_banners: bannerInfo });
    const setData = {
        ...options,
        wallet, // 当前用户kk币余额
        autoPay: remember && remember.show ? remember.selected : data.autoPay,
        isvip: data.vip_info && data.vip_info.is_vip, // 用户是否为vip用户
        payBtnText: wallet < options.price ? '余额不足，立即充值' : '确认支付',
        batchPriceList, // 批量购档位
        batchPriceIndex: 0, // 重置档位
        isReadCoupon, // 是否展示阅读券弹窗
        readCouponCount, // 阅读券余额
        isRecharge: wallet < options.price,
        topicId: props.baseInfo.topicId,
        comicId: props.baseInfo.comicId,
        topicTit: props.baseInfo.topicTit,
        comicTit: props.baseInfo.comicTit,
    };

    // 余额不足 请求余额不足的按钮
    if (wallet < options.price && !!store.state.userId) {
        getBtnText(options.price);
    }

    payData.value = setData;
};
const formatSinglePrice = ({ data = {} }: any) => {
    const balance = data.balance;
    const wallet = balance < 0 ? 0 : balance; // 当前用户kk币余额
    const encrypt = data.comicbuy_encrypt_str; // 支付(购买签名) 漫画购买加密串
    const priceInfo = data.price_info; // 价格信息
    const price = priceInfo.selling_kk_currency; // 实际需要支付的价格
    const autoPay = data.auto_pay; // 是否自动支付

    payData.value = Object.assign({}, payData.value, {
        wallet,
        price,
        encrypt,
        priceInfo,
        autoPay,
    });

    commonTrack();
};
const formatVipData = ({ data = {}, status = 2 }: any) => {
    const {
            content,
            charge_vip_info,
            pic_text_banners,
            suggest_title: suggestTitle,
            vip_free_suggest: vipTopicList,
        } = data,
        { title: vipTitle, comics } = content || {},
        {
            text1: btnLeftText,
            text2: btnRightText,
            text3: originalPrice,
            bubble_text: bubbleText,
        } = charge_vip_info;

    // 判断是否命中会员优惠券
    let IsVIPDiscount = false; // this.data.IsVIPDiscount;
    if (charge_vip_info.coupon_record_id && charge_vip_info.coupon_title) {
        IsVIPDiscount = true;
    }

    // 顶部头像气泡信息
    headData.value = formatHeadBubble({ pic_text_banners });

    // 会员弹窗信息
    const vipInfo: HalfVipDataInter = {
        topicId: props.baseInfo.topicId,
        comicId: props.baseInfo.comicId,
        btnRightText,
        bubbleText: bubbleText || '',
        btnLeftText: textHandle(btnLeftText, '*'),
        originalPrice: textHandle(originalPrice, '$'),
        IsVIPDiscount,
        VIPDiscountName: charge_vip_info.coupon_title || '',
        VIPPrice: charge_vip_info.price || '',
        PUWID: '', // this.data.activityId,
        vipTopicList: [],
        suggestTitle: [],
        comics: [],
        vipTitle: [],
        coverUrl: props.baseInfo.coverUrl,
        topicTitle: props.baseInfo.topicTit,
    };
    if (status == 2) {
        vipInfo.vipTopicList = vipTopicList;
        vipInfo.suggestTitle = textHandle(suggestTitle, '#');
    } else if (status == 3 || status == 4) {
        vipInfo.comics = comics;
        vipInfo.vipTitle = textHandle(vipTitle, '#');
        vipInfo.topicTitle = props.baseInfo.topicTit;
    }
    vipData.value = vipInfo;
};

const payMainRequest = () => {
    const { topicId, comicId } = props.baseInfo;
    getPayPopApi({ topicId, comicId }).then((res: any) => {
        const {
            pop_ups_type = 1, // 弹窗类型
            vip_enjoy = {}, // 会员（3，4）
            vip_free = {}, // 会员限免（2）
            // pre_comic_price = {}, // 定向限免、充值礼包等信息
            price_info = {}, // 付费信息（普通购买&批量购）
            single_comic_price = {}, // 单个付费信息
        } = res.data;

        if (pop_ups_type == 1) {
            // 处理普通付费信息
            formatPayInfo({ data: price_info });
        } else {
            if (pop_ups_type == 2) {
                formatSinglePrice({ data: single_comic_price });

                // 会员限免弹窗
                formatVipData({ data: vip_free, status: 2 });
            } else if (pop_ups_type == 3 || pop_ups_type == 4) {
                // 提前看，固定锁住
                formatVipData({ data: vip_enjoy, status: pop_ups_type });
            }
        }
        isShowPopup.value = true;
        popType.value = pop_ups_type; // 设置付费弹窗状态
    });
};

const tapChangeGear = (index: number) => {
    const { batchPriceList, wallet = 0 } = payData.value;

    const options = formatPayBase({
        index, // 购买列表索引
        batchPriceList, // 批量购列表
    });

    const params = {
        ...options,
        batchPriceIndex: index,
    };

    // 余额不足 请求余额不足的按钮
    if (wallet < options.price && !!store.state.userId) {
        getBtnText(options.price);
    } else {
        Object.assign({}, payData.value, {
            payBtnText: '确认支付',
        });
    }
    payData.value = Object.assign({}, payData.value, params);
};
const autoPaySwitch = (val: boolean) => {
    payData.value.autoPay = val;
};
const actionVip = () => {
    if (popType.value == 2) {
        const params = {
            behavior: 1,
            eventName: 'ClickPayPopup',
            clickParams: {
                ButtonName: '会员限免',
                ButtonType: '会员限免',
            },
        };
        commonTrack(params);
    }
};
const clickPayCallback = () => {
    const options = {
        ButtonName: payData.value.payBtnText,
        ButtonType: payData.value.isRecharge ? '充值按钮' : '购买按钮',
    };
    commonTrack({
        behavior: 1,
        eventName: 'ClickPayPopup',
        clickParams: options,
    });
};

onBeforeMount(() => {
    payMainRequest();
});
</script>
<style lang="scss" scoped>
@import '../../../assets/sass/common';
.pay-main {
    position: fixed;
    top: 0;
    left: 50%;
    z-index: 199;
    overflow: hidden;
    width: 100%;
    max-width: vws(750);
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    transform: translateX(-50%);
    .pay-content {
        position: absolute;
        bottom: 0;
        z-index: 10;
        // transform: translateY(100%);
        display: flex;
        width: 100%;
        transition: transform 0.18s;
        flex-direction: column;
    }
    .anim {
        transform: translateY(0);
    }
    .pay-middle {
        position: relative;
        display: flex;
        padding: vws(34) 0 0;
        background-color: #fff;
        flex-direction: column;
        flex: 1;
        &.border-m {
            border-radius: vws(20) vws(20) 0 0;
        }
    }
}
</style>
