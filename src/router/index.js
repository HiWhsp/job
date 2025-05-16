import Vue from "vue";
import store from "../store/index";
import VueRouter from "vue-router";

// 解决报错
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch((err) => err);
};
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
	if (onResolve || onReject)
		return originalReplace.call(this, location, onResolve, onReject);
	return originalReplace.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);


const pages = () => import("@/views/test/pages.vue");
const layout = () => import("@/views/layout.vue");
const login = () => import("@/views/pages/account/login.vue"); //登录
const retireve = () => import("@/views/pages/account/retrieve.vue"); //登录
const my_info = () => import("@/views/pages/account/my-info.vue"); //登录
const my_password = () => import("@/views/pages/account/my-password.vue"); //登录

const baojiadan_list = () => import("@/views/pages/baojiadan/baojiadan-list.vue"); //
const baojiadan_form = () => import("@/views/pages/baojiadan/baojiadan-form.vue"); //
const baojiadan_success = () => import("@/views/pages/baojiadan/baojiadan-success.vue"); //
const baojiadan_preview = () => import("@/views/pages/baojiadan/baojiadan-preview.vue"); //

const routes = [
	{
		path: "/pages",
		name: "pages",
		component: pages,
		meta: {
			title: "pages",
		},
	},
	{
		path: "/",
		name: "index",
		component: login,
		meta: {
			title: "网站概览",
			deep: 1,
		},
	},
	{
		path: "/login",
		name: "login",
		component: login,
		meta: {
			title: '登录'
		},
	},
	{
		path: "/retireve",
		name: "retireve",
		component: retireve,
		meta: {
			title: '忘记密码'
		},
	},
	// {
	// 	path: "/",
	// 	name: "index",
	// 	component: index,
	// 	meta: {
	// 		title: '概览'
	// 	},
	// },
	{
		path: "/layout",
		name: "layout",
		component: layout,
		meta: {
			title: '内页'
		},
		children: [
			
			{
				path: "/my-info",
				name: "my-info",
				component: my_info,
				meta: {
					root: "我的资料",
					title: "我的资料",
				},
			},
			{
				path: "/my-password",
				name: "my-password",
				component: my_password,
				meta: {
					root: "我的密码",
					title: "我的密码",
				},
			},
			{
				path: "/baojiadan-list",
				name: "baojiadan-list",
				component: baojiadan_list,
				meta: {
					root: "文章管理",
					title: "文章列表",
				},
			},
			{
				path: "/baojiadan-form",
				name: "baojiadan-form",
				component: baojiadan_form,
				meta: {
					root: "文章管理",
					title: "文章分类",
				},
			},
			{
				path: "/baojiadan-success",
				name: "baojiadan-success",
				component: baojiadan_success,
				meta: {
					root: "文章管理",
					title: "文章分类",
				},
			},
			{
				path: "/baojiadan-preview",
				name: "baojiadan-preview",
				component: baojiadan_preview,
				meta: {
					root: "文章管理",
					title: "文章分类",
				},
			},

		],
	},


	{
		path: "*",
		redirect: "/",
	},
];

const scrollBehavior = (to, from, savedPosition) => {
	// console.log('滚动行为', to, from, savedPosition)
	return {
		x: 0,
		y: 0
	};
};

const router = new VueRouter({
	routes,
	base: "/",
	// base: "/admin",
	mode: "history",
	scrollBehavior,
});

router.beforeEach((to, from, next) => {
	let token = localStorage.getItem("token");
	let userId = localStorage.getItem("userId");
	let is_login_curr = token && userId;

	// debugger
	if (!is_login_curr && to.meta.requireAuth) {
		// debugger
		alertErr("请先登录");
		next("/login");
	} else {
		next();
	}
});

router.afterEach((to, from) => {
	// console.log("切换导航, 重新配置微信分享");
	// wxShare.getSign();
});

export default router;