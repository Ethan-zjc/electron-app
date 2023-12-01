import routerHooks from '@/router';
import { utilShowToast, utilHideToast } from '@/helpers/utils';
import { utilCheckWallet, utilGetPointCharge, utilCheckVipInfo } from '@/helpers/behaviors';
import { postPayOrderApi, getOrderIdResultApi } from '@/api/pay.api';
import { setOpenId } from '@/hooks/useOpenId';
import { track } from '@/helpers/kksa';
import store from '@/store';
const global = store.state;

let _goodItem: any = {};
let _saInfos = {};
let _goodType = 1;
let _delayCheckOrder = 0;
let clickPayEvent = false;

const showLoading = () => {
    utilShowToast({
        title: '',
        type: 'loading',
    });
};

// 获取当前页面栈
const getPage = () => {
    const name = String(routerHooks.currentRoute.value.name);
    const pagesObj: { [key: string]: string } = {
        topic: '专题页',
        feed: '推荐页',
        comic: '漫画详情页',
        buykkb: 'KK币充值页',
        'vip-center': '小程序新会员中心页面',
    };
    return name ? pagesObj[name] : '';
};

/**
 * 埋点
 * @param {*} goods
 * @param {*} type
 */
const getPointChargeFun = ({
    PaymentsAccount = 0,
    KkAccount = 0,
    FailReason = '',
    eventName = '',
    isPay = false,
    IsRechargeSuccess = 'False',
} = {}) => {
    // 充值失败埋点 S PaymentsAccount
    utilGetPointCharge().then((res: any) => {
        const { LastRechargeTime, RechargeType } = res;
        const kksaRechargeResult: any = {};
        kksaRechargeResult.LatestBalance = store.state.wallet; // 需要页面引入
        kksaRechargeResult.IsRechargeVoucher = false; // 是否展示充值代金券活动
        kksaRechargeResult.RechargeVoucherActivityName = ''; // 充值送代金券活动名称
        kksaRechargeResult.LastRechargeTime = LastRechargeTime; // 最后充值时间
        kksaRechargeResult.RechargeType = RechargeType; // 累计充值次数
        kksaRechargeResult.SourcePlatform = global.channel; // 来源平台
        kksaRechargeResult.TopicName = '无';

        // 补充埋点
        Object.assign(kksaRechargeResult, _saInfos || {});

        // 充值特有属性
        if (isPay) {
            kksaRechargeResult.TriggerPage = getPage(); // 触发页面
            kksaRechargeResult.IsRechargeSuccess = IsRechargeSuccess; // 埋点使用是否充值成功 True/False
            kksaRechargeResult.FailReason = FailReason; // 充值失败原因
        }
        if (PaymentsAccount) {
            kksaRechargeResult.PaymentsAccount = PaymentsAccount; // 充值人民币金额
        }
        if (KkAccount) {
            kksaRechargeResult.KkAccount = KkAccount; // 埋点用的到账金额
        }

        // Console.log(eventName);
        track(eventName, kksaRechargeResult);
    });
};

// 会员充值结果上报
const trackBuyVipRes = (
    info: any,
    type: number,
    res: {
        errMsg?: string;
    }
) => {
    const buyState = !!type; // 支付成果还是失败的结果
    const couponNum = (info.coupon_model && info.coupon_model.coupon_amount) || 0; // 优惠券金额
    const { environment } = global;

    const data: any = {
        TriggerPage: getPage(),
        MembershipPrdName: info.order_title,
        MembershipDayCount: info.recharge_value,
        OriginalPrice: info.order_fee, // 优惠前价格 => 1200（分）
        CurrentPrice: info.pay_fee, // 当前价格 => 1200（分)
        IsFirstOpen: info.cost_type == 2,
        ChargePlatform: info.pay_type_name,
        Error: buyState ? '' : res.errMsg,
        IsVIPBuyDiscount: !!couponNum,
        DiscountPrice: couponNum,
        SourcePlatform: store.state.channel,
        VIPDiscountName: '',
        TopicName: '无',
    };
    if (environment === 'prod') {
        data.isBuySuccess = buyState; // 是否购买成功 => true/false
    } else {
        data.IsBuySuccess = buyState; // 是否购买成功 => true/false
    }

    track('BeMembershipResult', data);
};

