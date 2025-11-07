<template>
  <div class="choose-container">
    <div class="choose-wrap">
      <el-button type="primary" @click="do_open_lib()">从图片库选择</el-button>
    </div>

    <el-dialog
      title="图片素材库"
      width="1000px"
      custom-class="modal-lib"
      :close-on-click-modal="false"
      :visible.sync="is_show_modal"
      :before-close="on_before_close"
      @closed="on_closed"
    >
      <div class="modal-inner">
        <div class="modal-left">
          <div class="add-box flex-center">
            <el-button type="primary" @click="do_add_dir()">新增目录</el-button>
          </div>
          <div class="scroll-container">
            <div class="scroll-wrap">
              <el-tabs tab-position="left" @tab-click="on_tab_click">
                <el-tab-pane
                  v-for="(item, index) in dir_list"
                  :key="index"
                  :label="item.title"
                ></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>

        <!-- v-loading="loading" -->
        <div class="modal-ctx">
          <div class="action-box">
            <div class="action-left">
              <div class="filter-item">
                <el-input
                  clearable
                  type="text"
                  v-model="search_params.fileName"
                  placeholder="关键字"
                  @clear="do_search"
                >
                </el-input>
              </div>
              <div class="filter-item">
                <el-button size="small" type="primary" @click="do_search()"
                  >搜索</el-button
                >
              </div>
              <!-- <div class="filter-item">
                <el-button
                  size="small"
                  type="warning"
                  @click="do_search_reset()"
                  >重置</el-button
                >
              </div> -->
            </div>
            <div class="action-right">
              <el-button size="small" type="primary" @click="do_upload_batch()"
                >批量上传</el-button
              >
              <el-button size="small" type="danger" @click="do_delete_batch()"
                >批量删除</el-button
              >
            </div>
          </div>

          <div class="pic-container">
            <div class="pic-list">
              <div
                class="pic-item"
                v-for="(item, index) in pic_list"
                :key="index"
              >
                <div class="check-wrap">
                  <el-checkbox
                    v-if="is_allow_multiple_set || is_allow_multiple_delete"
                    v-model="item.is_select"
                  >
                    勾选
                  </el-checkbox>
                </div>

                <div class="poster-box scale-box">
                  <img class="poster scale-img" :src="item.fileImg" alt="" />
                </div>

                <div class="info-box">
                  <div class="title">{{ item.fileName }}</div>
                  <div class="check-box">
                    <el-button
                      v-if="!is_allow_multiple_set"
                      type="primary"
                      @click="do_single_choose(item)"
                    >
                      设置图片
                    </el-button>
                  </div>
                  <div class="delete-box flex-center">
                    <el-button type="text" @click="do_delete_single(item)"
                      >删除</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pagi-box" >
            <div class="page-left" >
              <el-checkbox
                v-model="is_select_all"
                @change="on_change_select_all"
                >全选</el-checkbox
              >
            </div>
            <div class="page-right">
              <el-pagination
                :background="true"
                :total="total"
                :pager-count="5"
                :current-page="search_params.pageNum"
                :page-size="search_params.pageSize"
                :page-sizes="[10, 20, 50, 100, 200, 1000, 2000, 4000]"
                @size-change="on_pagi_size_change"
                @current-change="on_pagi_current_change"
                layout="total, sizes, prev, pager, next, jumper"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer" v-if="is_allow_multiple_set">
        <el-button @click="is_show_modal = false">取消</el-button>
        <el-button type="primary" @click="do_confirm_choose()">确认</el-button>
      </span>
    </el-dialog>

    <image_lib_dir_modal
      data-title="图片库-新增目录"
      ref="image_lib_dir_modal"
      @confirm="query_file_dir_list"
    />
    <image_lib_upload_batch
      data-title="图片库-批量上传"
      ref="image_lib_upload_batch"
      @confirm="query_view"
    />
  </div>
</template>

<script>
import image_lib_dir_modal from "./image_lib_dir_modal.vue";
import image_lib_upload_batch from "./image_lib_upload_batch.vue";
import { mapState } from "vuex";

