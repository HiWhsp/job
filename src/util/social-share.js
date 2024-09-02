export default {
  // 1.分享到QQ空间接口：https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=你的网址&sharesource=qzone&title=你的分享标题&pics=你的分享图片&summary=你的分享描述信息

  // 2.分享给QQ好友接口：http://connect.qq.com/widget/shareqq/index.html?url=你的分享网址&sharesource=qzone&title=你的分享标题&pics=你的分享图片地址&summary=你的分享描述&desc=你的分享简述

  // 3.分享到新浪微博接口：http://service.weibo.com/share/share.php?url=你的分享网址&sharesource=weibo&title=你的分享标题&pic=你的分享图片&appkey=你的key，需要在新浪微博开放平台中申请

  //分享qq
  share_qq(opt) {
    let defaultOpt = {
      title: "喜桔网",
      summary: "喜桔网",
      desc: "喜桔网",
      fromUrl: "http://www.xiju-china.com",
      // let pics = "http://www.xiju-china.com/logo-black.png";
    };

    let { fromUrl, title, pics, summary, desc } = {
      ...defaultOpt,
      ...opt,
    };

    let shareUrl = `
    http://connect.qq.com/widget/shareqq/index.html?url=${fromUrl}&sharesource=qzone&title=${title}&pics=${pics}&summary=${summary}&desc=${desc}`;
    window.open(shareUrl, '_blank');
  },

  //分享微博
  share_weibo(opt) {
    let defaultOpt = {
      title: "喜桔网",
      url: 'http://www.xiju-china.com',
      // picurl: "http://www.xiju-china.com/logo-black.png",
    };
    let { title, url, picurl } = {
      ...defaultOpt,
      ...opt,
    };


    let shareUrl = `http://v.t.sina.com.cn/share/share.php?title=${title}&url=${url}&content=utf-8&sourceUrl=${url}&pic=${picurl}`
    window.open(shareUrl, "newwindow");
  },
};
