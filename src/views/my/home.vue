<script>
export default {
  name: "home",
  data() {
    return {
      tabIndex: 1,
      changeGroupVisible: false, // 转为团体
      teamApplyVisible: false, // 团员申请
      promoteVisible: false, // 提升额度
      realVisible: false, // 实名认证
      isReal: false, // 是否实名
      realSuccessVisible: false, // 实名认证成功
      dialogTitle: '身份验证',
      list_order: [{}], // 订单
      realForm: {}, // 实名认证
      tabList: [
        {value: 1, title: "待处理订单", num: 0},
        {value: 2, title: "待申请发票", num: 0},
        {value: 3, title: "待还款订单", num: 0},
      ],
      realRules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
        ],
        idcard: [
          {required: true, message: '请输入身份证号', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        idcard_pic1: [
          {required: true, message: '请上传身份证正面照', trigger: 'blur'}
        ],
        idcard_pic2: [
          {required: true, message: '请上传身份证正反面照', trigger: 'blur'}
        ]
      }
    }
  },
  watch: {
    baseInfo() {
      // 判断是否是团长且有团员申请
      if (this.baseInfo.if_leader == 1 && this.baseInfo.new_team_user) {
        this.teamApplyVisible = true
      }
    }
  },
  mounted() {
    this.setView();
  },
  methods: {
    setView() {

    },
    // 实名认证
    realClick() {
      if (this.isReal) {
        this.$api({
          url: "show_real_auth",
          method: "post",
        }).then(res => {
          if (res.code === 200) {
            this.isReal = res.data.status == 2 //1未实名  2已实名
            this.realForm = res.data;
          }
        })
      }
      this.realVisible = true
    },
    // 实名认证提交
    realVisibleSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.$api({
            url: "real_auth",
            method: "post",
            data: this.realForm
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('实名认证成功')
              this.realVisible = false
              this.isReal = true
              this.realSuccessVisible = true
            }
          })
        }
      })
    },
    // 查看实名信息
    lockRealInfo() {
      this.realSuccessVisible = false;
      this.realVisible = true
    },
    // 切换tab
    tabClick(item) {
      this.tabIndex = item.value
    },
    // 提升额度
    promoteConfirm() {
      this.promoteVisible = true
    },
    // 转为团体
    changeGroup() {
      this.changeGroupVisible = true
    },
    // 转为团体
    changeGroupSubmit() {
      if (this.dialogTitle == '身份验证') {
        this.dialogTitle = '个人预付转团体预付'
      } else {
        this.changeGroupVisible = false
      }
    },
    upload_on_success(response) {
      if (response.code != 200) {
        alertErr(response.msg)
      } else {
        this.$set(this.realForm, 'idcard_pic1', response.data.url)
        alertSucc('上传成功')
      }
    },
    upload_on_success_2(response, file, fileList) {
      if (response.code != 200) {
        alertErr(response.msg)
      } else {
        this.$set(this.realForm, 'idcard_pic2', response.data.url)
        alertSucc('上传成功')
      }
    }
  }
}
</script>

