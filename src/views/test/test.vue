<template>
	<div>

	</div>
</template>
<script>
	export default {
		components: {},
		props: [],
		data() {
			return {
				formData: {},
				rules: {},
			}
		},
		computed: {},
		watch: {},
		created() {},
		mounted() {},
		methods: {
			submitForm() {
				this.$refs['elForm'].validate(valid => {
					if (!valid) return
					// TODO 提交表单
				})
			},
			resetForm() {
				this.$refs['elForm'].resetFields()
			},
		}
	}
</script>
<style>
</style>