// 订单失败上报
const trackErrPay = (errMsg?: string) => {
    // 需要将当前订单信息和失败返回等透传出来
    utilGetPointCharge().then((res: any) => {
        const { LastRechargeTime, RechargeType } = res;

        // 充值kkb总数结果 =  充值的kkb数据 + 充值赠送的kkb数量;
        const KkAccount = (_goodItem?.recharge_value || 0) + (_goodItem?.present_value || 0);

        const data = {
            TriggerPage: getPage(), // 触发页面
            PaymentsAccount: _goodItem.real_price || 0, // 充值人民币金额
            KkAccount, // 到账kk币金额
            IsRechargeSuccess: 'False', // 充值是否成功
            FailReason: errMsg || '', // 失败原因
            LastRechargeTime, // 最后充值时间
            RechargeType, // 累计充值次数
            SourcePlatform: global.channel, // 来源平台
            IsRechargeVoucher: false, // 暂无活动信息
            RechargeVoucherActivityName: '', // this.data.couponActivityName,
            TopicName: '', // this.data.couponInfo.topicName || "无"
        };
        Object.assign(data, _saInfos || {});

        track('RechargeResult', data);
    });
};

// 会员订单查询失败时信息整合
const handleTrackData = (err: { message?: string; errMsg?: string }) => {
    // 优惠金额
    const coupon_amount =
        _goodItem.coupon && _goodItem.coupon.usable_list
            ? _goodItem.coupon.usable_list.reduce((a: any, b: any) => {
                  a += b.amount;
              }, 0)
            : 0;

    const info = {
        order_title: _goodItem.title, // 会员套餐名称
        recharge_value: _goodItem.recharge_value, // 会员套餐时长
        order_fee: _goodItem.mark_price, // 优惠前价格
        pay_fee: _goodItem.real_price, // 当前价格
        cost_type: 0, // 是否首次开通
        pay_type_name: '', // 支付方式
        coupon_model: {
            coupon_amount,
        },
    };
    trackBuyVipRes(info, 0, {
        errMsg: err.message || err.errMsg,
    });
};

/**
 * 根据商品信息获取订单和支付信息
 * 关注传入信息pay_source、good_type、pay_info
 * payfrom没有使用确定
 * 传入goodInfos集合
 * goodInfos: {
 *    pay_source: 1, // 非必传，不传默认1 来源为我的钱包 2 活动页
 *    good_type: 1, // 非必传，不传默认1 为kkb充值 2: 会员
 *    good_item: {}, // 必传商品信息字段 id: 商品id, real_price: 充值人民币金额(未转换单位前，服务端下发)，recharge_value: 充值的kkb数量, present_value: 赠送的kkb数量，不传均按0处理
 *    pay_info: {}, // 非必传，埋点等所携带信息，例如third_activity
 *    sa_infos: {
 *        NoticeType: "" // 弹窗提醒类型
 *        ...
 *    }
 * }
 */
interface GoodInfosInter {
    pay_source?: number;
    good_type?: number;
    good_item: {
        id: number;
        real_price?: number;
        recharge_value?: number;
        present_value?: number;
    };
    pay_info?: any;
    sa_infos?: any;
}

const postPayOrder = (goodInfos: GoodInfosInter) => {
    return new Promise((resolve, reject) => {
        const { pay_source = 1, good_type = 1, good_item = {}, pay_info = {} } = goodInfos;
        const { id = 0, recharge_value = 0 }: any = good_item;
        const errorMessage = {
            title: '',
            type: 'error',
            mask: true,
            duration: 3000,
        };

        // 如果商品id不存在拦截
        if (!id) {
            utilShowToast(Object.assign(errorMessage, { title: '商品id不存在' }));
            reject(null);
            return;
        }
        const sendData: {
            pay_source: number;
            good_type: number;
            good_id: number;
            pay_info: any;
        } = {
            pay_source, // 下单来源  1:我的钱包  2:活动页
            good_type, // 1:充值kkb业务 2:会员充值业务
            good_id: id, // 商品id
            pay_info,
        };

        // 点击购买按钮信息上报
        if (good_type == 1) {
            getPointChargeFun({
                isPay: false,
                PaymentsAccount: recharge_value,
                eventName: 'ClickRechargeButton',
            });
        }
        // 跟据充值信息获取订单信息
        postPayOrderApi(sendData)
            .then((res: any) => {
                const { code, data, message } = res || {};
                if (code != 200) {
                    utilShowToast(Object.assign(errorMessage, { title: message }));
                    return null;
                }
                resolve(data);
            })
            .catch((err: any) => {
                utilShowToast(Object.assign(errorMessage, { title: err.message }));
                reject(null);
            });
    });
};

// 查询订单状态, 区分vip和kkb
const checkOrderStatus = (id: string) => {
    return getOrderIdResultApi({ order_id: id, type: _goodType }).then((res: any) => {
        const { code, data = {} } = res || {};
        const { pay_order = {} } = data || {};

        if (code == 200 && pay_order.pay_status == 2) {
            _delayCheckOrder = 0;
            return { status: true, result: res };
        }
        _delayCheckOrder++;
        if (_delayCheckOrder > 3) {
            _delayCheckOrder = 0;
            return { status: false, result: res };
        }
        return new Promise((resolve) => {
            setTimeout(async () => {
                resolve(await checkOrderStatus(id));
            }, 500 * _delayCheckOrder);
        });
    });
};

