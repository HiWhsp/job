<template>
  <div>
    <div class="one-wrap">
      <div class="contact-list">
        <div
          class="contact-item"
          v-for="(item, index) in contactList"
          :key="index"
        >
          <div class="title">{{ item.title }}</div>
          <div class="img-wrap">
            <img :src="item.contactImg" alt="" />
          </div>
          <div class="contactText">{{ item.contactText }}</div>
          <div class="subText">{{ item.subText }}</div>
        </div>
      </div>

      <div class="card-list">
        <div
          class="card-item"
          :class="`card-item-${index}`"
          v-for="(item, index) in cardList"
          :key="index"
        >
          <div class="title-wrap">
            <div class="icon-wrap">
              <img :src="item.img" alt="" />
            </div>
            {{ item.position }}
          </div>
          <div class="sub-title" :class="`sub-title-${index}`">
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>

    <div class="two-wrap">
      <img src="@/assets/img/chat-us/map.png" alt="" />
    </div>

    <div class="form-wrap">
      <div class="form-title">若有任何问题欢迎随时给我们留言</div>
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <div class="form-flex">
          <el-form-item label="姓名" class="flex-item" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="公司名称" class="flex-item" prop="companyName">
            <el-input v-model="form.companyName"></el-input>
          </el-form-item>
        </div>
        <div class="form-flex">
          <el-form-item label="地址" class="flex-item">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" class="flex-item" prop="contactWay">
            <el-input v-model="form.contactWay"></el-input>
          </el-form-item>
        </div>
        <div class="form-flex">
          <el-form-item label="邮箱" class="flex-item" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="传真" class="flex-item" prop="fax">
            <el-input v-model="form.fax"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="留言内容" class="flex-item" prop="content">
          <el-input :rows="4" v-model="form.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="submit-btn"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import telephone from "@/assets/img/chat-us/telephone.png";
import email from "@/assets/img/chat-us/email.png";
import icon4 from "@/assets/img/chat-us/icon4.png";
import icon5 from "@/assets/img/chat-us/icon5.png";

export default {
  data() {
    return {
      contactList: [
        {
          title: "联系电话",
          contactImg: telephone,
          contactText: "027-87180496[市场销售]",
          subText: "如有意见建议请在工作日9:00- 18:00致电我们",
        },
        {
          title: "手机",
          contactImg: telephone,
          contactText: "13277960367",
          subText: "如有意见建议请在工作日9:00- 18:00致电我们",
        },
        {
          title: "业务邮箱",
          contactImg: email,
          contactText: "info@huaraylaser.com",
          subText: "如有意见建议请发送邮件至我们的邮箱",
        },
      ],
      cardList: [
        {
          img: icon4,
          position: "华东",
          text: "武汉市东湖新技术开发区流芳园横路1号",
        },
        {
          img: icon5,
          position: "华东",
          text: "江苏省苏州市虎丘区漓江路56号长光华芯研发楼4楼",
        },
        {
          img: icon5,
          position: "华南",
          text: "广东省深圳市宝安区新玉路84号新桥深圳激光谷三楼302室",
        },
      ],
      form: {
        name: "",
        companyName: "",
        address: "",
        contactWay: "",
        email: "",
        fax: "",
        content: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          {
            min: 3,
            max: 50,
            message: "长度在 3 到 50 个字符",
            trigger: "blur",
          },
        ],
        contactWay: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur,change",
          },
        ],
        fax: [
          { required: false, message: "请输入传真号码", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 如果表单验证通过
          console.log("submit!");
          // 这里可以添加发送数据到服务器的代码
          // 例如使用 axios 发送 POST 请求
          // axios.post('/api/your-endpoint', this.form)
          //   .then(response => {
          //     // 处理响应
          //     console.log(response);
          //   })
          //   .catch(error => {
          //     // 处理错误
          //     console.error(error);
          //   });
        } else {
          // 如果表单验证失败
          console.log("表单验证失败");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.one-wrap {
  padding: 62px 260px 42px;
  .contact-list {
    display: flex;
    .contact-item {
      width: 468px;
      height: 360px;
      padding: 34px 0 34px 24px;
      background: #ffffff;
      border: 1px solid #dbdbdb;
      .title {
        font-weight: bold;
        font-size: 20px;
        color: #333333;
      }
      .img-wrap {
        width: 240px;
        height: 140px;
        margin-top: 9px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .contactText {
        margin-top: 29px;
        font-weight: bold;
        font-size: 18px;
        color: #333333;
        line-height: 28px;
      }
      .subText {
        margin-top: 45px;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
  }

  .card-list {
    margin-top: 41px;
    display: flex;
    gap: 33px;
    .card-item {
      width: 444px;
      height: 158px;
      padding: 25px 0 0 25px;
      background: #fff;
      color: #000;
      box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.11);
      border-radius: 8px 8px 8px 8px;
      .title-wrap {
        height: 26px;
        display: flex;
        gap: 14px;
        align-items: center;
        font-weight: bold;
        font-size: 20px;
        .icon-wrap {
          width: 19px;
          height: 20px;
        }
      }
      .sub-title {
        margin-top: 20px;
        font-size: 16px;
        line-height: 28px;
      }
    }
    .card-item-0 {
      background: linear-gradient(90deg, #466abc 0%, #27417c 100%);
      color: #ffffff;
    }
    .sub-title-1 {
      width: 370px;
    }
    .sub-title-2 {
      width: 339px;
    }
  }
}

.two-wrap {
  width: 100%;
  height: 649px;
  img {
    width: 100%;
    height: 100%;
  }
}

.form-wrap {
  width: 100%;
  height: 940px;
  padding: 125px 304px 98px 295px;
  background: url("../../assets/img/chat-us/form.png") no-repeat;
  background-size: 100% 100%;
  .form-title {
    margin-bottom: 82px;
    font-size: 36px;
    color: #333333;
    text-align: center;
  }
  .form-flex {
    display: flex;
    gap: 78px;
    .flex-item {
      flex: 1;
    }
  }
  .submit-btn {
    width: 187px;
    height: 56px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    background: #27417c;
    border-radius: 28px 28px 28px 28px;
    font-size: 18px;
    color: #ffffff;
    cursor: pointer;
  }
}
</style>
