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
            const {user_id} = data;
            localStorage.setItem('userId', user_id)
            state.isLogin = true;
            state.vuex_user = data;
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
        appInit({commit}) {
            api({
                url: 'getUserInfo',
                method: 'get',
            }).then(res => {
                if (res.code === 200) {
                    commit("set_vuex_user", res.data);
                }
            })

        },
    },
});