// 查询订单
const checkOrderId = async (id: string, cb: any) => {
    if (!id) {
        return false;
    }
    showLoading();

    try {
        const payResult = await checkOrderStatus(id);
        utilHideToast();

        const { status = false, result = {} } = payResult;
        const { pay_order = {}, kb_charge_result = {} } = result.data || {};
        if (status) {
            if (_goodType == 2) {
                await utilCheckVipInfo();
                utilShowToast({
                    title: '充值成功',
                    duration: 2000,
                });
                trackBuyVipRes(pay_order, 1, {}); // 上报会员开通结果埋点  1是成功
            } else {
                utilCheckWallet(); // 检查kk币余额

                const present_red_kkb = kb_charge_result.present_red_kkb || 0; // 充值是否送了代金券
                // const shotCouponText = kb_charge_result.present_red_pack > 0; // 充值的kkb数据

                const recharge_value = pay_order.recharge_value || 0; // 充值kkb总数结果 =  充值的kkb数据 + 充值赠送的kkb数量;

                const rechargeResult = recharge_value + present_red_kkb;

                getPointChargeFun({
                    isPay: true,
                    KkAccount: rechargeResult,
                    PaymentsAccount: pay_order.order_fee,
                    eventName: 'RechargeResult',
                    IsRechargeSuccess: 'True',
                });

                utilShowToast({
                    title: '充值成功',
                    duration: 2000,
                });
            }
            cb && cb(1);
        } else {
            cb && cb(0);
            handleTrackData(result || {});
        }
    } catch (err: any) {
        cb && cb(0);
        utilHideToast();
        handleTrackData(err || {});
    }
};

// 支付失败处理
const payError = async (good_type: number, pay_order: number, errMsg: string) => {
    if (good_type == 2) {
        trackBuyVipRes(pay_order, 0, { errMsg });
    } else {
        trackErrPay(errMsg); // 上报
    }
    const orderId = localStorage.getItem('_buy_order_id') || '';
    if (orderId) {
        localStorage.removeItem('_buy_order_id');
    }
};

// 支付成功处理失败有信息上报，需要包裹
const paySuccess = async () => {
    const orderId = localStorage.getItem('_buy_order_id') || '';
    return new Promise((resolve, reject) => {
        if (orderId) {
            localStorage.removeItem('_buy_order_id');

            // 查询订单
            checkOrderId(orderId, (res: any) => {
                if (res) {
                    resolve(1);
                } else {
                    reject();
                }
            });
        } else {
            reject();
        }
    });
};

// 统一充值方法，充值kkb、充值vip
// goods 商品信息
// type 充值类型kkb, vip
const usePay = async (goodInfos: GoodInfosInter) => {
    // 拦截防止重复点击
    if (clickPayEvent) {
        return Promise.reject();
    }
    clickPayEvent = true;
    try {
        const { good_type = 1, good_item = {}, sa_infos = {} } = goodInfos;
        const { log } = console;
        log('判断登录态授权1');
        await setOpenId();
        log('判断登录态授权2');
        const res: any = await postPayOrder(goodInfos);
        if (!res) {
            clickPayEvent = false;
            return Promise.reject();
        }

        // 下单后返回信息
        const { pay_data, pay_order = {} } = res || {};
        const order_id = pay_order.order_id || '';

        // if (pay_order.cost_type == 2) {
        //     // 会员签约商品设置
        // }

        // 本地存的订单id、商品信息，防止与页面部分参数冲突
        _goodItem = good_item;
        _saInfos = sa_infos;
        _goodType = good_type;

        // 种植存储加_防止与充值中心存储冲突
        localStorage.setItem('_buy_order_id', order_id);

        // 调取支付api
        const params = {
            productId: pay_data.product_id,
            bizOrderNo: order_id,
            mgcId: store.state.openId,
            appId: 'mgc8kdz56n16mal2',
            accessToken: store.state.accessToken,
        };
        return new Promise((resolve, reject) => {
            mt.requestMidasPayment({
                ...params,
                success: async () => {
                    clickPayEvent = false;
                    await paySuccess();
                    resolve(1);
                },
                fail: (res: any) => {
                    const { log } = console;
                    log('支付失败', res);
                    clickPayEvent = false;
                    payError(good_type, pay_order, res.message);
                    reject();
                },
                complete: () => {
                    clickPayEvent = false;
                },
            });
        });
    } catch (err: any) {
        clickPayEvent = false;
        return Promise.reject();
    }
};

export default usePay;
