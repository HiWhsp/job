<template>
	<div class="modal-container">
		<!-- 橱窗产品选择弹窗 -->
		<el-dialog :title="id ? '选择产品' : '选择产品'" width="1000px" custom-class="modal-record" :close-on-click-modal="false"
			:visible.sync="show" :before-close="onModalClose">
			<div class="modal-inner">
				<div class="modal-ctx" v-loading="loading">
					<div class="action-box">
						<div class="action-left">
					
							<div class="filter-item">
								<el-input clearable type="text" v-model="keyword" placeholder="关键字">
								</el-input>
							</div>
							<div class="filter-item">
								<el-button size="small" type="primary" @click="product_search()">搜索</el-button>
							</div>
							<div class="filter-item">
								<el-button size="small" type="warning" @click="product_reset()">重置</el-button>
							</div>
						</div>
						<div class="action-right" v-if="is_multiple_select">
							<el-button size="small" type="primary" @click="confirm_choose()">确认选择</el-button>
						</div>
					</div>


					<div class="table-box">
						<el-table ref="multipleTable" :data="list_product" fit stripe highlight-current-row min-width="100px"
							style="width: 100%" @selection-change="handleSelectionChange1">
							<el-table-column v-if="is_multiple_select" type="selection" width="55"> </el-table-column>

							<el-table-column label="图片" width="80px">
								<template slot-scope="scope">
									<span class="cus-poster">
										<!-- <img :src="'https://omo-oss-image.thefastimg.com/' + scope.row.image_2b5N8b00" alt="" class="cate-poster" /> -->
										<el-image style="width: 30px; height: 30px" :src="scope.row.thumb"
											:preview-src-list="[scope.row.thumb]">
										</el-image>
									</span>
								</template>
							</el-table-column>
							<el-table-column label="产品名称">
								<template slot-scope="scope">
									<span>{{ scope.row.title }}</span>
								</template>
							</el-table-column>
							<el-table-column label="产品规格">
								<template slot-scope="scope">
									<span>{{ scope.row.keyVals }}</span>
								</template>
							</el-table-column>
							<el-table-column label="sn">
								<template slot-scope="scope">
									<span>{{ scope.row.sn }}</span>
								</template>
							</el-table-column>
							<el-table-column label="分类">
								<template slot-scope="scope">
									<span class="cus-miaoshu">{{ scope.row.channelTitle }}</span>
								</template>
							</el-table-column>
							<el-table-column label="零售价">
								<template slot-scope="scope">
									<span class="cus-miaoshu">{{ scope.row.priceSale }}</span>
								</template>
							</el-table-column>

							<el-table-column v-if="!is_multiple_select" fixed="right" label="操作" width="50px">
								<template slot-scope="scope">
									<el-link type="primary" @click="product_choose(scope.row)">选择</el-link>
								</template>
							</el-table-column>
						</el-table>
					</div>

					<!-- v-if="false" -->
					<div class="pagination-box">
						<div class="page-left">
							<el-checkbox v-model="checkedAll" @change="changeAll">全选</el-checkbox>
						</div>
						<div class="page-right">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
								:current-page="pagination.page" :page-sizes="[10, 20, 30, 40]" :page-size="pagination.pagesize"
								layout="total, sizes, prev, pager, next, jumper" :total="count">
							</el-pagination>
						</div>
					</div>
				</div>
			</div>

			<!-- <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="confirm_choose">确认</el-button>
      </span> -->
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";

	export default {
		name: "modal-hetong",
		components: {},
		props: [""],
		data() {
			return {
				show: false,
				select_items: [],
				is_multiple_select: true,//是否开始多选
				//
				
				
				loading: false,
				id: "",

				// 产品列表
				list_product: [],
				pagination: {
					pageNum: 1,
					pageSize: 100,
				},
				count: 0,

				keyword: '',
				

				// 分类搜索
				cateProps: {
					checkStrictly: true,
					value: "id",
					label: "categoryName",
					children: "childList",
				},
				searchCate: [],
				listCate: [],
				// 分类搜索

				keyword: "",
				checkedAll: false,

				//
				tree_field_title_map: {
					'channelId': '',
				},
				tree_config_map: {
					'channelId': {
						api: {
							url: '/apiurl',
							method: 'get',
							data: {
								action: 'product_getProductChannelList',
								page: 1,
								pageNum: 100,
								position: 0
							},
						},
						treeData: [],
						treeProps: {
							label: "title",
							children: "child",
						},
						treeShowCheckbox: false,
						treeNodeKey: "id",
						defaultExpandAll: true,
						titleKey: 'channelTitle',
						resHasPagination: true, //是否存在分页
					},
					// 'brandId': {
					// 	api: {
					// 		url: '/apiurl',
					// 		method: 'get',
					// 		data: {
					// 			action: 'product_getProductBrandList',
					// 			page: 1,
					// 			pageNum: 100,
					// 			position: 0
					// 		},
					// 	},
					// 	treeData: [],
					// 	treeProps: {
					// 		label: "title",
					// 		children: "child",
					// 	},
					// 	treeShowCheckbox: false,
					// 	treeNodeKey: "id",
					// 	defaultExpandAll: true,
					// 	titleKey: 'channelTitle',
					// 	resHasPagination: true, //是否存在分页
					// }
				}

			};
		},
		computed: {},
		watch: {
			show(val) {
				if (!val) {
					this.searchCate = "";
					this.list_product = [];
					this.keyword = "";
					this.pagination = {
						pageNum: 1,
					pageSize: 10,
					};
					// this.listCate = [];
				}
			},

			selectLevel1(val) {
				console.log("一级分类", val);

				let selectObj = this.level1Cates.find((v) => v.id == val);
				if (selectObj) {
					this.level2Cates = selectObj.childList;
				}
			},

			selectLevel2(val) {
				console.log("2级分类", val);

				let selectObj = this.level2Cates.find((v) => v.id == val);
				if (selectObj) {
					this.level3Cates = selectObj.childList;
				}
			},
		},

		created() {
			this.query_tree_config()
		},

		methods: {
			init(option) {
				this.show = true;
				
				if(option) {
					if(option.max_select_number == 1) {
						this.is_multiple_select = false
					}
				}
				
		
				this.queryCate();
				this.setView();
			},



			query_tree_config() {
				if (this.tree_config_map) {
					for (var key in this.tree_config_map) {
						let tree_config = this.tree_config_map[key];

						this.query_tree_item(tree_config)
					}
				}
			},

			query_tree_item(tree_config) {
				let {
					url,
					method,
					data,
				} = tree_config.api || {}
				this.$api({
					url: url,
					method: method,
					data: {
						...data,
					},
				}).then((res) => {
					if (res.code == 200) {
						this.$log('查询tree 数据', res.data)
						if (tree_config.resHasPagination) {
							tree_config.treeData = res.data.list;
						} else {
							tree_config.treeData = res.data;
						}
					}
				});
			},
			
			
			// 分类节点选择
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
			//数据查询


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
			product_search() {


				this.setView();
			},
			product_reset() {

				this.keyword = "";
				this.setView();
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
				this.$log("产品选择", item);
				this.$emit('confirm', item)
				this.show =false;
			},


			queryCate() {
				this.$api("getProductCategory", {}).then((res) => {
					console.log("产品分类", res);
					let {
						code,
						data,
						count
					} = res;
					if (code == 0) {
						this.loading = false;
						this.listCate = data;
						this.level1Cates = data;
					}
				});
			},

			setView() {
				this.$api({
					url: '/apiurl',
					method: 'get',
					data: {
						action: "product_getInventoryList",
						...this.pagination,
						keyword: this.keyword || '',
						channelId: this.channelId || '',
						// query: queryStr,
					}
				}).then((res) => {
					console.log("产品列表", res);

					if (res.code == 200) {
						let data = res.data
						this.loading = false;
						this.list_product = data.list;
						this.count = data.count;
					}
				});
			},

			onModalClose() {
				this.show = false;
			},

			//产品选择
			confirm_choose() {
				console.log("this.list_product", this.list_product);
				if (!this.select_items.length) {
					alertErr("请选择产品");
					return;
				}

				this.$emit('confirm', this.select_items)
				this.show = false;
			},
		},
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	/deep/ .el-dialog {
		margin-top: 3vh !important;
	}

	.pagination-box {
		padding-top: 10px;
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

		.action-right {}
	}

	.input-box-margin {
		padding: 10px;

		&:nth-child(2n) {
			background: #f9f9f9;
		}

		.label {
			padding-top: 0 !important;
		}
	}

	.section-title {
		padding: 10px 10px;
		background: #eee;
		display: flex;
		align-items: center;

		.title-text {
			margin-right: 30px;
		}

		/deep/ .el-checkbox {
			margin-bottom: 0;
		}
	}

	.section-ctx {
		// margin-bottom: 30px;
		// padding: 10px 25px;
		// border: 1px solid #eee;

		&:last-child {
			margin-bottom: 10px;
		}
	}

	.fapiao-info {
		padding: 0 40px;

		.item {
			margin-bottom: 20px;
			display: flex;
			// justify-content: space-between;
			align-items: center;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.tip-box {
		margin-top: 10px;
		font-size: 12px;
		color: #888;
	}

	/deep/ .modal-record {
		// margin-top: 80px !important;

		.modal-inner {
			padding: 10px;
			padding-bottom: 0 !important;
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

				&+button {
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