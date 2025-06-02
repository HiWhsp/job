<template>
	<div class="modal-custom-base-wrap">
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>



		<el-dialog :title="modalTitle" :width="customModalWidth || '1000px'" custom-class="modal-custom-base"
			:close-on-click-modal="false" :visible.sync="show" :before-close="onModalClose" :append-to-body="true">
			<div class="modal-ctx">
				<div class="input-items" v-if="formColumns.length">
					<div class="input-item" v-for="(item, index) in formColumns" :key="index"
						:style="item.width ? { width: item.width + '%' } : {}" :class="{ 'hidden-item': item.hidden }">
						<div class="input-box" :class="item.col">
							<div class="label" :class="{ required: item.is_required }">
								{{ item.label }}
							</div>

							<div class="val" :data-type="item.type">
								<div class="form-ele">
									<div class="col-text">
										{{ form[item.col] }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 插槽 -->
					<slot name="form"></slot>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="show = false">取 消</el-button>
				<el-button v-if="confirmShow" type="primary" @click="formSubmit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";

	export default {
		name: "modal-content-base",
		components: {

		},
		props: {
			upload_file_list: {
				type: Array,
				default: function() {
					return [];
				},
				required: false,
			},
		},
		data() {
			return {
				mode: "", // 增 || 改
				customModalWidth: "", //自定义模态框 宽度
				customModalTitle: "", //自定义模态框名称  比如 新闻资讯列表展示 设置热搜 弹窗标题
				customFormData: {},
				idKey: "",
				otherSaveData: {},
				formColumns: [
					//参数来源于页面配置
					// { is_required: 1, col: "channelName", label: "标题",  },
				],
				apiConfig: {
					//参数来源于页面配置
					// idKey: "channelId",
					// list: { method: "get", url: "/app/system/newsChannel/list" },
					// add: {
					//   method: "get",
					//   url: "/app/system/newsChannel",
					//
					// },
					// delete: { method: "delete", url: "/app/system/newsChannel/{channelId}" },
					// edit: { method: "put", url: "/app/system/newsChannel" },
					// detail: { method: "get", url: "/app/system/newsChannel/{channelId}" },
				},
				form: {
					//由 formColumns 生成接口
					//key: ''
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

				// 上传
				upload_col_name: "file",
				upload_other_data: {},
				upload_action: '/UPLOAD_url',
				dialogImageUrl: "",
				dialogVisible: false,
				// 上传

				show: false,
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
					children: "child",
				},
				treeShowCheckbox: false,
				treeNodeKey: "value",
				defaultExpandAll: true,
				treePopWidth: "",
				treeSelectTitle: "",
				// 树形选择

				confirmShow: false,
				eventType: "",
			};
		},
		computed: {
			modalTitle() {
				let modeModeMap = {
					add: "新增",
					edit: "编辑",
					detail: "查看",
				};
				let action = modeModeMap[this.mode];
				let title = "";

				if (this.customModalTitle) {
					title = this.customModalTitle;
				} else {
					title = action + this.$route.meta.title;
				}

				return title;
			},
		},
		watch: {
			show(val) {
				if (!val) {
					// this.clearInfo();
				} else {}
			},
		},
		created() {},
		mounted() {},
		methods: {
			clearInfo() {
				for (var key in this.form) {
					this.form[key] = "";
				}

				this.mode = "";
				this.customModalTitle = "";
				this.customFormData = {};
				this.idKey = "";
				this.otherSaveData = {};
				this.formColumns = [];

				//标签
				this.tagList = [];
				this.tagInputVisible = false;
				this.tagInputValue = "";

				// 分类树
				this.treeSelectTitle = "";

				this.confirmShow = false;
			},

			async init(option) {
				console.warn(
					"vuex => vuex_iframe_page_data",
					JSON.parse(JSON.stringify(this.vuex_iframe_page_data))
				);

				console.warn("初始参数 [option]", JSON.parse(JSON.stringify(option)));
				option = JSON.parse(JSON.stringify(option));
				let {
					//
					mode, //操作模式 新增 || 编辑
					customModalWidth, //宽度设置
					customModalTitle, //自定义模态框名称  比如 新闻资讯列表展示 设置热搜 弹窗标题
					customFormData, //自定义模态框保存时要提交的其他数据  比如 新闻资讯列表展示 设置热搜时需要传递的当前新闻id
					idKey, //id对应字段
					formColumns, //接口表单字段
					apiConfig, //接口列表
					data, //数据行信息 => 编辑时用于回显
					otherSaveData, //保存时需要的其他参数值
					confirmShow,
					eventType,
				} = option;

				this.mode = mode || "";
				this.customModalWidth = customModalWidth || "";
				this.customModalTitle = customModalTitle || "";
				this.customFormData = customFormData;
				this.idKey = idKey || "";
				this.otherSaveData = otherSaveData || {};
				this.confirmShow = confirmShow || false;
				this.eventType = eventType || "";

				let hiddenFormData = {};

				this.formColumns = formColumns;
				this.apiConfig = apiConfig;
				this.show = true;

				let res_detail = null;
				if (mode == "detail") {
					let apiConfigItem = this.apiConfig.detail;

					//查看详情接口
					res_detail = await this.$api({
						url: apiConfigItem.url,
						method: apiConfigItem.method,
						data: {
							// ...this.form,
						},
						idInfo: {
							idKey: this.idKey,
							idVal: data[this.idKey],
						},
					});
					if (res_detail.code == 200) {
						data = res_detail.data;
					}
					console.warn("详情 res", res_detail);
				}

				let form = {};
				formColumns.forEach((v) => {
					let key = v.col;
					let val = "";
					if (data) {
						val = data[key];
						form[key] = val;
					} else {
						form[key] = "";
					}
				});

				if (data) {
					//编辑表单
					if (idKey) {
						form[idKey] = data[idKey];
					}
				}

				this.form = {
					...form,
					...hiddenFormData,
				};
				console.warn("表单回显 [form]", {
					...this.form
				});
			},

			formSubmit() {
				this.$emit("eventCallback", {
					type: this.eventType,
					item: {
						...this.form
					},
				});

				this.show = false;
				this.clearInfo();
			},

			onModalClose() {
				this.show = false;

				setTimeout(() => {
					this.clearInfo();
				}, 0);
			},

			videoPreview(item) {
				console.warn("预览视频", {
					...item
				});


			},
			//上传
			// 视频上传
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

	/deep/ .modal-custom-base {
		margin-top: 50px !important;

		.el-dialog__header {
			display: flex;
		align-items: center;
		justify-content: space-between;
			border-bottom: 1px solid #eee;
			// background: #a98c4d;
			// background: #f7f7f7;
			// height: 50px;
			// line-height: 50px;
			// padding: 0 15px;
			// font-size: 14px;
			// color: #333;

			.el-dialog__title {
				color: #000;
			}

			.el-dialog__headerbtn {

				// top: 0;
				.el-dialog__close {
					color: #000;
					font-size: 20px;
					font-weight: bold;
				}
			}
		}

		.el-dialog__body {
			padding: 30px 40px;
			max-height: calc(100vh - 100px - 150px);
			overflow-y: auto;

			&::-webkit-scrollbar-thumb {
				border-radius: 5px;
				border: 8px solid #409eff;
				background: #fff;
			}

			&::-webkit-scrollbar {
				width: 8px;
				height: 0px;
			}
		}

		.el-dialog__footer {
			// text-align: center;
			border-top: 1px solid #eee;
		}
	}

	.modal-ctx {
		// padding: 30px 50px;
		// max-height: 60vh;
		// overflow-y: auto;
		// border-bottom: 1px solid #ddd;
	}

	// 处理表单样式
	.input-items {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding-bottom: 0px;

		/deep/ .input-item {
			margin-bottom: 10px;
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
					// height: 32px;
					// line-height: 32px;
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

					.col-text {
						font-size: 14px;
						font-family: PingFang SC;
						color: #666666;
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

	.button-new-tag {
		margin-left: 10px;
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