https://docs.qq.com/sheet/DUXZ2Z3FabGJQUENG?no_promotion=1&tab=BB08J2

# 问题汇总
1 注册新增企业注册类型
2 首页写样式
3 详情页改样式
4 补充 5 - 11页面
普通买家个人中心已完成
新增了采购员 采购经理 采购总监部分  这部分针对订单列表 订单详情页面  补充审核操作 
需要新增的大页面  34 企业账号管理  31采购经理采购金额


# 接口文档-前端
https://doc.apipost.net/docs/3f648a4face0000?locale=zh-cn

# 接口地址
http://vuesc.new.zhishangez.com/admin_service.php

# 蓝湖
https://lanhuapp.com/link/#/invite?sid=lx08YFSp


this.$api({
    url: "/service.php",
    method: "get",
    data: {
        action: "index_config",
    },
})

.then(res => {
    if(res.code == 200) {

    } else {

    }
})



# 获取版本号
function getProjectVersion() {
    var date = new Date();
    var year = new Date().getFullYear().toString().substr(2,4)
    var month = new Date().getMonth() + 1
    var day = new Date().getDate()
    var hour = new Date().getHours()
    var miute = new Date().getMinutes()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    hour = hour < 10 ? '0' + hour : hour
    miute = miute < 10 ? '0' + miute : miute
    
    
    var subversion = `${year}${month}${day}${hour}${miute}`
    var version = `1.0.${subversion}`
    console.log(version)
}
getProjectVersion()

