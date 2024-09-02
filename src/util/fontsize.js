// function changeHtmlFontSize() {
//     var scale = document.documentElement.clientWidth / 1920;
//     document.getElementsByTagName('html')[0].style.fontSize = 100 * scale + 'px';
// }
// changeHtmlFontSize();
// window.onresize = changeHtmlFontSize

// PC 端  1rem = 100px;
//手机端  1rem = 100px;

(function(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth >= 2560) {
        docEl.style.fontSize = "200px";
      } else if (clientWidth <= 767) {
        docEl.style.fontSize = 100 * (clientWidth / 750) + "px";

        let scale = clientWidth / 1920;
        var viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute(
          "content",
          `user-scalable=yes, width=device-width, initial-scale=${scale}`
        );
      } else {
        // docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
      }
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
