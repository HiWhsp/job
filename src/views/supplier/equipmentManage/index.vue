<script>
export default {
  name: "index",
  data() {
    return {
      keyword: '',
      settlementDialogVisible: false,// 新增/修改设备
      starDetailVisible: false,// 设备星级
      setDateDialogVisible: false,// 设置不派单时间
      historyVisible: false, // 不派单时间历史记录
      setDate: null,
      setDateId: '', // 设置不派单时间
      historyId: '', // 不派单时间历史记录
      tableData: [], // 设备列表
      settlementRruleForm: {}, // 结算
      starDetail: {},// 设备星级详情
      settlementRules: {
        title: [
          {required: true, message: '请输入设备名称', trigger: 'blur'},
        ],
        // star: [
        //   {required: true, message: '请输入设备星级', trigger: 'blur'},
        // ],
        model: [
          {required: true, message: '请输入设备型号', trigger: 'blur'},
        ],
        price: [
          {required: true, message: '请输入报价', trigger: 'blur'},
        ],
        pnum: [
          {required: true, message: '请输入数量', trigger: 'blur'},
        ],
        power: [
          {required: true, message: '请输入星级', trigger: 'blur'},
        ]
      }, // 结算
      historyDate: [], // 不派单时间历史记录
      pagination: {
        page: 1,
        limit: 5,
      },
      historyPagination: {
        page: 1,
        limit: 5,
        count: 0,
        total_day: 0
      },
      count: 0,
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/device_list',
        method: 'post',
        data: {
          ...this.pagination
        }
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
        }
      })
    },

    // 设置不派单时间
    setDateOpen(row) {
      this.setDateId = row.id;
      this.setDateDialogVisible = true
    },

    // 设置不派单时间
    setDateDialogSubmit() {
      if (!this.setDate) {
        this.$message.error('请选择时间区间');
        return
      }
      this.$api({
        url: 'store/device_time_edit',
        method: 'post',
        data: {
          id: this.setDateId,
          start_time: this.setDate[0],
          end_time: this.setDate[1],
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg);
          this.setDate = null
          this.setDateId = ''
          this.setView();
          this.setDateDialogVisible = false
        }
      })
    },

    historyVisibleOpen() {
      this.$api({
        url: 'store/device_time_list',
        method: 'post',
        data: {
          id: this.historyId,
          limit: this.historyPagination.limit,
          page: this.historyPagination.page
        }
      }).then(res => {
        if (res.code === 200) {
          this.historyDate = res.data;
          this.historyPagination.total_day = res.total_day;
          this.historyPagination.count = res.count;
          this.historyVisible = true
        }
      })
    },
    // 不派单时间历史记录
    setHistoryVisibleOpen(row) {
      this.historyId = row.id;
      this.historyVisibleOpen()
    },
    // 新增/修改设备
    settlementDialogOpen(row) {
      this.settlementDialogVisible = true;
      this.settlementRruleForm = {...row};
    },

    // 结算提交
    settlementDialogSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api({
            url: 'store/device_edit',
            method: 'post',
            data: {
              ...this.settlementRruleForm
            }
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.msg);
              this.setView();
              this.settlementDialogVisible = false;
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="section-title">
      <div class="label">
        <div class="label-item pointer">
          报告管理
        </div>
      </div>
      <div class="search">
        <div class="flex search-item">
          <el-input placeholder="请输入仪器名/订单号" v-model="keyword"></el-input>
          <el-button type="primary">搜索</el-button>
        </div>
        <el-button type="primary" @click="settlementDialogOpen()">新增设备</el-button>
      </div>
    </div>

    <div class="card-container">
      <img :src="baseInfo.avatar" alt="">
      <div class="info">
        <div class="title">
          <p class="name">{{ baseInfo.name }}</p>
          <p>信誉分 <span>100分</span></p>
        </div>
        <div class="status">
          <p>派单中 <span>正常派单中</span></p>
        </div>
      </div>
      <div class="option">
        <div class="btn back" @click="setDateDialogVisible = true">设置不派单时间</div>
        <div class="btn" @click="historyVisibleOpen">不派单时间历史记录</div>
      </div>
    </div>


    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="设备图片" width="150">
          <template slot-scope="scope">
            <img src="@/assets/img/supplier/avatar.png" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="date" label="设备名称及星级" width="200">
          <template slot-scope="scope">
            <div class="column-flex-center">
              <p>{{ scope.row.title }}</p>
              <div class="flex">
                <el-rate
                    v-model="scope.row.power"
                    disabled
                    text-color="#ff9900">
                </el-rate>
                <span class="detail" @click="starDetailVisible = true">详情</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="设备型号" width="320">
          <template slot-scope="scope">
            <p>{{ scope.row.model }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="数量" width="100">
          <template slot-scope="scope">
            <p>{{ scope.row.pnum }}台</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="检测能力" width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.power }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="派单状态" width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.status_txt }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="settlementDialogOpen(scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="setDateOpen(scope.row)">设置不派单时间</el-button>
            <el-button size="mini" type="text" @click="setHistoryVisibleOpen(scope.row)">不派单时间历史记录</el-button>
            <el-button size="mini" type="text">符合实情无需修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--    新增/修改设备-->
    <el-dialog title="新增设备" :visible.sync="settlementDialogVisible" width="900px" center>
      <div class="settlement-box">
        <el-form :model="settlementRruleForm" :rules="settlementRules" ref="ruleForm" label-width="100px">
          <el-form-item label="设备名称：" prop="title">
            <el-input v-model="settlementRruleForm.title" placeholder="请输入设备名称"></el-input>
            <!--            <el-select v-model="settlementRruleForm.region" placeholder="请选择设备">-->
            <!--              <el-option label="区域一" value="shanghai"></el-option>-->
            <!--              <el-option label="区域二" value="beijing"></el-option>-->
            <!--            </el-select>-->
          </el-form-item>
          <el-form-item label="设备型号：" prop="model">
            <el-input v-model="settlementRruleForm.model" placeholder="请输入设备型号"></el-input>
            <!--            <el-select v-model="settlementRruleForm.region" placeholder="请选择设备型号">-->
            <!--              <el-option label="区域一" value="shanghai"></el-option>-->
            <!--              <el-option label="区域二" value="beijing"></el-option>-->
            <!--            </el-select>-->
          </el-form-item>
          <el-form-item label="设备数量：" prop="pnum">
            <el-input v-model="settlementRruleForm.pnum" placeholder="请输入设备数量"></el-input>
          </el-form-item>
          <!--          <el-form-item label="设备星级：" prop="power">-->
          <!--            <el-input v-model="settlementRruleForm.power" placeholder="请输入设备星级"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="检测能力：" prop="power">
            <el-input v-model="settlementRruleForm.power" placeholder="请输入每台设备每天可检测的样品数量"></el-input>
          </el-form-item>
          <el-form-item label="报价：" prop="price">
            <el-input v-model="settlementRruleForm.price" placeholder="请输入报价">
              <template slot="append">/ 次</template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settlementDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="settlementDialogSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!--    设备星级    -->
    <el-dialog title="设备星级" :visible.sync="starDetailVisible" width="1200px" center>
      <div class="starDetail-box">
        <div class="title">
          <p>24年9月设备星级：</p>
          <el-rate v-model="starDetail.value"></el-rate>
          <p>各项满分：<span>100分</span></p>
        </div>
        <div class="card-wrap">
          <div class="card-item" v-for="item in 4">
            <p class="tit">测试好</p>
            <p class="tip">
              <span>分数</span>
              <span class="up">6.5分 <i class="el-icon-top"></i></span>
            </p>
          </div>
        </div>
        <div class="context">
          根据您的项目星级，我们建议您可以从以下方面进行提高：<br>
          1、您当前近三个月的平均单量是0，您需将平均单量提升到3可以提高您的项目星级
          <br>
          2、你可提升日容量/机时来提高您的项目星级 3、您当前的出结果时间为0，控制出结果时间在4.00工作日内，可提高评分
          <br>
          4、您当前解答问题专业性评价得分是6.50分，项目经理对该项评价得分是4.67分，提升专业能力，获得项目经理的真实好评，提高项目星级。<br>
          5、您当前回复及时性评价得分是2.50分，项目经理对该项评价得分是4.67分，及时回复项目经理的消息，获得项目经理的真实好评，提高项目星级。<br>
          6、您当前测试过程反馈主动性评价得分是3.50分，项目经理对该项评价得分是4.67分，获得项目经理的真实好评，有问题及时反馈，可使用【问题反馈】功能。<br>
          7、您当前解决问题积极性评价得分是2.50分，项目经理对该项评价得分是4.67分，当订单发生问题时，积极配合解决，获得项目经理的真实好评；前往【差评/争议列表】
          如有疑问，可联系您的负责人
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="starDetailVisible = false">我知道了</el-button>
      </div>
    </el-dialog>

    <!--   设置不派单时间 -->
    <el-dialog title="设置不派单时间" :visible.sync="setDateDialogVisible" width="900px" center>
      <div class="setDate-box flex">
        <span>时间区间</span>
        <el-date-picker
            v-model="setDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setDateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setDateDialogSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!--   不派单时间历史记录 -->
    <el-dialog title="不派单时间历史记录" :visible.sync="historyVisible" width="800px" center>
      <div class="history-table">
        <el-table :data="historyDate" ref="historyForm">
          <el-table-column prop="start_time" label="开始时间" align="center"></el-table-column>
          <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
          <el-table-column prop="day" label="天数" align="center"></el-table-column>
        </el-table>
        <p class="all">共计不派单天数：<span>{{ historyPagination.total_day }}天</span></p>

        <div class="pagination-box" v-if="historyPagination.count">
          <el-pagination
              background
              layout="total, prev, pager, next"
              :total="historyPagination.count"
              :current-page.sync="historyPagination.page"
              :page-size.sync="historyPagination.limit"
              @current-change="historyVisibleOpen"
          >
          </el-pagination>
        </div>
        <el-empty v-else description="暂无记录..."></el-empty>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.content {
  background-color: #fff;

}

