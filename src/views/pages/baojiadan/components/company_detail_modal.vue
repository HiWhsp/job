<template>
	<div class="custom-form-modal">
		<el-dialog :title="is_edit ? '查看详情' : '查看详情'" width="1000px" custom-class="modal-form"
			:close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="show_modal"
			:append-to-body="true" @closed="on_dialog_closed()">
			<div class="modal-ctx" data-type="基础表单弹窗">

				<div class="f-list">
					<div class="f-item">
						<div class="f-label ">
							企业ID
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.companyId}}</div>
						</div>
					</div>
					<div class="f-item">
						<div class="f-label ">
							企业名称
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.companyName}}</div>
						</div>
					</div>
					<div class="f-item">
						<div class="f-label ">
							联系人
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.contacts}}</div>
						</div>
					</div>
					<div class="f-item">
						<div class="f-label ">
							联系电话
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.contactNumber}}</div>
						</div>
					</div>

					<div class="f-item">
						<div class="f-label">
							经营范围
						</div>
						<div class="f-ele">
							<div class="value-text">
								<!-- <span v-for="(item, index) in range_list">
									{{item.operateRange && item.operateRange.rangeName}}
								</span> -->
								{{range_text}}
								<!-- {{info.fanwei || ''}} -->
							</div>
						</div>
					</div>
					<div class="f-item">
						<div class="f-label ">
							地址
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.address}}</div>
						</div>
					</div>
					<div class="f-item">
						<div class="f-label ">
							邮箱
						</div>
						<div class="f-ele">
							<div class="value-text">{{info.email}}</div>
						</div>
					</div>

					<div class="f-item">
						<div class="f-label ">
							营业执照
						</div>
						<div class="f-ele">
							<div class="value-pic-list">
								<div class="row-pic">
									<el-image fit="cover" :src="info.businessLicense"
										:preview-src-list="[info.businessLicense]" style="width: 200px; height: 200px;">
									</el-image>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="show_modal = false">关闭</el-button>
				<!-- <el-button type="primary" :loading="loading" @click="throttle_do_submit()">确定</el-button> -->
			</span>
		</el-dialog>

		<el-dialog :visible.sync="is_preview_image">
			<img width="100%" :src="preview_image_src" alt="">
		</el-dialog>
		<el-dialog :visible.sync="is_preview_video">
			<video width="100%" :src="preview_video_src" controls alt="" />
		</el-dialog>
	</div>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		name: "form-modal",
		components: {

		},
		data() {
			return {
				unique_key: 'companyId',
				show_modal: false,
				is_edit: false, //新增 编辑
				row: {},
				info: {},
				form: {
					"companyName": "",
					"companyCode": "",
					"contacts": "",
					"contactNumber": "",
					"businessLicense": "",
					"address": "",
					"email": "",
				},
				origin_form: {},
				loading: false,

				//
				range_list: [],
				range_text: '',

				//
				is_preview_image: false,
				preview_image_src: '',
				is_preview_video: false,
				preview_video_src: '',
			};
		},
		computed: {},
		watch: {

		},
		created() {
			this.set_params()
			this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000);
		},
		methods: {
			set_params() {
				this.origin_form = {
					...this.form
				}
			},

			init(row) {
				if (row) {
					this.row = row || {}
					this.info = row;
					this.is_edit = true;
					this.query_detail()
				}

				this.show_modal = true;

				this.query_options()
			},

			query_detail() {
				this.$api({
					url: `/company/info/${this.row.id}`,
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

			query_options() {
				this.query_range()
			},

			query_range() {
				this.$api({
					url: `/company/businessScope/list`,
					method: 'get',
					data: {
						pageNum: 1,
						pageSize: 100,
						companyId: this.row.companyId
					}
				}).then(res => {
					if (res.code == 200) {
						let list = res.rows;

						this.range_list = list

						let range_text_list = list.map(v => v.operateRange && v.operateRange.rangeName)
						this.range_text = range_text_list.join(',')
					}
				})
			},


			// on_before_close() {
			// 	this.show_modal = false;
			// },
			on_dialog_closed() {
				this.row = {}
				this.is_edit = false;
				this.form = {
					...this.origin_form
				}

				// for (var field in this.upload_file_list_map) {
				// 	this.upload_file_list_map[field] = []
				// }
				this.upload_file_list_map = JSON.parse(JSON.stringify(this.origin_upload_file_list_map))
			},
			do_submit() {
				if (!this.form.rangeName) {
					return alertErr("请填写" + '分类名称');
				}


				let params = {
					...this.form,
				}
				if (this.is_edit) {
					params[this.unique_key] = this.row.id
				}


				this.loading = true;
				this.$api({
					url: '/medicine/operateRange',
					method: this.is_edit ? 'put' : 'post',
					data: params
				}).then(res => {
					alert(res).then(() => {
						this.loading = false;
					});
					if (res.code == 200) {
						this.$emit('confirm')
						this.show_modal = false
					}
				})

			},

		},
	};
</script>

<style scoped lang="less">
	@import "~@/config/style/modal-form-style.less";


	.value-text {
		padding: 6px 0;
	}
</style>