<script>
export default {
  name: "index",
  data() {
    return {
      orderDetail: {},
      fileList: [],
      fileList2: [],
      feedback: '',
      updateResultVisible: false,
      dissentDialogVisible: false,
      tabIndex: '',
      queryParams: {}, // 查询参数
      list_order: [], // 订单
      tabList: [
        {value: '', title: "全部订单"},
        {value: 10, title: "待支付"},
        {value: 20, title: "待实验"},
        {value: 30, title: "实验中"},
        {value: 60, title: "已取消"},
        {value: 40, title: "已完成"},
        {value: 50, title: "售后"},
      ],
      testList: [], // 实验人员
      payList: [], // 支付方式
      date: [],
      isRePay: [
        {
          value: 1,
          label: '未还款'
        }, {
          value: 2,
          label: '已还款'
        }
      ], // 是否还款
      isInvoice: [
        {
          value: 1,
          label: '待开'
        }, {
          value: 2,
          label: '已开'
        }
      ], // 是否已开票
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  mounted() {
    this.handleQuery()
  },
  computed: {
    orderStatus() {
      return (status) => {
        switch (status) {
          case 10:
            return '待支付'
          case 20:
            return '待实验'
          case 30:
            return '实验中'
          case 40:
            return '已完成'
          case 50:
            return '售后'
          case 60:
            return '已取消'
        }
      }
    }
  },
  methods: {
    search() {
      this.pagination.page = 1;
      this.handleQuery()
    },
    handleQuery() {
      if (this.date && this.date.length) {
        this.queryParams.start_time = this.date[0]
        this.queryParams.end_time = this.date[1]
      } else {
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
      }
      this.$api({
        url: 'user_order_list',
        method: 'post',
        data: {
          ...this.pagination,
          ...this.queryParams
        }
      }).then(res => {
        if (res.code === 200) {
          this.list_order = res.data
          this.count = res.count;
        }
      })
    },
    resetQuery() {
      this.queryParams = {}
      this.date = [];
    },
    goUrl(url) {
      this.$router.push(url);
    },
    // 切换tab
    tabClick(item) {
      this.tabIndex = item.value
      this.queryParams.status = item.value;
      this.handleQuery();
    },
    toPay(item) {
      this.$api({
        url: 'order_detail',
        method: 'post',
        data: {
          orderno: item.orderno
        }
      }).then(res => {
        if (res.code === 200) {
          const params = {
            ...res.data,
            title: res.data.product_info.title,
            form: []
          }
          res.data.orderdetail.forEach((item, index) => {
            if (item.content.length) {
              // 将id作为key value作为值 存储到数组中 {id: 1252, value: "1", title: "样本数量", price: 0}
              item.content.forEach((subItem, subIndex) => {
                if (params.form[index]) {
                  params.form[index][subItem.id] = subItem.value
                } else {
                  params.form[index] = {
                    [subItem.id]: subItem.value,
                  }
                }
              })
            }
          })
          localStorage.setItem('preOrderDetail', JSON.stringify(params));
          this.$router.push('/appointment-pay');
        }
      })
    },
    // 取消订单
    resetPay(item) {
      this.$alert('确定要取消当前订单', '取消订单', {
        confirmButtonText: '确定',
        callback: action => {
          if (action) {
            this.$api({
              url: 'order_cancel',
              method: 'post',
              data: {
                orderno: item.orderno
              }
            })
            this.search();
          }
        }
      });
    },
    // 下载预约单
    downLoad(item) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const orderno = item.orderno;
      const url = `https://jxjsjc.dx.hdapp.com.cn/api/download_order?userId=${userId}&token=${token}&orderno=${orderno}`
      window.open(url, "_blank")
    },

    // 查看报告
    lockRealInfo(row) {
      this.orderDetail = row;
      this.$api({
        url: 'order_reports',
        method: 'post',
        data: {
          orderno: row.orderno
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.fileList = [{
              name: res.data[0].title,
              url: res.data[0].path
            }];
            this.fileList2 = [{
              name: res.data[1].title,
              url: res.data[1].path
            }];
          }
        }
        this.updateResultVisible = true;
      })
    },
    // 下载报告
    downReport(path) {
      // 地址域名 + path
      window.open(location.origin + path, '_blank');
    },
    // 异议
    dissentDialog(row) {
      this.orderDetail = row;
      this.dissentDialogVisible = true
    },
    // 异议
    dissentDialogSubmit() {
      if (!this.feedback) {
        this.$message.error('请输入异议内容');
        return
      }
      this.$api({
        url: 'order_objection',
        method: 'post',
        data: {
          orderno: this.orderDetail.orderno,
          title: '异议',
          content: this.feedback
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.dissentDialogVisible = false;
          this.feedback = ""
        }
      })
    },
  }
}
</script>

