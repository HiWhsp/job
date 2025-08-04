export default {
    // 下载 Excel 方法
    excel (data, fileName) {
        this.download(data, fileName, 'application/vnd.ms-excel')
    },

    // 下载 Word 方法
    word (data, fileName) {
        this.download(data, fileName, 'application/msword')
    },

    // 下载 Zip 方法
    zip (data, fileName) {
        this.download(data, fileName, 'application/zip')
    },

    // 下载 Html 方法
    html (data, fileName) {
        this.download(data, fileName, 'text/html')
    },

    // 下载 Markdown 方法
    markdown (data, fileName) {
        this.download(data, fileName, 'text/markdown')
    },

    // 下载 pdf 方法
    pdf (data, fileName) {
        console.log('data', data)
        console.log('fileName', fileName)
        this.download(data, fileName, 'application/pdf')
    },

    // 下载 图片方法
    png (data, fileName) {
        this.download(data, fileName, 'application/png')
    },

    // 兼容写法
    stream (data, fileName) {
        this.download(data, fileName, 'application/octet-stream')
    },

    download (data, fileName, mineType) {
        // 创建 blob对象
        let blob = new Blob([data], { type: mineType })
        // 浏览器api 有的不支持-二种都写
        window.URL = window.URL || window.webkitURL
        // 获取链接地址-(内容赋值到临时链接)
        let href = URL.createObjectURL(blob)
        // 创建a标签
        let downA = document.createElement('a')
        // 把链接赋值给a标签
        downA.href = href
        // 赋值文件名称
        downA.download = fileName
        // 点击下载
        downA.click()
        // 销毁超连接
        window.URL.revokeObjectURL(href)
    }
}
