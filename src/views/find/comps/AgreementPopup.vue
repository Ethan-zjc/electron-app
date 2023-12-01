<template>
    <div v-if="showPopup" class="agreement-wrap">
        <div class="agreement-content">
            <h3 class="agreement-content__title">快看服务协议</h3>
            <p class="agreement-content__desc">
                欢迎使用快看！在您使用快看产品或服务前，请您认真阅读并充分理解快看隐私政策，当您点击同意，并开始使用产品服务时，即表示您已经理解并同意该条款内容，该条款将对您产生法律约束力。阅读条款将会产生流量消耗。
            </p>
            <p class="agreement-content__link" @click="handleProtocol('private')">
                点击查看
                <span>《快看隐私政策》</span>
            </p>
            <p class="agreement-content__link" @click="handleProtocol('serve')">
                点击查看
                <span>《快看服务协议》</span>
            </p>

            <div class="agreement-content__agree" @click="handleAgree">同意</div>
            <div class="agreement-content__not-agree" @click="handleNoagree">不同意</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { mtExitMiniProgram } from '@/helpers/trans';
import { useRouter } from 'vue-router';

const router = useRouter();

const showPopup = ref(false);

// 同意协议
const handleAgree = () => {
    localStorage.setItem('privacyPolicyShown', 'true');
    showPopup.value = false;
};

// 不同意协议
const handleNoagree = () => {
    mtExitMiniProgram();
};

// 查看协议
const handleProtocol = (type: string) => {
    router.push({ path: '/protocol', query: { type } });
};

// 未同意协议时，弹出弹窗
!localStorage.getItem('privacyPolicyShown') && (showPopup.value = true);
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/common';
.agreement-wrap {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2001;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);

    .agreement-content {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: vws(48) vws(40);
        width: vws(574);
        border-radius: vws(24);
        background: #fff;
        transform: translate(-50%, -50%);
        box-sizing: border-box;

        &__title {
            font-size: vws(34);
            font-weight: 550;
            text-align: center;
            color: #222;
            line-height: vws(42);
        }

        p {
            font-size: vws(30);
            color: #666;
            line-height: vws(36);
            letter-spacing: 1.1;
        }

        &__desc {
            margin-top: vws(16);
        }

        &__link span {
            color: #6f93bd;
        }

        &__agree {
            margin: vws(48) auto 0;
            width: vws(494);
            height: vws(88);
            font-size: vws(32);
            font-weight: 550;
            border-radius: vws(44);
            text-align: center;
            color: #222;
            line-height: vws(88);
            background: #ffe120;
        }

        &__not-agree {
            margin-top: vws(16);
            padding-bottom: vws(6);
            height: vws(66);
            font-size: vws(28);
            text-align: center;
            color: #999;
            line-height: vws(66);
        }
    }
}
</style>
