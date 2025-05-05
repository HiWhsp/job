<template>
  <div class="page">
    <div class="main-title">
      <span>提交问题</span>
    </div>

    <div class="page-ctx">
      <div class="inner">
        <div class="item flex">
          <label for="">问题类型: <span>*</span></label>
          <div class="content">
            <el-select placeholder="请选择" v-model="feedType">
              <el-option label="留言咨询" value="留言咨询"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item flex">
          <label for="">问题说明: <span>*</span></label>
          <div class="content">
            <el-input type="textarea" :rows="4" v-model="content"></el-input>
          </div>
        </div>
        <div class="item flex">
          <label for=""></label>
          <div class="submit pointer" @click="onsubmit">提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "feedback",
  components: {},
  data() {
    return {
      feedType: "",
      content: ""
    };
  },
  watch: {},
  created() {
  },
  methods: {
    onsubmit() {
      this.$api("feedback_add", {
        feedType: this.feedType,
        content: this.content
      }).then((res) => {
        let {code, data, msg} = res;
        if (code == 200) {
          this.$message.success("信息反馈成功");
          this.feedType = "";
          this.content = "";
        } else {
          this.$message.error(msg);
        }
      });
    }
  },
};
</script>


<style scoped lang="less">
.page {
  padding: 0;

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
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 24px;
  padding: 25px 30px 25px 16px;
  background: #fff;
}

.inner {
  padding-bottom: 80px;

  .item {
    margin-bottom: 15px;
  }

  label {
    width: 90px;

    span {
      color: #FF0000;
    }
  }

  .submit {
    width: 240px;
    height: 34px;
    background-color: @theme;
    margin-top: 25px;

    line-height: 34px;
    font-family: Roboto, Roboto;
    border-radius: 4px;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    font-style: normal;
    text-transform: none;
  }

  .content {
    flex: 1;
  }
}

</style>
