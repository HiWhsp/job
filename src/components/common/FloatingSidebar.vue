<template>
  <div class="floating-sidebar">
    <!-- 悬浮框按钮组 -->
    <div class="sidebar-items">
      <div v-for="(item, index) in sidebarItems" :key="index" class="sidebar-item"
        :class="{ 'is-hover': item.isHovered, }" @mouseenter="handleMouseEnter(item, index)"
        @mouseleave="handleMouseLeave(item, index)" @click="handleItemClick(item)">
        <div class="item-text" :class="{'item-text2':item.name=='客服电话'}" v-if="item.name!='手机版'">{{ shown_info[item.name] || item.name }}</div>


        <div class="circle-box">
          <div class="icon-wrapper">
            <img :src="item.isHovered ? item.hoverIcon : item.icon" :alt="item.name" class="icon" />
            <div v-if="item.name === '购物车' && vuex_cart_number > 0" class="badge">
              {{ vuex_cart_number }}
            </div>
            <div v-else-if="item.badge && item.name !== '购物车'" class="badge">
              {{ item.badge }}
            </div>
          </div>
        </div>


        <div class="qrcode-wrap" v-if="item.name == '手机版' && item.isHovered">
          <div class="qrcode-box">
            <div class="pic-box">
              <img :src="vuex_config.accountImg" alt="">
            </div>
            <div class="pic-title">
              扫描二维码
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
  name: "FloatingSidebar",
  computed: {
    ...mapState(["vuex_config", "vuex_cart_number"]),
  },
  data() {
    return {
      sidebarItems: [
        {
          name: "购物车",
          icon: require("@/assets/img/common/icon1.png"),
          hoverIcon: require("@/assets/img/common/icon1-a.png"),
          isHovered: false,
        },
        {
          name: "会员中心",
          icon: require("@/assets/img/common/icon2.png"),
          hoverIcon: require("@/assets/img/common/icon2-a.png"),
          isHovered: false,
        },
        {
          name: "手机版",
          icon: require("@/assets/img/common/icon3.png"),
          hoverIcon: require("@/assets/img/common/icon3-a.png"),
          isHovered: false,
        },
        {
          name: "在线客服",
          icon: require("@/assets/img/common/icon4.png"),
          hoverIcon: require("@/assets/img/common/icon4-a.png"),
          isHovered: false,
        },
        {
          name: "客服电话",
          icon: require("@/assets/img/common/icon5.png"),
          hoverIcon: require("@/assets/img/common/icon5-a.png"),
          isHovered: false,
        },
        {
          name: "返回顶部",
          icon: require("@/assets/img/common/icon6.png"),
          hoverIcon: require("@/assets/img/common/icon6-a.png"),
          isHovered: false,
        },
      ],
    };
  },
  computed: {
    shown_info() {
      let map = {
        客服电话: this.vuex_config.comPhone || "400-000-0000",
      }
      return map
    },
  },
  methods: {
    handleMouseEnter(item, index) {
      item.isHovered = true;
    },
    handleMouseLeave(item, index) {
      item.isHovered = false;
    },
    handleItemClick(item) {
      switch (item.name) {
        case "购物车":
          this.$router.push("/cart");
          break;
        case "会员中心":
          this.$router.push("/my");
          break;
        case "手机版":
          this.showMobileTip();
          break;
        case "在线客服":
          this.openCustomerService();
          break;
        case "客服电话":
          this.callCustomerService();
          break;
        case "返回顶部":
          this.scrollToTop();
          break;
        default:
          console.log("点击了:", item.name);
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    showMobileTip() {
      return
      this.$message({
        message: "请使用手机扫描二维码访问手机版",
        type: "info",
        duration: 3000,
      });
    },
    openCustomerService() {
      // 这里可以集成在线客服系统
      this.$message({
        message: "正在为您连接在线客服...",
        type: "info",
        duration: 2000,
      });
    },
    callCustomerService() {
      return
      // 拨打电话
      const phoneNumber = this.vuex_config.comPhone || "400-000-0000";
      window.open(`tel:${phoneNumber}`);
    },
  },
};
</script>

<style lang="less" scoped>
.floating-sidebar {
  width: 64px;
  // height: 362px;
  height: 448px;
  background: #ffffff;
  border-radius: 32px 32px 32px 32px;
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  // flex-wrap: wrap;
  padding: 8px;

  .sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 21px;
    // width: 100%;
    // align-items: center;


    .sidebar-item {
      position: relative;
      cursor: pointer;
      // margin-bottom: 22px;


      .circle-box {
        // width: 44px;
        // height: 44px;
        width: 54px;
        height: 54px;
        background: #f7efff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: visible;

      }



      &.is-hover {

        .circle-box {
          background: #7853b2;
        }

        .item-text {
          transform: scale(1) !important;
          opacity: 1;
          padding: 0 36px 0 20px;
          // padding: 0 36px 0 20px;

        }

        .badge {
          color: #fff;
        }
      }

      .circle-box {
        z-index: 2;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        .icon {
          width: 32px;
          height: 32px;
          transition: all 0.3s ease;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff6b35;
          color: #fff;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          border: 2px solid #f7efff;
          transition: all 0.3s ease;
        }
      }


      .qrcode-wrap {
        position: absolute;
        right: 40px;
        top: 0;
        transform: translate(-50%, -50%);

        .qrcode-box {
          width: 160px;
          height: 160px;
          background: #fff;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          .pic-box {
            width: 100px;
            height: 100px;
            border-radius: 12px;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .pic-title {
            font-size: 12px;
            color: #333;
          }
        }
      }

      &.hovered .icon-wrapper .badge {
        border-color: #7853b2;
      }

      .item-text {
        cursor: pointer;
        z-index: 1;
        position: absolute;
        right: 22px;

        transition: all 0.3s ease;
        transform: scale(0);
        font-family: Microsoft YaHei, Microsoft YaHei;
        font-weight: 400;
        font-size: 18px;
        color: #414141;


        white-space: nowrap;
        flex-wrap: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
        width: fit-content;
        // height: 44px;
        height: 54px;
        background: #ffffff;
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.09);
        border-radius: 100px 0 0 100px;
      }
      .item-text2{
        font-weight: bold;
        color:#7853B2 ;
      }
    }
  }

}

























.floating-sidebar {}

// 响应式设计
@media (max-width: 768px) {
  .floating-sidebar {
    display: none;
  }
}
</style>
