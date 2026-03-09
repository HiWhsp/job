import axios from "axios";
import {
	API_ROOT
} from '@/config/env.js'

const axios_ins_common = axios.create({
	// baseURL: 'https://rblxzz.cn',
	// baseURL: "",
	timeout: 60000,
	headers: {},
});

const axios_ins_download = axios.create({
	// baseURL: 'https://rblxzz.cn',
	// baseURL: "",
	timeout: 60000,
	headers: {},
});
const axios_ins_upload = axios.create({
	// baseURL: 'https://rblxzz.cn',
	// baseURL: "",
	timeout: 60000,
	headers: {},
});


// 添加请求拦截器
axios_ins_common.interceptors.request.use(
	function (config) {
		let req = config.data;

		return config;
	},
	function (error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
axios_ins_common.interceptors.response.use(
	function (res) {
		let data = res.data;
		let code = data.code
		if (code == 403 || code == 401) {
			// if (data.msg === '请登录') {
			// 	window.location.href = '/login';
			// 	return;
			// }
			alertErr(data.msg)
			return Promise.reject(data);
		} else if (code == 500) {
			alertErr(data.msg)
			return Promise.reject(data);
		}
		return data;
	},
	function (error) {
		console.log("-------------- axios拦截 error----------------");
	}
);



// 添加响应拦截器
axios_ins_upload.interceptors.response.use(
	function (res) {
		let data = res.data;
		if (data.code == 403) {
			alertErr(data.msg)
		}
		return data;
	},
	function (error) {
		console.log("-------------- axios拦截 error----------------");
	}
);



function api(option) {
	let reqUrl = process.env.NODE_ENV !== "production" ? API_ROOT + option.url : API_ROOT + option.url
	let method = option.method || "get"; //


	let reqData = {
		...option.data,
		// user_id: localStorage.getItem("user_id"),
		token: localStorage.getItem("token") || '',
	};

	for (let key in reqData) {
		if (reqData[key] === '') {
			delete reqData[key];
		}
	}


	let token = localStorage.getItem("token");
	let otherConfig = {
		headers: {
			"Authorization": "Bearer " + token,
		},
	};

	// get 请求使用 application/json（仅影响部分场景）；post/put/delete 使用 form-data
	if (method == "get") {
		otherConfig.headers["Content-Type"] = "application/json";
	} else {
		otherConfig.headers["Content-Type"] = "application/x-www-form-urlencoded";
	}

	//特殊处理上传
	if (reqUrl.includes("/file/api/v1/app/upload")) {
		otherConfig.headers["Content-Type"] = "multipart/form-data";
	}

	if (method == "get") {
		return axios_ins_common({
			url: reqUrl,
			method: method,
			params: reqData,
			...otherConfig,
		});
	} else if (method == "post" || method == "put" || method == "delete") {
		// form-data 需使用 URLSearchParams 或 FormData 序列化
		const formData = new URLSearchParams();
		for (let key in reqData) {
			const val = reqData[key];
			if (val !== undefined && val !== null) {
				formData.append(key, typeof val === 'object' ? JSON.stringify(val) : val);
			}
		}
		return axios_ins_common({
			url: reqUrl,
			method: method,
			data: formData,
			...otherConfig,
		});
	}
}

function apiDownload(option) {
	let reqUrl = process.env.NODE_ENV !== "production" ? API_ROOT + option.url : API_ROOT + option.url
	let method = option.method || "get"; //
	let reqData = option.data;
	let token = localStorage.getItem("token");
	let otherConfig = {
		"responseType": 'blob',
		headers: {
			"Authorization": "Bearer " + token,
		}
	};

	if (method == "get") {
		return axios_ins_download({
			url: reqUrl,
			method: method,
			params: reqData,
			...otherConfig,
		});
	} else if (method == "post" || method == "put" || method == "delete") {
		return axios_ins_download({
			url: reqUrl,
			method: method,
			data: reqData,
			...otherConfig,
		});
	}
}

function apiUploadFile(option) {
	let url = option.url;
	let method = option.method;
	let data = option.data;

	let reqUrl = process.env.NODE_ENV !== "production" ? API_ROOT + url : API_ROOT + url
	let token = localStorage.getItem("token");
	const formData = new FormData();
	formData.append("file", data.file);
	return axios_ins_upload({
		url: reqUrl,
		method: method || "post",
		data: formData,
		headers: {
			"Authorization": "Bearer " + token,
			"Content-Type": "multipart/form-data",
		},
		transformRequest: [],
	});
}




function apiUploadFileBatch(option) {
	let url = option.url;
	let method = option.method;
	let data = option.data;

	let reqUrl = process.env.NODE_ENV !== "production" ? API_ROOT + url : API_ROOT + url
	let token = localStorage.getItem("token");

	let formData = data;
	// const formData = new FormData();
	// formData.append("files", data.files);
	// formData.append("desDirectory", data.desDirectory);
	return axios_ins_upload({
		url: reqUrl,
		method: method || "post",
		data: formData,
		headers: {
			"Authorization": "Bearer " + token,
			"Content-Type": "multipart/form-data",
		},
		transformRequest: [],
	});
}
function apiUploadFileReport(option) {
	let url = option.url;
	let method = option.method;
	let data = option.data;

	let reqUrl = process.env.NODE_ENV !== "production" ? API_ROOT + url : API_ROOT + url
	let token = localStorage.getItem("token");
	const formData = new FormData();
	formData.append("file", data.file);
	return axios_ins_upload({
		url: reqUrl,
		method: method || "post",
		data: formData,
		headers: {
			"Authorization": "Bearer " + token,
			"Content-Type": "multipart/form-data",
		},
		transformRequest: [],
	});
}




function apiUploadImage(option) {
	let {
		file
	} = option;

	const formData = new FormData();
	formData.append("action", 'upload_uploadImg');
	formData.append("token", localStorage.getItem("token"));
	formData.append("file", file);

	let url = process.env.NODE_ENV !== "production" ? API_ROOT : "/admin_service.php"
	return axios_ins_upload({
		url: url,
		method: "post",
		headers: {
			"Content-Type": "multipart/form-data;boundary=" + new Date().getTime(),
		},
		transformRequest: [],
		data: formData,
	});
}


function apiUploadVideo(option) {
	let {
		file
	} = option;

	const formData = new FormData();
	formData.append("action", 'upload_uploadFile');
	formData.append("token", localStorage.getItem("token"));
	formData.append("file", file);

	let url = process.env.NODE_ENV !== "production" ? API_ROOT : "/admin_service.php"
	return axios_ins_upload({
		url: url,
		method: "post",
		headers: {
			"Content-Type": "multipart/form-data;boundary=" + new Date().getTime(),
		},
		transformRequest: [],
		data: formData,
	});
}






export default {
	api,
	apiDownload,
	apiUploadFile,
	apiUploadFileBatch,
	apiUploadFileReport,
	apiUploadImage,
	apiUploadVideo,
};