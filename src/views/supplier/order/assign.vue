<script>
export default {
  name: "assign",
  data() {
    return {
      tabIndex: 1,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      acceptVisible: false,
      remarkDialogVisible: false, // 备注
      acceptType: "", // 操作类型 1 接单 2驳回
      notes: '', // 驳回原因
      notesList: [], // 备注列表
      notesContent: '', // 备注
      feedback: '', // 异议
      dissentDialogVisible: false, // 异议
      dialogTitle: '', // 弹框标题
      slectRow: {},
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      payList: [], // 测试项目
      keyword: '',
      count: 1,
      pagination: {
        page: 1,
        limit: 10
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
          status: 1,
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
      this.pagination.page = 1;
      if (this.queryParams.date) {
        this.queryParams.start_time = this.queryParams.date[0]
        this.queryParams.end_time = this.queryParams.date[1]
      } else {
        this.queryParams.start_time = ''
        this.queryParams.end_time = ''
      }
      this.setView();
    },
    resetQuery() {
      this.pagination.page = 1
      this.queryParams = {}
      this.handleQuery()
    },
    goUrl(url) {
      this.$router.push(url);
    },

    // 接单/驳回
    throttle_do_submit(type, submit, row) {
      this.selectRow = row ? row : this.selectRow;
      this.acceptVisible = true;
      this.acceptType = type;
      if (submit) {
        this.$api({
          url: 'store/accept_order',
          method: 'post',
          data: {
            ids: this.selectRow.id,
            type: this.acceptType,
            notes: this.notes
          }
        }).then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.msg,
              type: 'success'
            });
            this.acceptVisible = false;
            this.setView();
          }
        })
      }
    },
    // 批量操作
    allSubmit(type) {
      this.$api({
        url: 'store/accept_order',
        method: 'post',
        data: {
          ids: this.ids.join(),
          type: type,
          notes: type == 2 ? '批量驳回' : ''
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.acceptVisible = false;
          this.setView();
        }
      })
    },

    // 备注
    remarkDialog(row) {
      this.selectRow = row
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

    // 异议
    dissentDialog(title, row) {
      this.selectRow = row;
      this.dialogTitle = title;
      this.dissentDialogVisible = true
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
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
            已分派订单
          </div>
        </div>
        <div class="search flex">
          <el-input placeholder="请输入仪器名/订单号"></el-input>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
          <el-form-item label="订单编号">
            <el-input
                v-model="queryParams.orderId"
                clearable
                placeholder="请输入订单号"
            />
          </el-form-item>
          <el-form-item label="测试项目">
            <el-input
                v-model="queryParams.title"
                clearable
                placeholder="请输入测试项目"
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
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="datetimerange"
                value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleQuery">搜索</el-button>
            <el-button size="mini" type="primary" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-row :gutter="10">
        <el-col :span="1.5">
          <el-button :disabled="single" size="mini" type="primary" @click="allSubmit(1)">
            批量接单
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button :disabled="single" size="mini" type="primary" @click="allSubmit(2)">
            批量驳回
          </el-button>
        </el-col>
      </el-row>
      <div class="order-box">
        <el-table :data="list_order" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="订单号" prop="orderId" width="150px">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.orderno : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="项目名称" prop="title" width="150px">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.title : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="仪器型号" prop="model_no" width="120px"></el-table-column>
          <el-table-column label="金额" prop="price">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.price : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="样品数" prop="price">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.yp_num : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="寄样分部" prop="fenbu" width="150px"></el-table-column>
          <el-table-column label="对接人" prop="contact_user"></el-table-column>
          <el-table-column label="回收" prop="if_recover">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 1">是</p>
              <p v-else>否</p>
            </template>
          </el-table-column>
          <el-table-column label="加急" prop="if_urgent" width="120px">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 0">不加急</p>
              <p v-if="scope.row.if_recover == 1">3个工作日完成</p>
              <p v-if="scope.row.if_recover == 2">24小时</p>
            </template>
          </el-table-column>
          <el-table-column label="订单状态" prop="date">
            <template slot-scope="scope">
              <p>{{ getStatus(scope.row.status) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="样品状态" prop="yp_status">
            <template slot-scope="scope">
              <p>{{ getYpStatus(scope.row.yp_status) || '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="寄样时间" prop="yp_at" width="180px"></el-table-column>
          <el-table-column label="完成时间" prop="complate_at" width="180px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="250px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">查看
              </el-button>
              <el-button v-if="scope.row.status == 10" size="mini" type="text"
                         @click="throttle_do_submit(1, false, scope.row)">接单
              </el-button>
              <el-button v-if="scope.row.status == 10 || scope.row.status == 20" size="mini" type="text"
                         @click="throttle_do_submit(2, false, scope.row)">驳回
              </el-button>
              <el-button size="mini" type="text" @click="remarkDialog(scope.row)">备注
              </el-button>
              <el-button size="mini" type="text" @click="dissentDialog('问题反馈', scope.row)">
                问题反馈
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="count" class="pagination-box"
           style="margin-top: 40px; text-align: center;">
        <el-pagination :current-page.sync="pagination.page" :page-size.sync="pagination.limit" :total="count"
                       background layout="total, prev, pager, next"
                       @current-change="setView"></el-pagination>
      </div>
    </div>

    <!--    接单/驳回-->
    <el-dialog :visible.sync="acceptVisible" center title="操作" width="600px">
      <el-radio-group v-model="acceptType">
        <el-radio :label="1">接单</el-radio>
        <el-radio :label="2">驳回</el-radio>
      </el-radio-group>
      <el-input v-if="acceptType === 2" v-model="notes" placeholder="请输入驳回原因" rows="3" style="margin-top: 20px;"
                type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="acceptVisible = false">取 消</el-button>
        <el-button type="primary" @click="throttle_do_submit(acceptType, true)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="remarkDialogVisible" title="备注">
      <div v-for="item in notesList" :key="item.id" class="dialog-title">
        <p><span>{{ item.type_txt }}：</span>{{ item.content }}</p>
        <p class="date">{{ item.created_at }}</p>
      </div>
      <el-input v-model="notesContent" placeholder="请在这里输入您的备注" rows="10" type="textarea"></el-input>
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

<style lang="less" scoped>
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
    width: 1700px;
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
