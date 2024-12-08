<script>
export default {
  name: "Introduction",
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$api({
        url: 'page_content',
        method: 'post',
        data: {
          id: 38
        }
      }).then(res => {
        this.detail = res.data
      })
    }
  }
}
</script>

<template>
  <div class="content-wrap">
    <div class="title">{{ detail.title }}</div>
    <div class="file-type">{{ detail.created_at }}</div>
    <div class="detail-text" v-html="detail.content"></div>
  </div>
</template>

<style scoped lang="less">
.content-wrap {
  padding: 68px 74px 54px;
  background-color: #fff;

  .title {
    font-weight: 400;
    font-size: 22px;
    color: #000000;
  }

  .file-type {
    margin-top: 26px;
    font-weight: 400;
    font-size: 16px;
    color: #6A7AA1;
  }

  .download-wrap {
    margin-top: 55px;
    height: 129px;
    background: rgba(41, 121, 255, 0.07);
    border: 1px dashed #2979FF;
    display: flex;
    align-items: center;
    padding: 0 45px;

    img {
      width: 56px;
      height: 54px;
      margin-right: 20px;
    }

    .info {
      flex: 1;

      .title {
        font-weight: 400;
        font-size: 16px;
        color: #000000;
      }

      .size {
        margin-top: 15px;
        font-weight: 400;
        font-size: 16px;
        color: #777777;
      }
    }

    .down-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 130px;
      height: 35px;
      background: #FFFFFF;
      border-radius: 3px 3px 3px 3px;
      border: 1px solid #999999;

      img {
        width: 15px;
        height: 13px;
        margin-right: 5px;
      }

      span {
        font-weight: 400;
        font-size: 13px;
        color: #555555;
      }
    }
  }

  .detail-text {
    margin-top: 55px;
  }

  .prev-btn {
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: #555555;
    display: flex;
    justify-content: space-between;
    margin-top: 55px;
  }
}
</style>
