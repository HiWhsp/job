// import {API_ROOT} from '@/config/env.js'

const ROOT = "https://shbxx.dx.hdapp.com.cn";

/**
 * 全局接口请求根域名
 */
export const API_ROOT = ROOT;

// 商城类型 - 空-默认国内普通商城  foreign-海外商城 (地址管理不一样 账号登录注册等)
export const SHOP_TYPE = '';


// 上传
// 是否开始oss上传  图片上传接口不一样
export const IS_OPEN_OSS_UPLOAD = false;
export const UPLOAD_NAME = "img";
export const UPLOAD_ACTION =
  process.env.NODE_ENV !== "production"
    ? "/api/service.php"
    : process.env.VUE_APP_API_ROOT + "/service.php";

export const UPLOAD_PARAMS_ACTION = IS_OPEN_OSS_UPLOAD ? "index_ossUpload" : 'index_localUpload';
// 上传


/**
 * 全局资源根路径
 */
export const ASSETS_ROOT = ROOT + "/mpassets/";

/**
 * 测试用户的 用户ID  token
 */
export const MOCK_USER_ID = "370";
export const MOCK_USER_TOKEN = "d0a8427b60";

//  0: '普通用户',
// 	1: '酒店/民宿员工',
export const MOCK_USER_ROLE_NUMBER = 2; //用户角色

// 关于我们-文章内容ID
export const ABOUT_ARTICLE_ID = 83; //
// 余额充值协议-文章内容ID
export const BALANCE_RECHAGRE_ARTICLE_ID = 82; //
