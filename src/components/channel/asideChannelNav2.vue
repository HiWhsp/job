<template>
  <div
    class="aside-nav-wrap"
    :class="$route.name == 'index' ? '' : 'not-index'"
  >
    <div
      class="aside-nav-inner"
      @mouseover="showPannel = true"
      @mouseout="showPannel = false"
    >
      <!-- -->
      <div class="list-wrap">
        <div class="list">
          <div
            class="item"
            v-for="(level_1, index_1) in list_channel"
            :key="index_1"
            @mouseenter="onEnterSubNav(level_1, index_1)"
            @click.stop="click_level_1(index_1, level_1)"
          >
            <div class="item-title">
              <div class="text">
                {{ level_1.title }}
              </div>
              <span class="marker">
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>

            <div class="level2-list">
              <div
                class="level2-item"
                v-for="(level2, level2_index) in level_1.channels.slice(0, 2)"
                :key="level2_index"
              >
                {{ level2.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showPannel" class="list-pannel">
        <div class="list-inner">
          <div
            class="one"
            v-for="(level_2, index) in level_1.channels"
            :key="index"
          >
            <div
              class="level-2-title"
              @click="
                $router.push(
                  `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}&level_2=${level_2.id}`
                )
              "
            >
              {{ level_2.title }}
            </div>
            <div class="level-3-list"  :class="{no_sub: level_2.channels.length == 0}">
              <span
                class="level-3-title"
               
                v-for="(level_3, index) in level_2.channels"
                :key="index"
                @click="
                  $router.push(
                    `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}&level_2=${level_2.id}&level_3=${level_3.id}`
                  )
                "
                >{{ level_3.title }}

                <!-- ?level_1_index=0&level_1=119&level_2=16&level_3=36 -->
              </span>
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
  name: "commonBottom",
  components: {},
  data() {
    return {
      showPannel: false, //科室面板
      pannelArr: [], //面板数据
      level_1: {}, //1级分类数据
      level_1_index: 0, //1级分类数据
      list: "",
      pagination: {
        channel_num: 8,
        pdt_num: 21,
      },
      aa: [{ text: "Google" }],
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
    click_level_1(level_1_index, level_1) {
      this.$router.push(
        `/classify?level_1_index=${level_1_index}&level_1=${level_1.id}`
      );
    },

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
      console.log(item);
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
  &.not-index {
    border: 1px solid #eee;
  }
  .aside-nav-inner {
    position: relative;
    background: rgba(0, 0, 0, 0.5);

    .list-wrap() {
      height: 100%;
    }

    .list {
      .scrollbar();

      text-align: left;
      font-size: 14px;
      color: #fff;
      max-height: 480px;
      padding-bottom: 20px;

      .item:last-child {
        border: none;
      }
      .item {
          display: flex;
          justify-content: center;
          align-items: center;
        flex-direction: column;
        align-items: flex-start;
        cursor: pointer;
        height: 80px;
        padding: 0 10px;
        border-bottom: 1px solid #eee;
        flex: 1;

        &:hover {
          background: #f8f8f8;
        }
        .item-title {
          width: 100%;
            display: flex;
  align-items: center;
  justify-content: space-between;
          font-size: 16px;
          color: #fff;
          font-weight: bold;
          &.active {
            color: #f07f00;
          }

          .text {
              white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
            line-height: 1;
            flex: 2;

            &:hover {
              color: #f00;
            }
          }
          .marker {
            width: 10px;
            color: #999;
          }
        }

        .level2-list {
          width: 100%;
            display: flex;
  align-items: center;
            white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
          height: 16px;
          margin-top: 10px;
          font-size: 12px;

          .level2-item {
            margin-right: 10px;
            &:hover {
              color: #f00;
            }
          }
        }
      }
    }

    .list-pannel {
      .scrollbar();

      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;

      position: absolute;
      z-index: 10;
      top: 0px; /*no */
      left: 204px;
      width: 1000px;
      height: 480px;
      background-color: #fff;
      border-left: none;
      text-align: left;
      display: flex;
      flex-direction: column;
      border-left: none;
      padding-left: 0;

      .list-inner {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .one {
          width: 100%;
          display: flex;
          height: auto;
          min-height: 62px;

          .level-2-title {
            width: 117px;
            height: 100%;
            margin: 0 0.18rem;
            font-size: 14px;
            line-height: 18px;
            font-family: Poppins, Poppins;
            color: #333333;
            display: flex;
            align-items: center;
            cursor: pointer;

            font-size: 14px;

            &:hover {
              color: #f00;
            }
          }

          .level-3-list {
            flex: 2;
            height: 100%;
            border-bottom: 0.01rem solid #dedede;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding: 20px 0;

            &.no_sub {
              border: none;
            }

            a {
              font-size: 14px;
              font-family: Poppins, Poppins;
              line-height: 0.18rem;
              color: #9b9b9b;
              display: block;
              margin: 0 0.05rem;
            }

            .level-3-title {
              cursor: pointer;
              font-size: 14px;
              font-family: Poppins, Poppins;
              color: #9b9b9b;
              display: block;
              margin: 0 0.05rem;

              &:hover {
                color: #f00;
              }
            }
          }
        }
      }

      .pannel-item {
        // width: 25%;
        cursor: pointer;
        margin-left: 30px;
        margin-bottom: 10px;
        font-size: 14px;
        font-family: Poppins, Poppins;
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
