import store from '../store';
import router from '../router';
import toast from './toast';
import { rqs } from './request';
import { utilLogout } from './behaviors';

/*
 * 通用跳转
 * @params {String} type        跳转类型，对应actionType，必填
 * @params {Number|String} id   专题id、章节id，等等，对应targetId，非必填
 * @params {String} url         hybrid url，对应targetUrl，非必填
 * @params {Object} params        自定义参数，会转化成字符串拼接到url，非必填
 * @params {redirect} Boolearn    是否重定向打开页面，非必填
 * https://wiki.quickcan.com/pages/viewpage.action?pageId=131008370
 */
const utilAction = ({
    type,
    id,
    params = {},
    parentid,
    redirect = false,
}: {
    type: number;
    id?: number;
    params?: any;
    parentid?: number;
    redirect?: boolean;
}) => {
    if ([21, 22, 44].includes(type) && !store.state.userId) {
        utilLogout(); // 需要登录且未登录
        return;
    }

    let page = '';
    const navigate = () => {
        const query: { [key: string]: string } = {};
        const index = page.indexOf('?');
        if (index >= 0 && index < page.length - 1) {
            const queryString = page.substring(index + 1);
            queryString.split('&').forEach((pair) => {
                const [key, value] = pair.split('=');
                query[key] = value || '';
            });
        }
        router[`${redirect ? 'replace' : 'push'}`]({
            path: page,
            query: Object.assign(params, query),
        });
    };

    if (type == 68 && !store.state.userId && parentid) {
        const topicHistory: any = localStorage.getItem('historyForTopic') || {};
        const obj = topicHistory[parentid] || {};

        // 轮播图支持指定章节
        id = obj.lastId ? obj.lastId : params && params.source == 'find-carousel' ? id || '' : '';
    }

    const pathUrl: { [key: number]: string } = {
        2: `/topic?id=${id}`,
        3: `/comic?id=${id}`,
        9: `/class?id=${id || 0}`,
        66: `/rank?id=${id || 0}`,
        15: '/find',
        21: '/wallet',
        22: '/buykkb',
        44: '/vip-center',
        10: '/topic-list',
        68: `/comic?id=${id || 0}&parentId=${parentid || ''}`,
    };
    page += pathUrl[type] ? pathUrl[type] : '';

    navigate();
};

/**
 * 图片格式化
 */
const utilFeSuffix = ({
    src,
    width,
    quality,
}: {
    src: string;
    width?: number;
    quality?: number;
}) => {
    const { log } = console;
    log(width);
    // const { ratio = 1, screenWidth = 750 } = store.state;
    // const rpxToPx = Math.ceil(width / 2);
    // const cssWidth = Math.floor((rpxToPx / 375) * screenWidth);
    const realWidth = 800, // cssWidth * ratio;
        format = 'webp',
        q = quality ? 'l' : 'h'; // h or l 两种质量 quality为true默认为低质量
    let target, newsrc;

    // 兼容老方法
    if (src.indexOf('imageMogr2') !== -1) {
        return src;
    }
    // 兼容脏数据
    newsrc = src;
    const reg =
        /-((c\.w\.i\d+|c\.w\d+|cw\.w\d+)|(fe\.w\d+)|(h\.w\d+)|(h\.w\.i\d+)|(icon)|(o\d+)|(o\.i\d+)|(t\.w\d+)|(w\d+)|(yyb)|(lw\d+))[\s\S]*$/g;
    if (reg.test(src)) {
        newsrc = src.replace(reg, '');
    } else if (/\.webp\.w\.jpg/.test(src)) {
        newsrc = src.replace(/\.webp\.w\.jpg/, '.webp');
    }

    // 过滤 gif
    if (/.gif$/.test(newsrc)) {
        return newsrc;
    }

    if (realWidth <= 50) {
        target = 50;
    } else if (realWidth <= 70) {
        target = 70;
    } else if (realWidth <= 90) {
        target = 90;
    } else if (realWidth <= 120) {
        target = 120;
    } else if (realWidth <= 180) {
        target = 180;
    } else if (realWidth <= 207) {
        target = 207;
    } else if (realWidth <= 320) {
        target = 320;
    } else if (realWidth <= 360) {
        target = 360;
    } else if (realWidth <= 414) {
        target = 414;
    } else if (realWidth <= 540) {
        target = 540;
    } else if (realWidth <= 563) {
        target = 563;
    } else if (realWidth <= 640) {
        target = 640;
    } else if (realWidth <= 720) {
        target = 720;
    } else if (realWidth <= 750) {
        target = 750;
    } else if (realWidth <= 828) {
        target = 828;
    } else if (realWidth <= 960) {
        target = 960;
    } else if (realWidth <= 1080) {
        target = 1080;
    } else if (realWidth <= 1125) {
        target = 1125;
    } else if (realWidth <= 1280) {
        target = 1280;
    } else if (realWidth <= 1440) {
        target = 1440;
    } else if (realWidth <= 1600) {
        target = 1600;
    } else if (realWidth <= 2160) {
        target = 2160;
    }

    return `${newsrc}-t.w${target}.${format}.${q}`;
};

