<template>
  <div class="modal-container">
    <!-- 营销目录 - 维护橱窗产品弹窗 -->

    <modal_chuchuang_chanpin_choose ref="modal_chuchuang_chanpin_choose" />

    <el-dialog
      title="维护橱窗产品"
      width="1000px"
      custom-class="modal-record"
      :close-on-click-modal="false"
      :visible.sync="show"
      :before-close="onModalClose"
    >
      <div class="modal-inner">
        <div class="modal-ctx" v-loading="loading">
          <div class="action-box">
            <div class="action-left">
              <div class="filter-item">
                <el-button size="small" type="primary" @click="product_choose"
                  >选择产品</el-button
                >
              </div>
            </div>
            <div class="action-right">
              <el-button size="small" type="danger" @click="product_remove_checked"
                >移除选中</el-button
              >
            </div>
          </div>

          <div class="table-box">
            <el-table
              ref="multipleTable"
              :data="list_product"
              fit
              stripe
              highlight-current-row
              min-width="100px"
              style="width: 100%"
              @selection-change="handleSelectionChange1"
            >
              <el-table-column type="selection" width="55"> </el-table-column>

              <el-table-column label="产品名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="图片" width="80px">
                <template slot-scope="scope">
                  <span class="cus-poster">
                    <!-- <img :src="'https://omo-oss-image.thefastimg.com/' + scope.row.image_2b5N8b00" alt="" class="cate-poster" /> -->
                    <el-image
                      style="width: 30px; height: 30px"
                      :src="'https://omo-oss-image.thefastimg.com/' + scope.row.image"
                      :preview-src-list="[
                        'https://omo-oss-image.thefastimg.com/' + scope.row.image,
                      ]"
                    >
                    </el-image>
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="分类">
                <template slot-scope="scope">
                  <span class="cus-miaoshu">{{ scope.row.category_item }}</span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="50px">
                <template slot-scope="scope">
                  <el-link type="primary" @click="product_move_out([scope.row])"
                    >移出</el-link
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- v-if="false" -->
          <div class="pagination-box">
            <div class="page-left">
              <el-checkbox
                v-model="checkedAll"
                @change="changeAll"
                style="margin-right: 30px"
                >全选</el-checkbox
              >
              <!-- <el-button type="primary" @click="product_remove_checked">移除选中</el-button> -->
              <el-link type="danger" @click="product_remove_checked">移除选中</el-link>
            </div>
            <div class="page-right">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.page"
                :page-size="pagination.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count"
              >
              </el-pagination>
              <!-- <el-button type="" @click="show = false">关闭</el-button> -->
            </div>
          </div>
        </div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="form_submit">{{ id ? "修改" : "确认" }}</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import modal_chuchuang_chanpin_choose from "./modal_chuchuang_chanpin_choose.vue";

import { mapState } from "vuex";

