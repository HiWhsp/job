<script>
export default {
  name: "expertTeam_detail",
  data() {
    return {
      id: '',
      detail: {}
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$api({
        url: 'article_detail',
        method: 'post',
        data: {
          id: this.id
        }
      }).then(res => {
        this.detail = res.data
      })
    },
  }
}
</script>

<template>
  <div class="container">
    <div class="top-box">
      <img src="@/assets/img/base/appointment/expertTeam.png" alt="">
      <div class="text">
        <p class="name">{{ detail.title }}</p>
        <p class="desc">{{ detail.description }}</p>
      </div>
    </div>
    <div class="desc">
      <div class="tit">详细描述</div>
      <div class="detail" v-html="detail.content"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 75px;
  background-color: #fff;

  .top-box {
    display: flex;
    align-items: center;

    img {
      width: 147px;
      height: 147px;
      border-radius: 50%;
    }

    .text {
      margin-left: 80px;

      p {
        font-weight: 400;
        font-size: 15px;
        color: #666666;
      }

      .name {
        margin-bottom: 30px;
        font-weight: 400;
        font-size: 22px;
        color: #000000;
      }
    }
  }

  .desc {
    margin-top: 100px;

    .tit {
      font-weight: 400;
      font-size: 20px;
      color: #00479D;
      padding-bottom: 20px;
      border-bottom: 1px solid #707070;
    }

    .detail {
      margin-top: 40px;

      font-weight: 400;
      font-size: 15px;
      color: #666666;
    }
  }
}
</style>
