const ROOT = 'https://htgl.px-lcd.com/api/'

export const SITE_ROOT = ROOT; //站点部署域名

export const IS_OPEN_DEV = 1;

export const API_ROOT = ROOT + '';

export const UPLOAD_NAME = "file"

export const UPLOAD_ROOT = process.env.NODE_ENV !== "production" ? ROOT + 'upload' : ROOT + 'upload';
