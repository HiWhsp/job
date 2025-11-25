<template>
  <div class="page-index">
    <div class="main-content w-1600">
      <!-- 业务公告 -->
      <!-- <div class="announcement-section">
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
      </div> -->

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
                <!-- PDF所有页面展示 -->
                <div
                  v-if="
                    detail.preview_pdf_url &&
                    detail.preview_pdf_url.includes('.pdf')
                  "
                  class="pdf-all-pages-container"
                  ref="pdfContainer"
                >
                  <div
                    v-for="(page, index) in pdfPages"
                    :key="index"
                    class="pdf-page-wrapper"
                  >
                    <canvas
                      :ref="`pdfCanvas${index}`"
                      class="pdf-page-canvas"
                    ></canvas>
                    <canvas
                      :ref="`watermarkCanvas${index}`"
                      class="watermark-canvas"
                    ></canvas>
                  </div>

                  <!-- 加载状态 -->
                  <div v-if="pdfLoading" class="pdf-loading">
                    <div class="loading-spinner"></div>
                    <p>PDF加载中...</p>
                  </div>

                  <!-- 错误状态 -->
                  <div v-if="pdfError" class="pdf-error">
                    <p>PDF加载失败，请稍后重试</p>
                    <button @click="loadAllPages" class="retry-btn">
                      重试
                    </button>
                  </div>
                </div>

                <!-- 非PDF文件显示 -->
                <img v-else :src="detail.preview_pdf_url" alt="" />
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
              <div class="item" v-for="item in detail.about_list" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <div class="download-info-section">
          <!-- 右侧下载信息区域 -->
          <div
            class="download-info"
            :class="{ 'download-info-absolute': isDownloadInfoAbsolute }"
            ref="downloadInfo"
          >
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
      </div>

      <div class="contract-section">
        <div class="section-title">
          <div
            class="section-title-text"
            :style="{
              backgroundImage: `url(${require('@img/index/icon2.png')})`,
            }"
          >
            相关合同文书推荐
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
    <DownloadModal
      :visible.sync="downloadModalVisible"
      v-if="downloadModalVisible"
      :id="$route.query.id"
      :detail="detail"
    />
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
      isDownloadInfoAbsolute: false,
      lastScrollTime: 0,
      contract_type: "",
      pdfLoading: false,
      pdfError: false,
      pdfDoc: null,
      pdfPages: [],
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
    this.addScrollListener();
    this.addResizeListener();
    this.loadPDFJS();
  },
  beforeDestroy() {
    this.removeScrollListener();
    this.removeResizeListener();
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
        this.contract_type = res.data.contract_type;
        // 当detail数据加载完成后，加载PDF
        this.$nextTick(() => {
          if (window.pdfjsLib && this.detail.preview_pdf_url) {
            this.loadAllPages();
          }
        });
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
      this.$api({
        url: "contractPreview",
        method: "post",
        data: {
          articleId: this.$route.query.id,
        },
      }).then((res) => {
        this.detail = res.data;
        if (this.detail.is_bought == 0) {
          this.downloadModalVisible = true;
        } else {
          this.$api({
            url: "contractReal",
            method: "post",
            data: {
              articleId: this.$route.query.id,
            },
          }).then((res) => {
            if (res.code == 200) {
              this.$api({
                url: "cofirmDownload",
                method: "post",
                data: {
                  articleId: this.detail.id,
                },
              });
              fetch(res.data.doc_url)
                .then((res) => res.blob())
                .then((blob) => {
                  const link = document.createElement("a");
                  const objectUrl = URL.createObjectURL(blob);
                  link.href = objectUrl;
                  link.download = res.data.doc_name; // 指定保存的文件名
                  link.click();
                  URL.revokeObjectURL(objectUrl);
                })
                .catch((err) => console.error("下载失败:", err));
            }
          });
        }
      });
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
    addScrollListener() {
      window.addEventListener("scroll", this.handleScroll);
    },
    removeScrollListener() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    addResizeListener() {
      window.addEventListener("resize", this.handleResize);
    },
    removeResizeListener() {
      window.removeEventListener("resize", this.handleResize);
    },
    handleScroll() {
      const now = Date.now();
      // 节流：每50ms最多执行一次
      if (now - this.lastScrollTime < 50) {
        return;
      }
      this.lastScrollTime = now;

      const contractContentSection = document.querySelector(
        ".contract-content-section"
      );

      if (!contractContentSection) return;

      const sectionRect = contractContentSection.getBoundingClientRect();

      // 修改判断逻辑：当section的底部超出可视区域时改变定位
      // sectionRect.bottom < 0 表示section的底部已经滚动到可视区域上方（即超出了底部）
      const isSectionBottomOutOfView = sectionRect.bottom < 580;

      if (this.isDownloadInfoAbsolute) {
        // 如果已经是absolute定位，当section底部重新进入可视区域时恢复fixed
        this.isDownloadInfoAbsolute = isSectionBottomOutOfView;
      } else {
        // 如果还是fixed定位，当section底部超出可视区域时切换为absolute
        this.isDownloadInfoAbsolute = isSectionBottomOutOfView;
      }
    },

    // 加载PDF.js库
    loadPDFJS() {
      if (window.pdfjsLib) {
        this.initPDF();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        this.initPDF();
      };
      script.onerror = () => {
        console.error("PDF.js加载失败");
        this.pdfError = true;
      };
      document.head.appendChild(script);
    },

    // 初始化PDF
    initPDF() {
      if (this.detail.preview_pdf_url) {
        this.loadAllPages();
      }
    },

    // 加载所有PDF页面
    loadAllPages() {
      if (!this.detail.preview_pdf_url) return;

      this.pdfLoading = true;
      this.pdfError = false;
      this.pdfPages = [];

      const loadingTask = window.pdfjsLib.getDocument({
        url: this.detail.preview_pdf_url,
        cMapUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true,
      });

      loadingTask.promise
        .then((pdf) => {
          this.pdfDoc = pdf;
          this.pdfPages = Array.from({ length: pdf.numPages }, (_, i) => i + 1);

          this.$nextTick(() => {
            this.renderAllPages();
          });

          this.pdfLoading = false;
        })
        .catch((error) => {
          console.error("PDF加载失败:", error);
          this.pdfError = true;
          this.pdfLoading = false;
        });
    },

    // 渲染所有页面
    async renderAllPages() {
      if (!this.pdfDoc) return;

      const container = this.$refs.pdfContainer;
      const containerWidth = container.clientWidth - 40; // 减去padding

      for (let i = 0; i < this.pdfPages.length; i++) {
        try {
          const page = await this.pdfDoc.getPage(i + 1);
          const canvas = this.$refs[`pdfCanvas${i}`][0];
          const context = canvas.getContext("2d");

          // 计算缩放比例以适应容器宽度
          const viewport = page.getViewport({ scale: 1 });
          const scale = containerWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale: scale });

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };

          await page.render(renderContext).promise;
          this.$nextTick(() => {
            this.loadWatermark(scaledViewport.width, scaledViewport.height, i);
          });
        } catch (error) {
          console.error(`渲染第${i + 1}页失败:`, error);
        }
      }
    },
    loadWatermark(width, height, index) {
      const canvas = this.$refs[`watermarkCanvas${index}`][0];
      const ctx = canvas.getContext("2d");
      // 设置 canvas 尺寸
      const canvasWidth = width;
      const canvasHeight = height;

      // 设置 canvas 的实际尺寸，防止变形拉伸
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 水印参数
      const watermarkText =
        this.contract_type == 1 ? "专业合同范本" : "专业法律文书";
      const fontSize = 36;
      const spacing = 240; // 水印间距
      const angle = -45; // 旋转角度
      const opacity = 0.1; // 透明度

      // 清空画布
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 设置字体样式
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 计算水印网格
      const cols = Math.ceil(canvasWidth / spacing) + 2;
      const rows = Math.ceil(canvasHeight / spacing) + 2;

      // 绘制水印
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * spacing;
          const y = i * spacing;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((angle * Math.PI) / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "./contractDetail.less";
</style>
