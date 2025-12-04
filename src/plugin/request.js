import Vue from "vue";
import axios from "axios";
// import store from "@/store";
// import router from "@/router";
import { Message } from "element-ui";

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
    let { code, msg, message, data } = res    
    if (code != 200) {
      Message.error(msg || message);
      return Promise.reject(res);
    }
    return res;
    // debugger
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
          let value = data[key];
          // 处理数组参数
          if (Array.isArray(value)) {
            // 如果数组元素是对象，则序列化为JSON字符串
            if (value.length > 0 && typeof value[0] === 'object') {
              let str = encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(value))
              items.push(str)
            } else {
              // 如果是简单数组，使用 key[]=value 格式
              value.forEach((item, index) => {
                let str = encodeURIComponent(key + '[]') + "=" + encodeURIComponent(item)
                items.push(str)
              })
            }
          } else if (value !== null && typeof value === 'object') {
            // 处理对象参数，序列化为JSON字符串
            let str = encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(value))
            items.push(str)
          } else {
            // 处理普通值
            let str = encodeURIComponent(key) + "=" + encodeURIComponent(value)
            items.push(str)
          }

        }
        ret = items.join('&')
        return ret;
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