.section-title {
  width: 100%;
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
    width: 450px;
    display: flex;

    .el-input {
      border: 1px solid #00479D;
    }

    .search-item {
      /deep/ .el-button--primary {
        margin: 0;
        height: 42px;
      }
    }

    /deep/ .el-button--primary {
      border-radius: 0;
      border: none;
      background-color: @theme;
      margin-left: 10px;
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

.card-container {
  padding: 33px 66px;
  margin: 30px 134px 40px;
  border: 1px solid #D9D9D9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 83px;
    height: 83px;
  }

  .info {
    margin-left: 95px;
    flex: 1;

    .title {
      display: flex;
      align-items: center;

      p {
        margin-right: 15px;
        font-weight: 400;
        font-size: 16px;
        color: #333;

        span {
          color: #3399FF;
        }
      }

      .name {
        font-weight: bold;
        font-size: 18px;
      }
    }

    .status {
      margin-top: 10px;
      width: 170px;
      height: 27px;
      background: rgba(51, 153, 255, 0.1);
      padding-left: 10px;
      display: flex;
      align-items: center;

      p {
        font-weight: bold;
        font-size: 14px;
        color: #333333;

        &:before {
          content: '';
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #3399FF;
          margin-right: 5px;
        }
      }

      span {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .option {
    display: flex;

    .btn {
      cursor: pointer;
      padding: 6px 30px;
      font-weight: 400;
      font-size: 14px;
      color: @theme;
      border: 1px solid @theme;
      margin-left: 10px;
    }

    .back {
      background-color: @theme;
      color: #fff;
    }
  }
}

.table {
  margin: 0 134px;

  img {
    width: 92px;
    height: 92px;
  }

  .detail {
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;
    color: #00479D;
  }

  /deep/ .el-table th.el-table__cell {
    background-color: #D9D9D9;
    color: #333333;
  }

  /deep/ .el-button--text {
    width: 110px;
    text-align: left;
    margin-left: 10px;
  }
}

.settlement-box {
  padding: 0 150px;

  .el-select {
    width: 100%;
  }
}

.starDetail-box {
  padding: 0 120px;

  .title {
    display: flex;
    align-items: center;

    p {
      font-weight: bold;
      font-size: 18px;
      color: #333333;
    }
  }

  .card-wrap {
    margin-top: 34px;
    display: flex;
    justify-content: space-between;

    .card-item {
      padding-left: 32px;
      width: 200px;
      height: 130px;
      background: #FFFFFF;
      box-shadow: 0px 3px 10px 1px rgba(0, 71, 157, 0.2);
      border-radius: 13px 13px 13px 13px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .tit {
        font-weight: bold;
        font-size: 20px;
        color: #3399FF;
      }

      .tip {
        margin-top: 10px;
        display: flex;

        align-items: center;

        .up {
          color: #00A527;
        }

        .down {
          color: #FF0000;
        }

        span {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          margin-right: 5px;
        }
      }
    }
  }

  .context {
    margin-top: 50px;
  }
}

.setDate-box {
  justify-content: center;

  span {
    margin-right: 15px;
  }
}

.history-table {
  .all {
    text-align: right;
    margin-top: 30px;
    font-weight: 400;
    font-size: 16px;
    color: #333;

    span {
      color: #3399FF;
    }
  }
}

/deep/ .el-button--primary {
  border-radius: 0;
  border: none;
  background-color: @theme;
  margin-left: 10px;
}
</style>
