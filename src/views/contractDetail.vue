<template>
  <div class="page-index">
    <div class="main-content w-1600">
      <!-- 业务公告 -->
      <div class="announcement-section">
        <div class="announcement-banner">
          <div class="banner-content">
            <div class="announcement-text red-text">
              购买并下载本站合同范本，即可享受律师合同审核、签约指导及终生法律咨询服务，下载后添加律师微信（{{
                vuex_config.bottom_lawer_contact
              }}）即可获取上述服务；
            </div>
            <div class="announcement-text">
              提供<span>免费法律咨询服务</span>，专业团队为您答疑解惑，助您明确法律问题解决方案；
            </div>
            <div class="announcement-text">
              提供<span>免费律师中介服务</span>，为您推荐、匹配适合案件的资深专业律师。
            </div>
          </div>
        </div>

        <!-- 最新动态 -->
        <div class="latest-updates">
          <div class="updates-title">最新动态</div>
          <div class="updates-list">
            <div
              class="update-item"
              v-for="(update, index) in latestUpdates"
              :key="index"
            >
              <span class="update-content"
                >{{ update.come == 1 ? "最新上传" : "最近下载" }} |
                {{ update.title }}</span
              >
              <span class="update-date">{{ update.created_at }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 面包屑导航 -->
      <div class="breadcrumb-section">
        <div class="breadcrumb">
          <span class="breadcrumb-item">首页</span>
          <!-- <span class="breadcrumb-separator">></span> -->
          <!-- <span class="breadcrumb-item">房屋租赁</span> -->
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-item active">{{ detail.title }}</span>
        </div>
      </div>

      <!-- 合同内容区域 -->
      <div class="contract-content-section">
        <!-- 左侧文档预览区域 -->
        <div class="document-preview">
          <div class="document-container">
            <div class="document-page">
              <div class="document-content blurred">
                <iframe
                  :src="detail.preview_pdf_url"
                  width="100%"
                  height="100%"
                  v-if="detail.preview_pdf_url && detail.preview_pdf_url.includes('.pdf')"
                  alt=""
                ></iframe>
                <img :src="detail.preview_pdf_url" v-else alt="" />
              </div>
            </div>
            <div class="document-page-bottom">
              <div class="document-page-bottom-left">
                <p class="document-page-bottom-text">
                  预览结束，下载后可获得完整文档
                </p>
                <button class="download-btn" @click="showDownloadModal">
                  <span>下载Word版本</span>
                </button>
                <button class="collect-btn">
                  <img src="@/assets/img/common/kefu.png" alt="" />
                  <span>联系客服电话：18696628883 (微信同号)</span>
                </button>
              </div>
              <div class="document-page-bottom-right">
                <div class="item">
                  <img src="@/assets/img/common/look.png" alt="" />
                  <span>{{ detail.view_num || 0 }}</span>
                </div>
                <div class="item">
                  <img src="@/assets/img/common/collect.png" alt="" />
                  <span>{{ detail.collect_num || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="document-page-bottom-bottom">
            <h3>相关搜索</h3>
            <div class="document-page-bottom-border-content">
              <div class="item" v-for="item in detail.about_list" :key="item">{{ item}}</div>
            </div>
          </div>
        </div>

        <!-- 右侧下载信息区域 -->
        <div class="download-info">
          <!-- 下载须知 -->
          <div class="download-notice">
            <h3 class="notice-title">下载须知</h3>
            <div class="notice-content">
              <p>
                1.
                购买本站合同范本，即可享受律师合同审核、签约指导及终生法律咨询服务，下载后添加律师微信（{{
                  vuex_config.bottom_lawer_contact
                }}）即可获取上述服务；
              </p>
              <p>2. 本产品为电子文档，无实体发货，无快递配送；</p>
              <p>
                3.
                由于电子产品的可复制性，下载后不支持退换货，请确认需求后再购买；
              </p>
              <p>
                4. 如有疑问，请先咨询律师微信（{{
                  vuex_config.bottom_lawer_contact
                }}）后再下单，或直接向律师购买合同范本。
              </p>
            </div>
          </div>

          <!-- 文档详情 -->
          <div class="document-details">
            <div class="detail-list">
              <div class="detail-item">
                <span class="detail-label">软件：</span>
                <span class="detail-value">Word</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">格式：</span>
                <span class="detail-value">docx</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">大小：</span>
                <span class="detail-value">{{ detail.size || 0 }}MB</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">页数：</span>
                <span class="detail-value">共{{ detail.total_page }}页</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">版权范围：</span>
                <span class="detail-value">个人/企业</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <button class="download-btn" @click="showDownloadModal">
                <img src="@/assets/img/common/down.png" alt="" />
                <span>下载Word版本</span>
              </button>
              <button class="collect-btn" @click="handleCollect">
                <img
                  src="@/assets/img/common/collect.png"
                  alt=""
                  v-if="detail.is_collect == 0"
                />
                <img src="@/assets/img/common/my-collect.png" alt="" v-else />
                <span>{{ detail.is_collect == 0 ? "收藏" : "已收藏" }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="contract-section">
        <div class="section-title">
          <div
            class="section-title-text"
            :style="{
              backgroundImage: `url(${require('@img/index/icon2.png')})`,
            }"
          >
            相关合同文书
          </div>
        </div>
        <div class="contract-grid">
          <ContractCard
            v-for="contract in contracts"
            :key="contract.id"
            :contract="contract"
          />
          <el-empty
            style="width: 100%; height: 100%"
            description="暂无数据"
            v-if="contracts.length === 0"
          />
        </div>
      </div>
    </div>

    <!-- 下载弹框 -->
    <DownloadModal :visible.sync="downloadModalVisible" v-if="downloadModalVisible" :detail="detail" />
  </div>
</template>

<script>
import ContractCard from "@/components/ContractCard.vue";
import DownloadModal from "@/components/DownloadModal.vue";
export default {
  name: "contractDetail",
  components: {
    ContractCard,
    DownloadModal,
  },
  data() {
    return {
      downloadModalVisible: false,
      latestUpdates: [],
      contracts: [],
      detail: {},
    };
  },
  mounted() {
    this.$api({
      url: "index",
      method: "get",
      data: {
        keyword: this.searchKeyword,
      },
    }).then((res) => {
      this.latestUpdates = res.data.recent;
    });
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: "contractPreview",
        method: "post",
        data: {
          articleId: this.$route.query.id,
        },
      }).then((res) => {
        this.detail = res.data;
        this.$api({
          url: "contractList",
          method: "get",
          data: {
            category_id: this.detail.category_id,
          },
        }).then((res) => {
          this.contracts = res.data.list.slice(0, 5);
        });
      });
    },
    showDownloadModal() {
      if(this.detail.is_bought == 0) {
        this.downloadModalVisible = true;
      }else {
        this.$api({
          url: "contractReal",
          method: "post",
          data: {
            articleId: this.$route.query.id,
          },
        }).then((res) => {
          if(res.code == 200) {
            window.open(res.data.doc_url, "_blank");
          }
        })
      }
    },
    handleCollect() {
      const status = this.detail.is_collect == 0 ? 1 : 0;
      this.$api({
        url: "addCollect",
        method: "get",
        data: {
          status,
          articleId: this.detail.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.detail.is_collect = status;
          this.$message.success(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./contractDetail.less";
</style>
