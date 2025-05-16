<template>
	<div class="company-select-wrap">
		<el-cascader v-model="typeId_value" :options="typeId_options" :props="{
			label: 'typeName',
			value: 'typeId',
			children: 'children',
			checkStrictly: true,
			 }" clearable @change="on_change_typeId"></el-cascader>
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
				typeId_value: '',
				typeId_options: [],
				tree_flat_options: []
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
				this.query_typeId_options()
			},

			query_typeId_options() {
				this.$api({
					url: '/medicine/medicineType/list',
					method: 'get',
					data: {

					}
				}).then(res => {
					if (res.code == 200) {
						let options = res.data;

						let flat_options = []
						this.handle_tree_options({
							tree: options,
							deep: 1,
							parent_item: null,
						}, flat_options)

						this.tree_flat_options = flat_options

						// this.set_cascader_value()

						this.$log('tree-flat-数据', this.tree_flat_options);
						this.typeId_options = options;
					}
				})
			},
			handle_tree_options(option, flat_options) {
				let tree = option.tree || [];
				let deep = option.deep || 1;
				let parent_item = option.parent_item || '';

				// 循环生成 ids_string
				// 循环生成 ids_array

				tree.forEach(son => {
					let ids_array = parent_item ? [...parent_item.ids_array, son.typeId] : [son.typeId];
					son.ids_string = ids_array.join('-')
					son.ids_array = ids_array
					son.deep = deep;

					flat_options.push(son)

					if (son && son.children) {
						this.handle_tree_options({
							tree: son.children,
							deep: deep + 1,
							parent_item: son,
						}, flat_options)
					}
				})
			},

			on_change_typeId(id_array) {
				this.$log('typeId id_array', id_array)
				this.search_params.typeId = id_array[id_array.length - 1];
				// this.query_view();
				this.$emit('confirm')
			},
		},
	};
</script>

<style scoped lang="less">

</style>