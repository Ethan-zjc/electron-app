/* eslint-disable */
import { rqs } from '@/helpers/request';
import store from '../../store';

/**
 * ** getDiscoveryList 通用发现页接口      Get:/mini/v1/comic/{channel}/discovery/list
 * @param(参数):   备注
 * @channel          是必填项,默认:wechat    使用渠道channel有wechat、qq两种(url拼接)
 * @gender          是必填项,默认:0         用户性别 0-女性 1-男性 3-中性
 * @cold_boot      是必填项是,默认:1       是否冷启动 ，0：非冷启动，1 ：冷启动
 * **/
function getDiscoveryList({ cold_boot = 1, ad_topic_id = '', page = 0, count = 4 } = {}) {
    let { channel = '', gender } = store.state;
    let url = `/mini/v1/comic/${channel}/discovery/list`;
    let method = 'get';
    let host = 'api'; // 'api', 'search', 'pay'
    let data = {
        gender,
        cold_boot,
        ad_topic_id,
        page,
        count,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
}

/**
 * ** getDiscoveryModuleChange 通用发现页换一换接口      Get:/mini/v1/comic/{channel}/discovery/module_change
 * @channel               是必填项,默认:wechat    使用渠道channel有wechat、qq两种(url拼接)
 * @module_id           是必填项,默认:0         当前模块id
 * @filter_ids         是必填项,默认:[]        需要过滤的id
 * @card_type           是必填项,默认:0         模块推荐类型，透传发现页接口对应模块返回的card_type字段值
 * @gender               是必填项,默认:0         点前用户性别 0-女性 1-男性 3-中性
 * **/
function getDiscoveryModuleChange({
    module_id = 0,
    filter_ids = '[]',
    card_type = '',
    subtitle = '',
}: {
    module_id: number;
    filter_ids: string;
    card_type: string;
    subtitle?: string;
}) {
    let { channel = '', gender } = store.state;
    let url = `/mini/v1/comic/${channel}/discovery/module_change`;
    let method = 'get';
    let host = 'api'; // 'api', 'search', 'pay'
    let data = {
        module_id,
        filter_ids,
        card_type,
        gender: gender || 0,
        subtitle,
    };
    return rqs({
        url,
        method,
        host,
        data,
    });
}

export {
    getDiscoveryList, // 通用发现页接口
    getDiscoveryModuleChange, // 通用发现页换一换接口
};
