<template>
	<div class="custom-form-modal">
		<el-dialog :title="(is_edit ? '导入' : '导入') + '产品'" width="600px" custom-class="modal-form"
			:close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="show_modal"
			:append-to-body="true" @closed="on_dialog_closed()">
			<div class="modal-ctx" data-type="基础表单弹窗">

				<div class="modal-table-wrap">
					<div class="form-view">
						<div class="f-list ">
							<div class="f-item" style="width: 100%;">
								<div class="f-label">
									导入模版
								</div>
								<div class="f-ele">
									<div class="value-text">
										<el-button type="text" class="file-link" @click="do_download()">
											下载分类导入模版
										</el-button>
									</div>
								</div>
							</div>

							<div class="f-item">
								<div class="f-label ">
									导入文件上传
								</div>
								<div class="f-ele">
									<div type="图片上传" class="cus-upload-wrap">
										<div class="upload-box">
											<div class="upload-item">
												<div class="cus-upload-tip">
													<!-- 推荐尺寸：1920px * 600px -->
													请您参照导入模版格式处理数据后长传
												</div>
												<el-upload class="cus-upload-image-drag" list-type="text"
													accept=".xlsx,xls" :multiple="false" :limit="1"
													:show-file-list="true" :drag="true" :disabled="false"
													:name="mix_upload_name" :action="mix_upload_action"
													:data="mix_upload_data" :headers="mix_upload_headers"
													:file-list="upload_file_list_map['file']"
													:before-upload="upload_on_before_upload"
													:on-success="(res, file, fileList) => upload_on_success({ field_info:{field: 'file'}, res, file, fileList })"
													:on-remove="(file, fileList) => upload_on_remove({ field_info:{field: 'file'}, file, fileList })"
													:on-preview="upload_on_preview" :auto-upload="false"
													:on-change="(file, fileList) => upload_on_change({ field_info:{field: 'file'}, file, fileList })">
													<i class="el-icon-picture"></i>
													<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
												</el-upload>
											</div>

										</div>

										<div class="upload-api-msg" v-html="upload_api_msg">

										</div>
									</div>
								</div>
							</div>

						</div>
					</div>

				</div>


			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="show_modal = false">关闭</el-button>
				<el-button type="primary" :loading="loading" @click="throttle_do_submit()">提交</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "form-modal",
		components: {

		},
		data() {
			return {
				unique_key: 'id',
				show_modal: false,
				is_edit: false, //新增 编辑� 编辑
				row: {},
				form: {
					file: '',
				},
				origin_form: {},
				loading: false,

				//
				table_data: [{}, {}],
				channelId_options: [],
				is_show_select: false,

				// 上传
				upload_url_map: {
					'file': []
				},
				upload_file_list_map: {
					'file': []
				},

				import_file: '',
				upload_api_msg: ''
				//上传
			};
		},
		computed: {},
		watch: {

		},
		created() {
			this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
		},
		methods: {
			init(row) {
				if (row) {
					this.row = row || {}
					this.is_edit = true;
				}
				this.show_modal = true;
			},

			on_dialog_closed() {
				this.row = {}
				this.is_edit = false;
				this.form = {
					...this.origin_form
				}

				//
				if (this.upload_url_map) {
					for (var field in this.upload_url_map) {
						this.upload_url_map[field] = [];
						this.upload_file_list_map[field] = [];
					}
				}

				this.upload_api_msg = ''
			},
			do_submit() {
				console.log('要上传的信息', this.upload_file_list_map)
				// return false;
				let params = {
					// file: this.upload_file_list_map['file'][0],
					file: this.import_file,
				}
				console.log('要上传的信息 params', params)

				if (!params.file) {
					return alertErr("请先上传" + '要导入的文件');
				}
				this.loading = true;
				this.$apiUploadFile({
					url: '/medicine/goods/importData',
					method: 'post',
					data: params
				}).then(res => {
					console.log('导入结果', res)

					alert(res).then(() => {
						this.loading = false;
					});
					if (res.code == 200) {
						this.$emit('confirm')
						this.show_modal = false
					} else {
						this.upload_api_msg = res.msg
					}
				})

			},



			//
			// 图片上传
			upload_on_before_upload(file) {
				console.warn("upload_before_upload");
				const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
				return isLt50M;
			},
			upload_on_success(option) {
				let {
					field_info,
					res,
					file,
					fileList
				} = option
				this.$log("upload_on_success option", option);

				if (res.code == 200) {
					let url = res.url;
					this.upload_file_list_map[field_info.field] = fileList;
					// this.upload_url_map[field_info.field].push(url)
					this.upload_url_map[field_info.field] = fileList.map(v => v.response && v.response.url);
				} else {
					alert(res)
				}
			},
			upload_on_remove(option) {
				let {
					field_info,
					file,
					fileList,
				} = option;
				this.$log('upload_on_remove option', option)
				this.upload_file_list_map[field_info.field] = fileList;
				this.upload_url_map[field_info.field] = fileList.map(v => v.response && v.response.url);
			},
			upload_on_preview(file) {
				this.preview_image_src = file.url;
				this.is_preview_image = true;
			},

			upload_on_change(option) {
				let {
					field_info,
					file,
					fileList,
				} = option;
				this.$log('upload_on_remove option', option)
				this.upload_file_list_map[field_info.field] = fileList;
				// this.upload_url_map[field_info.field] = fileList.map(v => v.response && v.response.url);

				this.import_file = option.file.raw
			},
			// 



			do_download() {
				this.$apiDownload({
					url: '/medicine/goods/importTemplate2',
					method: 'post',
					data: {

					}
				}).then(res => {
					alert('下载成功').then(() => {
						this.loading = false;
					});
					console.log('下载res', res)
					// if (res.code == 200) {
					const blob = new Blob([res.data], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // 匹配 .xlsx 类型‌:ml-citation{ref="1,3" data="citationList"}
					});
					const url = window.URL.createObjectURL(blob);
					// window.open(url, '_blank')


					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', '产品分类导入模版.xlsx'); // 指定文件名
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url); // 释放内存
					// }
				})
			}
		},
	};
</script>

<style scoped lang="less">
	@import "~@/config/style/modal-form-style.less";

	/deep/.el-dialog__body {
		padding: 15px 40px !important;
	}

	.upload-api-msg {
		margin-top: 20px;
		color: coral;
	}

	.f-list {
		// display: flex;
		// flex-wrap: wrap;
	}

	.f-item {
		// width: 40%;
		margin-bottom: 10px !important;

	}

	.value-text {
		// padding: 6px 0;
		font-size: 14px;

		.el-button {
			font-size: 14px;
		}
	}

	.f111-label {
		min-width: 160px !important;
		text-align: right;

		&::after {
			content: '：';
			padding-right: 4px;
		}
	}
</style>