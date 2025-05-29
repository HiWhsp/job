import store from "@/store";
import axios from "axios";

export default {
  //获取签名
  getSign() {
    let url = window.location.href.split("#")[0];
    // url= 'http://web.bio-swamp.com';
    // //console.log('=== 获取签名的网页地址 ===', url)
    axios({
      url:
        process.env.NODE_ENV !== "production"
          ? "api/wxshare.php?a=wxshare"
          : "/wxshare.php?a=wxshare",
      method: "get",
      params: {
        url: url,
      },
    }).then((res) => {
      this.initWxConfig(res.data);
    });
  },

  //初始化微信配置
  initWxConfig(config) {
    // //console.log("初始化微信配置", config);
    let { appId, timestamp, nonceStr, signature } = config;

    //微信配置
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      jsApiList: [
        "getLocation",
      ], // 必填，需要使用的JS接口列表
    });

    setTimeout(() => {
      wx.ready(function() {
        //需在用户可能点击分享按钮前就先调用
        wx.getLocation({
          type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            //console.log(
              " ******************* 微信获取位置,res *******************",
              res
            );
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            if (latitude && longitude) {
              let location = {
                latitude,
                longitude,
              };
              store.commit("set_location", location);

              // that.query_storeList(location);
            }
          },
        });
      });
    }, 0);
  },
};
