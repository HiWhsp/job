<template>
  <div style="padding-bottom: 50px;">
    <!--    操作区-->
    <div class="index-box-first-content flex">
      <div class="banner">
        <el-carousel height="100%">
          <el-carousel-item v-for="(it, i) in index_banners" :key="i">
            <img :src="it.image" alt="banner"/>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <h2 class="title">砂轮原辅材料</h2>

    <div class="sand-materials main">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <button v-for="(item, index) in categories" :key="index" :class="{ active: selectedCategory === item }"
                @click="selectedCategory = item">
          {{ item }}
        </button>
      </div>

      <div class="column-flex-center wrap">
        <!-- 材料详情 -->
        <div class="material-info">
          <div class="text-section">
            <h3>{{ selectedCategory }}</h3>
            <p class="description">
              棕刚玉，又名金刚砂，是一种棕褐色人造刚玉。它主要由铝矾土（煅土）、碳素材料（如无烟煤/硬质焦炭）、铁屑等原料在电弧炉中经过2200度高温冶炼然后再加工制成，耐火度达1850度以上。
            </p>
            <p class="features">
              特征：硬度高、韧性大、高密度、高耐磨、高耐火、耐腐蚀。
            </p>
          </div>
          <div class="image-section">
            <img src="@/static/home/material.png" alt="棕刚玉"/>
          </div>
        </div>

        <!-- 供应商选择 -->
        <div class="suppliers">
          <div class="title-section">
            <div>
              <span class="tit">供应商选择</span>
              <span class="sub">实力厂家 行业优选</span>
            </div>

            <a href="/product-all" class="more-link">查看全部供应商 ></a>
          </div>
          <div class="supplier-grid">
            <div v-for="(supplier, index) in suppliers" :key="index" class="supplier" @click="toProduct(supplier)">
              <img src="@/static/home/supplier.png" alt="">
              {{ supplier }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <pageAside></pageAside>
  </div>
</template>

<script>
import pageAside from "@/components/page/page-aside.vue";
import {mapState} from "vuex";
import dayjs from 'dayjs'

export default {
  name: "index",
  components: {
    pageAside
  },
  data() {
    return {
      // 首屏展示类型
      product_list: [],
      selectedCategory: "棕刚玉（A）",
      categories: [
        "棕刚玉（A）", "白刚玉（WA）", "铬刚玉（PA）", "微晶刚玉（MA）", "单晶刚玉（SA）", "绿碳化硅（GC）", "黑碳化硅（C）",
        "陶瓷刚玉（CA）", "高岭土", "锆长石", "碳玻璃", "滑石粉", "轻质碳酸钙", "石英粉"
      ],
      suppliers: [
        "江西西亿研磨股份有限公司", "贵州南杰砂轮有限公司", "惠州市精瑞砂轮有限公司", "衢州中润川兴五金有限公司",
        "江西西亿研磨股份有限公司", "贵州南杰砂轮有限公司", "惠州市精瑞砂轮有限公司", "江西西亿研磨股份有限公司",
        "衢州中润川兴五金有限公司", "惠州市精瑞砂轮有限公司"
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      filterList: state => state.vuexTreeCates,
      index_banners: state => state.index_banners
    }),
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.query_product_cate()
    },
    // 获取商品列表
    query_product_cate() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 0,
          page: 1,
          pageNum: 10,
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          let {list, count} = data;
          this.product_list = list;
          this.count = count;

          // for (let i = 0; i < list.length; i += 5) {
          //   this.promationList.push(list.slice(i, i + 5));
          // }
          // console.log(this.promationList)
        }
      });
      // 推荐商品
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          channelId: 811,
          page: 1,
          pageNum: 10,
        },
      }).then((res) => {
        let {code, data} = res;
        let {list, count} = data;
        if (code == 200) {
          for (let i = 0; i < list.length; i += 5) {
            this.promationList.push(list.slice(i, i + 5));
          }
        }
      })
    },
    // 跳转链接
    goUrl(item) {
      this.$router.push(item.url);
    },
    // 跳转商品
    toProduct(item) {
      this.$router.push(`/productCategories?ids=${item.id}`);
    }
  },
}

</script>

<style scoped lang="less">
.el-carousel {
  height: 100%;
}

.main {
  width: 1400px;
  margin: 0 auto;
}

.index-box-first-content {
  // 轮播图
  .banner {
    width: 100%;
    height: 560px;
    border-radius: 4px 4px 4px 4px;
    background-color: #C4005B;

    img {
      width: 100%;
      height: 100%;
    }

    /deep/ .is-active {
      .el-carousel__button {
        background: #F8C268;
      }
    }

    /deep/ .el-carousel__button {
      width: 20px;
      height: 6px;
      background: #FFFFFF;
      border-radius: 0px 0px 0px 0px;
      opacity: 0.7;
    }
  }
}

.title {
  text-align: center;
  font-weight: 600;
  font-size: 40px;
  color: #000000;
  margin-top: 60px;
  margin-bottom: 48px;
}

.sand-materials {
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    button {
      width: 174px;
      height: 48px;
      text-align: center;
      color: #333;
      border-radius: 4px 4px 4px 4px;
      border: 1px solid #DBDBDB;
      background: #fff;
      margin-right: 30px;
      margin-bottom: 20px;

      &:nth-child(7n) {
        margin-right: 0;
      }

      &.active {
        background: #044FA0;
        color: #fff;
      }
    }
  }

  .wrap {
    background: #fff;
    padding: 40px 50px;
    margin-bottom: 20px;
  }

  .material-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .text-section {
      flex: 1;
      padding-right: 20px;

      h3 {
        font-size: 36px;
        margin-bottom: 20px;
      }

      .description {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        margin-bottom: 20px;
      }

      .features {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 18px;
        color: #333333;
      }
    }

    .image-section {
      width: 240px;

      img {
        width: 100%;
      }
    }
  }

  .suppliers {
    margin-top: 30px;

    .title-section {
      display: flex;
      justify-content: space-between;
      font-family: PingFang SC, PingFang SC;
      font-weight: 500;
      font-size: 26px;
      margin-bottom: 10px;

      .sub {
        font-size: 16px;
        color: #999;
        margin-left: 10px;
      }

      .more-link {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #044FA0;
      }
    }

    .supplier-grid {
      display: flex;
      flex-wrap: wrap;

      .supplier {
        margin-right: 20px;
        margin-bottom: 16px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        img {
          width: 56px;
          height: 20px;
          margin-right: 10px;
        }

        width: 310px;
        height: 40px;
        color: #333;
        font-size: 16px;
        background: #F9FAFC;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #E4E7ED;

        &:nth-child(4n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
