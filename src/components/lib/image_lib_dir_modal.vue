<template>
  <div class="modal-container">
    <el-dialog
      :title="is_edit ? '编辑目录' : '新增目录'"
      width="600px"
      custom-class="modal-form"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-ctx" data-type="基础表单弹窗">
        <div class="f-list">
          <!-- <div class="f-item">
            <div class="f-label ">父级目录</div>
            <div class="f-ele">
              <div class="select-box">
                <el-select
                  clearable
                  v-model="form.companyId"
                  clearable
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in companyId_options"
                    :key="index"
                    :label="item.companyName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div> -->

          <div class="f-item">
            <div class="f-label required">目录名称</div>
            <div class="f-ele">
              <el-input
                clearable
                v-model="form.putObject"
                type="text"
                placeholder="请输入"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show_modal = false">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="throttle_do_submit()"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "form-modal",
  components: {},
  data() {
    return {
      unique_key: "purchaserId",
      show_modal: false,
      is_edit: false, //新增 编辑
      row: {},
      form: {
        putObject: "",
      },
      origin_form: {},
      loading: false,

      //
      companyId_options: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.set_params();
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    do_confirm_select() {},
    set_params() {
      this.origin_form = {
        ...this.form,
      };
    },

    init(row) {
      if (row) {
        this.row = row || {};
        this.is_edit = true;
        // this.query_detail();
        this.$log("业务员编辑", this.row);
      }

      this.show_modal = true;

      // this.get_tree_box_width();
      this.query_options();
    },

    query_detail() {
   
    },

    query_options() {
    
    },



    // on_before_close() {
    // 	this.show_modal = false;
    // },
    on_dialog_closed() {
      this.row = {};
      this.is_edit = false;
      this.form = {
        ...this.origin_form,
      };

      // for (var field in this.upload_file_list_map) {
      // 	this.upload_file_list_map[field] = []
      // }
      // this.upload_file_list_map = JSON.parse(JSON.stringify(this.origin_upload_file_list_map))
    },
    do_submit() {
      if (!this.form.putObject) {
        return alertErr("请填写" + "目录名称");
      }
  
      let params = {
        ...this.form,
      };
      if (this.is_edit) {
        params[this.unique_key] = this.row.id;
      }

      this.loading = true;
      this.$api({
        url: "/common/createPutObject",
        method: this.is_edit ? "get" : "get",
        data: params,
      }).then((res) => {
        alert(res).then(() => {
          this.loading = false;
        });
        if (res.code == 200) {
          this.$emit("confirm");
          this.show_modal = false;
        }
      });
    },
  },
};
</script>


<style scoped lang="less">
@import "~@/config/style/modal-form-style.less";
</style>