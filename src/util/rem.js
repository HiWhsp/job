// function setRem() {
// 	let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
// 	let htmlDom = document.querySelector('html')
// 	htmlDom.style.fontSize = htmlWidth / 10 + 'px'
// }
// setRem();
// window.onresize = function () {
// 	setRem()
// }



(function () {
    function setRootFontSize() {
        let dpr, rem, scale, rootWidth;
        let rootHtml = document.documentElement;
    
        dpr = window.devicePixelRatio || 1; //移动端必须设置
        //限制展现页面的最小宽度
        rootWidth = rootHtml.clientWidth;
        rem = rootWidth * dpr / 7.5; // 19.2 = 设计图尺寸宽1920 / 100（设计图的rem = 100）
        scale = 1 / dpr;
    
        // 设置viewport，进行缩放，达到高清效果 (移动端添加)
        let vp = document.querySelector('meta[name="viewport"]');
        vp.setAttribute('content', 'width=' + dpr * rootHtml.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');
    
        // 动态写入样式
        rootHtml.style.fontSize = `${rem}px`;
    }
    setRootFontSize();
    window.addEventListener("resize", setRootFontSize, false);
    window.addEventListener("orientationchange", setRootFontSize, false); //移动端
})();