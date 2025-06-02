# 后台账号
admin
yjd@2025...


# 药简单管理端页面路由表
[](https://docs.qq.com/sheet/DUU9DbGNUU1ZUZGN3?nlc=1&tab=BB08J2)

# 后台接口
https://apifox.com/apidoc/shared/fb63bceb-a3e9-4622-9803-dcca8d8785f6


# 产品组合


# 微信小程序订单路径
# /pages-pkg-order/pages/order/order-list

# 服务器
47.94.113.30
外网面板地址: http://47.94.113.30:8888/3c25b4b0 
内网面板地址: http://172.16.0.50:8888/3c25b4b0 
username: nymodnvu 
password: ef94cfc5


# 2023-12-26
# 接口文档-后台
https://docs.apipost.cn/preview/fa37bcb873cc1a03/0b7987181693f94f
# 接口文档-营销活动
https://app.apifox.com/project/6170031
# 接口文档-前端
# [](https://console-docs.apipost.cn/preview/07ca75720f2d4f4c/e67c021637d8b435)
# 接口地址
http://vuesc.new.zhishangez.com/admin_service.php

# 开发说明-配置文档说明
# [](https://docs.qq.com/sheet/DUXBzUW5KUXpyc3FJ?u=3f4292adc1a749cc9dcb429fb905d9fc&tab=BB08J2)
# 商城后台vue前端代码配置说明
[](https://docs.qq.com/sheet/DUVdyY2dQa2pTb0VB?tab=BB08J2)


# 图标库
# [](https://icon-sets.iconify.design/clarity/)


# 接口复制
```javascript

this.$api({
	url: '/admin_service.php',
	method: "get",
	data: {
		action: "product_getConfig",
		...params,
	}
})
```


# 配置说明

# 获取接口文档表单字段
var form = {}
var eles = document.querySelectorAll('table')[0].querySelectorAll('tbody tr td:first-child')
for(var i = 0; i< eles.length; i++) {
    var ele = eles[i]
    var colLetter = ele.innerText;
    form[colLetter] = colLetter
}
console.warn('form',JSON.stringify(form))


# 获取接口文档表单字段和保单字段注释

var is_fill_form_value = true;
var form = {};
var form2 = `{`;
var eles = document.querySelectorAll('table')[0].querySelectorAll('tbody tr td:first-child')

var eles_zhushi = document.querySelectorAll('table')[0].querySelectorAll('tbody tr td:last-child')

for(var i = 0; i< eles.length; i++) {
    var ele = eles[i];
    var ele_zhushi = eles_zhushi[i]
    var col = ele.innerText;
    var zhushi = ele_zhushi.innerText;
		
		if(is_fill_form_value) {
			form[col] = zhushi;
			//form2 += `\n "${col}": "${zhushi}",//${zhushi}`
			form2 += `\n "${col}": "${zhushi}",`
		} else {
			form[col] = col;
			//form2 += `\n "${col}": "",//${zhushi}`
			form2 += `\n "${col}": "",`
		}
}
form2 += `\n }`
console.warn(JSON.stringify(form))
//console.warn('form2',form2)

