<template>
	<div class="role-form-modal">
		<div class="form-container">
			<div class="input-items">
				<div class="input-item" v-for="(item, index) in form_fields" :key="index">
					<div class="input-box">
						<div class="label" :class="{ required: item.is_required_in_form }">
							{{ item.field_title }}
						</div>
			
						<div class="val">
							<div class="form-ele">
								<!-- 单行文本 -->
								<el-input
									v-if="item.form_render_type == 'input' || item.form_render_type == 'number' || !item.form_render_type"
									:type="item.form_render_type == 'number' ? 'number' : 'text'"
									:disabled="form_field_disabled_map[item.field]" v-model="form[item.field]"
									:placeholder="item.field_title">
									<template v-if="form_field_input_append_map[item.field]" slot="append">{{ item.append
			              }}</template>
								</el-input>
			
								<!-- 多行文本 -->
								<el-input v-else-if="item.form_render_type == 'textarea'"
									:disabled="form_field_disabled_map[item.field]" v-model="form[item.field]" type="textarea"
									:placeholder="item.field_title" :autosize="item.autosize"></el-input>
			
								<!-- 选项 -->
								<!-- <formSelect v-else-if="item.form_render_type == 'select'" :form="form" :item="item"
			            ref="formSelect" /> -->
								<div class="select-box" v-else-if="item.form_render_type== 'select'">
									<template v-if="select_config_map[item.field]">
										<el-select :disabled="form_field_disabled_map[item.field]"
											:multiple="form_field_multiple_map[item.field]" v-model="form[item.field]"
											:placeholder="'请选择' + item.field_title">
											<el-option v-for="(select_item, select_index) in select_config_map[item.field].options"
												:key="select_index" :label="select_item.title" :value="select_item[select_config_map[item.field].valueKey || 'id']"></el-option>
										</el-select>
									</template>
								</div>
			
								<el-radio-group v-else-if="item.form_render_type == 'radio'" v-model="form[item.field]">
									<el-radio v-for="(radio_item, radio_index) in radio_options_map[item.field]" :key="radio_index"
										:label="radio_item.value">
										{{ radio_item.title }}
									</el-radio>
								</el-radio-group>
			
								<el-date-picker v-else-if="item.form_render_type == 'date'"
									:disabled="form_field_disabled_map[item.field]" v-model="form[item.field]"
									:picker-options="item['picker-options'] || {}" type="date" value-format="yyyy-MM-dd"
									placeholder="选择日期"></el-date-picker>
			
								<el-date-picker v-else-if="item.form_render_type == 'daterange'"
									:disabled="form_field_disabled_map[item.field]" v-model="form[item.field]" type="daterange"
									value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
			
								<el-date-picker v-else-if="item.form_render_type == 'dateTimePicker'"
									:disabled="form_field_disabled_map[item.field]" v-model="form[item.field]" type="daterange"
									value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
			
								<el-date-picker v-else-if="item.form_render_type == 'datetime'" v-model="form[item.field]"
									type="datetime" :placeholder="item.placeholder || '请选择' + item.field_title"
									:picker-options="datetimePickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
								</el-date-picker>
			
								<!-- 时间选择 -->
								<!-- <el-time-picker
			              v-else-if="item.form_render_type== 'time'"
			              :disabled="form_field_disabled_map[item.field]"
			              value-format="HH:ss"
			              v-model="form[item.field]"
			              placeholder="请选择时间"
			            >
			            </el-time-picker> -->
			
								<div type="图片上传" class="image-upload-box" v-else-if="item.form_render_type == 'image'">
									<!-- :http-request="(uploadInfo) => handle_upload_image_request(uploadInfo, item)" -->
			
									<div class="upload-box" v-if="upload_config_map[item.field]">
										<el-upload class="upload-image" list-type="picture-card" accept="image/*"
											:multiple="upload_config_map[item.field].multiple" :limit="upload_config_map[item.field].limit"
											:name="upload_name" :action="mix_upload_action" :data="upload_data"
											:file-list="upload_result_map[item.field]"
											:on-success="(res,file,fileList) => upload_on_success({item,res,file,fileList})"
											:on-remove="(file, fileList) => upload_on_remove({item, file, fileList})"
											:before-upload="upload_before_upload" :on-preview="upload_on_preview">
											<i class="el-icon-plus" v-if="upload_config_map[item.field].limit"> </i>
											<div class="el-upload__tip" slot="tip" v-if="upload_config_map[item.field].tip">
												{{ upload_config_map[item.field].tip || "" }}
											</div>
										</el-upload>
									</div>
								</div>
			
								<div type="图片上传多" class="image-upload-box" v-else-if="item.form_render_type == 'image-list'">
									<!-- :http-request="(uploadInfo) => handle_upload_image_request(uploadInfo, item)" -->
			
									<div class="upload-box" v-if="upload_config_map[item.field]">
										<el-upload class="upload-image" list-type="picture-card" accept="image/*"
											:multiple="upload_config_map[item.field].multiple" :limit="upload_config_map[item.field].limit"
											:name="upload_name" :action="mix_upload_action" :data="upload_data"
											:file-list="upload_result_map[item.field]"
											:on-success="(res,file,fileList) => upload_on_success({item,res,file,fileList})"
											:on-remove="(file, fileList) => upload_on_remove({item, file, fileList})"
											:before-upload="upload_before_upload" :on-preview="upload_on_preview">
											<i class="el-icon-plus" v-if="upload_config_map[item.field].limit"> </i>
											<div class="el-upload__tip" slot="tip" v-if="upload_config_map[item.field].tip">
												{{ upload_config_map[item.field].tip || "" }}
											</div>
										</el-upload>
									</div>
								</div>
			
			
			
								<div type="视频上传" class="video-upload-box" v-else-if="item.form_render_type == 'upload-video'">
									<el-upload class="upload-video" list-type="text" accept="video/*" :multiple="item.upload_multiple"
										:limit="item.upload_limit" :name="upload_name" :action="mix_upload_action" :data="upload_data"
										:file-list="cacheMap[item.cache_key]" :http-request="(uploadInfo) => handle_upload_video_request(uploadInfo, item)
			                " :on-success="handle_upload_video_success" :on-remove="(file, fileList) =>
			                  handle_upload_video_remove({ file, fileList, formItem: item })
			                  " :before-upload="handle_upload_video_before">
										<i class="el-icon-plus" v-if="item.upload_limit"> </i>
									</el-upload>
			
									<div class="video-preview-box">
										<el-button type="primary" @click="videoPreview(item)">
											预览视频
										</el-button>
									</div>
								</div>
			
								<div type="选项卡" class="tab-card-box" v-else-if="item.form_render_type == 'topic-card'">
									<div class="table-sec">
										<el-table :data="item.tabCardData" stripe border>
											<template v-for="(item, index) in item.tabCardColumns">
												<el-table-column :key="index + item.prop" :prop="item.prop" :label="item.field_title"
													:width="item.width">
													<template slot-scope="scope">
														<div class="id-text">
															<el-input v-model="scope.row[item.prop]"> </el-input>
														</div>
													</template>
												</el-table-column>
											</template>
			
											<el-table-column fixed="right" label="操作" width="80">
												<template slot-scope="scope">
													<div data-title="列表操作" class="row-actions-box">
														<el-button @click="tabCardRowDelete(scope.row, scope)" type="text">删除</el-button>
													</div>
												</template>
											</el-table-column>
										</el-table>
			
										<div class="loop-add">
											<el-button type="primary" @click="tabCardAddItem(item)">
												增加
											</el-button>
										</div>
									</div>
								</div>
			
								<div type="标签列表" class="tag-list-box" v-else-if="item.form_render_type == 'tag-list'">
									<el-tag size="small" :key="tag" v-for="tag in tagList" closable :disable-transitions="false"
										@close="tagClose(tag)">
										{{ tag }}
									</el-tag>
									<el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagInputValue" ref="tagInputRef"
										size="small" @keyup.enter.native="tagInputConfirm()" @blur="tagInputConfirm()">
									</el-input>
									<el-button v-else class="button-new-tag" size="small" @click="tagShowInput()">+ 添加</el-button>
								</div>
			
								<div v-else-if="item.form_render_type == 'cascader'" type="级联选择" class="cascader-box">
									<el-cascader :options="cascaderOptions" :props="{ checkStrictly: true }" clearable></el-cascader>
								</div>
			
								<div v-else-if="item.form_render_type == 'treeSelect'" type="分类树选择" tip="适用于树形分类选择" class="tree-box">
									<el-popover ref="popoverTree" placement="top-start" title="" :width="treePopWidth" trigger="click"
										content="">
										<div slot="reference" class="tree-click-box">
											<el-input readonly v-model="tree_field_title_map[item.field]"
												:placeholder="'请选择' + item.field_title">
											</el-input>
											<!-- <el-button type="primary"> 选择分类 </el-button> -->
										</div>
										<div class="pop-tree" v-if="tree_config_map[item.field]">
											<el-tree :data="tree_config_map[item.field].treeData"
												:props="tree_config_map[item.field].treeProps"
												:show-checkbox="tree_config_map[item.field].treeShowCheckbox"
												:node-key="tree_config_map[item.field].treeNodeKey"
												:default-expand-all="tree_config_map[item.field].defaultExpandAll"
												:expand-on-click-node="false" :highlight-current="true" @node-click="(obj, node, self) => treeNodeClick(obj, node, self, item)
			                    ">
											</el-tree>
										</div>
									</el-popover>
								</div>
			
			
			
								<div v-else-if="item.form_render_type == 'richtext'" type="富文本编辑器" class="rich-box">
									<!-- <el-input v-model="form[item.field]" type="textarea"></el-input> -->
			
									<w_richtext v-if="show" :id="'w_richtext_' + item.field" v-model="form[item.field]"
										:ref="'w_richtext_' + item.field" />
								</div>
			
			
			
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
	</div>
