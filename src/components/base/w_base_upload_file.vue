<template>
	<div class="custom-upload">
		<el-upload class="upload-demo" :file-list="fileList" :multiple="false" :limit="1" name="file"
			:action="mix_upload_action" :data="upload_data"
			:on-success="(res,file,fileList) => upload_on_success({res,file,fileList})"
			:on-remove="(file, fileList) => upload_on_remove({ file, fileList})" :before-upload="upload_before_upload"
			:on-preview="upload_on_preview">
			<el-button size="small" type="primary">点击上传</el-button>
			<div slot="tip" class="el-upload__tip">请上传pdf文件</div>
		</el-upload>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "w-base-upload",
		components: {},
		props: {
			pager_count: { //页码按钮的数量，当总页数超过该值时会折叠
				type: Number,
				default: 5
			},
			page_sizes: {
				type: Array,
				default: function() {
					return [10, 20, 50, 100, 200];
				},
			},
		},
		data() {
			return {
				upload_data: {
					action: 'upload_uploadFile'
				},

				upload_result_map: {

				},
				fileList: []
			};
		},
		computed: {

		},
		created() {

		},
		methods: {
			upload_before_upload(file) {
				console.warn("upload_before_upload");
				const isLt50M = file.size / 1024 / 1024 < 50; //文件大小 小于 50MB
				return isLt50M;
			},
			upload_on_success(option) {
				let {
					// item,
					res,
					file,
					fileList
				} = option
				this.$log("upload_on_success option", option);
				if (res.code == 200) {
					let url = res.url;
					this.$emit('uploadChange', url)
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
				// this.upload_result_map[item.field] = fileList;
			},
			upload_on_preview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
		},
	};
</script>

<style scoped lang="less">
	/deep/ .el-upload {
		text-align: left;
	}

	.custom-upload {
		text-align: left;
	}
</style>