<template>
  <div class="aside">
    <div class="list">
      <div
        class="item"
        v-for="(item, index) in itemList"
        :key="item.text"
        @click="onClickItem(index)"
        @mouseenter="onMouseEnter(index)"
        @mouseleave="onMouseLeave(index)"
        :class="{ active: selectedIndex === index }"
      >
        <div class="img-wrap">
          <img
            :src="selectedIndex === index ? item.activeIconSrc : item.iconSrc"
            alt="icon"
          />
        </div>
        <div>{{ item.text }}</div>
        <div
          class="popup"
          v-if="popupIndex === index"
          @mouseenter="onPopupMouseEnter"
          @mouseleave="onPopupMouseLeave"
        >
          <div class="sub-list">
            <el-checkbox-group v-model="checkList">
              <el-checkbox
                :label="subItem"
                class="sub-item"
                v-for="(subItem, index) in item.subItems"
                :key="index"
              >
                <div class="item-wrap">
                  <div class="img-wrap">
                    <img src="@/assets/img/aside/img.png" alt="" />
                  </div>
                  <div class="item-text">激光平面窗口片名称位置</div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
            <div class="btn-wrap">
              <div class="btn close" @click="popupIndex = -1">关闭</div>
              <div class="btn contrast" @click="onRouteTo({ name: 'productComparison' })">对比</div>
            </div>
          </div>
          <div class="arrow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon1 from "@/assets/img/aside/icon1.png";
import icon1Active from "@/assets/img/aside/icon1-active.png";
import icon2 from "@/assets/img/aside/icon2.png";
import icon2Active from "@/assets/img/aside/icon1-active.png";
import icon3 from "@/assets/img/aside/icon3.png";
import icon3Active from "@/assets/img/aside/icon1-active.png";
import icon4 from "@/assets/img/aside/icon4.png";
import icon4Active from "@/assets/img/aside/icon1-active.png";
import icon5 from "@/assets/img/aside/icon5.png";
import icon5Active from "@/assets/img/aside/icon1-active.png";

export default {
  name: "common-aside",
  components: {},
  props: [],
  data() {
    return {
      selectedIndex: -1,
      popupIndex: -1,
      popupVisible: false,
      checkList: ["选中且禁用", "复选框 A"],
      icon1,
    };
  },
  watch: {},
  created() {
    this.itemList = [
      {
        iconSrc: icon1,
        activeIconSrc: icon1Active,
        text: "快速报价",
        subItems: ["子选项1", "子选项2", "子选项3", "子选项4", "子选项5"],
      },
      {
        iconSrc: icon2,
        activeIconSrc: icon2Active,
        text: "产品对比",
        subItems: ["子选项1", "子选项2", "子选项3", "子选项4", "子选项5"],
      },
      {
        iconSrc: icon3,
        activeIconSrc: icon3Active,
        text: "购物车",
        subItems: ["子选项1", "子选项2", "子选项3", "子选项4", "子选项5"],
      },
      {
        iconSrc: icon4,
        activeIconSrc: icon4Active,
        text: "在线咨询",
        subItems: ["子选项1", "子选项2", "子选项3", "子选项4", "子选项5"],
      },
      {
        iconSrc: icon5,
        activeIconSrc: icon5Active,
        text: "返回顶部",
        subItems: ["子选项1", "子选项2", "子选项3", "子选项4", "子选项5"],
      },
    ];
  },
  methods: {
    onClickItem(index) {
      this.selectedIndex = index;
    },
    onMouseEnter(index) {
      this.selectedIndex = index;
      this.popupIndex = index;
      this.popupVisible = true;
    },
    onMouseLeave(index) {
      if (!this.popupVisible) {
        this.popupIndex = -1;
      }
    },
    onPopupMouseEnter() {
      this.popupVisible = true;
    },
    onPopupMouseLeave() {
      this.selectedIndex = -1;
      this.popupVisible = false;
      this.popupIndex = -1;
    },
    onRouteTo(params) {
      const { name } = params;
      this.$router.push({ name });
    },
  },
};
</script>

<style scoped lang="less">
.aside {
  z-index: 10000;
  position: fixed;
  right: 46px;
  top: 150px;
  background: #fff;
}

.list {
  display: flex;
  flex-direction: column;

  .item {
    position: relative;
    width: 71px;
    height: 76px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 0 1px #e6e6e6;
    cursor: pointer;

    &.active {
      background-color: #27417c;
      color: #fff;
    }

    .img-wrap {
      margin: 14px 24px 3px 25px;
      width: 22px;
      height: 22px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .popup {
      position: absolute;
      right: 88px;
      background-color: #fff;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

      .sub-list {
        display: flex;
        flex-direction: column;

        .sub-item {
          width: 331px;
          height: 85px;
          padding-left: 21px;
          border-bottom: 1px solid #707070;

          .item-wrap {
            display: flex;

            .img-wrap {
              width: 55px;
              height: 55px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .item-text {
              height: 100%;
              padding-top: 22px;
            }
          }
        }
      }

      .arrow {
        position: absolute;
        right: -6px;
        top: 32px;
        width: 0;
        height: 0;
        border: 9px solid transparent;
        border-left: 9px solid #fff;
      }

      .btn-wrap {
        height: 77px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        box-sizing: border-box;
        cursor: default;

        .btn {
          width: 138px;
          height: 39px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0px 8px 0px 8px;
          font-size: 16px;
          color: #ffffff;
          text-align: center;
          cursor: pointer;
        }

        .close {
          background: #bec1c4;
        }

        .contrast {
          background: #27417c;
        }
      }
    }
  }
}

::v-deep .el-checkbox {
  display: flex;
  align-items: center;
}
</style>
