<script>
export default {
  name: "uploadResult",
  data() {
    return {
      updateResultVisible: false,
      updateResultType: 0,
      tabIndex: 1,
      orderDetail: {},

      notesList: [], // 备注列表
      notesContent: '', // 备注
      remarkDialogVisible: false, // 备注

      feedback: '',
      dialogTitle: '',
      dissentDialogVisible: false,
      // 选中数组
      ids: [],
      fileList: [],
      fileList2: [],
      // 非单个禁用
      single: true,
      queryParams: {}, // 查询参数
      list_order: [{}], // 订单
      payList: [], // 测试项目
      selectTab: {title: "普通订单", status: "0"},
      list_tab: [
        {title: "普通订单", status: "0"},
        {title: "分批测订单", status: "1"}
      ],
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
          status: 3,
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
            this.updateResultType = 3
          } else {
            this.updateResultType = 0
          }
        }
        this.updateResultVisible = true;
      })
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

    // 报告提交
    async updateResultSubmit() {
      const res = await this.$api({
        url: 'store/upload_report',
        method: 'post',
        data: {
          orderId: this.orderDetail.id,
          title: this.fileList[0].name,
          path: this.fileList[0].url,
          type: 1
        }
      })

      const res1 = await this.$api({
        url: 'store/upload_report',
        method: 'post',
        data: {
          orderId: this.orderDetail.id,
          title: this.fileList2[0].name,
          path: this.fileList2[0].url,
          type: 2
        }
      })
      Promise.all([res, res1]).then(res => {
        this.$api({
          url: 'store/accept_order',
          method: 'post',
          data: {
            ids: this.orderDetail.id,
            type: 4
          }
        }).then(res => {
          if (res.code === 200) {
            this.updateResultType = 1
            this.setView();
          }
        })
      })

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

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
    },
    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.fileList = [response.data];
        this.$message.success('上传成功');
      } else {
        this.$message.error(response.msg);
      }
    },
    handleSuccess2(response, file, fileList) {
      if (response.code === 200) {
        this.fileList2 = [response.data];
        this.$message.success('上传成功');
      } else {
        this.$message.error(response.msg);
      }
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
            <el-input
                v-model="queryParams.title"
                clearable
                placeholder="请输入测试项目"
            />
            <!--            <el-select v-model="queryParams.title" placeholder="请选择测试项目">-->
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

      <div class="tab-box">
        <div
            v-for="(item, index) in list_tab"
            :key="index"
            :class="item.title === selectTab.title ? 'active' : ''"
            class="tab-item"
            @click="selectTab = item"
        >
          {{ item.title }}
        </div>
      </div>

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
          <el-table-column label="要求出结果时间" prop="u_result_at" width="180px"></el-table-column>
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
          <el-table-column label="回收" prop="if_recover">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 1">是</p>
              <p v-else>否</p>
            </template>
          </el-table-column>
          <el-table-column label="加急" prop="if_urgent">
            <template slot-scope="scope">
              <p v-if="scope.row.if_recover == 0">不加急</p>
              <p v-if="scope.row.if_recover == 1">3个工作日完成</p>
              <p v-if="scope.row.if_recover == 2">24小时</p>
            </template>
          </el-table-column>
          <el-table-column label="寄样时间" prop="yp_at" width="180px"></el-table-column>
          <el-table-column fixed="right" label="操作" width="300px">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="goUrl(`/supplier-order-detail?orderId=${scope.row.id}`)">详情
              </el-button>
              <el-button size="mini" type="text" @click="lockRealInfo(scope.row)">上传报告和结果</el-button>
              <el-button size="mini" type="text" @click="lockRealInfo(scope.row)">已传结果</el-button>
              <el-button size="mini" type="text" @click="remarkDialog(scope.row)">备注</el-button>
              <el-button size="mini" type="text" @click="dissentDialog('问题反馈', scope.row)">问题反馈</el-button>
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

    <!--    上传报告-->
    <el-dialog :visible.sync="updateResultVisible" center title="上传报告">
      <div v-if="updateResultType === 0 || updateResultType === 3" class="updateResult">
        <div class="title">
          <p>订单号：{{ orderDetail.order ? orderDetail.order.orderno : '-' }}</p>
          <p>项目名称：{{ orderDetail.order ? orderDetail.order.title : '-' }}</p>
        </div>
        <el-upload
            :data="mix_upload_data"
            :file-list="fileList"
            :on-success="handleSuccess"
            accept="image/*"
            action="https://jxjsjc.dx.hdapp.com.cn/api/store/upload"
            class="upload-demo"
        >
          <div class="upload-tit">点击上传报告 +</div>
        </el-upload>
        <el-upload
            :data="mix_upload_data"
            :file-list="fileList2"
            :on-success="handleSuccess2"
            accept="image/*"
            action="https://jxjsjc.dx.hdapp.com.cn/api/store/upload"
            class="upload-demo"
        >
          <div class="upload-tit">点击上传仪器测试结果 +</div>
        </el-upload>
      </div>

      <div v-if="updateResultType === 1" class="success-content">
        <img alt="" src="@/assets/img/my/success.png">
        <p>报告上传成功</p>
        <p class="tip">请耐心等待管理员审核！</p>
      </div>
      <span v-if="updateResultType === 1" slot="footer" class="dialog-footer">
         <el-button @click="lockRealInfo(orderDetail)">查看报告</el-button>
        <el-button type="primary" @click="updateResultVisible = false">继续浏览</el-button>
      </span>
      <div v-if="updateResultType === 0" slot="footer" class="dialog-footer">
        <el-button @click="updateResultVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateResultSubmit">确 定</el-button>
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

  .tab-box {
    margin-top: 10px;
    margin-bottom: 20px;
    padding-left: 40px;
    .flex();

    .tab-item {
      cursor: pointer;
      padding-bottom: 10px;
      border-bottom: 3px solid transparent;
      margin-right: 55px;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #333333;

      &.active {
        border-bottom: 3px solid @theme;
        font-weight: bold;
        color: @theme;
      }
    }
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
}

.success-content {
  .flex();
  flex-direction: column;

  img {
    width: 320px;
    height: 225px;
  }

  p {
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }

  .tip {
    margin-top: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #FF0000;
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
