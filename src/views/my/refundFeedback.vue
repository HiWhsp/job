<template>
  <div class="page">
    <div class="main-title">
      <span>售后</span>
    </div>

    <div class="page-ctx">
      <div class="refund-tip">
        <div class="rich-box html-frag" v-html="detail.content"></div>
      </div>
      <div class="refund-title">请选择售后反馈表</div>
      <div class="refund-table">
        <div class="table-item" v-for="(item, index) in file_list" :key="index">
          <a target="_blank" :href="item.download">
            <div class="img-box">
              <img src="@img/excel.png" alt="" />
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="icon-box">
              <img src="@img/download.png" alt="" />
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "servicePage",
  components: {},
  data() {
    return {
      detail: {},
      file_list: [],
      list_excel: [
        {
          title: "贝茵莱ELISA代测售后反馈表",
          link: "",
        },
        {
          title: "贝茵莱ELISA反馈表",
          link: "",
        },
        {
          title: "基因美ELISA反馈表",
          link: "",
        },
        {
          title: "售后反馈表 抗体 （ICC IF）",
          link: "",
        },
        {
          title: "售后反馈表 抗体 （IHC）",
          link: "",
        },
        {
          title: "售后反馈表 抗体 （WB）",
          link: "",
        },
      ],
    };
  },
  computed: {
    // ...mapState([""]),
  },
  watch: {},
  created() {
    this.setView();
  },
  methods: {
    setView() {
      //售后规则
      this.$api("index_newsDetail", {
        id: 97,
      }).then((res) => {
        //console.log("售后规则", res);
        this.detail = res.data.info;
      });

      //售后反馈表 附件下载
      this.$api("brand_refund", {}).then((res) => {
        // //console.log("售后反馈", res);
        this.file_list = res.data;
      });
    },
  },
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;
  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #4CA5E4;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 40px 32px;
    background: #fff;
  }
}

.page {
  .page-ctx {
    padding-bottom: 80px;

    .refund-tip {
      height: auto;
      padding: 25px;
      background: #f5f5f5;

      .rich-box {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        line-height: 28px;

        /deep/ img {
          max-width: 100%;
          display: block;
          margin: 10px 0;
        }
      }
    }

    .refund-title {
      margin-top: 32px;
      margin-bottom: 24px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #666666;
    }

    .refund-table {
      display: flex;
      flex-wrap: wrap;
      .table-item {
        margin-right: 32px;
        margin-bottom: 26px;
        .flex-center();
        flex-direction: column;
        width: 343px;
        height: 202px;
        box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.16);
        cursor: pointer;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:hover {
          .icon-box {
            display: block;
            transform: scale(1);
          }
        }

        a {
          display: block;
          width: 343px;
          height: 202px;
          flex-direction: column;
          .flex-center();
        }

        .img-box {
          img {
            width: 30px;
          }
        }

        .title {
          margin-top: 24px;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }

        .icon-box {
          display: none;
          margin-top: 24px;
          transform: scale(0);
          transition: 0.2s linear;
          img {
            width: 32px;
          }
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/refundFeedback.less"></style>
