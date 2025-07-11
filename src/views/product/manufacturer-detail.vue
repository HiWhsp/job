<template>
  <div class="manufacturer-detail-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-section">
      <page_breadcrumb :option="nav_option" />
    </div>

    <!-- 企业头部信息区域 -->
    <div class="company-header-section w-1400">
      <div class="company-header-content">
        <!-- 左侧：公司logo -->
        <div class="company-logo">
          <div class="logo-container">
            <img :src="companyInfo.logo_full" alt="Logo" />
          </div>
        </div>

        <!-- 中间：企业信息 -->
        <div class="company-info-center">
          <h1 class="company-name">{{ companyInfo.companyName }}</h1>
          <div class="company-meta">
            <span class="meta-item">从事{{ workTypeName }}相关</span>
            <span class="meta-separator">·</span>
            <span class="meta-item">{{ companyInfo.provinceName }}</span>
            <span class="meta-separator">·</span>
            <span class="meta-item">{{ companyInfo.followNum }}关注</span>
          </div>
          <div class="company-website">
            官网：<span @click="toUrl(companyInfo.homePage)">{{
              companyInfo.homePage
            }}</span>
          </div>
          <div class="action-buttons">
            <button class="btn-follow" @click="handleFollow" v-if="!companyInfo.isFollow">
              <i class="el-icon-plus"></i>
              关注
            </button>
            <button class="btn-follow" @click="handleFollow" v-else>
              <i class="el-icon-check"></i>
              已关注
            </button>
            <button class="btn-message" @click="handleMessage">
              <img src="@/assets/image/icon/msg.png" alt="留言" />
              留言
            </button>
          </div>
        </div>

        <!-- 右侧：企业图片 -->
        <div class="company-info-right">
          <div class="company-image">
            <img :src="companyInfo.backImage_full" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- 企业详细介绍区域 -->
    <div class="company-detail-section w-1400">
      <div class="detail-container">
        <div class="section-tabs">
          <div class="tab-nav">
            <span
              class="tab-item"
              :class="{ active: activeTab === 'introduction' }"
              @click="activeTab = 'introduction'"
              >企业介绍</span
            >
            <span
              class="tab-item"
              :class="{ active: activeTab === 'products' }"
              @click="activeTab = 'products'"
              >产品介绍</span
            >
            <span
              class="tab-item"
              :class="{ active: activeTab === 'contact' }"
              @click="activeTab = 'contact'"
              >地址和联系方式</span
            >
          </div>
        </div>

        <!-- 企业介绍内容 -->
        <div class="tab-content" v-show="activeTab === 'introduction'">
          <div class="company-introduction" v-html="companyInfo.introduce"></div>
        </div>

        <!-- 产品介绍内容 -->
        <div class="tab-content" v-show="activeTab === 'products'">
          <div class="products-introduction">
            <!-- 产品展示 -->
            <div
              class="product-showcase"
              v-for="(product, index) in products"
              :key="index"
            >
              <h3 class="showcase-title">
                <span class="title-text">{{ product.product_type_title }}</span>
              </h3>
              <div class="product-list">
                <div
                  class="product-item"
                  v-for="(item, i) in product.product_list"
                  :key="i"
                >
                  <div class="product-image">
                    <img :src="item.image_full" :alt="item.name" />
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ item.name }}</h4>
                    <div class="product-specs">
                      <div class="spec-item">
                        {{ item.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty v-if="!products || products.length === 0" description="暂无产品" />
          </div>
        </div>

        <!-- 地址和联系方式内容 -->
        <div class="tab-content" v-show="activeTab === 'contact'">
          <div class="contact-info">
            <div class="contact-item">
              <strong>地址：</strong>
              <span>{{ companyInfo.address }}</span>
            </div>
            <div class="contact-item">
              <strong>邮箱：</strong>
              <span>{{ companyInfo.email }}</span>
            </div>
            <div class="contact-item">
              <strong>电话：</strong>
              <span>{{ companyInfo.contact }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言弹框 -->
    <div class="message-modal" v-if="showMessageModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>留言</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>姓名：</label>
            <input
              type="text"
              v-model="messageForm.name"
              placeholder="请输入姓名"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>电话：</label>
            <input
              type="tel"
              v-model="messageForm.mobile"
              placeholder="请输入手机号"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>邮箱：</label>
            <input
              type="email"
              v-model="messageForm.email"
              placeholder="请输入邮箱"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>公司名：</label>
            <input
              type="text"
              v-model="messageForm.companyName"
              placeholder="请输入公司名"
              class="form-input"
              disabled
            />
          </div>
          <div class="form-group">
            <label>留言内容：</label>
            <textarea
              v-model="messageForm.content"
              placeholder="请输入"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" @click="submitMessage">提交</button>
          <button class="btn-cancel" @click="closeModal">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page_breadcrumb from "@/components/page/page-breadcrumb.vue";

export default {
  name: "ManufacturerDetail",
  components: {
    page_breadcrumb,
  },
  data() {
    return {
      activeTab: "introduction",
      showMessageModal: false,
      // 留言表单数据
      messageForm: {
        name: "",
        mobile: "",
        email: "",
        companyName: "",
        content: "",
        companyId: "",
      },
      // 微型断路器产品数据
      miniBreakers: [
        {
          id: 1,
          name: "微型断路器",
          specs: ["HSR2,HSM8,HSM8N-32 H", "SRZ,HSM8,HSM8N-32"],
          image: "https://via.placeholder.com/120x100/f0f0f0/666?text=断路器",
        },
        {
          id: 2,
          name: "微型断路器",
          specs: ["HSR2,HSM8,HSM8N-32 H", "SRZ,HSM8,HSM8N-32"],
          image: "https://via.placeholder.com/120x100/f0f0f0/666?text=断路器",
        },
        {
          id: 3,
          name: "微型断路器",
          specs: ["HSR2,HSM8,HSM8N-32 H", "SRZ,HSM8,HSM8N-32"],
          image: "https://via.placeholder.com/120x100/f0f0f0/666?text=断路器",
        },
      ],
      companyInfo: {},
      products: [],
      workTypeList: [],
    };
  },
  computed: {
    nav_option() {
      return [
        {
          route: "/system-manufacturer-list?companyType=" + this.companyInfo.companyType,
          title: this.companyInfo.companyType == 1 ? "系统厂商" : "配置厂商",
        },
        {
          route: this.$route.path,
          title: "厂商详情",
        },
      ];
    },
    workTypeName() {
      const list = this.companyInfo.workType;
      const strList = [];
      // workTypeList 是一个树形结构，需要遍历找到对应的name_zh
      const findWorkTypeName = (items) => {
        items.forEach((item) => {
          if (list.includes(item.id)) {
            strList.push(item.name_zh);
          }
          if (item.children && item.children.length > 0) {
            findWorkTypeName(item.children);
          }
        });
      };
      findWorkTypeName(this.workTypeList);
      return strList.join(",");
    },
  },
  mounted() {
    // 页面初始化逻辑
    this.loadData();
    this.$api({
      url: "getFinishSelect",
      method: "get",
    }).then((res) => {
      console.log(res);
      let { code, data, msg } = res;
      if (code == 200) {
        this.workTypeList = data.typeListTree;
      }
    });
  },
  methods: {
    loadData() {
      this.$api({
        url: "companyDetail",
        method: "get",
        data: {
          companyId: this.$route.query.id,
          userId: this.vuex_user.id,
        },
      }).then((res) => {
        console.log(res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.companyInfo = data.shopInfo;
          this.products = data.ptoducts;
          this.messageForm.companyName = this.companyInfo.companyName;
          this.messageForm.companyId = this.companyInfo.id;
        }
      });
    },
    handleFollow() {
      // 关注逻辑
      console.log("关注");
      this.$api({
        url: "followCompany",
        method: "post",
        data: {
          userId: this.vuex_user.id,
          companyId: this.companyInfo.id,
          type: this.companyInfo.isFollow ? 2 : 1,
        },
      }).then((res) => {
        console.log(res);
        let { code, data, msg } = res;
        if (code == 200) {
          this.$message.success("操作成功");
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      });
    },
    handleMessage() {
      // 显示留言弹框
      this.showMessageModal = true;
    },
    closeModal() {
      // 关闭弹框
      this.showMessageModal = false;
      // 重置表单
      this.messageForm = {
        name: "",
        mobile: "",
        email: "",
        content: "",
      };
    },
    submitMessage() {
      // 表单验证
      if (!this.messageForm.name.trim()) {
        alert("请输入姓名");
        return;
      }
      if (!this.messageForm.mobile.trim()) {
        alert("请输入手机号");
        return;
      }
      if (!this.messageForm.content.trim()) {
        alert("请输入留言内容");
        return;
      }

      // 提交留言逻辑
      console.log("提交留言:", this.messageForm);
      this.$api({
        url: "addCompanyComment",
        method: "post",
        data: this.messageForm,
      }).then((res) => {
        let { code, data, msg } = res;
        if (code == 200) {
          this.$message.success("留言成功");
          this.loadData();
        } else {
          this.$message.error(msg);
        }
      });
      this.closeModal();
    },
    toUrl(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="less" src="./manufacturer-detail.less"></style>
