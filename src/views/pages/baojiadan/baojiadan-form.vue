<template>
	<div class="page-wrap">
		<div class="page-inner">
			<div class="view-wrap">
				<div class="base-view">
					<div class="base-row">
						<div class="base-item">
							<div class="act-label">
								企业名称
							</div>
							<div class="act-form">
								<div class="value-text">{{info.companyName}}</div>
							</div>
						</div>
						<div class="base-item">
							<div class="act-label">
								企业ID
							</div>
							<div class="act-form">
								<div class="value-text">{{info.companyId}}</div>
							</div>
						</div>
					</div>
					<div class="base-row">
						<div class="base-item">
							<div class="act-label">
								联系人
							</div>
							<div class="act-form">
								<div class="value-text">{{info.contacts}}</div>
							</div>
						</div>
						<div class="base-item">
							<div class="act-label">
								联系电话
							</div>
							<div class="act-form">
								<div class="value-text">{{info.contactNumber}}</div>
							</div>
						</div>
					</div>
				</div>


				<div class="control-view" data-title="顶部操作栏">
					<div class="control-box">
						<div class="control-left">

						</div>
						<div class="control-right">
							<div class="control-act">
								<el-button type="primary" @click="do_add()">
									设置经营范围
								</el-button>
							</div>
						</div>
					</div>
				</div>

				<div class="table-view" data-title="渲染表格">
					<div class="table-title">
						经营范围信息
					</div>
					<div class="table-box">
						<el-table :data="table_data" stripe border>
							<!-- <el-table-column prop="id" label="ID" width="100"></el-table-column> -->
							<el-table-column prop="rangeId" label="ID" width="100"></el-table-column>
							<el-table-column prop="rangeCode" label="范围分类编号" width="auto">
								<template slot-scope="scope">
									<div class="row-text">
										{{scope.row.operateRange.rangeCode}}
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="rangeName" label="经营范围名称" width="auto">
								<template slot-scope="scope">
									<div class="row-text">
										{{scope.row.operateRange.rangeName}}
									</div>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="操作" width="300">
								<template slot-scope="scope">
									<div class="row-acts">
										<!-- <div class="row-act">
											<el-button @click="do_detail(scope.row)" type="text">查看商品</el-button>
										</div> -->
										<div class="row-act">
											<el-button @click="do_delete(scope.row)" type="text">删除</el-button>
										</div>
									</div>
								</template>
							</el-table-column>
						</el-table>

					</div>
				</div>
				<div class="tool-view">
					<div class="tool-left" data-title="批量操作">

					</div>
					<div class="tool-right">
						<div class="pagi-item">
							<el-pagination :background="true" :total="total" :pager-count="5"
								:current-page="search_params.pageNum" :page-size="search_params.pageSize"
								:page-sizes=" [10, 20, 50, 100, 200]" @size-change="on_pagi_size_change"
								@current-change="on_pagi_current_change"
								layout="total, sizes, prev, pager, next, jumper">
							</el-pagination>
						</div>
					</div>
				</div>
			</div>
		</div>


		<company_set_scope_form_modal ref="company_set_scope_form_modal" @confirm="query_view" />
	</div>
</template>

