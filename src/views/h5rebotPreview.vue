<template>
  <div class="app-container">
    <div class="top-bar">我的配置单{{ detail.product_title }}</div>
    <div class="img-box">
      <img :src="productImg" alt="" />
    </div>
    <div class="content-box">
      <div class="content-box-title">配置单号：{{ detail.order_no }}</div>
      <div class="content-box-list">
        <div
          class="content-box-list-item"
          v-for="(items, key) in groupedProductInfo"
          :key="key"
        >
          <div class="content-box-list-item-title">
            {{ key }}
          </div>
          <div class="content-box-list-item-content" v-for="(item, index) in items" :key="index">
            <template v-if="item.producntInfos.thumb">
              <div class="content-box-list-item-content-img">
                <img :src="item.producntInfos.thumb" alt="" />
              </div>
              <div class="content-box-info">
                <div class="content-box-info-title">
                  {{
                    item.product_type_three_title || item.producntInfos.title
                  }}
                </div>
                <div class="content-box-info-content">
                  {{
                    item.producntInfos.title != "其他"
                      ? item.producntInfos.description
                      : item.other && item.other.notes
                      ? item.other.notes
                      : ""
                  }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="content-box-info content-box-info-other">
                <div class="content-box-info-title">
                  {{
                    item.product_type_three_title || item.producntInfos.title
                  }}
                </div>
                <div class="content-box-info-content">
                  <p>
                    {{
                      item.producntInfos.title != "其他" && !item.producntInfos.title.includes('定制')
                        ? item.product_type_three_title ? item.producntInfos.title : '--'
                        : item.other && item.other.notes
                        ? item.other.notes
                        : "--"
                    }}
                  </p>
                </div>
              </div>
            </template>
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
      groupedProductInfo: {}, // 添加分组后的数据
    };
  },
  mounted() {
    this.getRobotConfig();
  },
  computed: {
    productImg() {
      return (
        this.detail.z_product?.thumb +
        "/uploads/" +
        this.detail.z_product?.images?.split(",")[0]
      );
    },
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

        // 将 product_info 按 product_type_two_title 分组
        const groupedData = {};
        res.data.product_info.forEach((item) => {
          const key = item.product_type_two_title;
          if (!groupedData[key]) {
            groupedData[key] = [];
          }
          groupedData[key].push(item);
        });
        this.groupedProductInfo = groupedData;

        console.log("分组后的数据:", this.groupedProductInfo);
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
      object-fit: cover;
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
        margin-bottom: 10px;
        padding-bottom: 10px;
        .content-box-list-item-title {
          font-size: 10px;
          font-weight: 400;
          color: #b2b2b2;
          margin-bottom: 10px;
        }
        .content-box-list-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #565656;
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
        .content-box-info-other {
          display: flex;
          align-items: center;
          width: 100%;
          .content-box-info-title {
            margin-bottom: 0;
            width: 50%;
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
