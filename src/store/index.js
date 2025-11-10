import Vue from "vue";
import Vuex from "vuex";
// import router from "../router";
import request from "@/plugins/request.js";
const api = request.api;

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		vuex_h5: !!navigator.userAgent.match(
			/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
		),
		//
		vuex_user: {},
		vuex_depart_list: [],
		token: "",


		//
		defaultAvatar: require("@/assets/avatar.png"),
		user_id: 0,
		userInfo: {},
		isLogin: false,

		//
		vuex_iframe_page_data: {},
		is_open_oss_upload: false, //是否开启oss上传
	},

	getters: {},

	mutations: {
		set_vuex_token(state, value) {
			state.token = value;
			localStorage.setItem("token", value);
		},
		set_vuex_user(state, data) {
			state.vuex_user = data;
			localStorage.setItem("vuex_user", JSON.stringify(data));
		},

		set_vuex_depart_list(state, data) {
			state.vuex_depart_list = data;
			localStorage.setItem("vuex_depart_list", JSON.stringify(data));
		},
		//清空登录信息
		clearAdminInfo(state) {
			state.vuex_user = {};
			state.vuex_depart_list = [];
			localStorage.removeItem("vuex_user");
			localStorage.removeItem("vuex_depart_list");
		},
	},

	actions: {
		async appInit({
			commit,
			state,
			dispatch
		}, data) {
			dispatch("getUserInfo");
			dispatch("getDepartList");
		},

		// 获取用户信息
		async getUserInfo({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/getUserInfo',
				method: 'get',
			}).then((res) => {
				console.log("动态获取用户信息", res);

				// debugger
				if (res.code == 200) {
					commit("set_vuex_user", res.data);
				} else {}
			});
		},
		async getDepartList({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/departs',
				method: 'get',
			}).then((res) => {
				console.log("获取部门列表", res);
				if (res.code == 200) {
					commit("set_vuex_depart_list", res.data);
				} else {}
			});
		},

	},
});