</template>

<script>
	

	import formSelect from "@/components/form/formSelect.vue";
	import w_richtext from "@/components/base/w_richtext.vue";

	import {
		mapState
	} from "vuex";

	export default {
		name: "w_form_modal",
		components: {
			formSelect,
			w_richtext,
		},
		props: {
			/**
			 
			 api_config: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: true,
			 },
			 form_fields: {
			 	type: Array,
			 	default: function() {
			 		return [];
			 	},
			 	required: false,
			 },
			 form_fields_default_value: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 form_field_disabled_map: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 form_field_multiple_map: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 form_field_input_append_map: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 radio_options_map: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 select_config_map: {
			 	type: Object,
			 	default: function() {
			 		return {};
			 	},
			 	required: false,
			 },
			 tree_config_map: {
			 	type: Object,
			 	default: function() {
			 		return {
			 			// 'parentId': {
			 			// 	treeData: [],
			 			// 	treeProps: {
			 			// 		label: "title",
			 			// 		children: "child",
			 			// 	},
			 			// 	treeShowCheckbox: false,
			 			// 	treeNodeKey: "id",
			 			// 	defaultExpandAll: true,
			 			// }
			 		};
			 	},
			 	required: false,
			 },
			 upload_config_map: {
			 	type: Object,
			 	default: function() {
			 		return {
			 			// 'thumb': {
			 			// 	multiple: false,
			 			// 	limit: 1,
			 			// 	tip: '请选择文件',
			 			// }
			 		};
			 	},
			 	required: false,
			 },
			 
			 
			 upload_file_list: {
			 	type: Array,
			 	default: function() {
			 		return [];
			 	},
			 	required: false,
			 },
			 
			 
			 */




		},
		data() {
			return {
				// 配置项
				form_fields: [],
				//
				show: false,
				form_mode: '', //add || edit
				edit_info: {}, //待编辑的数据信息
				tree_field_title_map: {
					// column: title
				}, //树形组件数据设置
				is_allow_submit: false, //按钮禁用


				// 上传
				upload_name: "file",
				upload_data: {
					action: 'upload_uploadImg'
				},
				
				upload_result_map: {
					'key': []
				},
				//
				dialogImageUrl: "",
				dialogVisible: false,
				// 上传
				//
				//
				//
				//
				//
				//

				mode: "", // 增 || 改

				form: {

				},

				cacheMap: {
					//图片上传类型用来回显数据使用
					key: "",
				},

				datetimePickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now();
					},
				},




				richEditorConfig: {},
				tinyIdList: [],

				// 标签
				tagList: [],
				tagInputVisible: false,
				tagInputValue: "",
				tagInputRef: "tagInputRef",
				// 标签

				// 级联选择
				cascaderOptions: [],
				// 级联选择

				// 树形选择
				treeData: [],
				treeProps: {
					label: "label",
					children: "children",
				},
				treeShowCheckbox: false,
				treeNodeKey: "value",
				defaultExpandAll: true,
				treePopWidth: "",
				treeSelectTitle: "",
				// 树形选择
			};
		},
		computed: {
			is_add() {
				return this.form_mode == 'add';
			},
			modal_title() {
				return this.is_add ? '新增' : '编辑'
			}
		},
		watch: {
			show(val) {
				if (val) {
					this.$nextTick(() => {
						var $popBox = document.querySelector(
							'.modal-custom-base .tree-box'
						);
						if ($popBox) {
							this.treePopWidth = $popBox.getBoundingClientRect().width;
						}
					});
				} else {

				}
			},
		},
		methods: {
			initConfig(option) {
				this.api_config = option.api_config || {};
				this.form_fields = option.form_fields || [];
				this.form_fields_default_value = option.form_fields_default_value || {};
				this.form_field_disabled_map = option.form_field_disabled_map || {};
				this.form_field_multiple_map = option.form_field_multiple_map || {};
				this.form_field_input_append_map = option.form_field_input_append_map || {};
				this.radio_options_map = option.radio_options_map || {};
				this.select_config_map = option.select_config_map || {};
				this.tree_config_map = option.tree_config_map || {};
				this.upload_config_map = option.upload_config_map || {};
				this.upload_file_list = option.upload_file_list || [];

				this.$log('表单初始化配置 option', option)
			},

			initAdd() {
				this.form_mode = 'add'
				this.initForm();

				this.$log('弹窗-新增')
			},
			initEdit(row) {
				this.form_mode = 'edit'
				this.initForm(row);

				this.edit_info = row;
				this.$log('弹窗-编辑 row', row)
				for (var key in this.form) {
					this.form[key] = row[key]
				}

				if (this.api_config[this.form_mode].is_query_detail) {
					this.query_detail(row)
				}
			},

			initForm(row = {}) {
				this.show = true;
				let form = {}
				this.form_fields.forEach(v => {
					form[v.field] = ''
				})
				this.form = {
					...form,
					...this.form_fields_default_value
				};
				this.$log('表单', this.form)

				if (this.tree_config_map) {
					let info = {}
					for (var key in this.tree_config_map) {
						let titleKey = this.tree_config_map[key].titleKey || ''
						if (titleKey) {
							info[key] = row[titleKey] || ''
						}
					}
					this.tree_field_title_map = info;
				}
				
				this.$log('tree_field_title_map', this.tree_field_title_map)
			},


			query_detail(row) {
				let {
					url,
					action,
					method,
					id_field
				} = this.api_config['detail'];

				this.$api({
					url: url,
					method: method,
					data: {
						action: action,
						[id_field]: row[id_field]
					},
				}).then((res) => {
					if (res.code == 200) {
						// this.setView();
						let info = res.data;
						let form = {};
						let upload_result_map = {}

						this.form_fields.forEach(item => {
							let {
								field,
								form_render_type
							} = item;
							let value = info[field];
							if (form_render_type == 'image' || form_render_type == 'image-list') {
								form[field] = value;
								if (value) {
									let url_list = []
									if (typeof value == 'string') {
										url_list = value.split(',')
									} else if (typeof value == 'object') {
										url_list = value
									}
									upload_result_map[field] = url_list.map(v => ({
										name: v,
										url: v,
										response: {
											data: {
												name: v,
												url: v,
											}
										}
									}))
								} else {
									upload_result_map[field] = []
								}
							} else {
								form[field] = value
							}
						})

						this.upload_result_map = upload_result_map;
						this.form = form;

						//树形组件数据 需要接口返回id对应的属性值
						// if(this.tree_config_map) {
						//   let info = {}
						//   for(var key in this.tree_config_map) {
						//     info[key] = ''
						//   }
						//   this.tree_field_title_map = info;
						// }
					}
				});
			},

			async init(row) {
				this.show = true;
				if (row) {
					this.$log('表格行编辑 row', row)
					for (var key in this.form) {
						this.form[key] = row[key]
					}
				}
			},
			onclose() {
				console.warn("1 onclose");
			},
			onclosed() {
				console.warn("2 onclosed");

				for (var key in this.form) {
					this.form[key] = "";
				}
				this.upload_result_map = {};
				this.tree_field_title_map = {}
			},

			get_form_params() {
				let empty_item = null;


				let {
					url,
					action,
					method,
					id_field
				} = this.api_config[this.form_mode];
				let edit_params = {};
				if (this.form_mode == 'edit') {
					edit_params = {
						[id_field]: this.edit_info[id_field]
					}
				}


				let spec_params = {}; //特殊保存参数
				this.form_fields.forEach((item) => {
					let {
						field
					} = item
					if (item.form_render_type == 'image') {
						let fileList = this.upload_result_map[field] || []
						spec_params[field] = fileList.map(v => v.response.data.url).join(',')
					} else if (item.form_render_type == 'image-list') {
						let fileList = this.upload_result_map[field] || []
						spec_params[field] = fileList.map(v => v.response.data.url).join(',')
					}
				});

				let params = {
					action: action,
					...this.form,
					...edit_params,
					...spec_params
				};
				console.log("表单项提交 params", {
					...params
				});

			
			
			return params
				
				
				
				
				//return;
				// this.is_allow_submit = true
				// this.showLoading();
				// this.$api({
				// 	url: url,
				// 	method: method,
				// 	data: params,
				// }).then((res) => {
				// 	this.hideLoading();
				// 	setTimeout(() => {
				// 		alert(res);
				// 	}, 200)

				// 	if (res.code == 200) {
				// 		this.show = false;
				// 		this.$emit("confirm");
				// 	}
				// 	this.is_allow_submit = false
				// });
			},

			// 图片上传
			//上传
			handle_upload_image_request(uploadInfo, formItem) {
				console.warn("handle_upload_image_request uploadInfo", uploadInfo);
				console.warn("handle_upload_image_request formItem", {
					...formItem
				});

				const formData = new FormData();
				let file = uploadInfo.file;
				formData.append("file", file);

				this.$apiUploadImage(formData).then((res) => {
					console.warn("图片上传res", res);
					let {
						type,
						saveFormat,
						col
					} = formItem;

					if (res && res.code == 200) {
						let url = res.url;

						if (type == "upload-image") {
							//图片上传
							if (saveFormat == "jsonObjectArray") {
								//多图上传
								let imageList = this.form[col];
								let item = {
									uid: file.uid,
									name: file.name,
									url: url
								};
								this.form[col] = [...imageList, item];
							} else if (saveFormat == "jsonStringArray") {
								let urlArr = this.form[col].split(",");
								urlArr.push(url);

								this.form[col] = urlArr.filter((v) => v).join(",");
							} else {
								this.form[col] = url;
							}
						}
					} else {
						// 测试使用
						let url =
							"http://travel.dx.hdapp.com.cn/statics/2023/12/19/1_20231219113117A024.jpg";
						if (saveFormat == "jsonObjectArray") {
							let imageList = this.form[col];
							let item = {
								name: file.name,
								url: url,
							};
							this.form[col] = [...imageList, item];
						} else if (saveFormat == "jsonStringArray") {} else {
							this.form[col] = url;
						}
					}

					// let name = res.data.name;
					// let path = res.data.path;

					//   console.log("富文本内容", this.content);
					//   const img = this.imgRoot + res.data;
					// success(img);
					// success(path);
				});
			},

			//
			upload_before_upload(file) {
				console.warn("upload_before_upload");
				const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
				return isLt50M;
			},
			upload_on_success(option) {
				let {
					item,
					res,
					file,
					fileList
				} = option
				this.$log("upload_on_success option", option);
				if (res.code == 200) {
					let url = res.url;
					this.upload_result_map[item.field] = fileList;
				} else {
					alert(res)
				}
			},
			upload_on_remove(option) {
				let {
					item,
					file,
					fileList,
				} = option;
				this.$log('upload_on_remove option', option)
				this.upload_result_map[item.field] = fileList;
			},
			upload_on_preview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},


			// 视频上传
			//上传
			handle_upload_video_request(uploadInfo, formItem) {
				console.log('------------------------------');
				console.warn("handle_upload_video_request uploadInfo", uploadInfo);
				console.warn("handle_upload_video_request formItem", {
					...formItem
				});

				const formData = new FormData();
				let file = uploadInfo.file;
				formData.append("file", file);
				this.$apiUploadImage(formData).then((res) => {
					console.warn(" 视频上传res", res);
					if (res.code == 200) {
						let url = res.url;
						this.form[formItem.col] = url;
					}
				});
			},

			handle_upload_video_remove(option) {
				let {
					file,
					fileList,
					formItem
				} = option;
				console.warn("文件移除", file);
				console.warn("文件移除", fileList);
				console.warn("文件移除", {
					...formItem
				});

				let url = file.url;
				if (formitem.form_render_type == "upload-image") {
					//图片上传
					if (formItem.saveFormat == "jsonObjectArray") {
						//多图上传
						let imageList = this.form[formItem.col];
						// if (imageList) {
						//   try {
						//     imageList = JSON.parse(imageList);
						//   } catch (error) {
						//     imageList = [];
						//   }
						// }

						let index = imageList.findIndex((v) => v.url == url);
						if (index >= 0) {
							imageList.splice(index, 1);
						}

						this.form[formItem.col] = [...imageList];
					} else {
						// this.form[formItem.col] = url;
					}
				}
			},

			handle_upload_video_success(res, file) {
				console.warn("视频上传 handle_upload_video_success", res);
				if (res.code == 1) {}
			},
			handle_upload_video_before(file) {
				console.warn("handle_upload_video_before");
				const isLt2M = file.size / 1024 / 1024 < 1000; //文件大小
				return isLt2M;
			},

			videoPreview(item) {
				console.warn("预览视频", {
					...item
				});

			
			},
			//上传
			// 视频上传

			// 选项卡数据


			// 分类节点选择
			//	共三个参数，依次为：
			// 传递给 data 属性的数组中该节点所对应的对象、
			// 节点对应的 Node、
			// 节点组件本身。
			treeNodeClick(obj, node, self, item) {
				console.warn("obj", obj);
				console.warn("node", node);
				console.warn("selfComp", self);
				console.warn("item", {
					...item
				});


				this.form[item.field] = obj.id;
				this.tree_field_title_map[item.field] = obj.title;
				this.$refs["popoverTree"][0].doClose();
				// console.warn("弹窗", );
				this.$log('tree_field_title_map', this.tree_field_title_map)
			},


			// 富文本编辑器内容
			testRichEditor() {
				let richItem = this.formColumns.find((v) => v.type == "rich-editor");
				let item = richItem;
				let vueComponent = this.$refs["tinyRichEditor-" + item.col][0];
				vueComponent.clear();
				console.warn("富文本内容", vueComponent);

				this.form[item.col] = "";
			},
		},
	};
