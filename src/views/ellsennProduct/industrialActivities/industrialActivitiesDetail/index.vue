<template>
  <div class="industrialActivities">
    <div class="industrialActivitiesTop">
      <div class="topContent">
        <img src="@/assets/img/ellsenn/blueBg.png" alt="" />
        <div class="topBtn" @click="meetingRegistration">会议报名</div>
      </div>
      <div class="bottomContent" ref="bottomContent">
        <div class="bottomContentBox">
          <div class="bottomContentLeft">
            <div class="newList">
              <div class="newListTitle">活动介绍</div>
              <div class="newListTitle">活动嘉宾</div>
              <div class="newListTitle">活动咨询</div>
              <div class="newListTitle">活动图片</div>
              <div class="newListTitle">活动报道</div>
            </div>
          </div>
          <div class="bottomContentRight">
            <div class="bottomContentRightBtn" @click="meetingRegistration">
              会议报名
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="industrialActivitiesBottom">
      <div class="bottomContent">
        <!-- 活动介绍部分 -->
        <div class="activity-introduction">
          <div class="section-title">
            <h2>活动介绍</h2>
          </div>

          <div class="activity-content">
            <!-- 活动主图和基本信息 -->
            <div class="activity-header">
              <div class="activity-poster">
                <img src="@/assets/img/ellsenn/blueBg.png" alt="活动海报" />
              </div>
              <div class="activity-info">
                <h1 class="activity-title">
                  2025 AI/AR智能眼镜智能制造高峰论坛
                </h1>

                <div>
                  <div class="info-item">
                    <span class="info-label">活动时间：</span>
                    <span class="info-value"
                      >2025-01-15 15:00:00 至 2025-01-15 18:00:00</span
                    >
                  </div>

                  <div class="info-item">
                    <span class="info-label">地　　点：</span>
                    <span class="info-value">北京市大兴区兴国际中心</span>
                    <span class="location-link">查看地图导航</span>
                  </div>
                </div>

                <div class="organizer-info">
                  <div class="organizer-item">
                    <span class="organizer-label">主 办 方：</span>
                    <span class="organizer-value"
                      >埃华科技有限公司、武汉大学苏州研究院</span
                    >
                  </div>

                  <div class="organizer-item">
                    <span class="organizer-label">协 办 方：</span>
                    <span class="organizer-value"
                      >XXXX科技有限公司、XXXX科技有限公司、XXXX科技有限公司</span
                    >
                  </div>

                  <div class="organizer-item">
                    <span class="organizer-label">指导单位：</span>
                    <span class="organizer-value"
                      >埃华科技有限公司、武汉大学苏州研究院</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 活动详细描述 -->
            <div class="activity-description">
              <p>
                2025年是AI智能眼镜产业爆发的一年，随着Meta、雷鸟创新、闪耀、小米、三星等品牌推出新品发布，行业正式入'产品定义'迈向'智造赋能'的关键阶段。然而，AI智能眼镜的规模化生产仍临诸多挑战，多SKU柔性化制造、全链路检测等核心环节，为产业链各点，出现深度信息wellsenn联合联想达科技主办、深圳市增视觉技术应用协会、AI智能眼镜产业联盟协办的2025年AI智能眼镜生产者峰会高端论坛定于4月11日在深圳南山深圳湾万丽酒店举办，聚焦AI智能眼镜'柔性智造·智能制造'主题，汇聚200+行业领袖，共探智造升级新路径，通过火热对话共建美、柔性制造、光学装配、点胶技术心灵等关键技术工艺。
              </p>

              <p>
                本次活动以'柔性制造、智能制造'为主题，吸引了近200位业内人士、110余家企业代表齐聚一堂，围绕智能眼镜产业链的关键环节，芯片对接、光学装配、点胶工艺、器件检测等核心环节展开深度探讨，此次峰会由埃华深信息、康舒达、海瑞思、福州特万、华天科技、激光光学等企业代表分别就自己在智能眼镜发表主题演讲。
              </p>
            </div>
          </div>
        </div>

        <!-- 活动嘉宾部分 -->
        <div class="section-title">
          <h2>活动嘉宾</h2>
        </div>
        <activity-guests :guests="activityGuests"></activity-guests>

        <!-- 活动议程部分 -->
        <div class="activity-agenda">
          <div class="section-title">
            <h2>活动议程</h2>
          </div>

          <div class="agenda-content">
            <div class="agenda-date-tabs">
              <div class="date-tab active">2025-05-08</div>
              <div class="date-tab">2025-05-09</div>
            </div>

            <div class="agenda-timeline">
              <div
                class="agenda-section"
                v-for="(section, sectionIndex) in activityAgenda"
                :key="sectionIndex"
              >
                <div class="section-header">
                  <div class="section-name">{{ section.name }}</div>
                </div>

                <div class="timeline-items">
                  <div
                    class="timeline-item"
                    v-for="(item, itemIndex) in section.list"
                    :key="itemIndex"
                  >
                    <div class="timeline-time">{{ item.time }}</div>
                    <div class="timeline-content">
                      <div class="timeline-text">{{ item.text }}</div>
                      <div class="timeline-desc" v-if="item.desc">
                        {{ item.desc }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 活动咨询 -->
        <div class="activity-consult">
          <div class="section-title">
            <h2>活动咨询</h2>
          </div>
          <div class="consult-content">
            <div class="consult-item">联系人：维深助理</div>
            <div class="consult-item">电话号：wellsenn001</div>
            <div class="consult-item">手机号：18611823719</div>
            <div class="consult-item">微信号：abc@wellsenn.com</div>
          </div>
        </div>
        <!-- 活动图片 -->
        <div class="activity-images">
          <div class="section-title">
            <h2>活动图片</h2>
          </div>
          <div class="images-content">
            <div class="images-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动图片" />
            </div>
            <div class="images-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动图片" />
            </div>
            <div class="images-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动图片" />
            </div>
            <div class="images-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动图片" />
            </div>
          </div>
        </div>
        <!-- 活动报道 -->
        <div class="activity-report">
          <div class="section-title">
            <h2>活动报道</h2>
          </div>
          <div class="report-content">
            <div class="report-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动报道" />
              <div class="report-item-title">
                <h3>Scaling Law的尽头是什么？</h3>
              </div>
              <div class="report-item-content">
                <p class="ellipsis-2">
                  在当日下午举行的“AI技术范式的变革：ScalingLaw的尽头是什么”圆桌环节，百度集团副总裁侯震宇、百度集团副总裁侯震宇百度集团副总裁侯震宇
                </p>
              </div>
            </div>
            <div class="report-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动报道" />
              <div class="report-item-title">
                <h3>Scaling Law的尽头是什么？</h3>
              </div>
              <div class="report-item-content">
                <p class="ellipsis-2">
                  在当日下午举行的“AI技术范式的变革：ScalingLaw的尽头是什么”圆桌环节，百度集团副总裁侯震宇、百度集团副总裁侯震宇百度集团副总裁侯震宇
                </p>
              </div>
            </div>
            <div class="report-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动报道" />
              <div class="report-item-title">
                <h3>Scaling Law的尽头是什么？</h3>
              </div>
              <div class="report-item-content">
                <p class="ellipsis-2">
                  在当日下午举行的“AI技术范式的变革：ScalingLaw的尽头是什么”圆桌环节，百度集团副总裁侯震宇、百度集团副总裁侯震宇百度集团副总裁侯震宇
                </p>
              </div>
            </div>
            <div class="report-item">
              <img src="@/assets/img/ellsenn/blueBg.png" alt="活动报道" />
              <div class="report-item-title">
                <h3>Scaling Law的尽头是什么？</h3>
              </div>
              <div class="report-item-content">
                <p class="ellipsis-2">
                  在当日下午举行的“AI技术范式的变革：ScalingLaw的尽头是什么”圆桌环节，百度集团副总裁侯震宇、百度集团副总裁侯震宇百度集团副总裁侯震宇
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
  props: {},
  name: "industrialActivities",
  data() {
    return {
      // 活动详情数据
      activityDetails: {
        title: "2025 AI/AR智能眼镜智能制造高峰论坛",
        time: "2025-01-15 15:00:00 至 2025-01-15 18:00:00",
        location: "北京市大兴区兴国际中心",
        organizer: "埃华科技有限公司、武汉大学苏州研究院",
        coOrganizer: "XXXX科技有限公司、XXXX科技有限公司、XXXX科技有限公司",
        guidance: "埃华科技有限公司、武汉大学苏州研究院",
        description: [
          "2025年是AI智能眼镜产业爆发的一年，随着Meta、雷鸟创新、闪耀、小米、三星等品牌推出新品发布，行业正式入'产品定义'迈向'智造赋能'的关键阶段。然而，AI智能眼镜的规模化生产仍临诸多挑战，多SKU柔性化制造、全链路检测等核心环节，为产业链各点，出现深度信息wellsenn联合联想达科技主办、深圳市增视觉技术应用协会、AI智能眼镜产业联盟协办的2025年AI智能眼镜生产者峰会高端论坛定于4月11日在深圳南山深圳湾万丽酒店举办，聚焦AI智能眼镜'柔性智造·智能制造'主题，汇聚200+行业领袖，共探智造升级新路径，通过火热对话共建美、柔性制造、光学装配、点胶技术心灵等关键技术工艺。",
          "本次活动以'柔性制造、智能制造'为主题，吸引了近200位业内人士、110余家企业代表齐聚一堂，围绕智能眼镜产业链的关键环节，芯片对接、光学装配、点胶工艺、器件检测等核心环节展开深度探讨，此次峰会由埃华深信息、康舒达、海瑞思、福州特万、华天科技、激光光学等企业代表分别就自己在智能眼镜发表主题演讲。",
        ],
      },

      // 活动嘉宾数据
      activityGuests: [],

      // 活动议程数据
      activityAgenda: [
        {
          name: "开幕式",
          list: [
            {
              time: "09:30-10:30",
              text: "报告发布《万千流变，一如既往:2024中国科技产业趋势判断》",
              desc: "甲子智库院长 宋涛",
            },
          ],
        },
        {
          name: "青年科学论坛",
          list: [
            {
              time: "10:30-11:45",
              text: "圆桌对话《商点、书点、着点,AI如何赋能的好科技》",
              desc: "清华大学人工智能研究院副院长长、生数科技创始人 朱军\n智联招聘CEO 郭盛\n北京智源人工智能研究院院长 王仲远\n甲子光年首席内容官 王博",
            },
            {
              time: "11:45-12:00",
              text: "主题演讲《技术创新下，AI大模型如何赋能游戏乐、社交、游戏出海》",
              desc: "腾讯游戏副总裁CEO 方杰",
            },
            {
              time: "13:35-13:55",
              text: "主题演讲《数字大语言模型的AI助教》",
              desc: "北京大学计算机科学技术研究所 长聘教授 袁粒",
            },
            {
              time: "13:55-14:15",
              text: "主题演讲《是马智能Scaling Law与可视化具身数据研究》",
              desc: "上海交通大学教授、可可西里联合创始人、长江学者 卢策吾",
            },
            {
              time: "14:15-14:35",
              text: "主题演讲《商用AI2.0的算力优化研究与落地探索》",
              desc: "清华大学电子工程系教授、黄土高原学者基金委杰青、IEEE Fellow、无问芯穹联合人 汪玉",
            },
            {
              time: "14:35-14:55",
              text: "主题演讲《数学与人工智能》",
              desc: "美国北卡大学Pancoast讲席教授、天津大学数学学院教授 曹延东",
            },
            {
              time: "14:55-15:15",
              text: "主题演讲《合成大数据驱动的具身智能关键技术》",
              desc: "北京理工大学、博士生导师、博导通信创始人、CTO、智源学者 王晶",
            },
            {
              time: "15:15-15:35",
              text: "主题演讲《AI大模型赋能数据库系统》",
              desc: "清华大学交叉信息学院副教授、千万智能创始人 高阳",
            },
            {
              time: "15:35-15:55",
              text: "主题演讲《人工智能新时代对创业的新解新道》",
              desc: "Bot Auto CEO 袁德俊",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // 注册滚动事件监听
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    // 会议报名
    meetingRegistration() {
      this.$router.push("/meetingRegistration");
    },

    onBtnClick() {
      console.log("onBtnClick");
    },
    handleScroll() {
      // 获取当前滚动位置
      const scrollTop = window.scrollY;
      // 获取底部内容元素
      const bottomContent = this.$refs.bottomContent;
      // 计算底部内容元素的距离
      const bottomContentTop = bottomContent.offsetTop;
      console.log(scrollTop, bottomContentTop);
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
