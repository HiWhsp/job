<template>
  <div class="page">
    <div class="main-title flex">
      <span>MY ADDRESS</span>
    </div>

    <div class="page-ctx">
      <div class="address-toolbar">
        <button @click="do_address_add()" class="btn-add">
          <i class="el-icon-circle-plus"></i>
          <span class="add-text">ADD NEW ADDRESS</span>
        </button>
      </div>

      <div class="center">
        <div class="address-list" v-if="list_address.length">
          <div class="address-card" v-for="(item, index) in list_address" :key="index">
            <div class="card-main">
              <div class="kv">
                <div class="k">Name:</div>
                <div class="v">{{ item.firstName }} {{ item.lastName }}</div>
              </div>
              <div class="kv">
                <div class="k">Location:</div>
                <div class="v">{{ item.full_addr }}</div>
              </div>
              <div class="kv">
                <div class="k">Detailed Address:</div>
                <div class="v">{{ item.address }}</div>
              </div>
              <div class="kv">
                <div class="k">Phone Number:</div>
                <div class="v">{{ item.phone }}</div>
              </div>
              <div class="kv">
                <div class="k">Email:</div>
                <div class="v">{{ item.email }}</div>
              </div>
            </div>

            <div class="card-actions">
              <div class="actions-left">
                <button
                  v-if="item.moren == 1 || item.if_default"
                  class="btn-default"
                  disabled
                >DEFAULT ADDRESS</button>
                <!-- <span
                  v-else
                  class="action-link set-default"
                  @click="do_address_set_default(item.id)"
                >Set as default</span>-->
              </div>
              <div class="actions-right">
                <span class="action-link edit" @click="do_address_edit(item)">Edit</span>
                <span class="action-link delete" @click="do_address_delete(item.id)">Delete</span>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="!list_address.length" description="No address added"></el-empty>
      </div>
    </div>

    <address_modal ref="address_modal" @confirm="setView" />
  </div>
</template>

<script>
import address_modal from "./foreign-address-list.vue"; //新增地址

import { mapState } from "vuex";
export default {
  name: "servicePage",
  components: {
    address_modal
  },
  data() {
    return {
      pagination: {
        page: 1,
        pageNum: 100
      },
      list_address: [],

      activeMenu: "address", // 当前选中的菜单
      addresses: [
        {
          receiver: "张三",
          region: "北京市海淀区直辖市",
          detailAddress: "中央村东路*********",
          phone: "15931263145"
        },
        {
          receiver: "李四",
          region: "上海市浦东新区直辖市",
          detailAddress: "浦东大道*********",
          phone: "13800138000"
        }
      ],
      activeMenuMap: {
        personal: "个人中心",
        address: "地址管理",
        order: "订单管理",
        "after-sale": "我的售后",
        activity: "我的活动",
        favorite: "我的收藏",
        history: "浏览记录"
      }
    };
  },
  computed: {
    ...mapState([""])
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
          ...this.pagination
        }
      }).then(res => {
        if (res.code == 200) {
          let data = res.data;

          data.forEach(v => {
            v.full_addr = [v.country, v.state, v.city]
              .filter(v => !!v)
              .join("-");
            // v.selected =  v.if_default
          });

          this.list_address = data;

          let obj = data.find(v => v.moren) || {};
          this.select_address = obj || {};

          this.$store.commit("set_vuex_data", {
            key: "default_address",
            val: obj
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
          id: id
        }
      }).then(res => {
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
          id: id
        }
      }).then(res => {
        if (res.code == 200) {
          this.setView();
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.page {
  text-align: left;
  padding-bottom: 80px;

  .main-title {
    padding: 0 32px;
    text-align: left;
    height: 70px;
    line-height: 70px;
    background: #ffffff;
    font-size: 20px;
    font-family: Poppins, Poppins;
    font-weight: bold;
    color: #333333;
  }

  .page-ctx {
    margin-top: 24px;
    padding: 32px 32px 55px 32px;
    background: #fff;
  }
}

.address-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 18px;

  .btn-add {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 14px;
    border-radius: 4px;
    border: none;
    background: #ec6a2b;
    color: #fff;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }

    .el-icon-circle-plus {
      font-size: 16px;
    }
  }
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.address-card {
  border: 1px solid #e5e5e5;
  background: #fff;
  padding: 22px 24px 18px;
}

.card-main {
  max-width: 760px;
  padding-left: 8px;
}

.kv {
  display: flex;
  gap: 18px;
  line-height: 24px;
  font-size: 12px;
  color: #1e262e;

  .k {
    width: 180px;
    text-align: right;
    color: #5e5e5e;
    font-size: 20px;
    margin-bottom: 16px;
  }

  .v {
    flex: 1;
    word-break: break-word;
    font-size: 20px;
    color: #1E262E;
  }
}

.card-actions {
  margin-top: 18px;
  border-top: 1px solid #f0f0f0;
  padding-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.actions-right {
  display: flex;
  gap: 22px;
  font-size: 12px;
}

.action-link {
  font-size: 20px;
  cursor: pointer;
  color: #1E262E;
  font-weight: 400;

  &:hover {
    text-decoration: underline;
  }

  &.delete {
    color: #ec6a2b;
  }
}

.btn-default {
  height: 52px;
  padding: 14px;
  border-radius: 3px;
  border: none;
  background: #00306b;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.set-default {
  color: #00306b;
  font-weight: 600;
  font-size: 20px;
}
</style>

<style scoped lang="less" src="@/assets/h5css/user/address-list.less"></style>
<style scoped lang="less" src="@/assets/h5css/page/shipei3.less"></style>