<script>
	import company_set_scope_form_modal from "./components/company_set_scope_form_modal.vue";
	export default {
		name: "company-list",
		mixins: [],
		components: {
			company_set_scope_form_modal
		},
		data() {
			return {
				id: this.$route.query.id || '',
				table_data: [],
				search_params: {
					companyId: this.$route.query.id || '',
					pageNum: 1,
					pageSize: 100,
				},
				origin_search_params: {},
				total: 0,

				status_options: [{
						value: 0,
						title: '正常'
					},
					{
						value: 1,
						title: '禁用'
					}
				],

				info: {}
			};
		},
		computed: {

		},
		watch: {},
		created() {
			this.set_params()
			this.query_detail()
			this.query_view()
			this.query_options()
		},
		mounted() {

		},
		methods: {
			set_params() {
				this.origin_search_params = {
					...this.search_params
				}
			},

			query_detail() {
				this.$api({
					url: `/company/info/${this.id}`,
					method: 'get',
					data: {

					}
				}).then(res => {
					if (res.code == 200) {
						let data = res.data;
						this.info = data;
					}
				})


			},


			query_view() {
				this.query_list()
			},
			query_list() {
				// this.$api({
				// 	url: '/medicine/operateRange/list',
				// 	method: 'get',
				// 	data: {
				// 		...this.search_params
				// 	}
				// }).then(res => {
				// 	if (res.code == 200) {
				// 		let list = res.rows;
				// 		this.mix_format_list_id(list, 'aa')
				// 		this.total = res.total
				// 		this.$log('数据列表', list)
				// 		this.table_data = list
				// 	}
				// })

				this.$api({
					url: `/company/businessScope/list`,
					method: 'get',
					data: {
						...this.search_params
					}
				}).then(res => {
					if (res.code == 200) {
						let list = res.rows;
						// this.mix_format_list_id(list, 'aa')
						this.total = res.total
						this.$log('数据列表', list)
						this.table_data = list
					}
				})


			},
			query_options() {

			},

			do_search() {
				this.search_params.pageNum = 1;
				this.query_view();
			},
			do_search_reset() {
				// this.search_params.channelId = '';
				// this.search_params.keyword = '';
				this.search_params = {
					...this.search_params,
					...this.origin_search_params,
				}
				this.query_view()
			},
			on_change_status() {
				this.search_params.pageNum = 1;
				this.query_view();
			},
			on_pagi_size_change(value) {
				this.search_params.pageSize = value
				this.search_params.pageNum = 1
				this.query_view();
			},
			on_pagi_current_change(value) {
				this.search_params.pageNum = value
				this.query_view();
			},

			do_import() {
				this.$refs.w_base_import_modal.init();
			},
			do_add() {
				this.$refs.company_set_scope_form_modal.init(this.info);
			},
			do_edit(row) {
				this.$refs.company_set_scope_form_modal.init(row)
			},
			do_delete(row) {
				this.$confirm('确认删除该条记录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api({
						url: `/company/businessScope/delete/${row.scopeId}`,
						method: 'delete',
						data: {

						},
					}).then((res) => {
						alert(res);
						if (res.code == 200) {
							this.query_view();
						}
					});
				}).catch(() => {

				});
			},
			do_detail(row) {
				this.toRoute({
					path: '/company-scope-products',
					query: {
						companyId: this.id,
						rangeId: row.rangeId,
						scopeId: row.scopeId,
						rangeName: row.operateRange.rangeName,
					}
				})
			},
			do_set_scope(row) {
				this.toRoute({
					path: '/',
					query: {

					}
				})
			},
			on_change_switch(row, field_info) {
				this.$log('row', row)
				this.$log('field_info', field_info)
				this.$api({
					url: '/system/dict/type',
					method: 'put',
					data: {
						[this.unique_key]: row[this.unique_key],
						[field_info.field]: field_info.value
					},
				}).then((res) => {
					alert(res);
					if (res.code == 200) {
						this.query_view();
					}
				});
			},
		},
	};
</script>

<style scoped lang="less">
	.view-wrap {
		padding-top: 30px;
	}

	.act-label {
		&::after {
			content: '：';
			padding-right: 4px;
		}
	}


	.base-view {
		.base-row {
			margin-bottom: 20px;
			display: flex;
			flex-wrap: wrap;

			.base-item {
				min-width: 400px;
				line-height: 1.2;
			}

			.base-item {
				margin-bottom: 14px;
				min-width: 400px;
				display: flex;


				.act-label {
					font-size: 14px;
					min-width: 160px;
					text-align: right;
				}


				.act-form {
					font-size: 14px;

					.value-text {
						font-size: 14px;
					}
				}
			}
		}
	}

	// .base-view {
	// 	.base-title {
	// 		margin-bottom: 20px;
	// 		font-size: 14px;
	// 		color: #444;
	// 		font-weight: bold;

	// 	}

	// 	.base-row {
	// 		margin-bottom: 20px;

	// 		// display: flex;
	// 		// flex-wrap: wrap;
	// 		.base-item {
	// 			margin-bottom: 14px;
	// 			min-width: 400px;
	// 			display: flex;


	// 			.act-label {
	// 				font-size: 14px;
	// 				min-width: 160px;
	// 				text-align: right;
	// 			}

	// 			.act-form {
	// 				font-size: 14px;
	// 			}
	// 		}
	// 	}
	// }

	.table-title {
		margin-bottom: 20px;
		font-size: 14px;
		color: #444;
		font-weight: bold;
	}
</style>