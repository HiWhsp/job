import Vue from "vue";
import axios from "axios";
import { Message } from "element-ui";
// import store from "@/store";
// import router from "@/router";

import {
  API_ROOT
} from '@/config/env.js'


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
    let {code, Message} = res
    if (code != 200) {
      Message.error(msg);
    }
    // debugger
    return res;
  },
  function (error) {

  }
);


/**
 * 
 * @param {*} option 
 * @returns 
 * 
 *   
 
  this.$api({
        url: "/service.php",
        method: "get",
        data: {
          action: "product_plist",
          name: "",
        },
      }).then((res) => {
        if (res.code == 200) {
          let data = res.data;
        }
      });


 */
function api(option) {
  let url = option.url
  let method = option.method
  let data = option.data || {}
  //
  method = method ? method.toLowerCase() : "get"; //请求方式
  data.userId = localStorage.getItem("userId") || "";
  data.token = localStorage.getItem("token") || "";
  //
  if (process.env.NODE_ENV !== "production") {
    url = API_ROOT + "/service.php";//
    // url =  "/api/" + url;//跨域时 使用代理
  } else {
    url = "/service.php";
  }

  let otherConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    transformRequest: [
      function (data) {
        let ret = "";
        let items = []
        for (let key in data) {
          let str = encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
          items.push(str)
        }
        ret = items.join('&')
        return ret ;
      },
    ]
  };

  if (method == "get") {
    return axios({
      url: url,
      method: method,
      params: data,
      ...otherConfig,
    });

  } else if (method == "post") {
    return axios({
      url: url,
      method: method,
      data: data,
      ...otherConfig,
    });
  }
}

Vue.prototype.$axios = axios;
Vue.prototype.$api = api;

export default {
  api,
};
