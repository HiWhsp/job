<template>
  <div class="page">
    <div class="main-title">
      <span>地址管理</span>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="title-box">
          <div class="left">
            <span>收件人姓名</span>
            <span>电话号码</span>
            <span>地址</span>
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
              <div>
                {{ item.phone }}
              </div>
              <div class="ellipsis-1">
                {{ item.full_addr }}{{ item.address }}
              </div>


            </div>
            <div class="bottom">
              <div class="left">
                <span v-if="item.moren == 1" class="moren">默认地址</span>
              </div>
              <div class="right">
                <span class="action" v-if="item.moren != 1"
                      @click="do_address_set_default(item.id)">设置为默认地址</span>
                <span class="action" @click="do_address_edit(item)">编辑</span>
                <span class="action" @click="do_address_delete(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-if="!list_address.length" description="尚未添加地址"></el-empty>
      </div>
      <div class="address-add" @click="do_address_add()">
        <img src="@/assets/img/my/address-add.png" alt="">
        <span class="add-text">新增地址</span>
      </div>
    </div>

    <address_modal ref="address_modal" @confirm="setView"/>
  </div>
</template>

<script>
import address_modal from "@/components/address/address_modal.vue"; //新增地址

import {mapState} from "vuex";

export default {
  name: "servicePage",
  components: {
    address_modal,
  },
  data() {
    return {
      pagination: {
        page: 1,
        pageNum: 100,
      },
      list_address: [1],
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
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_lists',
          ...this.pagination,
        },
      }).then(res => {
        if (res.code == 200) {
          let data = res.data

          data.forEach((v) => {
            v.full_addr = [v.country, v.province, v.city, v.area].filter(v => !!v).join('-');
            // v.selected =  v.if_default
          });

          this.list_address = data;

          let obj = data.find((v) => v.if_default) || {};
          this.select_address = obj || {};

          this.$store.commit("set_vuex_data", {
            key: "default_address",
            val: obj,
          });
        }
      })

    },
    do_address_add() {
      this.$refs.address_modal.init();
    },
    do_address_edit(item) {
      this.$refs.address_modal.init(item);
    },
    do_address_delete(id) {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_delete',
          id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
    //设置默认地址
    do_address_set_default(id) {
      this.$api({
        url: '/service.php',
        method: 'get',
        data: {
          action: 'userAddress_setDefault',
          id: id,
        },
      }).then((res) => {
        if (res.code == 200) {
          this.setView();
        }
      });
    },
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

// 地址列表
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
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
