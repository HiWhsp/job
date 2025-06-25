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
            <img
              src="https://via.placeholder.com/80x80/4A90E2/fff?text=Logo"
              alt="杭申电器Logo"
            />
          </div>
        </div>

        <!-- 中间：企业信息 -->
        <div class="company-info-center">
          <h1 class="company-name">杭申电器</h1>
          <div class="company-meta">
            <span class="meta-item">从事制造相关</span>
            <span class="meta-separator">·</span>
            <span class="meta-item">杭州</span>
            <span class="meta-separator">·</span>
            <span class="meta-item">1000万注册</span>
          </div>
          <div class="company-website">官网：https://www.hzk.com.cn</div>
          <div class="action-buttons">
            <button class="btn-follow" @click="handleFollow">
              <i class="el-icon-plus"></i>
              关注
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
            <img
              src="https://via.placeholder.com/400x200/f0f0f0/666?text=企业建筑"
              alt=""
            />
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
          <div class="company-introduction">
            <p>
              杭州之江开发区的有限公司是电控电缆行业区内高端市场的重要骨干企业，占地面积7000㎡，建筑面积6800㎡，企业地址杭州市西湖区，东靠杭州钱塘江
              腰部门店，南依天目山（杭创储）高速公路，要路高铁干线，北接世界奇葩硅谷沿江开发基地，交通十分便捷。
            </p>
            <p>
              公司是国家高点高端技术企业，浙江专业示范企业，通过GB/T19001，GB/T24001，GB/T28001三体系认证，综合技术力量雄厚，是国家双识质量七防精工
              社会场，国家级企业技术中心，国家级CNAS实验室可运营的执行主体，公司拥有省级企业研究院，省级数字化车间，自动化生产设备和智能化检测设备齐全，内设各
              种检中心，技术装备中心，生产供应中心，材料综合中心等部门，企业现增值健康，在全国各大城市设有分部门566，单梯高达100多处，技术服务网络覆盖
              全国。
            </p>
            <p>
              公司专注于高性能电缆电器，控制电缆，终端电器，智能仪表，系统技术等领域的研发，制造，营销和服务，"科技是第一生产力"，公司以创新求发展，不断
              提高科研开发技术水准和水平，部分参数达当当国际先进或国内领先水平，与上海电缆科学研究院，浙江大学，河北工业大学等单位院系有长期技术合作
              体，又是华中理工大学，东北理工大学 广大，参与
              的长期理论交流基地，采用互联网+"云平台大数据技术，美的广技术生态创新管理，是有备识证工位监控平
              台，实现厂主厂全过程客户产品的启用主要控制发生了转型。
            </p>
            <p>
              公司拥有30万伏等级产品生产能力，数字化设备管控自主开发能力，建设，制作企业，专业工程科技开发中心，质量检测中心，石材化工，炼铜交通，船舶运输等立体液德邮
              客户提供专业而高效的服务，高新优先地域保险的坚果！
            </p>
          </div>
        </div>

        <!-- 产品介绍内容 -->
        <div class="tab-content" v-show="activeTab === 'products'">
          <div class="products-introduction">
            <!-- 产品展示 -->
            <div class="product-showcase">
              <h3 class="showcase-title">
                <span class="title-text">产品展示</span>
              </h3>
              <div class="product-list">
                <div
                  class="product-item"
                  v-for="product in miniBreakers"
                  :key="product.id"
                >
                  <div class="product-image">
                    <img :src="product.image" :alt="product.name" />
                  </div>
                  <div class="product-info">
                    <h4 class="product-name">{{ product.name }}</h4>
                    <div class="product-specs">
                      <div v-for="spec in product.specs" :key="spec" class="spec-item">
                        {{ spec }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 地址和联系方式内容 -->
        <div class="tab-content" v-show="activeTab === 'contact'">
          <div class="contact-info">
            <div class="contact-item">
              <strong>公司地址：</strong>
              <span>浙江省温州市乐清市柳市镇东仁宕工业区</span>
            </div>
            <div class="contact-item">
              <strong>联系电话：</strong>
              <span>0577-62766888</span>
            </div>
            <div class="contact-item">
              <strong>传真：</strong>
              <span>0577-62766999</span>
            </div>
            <div class="contact-item">
              <strong>邮箱：</strong>
              <span>info@hangshendq.com</span>
            </div>
            <div class="contact-item">
              <strong>网址：</strong>
              <span>www.hangshendq.com</span>
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
              v-model="messageForm.phone"
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
            <el-select v-model="messageForm.company" class="form-select">
              <el-option value="杭申电器" label="杭申电器"></el-option>
              <el-option value="其他公司" label="其他公司"></el-option>
            </el-select>
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
        phone: "",
        email: "",
        company: "",
        content: "",
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
    };
  },
  computed: {
    nav_option() {
      return [
        {
          route: "/system-manufacturer-list",
          title: "系统厂商",
        },
        {
          route: this.$route.path,
          title: "厂商详情",
        },
      ];
    },
  },
  mounted() {
    // 页面初始化逻辑
  },
  methods: {
    handleFollow() {
      // 关注逻辑
      console.log("关注");
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
        phone: "",
        email: "",
        company: "",
        content: "",
      };
    },
    submitMessage() {
      // 表单验证
      if (!this.messageForm.name.trim()) {
        alert("请输入姓名");
        return;
      }
      if (!this.messageForm.phone.trim()) {
        alert("请输入手机号");
        return;
      }
      if (!this.messageForm.content.trim()) {
        alert("请输入留言内容");
        return;
      }

      // 提交留言逻辑
      console.log("提交留言:", this.messageForm);
      alert("留言提交成功！");
      this.closeModal();
    },
  },
};
</script>

<style lang="less" src="./manufacturer-detail.less"></style>
