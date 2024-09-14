import Vue from "vue";
import axios from "axios";
// import store from "@/store";
// import router from "@/router";



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
    // debugger
    // if (res && (code == 2 || code == -1 || code == -2)) {
    //   //微信授权项目 重新微信授权
    //   //非微信授权登录项目  跳转登录页
    //   if (store.state.is_weChat_auth) {
    //     res.message = "登录过期或未登录，请您先登录";
    //     store.commit("clear_loginInfo"); //清除登录数据
    //   } else {
    //     res.message = "登录过期或未登录，请您先登录";
    //     store.commit("clear_loginInfo"); //清除登录数据

    //     // 开发时需取消注释
    //     // router.push({
    //     //   path: "/login",
    //     //   query: {
    //     //     mode: "noLogin",
    //     //   },
    //     // });
    //   }
    // } else if (res && code == 0) {
    //   //操作失败提示
    //   let is_upload = response.config.data instanceof FormData;
    //   let actionStr = "";
    //   let actionName = "";
    //   if (is_upload) {
    //     actionStr = "";
    //     actionName = "index_upload";
    //   } else {
    //     actionStr = response.config.data
    //       .split("&")
    //       .find((v) => v.includes("action"));
    //     actionName = actionStr.split("=")[1];
    //   }

    //   if (actionName) {
    //     if (ApiList_failActionTip.includes(actionName)) {
    //       alertErr(res.data.message);
    //     }
    //   }
    // } else if (data && data.code == 200) {
    //   //操作成功提示
    //   let is_upload = res.config.data instanceof FormData;
    //   let actionStr = "";
    //   let actionName = "";
    //   let _no_tip_str = "";
    //   let _no_tip = "";

    //   if (is_upload) {
    //     actionStr = "";
    //     actionName = "index_upload";
    //   } else {
    //     let arr_params = res.config.data.split("&");
    //     actionStr = arr_params.find((v) => v.includes("action"));
    //     actionName = actionStr.split("=")[1];

    //     _no_tip_str = arr_params.find((v) => v.includes("_no_tip"));
    //     if (_no_tip_str) {
    //       _no_tip = _no_tip_str.split("=")[1];
    //     }
    //   }
    //   if (actionName) {
    //     if (ApiList_successActionTip.includes(actionName) && _no_tip != 1) {
    //     }
    //   }
    // }

    return res;
    // return res;
  },
  function (error) {
    //console.log("-------------- axios拦截 error----------------");
  }
);

function api(action, data, method, uploaderConfig) {
  // console.log("接口请求", action);

  let option = action;

  let reqUrl = "/api/service.php"; //请求地址
  let reqMethod = method ? method.toLowerCase() : "get"; //请求方式

  let reqData = {};
  if (typeof action == "object") {
    method = option.method;
    reqData = option.data; //请求数据

    reqData.userId = localStorage.getItem("user_id") || "";
    reqData.token = localStorage.getItem("token") || "";
  } else {
    reqData = {
      action: action,
      userId: localStorage.getItem("user_id") || "",
      token: localStorage.getItem("token") || "",
      ...data,
    }; //请求数据
  }

  if (process.env.NODE_ENV !== "production") {
    reqUrl = "/api/service.php";
    reqUrl = "http://fujunjixie.dx.hdapp.com.cn/service.php"; //请求地址
  } else {
    reqUrl = "/service.php";
    reqUrl = "http://fujunjixie.dx.hdapp.com.cn/service.php"; //请求地址
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
    // return axios({
    //   url: reqUrl,
    //   method: reqMethod,
    //   params: reqData,
    //   ...otherConfig,
    //   ...uploaderConfig,
    // });

    // return axios.get(reqUrl, {
    //   params: reqData,
    // });
    return axios({
      url: reqUrl,
      method: reqMethod,
      params: uploaderConfig ? data : reqData,
      ...otherConfig,
      ...uploaderConfig,
    });

  } else if (reqMethod == "post") {
    return axios({
      url: reqUrl,
      method: reqMethod,
      data: uploaderConfig ? data : reqData,
      ...otherConfig,
      ...uploaderConfig,
    });
  }
}

Vue.prototype.$axios = axios;
Vue.prototype.$api = api;

export default {
  api,
};
