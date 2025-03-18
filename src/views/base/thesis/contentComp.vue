<template>
  <div class="content main">
    <div class="content-title">{{ title }}</div>
    <div v-if="index === 1" class="content-item">
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="申请账号：" prop="phone">
          <el-input v-model="form.phone" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="学校/单位：" prop="unit_school">
          <el-input v-model="form.unit_school" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="测试项目名称：" prop="p_title">
          <el-input v-model="form.p_title" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="对应订单号：" prop="p_order">
          <el-input v-model="form.p_order" placeholder="请输入"></el-input>
          <span class="tip">提示：多个订单号请用“、”隔开，例如：12345678、68686868</span>
        </el-form-item>
        <el-form-item label="期刊名称：" prop="mag_title">
          <el-input v-model="form.mag_title" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="论文标题：" prop="title">
          <el-input v-model="form.title" placeholder="请输入" rows="3" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="致谢内容：" prop="content">
          <el-input v-model="form.content" placeholder="请输入" rows="3" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="文章引用格式：" prop="art_format">
          <el-input v-model="form.art_format" placeholder="请输入" rows="3" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="影响因子：" prop="sci_info">
          <el-input v-model="form.sci_info" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="论文链接：" prop="url">
          <el-input v-model="form.url" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号：" prop="alipay">
          <el-input v-model="form.alipay" placeholder="请输入"></el-input>
          <span
              class="tip">提示：请确认自己的收款人姓名和支付宝账号无误并已通过支付宝实名认证。未实名认证将导致您的提现不到账，请知悉。</span>
        </el-form-item>
        <el-form-item label="收款人姓名：" prop="alipay_name">
          <el-input v-model="form.alipay_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上传凭证：">
          <el-upload :before-upload="upload_before_upload" :data="mix_upload_data" :on-success="upload_on_success"
                     :show-file-list="false"
                     accept="image/*"
                     action="https://jxjsjc.dx.hdapp.com.cn/api/upload" class="upload-wrap"
                     name="file">
            <img v-if="form.pz_pic" :src="form.pz_pic" class="user-avatar"/>
            <img v-else class="user-avatar" src="@/assets/img/base/upload.png"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="protocol">
        <el-checkbox v-model="ptotocol"></el-checkbox>
        <span>我已确认上述填写信息准确无误，并知悉且同意科学指南针有权在支付致谢奖励后将本申请表内论文信息对外展示。</span>
      </div>
      <div class="submit" @click="submit">提交申请</div>
    </div>
    <div v-if="index === 2" class="content-item">
      <!--      <el-table :data="tableData" border>-->
      <!--        <el-table-column prop="title" label="SCI 期刊影响因子区间(取最近的影响因子)" align="center"></el-table-column>-->
      <!--        <el-table-column prop="level" label="奖励等级证书(同步线上发放)" align="center"></el-table-column>-->
      <!--        <el-table-column prop="money" label="奖励金额 (人民币)" align="center"></el-table-column>-->
      <!--      </el-table>-->
      <!--      <div class="cont">-->
      <!--        <p class="title">评选资格</p>-->
      <!--        <div class="desc">-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="cont">-->
      <!--        <p class="title">致谢方式</p>-->
      <!--        <div class="desc">-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="cont">-->
      <!--        <p class="title">奖励申请说明</p>-->
      <!--        <div class="desc">-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="cont" v-html="content.content"></div>
      <div class="cont" v-html="content.content2"></div>
      <div class="submit" @click="goUrl()">立即参与</div>
    </div>
    <div v-if="index === 3" class="content-item">
      <div class="table-title">
        <el-row :gutter="24">
          <el-col :span="2">编号</el-col>
          <el-col :span="4">测试项目</el-col>
          <el-col :span="4">致谢人/单位</el-col>
          <el-col :span="7">致谢内容</el-col>
          <el-col :span="7">发表文章</el-col>
        </el-row>
      </div>
      <div class="table-data">
        <el-row v-for="(item, index) in content" :key="index" :gutter="24">
          <el-col :span="2">{{ index + 1 }}</el-col>
          <el-col :span="4">{{ item.p_title }}</el-col>
          <el-col :span="4">{{ item.name }} {{ item.unit_school }}</el-col>
          <el-col :span="7" class="ellipsis-5">{{ item.content }}</el-col>
          <el-col :span="7">
            <p v-if="item.url" class="pointer" @click="ToUrl(item.url)">查看文章</p>
            <p v-else>暂无文章</p>
          </el-col>
        </el-row>
        <el-empty v-if="!content.length" description="暂无记录..."></el-empty>
      </div>
    </div>
    <div v-if="index === 4" class="content-item">
      <div class="table-title">
        <el-row :gutter="24">
          <el-col :span="4">论文标题</el-col>
          <el-col :span="4">奖励金额</el-col>
          <el-col :span="8">奖励时间</el-col>
          <el-col :span="8">等级证书</el-col>
        </el-row>
      </div>
      <div class="table-data">
        <el-row v-for="(item, index) in content" :key="index" :gutter="24">
          <el-col :span="4">{{ item.title }}</el-col>
          <el-col :span="4">{{ item.reward_money }}元</el-col>
          <el-col :span="8">{{ item.audit_at }}</el-col>
          <el-col :span="8">
            <p v-if="item.url" class="pointer" @click="ToUrl(item.reward_cert)">查看证书</p>
            <p v-else>暂无证书</p>
          </el-col>
        </el-row>
        <el-empty v-if="!content.length" description="暂无记录..."></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: ['index', 'content'],
  data() {
    return {
      ptotocol: false,
      tableData: [{
        title: 'SCI 期刊影响因子区间(取最近的影响因子)',
        level: '一级证书',
        money: '1000元'
      }], // 致谢说明
      form: {}, // 致谢奖励提交
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        unit_school: [
          {required: true, message: '请输入学校/单位', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ],
        p_title: [
          {required: true, message: '请输入测试项目名称', trigger: 'blur'}
        ],
        p_order: [
          {required: true, message: '请输入对应订单号', trigger: 'blur'}
        ],
        mag_title: [
          {required: true, message: '请输入期刊名称', trigger: 'blur'}
        ],
        title: [
          {required: true, message: '请输入论文标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入致谢内容', trigger: 'blur'}
        ],
        alipay_name: [
          {required: true, message: '请输入收款人姓名', trigger: 'blur'}
        ],
        alipay: [
          {required: true, message: '请输入支付宝账号', trigger: 'blur'}
        ],
        sci_info: [
          {required: true, message: '请输入影响因子', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '请输入论文链接', trigger: 'blur'}
        ],
        art_format: [
          {required: true, message: '请输入文章引用格式', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    title() {
      switch (this.index) {
        case 1:
          return '论文致谢奖励申请表'
        case 2:
          return '论文致谢说明'
        case 3:
          return '用户致谢论文'
        case 4:
          return '致谢奖励记录'
      }
    }
  },
  mounted() {
    this.$api({
      url: 'user_info',
      method: 'post'
    }).then(res => {
      if (res.code === 200) {
        this.form = {
          phone: res.data.phone,
          name: res.data.name,
          unit_school: res.data.unit_group || res.data.unit_name,
          email: res.data.email
        }
      }
    })
  },
  methods: {
    //上传相关
    upload_on_success(res, file) {
      let {code, data, msg} = res;
      if (code == 200) {
        this.form.pz_pic = res.data.url;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
    goUrl() {
      this.$emit('check', {id: 1})
    },
    ToUrl(url) {
      window.open(url, '_blank')
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.form.pz_pic) {
            this.$message.error('请上传凭证')
            return
          }
          this.$api({
            url: 'apply_paper',
            method: 'post',
            data: this.form
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('您已提交成功，等待管理员审核！')
              this.$refs.form.resetFields();
              this.form.pz_pic = ""
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  background-color: #fff;
  padding: 57px 0 58px;
  .flex();
  flex-direction: column;

  .content-title {
    font-weight: bold;
    font-size: 22px;
    color: #333333;
  }

  .content-item {
    width: 1156px;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tip {
      font-weight: 400;
      font-size: 12px;
      color: #FF0000;
      line-height: 20px;
    }

    .upload-wrap {
      width: 100px;
      height: 100px;


      input {
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }

      /deep/ .el-upload {
        width: 100px;
        height: 100px;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .protocol {
      width: 620px;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      .flex();
      align-items: start;

      span {
        margin-left: 20px;
        display: inline-block;
      }
    }

    .submit {
      cursor: pointer;
      margin-top: 35px;
      width: 170px;
      height: 45px;
      line-height: 45px;
      background: linear-gradient(90deg, #00479D 0%, #3399FF 100%);
      border-radius: 3px 3px 3px 3px;
      font-weight: 400;
      font-size: 16px;
      color: #FFFFFF;
      text-align: center;
    }

    .cont {
      width: 100%;
      margin-top: 50px;

      .title {
        display: flex;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
        color: #333333;

        &:before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 22px;
          background: linear-gradient(153deg, #00479D 0%, #3095FA 100%, #3399FF 100%);
          border-radius: 2px;
          margin-right: 10px;
        }
      }

      .desc {
        margin-top: 30px;
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        line-height: 28px;
      }
    }

    .table-title {
      width: 100%;
      padding: 0 0 20px 30px;
      border-bottom: 1px solid #707070;
    }

    .table-data {
      width: 100%;
      border-bottom: 1px solid #707070;

      p {
        font-weight: 400;
        font-size: 14px;
        color: #00479D;
      }

      .el-row {
        margin-left: 0 !important;
        margin-right: 0 !important;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #707070;
        padding: 10px 0 10px 20px;

        &:last-child {
          border-bottom: none;
        }
      }
    }


    .el-table {
      border-radius: 15px;
      border: 1px solid #3399FF !important;

      /deep/ .el-table__cell {
        border-right-color: #3399FF;
      }

      /deep/ .is-leaf {
        background-color: #3399FF;
        color: #fff;
        border-right-color: #FFFFFF;
      }
    }

    /deep/ .el-form-item__label {
      padding-right: 53px;
      font-weight: 400;
      font-size: 16px;
      color: #333333;
    }

    /deep/ .el-form-item__content {
      width: 440px;
      display: flex;
      flex-direction: column;
    }

    .el-input, .el-textarea {
      width: 440px;
    }

  }
}
</style>
