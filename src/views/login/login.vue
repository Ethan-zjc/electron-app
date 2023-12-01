<template>
    <NavBar />
    <div class="login">
        <div class="login-top">
            <img src="@/assets/img/logo.png" class="logo" />
            <span>登录</span>
        </div>
        <div class="login-content">
            <div class="login-button" @click="handleLogin">美团一键登录</div>
            <div class="login-choose">
                <span class="icon" @click="handleAllow">
                    <img
                        v-if="isAllow"
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/login-radio-2_62b2c5c.png"
                    />
                    <img
                        v-else
                        src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/login-radio-1_226afc3.png"
                    />
                </span>
                <span class="text">同意</span>
                <span class="link" @click="handleProtocol('private')">《快看隐私协议》</span>
                <span class="link" @click="handleProtocol('serve')">《用户服务协议》</span>
            </div>
        </div>

        <!-- 测试环境显示的按钮 -->
        <div
            v-if="develop"
            style="display: flex; flex-direction: column; align-items: center"
            class="develops"
        >
            <div>
                <span class="intro">以下按钮，仅在开发版/体验版/开发者工具上可见</span>
            </div>
            <div class="switch btn" @click="handleSwitch">
                <span class="txt">切换环境</span>
            </div>
            <div class="switch btn" @click="handleLocal">
                <span class="txt">本地模拟登录</span>
            </div>
            <div class="logout btn" @click="handleOut">
                <span class="txt">退出登录</span>
            </div>
        </div>
    </div>
    <ActionSheet
        v-model:show="isShowSheet"
        :actions="sheetList"
        cancel-text="取消"
        close-on-click-action
        @select="handleSheet"
    />
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue';
import { utilShowToast } from '@/helpers/utils';
import { loginCheck, loginHandle } from '@/hooks/useLogin';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ActionSheet } from 'vant';
import { utilLogout } from '@/helpers/behaviors';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));

const store = useStore();
const router = useRouter();

const envList = ['dev', 'stag', 'preview', 'prod'];
const envData = envList.map((item) => {
    const { environment } = store.state;
    const name = item == environment ? `${item} (当前)` : item;
    return { name };
});
const isAllow = ref<boolean>(true);
const develop = computed(() => {
    return !store.state.onRelease;
});
const isShowSheet = ref(false);
const sheetList = ref(envData);

const handleProtocol = (type: string) => {
    router.push({ path: '/protocol', query: { type } });
};
const handleJumpMy = () => {
    if (store.state.userId) {
        router.push({ path: '/my' });
    }
};

const handleAllow = () => {
    isAllow.value = !isAllow.value;
};
const handleLogin = async () => {
    const { userId } = store.state;
    if (!isAllow.value) {
        utilShowToast({
            title: '请先同意快看隐私协议',
            duration: 2000,
        });
        return false;
    }
    if (userId) {
        utilShowToast({
            title: '已登录',
            duration: 2000,
        });
        handleJumpMy();
        return false;
    }
    await loginHandle('no');
    handleJumpMy();
};

const handleSwitch = () => {
    isShowSheet.value = true;
};
const handleLocal = async () => {
    const uid = ''; // 1100061569
    const session = ''; // v1-GAgAAAAAAAAKfBggOCuvLVUb6Gm2Ic7M8LnDQUIVta8RZejzGxOmH2DEQv8A
    localStorage.setItem(
        'header',
        JSON.stringify({
            uid,
            session,
        })
    );
    try {
        await loginCheck();
        handleJumpMy();
    } catch (e) {
        utilShowToast({
            title: '模拟登录失败',
        });
    }
};
const handleOut = async () => {
    await utilLogout(false);
    store.commit('setStore', {
        key: 'logoutFlag',
        value: true,
    });
    router.push({ path: '/my' });
};
const handleSheet = (val: any, index: number) => {
    const { name } = val;
    const { environment } = store.state;
    if (name.indexOf(environment) > -1) {
        return false;
    } else {
        store.commit('setStore', {
            key: 'environment',
            value: envList[index],
        });
        handleOut();
    }
};
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';
.login {
    &-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: vws(120) vws(32) 0;
        .logo {
            width: vws(120);
            height: vws(120);
        }
        span {
            margin-top: vws(20);
            font-size: vws(32);
            font-family: PingFangSC, PingFangSC-Medium;
            text-align: center;
            color: #222;
        }
    }
    &-content {
        padding: vws(160) vws(90) 0;
    }
    &-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: vws(84);
        font-size: vws(32);
        font-weight: 500;
        border-radius: vws(58);
        color: #000;
        background: #ffe120;
    }
    &-choose {
        display: flex;
        justify-content: center;
        margin-top: vws(60);
        font-size: vws(24);
        color: #999;
        .icon {
            display: block;
            margin-right: vws(6);
            width: vws(32);
            height: vws(32);
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .link {
            color: #4990e2;
        }
    }
}

.develops {
    display: flex;
    align-items: center;
    padding: vws(100) vws(90) vws(100);
    flex-direction: column;
    .btn {
        display: flex;
        justify-content: center;
        // min-width: 100%;
        margin-top: vws(16);
        width: 96%;
        height: vws(100);
        font-size: vws(24);
        background-color: #f1f2f8;
        line-height: vws(100);
    }
    .intro {
        width: 100%;
        font-size: vws(24);
        text-align: center;
        color: #f43530;
        line-height: vws(24);
    }
    .txt {
        width: 100%;
        font-size: vws(24);
        text-align: center;
    }
    .switch {
        color: #333;
    }
    .logout {
        .txt {
            color: #f43530;
        }
    }
}
</style>
