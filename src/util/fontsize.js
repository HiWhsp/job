// function changeHtmlFontSize() {
//     var scale = document.documentElement.clientWidth / 1920;
//     document.getElementsByTagName('html')[0].style.fontSize = 100 * scale + 'px';
// }
// changeHtmlFontSize();
// window.onresize = changeHtmlFontSize

// PC 端  1rem = 100px;
//手机端  1rem = 100px;

(function (doc, win) {
  console.log('fontsize.js', doc);
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    baseWidth = 1920, // 基准宽度固定为1920
    recalc = function () {
      console.log('recalc', docEl);
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;

      // 始终以1920作为基准计算缩放比例
      var scale = clientWidth / baseWidth;

      // 设置fontSize，1rem = 10px (在1920px宽度下)
      docEl.style.fontSize = 10 * scale + "px";

      // 可选：如果需要整体缩放，可以使用transform scale
      // 但通常使用fontSize缩放已经足够
    };
  if (!doc.addEventListener) return;
  // win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
  // 立即执行一次
  recalc();
})(document, window);
