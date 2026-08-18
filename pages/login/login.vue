<template>
	<view class="page">
		<!-- 顶部绿色区域 -->
		<view class="header">
			<view :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-content">
				<image class="logo-icon" src="/static/icons/logo.png" mode="aspectFit"></image>
				<text class="app-name">绿易融</text>
				<text class="app-slogan">从识绿到扩绿，让绿色金融更普及</text>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="form-area">
			<text class="form-title">账号登录</text>

			<!-- 账号 -->
			<view class="input-wrap">
				<image class="input-icon" src="/static/icons/icon-user.png" mode="aspectFit"></image>
				<input class="form-input" v-model="username" placeholder="请输入账号" placeholder-class="input-placeholder" />
			</view>

			<!-- 密码 -->
			<view class="input-wrap">
				<image class="input-icon" src="/static/icons/icon-lock.png" mode="aspectFit"></image>
				<input class="form-input" v-model="password" :password="!showPwd" placeholder="请输入密码" placeholder-class="input-placeholder" />
				<view class="eye-btn" @click="showPwd = !showPwd">
					<image class="eye-icon" :src="showPwd ? '/static/icons/icon-eye-open.png' : '/static/icons/icon-eye-close.png'" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 登录按钮 -->
			<view class="login-btn" @click="onLogin">
				<text class="login-btn-text">登录</text>
			</view>

			<!-- 底部操作 -->
			<view class="bottom-links">
				<text class="link-text" @click="onGoRegister">没有账号？立即注册</text>
			</view>
		</view>

		<!-- 协议 -->
		<view class="agreement">
			<view class="check-box" @click="agreed = !agreed">
				<view :class="['check-inner', agreed ? 'check-active' : '']"></view>
			</view>
			<text class="agreement-text">我已阅读并同意</text>
			<text class="agreement-link">《用户服务协议》</text>
			<text class="agreement-text">和</text>
			<text class="agreement-link">《隐私政策》</text>
		</view>
	</view>
</template>

<script>
var auth = require('../../utils/auth.js');

export default {
	data() {
		return {
			statusBarHeight: 20,
			username: '',
			password: '',
			showPwd: false,
			agreed: false
		}
	},
	onLoad() {
		var sysInfo = uni.getSystemInfoSync();
		this.statusBarHeight = sysInfo.statusBarHeight || 20;
	},
	methods: {
		onLogin() {
			if (!this.username) {
				uni.showToast({ title: '请输入账号', icon: 'none' });
				return;
			}
			if (!this.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' });
				return;
			}
			if (!this.agreed) {
				uni.showToast({ title: '请先同意用户协议', icon: 'none' });
				return;
			}

			/* 模拟登录成功，存储 Token 和用户信息 */
			var mockToken = 'mock_token_' + Date.now();
			var mockUser = {
				username: this.username,
				nickname: this.username,
				avatar: ''
			};
			auth.setToken(mockToken);
			auth.setUserInfo(mockUser);

			uni.showToast({ title: '登录成功', icon: 'success' });
			setTimeout(function() {
				uni.switchTab({ url: '/pages/index/index' });
			}, 1500);
		},
		onGoRegister() {
			uni.navigateTo({ url: '/pages/register/register' });
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F5F5F5;
}

/* 顶部绿色区域 */
.header {
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	padding-bottom: 60rpx;
	border-radius: 0 0 40rpx 40rpx;
}

.header-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 0 20rpx;
}

.logo-icon {
	width: 120rpx;
	height: 120rpx;
	border-radius: 28rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.app-name {
	color: #FFFFFF;
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.app-slogan {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
}

/* 表单区域 */
.form-area {
	margin: -30rpx 40rpx 0;
	background-color: #FFFFFF;
	border-radius: 24rpx;
	padding: 50rpx 40rpx 40rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.form-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 50rpx;
}

/* 输入框 */
.input-wrap {
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #F0F0F0;
	padding: 24rpx 0;
	margin-bottom: 10rpx;
}

.input-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.form-input {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}

.input-placeholder {
	color: #CCCCCC;
	font-size: 28rpx;
}

.eye-btn {
	padding: 10rpx;
	flex-shrink: 0;
}

.eye-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 登录按钮 */
.login-btn {
	margin-top: 50rpx;
	height: 96rpx;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-btn-text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}

/* 底部链接 */
.bottom-links {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 30rpx;
}

.link-text {
	font-size: 26rpx;
	color: #4CAF50;
}

/* 协议 */
.agreement {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40rpx 40rpx 60rpx;
	flex-wrap: wrap;
}

.check-box {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid #CCCCCC;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 10rpx;
	flex-shrink: 0;
}

.check-inner {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
}

.check-active {
	background-color: #4CAF50;
}

.agreement-text {
	font-size: 22rpx;
	color: #999999;
}

.agreement-link {
	font-size: 22rpx;
	color: #4CAF50;
}
</style>
