<template>
  <div class="aside-nav-wrap">
    <div
      class="aside-nav-inner-box"
      @mouseover="showPannel = true"
      @mouseout="showPannel = false"
    >
      <div class="aside-nav-inner">
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in list_channel_youhuiqu"
            :key="index"
            @mouseenter="onEnterSubNav(item)"
          >
            <div class="item-title">
              <router-link
                :to="{
                  path: 'youhuiquClassify',
                  query: {
                    sub_id: item.id,
                    sub_title: item.title,
                    id: 628,
                    type: 1,
                  },
                }"
              >
                {{ item.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div
        v-show="showPannel"
        class="list-pannel"
        :class="$route.name == 'doctor' ? 'need-border-top' : ''"
      >
        <div
          class="pannel-item"
          v-for="(item, index) in pannelArr"
          :key="index"
        >
          <div class="pannel-title" @click="click_sub(item, '2')">
            {{ item.title }}
          </div>
          <div class="pannel-content">
            <span
              v-for="(sub_item, sub_index) in item.channels"
              :key="sub_index"
              @click.stop="onClickDepartment(sub_item, '3级')"
              >{{ sub_item.title }}</span
            >
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
      keshi_select: {}, //选择的科室
      sortList: [],
      showPannel: false, //科室面板
      pannelArr: [], //科室数据
    };
  },
  computed: {
    ...mapState(["list_channel"]),

    //京东优惠区分类
    list_channel_youhuiqu() {
      let arr = [];
      if (this.list_channel.length) {
        arr = this.list_channel.find((v) => v.is_youhuiqu).channels;
      }
      return arr;
    },
  },
  created() {},
  methods: {
    //科室点击
    onClickDepartment(item, type) {
      //console.log("选择的科室", this.keshi_select);
      let query = {};
      if (type == "1级") {
        query = {
          jobone_id: item.id,
        };
        this.keshi_select = { ...item };
      } else if (type == "2级") {
        query = {
          jobtwo_id: item.id,
        };
        this.keshi_select = { ...item };
      } else if (type == "3级") {
        query = {
          jobtwo_id: item.parentId,
        };
        this.keshi_select = { id: item.parentId };
      }

      this.$router.push({
        path: "doctor",
        query: query,
      });
      //console.log("科室级别", type);
      //console.log("科室", { ...item });
    },

    // 京东优惠区
    click_sub(item, type) {
      if (type == 1) {
        //console.log("禁止点击京东优惠区1级分类");
        // return;
      }
      this.$router.push({
        path: "/youhuiquClassify",
        query: {
          sub_id: item.id,
          sub_title: item.title,
          id: 628,
          type: type,
        },
      });
    },

    //科室导航移动
    onEnterSubNav(item) {
      // //console.log("导航移动 item", { ...item });
      this.pannelArr = item.channels;
    },
  },
};
</script>


<style scoped lang="less">
.aside-nav-wrap {
  height: 100%;
  .aside-nav-inner {
    height: 100%;
    .scrollbar();
    overflow: auto;
    position: relative;
    .list {
      text-align: left;
      font-size: 14px;
      color: #333333;
      padding: 20px;

      .item {
        cursor: pointer;
        margin-bottom: 7px;

        .item-title a {
          font-weight: bold;
          font-size: 14px;
          color: #333333;

          &:hover {
            text-decoration: underline;
            color: @theme;
          }
          &.active {
            color: #f07f00;
          }
        }
        .sub-list {
          display: none;
          font-size: 12px;
          margin-top: 5px;

          span {
            margin-right: 5px;

            &:hover {
              text-decoration: underline;
              color: @theme;
            }
            &.active {
              color: #f07f00;
            }
          }
        }
      }
    }
  }

  .list-pannel {
    position: absolute;
    z-index: 10;
    top: -1px; /*no */
    left: 181px;
    width: 300px;
    height: 388px;
    padding: 20px;

    background-color: #fff;
    border: 1px solid @theme;
    border-left: none;
    text-align: left;

    &.need-border-top {
      border-top: 1px solid @theme;
    }

    .pannel-item {
      display: inline-block;
      margin-right: 10px;
      .pannel-title {
        font-size: 12px;
        color: #666;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
          color: @theme;
        }
      }
      .pannel-content {
        color: #000;
        padding-bottom: 10px;

        span {
          color: #777;
          margin-right: 5px;
          font-size: 12px;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
