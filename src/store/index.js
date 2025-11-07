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
			// state.token = value;
			// localStorage.setItem("token", value);

			let user = data.user;
			let roles = data.roles; //["admin"]
			let role = roles[0] || ''
			let permissions = data.permissions; //[ "*:*:*"]

			//
			state.isLogin = true;
			state.vuex_user = user;
			state.vuex_role = role;
			//
			localStorage.setItem("cache_user", user);
			localStorage.setItem("cache_role", role);
		},


		//设置数据
		setVuexData(state, opt) {
			let {
				key,
				val
			} = opt;
			state[key] = val;
		},
		setAdminAccount(state, data) {
			let {
				token,
				user_id
			} = data;
			state.isLogin = true;
			state.token = token;
			state.user_id = user_id;
			//
			localStorage.setItem("token", token);
			localStorage.setItem("user_id", user_id);
		},
		//设置基本信息
		setAdminUserInfo(state, data) {
			state.isLogin = true;
			state.userInfo = data;
			state.vuex_user = data;

			if (data.isSup) { //超级管理员
				localStorage.setItem('is_limit_auth_route', 0)
			}
			localStorage.setItem("isSup", data.isSup);
			localStorage.setItem("roleId", data.roleId);
			localStorage.setItem("userInfo", JSON.stringify(data));
		},
		//清空登录信息
		clearAdminInfo(state) {
			state.token = "";
			state.user_id = "";
			state.userInfo = {};
			state.isLogin = false;
			localStorage.removeItem("userInfo");
			localStorage.removeItem("token");
			localStorage.removeItem("user_id");
			localStorage.removeItem("roleId");
			localStorage.removeItem("is_auth_refresh");
		},
	},

	actions: {
		async appInit({
			commit,
			state,
			dispatch
		}, data) {
			dispatch("appInitGetAssets");

			localStorage.setItem("is_permission_refresh", 1)
			let token = localStorage.getItem("token");
			if (token) {
				dispatch("getUserloginedInfo");
			} else {}
		},

		//获取登录后的信息
		async getUserloginedInfo({
			commit,
			state,
			dispatch
		}, data) {
			dispatch("getUserInfo");
		},

		//初始化资源
		async appInitGetAssets({
			commit,
			state,
			dispatch
		}, data) {
			//
		},

		// 获取用户信息
		async getUserInfo({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/apiurl',
				method: 'get',
				data: {
					action: "manager_getUserInfo",
				}
			}).then((res) => {
				console.log("动态获取用户信息", res);

				// debugger
				if (res.code == 200) {
					commit("setAdminUserInfo", res.data);
				} else {}

				if (option && option.callback) {
					option.callback(res.data)
				}
			});
		},
	},
});