export default {
  name: "modal-hetong",
  components: {
    modal_chuchuang_chanpin_choose,
  },
  props: [""],
  data() {
    return {
      show: false,
      loading: false,
      id: "",
      title: "",
      image_poster: "",
      file_poster: "",

      // 产品列表
      all_list_product: [],
      list_product: [],

      checkedAll: false,
      select_items: [],

      pagination: {
        page: 1,
        pagesize: 10,
      },
      count: 0,
    };
  },
  computed: {
    // list_product() {
    //   let list = [];
    //   let id_arr = this.list_product_all.map((v) => v.CID);
    //   id_arr.forEach((CID) => {
    //     let item = this.list_product_all.find((v) => v.CID == CID);
    //     list.push(item);
    //   });
    //   return list;
    // },
  },
  watch: {
    show(val) {
      if (!val) {
        this.id = "";
        this.title = "";
        this.list_product = [];
        this.select_items = [];
      }
    },
  },

  created() {},

  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      this.pagination.pagesize = val;
      // this.setView();

      let start = (this.pagination.page - 1) * this.pagination.pagesize;
      let end = this.pagination.page * this.pagination.pagesize;
      this.list_product = this.all_list_product.slice(start, end);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagination.page = val;
      // this.setView();

      let start = (this.pagination.page - 1) * this.pagination.pagesize;
      let end = this.pagination.page * this.pagination.pagesize;
      this.list_product = this.all_list_product.slice(start, end);
    },

    changeAll(val) {
      console.log("全选", val);
      if (val) {
        // let items = this.list_product;
        // this.toggleSelection(items);
        // this.$refs.multipleTable.toggleRowSelection(items, true);
        this.$refs.multipleTable.toggleAllSelection();
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    handleSelectionChange1(items) {
      console.log("已选产品", items);
      this.select_items = items;
    },

    product_choose_callback(items) {
      console.log("父组件接收产品选择", items);
      // this.list_product_all.push(...items);
    },

    init(item = "") {
      console.log("产品编辑  init ", { ...item });
      this.show = true;
      this.id = item.id || "";

      this.setView();
    },

    //产品详情
    setView() {
      if (this.id) {
        this.loading = true;
        this.$api("adminCategoryProList", {
          id: this.id,
        }).then((res) => {
          console.log("目录产品", res);
          let { code, data, count } = res;
          if (code == 0) {
            this.loading = false;

            this.all_list_product = data.data;
            this.list_product = data.data.slice(0, 10);

            this.count = this.all_list_product.length;
          }
        });
      }
    },

    onModalClose() {
      this.show = false;

      this.$parent.setView();
    },

    //产品选择
    product_choose() {
      this.$refs.modal_chuchuang_chanpin_choose.init(this.id);
    },

    //移除产品
    product_move_out(items) {
      console.log("移除产品", items);

      // let id_ar = items.map((v) => v.id);
      // let ids = id_ar.join();

      // let formData = new FormData();
      // formData.append("ids", ids);

      // this.$api("adminDeleteCateProduct", formData).then((res) => {
      //   console.log("移除产品", res);
      //   let { code, data } = res;
      //   alert(res);
      //   if (res.code == 0) {
      //     // this.show = false;
      //     this.setView();
      //   }
      // });
    },
    product_remove_checked() {
      this.product_move_out(this.select_items);
    },
  },
};
</script>


<style scoped lang="less">
/deep/ .el-dialog {
  margin-top: 3vh !important;
}

/deep/ .el-table__cell {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

.pagination-box {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // border-bottom: 1px solid #eee;
}

.table-box {
  height: 500px;
  overflow-y: auto;
}

/deep/ .modal-record {
  // margin-top: 80px !important;

  .modal-inner {
    padding: 10px;
  }

  .el-dialog__header {
    display: flex;
		align-items: center;
		justify-content: space-between;
    border-bottom: 1px solid #eee;
    // background: #90caf8;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #000000;

    .el-dialog__title {
      color: #000;
    }
    .el-dialog__headerbtn {
      // display: none;
      // top: 0;
      .el-dialog__close {
        color: #000;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    // text-align: center;

    button {
      // width: 106px;
      // height: 40px;
      // background: #fff;
      // opacity: 1;
      // border-radius: 0;
      // border: 1px solid #aaa;
      // cursor: pointer;

      & + button {
        margin-left: 30px;
      }
    }

    .queding {
      // background: #036dd1;
      // border: 1px solid #aaa;
      // color: #fff;
      // width: 106px;
      // height: 40px;
      // background: #0060fa;
    }
  }
}

.modal-ctx {
  padding: 0;
  // max-height: 60vh;
  // overflow-y: auto;
  // border-bottom: 1px solid #ddd;

  .action-box {
    text-align: left;
    // padding-bottom: 15px;
  }

  .action-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .action-left {
      display: flex;
      align-items: center;

      .filter-item {
        margin-right: 20px;
      }
    }
    .action-right {
    }
  }

  .tip {
    margin-bottom: 20px;
    color: #444;
    font-size: 14px;
  }

  .input-box {
    margin-bottom: 15px;

    &.flex {
      display: flex;
      align-items: flex-start;

      .label {
        margin-bottom: 0;
        text-align: left;
        padding-top: 5px;
      }
    }

    .label {
      min-width: 100px;
      margin-right: 20px;
      margin-bottom: 20px;
      font-size: 14px;
      font-family: PingFang SC;
      color: #6e7285;
    }

    .input-item {
      text-align: left;
      width: 600px;
    }

    .el-input {
      min-width: 300px;
      width: 100%;
    }

    .el-select {
      width: 100%;
    }
  }
}

.upload-ctx {
  margin: 20px 0;
}
</style>
