<template>
  <div class="industrialActivities">
    <div class="industrialActivitiesTop">
      <div class="topContent">
        <img :src="activityDetails.image" alt="" />
        <div class="topBtn" @click="meetingRegistration">会议报名</div>
      </div>
      <div class="bottomContent" ref="bottomContent">
        <div class="bottomContentBox">
          <div class="bottomContentLeft">
            <div class="newList">
              <a class="newListTitle" href="#activity-introduction">活动介绍</a>
              <a class="newListTitle" href="#activity-guests">活动嘉宾</a>
              <a class="newListTitle" href="#activity-agenda">活动议程</a>
              <a class="newListTitle" href="#activity-consult">活动咨询</a>
              <a class="newListTitle" href="#activity-images">活动图片</a>
              <a class="newListTitle" href="#activity-report">活动报道</a>
            </div>
          </div>
          <div class="bottomContentRight">
            <div class="bottomContentRightBtn" @click="meetingRegistration">会议报名</div>
          </div>
        </div>
      </div>
    </div>

    <div class="industrialActivitiesBottom">
      <div class="bottomContent">
        <!-- 活动介绍部分 -->
        <div class="activity-introduction" id="activity-introduction">
          <div class="section-title">
            <h2>活动介绍</h2>
          </div>

          <div class="activity-content">
            <!-- 活动主图和基本信息 -->
            <div class="activity-header">
              <div class="activity-poster">
                <img :src="activityDetails.info_image" alt="活动海报" />
              </div>
              <div class="activity-info">
                <h1 class="activity-title">
                  {{ activityDetails.title }}
                </h1>

                <div>
                  <div class="info-item">
                    <span class="info-label">活动时间：</span>
                    <span class="info-value"
                      >{{ activityDetails.start_time }} 至
                      {{ activityDetails.end_time }}</span
                    >
                  </div>

                  <div class="info-item">
                    <span class="info-label">地　　点：</span>
                    <span class="info-value">{{ activityDetails.location }}</span>
                    <span class="location-link">查看地图导航</span>
                  </div>
                </div>

                <div class="organizer-info">
                  <div class="organizer-item">
                    <span class="organizer-label">主 办 方：</span>
                    <span class="organizer-value">{{ activityDetails.sponsor }}</span>
                  </div>

                  <div class="organizer-item">
                    <span class="organizer-label">协 办 方：</span>
                    <span class="organizer-value">{{ activityDetails.corganizer }}</span>
                  </div>

                  <div class="organizer-item">
                    <span class="organizer-label">指导单位：</span>
                    <span class="organizer-value">{{
                      activityDetails.guidance_unit
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 活动详细描述 -->
            <div class="activity-description">
              <p>
                {{ activityDetails.info }}
              </p>
            </div>
          </div>
        </div>

        <!-- 活动嘉宾部分 -->
        <div class="section-title" id="activity-guests">
          <h2>活动嘉宾</h2>
        </div>
        <activity-guests :guests="activityDetails.event_guests"></activity-guests>

        <!-- 活动议程部分 -->
        <div class="activity-agenda" id="activity-agenda">
          <div class="section-title">
            <h2>活动议程</h2>
          </div>

          <div class="agenda-content">
            <div class="agenda-date-tabs">
              <div
                class="date-tab"
                v-for="(item, index) in product_activities_program_outline"
                :key="index"
                :class="{ active: activeIndex == index }"
                @click="activeIndex = index"
              >
                {{ item.date }}
              </div>
            </div>

            <div class="agenda-timeline">
              <div
                class="agenda-section"
                v-for="(section, sectionIndex) in product_activities_program_outlineList"
                :key="sectionIndex"
              >
                <div class="section-header">
                  <div class="section-name">{{ section.title }}</div>
                </div>

                <div class="timeline-items">
                  <div
                    class="timeline-item"
                    v-for="(item, itemIndex) in section.children"
                    :key="itemIndex"
                  >
                    <div class="timeline-time">{{ item.time }}</div>
                    <div class="timeline-content">
                      <div class="timeline-text">{{ item.title }}</div>
                      <div class="timeline-desc" v-if="item.content"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动咨询 -->
        <div class="activity-consult" id="activity-consult">
          <div class="section-title">
            <h2>活动咨询</h2>
          </div>
          <div class="consult-content">
            <div class="consult-item">
              联系人：{{ product_contact_us.contact_name || "维深小助理" }}
            </div>
            <div class="consult-item">电话号：{{ product_contact_us.mibile }}</div>
            <div class="consult-item">手机号：{{ product_contact_us.mibile }}</div>
            <div class="consult-item">微信号：{{ product_contact_us.wx }}</div>
          </div>
        </div>
        <!-- 活动图片 -->
        <div class="activity-images" id="activity-images">
          <div class="section-title">
            <h2>活动图片</h2>
          </div>
          <div class="images-content">
            <div
              class="images-item"
              v-for="(item, index) in activityDetails.activities_images"
              :key="index"
            >
              <img :src="item" alt="活动图片" />
            </div>
          </div>
        </div>
        <!-- 活动报道 -->
        <div class="activity-report" id="activity-report">
          <div class="section-title">
            <h2>活动报道</h2>
          </div>
          <div class="report-content">
            <div
              class="report-item"
              v-for="(item, index) in activityDetails.product_activities_report"
              :key="index"
            >
              <img :src="item.thumb" alt="活动报道" />
              <div class="report-item-title">
                <h3>{{ item.title }}</h3>
              </div>
              <div class="report-item-content">
                <p class="ellipsis-2">
                  {{ item.info }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import activityGuests from "@/components/ellsennComponents/components/activityGuests.vue";

export default {
  components: {
    activityGuests,
  },
  name: "industrialActivitiesDetail",
  data() {
    return {
      id: "",
      activeIndex: 0,
      // 活动详情数据
      activityDetails: {},

      // 活动嘉宾数据
      activityGuests: [],

      // 活动议程数据
      product_activities_program_outline: [],
    };
  },
  computed: {
    product_activities_program_outlineList() {
      return this.product_activities_program_outline[this.activeIndex]?.data || [];
    },
    product_contact_us() {
      return this.vuex_config.product_contact_us || {};
    },
  },
  mounted() {
    // 注册滚动事件监听
    window.addEventListener("scroll", this.handleScroll);
    this.id = this.$route.query.id;
    this.getActivityDetails();
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 会议报名
    meetingRegistration() {
      this.$api({
        url: "confirmOrder",
        method: "get",
        data: { id: this.id },
      })
        .then((res) => {
          console.log("====================================");
          console.log(res);
          console.log("====================================");
          if (res.code == 200) {
            this.$router.push("/meetingRegistration?id=" + this.id);
          }
        })
        .catch((err) => {
          // 调用登录
          this.$showLogin({
            onLoginSuccess: (data) => {
              this.getActivityDetails();
            },
            onRegisterSuccess: (data) => {
              console.log("注册成功:", data);
            },
            onGetCode: ({ type, account }) => {
              console.log("获取验证码:", type, account);
              // 调用实际的验证码接口
            },
          });
        });
    },
    getActivityDetails() {
      this.$api({
        url: "getProductActivityDetail",
        method: "get",
        data: { id: this.id },
      }).then((res) => {
        if (res.code == 200) {
          this.activityDetails = res.data;
          this.product_activities_program_outline =
            res.data.product_activities_program_outline;
        }
      });
    },

    handleScroll() {
      // 获取当前滚动位置
      const scrollTop = window.scrollY;
      // 获取底部内容元素
      const bottomContent = this.$refs.bottomContent;
      // 计算底部内容元素的距离
      const bottomContentTop = bottomContent.offsetTop;
      // 如果当前滚动位置大于底部内容元素的距离，悬浮
      if (scrollTop > 800) {
        bottomContent.style.position = "fixed";
        bottomContent.style.top = "0";
        bottomContent.style.zIndex = "100";
      } else {
        bottomContent.style.position = "static";
        bottomContent.style.top = "auto";
        bottomContent.style.zIndex = "0";
      }
    },
  },
};
</script>
<style scoped lang="less" src="./index.less"></style>
