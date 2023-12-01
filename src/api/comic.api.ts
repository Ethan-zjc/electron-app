import { rqs } from '@/helpers/request';
import { ReportComicReadInter } from '@/typings/comic';
import store from '../store';

const getComicDetailApi = ({
    topic_id,
    comic_id,
}: {
    topic_id: number;
    comic_id: string | number;
}) => {
    const url = `/mini/v1/comic/${store.state.channel}/comic/detail`;
    const method = 'get';
    const host = 'api';
    const data: { topic_id?: number; comic_id: string | number } = {
        comic_id,
    };
    if (topic_id) data.topic_id = topic_id;
    return rqs({
        url,
        method,
        host,
        data,
    });
};

const comicReportApi = (data: Partial<ReportComicReadInter>) => {
    const url = `/mini/v1/comic/${store.state.channel}/comic/report_view`;
    const method = 'post';
    const host = 'api';
    return rqs({
        url,
        method,
        host,
        data: { view_rate: JSON.stringify([data]) },
    });
};

const getPayInfoApi = ({ topicId = 0, comicId = 0 }) => {
    const url = '/v2/comicbuy/comic_price_info_h5';
    const method = 'post';
    const host = 'pay';
    return rqs({
        url,
        method,
        host,
        data: { topic_id: topicId, comic_id: comicId, from: store.state.payfrom },
    });
};

const autoPaidApi = ({
    comicId,
    encrypt,
    report,
    autoPay,
    spendCouponId = 0,
    spendCouponRecordId = 0,
}: {
    comicId: number;
    encrypt: string;
    report: any;
    autoPay: boolean;
    spendCouponId?: number;
    spendCouponRecordId?: number;
}) => {
    const url = '/v2/comicbuy/encrypt_buy_h5';
    const method = 'post';
    const host = 'pay';
    const data = {
        comicbuy_encrypt_str: encrypt,
        auto_pay: autoPay,
        source: report.auto_paid ? 2 : 3,
        from: store.state.payfrom,
        target_id: comicId,
        cps: store.state.cps,
        app_id: store.state.appId || '', // 来源appId
        scene: '',
    };
    if (spendCouponId) {
        Object.assign({}, data, {
            spend_coupon_id: spendCouponId,
        });
    }
    if (spendCouponRecordId) {
        Object.assign({}, data, {
            spend_coupon_record_id: spendCouponRecordId,
        });
    }
    return rqs({
        url,
        method,
        host,
        data,
    });
};

const getPopTypeApi = ({
    comicId,
    topicId,
    autobuy,
}: {
    comicId: number;
    topicId: number;
    autobuy: boolean;
}) => {
    const url = '/v2/comicbuy/comic_pop_ups_h5';
    const method = 'post';
    const host = 'pay';
    return rqs({
        url,
        method,
        host,
        data: {
            topic_id: topicId,
            comic_id: comicId,
            source: autobuy ? 2 : 3, // 漫画购买来源，2表示上一篇下一篇，3表示漫画列表页
        },
    });
};

const getPayPopApi = ({ topicId = 0, comicId = 0 }: { comicId: number; topicId: number }) => {
    if (!topicId || !comicId) {
        return Promise.reject();
    }
    const url = '/v2/comicbuy/comic_pay_window_h5';
    const method = 'post';
    const host = 'pay';
    return rqs({
        url,
        method,
        host,
        data: {
            topic_id: topicId,
            comic_id: comicId,
            source: 3,
            from: store.state.payfrom,
        },
    });
};

// 获取支付按钮信息
const getPayBtnGoodsApi = ({
    comic_price_list,
    topic_id,
}: {
    comic_price_list: string;
    topic_id: number;
}) => {
    const url = '/v1/pay/recharge_good/window_good';
    const method = 'get';
    const host = 'pay';
    const data = {
        comic_price_list,
        topic_id,
        from: store.state.payfrom,
    };

    return rqs({
        url,
        method,
        host,
        data,
    });
};

export {
    getComicDetailApi,
    comicReportApi,
    getPayInfoApi,
    autoPaidApi,
    getPopTypeApi,
    getPayPopApi,
    getPayBtnGoodsApi,
};
