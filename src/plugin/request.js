import Vue from "vue";
import axios from "axios";
import store from "@/store";
import router from "@/router";


let ApiList_successActionTip = [];
let ApiList_failActionTip = [];

// 添加请求拦截器
axios.interceptors.request.use(
    function (req) {
        // let req_params = req.params;
        // let req_data = req.data;
        // if (!req_params &&  !req_data) {
        //   return false;
        // }
        return req;
        // return res;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response) {
        let res = response.data;
        let {code, data} = res
        if (code === 402) {
            alertErr(res.msg);
            router.push("/login");
            return Promise.reject(res);
        } else if (code === 401) {
            alertErr(res.msg);
            router.push("/login");
            return Promise.reject(res);
        } else {
            return res;
        }
        return res;
    },
    function (error) {
    }
);

function api(action, data, method, uploaderConfig) {
    // 是否是对象
    if (action instanceof Object) {
        data = action.data;
        method = action.method;
        uploaderConfig = action.uploaderConfig;
        action = action.url;
    }

    let option = action;

    let reqUrl = ""; //请求地址
    let reqMethod = method ? method.toLowerCase() : "get"; //请求方式

    let reqData = {};

    for (let dataKey in data) {
        if (data[dataKey] === null || data[dataKey] === undefined) {
            delete data[dataKey];
        } else if (data[dataKey] instanceof Array) {
            const arr = flattenObjectArray(data[dataKey], dataKey);
            data = {
                ...data,
                ...arr,
            };
            delete data[dataKey];
        }
    }

    reqData = {
        userId: localStorage.getItem("user_id") || "",
        token: localStorage.getItem("token") || "",
        ...data,
    }; //请求数据

    if (process.env.NODE_ENV !== "production") {
        reqUrl = "https://zsxhxxpx.dx.hdapp.com.cn/api/"; //请求地址
    } else {
        reqUrl = "https://zsxhxxpx.dx.hdapp.com.cn/api/"; //请求地址
    }

    // debugger
    //axios 配置信息
    //普通请求 使用 x-www 格式
    //上传文件时  使用 formdata
    let otherConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: uploaderConfig
            ? []
            : [
                function (data) {
                    let ret = "";
                    for (let it in data) {
                        ret +=
                            encodeURIComponent(it) +
                            "=" +
                            encodeURIComponent(data[it]) +
                            "&";
                    }
                    return ret;
                },
            ],
    };

    if (reqMethod == "get") {
        return axios({
            url: reqUrl + option,
            method: reqMethod,
            params: uploaderConfig ? data : reqData,
            ...otherConfig,
            ...uploaderConfig,
        });

    } else if (reqMethod == "post") {
        return axios({
            url: reqUrl + option,
            method: reqMethod,
            data: uploaderConfig ? data : reqData,
            ...otherConfig,
            ...uploaderConfig,
        });
    }
}

// 方法：将对象数组展平为键值对
function flattenObjectArray(array, prefix = "items") {
    const result = {};
    array.forEach((obj, index) => {
        Object.keys(obj).forEach((key) => {
            const newKey = `${prefix}[${index}][${key}]`;
            result[newKey] = obj[key];
        });
    });
    return result;
}

Vue.prototype.$axios = axios;
Vue.prototype.$api = api;

export default {
    api,
};
