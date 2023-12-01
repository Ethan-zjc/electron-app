import { rqs } from '@/helpers/request';
import { ApiTopicParamsInter } from '@/typings/vip-center';

const getVipGoodListApi = () => {
    const url = '/v1/pay/member_good/h5_list';
    const method = 'get';
    const host = 'pay';
    const data = {};
    return rqs({
        url,
        method,
        host,
        data,
    });
};

const getVipTopicListApi = ({ offset, limit, order_from }: ApiTopicParamsInter) => {
    const url = '/v1/vip/banner/new_list';
    const method = 'get';
    const host = 'pay';
    const data = {
        offset,
        limit,
        order_from,
        is_cold_start: false,
        non_iap_supported_device: false,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

export { getVipGoodListApi, getVipTopicListApi };
