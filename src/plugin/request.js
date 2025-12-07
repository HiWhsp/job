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
    // 检查是否为二进制流下载
    const contentType = response.headers['content-type'] || response.headers['Content-Type'] || '';
    const responseType = response.config.responseType;
    const isDownloadRequest = response.config.download === true || responseType === 'blob';
    
    const isBinaryStream = isDownloadRequest ||
                          contentType.includes('application/octet-stream') || 
                          contentType.includes('application/vnd.ms-excel') ||
                          contentType.includes('application/vnd.openxmlformats-officedocument') ||
                          contentType.includes('application/pdf') ||
                          contentType.includes('application/zip');

    // 处理二进制流下载
    if (isBinaryStream) {
      let blob;
      
      // 如果已经是 Blob 对象
      if (response.data instanceof Blob) {
        blob = response.data;
      } 
      // 如果是 ArrayBuffer
      else if (response.data instanceof ArrayBuffer) {
        blob = new Blob([response.data]);
      }
      // 如果是字符串（可能是 base64 或其他格式）
      else if (typeof response.data === 'string') {
        // 尝试将字符串转换为 Blob
        blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
      }
      // 其他情况，尝试直接创建 Blob
      else {
        blob = new Blob([response.data], { type: contentType || 'application/octet-stream' });
      }
      
      // 从响应头中获取文件名
      let fileName = 'download';
      const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
      if (contentDisposition) {
        // 匹配 filename="xxx" 或 filename=xxx 或 filename*=UTF-8''xxx
        const fileNameMatch = contentDisposition.match(/filename\*?=['"]?([^'";\n]+)['"]?/i) || 
                             contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
          // 处理 UTF-8 编码的文件名 (filename*=UTF-8''xxx)
          if (fileName.startsWith("UTF-8''")) {
            fileName = decodeURIComponent(fileName.substring(7));
          }
          // 处理 URL 编码的中文文件名
          else if (fileName.includes('%')) {
            fileName = decodeURIComponent(fileName);
          }
        }
      }
      
      // 如果请求配置中指定了文件名，优先使用
      if (response.config.fileName) {
        fileName = response.config.fileName;
      }

      // 创建下载链接并触发下载
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      // 返回成功信息
      return {
        code: 200,
        msg: '下载成功',
        data: { fileName }
      };
    }

    // 普通响应处理
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
    // 处理错误响应
    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        Message.error('请求的资源不存在');
      } else if (status === 500) {
        Message.error('服务器错误');
      } else if (data && data.msg) {
        Message.error(data.msg);
      } else {
        Message.error('请求失败，请稍后重试');
      }
    } else {
      Message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
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
  let download = option.download || false; // 是否下载文件
  let fileName = option.fileName || null; // 自定义文件名
  let responseType = option.responseType || null; // 响应类型
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

  // 如果是下载请求，设置 responseType 为 blob
  if (download || responseType === 'blob') {
    otherConfig.responseType = 'blob';
    otherConfig.download = true;
    if (fileName) {
      otherConfig.fileName = fileName;
    }
  } else if (responseType) {
    otherConfig.responseType = responseType;
  }

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

