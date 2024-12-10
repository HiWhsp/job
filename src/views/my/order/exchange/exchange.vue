<script>
export default {
  name: "exchange",
  data() {
    return {
      tabIndex: 0,
      queryParams: {}, // 查询参数
      list_order: [], // 订单
      date: [],
      tabList: [
        {value: 0, title: "全部订单"},
        {value: 2, title: "待发货"},
        {value: 3, title: "已发货"},
        {value: 4, title: "已完成"}
      ],
      isAudit: [
        {value: 0, title: "全部"},
        {value: 2, title: "待发货"},
        {value: 3, title: "已发货"},
        {value: 4, title: "已完成"}
      ], // 审核状态
      pagination: {
        page: 1,
        limit: 5,
      },
      count: 0,
    }
  },
  mounted() {
    this.handleQuery();
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
        url: 'point_order_list',
        method: 'post',
        data: {
          ...this.pagination,
          ...this.queryParams
        }
      }).then(res => {
        if (res.code === 200) {
          this.list_order = res.data;
          this.count = res.count;
        }
      })
    },
    resetQuery() {

    },
    goUrl(url) {
      this.$router.push(url);
    },
    // 切换tab
    tabClick(item) {
      this.tabIndex = item.value
      this.queryParams.status = item.value;
      this.handleQuery();
    }
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
          <el-input placeholder="请输入订单号" v-model="queryParams.keyword"></el-input>
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
          <el-form-item label="下单时间" prop="goodsName">
            <el-date-picker
                v-model="date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态" prop="goodsName">
            <el-select v-model="queryParams.status" placeholder="请选择" clearable>
              <el-option
                  v-for="item in isAudit"
                  :key="item.value"
                  :label="item.title"
                  :value="item.value"
                  value-format="yyyy-MM-dd"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="table">
        <div class="item">
          <span>商品名称</span>
        </div>
        <div class="item">
          <span>实付积分</span>
        </div>
        <div class="item">
          <span>订单状态</span>
        </div>
        <div class="item">
          <span>操作</span>
        </div>
      </div>

      <div class="order-box">
        <div class="empty-info" v-if="!list_order.length">
          <div class="empty-img">
            <img src="../../../../assets/img/my/empty-img.png" alt=""/>
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
                <span>{{ item.order_sn }}</span>
              </div>
            </div>
            <div class="info-good">
              <div class="list-good">
                <!--                  <div class="item-good flex" v-for="(product_item, product_index) in item.products" :key="product_index">-->
                <div class="item-good flex">
                  <div class="box-image cover">
                    <el-image :src="item.orderdetail[0].pdt_info.image">
                      <div slot="error" class="image-slot">
                        <img src="../../../../assets/img/my/order-img.png"/>
                      </div>
                    </el-image>
                  </div>
                  <div class="box-title">
                    <div class="goods-title">{{ item.orderdetail[0].pdt_info.title }}</div>
                    <div class="goods-sku">型号：{{ 111 }}</div>
                  </div>
                  <div class="box-price">{{ item.jifenPrice }}积分</div>
                  <div class="order-state" :class="'state-' + item.status">
                    {{ item.status_txt }}
                  </div>
                  <div class="btn-actions">
                    <button class="btn-ripple fit-text" @click="goUrl('/exchangeDetail?orderno=' + item.order_sn)">
                      查看订单
                    </button>
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
</style>
