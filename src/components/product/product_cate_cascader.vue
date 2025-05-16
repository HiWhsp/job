<template>
	<div class="product-cate-cascader">
		<el-cascader v-model="cascader_value" :options="product_tree_cates" :props="cascader_props" clearable
			@change="on_cascader_change"></el-cascader>
	</div>
</template>

<script>
import {
	mapState
} from "vuex";
export default {
	name: "product-cate-cascader",
	components: {},
	props: [""],
	data() {
		return {
			product_tree_cates: [],
			product_flat_cates: [],
			cascader_props: {
				value: 'id',
				label: 'title',
				children: 'child',
				multiple: true,
				checkStrictly: true
			},

			cascader_value: ''
		};
	},
	computed: {

	},
	watch: {

	},
	created() {
		this.query_product_cate()
	},
	methods: {
		init(value) {
			this.cascader_value = value
		},

		query_product_cate() {
			this.$api({
				url: '/apiurl',
				method: 'get',
				data: {
					action: "product_getProductChannelList",
				}
			}).then((res) => {
				if (res.code == 200) {
					this.product_tree_cates = res.data.list;
					this.product_flat_cates = this.getFlatFromTree(this.product_tree_cates)
					this.$log('所有产品分类', this.product_flat_cates)
				}
			})
		},

		getFlatFromTree(treeList, flat_list = []) {
			treeList.forEach(v => {
				flat_list.push(v);
				if (v.child && v.child.length) {
					flat_list.push(...v.child)
					this.getFlatFromTree(v.child, flat_list)
				}
			})

			return flat_list
		},


		on_cascader_change(value) {
			let cate_list = []
			let cate_title_list = []
			let cate_id_list = []
			value.forEach(id_arr => {
				let id = id_arr[0]
				let cate = this.product_flat_cates.find(v => v.id == id)
				cate_list.push(cate)
				cate_title_list.push(cate.title)
				cate_id_list.push(cate.id)
			})

			let info = {
				value: value,
				cate_list: cate_list,
				cate_title_list: cate_title_list,
				cate_id_list: cate_id_list
			}
			this.$log('级联选择器 value', value)
			this.$log('级联选择器 info', info)
			this.$emit('confirm', info)
		}
	},
};
</script>

<style scoped lang="less">
.el-cascader {
	width: 100%;
}
</style>