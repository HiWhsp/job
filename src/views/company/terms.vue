<template>
    <div class="page">
        <pageBread />

        <div class="inner">
            <div class="page-ctx">
                <div class="rich-box">
                    <div class="rich-title">
                        {{ detail.title }}
                    </div>
                    <div class="rich-content" v-html="detail.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "userCenter",
    components: {},
    data() {
        return {
            id: "",
            detail: {},
        };
    },
    computed: {
        ...mapState([""]),
    },

    watch: {
        $route(to) {
            this.setView();
        },
    },
    created() {
        this.setView();
    },

    methods: {
        setView() {
    
            this.$api("index_newsDetail", {
                id: 32,
            }).then((res) => {
                console.warn("新闻详情", res);
                this.detail = res.data.info;
            });
        },
    },
};
</script>

<style scoped lang="less">
.page {
    background: #fff;
    background: #FFFFFF;
    padding-top: 0;
    padding-bottom: 80px;

    .inner {
        background: #fff;
        padding: 40px;
        width: @width;
        overflow: hidden;
        margin: 0 auto;
        min-height: 40vh;
        display: flex;
        justify-content: space-between;
    }
}

.rich-box {
    .rich-title {
        padding-top: 40px;
        padding-bottom: 20px;
        // border-bottom: 1px solid #d4d4d4;
        font-size: 32px;
        font-family: Arial, Arial;
        font-weight: bold;
        color: #323434;
    }

    .rich-content {
        padding: 20px 0;
        font-size: 16px;
        font-family: Arial, Arial;
        font-weight: 400;
        color: #666666;
        line-height: 1.6;

        /deep/ img {
            max-width: 100%;
        }

        /deep/ p {
            text-wrap: initial;
        }

        /deep/ span {
            text-wrap: initial;
        }
    }
}
</style>