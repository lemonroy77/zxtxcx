<template>
	<view class="page">
		<!-- 顶部绿色区域 -->
		<view class="header">
			<view :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="header-content">
				<view class="logo-icon">
					<text class="logo-text-g1">G</text>
					<text class="logo-text-g2">G</text>
				</view>
				<text class="app-name">绿易融</text>
				<text class="app-slogan">从识绿到扩绿，让绿色金融更普及</text>
			</view>
		</view>

		<!-- 注册表单 -->
		<view class="form-area">
			<text class="form-title">注册账号</text>

			<!-- 账号 -->
			<view class="input-wrap">
				<image class="input-icon" src="/static/icons/icon-user.png" mode="aspectFit"></image>
				<input class="form-input" v-model="username" placeholder="请输入账号" placeholder-class="input-placeholder" />
			</view>

			<!-- 密码 -->
			<view class="input-wrap">
				<image class="input-icon" src="/static/icons/icon-lock.png" mode="aspectFit"></image>
				<input class="form-input" v-model="password" :password="!showPwd" placeholder="请设置密码（6-20位）" placeholder-class="input-placeholder" />
				<view class="eye-btn" @click="showPwd = !showPwd">
					<image class="eye-icon" :src="showPwd ? '/static/icons/icon-eye-open.png' : '/static/icons/icon-eye-close.png'" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 确认密码 -->
			<view class="input-wrap">
				<image class="input-icon" src="/static/icons/icon-lock.png" mode="aspectFit"></image>
				<input class="form-input" v-model="confirmPassword" :password="!showConfirmPwd" placeholder="请确认密码" placeholder-class="input-placeholder" />
				<view class="eye-btn" @click="showConfirmPwd = !showConfirmPwd">
					<image class="eye-icon" :src="showConfirmPwd ? '/static/icons/icon-eye-open.png' : '/static/icons/icon-eye-close.png'" mode="aspectFit"></image>
				</view>
			</view>

			<!-- 注册按钮 -->
			<view class="register-btn" @click="onRegister">
				<text class="register-btn-text">注册</text>
			</view>

			<!-- 底部操作 -->
			<view class="bottom-links">
				<text class="link-text" @click="onGoLogin">已有账号？返回登录</text>
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
export default {
	data() {
		return {
			statusBarHeight: 20,
			username: '',
			password: '',
			confirmPassword: '',
			showPwd: false,
			showConfirmPwd: false,
			agreed: false
		}
	},
	onLoad() {
		var sysInfo = uni.getSystemInfoSync();
		this.statusBarHeight = sysInfo.statusBarHeight || 20;
	},
	methods: {
		onRegister() {
			if (!this.username) {
				uni.showToast({ title: '请输入账号', icon: 'none' });
				return;
			}
			if (this.username.length < 3) {
				uni.showToast({ title: '账号至少3个字符', icon: 'none' });
				return;
			}
			if (!this.password) {
				uni.showToast({ title: '请设置密码', icon: 'none' });
				return;
			}
			if (this.password.length < 6 || this.password.length > 20) {
				uni.showToast({ title: '密码长度为6-20位', icon: 'none' });
				return;
			}
			if (this.password !== this.confirmPassword) {
				uni.showToast({ title: '两次密码输入不一致', icon: 'none' });
				return;
			}
			if (!this.agreed) {
				uni.showToast({ title: '请先同意用户协议', icon: 'none' });
				return;
			}

			/* 模拟注册成功 */
			uni.showToast({ title: '注册成功', icon: 'success' });
			setTimeout(function() {
				uni.navigateBack();
			}, 1500);
		},
		onGoLogin() {
			uni.navigateBack();
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
	background-color: #FFFFFF;
	border-radius: 28rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.logo-text-g1 {
	color: #4CAF50;
	font-size: 52rpx;
	font-weight: bold;
	font-style: italic;
	margin-right: -8rpx;
}

.logo-text-g2 {
	color: #2E7D32;
	font-size: 52rpx;
	font-weight: bold;
	font-style: italic;
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

/* 注册按钮 */
.register-btn {
	margin-top: 50rpx;
	height: 96rpx;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.register-btn-text {
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
