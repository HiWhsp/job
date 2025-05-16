const ROOT = 'https://yaojiandan.api.dx.hdapp.com.cn'

export const SITE_ROOT = ROOT; //站点部署域名

export const IS_OPEN_DEV = 1;

export const API_ROOT = ROOT + '';

export const UPLOAD_ROOT = process.env.NODE_ENV !== "production" ? ROOT + '/common/upload' : ROOT + '/common/upload';
