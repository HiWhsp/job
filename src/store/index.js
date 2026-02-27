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
		vuex_user: (() => {
			try {
				const user = localStorage.getItem("vuex_user");
				return user ? JSON.parse(user) : {};
			} catch (e) {
				return {};
			}
		})(),
		vuex_depart_list: (() => {
			try {
				const list = localStorage.getItem("vuex_depart_list");
				return list ? JSON.parse(list) : [];
			} catch (e) {
				return [];
			}
		})(),
		token: localStorage.getItem("token") || "",


		//
		defaultAvatar: require("@/assets/avatar.png"),
		user_id: 0,
		userInfo: {},
		isLogin: false,
		vuex_role: (() => {
			try {
				const role = localStorage.getItem("vuex_role");
				if (role) {
					return JSON.parse(role);
				}
				return "";
			} catch (e) {
				const role = localStorage.getItem("vuex_role");
				return role || "";
			}
		})(),
		vuex_red_number: (() => {
			try {
				const num = localStorage.getItem("vuex_red_number");
				return num ? parseInt(num) : 0;
			} catch (e) {
				return 0;
			}
		})(),

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
		set_vuex_role(state, data) {
			if(!data) return;
			state.vuex_role = data;
			localStorage.setItem("vuex_role", JSON.stringify(state.vuex_role));
		},
		set_vuex_red_number(state, data) {
			state.vuex_red_number = data || 0;
			localStorage.setItem("vuex_red_number", JSON.stringify(state.vuex_red_number));
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
			dispatch("getRedNumber");
		},

		// 获取用户信息
		async getUserInfo({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/getUserInfo2',
				method: 'get',
			}).then((res) => {
				if (res.code == 200) {
					commit("set_vuex_user", res.data);
					commit("set_vuex_role", res.data.opRole);
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
				if (res.code == 200) {
					commit("set_vuex_depart_list", res.data);
				} else {}
			});
		},
		async getRedNumber({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/projectList',
				method: 'get',
			}).then((res) => {
				if (res.code == 200) {
					commit("set_vuex_red_number", state.vuex_role.includes("shenhe") ? res.data.num2 : res.data.num1);
				} else {}
			});
		},
	},
});