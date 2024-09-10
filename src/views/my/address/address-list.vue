<template>
  <div class="page">
    <div class="main-title">
      <span>收货地址</span>
      <button @click="do_address_add()">
        <i class="el-icon-circle-plus"></i>
        <span class="add-text">添加收货地址</span>
      </button>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="wrap-address">
          <div class="address-item" v-for="(item, index) in list_address" :key="index">
            <div class="top">
              <div>
                <span>收货人：</span>
                {{ item.name }}
              </div>
              <div>
                <span>所在地区：</span>
                {{ item.full_addr }}
              </div>
              <div>
                <span>详细地址：</span>
                {{ item.address }}
              </div>
              <div>
                <span>手机号码：</span>
                {{ item.phone }}
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span v-if="item.moren == 1" class="moren">默认地址</span>
              </div>
              <div class="right">
                <span class="action" v-if="item.moren != 1" @click="do_address_set_default(item.id)">设为默认</span>
                <span class="action" @click="do_address_edit(item)">编辑</span>
                <span class="action" @click="do_address_delete(item.id)">删除</span>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!list_address.length" description="尚未添加地址"></el-empty>
      </div>
    </div>

    <address_modal ref="address_modal" @confirm="setView" />
  </div>
</template>

<script>
import address_modal from "@/components/address/address_modal.vue"; //新增地址

import { mapState } from "vuex";
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
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;

    button {
      .flex();
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: #A66600;
      color: #fff;
      background: #fff;
      color: #A66600;
      font-size: 14px;
      // font-weight: bold;

      img {
        width: 20px;
      }

      .el-icon-circle-plus {
        font-size: 18px;
      }
      .add-text {
        margin-left: 5px;
      }
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

// 地址列表
.wrap-address {
  text-align: left;

  .address-item {
    min-height: 190px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    padding: 20px;
    margin-bottom: 20px;

    .top {
      padding-bottom: 20px;

      >div {
        margin-bottom: 10px;
        color: #333333;

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
      border-top: 1px solid #eeeeee;
      padding-top: 20px;

      .left {
        .moren {
          display: inline-block;
          width: 104px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          // background: rgba(255, 90, 0, 0.68);
          background: #A66600;
          font-size: 14px;
          color: #ffffff;
        }
      }

      .right {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 20px;
        color: #A66600;

        .action {
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
