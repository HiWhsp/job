<template>
	<div class="company-select-wrap">
		<el-select clearable v-model="search_params.labelId" placeholder="请选择" @change="on_change_labelId">
			<el-option v-for="item in labelId_options" :key="item.labelId" :label="item.labelName" :value="item.labelId">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		components: {},
		props: {
			search_params: {
				type: Object,
				default: function() {
					return {};
				},
				required: false,
			},
		},
		data() {
			return {
				labelId_options: [],
			};
		},
		computed: {

		},
		watch: {},
		created() {
			this.query_options()
		},
		methods: {
			query_options() {
				this.query_tag_options()
			},
			query_tag_options() {
				this.$api({
					url: '/medicine/medicineLabel/list',
					method: 'get',
					data: {
						pageNum: 1,
						pageSize: 100,
					}
				}).then(res => {
					if (res.code == 200) {
						let list = res.rows;
						this.mix_format_list_id(list, 'labelId')
						this.labelId_options = list;
						this.$log('数据列表', )
					}
				})
			},
			on_change_labelId() {
				this.search_params.pageNum = 1;
				// this.query_view();
				this.$emit('confirm')
			},
		},
	};
</script>

<style scoped lang="less">

</style>