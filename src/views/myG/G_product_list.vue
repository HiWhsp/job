<script>
export default {
  name: "G_product_list",
  data() {
    return {
      material_type_id: "",
      list_shopcart: [],
      checked_all: false, //是否全选
    }
  },
  computed: {
    //购物车被选择的商品
    list_shopcart_checked() {
      return this.list_shopcart.filter((v) => v.checked);
    }
  },
  watch: {
    vuexFlatCates() {
      this.material_type_id = this.vuexFlatCates[0].id;
    }
  },
  mounted() {
    this.material_type_id = this.vuexFlatCates[0] ? this.vuexFlatCates[0].id : '';
    setTimeout(() => {
      this.setView();
    }, 500)
  },
  methods: {
    setView() {
      this.$api({
        url: 'supplyProductPage',
        method: 'post',
        data: {
          supply_user_id: this.baseInfo.id,
          material_type_id: this.material_type_id ? this.material_type_id : this.vuexFlatCates[0].id
        }
      }).then(res => {
        if (res.code == 200) {
          this.list_shopcart = res.data.material_list.map(it => {
            it.checked = false;
            return it
          })
          this.checked_all = false
        }
      })
    },
    //商品勾选 单项选择
    on_change_checked_item() {
      // //console.log('监视单项选择', item)
      let checkLength = this.list_shopcart_checked.length;
      if (checkLength == this.list_shopcart.length) {
        this.checked_all = true;
      } else {
        this.checked_all = false;
      }
    },
    //商品勾选 全选与取消
    on_change_checked_all(val) {
      //console.log("更新后的值", val);
      this.list_shopcart.forEach((v) => {
        v.checked = val;
      });
    },
    // 批量删除
    do_prod_remove_select() {
      const list = [];
      if (this.list_shopcart_checked.length) {
        this.list_shopcart_checked.forEach((v) => {
          list.push(v.id);
        });
      } else {
        this.$message.warning('请选择要删除的商品');
        return;
      }
      this.$api({
        url: 'batchDel',
        method: 'post',
        data: {
          ids: list.join(',')
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.setView();
        }
      })
    },
    // 批量上架下架
    do_prod_xiajia_select(type) {
      const list = [];
      if (this.list_shopcart_checked.length) {
        this.list_shopcart_checked.forEach((v) => {
          list.push(v.id);
        });
      } else {
        this.$message.warning(type == 1 ? '请选择要上架的商品' : '请选择要下架的商品');
        return;
      }
      this.$api({
        url: 'batchShangXiajia',
        method: 'post',
        data: {
          ids: list.join(','),
          type
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.setView();
        }
      })
    },
    do_shangjia(item, type) {
      if (type == 1) {
        this.$message.warning('该商品已上架');
      } else {
        const list = [];
        list.push(item.id);
        this.$api({
          url: 'batchShangXiajia',
          method: 'post',
          data: {
            ids: list.join(','),
            type: 1
          }
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.setView();
          }
        })
      }
    },
    // 下架
    do_xiajia(item, type) {
      if (type == 2) {
        this.$message.warning('该商品已下架');
      } else {
        const list = [];
        list.push(item.id);
        this.$api({
          url: 'batchShangXiajia',
          method: 'post',
          data: {
            ids: list.join(','),
            type: 2
          }
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.setView();
          }
        })
      }
    },
    // 编辑
    do_edit() {

    },
    // 删除
    do_remove(item) {
      this.$api({
        url: 'batchDel',
        method: 'post',
        data: {
          ids: item.id
        }
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.setView();
        }
      })
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="main-title">
      <span>商品管理</span>
    </div>
    <div class="page-ctx">
      <div class="filter_list">
        <el-select v-model="material_type_id" placeholder="请选择" @change="setView">
          <el-option v-for="item in vuexFlatCates" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="list-title">
        <div class="all-select">
          <el-checkbox v-model="checked_all" @change="on_change_checked_all">{{
              checked_all ? "反选" : "全选"
            }}
          </el-checkbox>
        </div>
        <div class="delete-box">
          <span @click="do_prod_remove_select()">批量删除</span>
          <span @click="do_prod_xiajia_select(1)">批量上架</span>
          <span @click="do_prod_xiajia_select(2)">批量下架</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-for="(item, index) in list_shopcart" :key="index" class="item">
        <div class="item-detail flex">
          <div class="box-select">
            <el-checkbox v-model="item.checked" @change="on_change_checked_item"></el-checkbox>
          </div>

          <div class="box-image cover flex">
            <el-image :src="item.images_url">
              <div slot="error" class="image-slot">
                <img :src="item.images_url"/>
              </div>
            </el-image>
          </div>
          <div class="box-title">
            <div class="goods-title">{{ item.name }}</div>
            <div class="goods-sku">规格：{{ item.guige }}</div>
          </div>
          <div class="box-act">
            <div class="goods-action-box">
              <div :class="'status_' + item.approve_status" class="collect-no">
                {{ item.approve_status == 1 ? '审核通过' : '审核不通过' }}
              </div>
              <div :class="'text_' + item.is_shangjia" class="collect-no" @click="do_shangjia(item, item.is_shangjia)">
                {{ item.is_shangjia == 1 ? '已上架' : '下架' }}
              </div>
              <div :class="'textA_' + item.is_shangjia" class="collect-no" @click="do_xiajia(item, item.is_shangjia)">
                {{ item.is_shangjia == 2 ? '已下架' : '下架' }}
              </div>
              <div class="collect-no" @click="do_edit(item)">
                编辑
              </div>
              <div class="collect-no" @click="do_remove(item)">
                删除
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-empty v-if="!list_shopcart.length" description="暂无数据..."></el-empty>
    </div>
  </div>
