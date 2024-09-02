<template>
  <div class="page">
    <!-- <pageBread /> -->
    <pageTop :config="pageConfig" />

    <modalJobApply ref="modalJobApply" />
    <!-- <pageAboutTop /> -->

    <div class="page-box">
      <div class="page-inner">
        <div class="job-title">
          <div class="left">
            {{ detail.title }}
          </div>
          <!-- <a  class="to-email btn-ripple" :href="'mailto:' + webConfig.email">申请岗位</a> -->
          <button class="to-email btn-ripple" @click="openModalJobApply()">申请岗位</button>
        </div>
        <div class="job-info">
          <span>{{ detail.address }}</span>
          <span class="divider"></span>
          <span>{{ detail.num }}人</span>
          <span class="divider"></span>
          <span>{{ detail.dtTime && detail.dtTime.substr(0, 10) }}</span>
        </div>

        <div class="job-line"></div>

        <div class="job-rich" v-html="detail.content"></div>
        <!-- <div class="job-zhize">
          <div class="zhize-title">工作职责</div>
          <div class="ctx">
            熟练掌握公司产品技术和应用要点，协助公司业务部门提供售前/售后技术咨询；
            <br />协助销售人员和客户进行各个层面（业务、技术实现、产品）的技术交流和解答； <br />通过邮件、电话等处理客户产品方面咨询、投诉、疑难解答，解决客户常见的相关技术问题； <br />配合业务员对客户进行现场技术指导； <br />参与市场推广活动，协助主持技术讲座、展会的技术咨询等； <br />与用户交流，收集、分析用户需求信息，整理相关技术信息为用户提供最佳方案，协助销售渠道建设和维护； <br />提供公司产品的技术咨询和培训，解决“抗体实验应用”方面的具体问题； <br />收集产品信息和用户的反馈，及时反馈公司内部，协助整理和编写公司有关数据资料； <br />完成上级领导交办的其他事项。
          </div>
        </div>
        <div class="job-yaoqiu">
          <div class="yaoqiu-title">工作要求</div>
          <div class="ctx">
            分子生物学、遗传学、细胞生物学、免疫学等相关专业，硕士及以上学历； <br />
            有1年以上同行业相关工作经验，有抗体实验及技术背景者优先； <br />
            具备较好的沟通表达能力，较强的学习能力、独立分析问题和解决问题的能力； <br />
            具备较强的责任感、团队协作精神及抗压能力；<br />
            英语读写能力良好，能熟练查阅专业文献、产品技术资料等。
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import modalJobApply from "@/components/job/modalJobApply.vue";
import { mapState } from "vuex";

export default {
  name: "create-order",
  components: {
    modalJobApply,
  },
  data() {
    return {
      id: this.$route.query.id || "",
      detail: {},
    };
  },
  computed: {
    ...mapState([""]),


    pageConfig() {
      return {
        banner: this.bannerMap['关于我们'],
        title: '关于我们',
        title_en: 'ABOUT US',
        list_bread: [
          {
            title: '关于我们',
            route: '',
          },
          {
            title: '人才招聘',
            route: '',
          },
        ],
        nav_list: this.child_about
      };
    },
  },
  watch: {},

  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api("index_recruitInfo", {
        id: this.id,
      }).then((res) => {
        this.detail = res.data;
        //console.log(this.$route);
      });
    },

    jobApply() {},

    openModalJobApply() {
      this.$refs.modalJobApply.init(this.detail);
    },
  },
};
</script>

<style scoped lang="less">
.page {
  background: #FFFFFF;
  padding-bottom: 100px;
  min-height: 50vh;

  .page-box {
    // background: #f7f7f7;
    // background: #fff;
  }
  .page-inner {
    width: @width;
    margin: 0 auto;
    padding: 40px;
    background: #fff;

    .detail-title {
      font-size: 36px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .detail-title-line {
      width: 80px;
      margin: 24px auto;
      height: 5px;
      background: #ea3200;
      border-radius: 3px 3px 3px 3px;
    }
  }
}

.job-title {
  position: relative;
  margin-bottom: 20px;
  text-align: left;
  font-size: 36px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;

  .to-email {
    position: absolute;
    right: 0;
    width: 268px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: #ea3200;
    background: #4CA5E4;
    border-radius: 4px 4px 4px 4px;
    font-size: 20px;
    font-family: SourceHanSansSC-Regular-, SourceHanSansSC-Regular;
    font-weight: normal;
    color: #ffffff;
  }
}
.job-info {
  margin-bottom: 45px;
  text-align: left;
  .flex();

  .divider {
    margin: 0 15px;
    display: inline-block;
    width: 1px;
    height: 16px;
    background: #aaa;
  }
}

.job-line {
  width: 100%;
  height: 1px;
  background: #ddd;
}

.job-rich {
  text-align: left;
  padding: 50px 0;
  line-height: 1.5;
}

.job-zhize {
  text-align: left;
  .zhize-title {
    margin: 40px 0;
    font-size: 28px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
}
.job-yaoqiu {
  text-align: left;
  .yaoqiu-title {
    margin: 40px 0;
    font-size: 28px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
}

.ctx {
  font-size: 16px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
}
</style>

<style scoped lang="less" src="@/assets/h5css/page/jobdetail.less"></style>
