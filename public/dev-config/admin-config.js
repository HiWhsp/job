window.admin_config = {
	version: '1.0.0',
	project_name: 'vuesc商城后台管理系统',
	project_marker: 'vuesc',
	//产品模块
	product: {
		is_open_points_product: 0, //积分商品 
		is_open_miaosha_product: 0, //秒杀商品
	},
	//库存模块
	stock: {
		is_open_warehouse: 0, //仓库
	},
	//库存模块
	market: {
		is_open_coupon: 0, //优惠券
		is_open_coupon_code: 0, //优惠码
		is_open_china_express: 0, //国内运费模版
		is_open_foreign_express: 0, //外贸运费
		is_open_foreign_trade_rule: 0, //外贸满减
		is_open_points_sign_rule: 0, //积分签到
		is_open_points_value_rule: 0, //积分价值
		is_open_recharge_list: 0, //充值赠送
	},
	//订单管理
	order: {
		is_open_points_order_list: 0, //积分订单
	},
	//用户管理
	user: {
		is_open_user_level_rule: 0, //会员等级
		is_open_agent_list: 0, //会员申请
		is_open_feedback_list: 0, //意见反馈
		is_open_commission_withdrawal: 0, //佣金提现
	},
	//开发管理
	dev: {
		is_open_code: 0, //表单生成
		is_open_dev_api_web: 0, //前端接口
		is_open_dev_api_admin: 0, //后台接口
		is_open_dev_setting: 0, //开发设置
	},
	closed_route_map: {
		"/product-manager": 0,
		"/product-list": 0,
		"/product-cate": 0,
		"/brand-cate": 0,
		"/points-product": 0,
		"/miaosha-list": 0,
		"/package-product-list": 0,
		"/gift-list": 0,
		"/product-unit": 0,
		"/product-setting": 0,
		"/stock-manager": 0,
		"/warehouse-list": 1,
		"/stock-list": 0,
		"/stock-record": 0,
		"/market-manager": 0,
		"/coupon-list": 0,
		"/coupon-code-list": 0,
		"/china-express": 0,
		"/foreign-express": 0,
		"/foreign-trade-rule": 0,
		"/points-sign-rule": 0,
		"/points-value-rule": 0,
		"/recharge-list": 0,
		"/order-manager": 0,
		"/order-list": 0,
		"/points-order-list": 0,
		"/ship-list": 0,
		"/review-list": 0,
		"/invoice-list": 0,
		"/refund-list": 0,
		"/store-manager": 0,
		"/store-list": 0,	
		"/statistics-manager": 0,
		"/statistics-product": 0,
		"/user-manager": 0,
		"/user-list": 0,
		"/user-level-rule": 0,
		"/agent-list": 0,
		"/feedback-list": 0,
		"/commission-withdrawal": 0,
		"/news-manager": 0,
		"/news-list": 0,
		"/news-cate": 0,
		"/banner-manager": 0,
		"/banner-list": 0,
		"/banner-cate": 0,
		"/site-manager": 0,
		"/site-setting": 0,
		"/payment": 0,
		"/bank-account": 0,
		"/eslink-print": 0,
		"/account-manager": 0,
		"/department-list": 0,
		"/job-list": 0,
		"/role-list": 0,
		"/menu-list": 0,
		"/account-list": 0,
		"/dev-manager": 1,
		"/code": 1,
		"/dev-api-web": 1,
		"/dev-api-admin": 1,
		"/dev-setting": 1
	}
}