</script>

<style scoped lang="less">
	/deep/ .upload-image .el-upload {
		width: 100px;
		height: 100px;
		line-height: 98px;
	}

	/deep/ .upload-video .el-upload {
		width: 100px;
		height: 100px;
		line-height: 98px;

		background-color: #fbfdff;
		border: 1px dashed #c0ccda;
		border-radius: 6px;
		box-sizing: border-box;
		cursor: pointer;
		vertical-align: top;
	}

	/deep/ .el-upload-list__item {
		background: #eef6ff !important;
		font-size: 16px;
	}

	.video-preview-box {
		margin-top: 20px;
	}





	// 处理表单样式
	.input-items {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding-bottom: 0px;

		.input-item {
			margin-bottom: 20px;
			width: 100%;
			// width: 50%;

			&.hidden-item {
				display: none;
			}

			&:last-child {
				margin-bottom: 0;
			}

			.input-box {
				width: 100%;
				display: flex;
				align-items: flex-start;

				.label {
					height: 32px;
					line-height: 32px;
					min-width: 160px;
					min-width: 100px;
					text-align: right;
					margin-right: 40px;
					font-size: 20px;
					font-size: 14px;
					font-family: PingFang SC;
					color: #666666;

					&.required {
						position: relative;

						&:after {
							content: "*";
							color: #f00;
							position: absolute;
							right: -15px;
							top: 3px;
							// font-weight: bold;
						}
					}
				}
			}

			//输入框组
			.inputs {
				display: flex;
		align-items: center;

				.date-box {
					flex: 1;
				}

				.shuru-box {
					margin-left: 20px;
					flex: 4;
				}
			}

			.val {
				overflow: hidden;
				flex: 2;
				font-size: 20px;
				font-family: PingFang SC;
				color: #000000;

				&[data-type="treeSelect"] {
					overflow: visible;
				}

				.shuru {
					width: 100%;
					padding-left: 20px;
					outline: none;
					height: 40px;
					background: #ffffff;
					border: 1px solid #d4d8eb;
					border-radius: 4px;
					font-size: 16px;
				}

				.form-ele {
					.el-input {
						width: 100%;
					}

					.el-select {
						width: 100%;
					}

					.el-cascader {
						width: 100%;
					}
				}
			}
		}
	}

	// 页签
	.tab-card-box {
		margin-top: 20px;

		.loop-add {
			margin-top: 20px;
			text-align: center;
		}
	}

	// 标签输入
	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.el-tag+.button-new-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 120px !important;
		margin-left: 0;
		vertical-align: bottom;
	}

	.el-tag+.input-new-tag {
		margin-left: 15px;
	}

	// 标签输入

	// 树形选择
	.tree-box {
		position: relative;
	}

	// 树形选择
</style>

<style lang="less">
	.pop-tree {
		// position: absolute;
		z-index: 10;
		left: 0;
		right: 0;
		top: 32px;
		max-height: 300px;
		max-height: 400px;
		overflow-y: auto;
		// border: 1px solid #ccc;
		border-top: none;

		&::-webkit-scrollbar-thumb {
			border-radius: 3px;
			border: 5px solid #bbb;
			background: #fff;
		}

		&::-webkit-scrollbar {
			width: 5px;
			height: 0px;
		}
	}
</style>