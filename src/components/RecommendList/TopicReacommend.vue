<template>
    <div
        :class="{
            'comic-recommend': true,
            'observe-comic-recommend': true,
            'comic-recommend-border': !!border,
        }"
        v-if="visible"
    >
        <div class="comic-recommend-top">
            <span class="recommend-top-title">{{ maintitle }}</span>
            <div class="recommend-top-more" @click="tapMore">
                <span>更多</span>
                <img :src="comRecImgs['arrow-right']" />
            </div>
        </div>
        <div class="comic-recommend-content">
            <!-- 普通模块 -->
            <div class="comic-recommend-base" v-if="cardType == 1">
                <div class="recommend-base-list" id="horizon">
                    <template v-for="(item, index) in list" :key="index">
                        <div class="recommend-base-box">
                            <div class="info" @click="tapTopic(item)">
                                <div class="info-cover">
                                    <img v-lazy="item.src" />
                                </div>
                                <div class="info-tag" v-if="item.labelTop">
                                    <span>{{ item.labelTop }}</span>
                                    <div class="bg">
                                        <img :src="comRecImgs['c1']" />
                                    </div>
                                </div>
                                <div class="info-tips">
                                    <span>{{ item.labelBottom }}</span>
                                </div>
                            </div>
                            <div class="title">{{ item.title }}</div>
                            <div class="subtitle">{{ item.subTitle }}</div>
                        </div>
                    </template>
                    <div class="more" @click="tapMore">
                        <div class="more-icon">
                            <img :src="comRecImgs['more']" />
                        </div>
                        <div class="more-span">
                            <span>查</span>
                            <span>看</span>
                            <span>更</span>
                            <span>多</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 榜单模块 -->
            <div class="comic-recommend-rank" v-else-if="cardType == 2">
                <div class="recommend-rank-list">
                    <template v-for="(item, index) in list" :key="index">
                        <div class="recommend-rank-box">
                            <div class="info" @click="tapTopic(item)">
                                <div class="info-cover">
                                    <img v-lazy="item.src" />
                                </div>
                                <div class="info-tag">
                                    <img
                                        :src="comRecImgs[`${index > 3 ? 'top-3' : 'top-' + index}`]"
                                    />
                                    <span class="info-tag-top">TOP</span>
                                    <span class="info-tag-num">{{ item.sort }}</span>
                                </div>
                                <div class="info-tips">
                                    <span>{{ item.labelBottom }}</span>
                                </div>
                            </div>
                            <div class="title">{{ item.title }}</div>
                            <div class="subtitle">{{ item.subTitle }}</div>
                        </div>
                    </template>
                    <div class="more" @click="tapMore">
                        <div class="more-icon">
                            <img :src="comRecImgs['more']" />
                        </div>
                        <div class="more-span">
                            <span>查</span>
                            <span>看</span>
                            <span>更</span>
                            <span>多</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 精品模块 -->
            <div class="comic-recommend-common" v-else>
                <div class="recommend-common-list">
                    <template v-for="(item, index) in list" :key="index">
                        <div class="recommend-common-box">
                            <div class="info" @click="tapTopic(item)">
                                <div class="info-cover">
                                    <img
                                        :style="`width: ${item.width}px; height: ${item.height}px;`"
                                        v-lazy="item.src"
                                    />
                                </div>
                                <div class="info-tag" v-if="item.labelTop">
                                    <div class="info-tag-before">
                                        <img :src="comRecImgs['h1']" />
                                    </div>
                                    <div class="info-tag-icon">
                                        <img :src="comRecImgs['h3']" />
                                    </div>
                                    <span>{{ item.labelTop }}</span>
                                    <div class="info-tag-after">
                                        <img :src="comRecImgs['h2']" />
                                    </div>
                                </div>
                                <div class="info-tips" v-if="item.isShowTips">
                                    <div class="info-tips-bg">
                                        <div
                                            class="bg"
                                            style="background-image:url('{{ item.computedSrc }}')"
                                        ></div>
                                    </div>
                                    <div class="info-tips-mark"></div>
                                    <div class="info-tips-span">
                                        <div class="title">
                                            {{ item.title }}
                                        </div>
                                        <div class="subtitle">
                                            {{ item.subTitle }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="more" @clcik="tapMore">
                        <div class="more-icon">
                            <img :src="comRecImgs['more']" />
                        </div>
                        <div class="more-span">
                            <span>查</span>
                            <span>看</span>
                            <span>更</span>
                            <span>多</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { rqs } from '@/helpers/request';
import { utilAction } from '@/helpers/utils';
import { comRecImgs } from '@/assets/js/cdn';

const store = useStore();
const props = defineProps({
    tipShow: {
        type: Boolean,
        default: false,
    },
    chapterType: {
        type: String,
        default: '',
    },
    topicId: {
        type: [Number, String],
        default: 0,
    },
    topicTitle: {
        type: String,
        default: '',
    },
    comicId: {
        type: [Number, String],
        default: 0,
    },
    comicTitle: {
        type: String,
        default: '',
    },
    border: {
        type: Boolean,
        default: true,
    },
});

let recType = 1,
    recBy = '',
    cardId = 1;
const visible = ref(false);
const list = ref<
    Partial<{
        src: string;
        width: number;
        height: number;
        labelTop: string;
        labelBottom: string;
        isShowTips: boolean;
        computedSrc: string;
        title: string;
        subTitle: string;
        sort: string;
    }>[]
>([]);
const cardType = ref(-1);
const maintitle = ref('');

const getData = (value: any) => {
    const {
        card_type: card_type = 1,
        card_id,
        recommend_list: recList = [],
        recommend_type,
        recommend_by,
        title = '',
    } = value;
    const typeMap: { [key: number]: [number, number] } = {
        1: [218, 290],
        2: [218, 290],
        3: [290, 386],
    };
    const size = typeMap[card_type];
    const listAry = recList.map((item: any, index: number) => {
        const label = item.label || {};
        const idx = index + 1;
        const src = item.image_url || '';
        const width = size[0];
        const height = size[1];
        return {
            sort: idx < 10 ? `0${idx}` : String(idx),
            labelTop: label.left_top || '',
            labelBottom: label.right_bottom || '',
            recTrack: item.rec_data_report_map || {},
            action: item.action_protocol || {},
            title: item.title || '',
            subTitle: item.sub_title || '',
            computedSrc: src,
            isShowTips: false,
            src,
            width,
            height,
        };
    });

    if (listAry.length < 3) {
        return false;
    }

    recType = recommend_type || '';
    recBy = recommend_by || '';
    cardId = card_id;
    maintitle.value = title;
    (visible.value = true), (list.value = listAry), (cardType.value = card_type);
};

const initData = () => {
    const { channel, gender } = store.state;
    const { topicId: topic_id, comicId: comic_id } = props;
    rqs({
        url: `/mini/v1/comic/${channel}/comic/recommend`,
        data: {
            topic_id,
            comic_id,
            gender: gender == null ? 0 : gender,
        },
    }).then((res: any) => {
        const { code, data } = res;
        if (code == 200 && data) {
            getData(data);
        }
    });
};
const tapTopic = (item: any) => {
    const { type, target_id: id, parent_target_id: parentid } = item.action;
    utilAction({ type, id, parentid });
};
const tapMore = () => {
    const params: any = {
        type: 'comic',
        id: cardId,
        title: maintitle.value,
    };
    if (cardType.value != 3) {
        params.type = 'feed';
        params.recommend_title = maintitle.value;
        params.recommend_type = recType;
        params.recommend_by = recBy;
    }
    utilAction({ type: 10, params });
    // emit('handleRecommend', {
    //     type: 0,
    // });
};

onMounted(() => {
    initData();
});
</script>

<style lang="scss" scoped>
@import '../../assets/sass/common';

.comic-recommend {
    padding-bottom: vws(24);
    &-border {
        border-top: 1px solid #e8e8e8;
    }
    &-home {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: vws(24) auto 0;
        width: vws(702);
        height: vws(80);
        border-radius: vws(100);
        background: #fce140;
        img {
            width: vws(36);
            height: vws(36);
        }
        span {
            margin-left: vws(12);
            font-size: vws(28);
            font-weight: 400;
            color: #442509;
        }
    }
    &-top {
        display: flex;
        align-items: center;
        height: vws(104);
        .recommend-top {
            &-title {
                overflow: hidden;
                padding-right: vws(24);
                padding-left: vws(24);
                font-size: vws(32);
                font-weight: 500;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                flex: 1;
            }
            &-more {
                display: flex;
                align-items: center;
                padding-right: vws(32);
                font-size: vws(24);
                color: #999;
                img {
                    width: vws(24);
                    height: vws(24);
                }
            }
        }
    }
    &-content {
        padding-bottom: vws(24);
        .more {
            display: flex;
            justify-content: center;
            align-items: center;
            width: vws(80);
            height: vws(290);
            border-radius: vws(8);
            background: rgba(0, 0, 0, 0.05);
            flex-direction: column;
            flex-shrink: 0;
            &-icon {
                margin-bottom: vws(8);
                img {
                    width: vws(26);
                    height: vws(26);
                }
            }
            &-span {
                display: flex;
                font-size: vws(26);
                color: #999;
                line-height: vws(37);
                flex-direction: column;
            }
        }
    }
    &-rank {
        overflow: hidden;
        margin-top: vws(-12);
        height: vws(390);
        .recommend-rank-list {
            display: flex;
            overflow-x: scroll;
            padding-top: vws(12);
            padding-bottom: vws(20);
            padding-left: vws(24);
            height: auto;
        }
        .recommend-rank-box {
            padding-right: vws(16);
            width: vws(218);
            .info {
                position: relative;
                width: vws(218);
                height: vws(290);
                border-radius: vws(12);
                .info-cover {
                    overflow: hidden;
                    border-radius: vws(12);
                }
                .info-tips {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: vws(60);
                    border-radius: 0 0 vws(4) vws(4);
                    text-align: right;
                    background: linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0) 0%,
                        rgba(0, 0, 0, 0.5) 100%
                    );
                    span {
                        display: block;
                        overflow: hidden;
                        padding: vws(24) vws(12) 0 0;
                        font-size: vws(20);
                        font-weight: 500;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                    }
                }
                .info-tag {
                    position: absolute;
                    top: vws(-12);
                    left: vws(10);
                    display: flex;
                    width: vws(56);
                    height: vws(65);
                    text-align: center;
                    flex-direction: column;
                    img {
                        position: relative;
                        width: vws(56);
                        height: vws(65);
                    }
                    &-top {
                        position: absolute;
                        top: vws(8);
                        left: 0;
                        width: 100%;
                        font-size: vws(16);
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        text-align: center;
                        color: #fff;
                    }
                    &-num {
                        position: absolute;
                        top: vws(24);
                        left: 0;
                        width: 100%;
                        font-size: vws(24);
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        text-align: center;
                        color: #fff;
                    }
                }
            }
            .title {
                overflow: hidden;
                margin-top: vws(8);
                height: vws(50);
                font-size: vws(28);
                font-weight: 500;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                line-height: vws(50);
            }
            .subtitle {
                overflow: hidden;
                height: vws(30);
                font-size: vws(24);
                font-weight: 400;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #999;
                line-height: vws(30);
            }
        }
    }
    &-base {
        overflow: hidden;
        height: vws(378);
        .recommend-base-list {
            display: flex;
            overflow-x: scroll;
            padding-bottom: vws(20);
            padding-left: vws(24);
            height: auto;
        }
        .recommend-base-box {
            padding-right: vws(16);
            width: vws(218);
            .info {
                position: relative;
                overflow: hidden;
                width: vws(218);
                height: vws(290);
                border-radius: vws(12);
                .info-cover {
                    overflow: hidden;
                    height: 100%;
                    border-radius: vws(12);
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .info-tips {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: vws(60);
                    border-radius: 0 0 vws(4) vws(4);
                    text-align: right;
                    background: linear-gradient(
                        180deg,
                        rgba(0, 0, 0, 0) 0%,
                        rgba(0, 0, 0, 0.5) 100%
                    );
                    span {
                        display: block;
                        overflow: hidden;
                        padding: vws(24) vws(12) 0 0;
                        font-size: vws(20);
                        font-weight: 500;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                    }
                }
                .info-tag {
                    position: absolute;
                    top: vws(0);
                    left: vws(0);
                    display: flex;
                    align-items: center;
                    padding-left: vws(12);
                    height: vws(44);
                    text-align: left;
                    background: rgba(253, 226, 61, 0.98);
                    .bg {
                        position: absolute;
                        top: 0;
                        right: vws(-20);
                        z-index: 3;
                        width: vws(30);
                        height: vws(44);
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    span {
                        position: relative;
                        z-index: 5;
                        display: block;
                        overflow: hidden;
                        max-width: vws(160);
                        font-size: vws(20);
                        font-weight: 600;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #282028;
                    }
                }
            }
            .title {
                overflow: hidden;
                margin-top: vws(8);
                height: vws(50);
                font-size: vws(28);
                font-weight: 500;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
                line-height: vws(50);
            }
            .subtitle {
                overflow: hidden;
                height: vws(30);
                font-size: vws(24);
                font-weight: 400;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #999;
                line-height: vws(30);
            }
        }
    }
    &-common {
        overflow: hidden;
        height: vws(386);
        .recommend-common-list {
            display: flex;
            overflow-x: scroll;
            padding-bottom: vws(20);
            padding-left: vws(24);
            height: auto;
            .more {
                height: vws(386);
            }
        }
        .recommend-common-box {
            padding-right: vws(16);
            width: vws(290);
            .info {
                position: relative;
                width: vws(290);
                height: vws(386);
                border-radius: vws(12);
                .info-cover {
                    overflow: hidden;
                    border-radius: vws(12);
                }
                .info-tips {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    padding: 0 vws(16);
                    width: 100%;
                    height: vws(88);
                    border-radius: 0 0 vws(4) vws(4);
                    box-sizing: border-box;
                    &-bg {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        z-index: 3;
                        overflow: hidden;
                        width: 100%;
                        height: 100%;
                        filter: blur(vws(8));
                        .bg {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: vws(290);
                            height: vws(386);
                            background-size: cover;
                        }
                    }
                    &-mark {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        z-index: 4;
                        width: 100%;
                        height: 100%;
                        background: #000;
                        opacity: 0.06;
                    }
                    &-span {
                        position: relative;
                        z-index: 5;
                    }
                    .title {
                        overflow: hidden;
                        margin-top: vws(16);
                        font-size: vws(24);
                        font-weight: 500;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                    }
                    .subtitle {
                        overflow: hidden;
                        height: vws(30);
                        font-size: vws(20);
                        font-weight: 400;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fff;
                        line-height: vws(30);
                    }
                }
                .info-tag {
                    position: absolute;
                    top: vws(12);
                    left: vws(0);
                    display: flex;
                    align-items: center;
                    padding-left: vws(8);
                    height: vws(41);
                    text-align: left;
                    background: #232323;
                    &-before {
                        position: absolute;
                        top: vws(0);
                        left: vws(-4);
                        overflow: hidden;
                        width: vws(18);
                        height: vws(46);
                        img {
                            display: block;
                            width: vws(18);
                            height: vws(46);
                        }
                    }
                    &-icon {
                        position: absolute;
                        top: 50%;
                        left: vws(8);
                        margin-top: vws(-12);
                        width: vws(24);
                        height: vws(24);
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                    &-after {
                        position: absolute;
                        top: vws(0);
                        right: vws(-16);
                        overflow: hidden;
                        width: vws(18);
                        height: vws(46);
                        img {
                            display: block;
                            width: vws(18);
                            height: vws(46);
                        }
                    }
                    span {
                        position: relative;
                        z-index: 5;
                        display: block;
                        overflow: hidden;
                        margin-left: vws(28);
                        padding-top: 1px;
                        max-width: vws(180);
                        height: vws(40);
                        font-size: vws(20);
                        font-weight: 600;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #fde23d;
                        line-height: vws(40);
                    }
                }
            }
        }
    }
}
</style>
