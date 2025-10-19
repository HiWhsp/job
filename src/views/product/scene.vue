<template>
  <div class="page">
    <div class="inner">
      <div class="banner-box">
        <!-- <div class="lunbo-box">
          <el-carousel trigger="click" :autoplay="true">
            <el-carousel-item
              v-for="(item, index) in banner_list"
              :key="index"
              @click.native="do_banner_click(item)"
            >
              <img :src="item.image" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div> -->
        <div class="poster-box">
          <img :src="banner_poster" alt="" />
        </div>
        <div class="poster-info flex">
          <div class="info-left">
            <div class="left-title">场景化采购</div>
            <div class="left-tag flex-center">跨品类一站购齐</div>
          </div>
        </div>
      </div>
      <div class="page-ctx w-1400">
        <div class="scene-box">
          <div class="float-list">
            <div
              class="float-item"
              v-for="(item, index) in sceneList"
              :key="index"
              :class="[
                'float-' + index,
                { no_right: index == 2 || index == 4 || index == 7 },
              ]"
            >
              <div class="poster-box scale-box">
                <img :src="item.image" alt="" class="poster scale-img" />
              </div>
              <div class="title flex-center">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "category",
  components: {},
  data() {
    return {
      banner_list: [],
      banner_poster: "",

      jingpin_group: [],
      jingpin_list: [],
      suggest_products: [],
      sceneList: [],
    };
  },
  computed: {
    ...mapState([""]),
  },
  watch: {},
  created() {
    this.query_banner();
    this.query_jingpin();
    this.query_product_suggest();
    this.query_scene();
  },
  methods: {
    query_banner() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then((res) => {
        if (res.code == 200) {
          if (res.data[0]) {
            this.banner_list = res.data[5].images;
            this.$log("banner_list", this.banner_list);
            this.banner_poster = this.banner_list[0].image;
          }
        }
      });
    },
    query_scene() {
      this.$api({
        url: "service.php",
        method: "get",
        data: {
          action: "banner_index",
          position: 0,
        },
      }).then((res) => {
        console.log(res.data);
        this.sceneList = res.data.filter((v) => v.id == 183)[0].images;
        console.log(this.sceneList);
      });
    },
    do_banner_click(item) {
      //console.log({ ...item });
      if (item.url) {
        window.open(item.url, "_blank");
      } else if (item.inventoryId) {
        this.$router.push(
          "/product-detail/" + (item.skuId || item.inventoryId)
        );
      }
    },

    query_jingpin() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          // ifShowSku: 1,
          // channelId: 792,
          page: 1,
          pageNum: 16,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.data.list;
          this.jingpin_products = res.data.list;

          let jingpin_group = [];
          let items_length = 6; //4个一组
          list.forEach((v, i) => {
            let group_index = Math.floor(i / items_length);
            if (!jingpin_group[group_index]) {
              jingpin_group[group_index] = [];
            }
            jingpin_group[group_index].push(v);
          });
          this.jingpin_group = jingpin_group;
        }
      });
    },

    query_product_suggest() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          // ifShowSku: 1,
          // channelId: 792,
          page: 1,
          pageNum: 16,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.suggest_products = res.data.list;
        }
      });
    },

    to_product(item) {
      this.mix_toRoute({
        path: "/product-detail",
        query: {
          id: item.inventoryId,
        },
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #ffffff;
  background: #f3f3f3;
  text-align: left;

  .inner {
    margin: 0 auto;
    padding-bottom: 100px;
  }
}

.banner-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.banner-box .lunbo-box {
  position: relative;
  width: 100%;
  height: 318px;

  /deep/ .el-carousel__container {
    height: 318px;
  }

  /deep/ img {
    width: 100%;
    height: 318px;
    cursor: pointer;
  }
}

.poster-box {
  width: 100%;
  img {
    width: 100%;
    height: 340px;
    object-fit: cover;
  }
}
.poster-info {
  width: 1400px;
  position: absolute;

  .info-left {
    width: 100%;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: bold;
    font-size: 40px;
    color: #ffffff;

    .left-title {
      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: bold;
      font-size: 60px;
      color: #ffffff;
    }
    .left-tag {
      margin-top: 27px;
      width: 263px;
      height: 61px;
      background: #2E4C87;
      border-radius: 0px 0px 0px 0px;

      font-family: Microsoft YaHei, Microsoft YaHei;
      font-weight: 400;
      font-size: 30px;
      color: #ffffff;
    }
  }
}

.scene-box {
  margin-top: 80px;
  height: 1000px;
  .float-list {
    .float-item {
      float: left;
      position: relative;
      width: 444px;
      height: 319px;
      margin-right: 34px;
      margin-bottom: 34px;
      padding-bottom: 70px;

      &.no_right {
        margin-right: 0;
      }

      .poster-box {
        width: 444px;
        height: 248px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        position: absolute;
        z-index: 1;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 71px;
        background: #2E4C87;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 30px;
        color: #ffffff;
      }
    }

    .float-0 {
      float: left;
      position: relative;
      width: 444px;
      height: 670px;
      margin-right: 34px;
      margin-bottom: 34px;
      padding-bottom: 0;

      .poster-box {
        width: 444px;
        height: 670px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        position: absolute;
        z-index: 1;
        bottom: 0;
        top: 60px;
        left: 0;
        width: 247px;
        height: 71px;
        background: #2E4C87;
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: bold;
        font-size: 30px;
        color: #ffffff;
      }
    }
  }
}
</style>

