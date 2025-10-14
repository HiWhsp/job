<template>
  <div class="app-container">
    <div class="top-bar">我的配置单{{ detail.product_title }}</div>
    <div class="img-box">
      <img :src="detail.product_img" alt="" />
    </div>
    <div class="content-box">
      <div class="content-box-title">配置单号：{{ detail.order_no }}</div>
      <div class="content-box-list">
        <div
          class="content-box-list-item"
          v-for="(item, index) in detail.product_info"
          :key="index"
        >
          <div class="content-box-list-item-title">
            {{ item.product_type_two_title  }}
          </div>
          <div class="content-box-list-item-content">
            <div class="content-box-list-item-content-img">
              <img :src="item.producntInfos.thumb || vuex_avatar_default" alt="" />
            </div>
            <div class="content-box-info">
              <div class="content-box-info-title">
                {{ item.product_type_three_title || item.producntInfos.title }}
              </div>
              <div class="content-box-info-content">
                {{ item.producntInfos.title != '其他' ? item.producntInfos.title : item.other.notes }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "h5rebotPreview",
  data() {
    return {
      id: this.$route.query.id,
      detail: {},
    };
  },
  mounted() {
    this.getRobotConfig();
  },
  methods: {
    getRobotConfig() {
      this.$api({
        url: "showProductSetting",
        method: "post",
        data: {
          id: this.id,
        },
      }).then((res) => {
        this.detail = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.app-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: #161616;

  .top-bar {
    height: 40px;
    background-color: #161616;
    color: #fff;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    line-height: 40px;
  }

  .img-box {
    height: 121px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .content-box {
    padding: 0 10px;
    background: #161616;
    padding-bottom: 10px;

    .content-box-title {
      height: 50px;
      line-height: 50px;
      font-size: 10px;
      font-weight: 400;
      color: #fff;
    }
    .content-box-list {
      .content-box-list-item {
        margin-bottom: 15px;
        .content-box-list-item-title {
          font-size: 10px;
          font-weight: 400;
          color: #b2b2b2;
          margin-bottom: 15px;
        }
        .content-box-list-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
          .content-box-list-item-content-img {
            width: 35px;
            height: 35px;
            background: #303030;
            border-radius: 50%;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
            }
          }
        }
        .content-box-info {
          .content-box-info-title {
            font-size: 10px;
            font-weight: 400;
            color: #fff;
            margin-bottom: 5px;
          }
        }
        .content-box-info-content {
          font-size: 10px;
          font-weight: 400;
          color: #fff;
        }
      }
    }
  }
}
</style>
