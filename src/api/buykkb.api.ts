import { rqs } from '@/helpers/request';
// import store from '../store';

const getKkbListApi = ({ from = 3 }) => {
    const url = '/v2/kb/recharge_good/list_h5';
    const method = 'get';
    const host = 'pay';
    const data = {
        from,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

export { getKkbListApi };