<template>
  <div class="content">
    <div class="section-order">
      <div class="section-title">
        <div class="label">
          <div class="label-item pointer" :class="{'active': tabIndex === item.value}"
               v-for="(item, index) in tabList"
               :key="index" @click="tabClick(item)">
            {{ item.title }}<span>{{ item.num }}</span>
          </div>
        </div>
        <div class="search flex">
          <el-input placeholder="请输入仪器名/订单号" v-model="queryParams.keyword"></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
          <el-form-item label="订单编号" prop="keyword">
            <el-input
                v-model="queryParams.keyword"
                placeholder="订单编号"
                clearable
            />
          </el-form-item>
          <el-form-item label="实付款区间" prop="orderSnLt">
            <div class="flex interval">
              <el-input
                  v-model="queryParams.price1"
                  placeholder="请输入"
                  clearable
              />
              <span>-</span>
              <el-input
                  v-model="queryParams.price2"
                  placeholder="请输入"
                  clearable
              />
            </div>
          </el-form-item>
          <el-form-item label="实验人" prop="shiyanren">
            <el-select v-model="queryParams.shiyanren" placeholder="请选择" clearable>
              <el-option
                  v-for="item in testList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式" prop="phone">
            <el-select v-model="queryParams.pay_type" placeholder="请选择" clearable>
              <el-option
                  v-for="item in payList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否还款" prop="goodsName">
            <el-select v-model="queryParams.if_hk" placeholder="请选择" clearable>
              <el-option
                  v-for="item in isRePay"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否已开票" prop="goodsName">
            <el-select v-model="queryParams.if_fapiao" placeholder="请选择" clearable>
              <el-option
                  v-for="item in isInvoice"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间" prop="goodsName">
            <el-date-picker
                v-model="date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="search">搜索</el-button>
            <el-button type="primary" size="mini" @click="resetQuery">导出订单</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table">
        <div class="item">
          <span>项目名称</span>
        </div>
        <div class="item">
          <span>实付款</span>
        </div>
        <div class="item">
          <span>订单状态</span>
        </div>
        <div class="item">
          <span>发票状态</span>
        </div>
        <div class="item">
          <span>操作</span>
        </div>
      </div>

      <div class="order-box">
        <div class="empty-info" v-if="!list_order.length">
          <div class="empty-img">
            <img src="@/assets/img/my/empty-img.png" alt=""/>
          </div>
          <div class="empty-text">您还没有订单</div>
        </div>
        <div class="order-info" v-else>
          <div class="info-item" v-for="(item, index) in list_order" :key="index">
            <div class="info-title">
              <div class="date">
                下单时间：
                {{ item.created_at }}
              </div>
              <div class="order-code">
                订单号：
                <span>{{ item.orderno }}</span>
              </div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <!--                  <div class="item-good flex" v-for="(product_item, product_index) in item.products" :key="product_index">-->
                <div class="item-good flex">
                  <div class="box-image cover" @click="goUrl('/orderDetail?orderno=' + item.orderno)">
                    <el-image :src="item.cover" :preview-src-list="[item.cover]">
                      <div slot="error" class="image-slot">
                        <img src="@/assets/img/my/order-img.png"/>
                      </div>
                    </el-image>
                  </div>

                  <div class="box-title">
                    <div class="goods-title" @click="goUrl('/orderDetail?orderno=' + item.orderno)">{{ item.title }}</div>
                    <div class="goods-sku">型号：{{ item.models || '无' }}</div>
                  </div>
                  <div class="box-price">{{ vuex_huobi }} {{ item.price }}</div>
                  <div class="order-state" :class="'state-' + item.status">
                    {{ orderStatus(item.status) }}
                  </div>
                  <div class="order-state">
                    {{ item.kaipiao }}
                  </div>
                  <div class="btn-actions">
                    <template v-if="item.status == 10">
                      <button class="btn-ripple fit-text" @click="goUrl('/orderDetail?orderno=' + item.orderno)">
                        查看订单
                      </button>
                      <button class="btn-ripple fit-text btn-bg" @click="toPay(item)">
                        立即支付
                      </button>
                      <button class="btn-ripple fit-text" @click="resetPay(item)">
                        取消订单
                      </button>
                    </template>

                    <template v-if="item.status == 20">
                      <button class="btn-ripple fit-text" @click="goUrl('/orderDetail?orderno=' + item.orderno)">
                        查看订单
                      </button>
                    </template>

                    <template v-if="item.status == 30">
                      <button class="btn-ripple fit-text" v-if="item.kaipiao == '待开票'" @click="goUrl('/invoice')">
                        申请开票
                      </button>
                      <button class="btn-ripple fit-text btn-bg" @click="downLoad(item)">
                        下载预约单
                      </button>
                      <button class="btn-ripple fit-text" @click="goUrl('/orderDetail?orderno=' + item.orderno)">
                        查看订单
                      </button>
                    </template>

                    <template v-if="item.status == 40">
                      <button class="btn-ripple fit-text" v-if="item.kaipiao == '待开票'" @click="goUrl('/invoice')">
                        申请开票
                      </button>
                      <button class="btn-ripple fit-text btn-bg" @click="lockRealInfo(item)">
                        下载报告
                      </button>
                      <button class="btn-ripple fit-text" @click="goUrl('/afterSales?orderno=' + item.orderno)">
                        售后服务
                      </button>
                      <button class="btn-ripple fit-text" @click="dissentDialog(item)">
                        提交异议
                      </button>
                    </template>

                    <template v-if="item.status == 60">
                      <button class="btn-ripple fit-text" @click="goUrl('/orderDetail?orderno=' + item.orderno)">
                        查看订单
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-box" v-if="count">
          <el-pagination
              background
              layout="total, prev, pager, next"
              :total="count"
              :current-page.sync="pagination.page"
              :page-size.sync="pagination.limit"
              @current-change="handleQuery"
          >
          </el-pagination>
        </div>
      </div>
      <!--    上传报告-->
      <el-dialog :visible.sync="updateResultVisible" center title="下载报告">
        <div class="updateResult">
          <div class="title">
            <p>订单号：{{ orderDetail.orderno || '-' }}</p>
            <p>项目名称：{{ orderDetail.title || '-' }}</p>
          </div>
          <div class="upload-tit">报告</div>
          <p style="margin-bottom: 10px">{{ fileList[0] ? fileList[0].name : '' }}<span class="down"
                                                                                        @click="downReport(fileList[0].url)">下载</span></p>
          <div class="upload-tit">测试结果</div>
          <p>{{ fileList2[0] ? fileList2[0].name : '' }} <span class="down" @click="downReport(fileList2[0].url)">下载</span></p>
        </div>
      </el-dialog>

      <el-dialog title="提交异议" :visible.sync="dissentDialogVisible">
        <el-input v-model="feedback" placeholder="请输入异议内容" rows="5" type="textarea"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dissentDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dissentDialogSubmit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="less">
