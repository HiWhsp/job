<template>
  <div class="custom-form-modal">
    <el-dialog
      :title="(is_edit ? '批量上传至' : '批量上传至') + '图片库'"
      width="1000px"
      custom-class="modal-form"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="show_modal"
      :append-to-body="true"
      @closed="on_dialog_closed()"
    >
      <div class="modal-ctx" data-type="基础表单弹窗">
        <div class="modal-table-wrap">
          <div class="form-view">
            <div class="f-list">
              <div class="f-item">
                <!-- <div class="f-label ">
									导入文件上传
								</div> -->

                <div class="f-ele">
                  <div type="图片上传" class="cus-upload-wrap">
                    <div class="upload-box">
                      <div class="upload-item">
                        <div class="cus-upload-tip">
                          <!-- 推荐尺寸：1920px * 600px -->
                          <!-- 请您参照导入模版格式处理数据后长传 -->
                          建议图片压缩后上传,格式为jpg/png
                        </div>
                        <el-upload
                          class="cus-upload-image-drag"
                          list-type="text"
                          accept="image/*"
                          :multiple="true"
                          :limit="1000000"
                          :show-file-list="true"
                          :drag="true"
                          :disabled="false"
                          :name="mix_upload_name"
                          :action="mix_upload_action"
                          :data="mix_upload_data"
                          :headers="mix_upload_headers"
                          :file-list="upload_file_list_map['file']"
                          :before-upload="upload_on_before_upload"
                          :on-success="
                            (res, file, fileList) =>
                              upload_on_success({
                                field_info: { field: 'file' },
                                res,
                                file,
                                fileList,
                              })
                          "
                          :on-remove="
                            (file, fileList) =>
                              upload_on_remove({
                                field_info: { field: 'file' },
                                file,
                                fileList,
                              })
                          "
                          :on-preview="upload_on_preview"
                          :auto-upload="false"
                          :on-change="
                            (file, fileList) =>
                              upload_on_change({
                                field_info: { field: 'file' },
                                file,
                                fileList,
                              })
                          "
                        >
                          <i class="el-icon-picture"></i>
                          <div class="el-upload__text">
                            将文件拖到此处，或<em>点击上传</em>
                          </div>
                        </el-upload>
                      </div>
                    </div>

                    <div class="upload-api-msg" v-html="upload_api_msg"></div>
                    <div class="upload-api-msg" v-if="error_res_list_str">
                      失败原因：(error_res_list_str)
                      <div class="upload-tip-item">
                        {{ error_res_list_str }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <div class="progress-wrap" style="margin-bottom: 20px">
          <div class="progress-box" style="min-width: 500px">
            <el-progress
              :percentage="percentage"
              :text-inside="true"
              :stroke-width="14"
            ></el-progress>
          </div>
        </div>

        <div class="acts flex-between">
          <div class="upload-note flex">
            <div class="note-item">
              已选文件：<b>{{ total_number }}</b>
            </div>
            <div class="note-item">
              上传成功：<b>{{ upload_success_number }}</b>
            </div>
            <div class="note-item">
              上传失败：<b>{{ upload_error_number }}</b>
            </div>
          </div>
          <div class="btns flex">
            <el-button @click="show_modal = false">关闭</el-button>
            <el-button
              type="primary"
              :loading="loading"
              @click="throttle_do_submit()"
              >确定上传</el-button
            >

            <el-button type="primary" :loading="loading" @click="do_reset()"
              >清空所有</el-button
            >

            <el-button
              v-if="upload_error_number"
              type="warning"
              :loading="is_loading_error_uload"
              @click="throttle_do_submit_error_files()"
              >重新上传失败文件</el-button
            >
          </div>
        </div>
      </div>
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
      unique_key: "id",
      show_modal: false,
      is_edit: false, //新增 编辑� 编辑
      row: {},
      form: {
        file: "",
      },
      origin_form: {},
      loading: false,
      is_loading_error_uload: false,

      //
      // 上传
      upload_url_map: {
        file: [],
      },
      upload_file_list_map: {
        file: [],
      },

      import_file: "",
      batch_file_list: [],
      upload_api_msg: "",

      //上传

      concurrentLimit: 10, // 并发控制
      concurrentLimit: 12, // 并发控制

      chunk_length: 0, // 总chunk数
      is_done: false,
      upload_success_number: 0,
      upload_error_number: 0,

      //
      error_file_chunks: [],
      error_res_list_str: "",
    };
  },
  computed: {
    total_number() {
      let total_number = 0;

      for (let field in this.upload_file_list_map) {
        total_number += this.upload_file_list_map[field].length;
      }

      // if (!this.is_upload_error) {
      // } else {
      //   // this.error_file_chunks.forEach((item) => {
      //   //   total_number += item.length;
      //   // });
      // }

      return total_number;
    },
    percentage() {
      return parseFloat(
        ((this.upload_success_number / (this.total_number || 1)) * 100).toFixed(
          2
        ) || 0
      );
    },
  },
  watch: {},
  created() {
    this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
    this.throttle_do_submit_error_files = this.mix_throttle(
      this.do_submit_error_files,
      1000
    );
  },
  methods: {
    do_reset() {
      this.init(this.row);
    },

    init(row) {
      if (row) {
        this.row = row || {};
        this.is_edit = true;
      }
      this.show_modal = true;
      this.is_done = false;
      this.upload_success_number = 0;
      this.upload_error_number = 0;

      this.error_res_list_str = "";
      this.upload_file_list_map = {
        file: [],
      };
    },

    on_dialog_closed() {
      this.row = {};
      this.is_edit = false;
      this.form = {
        ...this.origin_form,
      };

      //
      if (this.upload_url_map) {
        for (var field in this.upload_url_map) {
          this.upload_url_map[field] = [];
          this.upload_file_list_map[field] = [];
        }
      }

      this.upload_api_msg = "";
      this.error_res_list_str = "";
    },
    // do_submit() {
    //   console.log("要上传的信息", this.upload_file_list_map);

    //   this.loading = true;

    //   //
    //   const formData = new FormData();
    //   for (let file of this.upload_file_list_map["file"]) {
    //     formData.append("files", file.raw);
    //   }
    //   formData.append("desDirectory", this.row.title);
    //   //

    //   this.$apiUploadFileBatch({
    //     url: "/common/bath/upload",
    //     method: "post",
    //     data: formData,
    //   }).then((res) => {
    //     console.log("导入结果", res);

    //     alert(res).then(() => {
    //       this.loading = false;
    //     });
    //     if (res.code == 200) {
    //       this.$emit("confirm");
    //       this.show_modal = false;
    //     } else {
    //       this.upload_api_msg = res.msg;
    //     }
    //   });
    // },

    do_submit() {
      console.log("要上传的信息", this.upload_file_list_map);
      this.loading = true;
      this.is_done = false;

      let file_items = this.upload_file_list_map["file"];

      file_items = file_items.filter((item) => {
        return item.status != "success";
      });

      const chunks = [];
      for (let i = 0; i < file_items.length; i += this.concurrentLimit) {
        chunks.push(file_items.slice(i, i + this.concurrentLimit));
      }

      this.chunk_length = chunks.length;

      let promise_all = [];
      chunks.forEach((chunk, chunk_index) => {
        // this.do_custom_upload(chunk, chunk_index);
        let promise = this.do_group_upload(chunk, chunk_index);
        promise_all.push(promise);
      });

      Promise.all(promise_all).then((resAll) => {
        console.log("所有文件上传结果", resAll);
        // this.loading = false;

        let error_file_chunks = [];
        resAll.forEach((res, res_index) => {
          if (res.code == 200) {
          } else {
            error_file_chunks.push(chunks[res_index]);
          }
        });
        this.error_file_chunks = error_file_chunks;

        let error_res_list = resAll.filter((res) => {
          return res.code != 200;
        });
        if (error_res_list && error_res_list.length) {
          this.upload_api_msg = "有文件上传失败";

          try {
            this.error_res_list_str = JSON.stringify(error_res_list);
          } catch (error) {}
          // return;
        }

        //
        alert({
          code: 200,
          msg: "上传完成",
        }).then(() => {
          this.loading = false;
          this.$emit("confirm");
        });
      });
    },

    // 重新上传失败文件
    do_submit_error_files() {
      this.upload_api_msg = "";
      this.error_res_list_str = "";



      this.upload_success_number = 0;
      this.upload_error_number = 0;
      this.upload_file_list_map['file'] = this.error_file_chunks.flat();


      // this.is_upload_error = true;

      console.log("要上传的信息", this.upload_file_list_map);
      console.log("要上传的失败文件", this.error_file_chunks);
      this.is_loading_error_uload = true;
      // this.is_done = false;
      // let file_items = this.error_file_chunks;

      const chunks = this.error_file_chunks;
      // for (let i = 0; i < file_items.length; i += this.concurrentLimit) {
      //   chunks.push(file_items.slice(i, i + this.concurrentLimit));
      // }
      this.chunk_length = chunks.length;

      let promise_all = [];
      chunks.forEach((chunk, chunk_index) => {
        // this.do_custom_upload(chunk, chunk_index);
        let promise = this.do_group_upload(chunk);
        promise_all.push(promise);
      });

      Promise.all(promise_all).then((resAll) => {
        console.log("所有文件上传结果", resAll);
        // this.loading = false;

        let error_file_chunks = [];
        resAll.forEach((res, res_index) => {
          if (res.code == 200) {
          } else {
            error_file_chunks.push(chunks[res_index]);
          }
        });
        this.error_file_chunks = error_file_chunks;

        let error_res_list = resAll.filter((res) => {
          return res.code != 200;
        });
        if (error_res_list && error_res_list.length) {
          this.upload_api_msg = "有文件上传失败";

          try {
            this.error_res_list_str = JSON.stringify(error_res_list);
          } catch (error) {}
          // return;
        }

        //
        alert({
          code: 200,
          msg: "上传完成",
        }).then(() => {
          this.is_loading_error_uload = false;
          this.$emit("confirm");
        });
      });
    },

    do_group_upload(chunk, chunk_index) {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        for (let file of chunk) {
          formData.append("files", file.raw);
        }
        formData.append("desDirectory", this.row.title);

        console.log("上传分组 chunk_index = ", chunk_index);
        if (chunk_index == -100) {
          // resolve({
          //   code: 500,
          //   msg: "上传失败",
          // });
        } else {
          this.$apiUploadFileBatch({
            url: "/common/bath/upload",
            method: "post",
            data: formData,
          }).then((res) => {
            if (res.code == 200) {
              this.upload_success_number += chunk.length;
              this.do_change_file_status(chunk, "success");
              resolve(res);
            } else {
              this.upload_error_number += chunk.length;
              this.do_change_file_status(chunk, "error");
              // reject(res);
              resolve(res);
            }
          });
        }
      });
    },

    do_custom_upload(chunk, chunk_index) {
      //
      const formData = new FormData();
      for (let file of chunk) {
        formData.append("files", file.raw);
      }
      formData.append("desDirectory", this.row.title);
      //

      this.$apiUploadFileBatch({
        url: "/common/bath/upload",
        method: "post",
        data: formData,
      }).then((res) => {
        console.log("批量上传", res);

        if (chunk_index == this.chunk_length - 1) {
          this.is_done = true;
        }

        if (this.is_done) {
          alert(res).then(() => {
            this.loading = false;
          });
        }
        if (res.code == 200) {
          this.upload_success_number += chunk.length;
          this.do_change_file_status(chunk, "success");
          //  v.status = 'success'
          if (this.is_done) {
            this.$emit("confirm");
            // this.show_modal = false;
          }
        } else {
          this.do_change_file_status(chunk, "error");
          this.upload_api_msg = res.msg;
        }
      });
    },

    do_change_file_status(chunk, status) {
      chunk.forEach((file) => {
        let index = this.upload_file_list_map["file"].findIndex(
          (v) => v.uid == file.uid
        );

        file.status = status;
        this.upload_file_list_map["file"].splice(index, 1, file);
      });
    },

    //
    // 图片上传
    upload_on_before_upload(file) {
      console.warn("upload_before_upload");
      const isLt50M = file.size / 1024 / 1024 < 500000; //文件大小 小于 50MB
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

      let index = this.batch_file_list.find((v) => v.uid == file.uid);
      if (index >= 0) {
        this.batch_file_list.splice(index, 1);
      }
    },
    upload_on_preview(file) {
      this.preview_image_src = file.url;
      this.is_preview_image = true;
    },

    upload_on_change(option) {
      this.upload_success_number = 0;

      let { field_info, file, fileList } = option;
      this.$log("上传change option", option);
      // fileList.forEach(v => {
      //   v.status = 'success'
      // })
      this.upload_file_list_map[field_info.field] = fileList;
      // this.upload_url_map[field_info.field] = fileList.map(v => v.response && v.response.url);

      //   this.import_file = option.file.raw;
      //   this.batch_file_list.push(option.file.raw);
      //   this.batch_file_list = fileList;
    },
    //
  },
};
</script>

<style scoped lang="less">
@import "~@/config/style/modal-form-style.less";

/deep/ .el-upload-list {
  max-height: 30vh;
  overflow-y: auto;
}
.upload-note {
  font-size: 14px;
  color: #666;

  .note-item {
    margin-right: 10px;
  }
  b {
    margin: 0 2px;
    color: #f00;
  }
}

/deep/.el-dialog__body {
  padding: 15px 40px !important;
}

.upload-api-msg {
  margin-top: 20px;
  color: coral;
}
</style>