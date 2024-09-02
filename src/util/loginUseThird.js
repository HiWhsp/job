export default {
  GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");
    if (arrObj.length > 1) {
      var arrPara = arrObj[1].split("&");
      var arr;
      for (var i = 0; i < arrPara.length; i++) {
        arr = arrPara[i].split("=");

        if (arr != null && arr[0] == paraName) {
          return arr[1];
        }
      }
      return "";
    }
    else {
      return "";
    }
  },

  //微博登录
  //文档 https://open.weibo.com/wiki/Oauth2/authorize
  login_weibo() {
    let opt = {
      client_id: '3364913104',
      redirect_uri: 'http://www.xiju-china.com',
      response_type: 'code',
      display: 'default',
    };

    // let url2= `https://api.weibo.com/oauth2/authorize?client_id=3364913104&redirect_uri=http%3A%2F%2Fwww.jq22.com%2FWeiboReturn.aspx&response_type=code&display=default`
    let url = `https://api.weibo.com/oauth2/authorize?client_id=${opt.client_id}&response_type=${opt.response_type}&redirect_uri=${opt.redirect_uri}&display=${opt.display}`;

    window.location.href = url;
  },
  //QQ登录
  login_qq() {
    let opt = {
      client_id: '101135281',
      redirect_uri: 'http://www.xiju-china.com',
      response_type: 'code',
      scope: 'code',
    };

    var url = `https://graph.qq.com/oauth2.0/authorize?response_type=${opt.response_type}&client_id=${opt.client_id}&redirect_uri=${opt.redirect_uri}&scope=${opt.scope}`;

    window.location.href = url;
  },

  //微信扫码登录
  login_weixin() {
    let opt = {
      appid: 'wx33610b2ef35dc415',
      redirect_uri: encodeURIComponent("http://www.xiju-china.com"),
      response_type: 'code',
      scope: 'snsapi_login',
    };

    let url = `https://open.weixin.qq.com/connect/qrconnect?appid=${opt.appid}&redirect_uri=${opt.redirect_uri}&response_type=${opt.response_type}&scope=${opt.scope}&state=STATE#wechat_redirect`;

    window.location.href = url;
  },

};