</template>

<style lang="less" scoped>
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
    font-family: Roboto, Roboto-Bold, Roboto, Roboto;
    font-weight: bold;
    color: #333333;

    button {
      min-width: 96px;
      height: 30px;
      line-height: 30px;
      background: @theme;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
  }
}

.page-ctx {
  margin-top: 10px;
  padding: 24px 32px;
  background: #fff;
}

.filter_list {
  margin-bottom: 20px;
}

.list-title {
  background: #E9E9E9;
  color: #666;
  padding: 11px 20px;
  font-size: 14px;
  .flex();

  .all-select {
    margin-right: 30px;

  }

  .delete-box {
    cursor: pointer;
    color: #666;

    span {
      margin-right: 20px;
    }
  }

}

.item {
  border-bottom: 1px solid #eee;
  padding: 0 20px;

  &:last-child {
    border-bottom: none;
  }

  .item-title {
    .flex();
    text-align: left;
    padding: 12px 40px;
    border-bottom: 1px solid #eee;

    font-family: Arial, Arial;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }

  .item-detail {
    padding: 15px 0;
    font-family: OPPOSans, OPPOSans;
    // font-weight: bold;
    font-size: 14px;
    color: #666666;


    .box-select {
      width: 50px;
      width: 50px;

      /deep/ .el-checkbox__inner {
        border-color: @theme !important;
      }

      /deep/ .is-checked .el-checkbox__inner {
        background: @theme !important;
        border-color: @theme !important;
      }
    }

    .box-image {
      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        cursor: pointer;
      }

      /deep/ img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        cursor: pointer;
      }
    }

    .box-title {
      flex: 2;
      text-align: left;

      div {
        &:hover {
          color: @theme;
        }
      }

      .goods-title {
        width: fit-content;
        cursor: pointer;
        // height: 40px;
        .ellipsis-2();
        color: #333;

      }

      .sku-info {
        width: fit-content;
        cursor: pointer;
        margin-top: 10px;
        color: #77797B;
      }
    }

    .box-sku {
      width: 200px;
    }

    .box-unit-price {
      width: 150px;
      color: #0B0B0B;
    }

    .box-number {
      width: 150px;
      .flex-center();

      input {
        width: 48px;
        height: 30px;
        border: 1px solid #d5d8de;
        text-align: center;
        border-left: 0;
        border-right: 0;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      button {
        width: 30px;
        height: 30px;
        border: 1px solid #d5d8de;
      }
    }

    .box-subtotal {
      width: 150px;
      color: #0B0B0B;
    }

    .box-inventory {
      width: 150px;
      font-family: Roboto, Roboto;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      line-height: 24px;
    }

    .box-act {
      font-size: 16px;

      .goods-action-box {
        display: flex;
        cursor: pointer;

        .collect-no {
          width: 100px;
          color: #333;
        }

        .status_1 {
          color: #328E00;
        }

        .status_2 {
          color: #FD6363;
        }

        .text_1 {
          color: #A5A5A5;
        }

        .text_2 {
          color: #333333;
        }

        .textA_1 {
          color: #333;
        }

        .textA_2 {
          color: #A5A5A5;
        }
      }
    }
  }
}
</style>
