<template>
  <div class="help-center">
    <!-- 顶部横幅 -->
    <div class="header-banner">
      <div class="banner-content">
        <h1 class="title">商务合作</h1>
        <p class="subtitle">BUSINESS COLLABORATION</p>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧导航菜单 -->
      <div class="sidebar">
        <ul class="nav-menu">
          <li
            class="nav-item"
            v-for="(item, index) in cooperationList"
            :key="index"
            :class="{ active: activeMenu === index }"
            @click="setActiveMenu(index)"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <div class="content-section">
          <h2 class="section-title">{{ cooperationList[activeMenu] }}</h2>
          <div class="content">
            <div class="content-item">
              <div class="content-item-title">姓名：</div>
              <el-input v-model="form.name" placeholder="请输入内容" />
            </div>
            <div class="content-item">
              <div class="content-item-title">手机号：</div>
              <el-input v-model="form.mobile" placeholder="请输入内容" />
            </div>
            <div class="content-item">
              <div class="content-item-title">公司名称：</div>
              <el-input v-model="form.company_name" placeholder="请输入内容" />
            </div>
          </div>
          <div class="submit-btn">
            <el-button type="primary" @click="submitForm">预约咨询</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cooperation",
  data() {
    return {
      activeMenu: {}, // 默认选中平台介绍
      cooperationList: [],
      form: {
        name: "",
        mobile: "",
        company_name: "",
      },
    };
  },
  mounted() {
    this.$api({
      url: "someList",
      method: "get",
    }).then((res) => {
      this.cooperationList = res.data.bussinessType;
      this.activeMenu = Object.keys(this.cooperationList)[0];
    });
  },
  methods: {
    setActiveMenu(index) {
      this.activeMenu = index;
    },
    submitForm() {
      this.$api({
        url: "addShangwu",
        method: "post",
        data: {
          ...this.form,
          type_id: this.activeMenu,
        },
      }).then((res) => {
        this.$message.success("提交成功");
        this.form = {
          name: "",
          mobile: "",
          company_name: "",
        };
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./cooperation.less";
</style>
