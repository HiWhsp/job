<template>
    <div class="page">
        <div class="title">会员权益</div>
        <div class="sub-title">用激光工具改变生活</div>
        <div class="content" v-html="bannerList[0].content">
        </div>
    </div>
</template>

<script>
export default {
    name: "member-benefits",
    data() {
        return {
            bannerList: []
        };
    },
    mounted() {
        this.setView();
    },
    methods: {
        setView() {
            this.$api({
                url: "/service.php",
                method: "get",
                data: {
                    action: "news_lists",
                    channelId: 4,
                },
            }).then((res) => {
                if (res.code == 200) {
                    this.bannerList = res.data.list;
                }
            })
        }
    },
};
</script>

<style scoped lang="less">
.page {
  padding: 61px 260px 0;
  //background: #f4f4f6;
}

.title {
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: bold;
  font-size: 36px;
  color: #333333;
  text-align: center;
  font-style: normal;
  text-transform: none;
}

.sub-title {
  font-weight: 400;
  font-size: 16px;
  color: #52565a;
  text-align: center;
  font-style: normal;
  text-transform: none;
  margin-top: 14px;
}

.content {
  font-weight: 400;
  font-size: 16px;
  color: #333333;
  line-height: 28px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-top: 52px;
  padding-bottom: 49px;
}
</style>
