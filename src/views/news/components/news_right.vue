<template>
    <div class="news-right-wrap">
        <div class="ctx-right">
            <div class="box-item cate-wrap">
                <div class="right-title flex">
                    <span class="marker"></span>
                    新闻分类
                </div>
                <div class="cate-box">
                    <div class="cate-list">
                        <div class="cate-item" v-for="(item, index) in cate_list" :key="index"
                            :class="{ active: item.id == $route.query.cid || item.id == current_cid }"
                            @click="do_toggle_cate(item)">
                            {{ item.title }} 
                        </div>
                    </div>
                </div>
            </div>

            <div class="box-item suggest-wrap">

                <div class="right-title flex">
                    <span class="marker"></span>
                    最新资讯
                </div>
                <div class="suggest-poster scale-box" v-if="first_suggest.thumb">
                    <img class="scale-img" :src="first_suggest.thumb" alt="">
                </div>
                <div class="suggest-list">
                    <div class="suggest-item flex" v-for="(item, index) in suggest_news" :key="index">
                        <span class="dot"></span>
                        <router-link class="ellipsis-1" :to="'/news-detail?id=' + item.id"> {{ item.title }}
                        </router-link>
                        <!-- <div class="date">
                    {{ item.dtTime.substr(0, 10) }}
                  </div> -->
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>

import { mapState } from "vuex";

export default {
    name: "index",
    components: {},
    props: {
        current_cid: {//当前新闻分类 channelId
            type: String,
            default:'',
            required: false,
        }
    },
    data() {
        return {
            cate_list: [],
            suggest_news: [],
            first_suggest: {},
            //
        };
    },
    computed: {
        ...mapState([""]),
    },
    watch: {

    },
    created() {
        this.query_news_cate();
        this.query_suggest();
    },

    methods: {
        query_news_cate() {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_channel",
                    channelId: '49',
                },
            }).then((res) => {
                if (res.code == 200) {
                    let data = res.data;

                    this.cate_list = data;

                }
            });
        },
        query_suggest() {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_lists",
                    ...this.pagination,
                    isIndex: 1,//类型：0-全部 1-推荐
                    contentLen: '100',//
                    orderType: 0,//排序情况：0-自然排序 1-最新
                },
            }).then((res) => {
                if (res.code == 200) {
                    let data = res.data;
                    this.suggest_news = data.list;
                    this.first_suggest = data.list[0]
                    // this.count = data.count;
                }
            });
        },
        do_toggle_cate(item) {
            this.mix_toRoute({
                path: '/news',
                query: {
                    cid: item.id
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
.ctx-right {
    width: 300px;


    .box-item {
        background: #fff;
        margin-bottom: 24px;
        padding: 24px 20px;
        background: #FFFFFF;
        border-radius: 4px 4px 4px 4px;
    }


    .right-title {
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 20px;
        color: #000000;

        .marker {
            margin-right: 13px;
            display: inline-block;
            width: 6px;
            height: 24px;
            background: #7853B2;
            border-radius: 100px 100px 100px 100px;
        }

    }



    .cate-wrap {
        .cate-box {
            margin-top: 24px;

            .cate-list {
                .cate-item {
                    cursor: pointer;
                    margin-bottom: 12px;
                    padding: 0 20px;
                    height: 45px;
                    line-height: 45px;
                    background: #F2F5F9;
                    border-radius: 4px 4px 4px 4px;
                    font-family: Microsoft YaHei, Microsoft YaHei;
                    font-weight: 400;
                    font-size: 16px;
                    color: #000000;

                    &.active {
                        background: #7853B2;
                        color: #FFFFFF;
                    }
                }
            }
        }
    }



    .suggest-wrap {

        .suggest-poster {
            margin-top: 30px;
            width: 100%;
            border-radius: 10px;
            overflow: hidden;

            img {
                width: 100%;
            }
        }

        .suggest-list {
            margin-top: 20px;

            .suggest-item {
                padding: 8px 0;

                // border-bottom: 1px solid #ddd;
                .dot {
                    margin-right: 10px;
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    background: #7853B2;
                    border-radius: 0;
                }

                a {
                    display: block;
                    font-family: Microsoft YaHei, Microsoft YaHei;
                    font-weight: 400;
                    font-size: 14px;
                    color: #282828;

                    &:hover {
                        color: #7853B2;
                    }
                }

                .date {
                    margin-top: 15px;
                    text-align: right;
                    color: #505050;
                }
            }
        }
    }




}
</style>
