<template>
  <div class="page">
    <div class="title">收货地址</div>
    <div class="main-title">
      <p><span>保存的收获地址</span><span>您已经创建了{{ list_address.length }}个地址</span></p>
      <button @click="do_address_add()">
        <span class="add-text">添加收货地址</span>
      </button>
    </div>

    <div class="page-ctx">
      <div class="center">
        <div class="address-list">
          <div v-for="(item, index) in list_address" :key="index" class="address-item">
            <div class="address-top">{{ item.lastName || item.firstName }}</div>
            <div class="address-bottom">
              {{ item.full_addr }}
            </div>
            <div class="address-phone">
              <span>{{ item.phone }}</span>
              <div class="edit" @click="do_address_edit(item)">修改</div>
            </div>
            <img alt="" class="marker" src="@/static/order/addr-select.png"/>
            <div v-if="item.moren" class="moren">默认地址</div>
          </div>
        </div>

        <el-empty v-if="!list_address.length" description="尚未添加地址"></el-empty>
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

<style lang="less" scoped>
.page {
  text-align: left;
  padding-bottom: 80px;

  .title {
    width: 64px;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    margin-bottom: 15px;
  }

  .main-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 52px;
    line-height: 52px;
    background: #FFFFFF;
    border: 1px solid rgba(29, 32, 136, 0.2);

    font-weight: 400;
    font-size: 14px;
    color: #2C3E50;

    p {
      span {
        margin-right: 20px;
      }
    }

    button {
      width: 124px;
      height: 30px;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 96px;
      line-height: 30px;
      color: #fff;
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
    padding: 17px;
    border: 1px solid #E5E5E5;
    border-top: none;
  }
}

// 地址列表
.address-list {
  display: flex;
  flex-wrap: wrap;
  height: 220px;
  overflow: auto;

  .address-item {
    position: relative;
    margin-bottom: 20px;
    margin-right: 30px;
    width: 376px;
    height: 192px;
    background-color: #F8F8F8;
    border: 1px solid #D2D2D2;
    overflow: hidden;
    cursor: pointer;

    &:nth-child(2n) {
      margin-right: 0;
    }

    &:nth-child(-n + 2) {
      margin-top: 0;
    }

    &.active {
      .marker {
        display: block;
      }
    }

    .marker {
      position: absolute;
      right: -1px;
      bottom: -1px;
      display: none;
      width: 42px;
      height: 38px;
    }

    .address-top {
      border-bottom: 1px dashed #D2D2D2;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #3D3D3D;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      display: flex;
    }

    .address-bottom {
      flex: 1;
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #3D3D3D;
      height: 90px;
      padding: 0 20px;
      display: flex;
      align-items: center;
    }

    .address-phone {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px dashed #D2D2D2;
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
      font-weight: 400;
      font-size: 14px;
      color: #3D3D3D;

      .edit {
        width: 88px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #FFFFFF;
        color: #000;
        font-size: 14px;
        border: 1px solid #000000;
      }
    }

    .moren {
      width: 88px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #000000;
      color: #fff;
      position: absolute;
      top: 0;
      right: 10px;
    }
  }
}
</style>

<style lang="less" scoped src="@/assets/h5css/user/address-list.less"></style>
