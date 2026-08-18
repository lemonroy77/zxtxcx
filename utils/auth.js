/* Token 存取删工具 */
var TOKEN_KEY = 'X-TOKEN';
var USER_KEY = 'USER_INFO';

/* 获取 Token */
function getToken() {
	return uni.getStorageSync(TOKEN_KEY) || '';
}

/* 保存 Token */
function setToken(token) {
	uni.setStorageSync(TOKEN_KEY, token);
}

/* 删除 Token */
function removeToken() {
	uni.removeStorageSync(TOKEN_KEY);
}

/* 获取用户信息 */
function getUserInfo() {
	var info = uni.getStorageSync(USER_KEY);
	if (info) {
		try {
			return JSON.parse(info);
		} catch (e) {
			return null;
		}
	}
	return null;
}

/* 保存用户信息 */
function setUserInfo(info) {
	uni.setStorageSync(USER_KEY, JSON.stringify(info));
}

/* 删除用户信息 */
function removeUserInfo() {
	uni.removeStorageSync(USER_KEY);
}

/* 是否已登录 */
function isLoggedIn() {
	return !!getToken();
}

/* 退出登录：清除 Token 和用户信息 */
function logout() {
	removeToken();
	removeUserInfo();
}

module.exports = {
	getToken: getToken,
	setToken: setToken,
	removeToken: removeToken,
	getUserInfo: getUserInfo,
	setUserInfo: setUserInfo,
	removeUserInfo: removeUserInfo,
	isLoggedIn: isLoggedIn,
	logout: logout
};
