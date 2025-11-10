<template>
  <div class="custom-form-modal">
    <el-dialog
      :title="is_edit ? '编辑企业' : '新增企业'"
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
            <div class="f-label required">企业编码</div>
            <div class="f-ele">
              <el-input
                v-model="form.companyCode"
                type="text"
                placeholder="请输入编码"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label required">企业名称</div>
            <div class="f-ele">
              <el-input
                v-model="form.companyName"
                type="text"
                placeholder="请输入企业名称"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label required">联系人</div>
            <div class="f-ele">
              <el-input
                v-model="form.contacts"
                type="text"
                placeholder="请输入联系人"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label">联系电话</div>
            <div class="f-ele">
              <el-input
                v-model="form.contactNumber"
                type="text"
                placeholder="请输入联系电话"
              ></el-input>
            </div>
          </div>
          <!-- <div class="f-item">
						<div class="f-label">
							经营范围
						</div>
						<div class="f-ele">
							<div class="select-box">
								<el-select v-model="rangeId_values" clearable :multiple="true" placeholder="请选择经营范围">
									<el-option v-for="(item, index) in rangeId_options" :key="index"
										:label="item.rangeName" :value="item.rangeId"></el-option>
								</el-select>
							</div>
						</div>
					</div> -->
          <div class="f-item">
            <div class="f-label">地址</div>
            <div class="f-ele">
              <el-input
                v-model="form.address"
                type="text"
                placeholder="请输入地址"
              ></el-input>
            </div>
          </div>
          <div class="f-item">
            <div class="f-label">邮箱</div>
            <div class="f-ele">
              <el-input
                v-model="form.email"
                type="text"
                placeholder="请输入邮箱"
              ></el-input>
            </div>
          </div>
          <!-- <div class="f-item">
						<div class="f-label ">
							描述
						</div>
						<div class="f-ele">
							<el-input v-model="form.description" type="text" placeholder="描述"></el-input>
						</div>
					</div> -->
          <div class="f-item">
            <div class="f-label required">营业执照</div>
            <div class="f-ele">
              <div type="图片上传" class="cus-upload-wrap">
                <div class="upload-box">
                  <!-- <div class="upload-item">
										<el-upload class="upload-demo" drag
											action="https://jsonplaceholder.typicode.com/posts/" multiple>
											<i class="el-icon-picture"></i>
											<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
											<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
										</el-upload>
									</div> -->
                  <div class="upload-item">
                    <div class="cus-upload-tip">
                      <!-- 推荐尺寸：1920px * 600px -->
                      支持jpg/png格式，建议压缩图片后上传，图片大小不超过10MB
                    </div>
                    <el-upload
                      class="cus-upload-image-drag"
                      list-type="picture-card"
                      accept="image/*"
                      :multiple="false"
                      :limit="1"
                      :show-file-list="true"
                      :drag="true"
                      :disabled="false"
                      :name="mix_upload_name"
                      :action="mix_upload_action"
                      :data="mix_upload_data"
                      :headers="mix_upload_headers"
                      :file-list="upload_file_list_map['businessLicense']"
                      :before-upload="upload_on_before_upload"
                      :on-success="
                        (res, file, fileList) =>
                          upload_on_success({
                            field_info: { field: 'businessLicense' },
                            res,
                            file,
                            fileList,
                          })
                      "
                      :on-remove="
                        (file, fileList) =>
                          upload_on_remove({
                            field_info: { field: 'businessLicense' },
                            file,
                            fileList,
                          })
                      "
                      :on-preview="upload_on_preview"
                    >
                      <i class="el-icon-picture"></i>
                      <div class="el-upload__text">
                        将文件拖到此处，或<em>点击上传</em>
                      </div>
                      <!-- <div class="el-upload__tip" slot="tip">
												请选择图片上传 建议尺寸(px)：1920 * 600
											</div> -->
                    </el-upload>
                    <!-- <div class="upload-pic-list">
											<div class="pic-item">
											</div>
										</div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="f-item">
						<div class="f-label required">
							状态
						</div>
						<div class="f-ele">
							<div class="radio-box">
								<el-radio-group v-model="form.status">
									<el-radio v-for="(item, index) in status_options" :key="index" :label="item.value">
										{{ item.title }}
									</el-radio>
								</el-radio-group>
							</div>
						</div>
					</div> -->
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

    <el-dialog :visible.sync="is_preview_image">
      <img width="100%" :src="preview_image_src" alt="" />
    </el-dialog>
    <el-dialog :visible.sync="is_preview_video">
      <video width="100%" :src="preview_video_src" controls alt="" />
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
        companyName: "",
        companyCode: "",
        contacts: "",
        contactNumber: "",
        businessLicense: "",
        address: "",
        email: "",
      },
      origin_form: {},
      loading: false,

      //
      rangeId_values: "",
      rangeId_options: [],

      treePopWidth: "",

      tree_field_title_map: {
        // column: title
        channelId: "",
      },

      // 上传
      upload_url_map: {
        businessLicense: [],
      },
      origin_upload_url_map: {
        businessLicense: [],
      },
      upload_file_list_map: {
        businessLicense: [],
      },
      origin_upload_file_list_map: {
        businessLicense: [],
      },
      //
      is_preview_image: false,
      preview_image_src: "",
      is_preview_video: false,
      preview_video_src: "",
    };
  },
  computed: {},
  watch: {},
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
        this.is_edit = true;
        this.query_detail();
      }

      this.show_modal = true;

      // this.get_tree_box_width();
      this.query_options();
    },

    query_detail() {
      this.$api({
        url: `/company/info/${this.row.id}`,
        method: "get",
        data: {},
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
          this.form = {
            companyName: data.companyName || "",
            companyCode: data.companyCode || "",
            contacts: data.contacts || "",
            contactNumber: data.contactNumber || "",
            businessLicense: data.businessLicense || "",
            address: data.address || "",
            email: data.email || "",
          };

          // this.tree_field_title_map.channelId = data.channel_title
          if (data.businessLicense) {
            this.upload_file_list_map["businessLicense"] = data.businessLicense
              .split(",")
              .filter((v) => !!v)
              .map((v) => ({
                url: v,
              }));
          }
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
          this.$log("数据列表", list);
          this.rangeId_options = list;
        }
      });
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
      this.upload_file_list_map = JSON.parse(
        JSON.stringify(this.origin_upload_file_list_map)
      );
      this.origin_upload_url_map = JSON.parse(
        JSON.stringify(this.origin_upload_url_map)
      );
    },
    do_submit() {
      let params = {
        ...this.form,
        businessLicense: this.upload_url_map["businessLicense"].join(","),
        // rangeId: this.rangeId_values.join(',')
      };
      if (this.is_edit) {
        params[this.unique_key] = this.row.id;
      }

      if (!params.companyCode) {
        return alertErr("请填写" + "企业编码");
      }
      if (!params.companyName) {
        return alertErr("请填写" + "企业名称");
      }
      if (!params.contacts) {
        return alertErr("请填写" + "联系人");
      }
      if (!params.businessLicense) {
        return alertErr("请上传" + "营业执照");
      }

      this.loading = true;
      this.$api({
        url: "/company/info",
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

    //
    // 图片上传
    upload_on_before_upload(file) {
      console.warn("upload_before_upload");
      const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
      return isLt50M;
    },
    upload_on_success(option) {
      let { field_info, res, file, fileList } = option;
      this.$log("upload_on_success option", option);

      if (res.code == 200) {
        let url = res.url;
        this.upload_file_list_map[field_info.field] = fileList;
        // this.upload_url_map[field_info.field].push(url)
        this.upload_url_map[field_info.field] = fileList.map(
          (v) => v.response && v.response.url
        );
      } else {
        alert(res);
      }
    },
    upload_on_remove(option) {
      let { field_info, file, fileList } = option;
      this.$log("upload_on_remove option", option);
      this.upload_file_list_map[field_info.field] = fileList;
      this.upload_url_map[field_info.field] = fileList.map(
        (v) => v.response && v.response.url
      );
    },
    upload_on_preview(file) {
      this.preview_image_src = file.url;
      this.is_preview_image = true;
    },
    //
  },
};
</script>

<style scoped lang="less">
@import "~@/config/style/modal-form-style.less";
</style>