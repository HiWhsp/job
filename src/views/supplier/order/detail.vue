<script>
export default {
  name: "detail",
  data() {
    return {
      statusText: '',
      process: 1, // 订单类型
      orderId: '', // 订单号
      orderDetail: {}, // 订单详情
      storeOrderInfo: {}, // 订单信息
      updateResultInfo: {}, // 上传结果信息
      reportDetail: {}, // 报告数据
      acceptType: "", // 操作类型 1 接单 2驳回
      notes: '', // 驳回原因
      feedback: '', // 异议
      dialogTitle: '', // 弹框标题
      acceptVisible: false, // 操作
      remarkDialogVisible: false, // 备注
      updateResultVisible: false, // 上传结果
      dissentDialogVisible: false, // 异议
      settlementDialogVisible: false, // 申请结算
      checkDialogVisible: false, // 查看预约单
      checkDialogContent: '', // 查看预约单内容
      updateResultType: 0, // 上传结果类型
      settlementRruleForm: {}, // 结算
      settlementRules: {}, // 结算

      fileList: [], // 上传文件列表
      fileList2: [], //
    }
  },
  computed: {
    typeType() {
      switch (this.orderDetail.status) {
        case '1':
          return '待寄送'
        case '2':
          return '待接单'
        case '3':
          return '待完成'
        case '4':
          return '待上传结果订单'
        case '5':
          return '已取消'
        case '6':
          return '待审核结果订单'
        case '7':
          return '已完成订单'
        case '8':
          return '复测订单'
        case '9':
          return '待结算订单'
        case '10':
          return '样品回收订单'
        case '11':
          return '差评'
        case '12':
          return '已超期'
      }
    }
  },
  mounted() {
    this.orderId = this.$route.query.orderId;
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'store/order_detail',
        method: 'post',
        data: {
          orderId: this.orderId
        }
      }).then(res => {
        if (res.code == 200) {
          this.orderDetail = res.data;
          this.statusText = this.getStatus(this.orderDetail.storeOrderInfo ? this.orderDetail.storeOrderInfo.status : '');
          if(this.statusText == '待审核结果订单' || this.statusText == '已完成') {
            this.$api({
              url: 'store/report_detail',
              method: 'post',
              data: {
                orderId: this.orderId
              }
            }).then(res => {
              if (res.code === 200) {
                this.reportDetail = res.data;
              }
            })
          }
          this.storeOrderInfo = res.data.storeOrderInfo || {};
        }
      })
    },
    // 备注
    remarkDialog() {
      this.remarkDialogVisible = true
    },
    // 已传结果
    updateResult(temp) {
      if (temp) {
        this.$api({
          url: 'store/report_detail',
          method: 'post',
          data: {
            orderId: this.orderId
          }
        }).then(res => {
          if (res.code == 200) {
            this.updateResultInfo = res.data;
            this.setView();
          }
        })
      } else {
        this.updateResultType = 0;
        this.updateResultInfo = {};
      }
      this.updateResultVisible = true
    },
    // 报告提交
    async updateResultSubmit() {
      const res = await this.$api({
        url: 'store/upload_report',
        method: 'post',
        data: {
          orderId: this.orderId,
          title: this.fileList[0].name,
          path: this.fileList[0].url,
          type: 1
        }
      })

      const res1 = await this.$api({
        url: 'store/upload_report',
        method: 'post',
        data: {
          orderId: this.orderId,
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
            ids: this.orderId,
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
    // 查看报告
    lockRealInfo() {
      this.$api({
        url: 'store/report_detail',
        method: 'post',
        data: {
          orderId: this.orderId
        }
      }).then(res => {
        if (res.code === 200) {
          this.fileList = [{
            name: res.data.list[0].title,
            url: res.data.list[0].path
          }];
          this.fileList2 = [{
            name: res.data.list[1].title,
            url: res.data.list[1].path
          }];
        }
        this.updateResultVisible = true;
        this.updateResultType = 3
      })
    },
    // 异议
    dissentDialog(title) {
      this.dialogTitle = title;
      this.dissentDialogVisible = true
    },
    // 查看预约单
    checkDialog() {
      this.$api({
        url: 'store/download_order',
        method: 'post',
        data: {
          orderno: this.orderDetail.orderno,
          html: 1
        }
      }).then(res => {
        this.checkDialogContent = res;
        this.checkDialogVisible = true;
      })
    },
    // 申请结算
    applySettlement() {
      this.settlementDialogVisible = true;
    },
    //   接单/驳回
    throttle_do_submit(type, submit) {
      this.acceptVisible = true;
      this.acceptType = type;
      if (submit) {
        this.$api({
          url: 'store/accept_order',
          method: 'post',
          data: {
            ids: this.orderId,
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
          orderId: this.orderId,
          content: this.feedback
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.dissentDialogVisible = false;
          this.setView();
        }
      })
    },

    // 收到样品
    sampleReceived() {
      this.$api({
        url: 'store/accept_order',
        method: 'post',
        data: {
          ids: this.orderId,
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

    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      this.fileList = [response.data];
      this.$message.success('上传成功');
    },
    handleSuccess2(response, file, fileList) {
      this.fileList2 = [response.data];
      this.$message.success('上传成功');
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="status-item">
      <div class="status">
        <span>订单详情</span>
      </div>
      <div class="info">
        <p class="order-id">订单号：{{ orderDetail.orderno }}</p>
        <p class="time">{{ statusText }}</p>
      </div>
    </div>
    <div class="address-item">
      <div class="sample-delivery">
        <h3 class="section-title">基本信息</h3>
        <div class="info-wrap">
          <div class="left-content">
            <p class="detail">
              <span>项目名称：</span>{{ orderDetail.product_info ? orderDetail.product_info.title : '-' }}
            </p>
            <p class="detail">
              <span>仪器型号：</span>{{ storeOrderInfo.model_no }}
            </p>
            <p class="detail">
              <span>订单收入：</span>{{ orderDetail.price }}元
            </p>
          </div>
          <div class="left-content">
            <p class="detail">
              <span>对接人：</span>{{ storeOrderInfo.contact_user }}
            </p>
            <p class="detail">
              <span>联系方式：</span>{{ storeOrderInfo.contact_tel }}
            </p>
            <p class="detail">
              <span>寄送地址：</span>{{ storeOrderInfo.fenbu }}
            </p>
          </div>
          <div class="left-content">
            <p class="detail">
              <span>样品状态：</span>{{ getYpStatus(storeOrderInfo.yp_status) || '--' }}
            </p>
            <p class="detail">
              <span>寄样时间：</span>{{ orderDetail.created_at }}
            </p>
            <p class="detail">
              <span>完成时间：</span>{{ orderDetail.updated_at }}
            </p>
          </div>
          <div class="btn-wrap">
            <div class="btn" @click="checkDialog">
              查看预约单
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">订单要求</h3>
        <!-- 实验联系人 -->
        <div class="info-row">
          <span class="label">实验有问题联系人</span>
          <div class="content">
            联系人：{{ orderDetail.contact_user || '--' }} 联系方式：{{ orderDetail.contact_tel || '--' }}
            地址：{{ orderDetail.contact_address || '--' }}
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row">
          <span class="label">样品是否回收</span>
          <div class="content">{{ orderDetail.recover_address_txt || '--' }}</div>
        </div>
        <!-- 实验留言 -->
        <div class="info-row">
          <span class="label">实验留言</span>
          <div class="content">{{ orderDetail.remark || '--' }}</div>
        </div>
      </div>
    </div>
    <div class="orderInfo-item">
      <div class="order-info">
        <h3 class="section-title">样品信息</h3>
        <div v-for="item in orderDetail.detail" :key="item.id">
          <p class="sample-info"> {{ item.index }}，数量: {{ item.num }}，样品编号：{{ item.order_id }}</p>
          <!-- 表格 -->
          <table class="info-table">
            <tbody>
            <tr v-for="it in item.content" :key="it.id">
              <td class="label">{{ it.title }}</td>
              <td class="value">{{ it.value }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!--   报告情况 -->
    <div v-if="['待审核结果订单', '已完成'].includes(statusText)" class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">报告情况</h3>
        <!-- 实验联系人 -->
        <div class="info-row">
          <span class="label">报告列表</span>
          <div class="content">
            <p v-for="item in reportDetail.list" :key="item.id">{{ item.title }}</p>
          </div>
        </div>
        <!-- 样品是否回收 -->
        <div class="info-row">
          <span class="label">审核状态</span>
          <div class="content">
            <p :class="{
              'status-1': reportDetail.status_txt.includes('成功'),
              'status-2': reportDetail.status_txt.includes('失败')
            }">{{ reportDetail.status_txt }}</p>
            <p v-if="reportDetail.notes">驳回原因：{{ reportDetail.notes }}</p>
            <p class="edit" v-if="reportDetail.status_txt.includes('失败')">修改</p>
          </div>
        </div>
      </div>
    </div>
    <!--   样品回收情况 -->
    <div v-if="['10'].includes(process)" class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">样品回收情况</h3>
        <div class="flex" style="align-items: start">
          <div style="flex: 1;">
            <div class="info-row">
              <span class="label">寄送地址</span>
              <div class="content">
                <p>这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址这里是地址</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">物流信息</span>
              <div class="content">
                <p>-</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">完成时间</span>
              <div class="content">
                <p>-</p>
              </div>
            </div>
          </div>
          <div class="info-row" style="flex: 1;">
            <span class="label">回收状态</span>
            <div class="content">
              <p class="status-1">待寄回分部</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--   结算情况 -->
    <div v-if="['已完成'].includes(statusText)" class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">结算情况</h3>
        <div class="flex" style="align-items: start">
          <div class="info-row" style="flex: 1;">
            <span class="label">结算信息</span>
            <div class="content">
<!--              <p>结算账户：银行卡-对公户-中国工商银行厦大支行-1234567898887777-嘉庚创新实验室</p>-->
              <p>结算方式：对公户</p>
              <p>开户行：{{ webConfig.bank_name }}</p>
              <p>账号：{{ webConfig.bank_no }}</p>
              <p>户名：{{ webConfig.company_name }}</p>
            </div>
          </div>
          <div class="info-row" style="flex: 1;">
            <span class="label">结算状态</span>
            <div class="content">
              <p class="status-1">已结算</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--   差评/异议信息 -->
    <div v-if="['11'].includes(process)" class="order-item">
      <div class="order-requirements">
        <h3 class="section-title">差评/异议信息</h3>
        <div class="flex" style="align-items: start">
          <div style="flex: 1;">
            <div class="info-row">
              <span class="label">差评/异议描述</span>
              <div class="content">
                <p>这里是一段差评/异议信息描述...</p>
              </div>
            </div>
            <div class="info-row">
              <span class="label">处理状态</span>
              <div class="content">
                <p class="status-2">未处理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--    操作-->
    <div v-if="statusText == '已分派'"
         class="operation">
      <div class="btn back" @click="throttle_do_submit(1)" v-if="orderDetail.storeOrderInfo.status == 10">接单</div>
      <div class="btn" @click="throttle_do_submit(2)" v-if="orderDetail.storeOrderInfo.status == 11">驳回</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="dissentDialog('问题反馈')">问题反馈</div>
    </div>

    <div v-if="statusText == '运输中'"
         class="operation">
      <div class="btn back" @click="sampleReceived">收到样品</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="dissentDialog('问题反馈')">问题反馈</div>
    </div>

    <div v-if="statusText == '待上传结果订单'"
         class="operation">
      <div class="btn back" @click="updateResult()">上传结果</div>
      <div class="btn" @click="lockRealInfo">已传结果</div>
      <!--      <div class="btn">分批测已完成</div>-->
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="dissentDialog('问题反馈')">问题反馈</div>
    </div>

    <div v-if="statusText == '待审核结果订单'" class="operation">
      <div class="btn back" @click="remarkDialog">备注</div>
    </div>
    <div v-if="process == 8" class="operation">
      <div class="btn back" @click="remarkDialog">备注</div>
      <div class="btn" @click="remarkDialog">已传结果（1）</div>
      <div class="btn" @click="remarkDialog">复测完成</div>
      <div class="btn" @click="remarkDialog">备注</div>
      <div class="btn" @click="remarkDialog">问题反馈（0）</div>
    </div>

    <div v-if="statusText == '待结算订单'" class="operation">
      <div class="btn back" @click="applySettlement">申请结算</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>

    <div v-if="process == 10" class="operation">
      <div class="btn back" @click="applySettlement">寄样</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>

    <div v-if="process == 11" class="operation">
      <div class="btn back" @click="applySettlement">已处理</div>
      <div class="btn" @click="remarkDialog">备注</div>
    </div>
    <div v-if="process == 12" class="operation">
      <div class="btn back" @click="remarkDialog">备注</div>
    </div>

    <el-dialog :visible.sync="remarkDialogVisible" title="备注">
      <div class="dialog-title">
        <p><span>平台备注：</span>这里是一段平台备注</p>
        <p class="date">2024-08-20</p>
      </div>
      <div class="dialog-title">
        <p><span>供应商备注：</span>这里是一段平台备注</p>
        <p class="date">2024-08-20</p>
      </div>
      <el-input placeholder="请在这里输入您的备注" rows="10" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="remarkDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--    上传报告-->
    <el-dialog :visible.sync="updateResultVisible" center title="上传报告">
      <div v-if="updateResultType === 0 || updateResultType === 3" class="updateResult">
        <div class="title">
          <p>订单号：{{ orderDetail.orderno }}</p>
          <p>项目名称：{{ orderDetail.product_info ? orderDetail.product_info.title : '-' }}</p>
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
         <el-button @click="lockRealInfo">查看报告</el-button>
        <el-button type="primary" @click="updateResultVisible = false">继续浏览</el-button>
      </span>
      <div v-if="updateResultType === 0" slot="footer" class="dialog-footer">
        <el-button @click="updateResultVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateResultSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="dissentDialogVisible">
      <el-input v-model="feedback" :placeholder="'请输入' + dialogTitle + '内容'" rows="5" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dissentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dissentDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="settlementDialogVisible" center title="结算信息" width="900px">
      <div class="settlement-box">
        <el-form ref="ruleForm" :model="settlementRruleForm" :rules="settlementRules" label-width="100px">
          <el-form-item label="结算账户：" prop="name">
            <el-select v-model="settlementRruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算方式：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="开户行：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="账号：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="户名：" prop="region">
            <el-input v-model="settlementRruleForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="settlementDialogVisible = false">确定</el-button>
        <el-button @click="settlementDialogVisible = false">变更结算信息</el-button>
      </div>
    </el-dialog>

    <!--    报告预约单-->
    <el-dialog :visible.sync="checkDialogVisible" center title="报告预约单">
      <div class="checkDialog" v-html="checkDialogContent">
      </div>
    </el-dialog>

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
  </div>
</template>

<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;

  .status-item {
    width: 100%;
    background-color: #fff;

    .status {
      display: flex;
      justify-content: space-between;
      padding: 0 40px 0;
      height: 60px;
      line-height: 60px;
      border: 1px solid #E8E8E8;

      span {
        font-weight: 400;
        font-size: 18px;
        color: #212529;
      }
    }

    .info {
      margin: 30px 130px;
      padding: 0 35px;
      display: flex;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      background: #DFEEFF;

      .order-id, .time {
        font-weight: bold;
        font-size: 20px;
        color: #00479D;
      }

    }
  }

  .address-item {
    margin-top: 20px;
    width: 100%;
    padding: 0 130px;

    .sample-delivery {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: #fff;

      .section-title {
        width: 100%;
        padding-left: 35px;
        height: 63px;
        line-height: 63px;
        font-size: 18px;
        color: #000000;
        border-bottom: 1px solid #E5E5E5;
      }

      .info-wrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 20px 35px;

        .btn-wrap {
          .btn {
            cursor: pointer;
            width: 100px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #00479D;
            border: 1px solid #00479D;

            font-weight: 400;
            font-size: 14px;
            color: #FFFFFF;
          }
        }
      }

      .left-content {
        flex: 2;

        .delivery-method {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }

        .detail {
          font-size: 14px;
          color: #818181;
          margin-top: 20px;

          span {
            //font-weight: bold;
          }
        }
      }
    }
  }

  .order-item {
    margin-top: 20px;
    width: 100%;
    background: #fff;
    padding: 0 130px;

    .order-requirements {
      padding-bottom: 30px;

      .section-title {
        padding-left: 35px;
        height: 63px;
        line-height: 63px;
        font-size: 18px;
        color: #000000;
        border-bottom: 1px solid #E5E5E5;
      }

      .info-row {
        min-height: 57px;
        display: flex;
        //border-bottom: 1px solid #f5f5f5;
        margin: 0 35px;

        &:last-child {
          border-bottom: none;
        }

        .label {
          flex: 0 0 180px; // 固定宽度
          font-weight: 400;
          font-size: 16px;
          color: #333333;
          text-align: right;
          padding-right: 40px;
          margin-top: 15px;
        }

        .content {
          margin-top: 15px;
          font-weight: 400;
          font-size: 14px;
          color: #818181;

          p {
            margin-bottom: 10px;
          }

          .status-1 {
            color: #00A527;
          }

          .status-2 {
            color: #FF0000;
          }

          .edit {
            cursor: pointer;
            font-weight: 400;
            font-size: 14px;
            color: #00479D;
          }
        }
      }
    }
  }

  .orderInfo-item {
    width: 100%;
    background: #fff;
    margin-top: 20px;
    padding: 0 130px 30px;

    .order-info {
      .section-title {
        height: 63px;
        line-height: 63px;
        padding-left: 35px;
        color: #000;
        font-size: 18px;
        border-bottom: 1px solid #eaeaea;
      }

      .sample-info {
        margin-top: 30px;
        margin-bottom: 20px;
        padding: 0 35px;
        font-weight: 400;
        font-size: 16px;
        color: #333333;
      }

      .info-table {
        margin: 0 35px;
        border-collapse: collapse;


        tbody {
          border: 1px solid #E8E8E8;

          tr {
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
              border-bottom: none;
            }

            td {
              border: 1px solid #E8E8E8;
              padding: 10px 10px 10px 25px;
              font-size: 14px;

              &.label {
                width: 40%;
                font-weight: bold;
                color: #555;
              }

              &.value {
                color: #666;
              }
            }
          }
        }
      }
    }
  }

  .real-content {
    .tip {
      height: 44px;
      line-height: 44px;
      padding-left: 15px;
      background: #FFF5E5;
      border-radius: 3px;
      color: #FF8000;
    }

    .info {
      margin-top: 20px;
      padding-left: 15px;

      p {
        margin-bottom: 15px;
      }
    }

    .report {
      margin-top: 30px;
      padding-left: 15px;

      p {
        margin-bottom: 20px;

        span {
          margin-left: 10px;
          color: #00479D;
          cursor: pointer;
        }
      }
    }
  }

  .operation {
    width: 100%;
    padding: 30px 130px 50px;
    display: flex;
    justify-content: end;

    .btn {
      cursor: pointer;
      margin-right: 10px;
      width: 100px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border: 1px solid #00479D;

      font-weight: 400;
      font-size: 14px;
      color: #00479D;
    }

    .back {
      background: #00479D;
      color: #fff;
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

.settlement-box {
  padding: 0 150px;
}

/deep/ .el-button--primary {
  background-color: #00479D;
  color: #fff;
  border-color: #00479D;
}

.checkDialog {
  overflow: auto;
}
</style>
