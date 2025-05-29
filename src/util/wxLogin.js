import store from "@/store";
import wxShare from "@/util/wxShare";


/**
 * 微信公众号获取code及授权处理
 * 注意：页面路径上的自定义带参不要使用code和state，授权时会根据这两个参数处理逻辑
 * 再授权成功，并重定向之后，微信会在重定向路径上带上code和state参数
 */

export default {
  //微信授权登录相关
  /**
   *
   */
  isWechat: true, // 是否为微信环境（true：是；false：否）
  wx: {
    wxAppId: store.state.appid, // 微信公众号 ID
    code: "", // 授权获取的 code
  },
  query: {
    // fromId: "",
    // replaceId: ""
  },

  user_regist() {
    //console.log("== 获取url参数，处理粉丝 ==", {
      ...this.query,
    });

    store.dispatch("users_wxLogin", {
      code: this.wx.code,
      // invite_id: this.query.fromId,
    });

    wxShare.getSign();
  },

  //获取查询参数
  getQueryVariable(variable, url) {
    var query = url.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return "";
  },

  handleAuthorize() {
    //console.log("当前链接", decodeURIComponent(window.location.href));
    let ua = navigator.userAgent.toLowerCase();
    if (String(ua.match(/MicroMessenger/i)) === "micromessenger") {
      this.isWechat = true;
    } else {
      this.isWechat = false;
    }

    let url_str = decodeURIComponent(window.location.search);
    //console.log(
      "========================== 获取邀请人信息 =========================="
    );
    if (url_str.includes("fromId=")) {
      let fromId = this.getQueryVariable("fromId", url_str);
      localStorage.setItem("fromId", fromId);
      //console.log("设置 邀请人id", url_str);
      //console.log("设置 邀请人id", fromId);

      // debugger;
    }

    // return

    if (!this.isWechat) {
      store.dispatch("appInit");
      return;
    }

    /**
     * 检查页面路径带参状况,以此来判断是否授权
     * 授权成功后：重定向路径上会带有相应的参数（code、state）
     * 授权前：页面路径上不会带有code、state参数（个人自定义参数最好不要使用这两个）
     */
    let pagePath = decodeURIComponent(window.location.href); // 页面路径
    let urlArray = pagePath.split("?");
    let WXAuthorize = window.sessionStorage.getItem("hasAuthorize") || false; // 是否已经微信网页授权
    let redirectQuery = ""; // 重定向自定义传参

    // 判断初始路径（授权前）上是否带参，以便之后写入重定向路径中
    // debugger;

    // 带参情况
    if (urlArray.length > 1) {
      let query = urlArray[1].split("#")[0].split("&");
      query.forEach((item) => {
        let queryName = item.split("=")[0];
        let queryValue = item.split("=")[1];

        /**
         * 判断是授权后的重定向，还是授权前
         * true：已授权；false：未授权
         */
        if (WXAuthorize) {
          if (queryName === "state" && queryValue !== "authorize") {
            // queryValue = item.split("=_")[1];

            // 获取自定义参数
            let customQuery = queryValue.split("|");

            customQuery.forEach((queryItem) => {
              let customName = queryItem.split("=")[0];
              let customValue = queryItem.split("=")[1];

              /**
               * 这里根据自己的实际带参情况进行判断
               * 以原始 https://www.baidu.com?a=1&b=2 路径为例
               */
              this.query[customName] = customValue;
            });
          } else if (queryName === "code") {
            // 获取微信授权后的code
            this.wx.code = queryValue;
          }
        } else {
          this.query[queryName] = queryValue;
        }
      });
    }

    // 判断是否已经微信授权
    if (WXAuthorize) {
      window.sessionStorage.removeItem("hasAuthorize");
      this.user_regist();

      return;
    } else {
      !window.sessionStorage.getItem("WXAuthorizeUrl") &&
        window.sessionStorage.setItem("WXAuthorizeUrl", window.location.href);
      // 缓存记录已授权
      window.sessionStorage.setItem("hasAuthorize", "authorize");
      // 处理重定向带参
      for (let i in this.query) {
        if (redirectQuery) {
          redirectQuery += `|${i}=${this.query[i]}`;
        } else {
          redirectQuery += `${i}=${this.query[i]}`;
        }
      }
    }

    // 微信授权路径
    let WXAuthorizeUrl = window.sessionStorage.getItem("WXAuthorizeUrl");
    let appid = this.wx.wxAppId;
    // 授权后重定向的回调链接地址，请使用 urlEncode 对链接进行处理
    let redirectUri = encodeURIComponent(WXAuthorizeUrl);
    let responseType = "code";

    /**
     * 应用授权作用域 snsapi_base、snsapi_userinfo
     * snsapi_base：不弹出授权页面，直接跳转，只能获取用户openid（静默授权）
     * snsapi_userinfo：弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息
     */
    let scope = "snsapi_userinfo";
    // 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
    // let state = redirectQuery || "authorize";
    let state = "authorize";

    // 授权路径
    let authorizeUrl =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      appid +
      "&redirect_uri=" +
      redirectUri +
      "&response_type=" +
      responseType +
      "&scope=" +
      scope +
      "&state=" +
      state +
      "&connect_redirect=1#wechat_redirect";
    // 进行授权操作，获取code信息(code作为换取access_token的票据，每次用户授权带上的code将不一样，code只能使用一次，5分钟未被使用自动过期)
    window.location.href = authorizeUrl;
  },
};
