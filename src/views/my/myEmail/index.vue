<template>
  <div class="page">
    <div class="main-title">
      <span>电子邮箱</span>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="title-box">
          <div class="left">
            <span>邮箱</span>
          </div>
          <div class="right">
            <span>操作</span>
          </div>
        </div>
        <div class="wrap-address">
          <div class="address-item" v-for="(item, index) in list_address" :key="index">
            <div class="top">
              <div>
                {{ item.name }}
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span v-if="item.is_default == 1" class="moren">默认邮箱</span>
              </div>
              <div class="right">
                <span class="action" v-if="item.is_default != 1"
                      @click="do_address_set_default(item)">设置为默认邮箱</span>
                <span class="action" @click="do_address_edit(item)">编辑</span>
                <span class="action" @click="do_address_delete(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="!list_address.length" description="尚未添加邮箱"></el-empty>
      </div>
      <div class="address-add" @click="do_address_add()">
        <img src="@/assets/img/my/address-add.png" alt="">
        <span class="add-text">新增邮箱</span>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="900px" center>
      <div class="modal-inner">
        <div class="item">
          <span class="text required">邮箱</span>
          <el-input clearable v-model="form.name" placeholder="请输入邮箱"></el-input>
        </div>
        <div class="item">
          <span class="text"></span>
          <el-switch v-model="form.is_default" :inactive-value="0" :active-value="1" active-color="#A66600"
                     inactive-color="#eeeeee">
          </el-switch>
          <span style="margin-left: 15px;">设置为默认邮箱</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="clearDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: "servicePage",
  data() {
    return {
      dialogVisible: false,
      form: {},
      pagination: {
        page: 1,
        limit: 100,
      },
      list_address: [],
    };
  },
  computed: {
    ...mapState(["defaultAvatar"]),
  },
  created() {
    this.setView();
  },
  methods: {
    setView() {
      this.$api({
        url: 'email_list',
        method: 'post',
        data: {
          ...this.pagination,
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data
          this.list_address = data;

        }
      })
    },
    do_address_add() {
      this.form = {}
      this.dialogVisible = true
    },
    do_address_edit(item) {
      this.dialogVisible = true;
      this.form = item;
    },
    do_address_delete(id) {
      this.$api({
        url: 'delete_email',
        method: 'post',
        data: {
          id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    //设置默认邮箱
    do_address_set_default(item) {
      this.$api({
        url: 'edit_email',
        method: 'post',
        data: {
          id: item.id,
          email: item.name,
          is_default: 1
        },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    clearDialog() {
      if (this.form.id) {
        this.$api({
          url: 'edit_email',
          method: 'post',
          data: {
            id: this.form.id,
            email: this.form.name,
            is_default: this.form.is_default
          },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
            this.dialogVisible = false
          }
        });
      } else {
        this.$api({
          url: 'edit_email',
          method: 'post',
          data: {
            email: this.form.name,
            is_default: this.form.is_default
          },
        }).then((res) => {
          if (res.code == 200) {
            this.setView();
            this.dialogVisible = false
          }
        });
      }
    }
  },
};
</script>

<style scoped lang="less">
.page {
  padding: 0;

  .main-title {
    .flex-between();
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    border-bottom: 1px solid #E8E8E8;
  }

  .page-ctx {
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.address-add {
  cursor: pointer;
  .flex();
  justify-content: center;
  height: 30px;
  line-height: 30px;
  background: #fff;
  color: #818181;
  font-size: 14px;
  margin-top: 50px;

  img {
    width: 27px;
  }

  .el-icon-circle-plus {
    font-size: 18px;
  }

  .add-text {
    margin-left: 5px;
  }
}

.title-box {
  height: 48px;
  background: #F6F6F6;
  display: flex;
  justify-content: space-between;
  padding: 0 30px 0 20px;
  line-height: 48px;

  font-weight: 400;
  font-size: 14px;
  color: #333333;

  .left {
    span {
      display: inline-block;
      width: 150px;
    }
  }

}

// 邮箱列表
.wrap-address {
  text-align: left;

  .address-item {
    background: #ffffff;
    border-bottom: 1px solid #e5e5e5;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top {
      display: flex;

      > div {
        width: 150px;
        color: #5B5B5B;

        &:last-child {
          margin-bottom: 0;
        }

        span {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #666666;
        }
      }
    }

    .bottom {
      .flex-between();

      .left {
        .moren {
          display: inline-block;
          text-align: center;
          font-size: 14px;
          color: #00479D;

          width: 92px;
          height: 27px;
          line-height: 27px;
          background: #FFFFFF;
          border-radius: 14px;
          border: 1px solid #00479D;
        }
      }

      .right {
        padding-right: 14px;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: @theme;

        .action {
          margin-left: 15px;
          cursor: pointer;
        }
      }
    }
  }
}

.modal-inner {
  .item {
    margin-bottom: 20px;
    .flex();

    .text {
      width: 100px;
      text-align: right;
      padding-right: 10px;

      &.required {
        &::before {
          margin-right: 3px;
          content: '*';
          font-family: OPPOSans, OPPOSans;
          font-weight: 400;
          font-size: 14px;
          color: #FF0000;
        }
      }
    }

    .default-text {
      margin-left: 20px;
    }

    .el-select {
      width: 100%;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
    }
  }
}
</style>
