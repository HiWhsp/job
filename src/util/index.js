export default {
  //压缩图片 base64 文件对象
  /**
   * 接收一个选项对象
   * {
   *  base64:
   *  fileObj: 文件对象
   * }
   */
  compressImg(opt) {
    let that = this;
    let fileObj = opt.fileObj;
    let image = new Image();
    image.src = opt.base64;

    return new Promise(function(resolve, reject) {
      image.onload = function() {
        let name = fileObj.name;
        let size = fileObj.size;
        var width = image.width;
        var height = image.height;
        let isNeedCompress = fileObj.size / 1024 > 200 ? true : false; ////需要压缩图片 条件 > 大于200k
        const scale = Math.sqrt(fileObj.size / (1024 * 200)).toFixed(2); //缩放比例

        //console.log(
          "名称 宽高 大小 信息  ===========》",
          fileObj.name,
          width,
          height,
          fileObj.size,
          isNeedCompress,
          scale
        );
        //console.log("名称", name);
        //console.log("宽", width);
        //console.log("高", height);
        //console.log("大小", size);
        //console.log("是否需要压缩", isNeedCompress);
        //console.log("压缩比例", scale);


        if (isNeedCompress) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let canvasWidth = Math.floor(width / scale);
          let canvasHeight = Math.floor(height / scale);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          //铺底色
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

          let base64Compressed = canvas.toDataURL("image/png", 0.8); //canvas 转 base64
          // //console.log("压缩后的新图片", base64Compressed);

          let fileObjCompressed = that.convertBase64UrlToFile(
            base64Compressed,
            name
          ); //base64 转 文件对象
          // that.uploadImgFn(fileObjCompressed);
          resolve(fileObjCompressed);
        } else {
          // that.uploadImgFn(fileObj);
          resolve(fileObj);
        }

        //console.log("======== 压缩中 ===========");
      };
    });
  },

  //将base64转换为文件
  convertBase64UrlToFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  },

  // 转换文件对象
  convertBase64UrlToBlob(urlData) {
    var bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png", name: "upload_img" });
  },
};
