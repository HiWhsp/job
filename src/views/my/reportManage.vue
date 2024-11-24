<script>
export default {
  name: "index",
  data() {
    return {
      downloadVisible: false,
      tabIndex: 1,
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      testList: [], // 实验人员
      payList: [], // 支付方式
      isRePay: [], // 是否还款
      isInvoice: [], // 是否已开票
      realRules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    goUrl(url) {
      this.$router.push(url);
    },
    // 切换tab
    tabClick(item) {
      this.tabIndex = item.value
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="section-order">
      <div class="section-title">
        <div class="label">
          <div class="label-item pointer">
            报告管理
          </div>
        </div>
        <div class="search">
          <el-input placeholder="请输入仪器名/订单号">
            <template slot="append">搜索</template>
          </el-input>
        </div>
      </div>

      <div class="table">
        <div class="item">
          <span>项目名称</span>
        </div>
        <div class="item">
          <span>实付款</span>
        </div>
        <div class="item">
          <span>报告时间</span>
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
                {{ item.createdTime }}
              </div>
              <div class="order-code">
                订单号：
                <span>{{ item.orderNo }}</span>
              </div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <!--                  <div class="item-good flex" v-for="(product_item, product_index) in item.products" :key="product_index">-->
                <div class="item-good flex">
                  <div class="box-image cover">
                    <el-image src="@/assets/img/my/order-img.png">
                      <div slot="error" class="image-slot">
                        <img src="@/assets/img/my/order-img.png"/>
                      </div>
                    </el-image>
                  </div>

                  <div class="box-title">
                    <div class="goods-title">{{ '氧氮氢分析仪' }}</div>
                    <div class="goods-sku">型号：{{ 111 }}</div>
                  </div>
                  <div class="box-price">{{ vuex_huobi }} {{ 1 }}</div>
                  <div class="order-state" :class="'state-' + item.orderStatus">
                    {{ '待支付' }}
                  </div>
                  <div class="btn-actions">
                    <button class="btn-ripple fit-text" @click="goUrl('/orderDetail')">
                      查看
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    下载报告-->
    <el-dialog title="下载报告" :visible.sync="downloadVisible" center width="630px">
      <div class="real-content">
        <div class="tip">提示：报告文件只保存180天</div>
        <div class="info">
          <p>订单号：4545121232</p>
          <p>预约仪器：氧氮氢分析仪</p>
          <p>实验结果：2</p>
        </div>
        <div class="report">
          <p>1、报告文件1 <span>下载</span></p>
          <p>2、仪器测试结果 <span>下载</span></p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  background: #fff;
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

      /deep/ .el-input-group__append {
        cursor: pointer;
        background: #00479D;
        color: #fff;
        border-radius: 0;
        border: none;
      }
    }
  }

  .table {
    margin: 32px 24px 0;
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
</style>