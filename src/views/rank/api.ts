import { rqs } from '@/helpers/request';
import store from '../../store';

export const getRankList = ({ need_ranks = false, since = 0, limit = 20, rank_id = 0 } = {}) => {
    const { channel = '' } = store.state;
    const url = `/mini/v1/comic/${channel}/rank_list`;
    const method = 'get';
    const host = 'api';
    const data = {
        need_ranks,
        since,
        limit,
        rank_id,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};