.content {
  background: #fff;
  padding-bottom: 50px;
}

.section-order {
  width: 100%;

  .section-title {
    padding: 0 10px;
    border-bottom: 1px solid #dedede;
    .flex-between();
    height: 56px;
    padding-right: 32px;

    .label {
      font-size: 18px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
      display: flex;

      .label-item {
        position: relative;
        padding: 0 18px;
        margin-right: 18px;
        font-size: 16px;
        color: #333333;

        span {
          margin-left: 5px;
          color: #3399FF;
        }

        &.active {
          &:after {
            content: '';
            display: inline-block;
            width: 100%;
            height: 2px;
            background: #3399FF;
            position: absolute;
            bottom: -17px;
            left: 0;
          }
        }
      }
    }

    .search {
      width: 250px;

      .el-input {
        border: 1px solid #00479D;
      }

      /deep/ .el-input__inner {
        border-radius: 0;
        border: none;
      }

      .el-button--primary {
        height: 42px;
        background: #00479D;
        color: #fff;
        border-radius: 0;
        border: none;
      }
    }
  }

  .search-filter {
    padding: 25px 10px 0;

    .el-button {
      border: 1px solid #00479D;
      color: #00479D;
    }

    .el-button--primary {
      background-color: #00479D;
      color: #fff;
    }

    .interval {
      .el-input {
        width: 90px;
      }

      span {
        margin: 0 10px;
      }
    }
  }

  .table {
    margin: 0 24px;
    height: 57px;
    background: #F5F5F5;
    border: 1px solid #D9D9D9;
    padding: 0 20px;
    display: flex;

    .item {
      text-align: center;
      line-height: 57px;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      min-width: 150px;

      &:first-child {
        text-align: left;
        flex: 1;
      }
    }
  }

  .order-box {
    .empty-info {
      text-align: center;
      padding: 40px 0;

      // border-top: 1px solid #dedede;
      .empty-img {
        text-align: center;

        img {
          width: 190px;
        }
      }

      .empty-text {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .order-info {
    padding: 24px;

    .info-item {
      border: 1px solid #DFEEFF;
      margin-bottom: 30px;
    }

    .info-title {
      .flex-between();
      height: 48px;
      padding: 0 15px;
      background: #DFEEFF;

      .date {
        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;
      }

      .order-code {
        flex: 2;
        text-align: left;
        padding-left: 20px;

        font-size: 14px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        font-weight: bold;
        color: #333333;

        span {
          color: #333333;
        }
      }
    }

    .info-good {
      .list-good {
        .item-good {
          padding: 20px;
          border-bottom: 1px solid #e5e5e5;

          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #333333;

          &:last-child {
            border: none;
          }

          .box-image {
            width: 100px;
            height: 100px;
            cursor: pointer;
            border: 1px solid #F5F5F5;


            /deep/ img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }

            img {
              width: 100px;
              height: 100px;
              object-fit: contain;
              object-fit: cover;
            }
          }

          .box-title {
            flex: 1;
            text-align: left;
            padding-left: 40px;


            .goods-title {
              width: fit-content;
              cursor: pointer;

              &:hover {
                color: @theme;
              }
            }
          }

          .box-sku {
            text-align: center;
            min-width: 200px;
          }

          .box-num {
            text-align: center;
            min-width: 200px;
          }

          .box-price {
            min-width: 150px;
            text-align: center;
            font-family: OPPOSans, OPPOSans;
            font-weight: bold;
            font-size: 14px;
            color: #333;
          }

          .order-state {
            padding: 3px 6px;
            min-width: 150px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 20px;
            text-align: center;

            // 待付款
            &.state--5 {
              //background: #ff4c29;
              //border-color: #ff4c29;
              color: #EA3200;
            }

            &.state-2 {
              color: @theme;
              border-color: @theme;
            }
          }

          .btn-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 150px;


            button {
              transition: 0.3s;
              min-width: 120px;
              height: 29px;
              background: #FFFFFF;
              border-radius: 4px;
              font-family: Arial, Arial;
              font-weight: 400;
              font-size: 14px;
              color: #333333;
              margin-bottom: 10px;


              &:hover {
                opacity: 0.7;
              }

              &.btn-bg {
                background: @theme;
                color: #FFFFFF;
              }
            }
          }
        }
      }
    }
  }
}
.updateResult {
  padding: 0 250px 0 70px;

  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .upload-demo {
    margin-bottom: 20px;
  }

  .upload-tit {
    font-weight: 400;
    font-size: 14px;
    color: #00479D;
  }
  .down {
    margin-left: 10px;
    color: #00479D;
    cursor: pointer;
  }
}

</style>
