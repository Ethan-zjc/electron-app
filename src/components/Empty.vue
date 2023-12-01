<template>
    <div class="kkmh-empty_img">
        <img
            class="img"
            src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/empty-img_5537d1d.png"
            style="object-fit: contain"
        />
        <img
            class="text"
            src="https://static3w.kuaikanmanhua.com/assets/img/remote_images/icons/empty-text_ef811e1.png"
            style="object-fit: contain"
        />
    </div>
</template>
<style lang="scss" scoped>
/* stylelint-disable */
@import '@/assets/sass/common';
.kkmh-empty_img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.kkmh-empty_img .img {
    width: vws(240);
    height: vws(240);
}

.kkmh-empty_img .text {
    width: vws(596);
    height: vws(66);
    margin-top: vws(20);
}
</style>
