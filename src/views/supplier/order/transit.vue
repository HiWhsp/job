<script>
export default {
  name: "transit",
  data() {
    return {
      tabIndex: 1,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      feedback: '',
      dialogTitle: '',
      dissentDialogVisible: false,
      remarkDialogVisible: false,
      notesList: [], // 备注列表
      notesContent: '', // 备注
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      payList: [], // 测试项目
      selectRow: {},
      keyword: '',
      count: 1,
      pagination: {
        page: 1,
        limit: 10
      },
      realRules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
        ]
      }
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/order_list',
        method: 'post',
        data: {
          keyword: this.keyword,
          status: 2,
          start_time: this.queryParams.start_time,
          end_time: this.queryParams.end_time,
          orderId: this.queryParams.orderId,
          title: this.queryParams.title,
          ...this.pagination,
        }
      }).then(res => {
        if (res.code == 200) {
          this.list_order = res.data;
          this.count = res.count;
        }
      })
    },
    handleQuery() {
      this.pagination.page = 1
      if (this.queryParams.date) {
        this.queryParams.start_time = this.queryParams.date[0]
        this.queryParams.end_time = this.queryParams.date[1]
      } else {
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
      }
      this.setView()
    },
    resetQuery() {
      this.pagination.page = 1
      this.queryParams = {}
      this.setView()
    },
    goUrl(url) {
      this.$router.push(url);
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
    },

    // 收到样品
    sampleReceived(row) {
      this.selectRow = row;
      this.$api({
        url: 'store/accept_order',
        method: 'post',
        data: {
          ids: this.selectRow.id,
          type: 3
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.setView();
        }
      })
    },

    // 备注
    remarkDialog(row) {
      this.selectRow = row;
      this.$api({
        url: 'store/order_notes',
        method: 'post',
        data: {
          id: this.selectRow.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.notesList = res.data;
        }
      })
      this.remarkDialogVisible = true
    },

    // 备注
    remarkDialogSubmit() {
      this.$api({
        url: 'store/submit_notes',
        method: 'post',
        data: {
          id: this.selectRow.id,
          content: this.notesContent
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.notesContent = '';
          this.remarkDialogVisible = false;
          this.setView();
        }
      })
    },

    // 异议
    dissentDialog(title, row) {
      this.selectRow = row;
      this.dialogTitle = title;
      this.dissentDialogVisible = true
    },

    // 异议
    dissentDialogSubmit() {
      if (!this.feedback) {
        this.$message.error('请输入' + this.dialogTitle + '内容');
        return
      }
      this.$api({
        url: 'store/order_feedback',
        method: 'post',
        data: {
          orderId: this.selectRow.id,
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
          this.setView();
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
          <div class="label-item pointer">
            运输中订单
          </div>
        </div>
        <div class="search flex">
          <el-input placeholder="请输入仪器名/订单号" v-model="keyword"></el-input>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="100px">
          <el-form-item label="订单编号" prop="orderSn">
            <el-input
                v-model="queryParams.orderId"
                placeholder="请输入订单号"
                clearable
            />
          </el-form-item>
          <el-form-item label="测试项目" prop="phone">
            <el-input
                v-model="queryParams.title"
                placeholder="请输入测试项目"
                clearable
            />
            <!--            <el-select v-model="queryParams.orderUrl" placeholder="请选择测试项目">-->
            <!--              <el-option-->
            <!--                  v-for="item in payList"-->
            <!--                  :key="item.value"-->
            <!--                  :label="item.label"-->
            <!--                  :value="item.value">-->
            <!--              </el-option>-->
            <!--            </el-select>-->
          </el-form-item>
          <el-form-item label="日期筛选" prop="goodsName">
            <el-date-picker
                v-model="queryParams.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" :disabled="single">
            批量收到样品
          </el-button>
        </el-col>
      </el-row>
      <div class="order-box">
        <el-table :data="list_order" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"/>
          <el-table-column prop="orderId" label="订单号" width="150px">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.orderno : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="项目名称">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.title : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="model_no" label="仪器型号"></el-table-column>
          <el-table-column prop="fenbu" label="寄样分部"></el-table-column>
          <el-table-column prop="price" label="金额">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.price : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="样品数">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.yp_num : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="contact_user" label="对接人"></el-table-column>
          <el-table-column prop="if_recover" label="回收">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 1">是</p>
              <p v-else>否</p>
            </template>
          </el-table-column>
          <el-table-column prop="yp_at" label="寄样时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="230px">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">详情
              </el-button>
              <el-button type="text" size="mini" @click="sampleReceived(scope.row)">收到样品</el-button>
              <el-button type="text" size="mini" @click="remarkDialog(scope.row)">备注</el-button>
              <el-button type="text" size="mini" @click="dissentDialog('问题反馈', scope.row)">问题反馈</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="count" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination background layout="total, prev, pager, next" @current-change="setView"
                       :current-page.sync="pagination.page" :page-size.sync="pagination.limit"
                       :total="count"></el-pagination>
      </div>
    </div>
    <el-dialog :visible.sync="remarkDialogVisible" title="备注">
      <div class="dialog-title" v-for="item in notesList" :key="item.id">
        <p><span>{{ item.type_txt }}：</span>{{ item.content }}</p>
        <p class="date">{{ item.created_at }}</p>
      </div>
      <el-input placeholder="请在这里输入您的备注" rows="10" type="textarea" v-model="notesContent"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarkDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dissentDialogVisible">
      <el-input v-model="feedback" :placeholder="'请输入' + dialogTitle + '内容'" rows="5" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dissentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissentDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  background: #fff;
  padding-bottom: 100px;
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

      /deep/ .el-button--primary {
        background: #00479D;
        color: #fff;
        border-color: #00479D;
        border-radius: 0;
        height: 42px;
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

  .el-row {
    margin-top: 10px;
    margin-left: 35px !important;
  }

  .order-box {
    margin-top: 10px;
    padding: 0 40px;

    /deep/ .el-table th.el-table__cell {
      background: #EAECEE;;
      color: #333333;
    }
  }
}

.dialog-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  p {
    font-weight: 400;
    font-size: 16px;
    color: #333333;

    span {
      font-weight: 400;
      font-size: 16px;
      color: #FF0000;
    }

    &.date {
      font-weight: 400;
      font-size: 14px;
      color: #999999;
    }
  }
}

.el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
}
</style>