/**
 * 转换数字 X亿 X万（大于10w）
 */
const utilTransNum = (el: number) => {
    const num = el + '';
    const len = num.length;
    if (len > 8) {
        return num.slice(0, -8) + '.' + num.slice(-8, -6) + '\u4EBF';
    } else if (len > 5) {
        return num.slice(0, -4) + '\u4E07';
    } else {
        return num;
    }
};

/*
 * 时间戳转换为时间
 * @params date    类型:Number|String   时间戳
 * @params format  类型:String          转换的事件的格式
 * format支持: 年:yyyy|yy  月:M|MM  日:d|dd  小时:h|hh 分:m|mm 秒:s|ss  链接符支持任意字符
 * format实例:
 *  'yyyy-MM-dd hh:mm:ss'
 *  'yyyy年MM月dd日 hh时mm分ss秒'
 *  'yy年M月d日'
 *  'hh:mm:ss'
 * return 格式化后的时间
 */
const utilFormatTime = (date: Date, format: string): string => {
    date = date || new Date();
    date = new Date(date);
    const map: Record<string, number> = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds(),
        q: Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds(),
    };

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        let v = String(map[t]);
        if (v !== 'undefined') {
            if (all.length > 1) {
                v = Number('0' + v).toString();
                v = v.substr(v.length - 2);
            }
            return v.toString();
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });

    return format;
};

/*
 * 显示toast提示，{ type, title, duratioin } 参数含义如下：
 * @params {String} title       toast内容，必填，支持换行（\n），如果传值为空不会显示toast
 * @params {Number} duration    控制显示时长，非必填，默认1500（毫秒）
 * @params {Boolean} postition  显示位置，非必填，默认middel，可选值top、bottom
 */
const utilShowToast = ({
    title,
    duration,
    position,
    type,
}: {
    title: string;
    duration?: number;
    position?: string;
    type?: string;
}) => {
    if (!title) {
        return;
    }
    toast.show({
        title,
        duration,
        position,
        type,
    });
};
const utilHideToast = () => {
    toast.hide();
};

const utilArrayArrange = (ary: any) => {
    const obj = {};
    const result = [];
    const len = ary.length;
    for (let i = 0; i < len; i++) {
        if (!(obj as any)[ary[i]]) {
            (obj as any)[ary[i]] = true;
            result.push(ary[i]);
        }
    }
    return result;
};

const utilGetDynamicData = ({ id = 0 }) => {
    if (!id) {
        return new Promise((resolve) => resolve(null));
    }
    const url = '/v1/miniactivity/param/config/search';
    const method = 'get';
    return rqs({
        url,
        method,
        data: { id },
    });
};

export {
    utilAction,
    utilFeSuffix,
    utilTransNum,
    utilShowToast,
    utilHideToast,
    utilFormatTime,
    utilArrayArrange,
    utilGetDynamicData,
};
