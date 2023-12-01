/*
 * 页面初始化
 */
import store from '@/store';
import { mtGetSystemInfo, mtGetMenuButtonBoundingClientRect } from '@/helpers/trans';
import { loginHandle } from '@/hooks/useLogin';
import { getOpenId } from '@/hooks/useOpenId';

const setTopBarHei = async () => {
    const { environment, systemInfo } = store.state;
    const isDev = environment == 'dev';
    let topBarOffset = 0;
    let topBarHei = 88;
    if (!isDev) {
        const { pixelRatio, screenWidth } = systemInfo as any;
        const size = 750 / (pixelRatio * screenWidth);
        const { height, top } = (await mtGetMenuButtonBoundingClientRect()) as any;
        topBarOffset = parseInt(String(size * top));
        topBarHei = parseInt(String(size * height));
    }
    store.commit('setStore', {
        key: 'topBarOffset',
        value: topBarOffset,
    });
    store.commit('setStore', {
        key: 'topBarHei',
        value: topBarHei + 12,
    });
};

const getSystemInfo = async () => {
    const { channel, onReleaseVersion } = store.state;
    const res: any = await mtGetSystemInfo();
    const model = res.model || 'Nexus';
    const system = res.system || '1.0';
    const platform = res.platform || 'android';

    const ratio = res.pixelRatio || 2;
    const screenWidth = res.screenWidth || 375;
    const screenHeight = res.screenHeight || 600;

    const versionText = String(onReleaseVersion.replace(/\./g, ''));
    const defVersion = parseInt(versionText + '00') + 330000;
    const minVersion = defVersion < 584000 ? 584000 : defVersion;

    const isiOS = platform == 'iOS' ? true : false;

    const haslt = model.indexOf('<') !== -1;
    const miniModel = haslt ? model.substring(model.indexOf('<') + 1, model.indexOf('>')) : model;

    const infos = `${isiOS ? 'iPhone' : 'Android'};${system};${miniModel}`;
    const userAgent = `KuaikanMiniProgram/1.0.0/${minVersion}(${infos};${channel};WIFI;${
        ratio * screenHeight
    }*${ratio * screenWidth})`;

    store.commit('setStore', {
        key: 'userAgent',
        value: userAgent,
    });
    store.commit('setStore', {
        key: 'isiOS',
        value: isiOS,
    });
    store.commit('setStore', {
        key: 'systemInfo',
        value: res,
    });
};

const initHandle = async () => {
    await getSystemInfo();
    await setTopBarHei();
    await getOpenId();
    await loginHandle();
};

export default initHandle;
