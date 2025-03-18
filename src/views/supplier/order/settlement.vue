<script>
export default {
  name: "settlement",
  data() {
    return {
      tabIndex: 1,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      selectRow: {},
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      payList: [], // 测试项目
      settlementRruleForm: {}, // 结算
      settlementDialogVisible: false,
      updateResultVisible: false,
      orderDetail: {},
      fileList: [], // 上传文件列表
      fileList2: [], // 上传文件列表

      notesList: [], // 备注列表
      notesContent: '', // 备注
      remarkDialogVisible: false, // 备注

      feedback: '',
      dialogTitle: '',
      dissentDialogVisible: false,

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
      },
      settlementRules: {
        type: [
          {required: true, message: '请选择结算类型', trigger: 'change'}
        ],
        bank_title: [
          {required: true, message: '请输入开户行', trigger: 'blur'}
        ],
        bank_name: [
          {required: true, message: '请输入户名', trigger: 'blur'}
        ],
        bank_no: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ]
      }, // 结算
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
          status: 7,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length == 0
    },

    // 批量结算
    allJS() {
      this.$api({
        url: 'store/bank_list',
        method: 'post',
        data: {
          page: 1,
          limit: 1
        }
      }).then(res => {
        if (res.code == 200) {
          this.settlementRruleForm = res.data[0];
        }
      })
      this.settlementDialogVisible = true;
      this.settlementRruleForm = {};
      this.selectRow = this.ids;
    },

    applySettlement(row) {
      this.$api({
        url: 'store/bank_list',
        method: 'post',
        data: {
          page: 1,
          limit: 1
        }
      }).then(res => {
        if (res.code == 200) {
          this.settlementRruleForm = res.data[0];
        }
      })
      this.selectRow = row;
      this.settlementDialogVisible = true;
    },

    // 结算账户提交
    settlementDialogSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const ids = [];
          // this.selectRow 可能是个对象可能是个数组 需要取出id
          if (Array.isArray(this.selectRow)) {
            ids.push(...this.selectRow)
          } else {
            ids.push(this.selectRow.id)
          }
          this.$api({
            url: 'store/apply_settle',
            method: 'post',
            data: {
              ids: ids.join(),
              ...this.settlementRruleForm
            }
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.setView();
              this.settlementDialogVisible = false;
            }
          })
          this.$refs.ruleForm.resetFields();
        }
      })
    },

    // 查看报告
    lockRealInfo(row) {
      this.orderDetail = row;
      this.$api({
        url: 'store/report_detail',
        method: 'post',
        data: {
          orderId: row.id
        }
      }).then(res => {
        if (res.code === 200) {
          if (res.data.list.length) {
            this.fileList = [{
              name: res.data.list[0].title,
              url: res.data.list[0].path
            }];
            this.fileList2 = [{
              name: res.data.list[1].title,
              url: res.data.list[1].path
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

    // 备注
    remarkDialog(row) {
      this.orderDetail = row
      this.$api({
        url: 'store/order_notes',
        method: 'post',
        data: {
          id: this.orderDetail.id
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
          id: this.orderDetail.id,
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
      this.orderDetail = row
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
          orderId: this.orderDetail.id,
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
            待结算订单
          </div>
        </div>
        <div class="search flex">
          <el-input v-model="keyword" placeholder="请输入仪器名/订单号"></el-input>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>

      <div class="search-filter">
        <el-form ref="queryForm" :inline="true" :model="queryParams" label-width="100px" size="small">
          <el-form-item label="订单编号" prop="orderSn">
            <el-input
                v-model="queryParams.orderId"
                clearable
                placeholder="请输入订单号"
            />
          </el-form-item>
          <el-form-item label="测试项目" prop="phone">
            <el-select v-model="queryParams.title" placeholder="请选择测试项目">
              <el-option
                  v-for="item in payList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
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
          <el-button :disabled="single" size="mini" type="primary" @click="allJS">
            批量申请结算
          </el-button>
        </el-col>
      </el-row>
      <div class="order-box">
        <el-table :data="list_order" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"/>
          <el-table-column label="订单号" prop="orderId" width="150px">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.orderno : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="项目名称" prop="title">
            <template slot-scope="scope">
              <p>{{ scope.row.order ? scope.row.order.title : '--' }}</p>
            </template>
          </el-table-column>
          <el-table-column label="仪器型号" prop="model_no"></el-table-column>
          <el-table-column label="寄样分部" prop="fenbu"></el-table-column>
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
          <el-table-column label="对接人" prop="contact_user"></el-table-column>
          <el-table-column label="完成时间" prop="updated_at"></el-table-column>
          <el-table-column fixed="right" label="操作" width="280px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">详情
              </el-button>
              <el-button size="mini" type="text" @click="applySettlement(scope.row)">申请结算</el-button>
              <el-button size="mini" type="text" @click="lockRealInfo(scope.row)">
                查看报告
              </el-button>
              <el-button size="mini" type="text" @click="dissentDialog('异议', scope.row)">
                提交异议
              </el-button>
              <el-button size="mini" type="text" @click="remarkDialog(scope.row)">备注
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

    <el-dialog :visible.sync="settlementDialogVisible" center title="结算信息" width="900px">
      <div class="settlement-box">
        <el-form ref="ruleForm" :model="settlementRruleForm" :rules="settlementRules" label-width="100px">
          <!--          <el-form-item label="结算账户：" prop="name">-->
          <!--            <el-select v-model="settlementRruleForm.region" placeholder="请选择活动区域">-->
          <!--              <el-option label="区域一" value="shanghai"></el-option>-->
          <!--              <el-option label="区域二" value="beijing"></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item label="结算方式：" prop="type">
            <el-select v-model="settlementRruleForm.type" placeholder="请选择结算方式">
              <el-option label="对公" :value="1"></el-option>
              <el-option label="个人" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开户行：" prop="bank_title">
            <el-input v-model="settlementRruleForm.bank_title" placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item label="账号：" prop="bank_no">
            <el-input v-model="settlementRruleForm.bank_no" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="户名：" prop="bank_name">
            <el-input v-model="settlementRruleForm.bank_name" placeholder="请输入户名"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="settlementDialogSubmit">确定</el-button>
        <el-button @click="$refs.ruleForm.resetFields()">变更结算信息</el-button>
      </div>
    </el-dialog>


    <!--    上传报告-->
    <el-dialog :visible.sync="updateResultVisible" center title="上传报告">
      <div class="updateResult">
        <div class="title">
          <p>订单号：{{ orderDetail.order ? orderDetail.order.orderno : '-' }}</p>
          <p>项目名称：{{ orderDetail.order ? orderDetail.order.title : '-' }}</p>
        </div>
        <div class="upload-tit">报告</div>
        <p style="margin-bottom: 10px">{{ fileList[0] ? fileList[0].name : '' }}<span class="down"
                                                                                      @click="downReport(fileList[0].url)">下载</span>
        </p>
        <div class="upload-tit">测试结果</div>
        <p>{{ fileList2[0] ? fileList2[0].name : '' }} <span class="down"
                                                             @click="downReport(fileList2[0].url)">下载</span></p>
      </div>
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
.settlement-box {
  padding: 0 150px;
}

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

.el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
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
</style>
