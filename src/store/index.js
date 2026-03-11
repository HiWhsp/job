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

		//
		vuex_iframe_page_data: {},
		is_open_oss_upload: false, //是否开启oss上传
		// 客户属地下拉
		customerBelongOptions: [
			{ value: 1, name: "国内" },
			{ value: 2, name: "国外" },
		],
		// 客户区域下拉
		customerRegionOptions: [
			{ value: "国外", name: "国外" },
			{ value: "中国各省", name: "中国各省" },
		],
		// 客户属性A下拉
		customerAttrAOptions: [
			{ value: "临床", name: "临床" },
			{ value: "技工", name: "技工" },
			{ value: "临床&技工", name: "临床&技工" },
			{ value: "工业", name: "工业" },
			{ value: "其他", name: "其他" },
		],
		// 客户属性B下拉
		customerAttrBOptions: [
			{ value: "经销商", name: "经销商" },
			{ value: "终端", name: "终端" },
			{ value: "经销商&终端", name: "经销商&终端" },
			{ value: "OEM厂商", name: "OEM厂商" },
			{ value: "其它", name: "其它" },
		],
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
		//清空登录信息
		clearAdminInfo(state) {
			state.vuex_user = {};
			state.vuex_depart_list = [];
			localStorage.removeItem("vuex_user");
			localStorage.removeItem("vuex_depart_list");
			localStorage.removeItem("vuex_role");
			localStorage.removeItem("last_route");
			state.token = "";
			state.vuex_role = "";
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
			// dispatch("getRedNumber");
		},
		// 获取用户信息
		async getUserInfo({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/useGetSysUser',
				method: 'post',
			}).then((res) => {
				if (res.code == 200) {
					commit("set_vuex_user", res.data);
					commit("set_vuex_role", res.data.roleId);
				} else {}
			});
		},
		async getDepartList({
			commit,
			state,
			dispatch
		}, option) {
			api({
				url: '/getSysUserRoleList',
				method: 'post',
			}).then((res) => {
				if (res.code == 200) {
					commit("set_vuex_depart_list", res.data);
				} else {}
			});
		}
	},
});