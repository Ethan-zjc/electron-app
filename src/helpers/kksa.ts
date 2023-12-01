/* 通用数据打点
 * event <string>: 事件名称
 * options <object>: 事件属性
 * 用法示例：track("OpenProgram", { key: value });
 */
import store from '@/store';
import { rqs } from '@/helpers/request';
import { Base64 } from 'js-base64';

const commonOptions = () => {
    const { channel, packageId, openId, userId, appletName, onRelease, onReleaseVersion } =
        store.state;
    return {
        mini_program_version: onRelease ? onReleaseVersion : '1.0.0',
        SourcePlatform: channel,
        AppletName: appletName,
        PackageId: packageId,
        MiniProgramID: openId,
        H5Page: location.href,
        IsLogin: !!userId,
        uid: userId,
    };
};

// 上报神策
export const kksaTrack = async (event = '', options = {}) => {
    if (!window.kksa) {
        return;
    }
    const common = commonOptions();
    const properties = {
        ...common,
        ...options,
    };
    window.kksa.track(event, properties);
};

export const kksaIdentify = () => {
    if (!window.kksa) {
        return;
    }
    if (store.state.openId || store.state.userId) {
        const id = store.state.userId || store.state.openId;
        window.kksa.identify(id);
    }
};

// 上报数仓
export const reportedTrack = async (event = '', options = {}) => {
    const { openId, userId } = store.state;
    const common = commonOptions();
    const data = {
        distinct_id: userId || openId || '',
        time: new Date().getTime(),
        event,
    };
    let properties = {};
    if (Object.prototype.toString.call(options) === '[object Array]') {
        properties = (options as any).map((item: any) => {
            return {
                ...common,
                ...item,
            };
        });
    } else {
        Object.assign(properties, common, options);
    }
    Object.assign(data, { properties });
    rqs({
        method: 'post',
        url: '/v1/app_data',
        data: { data: Base64.encode(JSON.stringify(data)) },
    });
};

// 集成神策和数仓上报
export const track = async (event = '', options = {}) => {
    const eventList = [
        'OpenProgram',
        'Consume',
        'ReadTopic',
        'ReadComic',
        'CommonItemImp',
        'CommonItemClk',
        'CommonPageOpen',
        'BeMembershipResult',
        'RechargeResult',
        'Like',
        'Share',
        'FavTopic',
        'ItemImp',
        'ItemClk',
        'Search',
    ];
    if (eventList.includes(event)) {
        // 过滤只报数仓事件
        const onceName = ['Share', 'ItemImp', 'ItemClk'];
        const isAry = Object.prototype.toString.call(options) === '[object Array]';
        reportedTrack(event, options);
        if (isAry || onceName.includes(event)) {
            return;
        }
    }
    kksaTrack(event, options);
};