export default {
  name: "modal-hetong",
  components: {
    image_lib_dir_modal,
    image_lib_upload_batch,
  },
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          multiple: false,
          limit: 1,
        };
      },
    },
  },
  data() {
    return {
      is_show_modal: false,
      // is_show_modal: true,
      loading: false,
      table_data: [],
      search_params: {
        pageNum: 1,
        pageSize: 10,
        fileName: "",
      },
      origin_search_params: {},
      total: 0,
      group_options: [],
      pic_list: [],

      is_select_all: false,

      //
      // 产品列表
      list_product: [],
      count: 0,
      fileName: "",
      checkedAll: false,

      //
      dir_list: [],
      dir_select: {},

      is_allow_multiple_delete: true, //是否允许批量删除
    };
  },
  computed: {
    is_allow_multiple_set() {
      return this.options.multiple;
    },
  },
  watch: {},
  created() {
    this.set_params();
  },
  methods: {
    do_open_lib() {
      this.init();
    },

    set_params() {
      this.origin_search_params = {
        ...this.search_params,
      };
    },

    init(id) {
      this.is_show_modal = true;
      this.id = id || "";
      this.query_options();
      // this.query_view();
    },

    query_view() {
      this.query_image_list();
    },
    query_image_list() {
      this.$api({
        // url: "/oss/file/list",
        url: "/file/info/list",
        method: "get",
        data: {
          ...this.search_params,
          // desDirectory: this.dir_select.title,
          directoryId: this.dir_select.id,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.rows;
          // let list = data[this.dir_select.title] || [];
          this.total = res.total

          list.forEach((v) => {
            v.is_select = false;
          });
          this.pic_list = list;
        }
      });
    },

    //oss 分类
    query_options() {
      this.query_file_dir_list();
    },

    //
    query_file_dir_list() {
      this.$api({
        // url: "/oss/file/list",
        url: "/file/directory/list",
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let data = res.rows;
          let dir_list = data || [];
          data.forEach((v) => {
            v.title = v.directoryName;
          });

          // for (var key in data) {
          //   if (key.includes(".")) {
          //   } else {
          //     dir_list.push({
          //       title: key,
          //       child: data[key],
          //     });
          //   }
          // }

          this.dir_list = dir_list;
          if (dir_list.length) {
            this.dir_select = dir_list[0];
            this.query_view();
          }
          this.$log("oss目录", this.dir_list);
        }
      });
    },

    do_add_dir() {
      this.$refs.image_lib_dir_modal.init();
    },

    do_search() {
      this.search_params.pageNum = 1;
      this.query_view();
    },
    do_search_reset() {
      // this.search_params.channelId = '';
      // this.search_params.fileName = '';
      this.search_params = {
        ...this.search_params,
        ...this.origin_search_params,
      };
      this.typeId_value = "";
      this.query_view();
    },
    on_pagi_size_change(value) {
      this.search_params.pageSize = value;
      this.search_params.pageNum = 1;
      this.query_view();
    },
    on_pagi_current_change(value) {
      this.search_params.pageNum = value;
      this.query_view();
    },
    //
    //
    //
    //
    //
    //
    //

    //产品全选
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

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      this.pagination.pagesize = val;
      this.setView();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagination.page = val;
      this.setView();
    },

    //产品分类选择
    handleChangeCate(value) {
      console.log("handleChangeCate", value);

      // this.queryProduct();
    },

    product_choose(item) {
      console.log("产品选择", {
        ...item,
      });
    },

    setView() {
      this.$api({
        url: "/apiurl",
        method: "get",
        data: {
          ...this.search_params,
        },
      }).then((res) => {
        console.log("产品列表", res);

        if (res.code == 200) {
          let data = res.data;
          this.loading = false;
          this.list_product = data.list;
          this.count = data.count;
        }
      });
    },

    on_before_close() {
      this.is_show_modal = false;
    },
    on_closed() {
      console.log("关闭 on_closed");
    },

    //产品选择
    confirm_choose() {
      console.log("this.list_product", this.list_product);
      if (!this.select_items.length) {
        alertErr("请选择产品");
        return;
      }
      this.$emit("confirm", this.select_items);
      this.is_show_modal = false;
    },

    //目录切换
    on_tab_click(tab, event) {
      console.log("tab", tab);
      console.log("event", event);

      let index = tab.index;
      let item = this.dir_list[index];
      if (this.dir_select.title != item.title) {
        this.dir_select = item;
        this.query_view();
      }

      this.is_select_all = false;
    },

    do_upload_batch() {
      this.$refs.image_lib_upload_batch.init(this.dir_select);
    },

    do_delete_single(item) {
      console.log("删除", item);
      let ids = item.id + "";
      this.$api({
        // url: "/common/delete/file",
        url: `/file/info/${ids}`,
        method: "delete",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          alertSucc("删除成功");
          this.query_view();
        }
      });
    },

    do_delete_batch() {
      let has_select = this.pic_list.some((v) => {
        return v.is_select;
      });
      if (!has_select) {
        return alertErr("请选择要删除的图片");
      }

      let keys = this.pic_list.filter((v) => v.is_select).map((v) => v.id);

      let ids = keys.join(",");

      this.$api({
        url: `/file/info/${ids}`,
        method: "delete",
        data: {
          // keys: keys,
        },
      }).then((res) => {
        if (res.code == 200) {
          alertSucc("删除成功");
          this.query_view();
        }
      });
    },

    on_change_select_all(value) {
      console.log("全选", value);
      this.pic_list.forEach((v) => {
        v.is_select = value;
      });
    },

    //
    do_single_choose(item) {
      this.$emit("confirm", [item]);
      this.is_show_modal = false;
    },

    do_confirm_choose() {
      let select_items = this.pic_list.filter((v) => {
        return v.is_select;
      });
      if (!select_items.length) {
        return alertErr("请选择图片");
      }

      this.$emit("confirm", select_items);
      this.is_show_modal = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/deep/ .el-dialog {
  margin-top: 3vh !important;
}

.pic-container {
  max-height: 70vh;
  min-height: 40vh;
  overflow-y: auto;
}

.scale-box {
  overflow: hidden;

  & > .scale-img {
    width: 100%;
    height: 100%;
    transition: 0.25s linear;
    cursor: pointer;
    object-fit: cover;
  }

  &:hover {
    & > .scale-img {
      transform: scale(1.1);
    }
  }
}

.pagi-box {
  padding-top: 20px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.cate-poster {
  width: 30px;
  height: 30px;
}

/deep/ .el-table__cell {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}

.table-box {
  height: 500px;
  overflow-y: auto;
}

.el-cascader {
  width: 100%;
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

/deep/ .modal-lib {
  // margin-top: 80px !important;

  .modal-inner {
    padding: 10px;
    padding-bottom: 0 !important;

    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .modal-left {
      align-self: stretch;
      width: 160px;
      overflow-y: auto;
      padding: 10px;
      background: #f9f9f9;
      border: 1px solid #eee;
      margin-right: 10px;
      .el-tabs {
        width: 100%;
        .el-tabs__header {
          width: 100%;
        }
      }
    }
    .modal-ctx {
      flex: 1;
      overflow: hidden;
      padding-bottom: 30px;
    }
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

  .action-box {
    text-align: left;
  }
}

.upload-ctx {
  margin: 20px 0;
}

.pic-list {
  display: flex;
  flex-wrap: wrap;

  .pic-item {
    position: relative;
    margin: 4px;
    width: 150px;
    padding: 10px;
    overflow: hidden;
    border: 1px solid #eee;
    .check-wrap {
      z-index: 10;
      position: absolute;
      left: 10px;
      top: 10px;
      padding: 5px 10px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      border-radius: 8px;


      /deep/ .el-checkbox__label {
        color: #fff;
      }
      /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
        color: #fff !important; 
      }
    }

    .poster-box {
      width: 130px;

      .poster {
        width: 130px;
        height: 130px;
      }
    }
    .info-box {
      padding: 10px;
      padding: 5px;
      .title {
        font-size: 14px;
        min-height: 50px;
      }
      .check-box {
        margin-top: 10px;
      }
      .delete-box {
        margin-top: 10px;
      }
    }
  }
}
</style>