/* 请求工具：封装 uni.request，自动携带 X-TOKEN */
var auth = require('./auth.js');

/* 基础地址，后续对接后端时修改 */
var BASE_URL = '';

/* 不需要 Token 的白名单路径 */
var WHITE_LIST = [
	'/api/login',
	'/api/register',
	'/api/sms/send'
];

/**
 * 发起请求
 * @param {Object} options - 请求配置
 * @param {String} options.url - 请求路径（相对路径会拼接 BASE_URL）
 * @param {String} options.method - 请求方法，默认 GET
 * @param {Object} options.data - 请求参数
 * @param {Object} options.header - 自定义请求头
 * @param {Boolean} options.needToken - 是否需要 Token，默认 true
 */
function request(options) {
	var url = options.url || '';
	if (url.indexOf('http') !== 0 && BASE_URL) {
		url = BASE_URL + url;
	}

	var header = options.header || {};
	header['Content-Type'] = header['Content-Type'] || 'application/json';

	/* 判断是否需要携带 Token */
	var needToken = options.needToken !== false;
	var isWhite = false;
	for (var i = 0; i < WHITE_LIST.length; i++) {
		if (url.indexOf(WHITE_LIST[i]) > -1) {
			isWhite = true;
			break;
		}
	}

	if (needToken && !isWhite) {
		var token = auth.getToken();
		if (token) {
			header['X-TOKEN'] = token;
		}
	}

	return new Promise(function(resolve, reject) {
		uni.request({
			url: url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: function(res) {
				/* 401 未授权，跳转登录 */
				if (res.statusCode === 401) {
					auth.logout();
					uni.reLaunch({ url: '/pages/login/login' });
					reject({ code: 401, msg: '登录已过期，请重新登录' });
					return;
				}
				resolve(res.data);
			},
			fail: function(err) {
				reject(err);
			}
		});
	});
}

/* 便捷方法 */
function get(url, data, options) {
	return request(Object.assign({ url: url, method: 'GET', data: data }, options || {}));
}

function post(url, data, options) {
	return request(Object.assign({ url: url, method: 'POST', data: data }, options || {}));
}

module.exports = {
	request: request,
	get: get,
	post: post,
	BASE_URL: BASE_URL
};
