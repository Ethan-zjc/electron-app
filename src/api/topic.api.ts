import { rqs } from '@/helpers/request';
import store from '../store';

const getTopicDetailApi = ({
    topic_id,
    sort = 'asc',
    page_source = 0,
}: {
    topic_id: number;
    sort: string;
    page_source: number;
}) => {
    const url = `/mini/v1/comic/${store.state.channel}/topic/detail`;
    const method = 'get';
    const host = 'api';
    const data = {
        topic_id,
        sort,
        page_source,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
};

const getTopicCatalogListApi = ({
    sort = 'asc',
    action = 1,
    page_size = 20,
    topic_id = 0,
    comic_id = 0,
    season_index = -1,
}) => {
    const url = `/mini/v1/comic/${store.state.channel}/topic/catalog`;
    const method = 'get';
    const data: any = {
        topic_id,
        comic_id,
        sort,
        action,
        page_size,
    };
    if (season_index && season_index >= 0) {
        data.season_index = season_index;
    }
    return rqs({
        url,
        method,
        data,
    });
};

const getTopicReadRecordApi = ({ topic_id = 0 }) => {
    const url = `/mini/v1/comic/${store.state.channel}/topic/read_record`;
    const method = 'get';
    const data = {
        topic_id,
    };
    return rqs({
        url,
        method,
        data,
    });
};

export { getTopicDetailApi, getTopicCatalogListApi, getTopicReadRecordApi };
