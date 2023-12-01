import { rqs } from '@/helpers/request';
import store from '../../store';
/**
 * 发现页查看更多接口
 * **/
export const getModuleMore = ({
    moduleId = 0,
    since = 0,
    limit = 10,
    cardType = '',
    subtitle = '',
}: {
    moduleId: number;
    cardType: string;
    subtitle: string;
    since: number;
    limit: number;
}) => {
    const { channel = '', gender } = store.state;
    const url = `/mini/v1/comic/${channel}/discovery/module_more`;
    const method = 'get';
    const host = 'api';
    const data = {
        gender: gender == null ? 0 : gender,
        module_id: moduleId,
        since,
        card_type: cardType,
        subtitle,
        limit,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

/**
 * 推荐列表查看更多接口
 * **/
export const getRecommendMore = ({
    since = 0,
    limit = 10,
    recommend_by = '',
    recommend_type = '',
}: {
    recommend_by: string;
    recommend_type: string;
    since: number;
    limit: number;
}) => {
    const { channel = '', gender } = store.state;
    const url = `/v1/freestyle/mini/home_recommend/${channel}/more`;
    const method = 'get';
    const host = 'api';
    const data = {
        gender: gender == null ? 0 : gender,
        recommend_by,
        recommend_type,
        since,
        limit,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

export default {
    getModuleMore,
    getRecommendMore,
};
