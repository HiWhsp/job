<template>
  <div class="page">
    <div class="section-box">
      <div class="section-1">
        <div class="left">
          <div class="img-box">
            <div>
              <img src="@/assets/img/my/avatar.png" alt/>
            </div>
            <div class="name">
              {{ my_info.nickname || "郭菲菲" }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="text-1">{{ my_info.phone || "15931263145" }}</div>
          <div class="text-2">
            <span>{{ my_info.levelTitle || "普通会员" }}</span>
          </div>
        </div>
      </div>

      <div class="section-2">
        <div class="list">
          <div class="item" @click="$router.push('/order-list?order_status=1')">
            <div class="val">
              <span>{{ my_info.orderNum || "0" }}</span>
            </div>
            <div class="label">今日寄样</div>
          </div>
          <div class="item" @click="$router.push('/order-list?order_status=1')">
            <div class="val">
              <span>{{ user_index.order_num_1 || "0" }}</span>
            </div>
            <div class="label">待实验</div>
          </div>
          <div class="item" @click="$router.push('/order-list?order_status=3')">
            <div class="val">
              <span>{{ user_index.order_num_3 || "0" }}</span>
            </div>
            <div class="label">即将超期</div>
          </div>
          <div class="item" @click="$router.push('/order-list?order_status=4')">
            <div class="val">
              <span>{{ user_index.order_num_3 || "0" }}</span>
            </div>
            <div class="label">待回收</div>
          </div>
        </div>
      </div>
    </div>

    <div class="money-box">
      <div class="item">
        <div class="info">
          <span class="tit">待结算金额</span>
          <span class="val">2000.00</span>
        </div>
        <div class="box">
          <p>申请结算</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">已结算金额</span>
          <span class="val">2000.00</span>
        </div>
        <div class="box">
          <p>查看详情</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">可结算订单</span>
          <span class="val">20</span>
        </div>
        <div class="box">
          <p>申请结算</p>
        </div>
      </div>
      <div class="item">
        <div class="info">
          <span class="tit">当月好评率</span>
          <span class="val">90%</span>
        </div>
        <div class="box">
          <p>当月差评率 <span>0%</span></p>
          <p><span>查看详情</span></p>
        </div>
      </div>
    </div>

    <div class="section-order">
      <div class="section-title">
        <div class="label">消息中心</div>
        <router-link to="/order-list" class="action">
          <span>查看更多</span>
          <img src="@/assets/img/supplier/more.png" alt/>
        </router-link>
      </div>

      <div class="order-box">
        <div class="empty-info" v-if="!list_order.length">
          <div class="empty-img">
            <img src="@/assets/img/my/empty-img.png" alt=""/>
          </div>
          <div class="empty-text">暂无消息</div>
        </div>
        <div class="order-info" v-else>
          <div class="info-item" v-for="(item, index) in list_order" :key="index">
            <span>这里是消息标题这里是消息标题这里是消息标题</span>
            <span class="date">{{ item.createdTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="900px" center>
      <span class="title">立即申请成为嘉析检测的合作伙伴</span>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1"
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "home",
  data() {
    return {
      pagination: {
        page: "1",
        pageNum: "8",
      },
      count: 0,

      my_info: {},
      user_index: {}, //用户首页数据
      list_order: [],
      list_goods: [],

      uploadImg: "",
      youhui_code: "",
      youhui_msg: "",
      dialogVisible: true,

      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        region: [
          {required: true, message: '请选择活动区域', trigger: 'change'}
        ],
        date1: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date2: [
          {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
        ],
        type: [
          {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
        ],
        resource: [
          {required: true, message: '请选择活动资源', trigger: 'change'}
        ],
        desc: [
          {required: true, message: '请填写活动形式', trigger: 'blur'}
        ]
      }
    };
  },
  computed: {},
  created() {
    this.setView();
  },
  methods: {
    emitConfirm() {
      this.query_order();
    },

    setView() {
      this.query_user();
      this.query_userIndex();
      this.query_order();
      this.query_goods();
    },
    //
    query_user() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_userInfo",
        },
      }).then((res) => {
        if (res.code == 200) {
          this.my_info = res.data;
        }
      });
    },
    //用户主页数据
    query_userIndex() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "users_index",
        },
      }).then((res) => {
        let {code, data} = res;
        if (res.code == 200) {
          this.user_index = res.data;
        }
      });
    },
    //订单查询
    query_order() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "orders_lists",
          page: 1,
          pageNum: 2,
          scene: 0,
        },
      }).then((res) => {
        let {code, data} = res;
        if (code == 200) {
          this.list_order = data.list;
        }
      });
    },
    //商品信息
    query_goods() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          ifShowSku: 1,
          ...this.pagination,
        },
      }).then((res) => {
        let {code, data, count} = res;
        if (code == 200) {
          let {list, count, pages} = data;
          this.list_goods = list;
          this.count = count;
        }
      });
    },

    changeSugges() {
      if (this.count > this.pagination.pageNum * this.pagination.page) {
        this.pagination.page++;
        this.query_goods();
      } else {
        alertErr("没有更多了...");
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
};
</script>

<style scoped lang="less">

.section-box {
  .flex();
}

.section-1 {
  .flex-center();
  position: relative;
  background: #ffffff url("~@/assets/img/supplier/user-bg.png");
  background-size: 100% 100%;
  padding: 0 15px;
  width: 256px;
  height: 210px;

  .left {
    height: calc(100% - 48px);

    .img-box {
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .name {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .right {
    .flex-between();
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    background: #ffffff;
    text-align: left;
    padding: 0 15px;
    border: 1px solid @theme;
    border-radius: 0 0 11px 11px;

    .text-1 {
      font-size: 14px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      color: #333333;
    }

    .text-2 {
      .flex();

      img {
        width: 24px;
        margin-right: 5px;
      }

      span {
        font-size: 14px;
        font-family: Roboto, Roboto;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}

.section-2 {
  flex: 1;

  .list {
    .flex-between();
    height: 185px;
    background: #ffffff;
    border: 1px solid #eee9e4;

    .item {
      text-align: center;
      width: 25%;
      padding: 10px 0;
      border-right: 1px solid #d5d8de;
      // margin-left: 40px;
      // margin-right: 40px;
      font-size: 16px;
      cursor: pointer;

      &:last-child {
        border-right: none;
      }

      .label {
        margin-top: 20px;
        font-size: 16px;
        font-family: Roboto, Roboto;
        font-weight: normal;
        color: #333333;
      }

      .val {
        span {
          // margin-left: 5px;
          font-size: 32px;
          font-family: Roboto, Roboto;
          font-weight: normal;
          color: @theme;
        }
      }
    }
  }
}

.money-box {
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
  margin-bottom: 30px;

  .item {
    width: 340px;
    height: 130px;
    background: #FFFFFF;
    border-radius: 7px 7px 7px 7px;
    border: 1px solid #D6D6D6;

    .info {
      padding-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #D6D6D6;
      height: 100px;

      .tit {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }

      .val {
        margin-top: 5px;
        font-weight: bold;
        font-size: 23px;
        color: #00479D;
      }
    }

    .box {
      padding-left: 30px;
      line-height: 30px;
      height: 30px;
    }
  }
}

.page {
  width: 100%;
  margin: 0;
  padding: 50px 130px;
}

.section-title {
  border-bottom: 1px solid #dedede;
  .flex-between();
  height: 56px;
  padding: 0 32px;

  .label {
    font-size: 18px;
    font-family: Roboto, Roboto;
    font-weight: 400;
    color: #333333;
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

.section-order {
  margin: 25px 0;
  background: #fff;
  border: 1px solid #D6D6D6;
  border-radius: 8px;

  .order-box {
    padding: 0 105px;

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

      .empty-action {
        font-size: 14px;
        color: @theme;
      }
    }
  }

  .order-info {
    padding: 20px 0;

    .info-item {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #D6D6D6;
      display: flex;
      justify-content: space-between;

      span {
        width: 500px;
        font-weight: 400;
        font-size: 18px;
        color: #333333;
        cursor: pointer;

        &:hover {
          color: @theme;
        }
      }

      .date {
        width: 128px;
        font-weight: 400;
        font-size: 14px;
        color: #7E7E7E;
      }
    }
  }
}

.suggest-goods {
  background: #fff;

  .list-wrap {
    padding: 40px 30px;
  }

  /deep/ .product-list {
    .product-item {
      // margin-right: 23px;

      &:nth-child(4n) {
        // margin-right: 0;
      }

      &:nth-child(5) {
        // margin-top: 50px;
      }
    }
  }
}
</style>
