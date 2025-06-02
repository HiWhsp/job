import {
	Loading
} from "element-ui";


import {
	API_ROOT,
	UPLOAD_ROOT,
} from '@/config/env.js'


import {
	mapState
} from "vuex";
export default {
	data() {

		return {
			API_ROOT: process.env.NODE_ENV !== "production" ? API_ROOT : location.origin + '/admin_service.php',

			//
			mix_upload_action: UPLOAD_ROOT,
			mix_upload_name: 'file',
			mix_upload_data: {

			},
			//
			mix_status_options: [{
				value: 0,
				title: '启用',
			},
			{
				value: 1,
				title: '禁用',
			},
			],



			//上传接口字段
			// upload_col_name: "file",
			upload_col_name: "img",

			//上传相关
			uploadAction: API_ROOT,

			// 文件上传处理
			upload_file_url: API_ROOT,
			upload_file_col: "file",
			//文件上传
		};
	},
	computed: {
		...mapState([
			//
			"vuex_user",
			"vuex_h5",
			"vuex_iframe_page_data",
			"userId",
			"token",
			"baseInfo",
			"defaultAvatar",
			"is_login",
			"is_open_oss_upload",
		]),


		mix_upload_headers() {
			let token = localStorage.getItem("token");
			let mix_upload_headers = {
				// "Content-Type": "application/json",
				"Authorization": "Bearer " + token,
			}
			return mix_upload_headers
		},

		//文件上传
		upload_file_data() {
			let token = localStorage.getItem("token");
			return {
				action: "upload_uploadFile",
				token: token,
			};
		},


	},
	created() {
		// console.log('mix_upload_action', this.mix_upload_action)
	},
	mounted() { },
	methods: {
		mix_format_list_id(list, key) {
			list.forEach(v => {
				v.id = v[key]
			})
		},
		mix_format_search_params(params) {
			let new_params = {}
			for (var key in params) {
				if (params[key] !== '') {
					new_params[key] = params[key]
				}
			}
			return new_params
		},

		mix_format_market_request_url(url, search_params) {
			let new_url = url + `?pageNum=${search_params.pageNum}&pageSize=${search_params.pageSize}`
			return new_url
		},

		// 为空的请求参数需要移除
		mix_format_api_request_params(params) {
			for (var key in params) {
				if (params[key] === '') {
					delete params[key];
				}
			}
		},

		//



		showLoading(is_hide) {
			if (is_hide) {
				this.loadingInstance = Loading.service({
					lock: true,
					text: "Loading...",
					spinner: "el-icon-loading",
					background: "rgba(255, 255, 255, .95)",
				});
			} else {
				this.loadingInstance = Loading.service({
					lock: true,
					text: "Loading...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)",
				});
			}
		},
		hideLoading() {
			if (this.loadingInstance) {
				this.loadingInstance.close();
			}
		},

		mix_logout() {
			this.$store.commit("clear_loginInfo");
			alertSucc("已退出登录");
			this.$router.push("/");
		},

		mix_get_token() {
			return localStorage.getItem('token')
		},


		toBack() {
			this.$router.back();
		},
		toLink(item) {
			if (item.url) {
				location.href = item.url;
			}
		},
		toRoute(route) {
			this.$router.push(route);
		},


		// 全局函数节流 - 例如 点击按钮提交表单
		// this.throttle_do_submit = this.mix_throttle(this.do_submit, 1000)
		// this.throttle_do_submit();
		mix_throttle(fun, delay = 1500) {
			let last, deferTimer;
			return function (args) {
				let that = this;
				let _args = arguments;
				let now = +new Date();
				if (last && now < last + delay) {
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fun.apply(that, _args);
					}, delay);
				} else {
					last = now;
					fun.apply(that, _args);
				}
			};
		},

		// 全局函数防抖 - 例如 输入内容时搜索
		mix_debounce(func, wait) {
			console.log("防抖函数");
			let timeout;
			return function () {
				const context = this;
				const args = arguments;
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					func.apply(context, args);
				}, wait);
			};
		},

	},
};