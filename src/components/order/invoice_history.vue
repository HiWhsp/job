<script>
export default {
  data() {
    return {
      invoiceList: [],
      chosenInvoice: {},
      chosenInvoiceId: "",
      show: false,
      pagination: {
        page: 1,
        pageNum: 5,
      },
      count: "",
    };
  },
  methods: {
    init(info) {
      this.show = true;
      let invoice = localStorage.getItem("invoice_history") || [];
      if (invoice.length) {
        this.invoiceList = JSON.parse(invoice);
      }
    },
    initQuery() {
      this.pagination.page = 1;
      this.setView();
    },
    setView() {
      this.getInvoice();
      this.chosenInvoice = {};
      this.chosenInvoiceId = "";
    },
    getInvoice() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_getFapiaoList",
          ...this.pagination,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.invoiceList = res.data.list;
          this.invoiceList.forEach((v) => (v.confirmDel = 0));
          this.count = res.data.count;
        }
      });
    },
    removeInvoice(item) {
      if (item.confirmDel == 1) {
        this.$api({
          url: "/service.php",
          method: "post",
          data: {
            action: "orders_deleteFapiao",
            fapiaoId: item.id,
          },
        }).then((res) => {
          if (res.code == 200) {
            this.invoiceList = res.data.list;
            this.count = res.data.count;
          }
        });
      } else {
        item.confirmDel = 1;
      }
    },
    confirmInvoice() {
      if (this.chosenInvoice.title) {
        let invoice = this.chosenInvoice;
        let {
          invoiceType,
          titleType,
          title,
          shibiema,
          email,
          companyAddress,
          companyPhone,
          bankName,
          bankNo,
        } = invoice;
        this.$emit("confirm", invoice);
        this.show = false;
      }
    },
    chooseInvoice(item, index) {
      this.chosenInvoice = item;
      this.chosenInvoiceId = index;
      // this.confirmInvoice();
    },
    onModalClose() {
      this.show = false;
    },
  },
};
</script>

<template>
  <div class="modal-container">
    <el-dialog
      title="选择历史发票"
      width="768px"
      custom-class="modal-custom"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx">
          <div
            class="store-detail"
            :class="chosenInvoiceId == index ? 'active' : ''"
            v-for="(item, index) in invoiceList"
            @click="chooseInvoice(item, index)"
            :key="index"
          >
            <h5 class="invoice-title">{{ item.title }}</h5>
            <div class="store-detail-content">
              <div>发票类型：</div>
              <div>
                <span>{{ item.invoicType == 1 ? "普通发票" : "专用发票" }}</span
                ><span v-if="item.invoicType == 1"
                  >-{{ item.titleType == 1 ? "个人" : "单位" }}</span
                >
              </div>
            </div>
            <div class="store-detail-content">
              <div>纳税人识别号：</div>
              <div>{{ item.shibiema }}</div>
            </div>
            <!-- <el-button class="btn btn-ripple fit-text btn-2 btn-bg"
                       @click="removeInvoice()">{{item.confirmDel == 1? '确认删除' : '删除'}}</el-button> -->
          </div>
          <div class="pagination-box" v-if="count" style="margin-top: 50px">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="count"
              :current-page="pagination.page"
              :page-size="pagination.pageNum"
              @current-change="mix_current_change"
            >
            </el-pagination>
          </div>
          <div style="font-size: 16px" v-if="invoiceList.length === 0">
            暂无发票历史记录
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          class="btn btn-ripple fit-text btn-2 btn-bg"
          @click="confirmInvoice()"
          >确定</el-button
        >
        <button class="btn btn-ripple fit-text btn-1" @click="show = false">
          取消
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
/deep/ .modal-custom {
  .modal-inner {
    padding: 0;
  }

  .el-dialog__body {
    padding: 20px 50px;
  }
  .modal-ctx {
    .store-detail {
      border: 1px solid #7d7d7d;
      padding: 16px 24px;
      margin: 10px 0;
      cursor: pointer;
      &:hover {
        border: 1px solid #f74747;
      }
      &.active {
        background-color: #fcefef;
      }
    }
    .invoice-title {
      text-align: left;
      font-size: 20px;
    }
    .store-detail-content {
      display: grid;
      grid-template-columns: 1fr 4fr;
      margin-top: 16px;
      font-size: 16px;
      div:first-child {
        text-align: right;
      }
      &:first-child {
        margin-top: 0;
      }
    }
    .store-product-info {
      margin-top: 16px;
      font-size: 16px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}

/deep/ .el-dialog__header {
  text-align: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  background: #f7f7f7;

  font-family: Poppins, Poppins;
  font-weight: 600;
  font-size: 18px;
  color: #333333;

  .el-dialog__close {
    font-size: 20px;
  }
}

/deep/ .el-dialog__body {
  padding: 70px 60px;
}

/deep/ .el-dialog__footer {
  text-align: center;
  padding-bottom: 50px;

  button {
    min-width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 50px 50px 50px 50px;
    border: 1px solid #f74747;
    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #f74747;

    & + button {
      margin-left: 20px;
    }
  }

  .btn-bg {
    background: #f74747;
    color: #ffffff;
  }
}

.btn-send {
  // position: absolute;
  // right: -50px;
  // top: 10px;
  min-width: 90px;
  padding: 0 10px;
  height: 40px;
  background: #fff;
  color: #f74747;
  font-size: 14px;
  margin-left: 15px;
  border-radius: 5px;

  &:disabled {
    background: #eee;
    color: #999;
    cursor: not-allowed;
  }
}
</style>
