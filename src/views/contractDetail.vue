<template>
  <div class="page-index">
    <div class="main-content w-1600">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">首页</router-link>
        <i class="el-icon-arrow-right breadcrumb-separator"></i>
        <router-link to="/contractList" class="breadcrumb-item"
          >文档中心</router-link
        >
        <i class="el-icon-arrow-right breadcrumb-separator"></i>
        <span class="breadcrumb-item current">{{ detail.title }}</span>
      </div>
      <!-- 合同内容区域 -->
      <div class="contract-content-section">
        <!-- 左侧文档预览区域 -->
        <div class="document-preview">
          <div class="document-preview-header">
            <div class="header-left">
              <h1 class="document-title">{{ detail.title || "文档标题" }}</h1>
              <div class="document-meta">
                <span class="file-size">{{
                  formatFileSize(detail.fileSize) || "15.22KB"
                }}</span>
                <span class="upload-date">{{
                  formatDate(detail.created_at) || "2025-11-20上传"
                }}</span>
              </div>
            </div>
            <div class="header-right">
              <span class="free-download-link" v-if="detail.ifFree == 1"
                >免费下载</span
              ><span class="free-download-link" v-else
                >￥{{ detail.price }}</span
              >
              <button class="download-btn" @click="handleDownload">
                <i class="el-icon-download"></i>
                立即下载
              </button>
            </div>
          </div>
          <div class="document-container">
            <div class="document-page">
              <img :src="detail.thumb" alt="" srcset="" />
            </div>
          </div>
          <!-- <div class="document-page-bottom-bottom">
            <div class="item">
              <router-link to="/contractDetail" class="item-link"
                >上一条：仁寿县关于进一步支持科技创新的若干政策</router-link
              >
            </div>
            <div class="item">
              <router-link to="/contractDetail" class="item-link"
                >下一条：仁寿县关于进一步支持科技创新的若干政策</router-link
              >
            </div>
          </div> -->
        </div>

        <div class="download-info-section">
          <!-- 右侧下载信息区域 -->
          <div
            class="download-info"
            :class="{ 'download-info-absolute': isDownloadInfoAbsolute }"
            ref="downloadInfo"
          >
            <!-- 相关文档 -->
            <div class="related-documents">
              <h3 class="related-documents-title">相关文档</h3>
              <div class="related-documents-list">
                <div
                  class="related-document-item"
                  v-for="(doc, index) in relatedDocuments"
                  :key="doc.id || index"
                  @click="handleRelatedDocClick(doc)"
                >
                  <div class="document-item-title ellipsis-1">
                    {{ doc.title }}
                  </div>
                  <div class="document-item-meta">
                    <span class="file-size">{{
                      formatFileSize(doc.fileSize) || "15.22KB"
                    }}</span>
                    <span class="upload-date">{{
                      formatDate(doc.created_at) || "2025-11-20上传"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      relatedDocuments: [],
      isDownloadInfoAbsolute: false,
      lastScrollTime: 0,
      contract_type: "",
      pdfLoading: false,
      pdfError: false,
      pdfDoc: null,
      pdfPages: [],
    };
  },
  watch: {
    $route: {
      handler(newVal) {
        this.setView();
      },
      immediate: true,
    },
  },
  mounted() {
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
        url: "pcGetDocument",
        method: "get",
        data: {
          id: this.$route.query.id,
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
          url: "pcDocumentList",
          method: "get",
          data: {
            typeId: this.detail.typeId,
            page: 1,
            limit: 6,
          },
        }).then((res) => {
          // 获取相关文档（排除当前文档）
          this.relatedDocuments = res.data.list.filter(
            (item) => item.id !== this.detail.id
          );
        });
      });
    },
    showDownloadModal() {
      if (this.detail.ifFree == 1) {
        this.$api({
          url: "pcFileDownload",
          method: "get",
          data: {
            documentId: this.detail.id,
          },
        }).then((res) => {
          if (res.code == 200) {
            window.open(this.detail.url, "_blank");
          }else{
            this.$message.error(res.msg);
          }
        });
        // fetch(this.detail.url)
        //   .then((res) => res.blob())
        //   .then((blob) => {
        //     const link = document.createElement("a");
        //     const objectUrl = URL.createObjectURL(blob);
        //     link.href = objectUrl;
        //     link.download = res.data.doc_name; // 指定保存的文件名
        //     link.click();
        //     URL.revokeObjectURL(objectUrl);
        //   })
        //   .catch((err) => console.error("下载失败:", err));
        return;
      }
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
    // 立即下载
    handleDownload() {
      this.showDownloadModal();
    },
    // 格式化文件大小
    formatFileSize(bytes) {
      if (!bytes) return "";
      if (bytes < 1024) return bytes + "B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + "KB";
      return (bytes / (1024 * 1024)).toFixed(2) + "MB";
    },
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}上传`;
    },
    // 点击相关文档
    handleRelatedDocClick(doc) {
      this.$router.push(`/contractDetail?id=${doc.id}`);
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
<style src="./style/h5-contractDetail.less" scoped lang="less"></style>
