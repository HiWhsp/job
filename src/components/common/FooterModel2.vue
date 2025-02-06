<template>
  <div class="wrap">
    <div class="baozhang-box">
      <div class="footer-top-list1 w-1200">
        <div class="list1-item">
          <!-- <img src="@pro/footer/icon-1.png" alt /> -->
          <div class="item-con">
            <p>正品保障</p>
            <span>正品保障，诚信服务</span>
          </div>
        </div>
        <div class="list1-item">
          <!-- <img src="@pro/footer/icon-2.png" alt /> -->
          <div class="item-con">
            <p>一站式服务</p>
            <span>一站式服务</span>
          </div>
        </div>
        <div class="list1-item">
          <!-- <img src="@pro/footer/icon-3.png" alt /> -->
          <div class="item-con">
            <p>万千信赖</p>
            <span>品类齐全 值得信赖</span>
          </div>
        </div>
        <div class="list1-item">
          <!-- <img src="@pro/footer/icon-4.png" alt /> -->
          <div class="item-con">
            <p>无忧售后</p>
            <span>专业团队 无忧售后</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-top w-1200">
      <div class="link-box">
        <div class="left-link">
          <!-- 左侧链接 -->
          <div class="list-link">
            <div class="list2-item" v-for="(item, index) in footer_nav" :key="index">
              <div class="list2-item-top">
                {{ item.title }}
              </div>
              <div class="item-con">
                <ul>
                  <li v-for="(sub, sub_index) in item.child" :key="sub_index" @click="jump_service(sub)">
                    <a>{{ sub.title }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="right-link">
          <!-- 右侧服务热线 二维码 -->
          <div class="info">
            <div class="right-text">
              <div class="img-box">
                <!-- <img src="@pro/common/phone2.png" alt="" /> -->
              </div>
              <div class="text-box">
                <div class="text-1">服务热线</div>
                <div class="text-2">{{ vuex_config.com_title }}</div>
                <div class="text-3">服务时间</div>
                <div class="text-4">{{ vuex_config.fuwushijian }}</div>
              </div>
            </div>
          </div>
          <div class="img-box">
            <img :src="vuex_config.com_logo" alt />
            <div class="text">移动端</div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-con">
        <div class="friend-links" v-if="footer_logo_friend_link.length">
          <div class="friend-link-item" v-for="(item, index) in footer_logo_friend_link" :key="index" @click="to_logo_friend_link(item)">
            <img :src="item.logo" alt="" />
          </div>
        </div>
        <div class="adreess">
          <a href="https://beian.miit.gov.cn/" target="_blank"> {{ vuex_config.com_honor }}</a>
        </div>
        <div class="adreess">公司地址：{{ vuex_config.com_address }} 全国热线：{{ vuex_config.com_title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "commonShare",
  components: {},
  props: [],
  data() {
    return {
      showNow: false, //是否立即展示
    };
  },
  computed: {
    ...mapState(["footer_nav", "footer_logo_friend_link"]),
  },
  watch: {},

  created() {},

  methods: {
    to_logo_friend_link(item) {
      if (item.link) {
        window.open(item.link, "_blank");
      }
    },

    onClick_nav(item) {
      this.$router.push({
        path: "/" + item.url,
      });
    },

    jump_service(item) {
      console.log({ ...item });

      this.$router.push(`/service?id=${item.id}`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.fixed-box {
  img {
    width: 100%;
  }
}

.wrap {
  width: 100%;
  background: #e5e5e5;
  border-top: 1px solid #e5e5e5;

  .baozhang-box {
    padding: 50px 0;
    border-bottom: 1px solid #707070;
    .footer-top-list1 {

      margin: 0 auto;
      display: flex;
      align-items: center;
      align-items: flex-start;
      justify-content: space-between;

      .list1-item {
        display: flex;
        align-items: center;

        img {
          height: 46px;
        }
        .item-con {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          margin-left: 10px;
          p {
            font-size: 18px;
            font-family: MicrosoftYaHei;
            line-height: 38px;
            color: #212121;
          }
          span {
            font-size: 14px;
            color: #878787;
          }
        }
      }
    }
  }

  .footer-top {

    margin: 0 auto;

    .link-box {
      padding-top: 40px;
      padding-bottom: 60px;
        display: flex;
  align-items: center;
  justify-content: space-between;
      align-items: flex-start;

      .left-link {
        flex: 2;
        .list-link {
        }
      }

      .right-link {
        display: flex;
        justify-content: space-between;
        .info {
          margin-right: 100px;
          display: flex;
          .left-phone-img {
            align-self: flex-start;
            img {
              width: 48px;
              height: 48px;
            }
          }
          .right-text {
            text-align: left;
            display: flex;

            .img-box {
              img {
                width: 48px;
                height: 48px;
              }
            }
            .text-box {
              margin-left: 12px;
              .text-1 {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 38px;
                color: #333333;
              }
              .text-2 {
                font-size: 26px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 38px;
                color: var(--main_color);
                white-space: nowrap;
              }
              .text-3 {
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 38px;
                color: #333333;
              }
              .text-4 {
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 38px;
                color: #707070;
              }
            }
          }
        }
        .img-box {
          img {
            width: 100px;
            height: 100px;
          }
          .text {
            margin-top: 12px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 38px;
            color: #333333;
          }
        }
      }
    }

    .list-link {
      width: 750px;
        display: flex;
  align-items: center;
      justify-content: space-around;
      align-items: flex-start;

      .list2-item {
        .list2-item-top {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: #000000;
          font-weight: bold;
          img {
            height: 20px;
            display: none;
          }
          span {
            font-size: 16px;
            color: #000000;
            font-weight: bold;
          }
        }
        .item-con {
          margin-top: 20px;
          margin-left: 0;
          min-width: 110px;
          text-align: left;
          ul li {
            font-size: 14px;
            font-family: MicrosoftYaHei;
            line-height: 30px;
            color: #666666;

            list-style: none;
            a {
              font-size: 13px;
              line-height: 26px;
              color: #575757;
              cursor: pointer;
            }
            a:hover {
              color: var(--main_color);
            }
          }
        }
      }
    }
  }
  .footer-bottom {
    .flex-center();
    min-height: 60px;
    background: #2a2a2a;
    line-height: 25px;
    color: #fff;
    padding: 10px 0;

    a {
      line-height: 25px;
      color: #fff;
    }

    .friend-links {
      .flex-center();
      flex-wrap: wrap;
      max-width: 1200px;
      margin: 0 auto;
      padding-bottom: 10px;

      .friend-link-item {
        img {
          height: 45px;
          margin: 0 7px;
          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
