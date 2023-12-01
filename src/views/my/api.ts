import { rqs } from '@/helpers/request';
import store from '../../store';

const getMyList = ({ since = 0, size = 10, uid = '', type = 'history' } = {}) => {
    const hisUrl = `/mini/v1/comic/wechat/read_history/list`;
    const followUrl = `/mini/v1/comic/wechat/favourite/topic_list`;
    const url = type == 'history' ? hisUrl : followUrl;
    const data = {
        since,
        page_size: size,
        uid,
    };
    return rqs({
        url,
        data,
    });
};

const getVip = () => {
    const url = '/v1/vip/me';
    const data = {};
    return rqs({
        url,
        data,
        host: 'pay',
    });
};

const postHistoryDelete = (id: number) => {
    const { channel = '' } = store.state;
    const method = 'post';
    const url = `/mini/v1/comic/${channel}/read_history/delete`;
    const data = {
        record: JSON.stringify([{ topic_id: id }]),
    };
    return rqs({
        method,
        url,
        data,
    });
};

export { getMyList, getVip, postHistoryDelete };
