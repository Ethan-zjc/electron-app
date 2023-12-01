import { rqs } from '@/helpers/request';
/**
 * 搜索页结果列表
 * **/
export const getSearchTopic = ({
    page = 1,
    size = 10,
    q = '',
}: {
    q: string;
    page: number;
    size: number;
}) => {
    const url = `/search/mini/topic/title_and_author`;
    const method = 'get';
    const host = 'search';
    const data = {
        q,
        page,
        size,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

/**
 * 搜索关联词
 * **/
export const getSearchSug = ({ q = '' }: { q: string }) => {
    const url = `/search/mini/suggest`;
    const method = 'get';
    const host = 'search';
    const data = {
        q,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

export const getSearchHot = ({ since = 0 }: { since: number }) => {
    const url = '/search/mini/hot_word_v2';
    const method = 'get';
    const host = 'search';
    const data = {
        since,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};
