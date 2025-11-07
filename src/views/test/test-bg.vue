<template>
	<div class="page-wrap">
		<div class="page-inner">
			<div class="box">
				<div class="center-point"></div>
				<div class="cell"></div>
				<div class="cell cell2"></div>
				<div class="cell cell3"></div>
				<div class="cell cell4"></div>
				<div class="cell cell5"></div>
				<div class="cell cell6"></div>
				<div class="cell cell7"></div>
				<div class="cell cell8"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "banner-list",
		mixins: [],
		components: {

		},
		data() {
			return {
				unique_key: 'companyId',
				table_data: [],
				search_params: {
					
					keyword: '',
					pageNum: 1,
					pageSize: 10,
					order1: '',
					order2: '',
					status: '-1',
					// position: ''
				},
				total: 0,
				
			};
		},
		computed: {

		},
		watch: {},
		created() {
			this.setView()
			this.query_filters()
		},
		mounted() {

		},
		methods: {
			setView() {
				this.query_banner_list()
			},
			query_banner_list() {
				this.$api({
					url: '/apiurl',
					method: 'get',
					data: {
						action: "banner_getBannerList",
						...this.search_params
					}
				}).then(res => {
					if (res.code == 200) {
					this.table_data = res.rows;
						this.mix_format_list_id(this.table_data, this.unique_key)
						this.total = res.total
					}
				})
			},
			query_filters() {
			
			},
			init_query() {
				this.search_params.pageNum = 1;
				this.setView();
			},
			on_size_change(value) {
				console.log('size value', value)
				this.search_params.pageNum = value
				this.search_params.page = 1
				this.setView();
			},
			on_current_change(value) {
				console.log('current value', value)
				this.search_params.page = value
				this.setView();
			},
			do_add() {
				this.$refs.banner_form_modal.init();
			},
			do_row_edit(row) {
				this.$refs.banner_form_modal.init(row)
			},
			do_row_delete(row) {
				this.$confirm('确认删除该条记录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api({
						url: '/apiurl',
						method: 'get',
						data: {
							action: 'banner_delBanner',
							id: row.id,
						},
					}).then((res) => {
						alert(res);
						if (res.code == 200) {
							this.setView();
						}
					});
				}).catch(() => {

				});
			},
		},
	};
</script>

<style scoped lang="less">
	.view-wrap {
		background: #fff;
		padding: 20px;
		border-radius: 6px;
	}


	.box {
		position: relative;
		background: #0f0;
		border-radius: 50%;
		overflow: hidden;
		width: 400px;
		height: 400px;

		.center-point {
			z-index: 2;
			left: 50%;
			top: 50%;
			position: absolute;
			transform: translate(-50%, -50%);
			border-radius: 50%;
			width: 100px;
			height: 100px;
			background: #00f;
		}

		.cell {
			left: 0;
			top: 0;
			position: absolute;
			width: 400px;
			height: 400px;
			background: #f00;
			transform: translate(50%, 50%);
			clip-path: polygon(0% 0%, 100% 50%, 100% 100%, 50% 100%);
		}

		.cell2 {
			transform: translate(50%, 50%) rotate(38deg);
			transform-origin: left top;
		}

		.cell3 {
			transform: translate(50%, 50%) rotate(78deg);
			transform-origin: left top;
		}

		.cell4 {
			transform: translate(50%, 50%) rotate(118deg);
			transform-origin: left top;
		}

		.cell5 {
			transform: translate(50%, 50%) rotate(160deg);
			transform-origin: left top;
		}

		.cell6 {
			transform: translate(50%, 50%) rotate(200deg);
			transform-origin: left top;
		}

		.cell7 {
			transform: translate(50%, 50%) rotate(248deg);
			transform-origin: left top;
		}

		.cell8 {
			transform: translate(50%, 50%) rotate(290deg);
			transform-origin: left top;
		}

	}
</style>