<template>
  <div class="content">
    <div class="user-card">
      <!-- 顶部用户信息 -->
      <div class="user-header">
        <div class="user-info">
          <el-avatar
              :src="require('@/assets/img/my/avatar.png')"
              size="large"
              class="avatar"
          ></el-avatar>
          <div class="info-text">
            <p class="name">{{ baseInfo.name }}</p>
            <p class="phone">{{ baseInfo.phone }}</p>
          </div>
        </div>
        <div class="column-flex-center">
          <span>普通会员</span>
          <el-button type="primary" class="membership-btn" @click="realClick">{{
              isReal ? '查看认证信息' : '实名认证'
            }}
          </el-button>
        </div>
      </div>

      <!-- 底部财务信息 -->
      <div class="user-finance">
        <div class="finance-item">
          <div class="circle">
            <p class="amount">500.00元</p>
            <p class="description">欠款金额</p>
            <p class="extra">剩余可用额度：1000.00元</p>
          </div>
          <div class="actions">
            <p class="a-item">还款</p>
            <i class="line"></i>
            <p class="a-item">交易记录</p>
            <i class="line"></i>
            <p class="a-item" @click="promoteConfirm">提升额度</p>
          </div>
        </div>
        <div class="finance-item">
          <div class="circle">
            <p class="amount">800.00元</p>
            <p class="description">可开票金额</p>
            <p class="extra">已开票待还款：500.00元</p>
          </div>
          <div class="actions">
            <p class="a-item">立即开票</p>
          </div>
        </div>
        <div class="finance-item">
          <div class="circle">
            <p class="amount">777.00元</p>
            <p class="description">账户余额</p>
            <p class="extra">预付款：500.00元+赠送金200.00元</p>
          </div>
          <div class="actions">
            <p class="a-item">去充值</p>
            <i class="line"></i>
            <p class="a-item">预付记录</p>
            <i class="line"></i>
            <p class="a-item" @click="changeGroup">转为团体预付</p>
          </div>
        </div>
        <div class="finance-item">
          <div class="circle">
            <p class="amount">800.00元</p>
            <p class="description">我的零钱包</p>
            <p class="extra">累计金额：5000.00元</p>
          </div>
          <div class="actions">
            <p class="a-item">立即提现</p>
            <i class="line"></i>
            <p class="a-item">佣金明细</p>
          </div>
        </div>
      </div>

      <div class="section-order">
        <div class="section-title">
          <div class="label">
            <div class="label-item pointer" :class="{'active': tabIndex === item.value}"
                 v-for="(item, index) in tabList"
                 :key="index" @click="tabClick(item)">
              {{ item.title }}<span>{{ item.num }}</span>
            </div>
          </div>
          <router-link to="/order-list" class="action">
            <span>全部订单</span>
            <img src="@/assets/img/my/more.png" alt/>
          </router-link>
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
                      <button class="btn-ripple fit-text btn-bg" v-if="tabIndex == 3">
                        还款
                      </button>
                      <button class="btn-ripple fit-text btn-bg" v-if="tabIndex == 2">
                        申请开票
                      </button>
                      <button class="btn-ripple fit-text">
                        查看订单
                      </button>
                      <button class="btn-ripple fit-text btn-bg" v-if="tabIndex == 1">
                        立即支付
                      </button>
                      <button class="btn-ripple fit-text" v-if="tabIndex == 1">
                        取消订单
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    提升额度-->
    <el-dialog title="提升额度" :visible.sync="promoteVisible" center width="500px">
      <div class="text-box">提升额度请拨打400-1234-5678</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="promoteVisible = false">我知道了</el-button>
      </span>
    </el-dialog>
    <!--    实名认证-->
    <el-dialog title="实名认证" :visible.sync="realVisible" center width="950px">
      <div class="real-content" v-if="!isReal">
        <div class="tip">这里是认证提示性文案</div>
        <p class="tit">信息仅用于身份验证，我们将保障您的信息安全</p>
        <el-form :model="realForm" :rules="realRules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="realForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号：" prop="name">
            <el-input v-model="realForm.idcard" placeholder="请输入准确身份证号"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="name">
            <el-input placeholder="请输入手机号" v-model="realForm.phone">
              <template slot="append">获取验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码：" prop="name">
            <el-input placeholder="请输入验证码" v-model="realForm.code"></el-input>
          </el-form-item>
          <el-form-item label="身份证照片：" prop="idcard_pic2">
            <div class="flex">
              <el-upload style="margin-right: 20px" class="upload-wrap" accept="image/*" :show-file-list="false"
                         name="file"
                         :on-success="upload_on_success"
                         action="http://jxjsjc.dx.hdapp.com.cn/api/upload"
                         :data="mix_upload_data">
                <div class="upload" v-if="!realForm.idcard_pic1">
                  <i class="el-icon-plus"></i>
                  <span>上传人像面照片</span>
                </div>
                <img :src="realForm.idcard_pic1" alt="" v-else>
              </el-upload>
              <el-upload class="upload-wrap" accept="image/*" :show-file-list="false" name="file"
                         :on-success="upload_on_success_2"
                         action="http://jxjsjc.dx.hdapp.com.cn/api/upload"
                         :data="mix_upload_data">
                <div class="upload" v-if="!realForm.idcard_pic2">
                  <i class="el-icon-plus"></i>
                  <span>上传国徽面照片</span>
                </div>
                <img :src="realForm.idcard_pic2" alt="" v-else>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="real-info" v-else>
        <div class="item">
          <div class="label">姓名：</div>
          <div class="value">{{ realForm.name }}</div>
        </div>
        <div class="item">
          <div class="label">身份证号：</div>
          <div class="value">{{ realForm.idcard }}</div>
        </div>
        <div class="item">
          <div class="label">手机号：</div>
          <div class="value">{{ realForm.phone }}</div>
        </div>
        <div class="item">
          <div class="label">身份证照片：</div>
          <div class="value">
            <div class="flex">
              <img :src="realForm.idcard_pic1" alt="">
              <img :src="realForm.idcard_pic2" alt="">
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if="!isReal">
         <el-button @click="realVisible = false">取消</el-button>
        <el-button type="primary" @click="realVisibleSubmit">确定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button type="primary" @click="realVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!--   实名认证成功 -->
    <el-dialog title="实名认证成功" :visible.sync="realSuccessVisible" center width="950px">
      <div class="success-content">
        <img src="@/assets/img/my/success.png" alt="">
        <p>实名认证提交成功</p>
        <p class="tip">请耐心等待管理员审核！</p>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="lockRealInfo">查看信息</el-button>
        <el-button type="primary" @click="realSuccessVisible = false">继续浏览</el-button>
      </span>
    </el-dialog>
    <!--    团员申请-->
    <el-dialog title="团员申请" :visible.sync="teamApplyVisible" center width="700px">
      <div class="team-apply">
        <div class="title"><span>{{ baseInfo.new_team_user }}</span>位用户申请加入您的团队</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="teamApplyVisible = false">立即处理</el-button>
      </span>
    </el-dialog>
    <!--    转为团体-->
    <el-dialog :title="dialogTitle" :visible.sync="changeGroupVisible" center width="500px">
      <div class="changeGroup" v-if="dialogTitle == '身份验证'">
        <p>手机号：15200007777</p>
        <el-input placeholder="请输入验证码" v-model="realForm.name">
          <template slot="append">获取验证码</template>
        </el-input>
      </div>
      <div class="changeGroup" v-else>
        <p>个人账户余额：0元</p>
        <p>团体账户余额：0元</p>
        <div class="money-inp">
          <span>转到团体账户金额：</span>
          <el-input placeholder="请输入金额" v-model="realForm.name"></el-input>
          <span>元</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeGroupSubmit">提交</el-button>
        <el-button @click="changeGroupVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.user-card {
  width: 100%;
  border-radius: 10px;
  font-family: Arial, sans-serif;

  .user-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 130px;
    background: linear-gradient(to right, #4a90e2, #007aff);
    border-radius: 8px;
    padding: 20px 145px 20px 20px;
    color: #fff;

    .user-info {
      display: flex;
      align-items: center;

      .avatar {
        width: 80px;
        height: 80px;
        margin-right: 40px;
        background: transparent;
      }

      .info-text {
        .name {
          font-size: 16px;
        }

        .phone {
          margin-top: 15px;
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }

    .membership-btn {
      margin-top: 14px;
      background: #fff;
      color: #007aff;
      border: none;
      font-weight: bold;
      border-radius: 5px;
    }
  }

  .user-finance {
    background: #fff;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 30px 0;
    height: 185px;

    .finance-item {
      padding-left: 46px;
      flex: 1;

      .circle {
        border-right: 1px solid #D5D8DE;

        .amount {
          font-weight: bold;
          font-size: 24px;
          color: #00479D;
        }

        .description {
          margin-top: 5px;
          font-weight: 400;
          font-size: 14px;
          color: #333333;
        }

        .extra {
          margin-top: 5px;
          font-weight: 400;
          font-size: 14px;
          color: #3399FF;
        }
      }

      .actions {
        cursor: pointer;
        margin-top: 20px;
        display: flex;
        align-items: center;

        .a-item {
          font-weight: 400;
          font-size: 13px;
          color: #999999;
        }

        .line {
          width: 1px;
          height: 15px;
          background: #707070;
          margin: 0 10px;
        }
      }

      &:last-child {
        .circle {
          border: none;
        }
      }
    }
  }

  .section-order {
    margin: 25px 0;
    background: #fff;

    .section-title {
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
          width: 135px;
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
              width: 135px;
              height: 2px;
              background: #3399FF;
              position: absolute;
              bottom: -18px;
              left: 0;
            }
          }
        }
      }

      .action {
        .flex();
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: @theme;
        cursor: pointer;

        img {
          width: 14px;
          margin-left: 10px;
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
              text-align: center;
              min-width: 200px;

              font-family: OPPOSans, OPPOSans;
              font-weight: bold;
              font-size: 14px;
              color: #333;
            }

            .order-state {
              padding: 3px 6px;
              // border: 1px solid #ccc;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 20px;

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
              width: 300px;

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
}

.text-box {
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: #282828;
}

.real-content {
  .tip {
    padding-left: 46px;
    height: 42px;
    line-height: 42px;
    background: #FFF7F7;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }

  .tit {
    margin-top: 20px;
    padding-left: 46px;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
  }

  .demo-ruleForm {
    margin-top: 40px;
    padding: 0 180px;
  }

  .upload-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 100px;
    background: #FFFFFF;
    border-radius: 2px 2px 2px 2px;
    border: 1px solid #DEDEDE;

    .upload {
      width: 150px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}

.real-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  .item {
    display: flex;
    align-items: start;
    margin-bottom: 30px;

    .label {
      width: 220px;
      text-align: right;
    }

    .value {
      padding-left: 20px;
      width: 350px;
    }
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

.team-apply {
  text-align: center;

  span {
    color: #3399FF;
    margin-right: 10px;
  }

  .title {
    font-weight: bold;
    font-size: 20px;
    color: #282828;
  }
}

.changeGroup {
  p {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    margin-bottom: 20px;
  }

  .money-inp {
    display: flex;
    align-items: center;

    .el-input {
      width: 150px;
    }
  }

  span:last-child {
    margin-left: 10px;
  }
}

.el-button--primary {
  background-color: #00479D;
  border: none;
}
</style>
