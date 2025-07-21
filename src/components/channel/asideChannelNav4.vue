<template>
  <div class="aside-nav-wrap">
    <div
      class="aside-nav-inner"
      @mouseover="showPannel = true"
      @mouseout="showPannel = false"
    >
      <div class="list">
        <div
          class="item"
          v-for="(level_1, level_1_index) in list_channel"
          :key="level_1_index"
          @mouseenter="onEnterSubNav(level_1, level_1_index)"
          @click.stop="
            $router.push(
              `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}`
            )
          "
        >
          <div class="level-1-title">
            {{ level_1.title }}
          </div>
          <div class="level-2-list">
            <div
              class="level-2-title"
              v-for="(level_2, level_2_index) in level_1.channels"
              :key="level_2_index"
            >
              {{ level_2.title }}
            </div>
          </div>
        </div>
      </div>
      <div v-show="showPannel" class="list-pannel">
        <div class="list-inner">
          <div
            class="pannel-item"
            v-for="(level_2, index) in level_1.channels"
            :key="index"
            @click="
              $router.push(
                `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}&level_2=${level_2.id}`
              )
            "
          >
            {{ level_2.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "commonBottom",
  components: {},

  data() {
    return {
      showPannel: false, //科室面板
      pannelArr: [], //面板数据
      level_1: {}, //1级分类数据
      level_1_index: 0, //1级分类数据
      list: [],
      pagination: {
        channel_num: 8,
        pdt_num: 21,
      },
    };
  },
  computed: {
    ...mapState(["list_channel", "index_channelPdts"]),
  },
  watch: {
    $route() {
      this.showPannel = false;
    },
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {},

    click_level_2(level_2, level_1) {
      let level_1_index = this.level_1_index;
      this.$router.push(`/goodsDetail?id=${level_2.inventoryId}`);
    },

    click_level_3(level_3, level_2, level_1) {
      let level_1_index = this.level_1_index;

      this.$router.push(
        `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}&level_2=${level_2.id}&level_3=${level_3.id}`
      );
    },

    //科室导航移动
    onEnterSubNav(item, level_1_index) {
      // debugger
      this.level_1 = item;
      this.level_1_index = level_1_index;
      this.pannelArr = item.products;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.aside-nav-wrap {
  .aside-nav-inner {
    // background: rgba(0, 0, 0, 0.5);
    position: relative;
    .list {
      .scrollbar();
      text-align: left;
      font-size: 14px;
      color: #fff;
      max-height: 480px;
      min-height: 480px;
      padding-bottom: 20px;

      .item:last-child {
        border: none;
      }
      .item {
        cursor: pointer;
        .level-1-title {
          height: 46px;
          line-height: 46px;
          padding-left: 15px;
          border-bottom: 1px dotted #f00;
          font-size: 16px;
          color: #fff;
          font-weight: bold;

          &.active {
            color: #f07f00;
          }
        }
        .level-2-list {
          padding-top: 10px;
          padding-bottom: 10px;
          .level-2-title {
            height: 26px;
            line-height: 26px;
            padding-left: 15px;

            font-size: 14px;
            color: #333333;

            &:hover {
              color: #f00;
            }
          }
        }
        img {
          margin-right: 15px;
        }

        .sub-list {
          display: none;
          font-size: 12px;
          margin-top: 5px;

          span {
            margin-right: 5px;

            &:hover {
              text-decoration: underline;
              color: #f00;
            }
            &.active {
              color: #f07f00;
            }
          }
        }
      }
    }

    .list-pannel {
      position: absolute;
      z-index: 10;
      top: 0px; /*no */
      left: 204px;
      padding: 20px;
      width: 1000px;
      height: 480px;
      background-color: #fff;
      border-left: none;
      text-align: left;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #eee;
      border-left: none;
      padding-left: 0;
      .list-inner {
        width: 100%;
        // padding: 0 30px;
          display: flex;
  align-items: center;
        flex-wrap: wrap;
        align-items: flex-start;
      }

      .pannel-item {
        // width: 25%;
        cursor: pointer;
        margin-left: 30px;
        margin-bottom: 10px;

        font-size: 14px;
        font-family: OPPPSans;
        line-height: 40px;
        height: 40px;
        color: #5e5e5e;
      }
      .pannel-item:hover {
        color: #f00;
      }
    }
  }
}
</style>
