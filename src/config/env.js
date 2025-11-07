// import {API_ROOT} from '@/config/env.js'
// const SITE_ROOT = 'https://yaojiandan.api.dx.hdapp.com.cn';
const ROOT = 'https://yaojiandan.api.dx.hdapp.com.cn';
export const SITE_ROOT = 'https://yaojiandan.api.dx.hdapp.com.cn';
export const API_ROOT = SITE_ROOT;
export const UPLOAD_ROOT = process.env.NODE_ENV !== "production" ? SITE_ROOT + '/common/upload' : SITE_ROOT + '/common/upload';

