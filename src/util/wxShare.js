import store from "@/store";
import axios from "axios";

export default {
  //微信授权登录相关
  /**
   *
   */
  isWechat: true, // 是否为微信环境（true：是；false：否）
  wx: {
    wxAppId: "wx2fb0f2d3e8e5dbfd", // 微信公众号 ID
    code: "", // 授权获取的 code
  },
  query: {
    // fromId: "",
    // replaceId: ""
  },


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
    //console.log('store.state.shareInfo', {...store.state.shareInfo})
    let title = store.state.shareInfo.com_title || '';
    let desc = store.state.shareInfo.share_desc || '';

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
        "chooseWXPay",
        "getLocation",
        "updateAppMessageShareData",
        "updateTimelineShareData",
      ], // 必填，需要使用的JS接口列表
    });

    setTimeout(() => {
      wx.ready(function() {
        //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({
          title: title || "海外商城有限公司", // 分享标题
          desc: desc || "海外商城有限公司", // 分享描述
          link:
            "http://web.bio-swamp.com?fromId=" +
            localStorage.getItem("userId"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://web.bio-swamp.com/favicon.ico", // 分享图标
          success: function() {
            // 设置成功
            // alert('分享给好友成功')
          },
          fail(err) {
            // alert("分享失败");
          },
        });

        wx.updateTimelineShareData({
          title: title || "海外商城有限公司", // 分享标题
          link:
            "http://web.bio-swamp.com?fromId=" +
            localStorage.getItem("userId"), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://web.bio-swamp.com/favicon.ico", // 分享图标
          success: function() {
            // 设置成功
            // alert('分享朋友圈成功')
          },
          fail(err) {
            // alert("分享失败");
          },
        });
      });
    }, 0);
  },
};
