<template>
  <div class="content main">
    <div class="content-title">{{ title }}</div>
    <div class="content-item" v-if="index === 1">
      <el-form ref="form" :model="form" label-width="180px" :rules="rules">
        <el-form-item label="申请账号：" prop="name">
          <el-input v-model="form.name" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="学校/单位：" prop="name">
          <el-input v-model="form.name" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="name">
          <el-input v-model="form.name" placeholder="（自动识别）"></el-input>
        </el-form-item>
        <el-form-item label="测试项目名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="对应订单号：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
          <span class="tip">提示：多个订单号请用“、”隔开，例如：12345678、68686868</span>
        </el-form-item>
        <el-form-item label="期刊名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="论文标题：" prop="name">
          <el-input type="textarea" rows="3" v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="致谢内容：" prop="name">
          <el-input type="textarea" rows="3" v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="文章引用格式：" prop="name">
          <el-input type="textarea" rows="3" v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="影响因子：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="论文链接：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="支付宝账号：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
          <span
              class="tip">提示：请确认自己的收款人姓名和支付宝账号无误并已通过支付宝实名认证。未实名认证将导致您的提现不到账，请知悉。</span>
        </el-form-item>
        <el-form-item label="收款人姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上传凭证：" prop="name">
          <el-upload class="upload-wrap" accept="image/*" :show-file-list="false" name="img"
                     action="https://fjjx.dx.hdapp.com.cn/service.php?action=index_ossUpload"
                     :data="mix_upload_data" :on-success="upload_on_success"
                     :before-upload="upload_before_upload">
            <img v-if="form.images" :src="form.images" class="user-avatar"/>
            <img v-else src="@/assets/img/base/upload.png" class="user-avatar"/>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="protocol">
        <el-checkbox v-model="ptotocol"></el-checkbox>
        <span>我已确认上述填写信息准确无误，并知悉且同意科学指南针有权在支付致谢奖励后将本申请表内论文信息对外展示。</span>
      </div>
      <div class="submit">提交申请</div>
    </div>
    <div class="content-item" v-if="index === 2">
      <el-table :data="tableData" border>
        <el-table-column prop="title" label="SCI 期刊影响因子区间(取最近的影响因子)" align="center"></el-table-column>
        <el-table-column prop="level" label="奖励等级证书(同步线上发放)" align="center"></el-table-column>
        <el-table-column prop="money" label="奖励金额 (人民币)" align="center"></el-table-column>
      </el-table>
      <div class="cont">
        <p class="title">评选资格</p>
        <div class="desc">
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
        </div>
      </div>
      <div class="cont">
        <p class="title">致谢方式</p>
        <div class="desc">
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
        </div>
      </div>
      <div class="cont">
        <p class="title">奖励申请说明</p>
        <div class="desc">
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
          <p>在论文撰写和试验阶段，使用科学指南针提供的服务； </p>
        </div>
      </div>
      <div class="submit">立即参与</div>
    </div>
    <div class="content-item" v-if="index === 3">
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
        <el-row :gutter="24">
          <el-col :span="2">01</el-col>
          <el-col :span="4">测试项目</el-col>
          <el-col :span="4">郭菲菲 某某大学</el-col>
          <el-col :span="7">We also thank Mr. Wang Liangliang from Shiyanjia Lab (www.shiyanjia.com) for his drawing
            schematic illustration.
          </el-col>
          <el-col :span="7">
            <p>查看文章</p>
            Zou, D., Xu, J., Chen, X., Drioli, E., Qiu, M., & Fan, Y. (2019). A novel thermal spraying
            technique to fabricate fly ash/alumina composite membranes for oily emulsion and spent tin wastewater
            treatment. Separation and Purification Technology, 219, 127–136.
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-item" v-if="index === 4">
      <div class="table-title">
        <el-row :gutter="24">
          <el-col :span="4">论文标题</el-col>
          <el-col :span="4">奖励金额</el-col>
          <el-col :span="8">奖励时间</el-col>
          <el-col :span="8">等级证书</el-col>
        </el-row>
      </div>
      <div class="table-data">
        <el-row :gutter="24">
          <el-col :span="4">这里是论文标题</el-col>
          <el-col :span="4">200元</el-col>
          <el-col :span="8">2024-10-01 12:01:30</el-col>
          <el-col :span="8">
            <p>查看证书</p>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: ['index'],
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
        name: [{required: true, message: '请输入活动名称', trigger: 'blur'},]
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
  methods: {
    //上传相关
    upload_on_success(res, file) {
      let {code, data, msg} = res;
      alert(res);
      if (code == 200) {
        this.form.images = res.data;
      }
    },
    upload_before_upload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20; //文件大小
      return isLt2M;
    },
  }
}
</script>

<style scoped lang="less">
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
      padding: 20px 0 20px 30px;
      border-bottom: 1px solid #707070;

      p {
        font-weight: 400;
        font-size: 14px;
        color: #00479D;
      }

      .el-row {
        display: flex;
        align-items: center;
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
