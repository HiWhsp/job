<template>
  <div class="custom-form-modal">
    <el-dialog
      :title="(is_edit ? '编辑' : '新增') + '企业经营范围'"
      width="1000px"
      custom-class="modal-form"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-ctx" data-type="基础表单弹窗">
        <div class="f-list">
          <div class="f-item">
            <div class="f-label">经营范围</div>
            <div class="f-ele">
              <!-- <div class="select-box">
								<el-select v-model="form.rangeId" clearable :multiple="false" placeholder="请选择">
									<el-option v-for="(item, index) in rangeId_options" :key="index" :label="item.rangeName"
										:value="item.id" @change="on_change_rangeId"></el-option>
								</el-select>
							</div> -->

              <div class="select-box">
                <!-- <el-select
                  v-model="form.rangeId"
                  clearable
                  :multiple="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in rangeId_options"
                    :key="index"
                    :label="item.rangeName"
                    :value="item.id"
                    @change="on_change_rangeId"
                  ></el-option>
                </el-select> -->

                <div class="check-wrap">
                  <el-checkbox-group v-model="form.rangeIdList">
                    <el-checkbox
                      v-for="(item, index) in rangeId_options"
                      :key="index"
                      :label="item.id"
                      >{{ item.rangeName }}</el-checkbox
                    >
                  </el-checkbox-group>
                </div>
              </div>
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
      unique_key: "companyId",
      show_modal: false,
      is_edit: false, //新增 编辑
      row: {},
      form: {
        companyId: +this.$route.query.id,
        rangeIdList: [],
      },
      origin_form: {},
      loading: false,
      //
      rangeId_options: [],

      //
      checkList: [],

      prev_check_list: [],
      //   prev_check_map: {}
    };
  },
  computed: {},
  watch: {
    "form.rangeIdList"(value) {
      this.$log("form.rangeIdList", value);
    },
  },
  created() {
    this.set_params();
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
  },
  methods: {
    set_params() {
      this.origin_form = {
        ...this.form,
      };
    },

    init(row) {
      if (row) {
        this.row = row || {};
        this.$log("row", row);

        this.is_edit = true;
        this.query_detail();
      }

      this.show_modal = true;

      // this.get_tree_box_width();
      this.query_options();
    },

    query_detail() {
      this.$api({
        url: `/company/businessScope/info/${this.row.companyId}`,
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          //   this.form.rangeIdList = data || []
          this.prev_check_list = data || [];
          let map = {};
          data.forEach((id) => {
            map[id] = true;
          });
          //   this.prev_check_map = map;
          this.form.rangeIdList = [...data] || [];

          //   this.form = {
          //     companyName: data.companyName || "",
          //     companyCode: data.companyCode || "",
          //   };
        }
      });
    },

    query_options() {
      this.query_rangeId_options();
    },

    query_rangeId_options() {
      this.$api({
        url: "/medicine/operateRange/list",
        method: "get",
        data: {
          pageNum: 1,
          pageSize: 100,
        },
      }).then((res) => {
        if (res.code == 200) {
          let list = res.rows;
          this.mix_format_list_id(list, "rangeId");
          // this.total = res.total
          this.$log("数据列表", list);
          this.rangeId_options = list;
        }
      });
    },

    on_change_rangeId(value) {
      this.$log("select value", value);
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
      // this.origin_upload_url_map = JSON.parse(JSON.stringify(this.origin_upload_url_map))
    },
    do_submit() {
      // this.$log('this.form', this.form)
      // return
      if (!this.form.rangeIdList.length) {
        return alertErr("请选择" + "经营范围");
      }

      let params = {
        ...this.form,
        companyId: this.row.companyId
      };
      // if (this.is_edit) {
      //   params[this.unique_key] = this.row.id;
      // }

      this.loading = true;
      this.$api({
        url: "/company/businessScope",
        method: this.is_edit ? "put" : "post",
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

.check-wrap {
  padding: 10px 0;
}
.el-checkbox {
  margin-bottom: 15px;
  min-width: 150px;
}
</style>