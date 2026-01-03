<template>
  <div class="page">
    <div class="main-title flex">
      <img src="@img/my/nav-4.png" alt="" />
      <span>收货地址管理</span>
    </div>

    <div class="page-ctx">
      <p style="display: flex;justify-content: flex-end;">
        <button @click="do_address_add()" class="btn-c">
          <!-- <img src="@img/address-add.png" alt="" /> -->
          <i class="el-icon-circle-plus"></i>
          <span class="add-text">添加收货地址</span>
        </button>
      </p>

      <div class="center">
        <div class="address-table">
          <!-- 表头 -->
          <div class="table-header">
            <div class="header-cell">收货人</div>
            <div class="header-cell">电话/手机</div>
            <div class="header-cell">所在地区</div>
            <div class="header-cell">详细地址</div>
            <div class="header-cell">操作</div>
            <div class="header-cell">设置</div>
          </div>

          <!-- 表格内容 -->
          <div class="table-body">
            <div
              class="table-row"
              v-for="(item, index) in list_address"
              :key="index"
            >
              <div class="table-cell">{{ item.name }}</div>
              <div class="table-cell">{{ item.phone }}</div>
              <div class="table-cell">{{ item.full_addr }}</div>
              <div class="table-cell">{{ item.address }}</div>
              <div class="table-cell">
                <span class="action-link" @click="do_address_edit(item)"
                  >修改</span
                >
                <span
                  class="action-link delete"
                  @click="do_address_delete(item.id)"
                  >删除</span
                >
              </div>
              <div class="table-cell">
                <span v-if="item.moren == 1" class="default-btn">默认地址</span>
                <span
                  v-else
                  class="action-link"
                  @click="do_address_set_default(item.id)"
                  >设为默认地址</span
                >
              </div>
            </div>
          </div>
        </div>

        <el-empty
          v-if="!list_address.length"
          description="尚未添加地址"
        ></el-empty>
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
      list_address: [],

      activeMenu: "address", // 当前选中的菜单
      addresses: [
        {
          receiver: "张三",
          region: "北京市海淀区直辖市",
          detailAddress: "中央村东路*********",
          phone: "15931263145",
        },
        {
          receiver: "李四",
          region: "上海市浦东新区直辖市",
          detailAddress: "浦东大道*********",
          phone: "13800138000",
        },
      ],
      activeMenuMap: {
        personal: "个人中心",
        address: "地址管理",
        order: "订单管理",
        "after-sale": "我的售后",
        activity: "我的活动",
        favorite: "我的收藏",
        history: "浏览记录",
      },
    };
  },
  computed: {
    ...mapState([""]),
  },
  created() {
    this.setView();
  },
  methods: {
    setDefaultAddress(index) {
      console.log("设置为默认地址:", index);
    },
    editAddress(index) {
      console.log("编辑地址:", index);
    },
    deleteAddress(index) {
      this.addresses.splice(index, 1);
    },

    setView() {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_lists",
          ...this.pagination,
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;

          data.forEach((v) => {
            v.full_addr = [v.country, v.province, v.city, v.area]
              .filter((v) => !!v)
              .join("-");
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
      });
    },
    do_address_add() {
      this.$refs.address_modal.init();
    },
    do_address_edit(item) {
      this.$refs.address_modal.init(item);
    },
    do_address_delete(id) {
      this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_delete",
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
        url: "/service.php",
        method: "get",
        data: {
          action: "userAddress_setDefault",
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
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 56px;
    line-height: 56px;
    background: #ffffff;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    img {
      width: 22px;
      margin-right: 10px;
    }
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
    .btn-c {
      display: flex;
      align-items: center;
      min-width: 96px;
      height: 30px;
      line-height: 30px; 
      color: #fff;
      background: #fff;
      color: #7853b2;
      font-size: 14px;
      margin-bottom: 25px;
     border: 1px solid #7853B2;
     padding: 10px 16px;
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
}

// 地址表格
.address-table {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;

  .table-header {
    display: flex;
    background: #f9f9f9;
    border-bottom: 1px solid #e5e5e5;

    .header-cell {
      flex: 1;
      padding: 16px 12px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      text-align: left;
      // border-right: 1px solid #e5e5e5;

      &:last-child {
        border-right: none;
      }

      &:nth-child(1) {
        flex: 0 0 120px;
      } // 收货人
      &:nth-child(2) {
        flex: 0 0 140px;
      } // 电话/手机
      &:nth-child(3) {
        flex: 0 0 180px;
      } // 所在地区
      &:nth-child(4) {
        flex: 1;
      } // 详细地址
      &:nth-child(5) {
        flex: 0 0 120px;
      } // 操作
      &:nth-child(6) {
        flex: 0 0 140px;
      } // 设置
    }
  }

  .table-body {
    .table-row {
      display: flex;
      border-bottom: 1px solid #e5e5e5;

      &:last-child {
        border-bottom: none;
      }

      .table-cell {
        flex: 1;
        padding: 16px 12px;
        font-size: 14px;
        color: #333333;
        text-align: left;
        // border-right: 1px solid #e5e5e5;
        line-height: 1.4;
        word-break: break-all;

        &:last-child {
          border-right: none;
        }

        &:nth-child(1) {
          flex: 0 0 120px;
        } // 收货人
        &:nth-child(2) {
          flex: 0 0 140px;
        } // 电话/手机
        &:nth-child(3) {
          flex: 0 0 180px;
        } // 所在地区
        &:nth-child(4) {
          flex: 1;
        } // 详细地址
        &:nth-child(5) {
          flex: 0 0 120px;
        } // 操作
        &:nth-child(6) {
          flex: 0 0 140px;
        } // 设置

        .action-link {
          color: #7853b2;
          cursor: pointer;
          margin-right: 12px;
          font-size: 14px;

          &:last-child {
            margin-right: 0;
          }

          &.delete {
            color: #1F1F1F;
          }

          &:hover {
            text-decoration: underline;
          }
        }

        .default-btn {
          display: inline-block;
          padding: 4px 12px;
          background: #7853b2;
          color: #ffffff;
          font-size: 12px;
          border-radius: 4px;
          text-align: center;
        }
      }
    }
  }
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
