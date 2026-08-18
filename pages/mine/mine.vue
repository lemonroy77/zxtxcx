<template>
	<view class="page">
		<!-- 头部背景 + 用户信息 -->
		<view class="header-bg">
			<view :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="user-section" @click="onUserClick">
				<image class="avatar" :src="userInfo.avatar || '/static/icons/icon-avatar-default.png'" mode="aspectFill"></image>
				<view class="user-detail" v-if="isLoggedIn">
					<text class="user-name">{{userInfo.nickname || '绿易融用户'}}</text>
					<text class="user-sub">{{phoneDisplay}}</text>
				</view>
				<view class="user-detail" v-else>
					<text class="user-name">登录 / 注册</text>
					<text class="user-sub">登录后享受更多服务</text>
				</view>
			</view>
		</view>

		<!-- 审核状态卡片（浮在头部下方） -->
		<view class="status-float-card" v-if="isLoggedIn">
			<view class="sf-row">
				<view class="sf-icon-wrap" :class="'sf-' + auditStatus">
					<text class="sf-icon-text">{{statusIcon}}</text>
				</view>
				<view class="sf-info">
					<text class="sf-label">{{auditStatusText}}</text>
					<text class="sf-desc">{{auditDesc}}</text>
				</view>
			</view>
		</view>

		<!-- PDF报告卡片 -->
		<view class="card" v-if="isLoggedIn && auditStatus === 'passed'">
			<view class="card-head">
				<text class="card-title">报告文件</text>
				<text class="card-count">{{reportList.length}}份</text>
			</view>
			<view class="report-list">
				<view class="report-item" v-for="(item, index) in reportList" :key="index" @click="onDownloadReport(item)" hover-class="report-item-hover">
					<view class="report-icon">
						<text class="report-icon-label">PDF</text>
					</view>
					<view class="report-detail">
						<text class="report-name">{{item.name}}</text>
						<text class="report-size">{{item.size}}</text>
					</view>
					<view class="report-dl-btn">
						<text class="report-dl-text">下载</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="card">
			<view class="list-item" v-for="(item, index) in menuList" :key="index" @click="onMenuClick(item)" hover-class="list-item-hover">
				<view class="list-left">
					<view class="list-icon-wrap" :style="{ background: item.bg }">
						<image class="list-icon" :src="item.icon" mode="aspectFit"></image>
					</view>
					<text class="list-text">{{item.name}}</text>
				</view>
				<text class="list-arrow">&#x276F;</text>
			</view>
		</view>

		<!-- 分割 -->
		<view class="divider-gap"></view>

		<!-- 设置 + 关于 -->
		<view class="card">
			<view class="list-item" v-for="(item, index) in settingList" :key="index" @click="onMenuClick(item)" hover-class="list-item-hover">
				<view class="list-left">
					<view class="list-icon-wrap" :style="{ background: item.bg }">
						<image class="list-icon" :src="item.icon" mode="aspectFit"></image>
					</view>
					<text class="list-text">{{item.name}}</text>
				</view>
				<text class="list-arrow">&#x276F;</text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-wrap" v-if="isLoggedIn">
			<view class="logout-btn" @click="onLogout" hover-class="logout-btn-hover">
				<text class="logout-text">退出登录</text>
			</view>
		</view>

		<view style="height: 30rpx;"></view>
	</view>
</template>

<script>
var auth = require('../../utils/auth.js');

export default {
	data() {
		return {
			statusBarHeight: 20,
			isLoggedIn: false,
			userInfo: {
				nickname: '',
				phone: '',
				avatar: ''
			},
			auditStatus: 'passed',
			reportList: [
				{ name: '融资主体转型规划书.pdf', size: '2.3MB', url: '' },
				{ name: '碳核算报告.pdf', size: '1.8MB', url: '' },
				{ name: '转型可行性分析报告.pdf', size: '3.1MB', url: '' },
				{ name: '环境效益评估报告.pdf', size: '1.5MB', url: '' }
			],
			menuList: [
				{ name: '企业信息录入', icon: '/static/icons/icon-mine-project.png', path: '/pages/create-body/create-body', bg: 'linear-gradient(135deg, #43A047, #66BB6A)' },
				{ name: '信息修改', icon: '/static/icons/icon-mine-plan.png', path: '', bg: 'linear-gradient(135deg, #1565C0, #42A5F5)' }
			],
			settingList: [
				{ name: '账号设置', icon: '/static/icons/icon-mine-setting.png', path: '', bg: 'linear-gradient(135deg, #757575, #9E9E9E)' },
				{ name: '关于我们', icon: '/static/icons/icon-mine-about.png', path: '', bg: 'linear-gradient(135deg, #6D4C41, #8D6E63)' }
			]
		}
	},
	computed: {
		phoneDisplay: function() {
			var p = this.userInfo.phone || '';
			if (p.length === 11) {
				return p.substring(0, 3) + '****' + p.substring(7);
			}
			return p || '查看个人信息';
		},
		auditStatusText: function() {
			var map = { pending: '待审核', reviewing: '审核中', passed: '审核通过', rejected: '审核未通过' };
			return map[this.auditStatus] || '未提交';
		},
		auditDesc: function() {
			var map = {
				pending: '您的企业信息已提交，等待后台审核',
				reviewing: '审核人员正在审核您的企业信息',
				passed: '恭喜！审核已通过，可查看并下载报告',
				rejected: '未通过审核，请修改后重新提交'
			};
			return map[this.auditStatus] || '请先提交企业信息';
		},
		statusIcon: function() {
			var map = { pending: '⏳', reviewing: '🔍', passed: '✅', rejected: '❌' };
			return map[this.auditStatus] || '📋';
		}
	},
	onLoad() {
		var sysInfo = uni.getSystemInfoSync();
		this.statusBarHeight = sysInfo.statusBarHeight || 20;
	},
	onShow() {
		this.isLoggedIn = auth.isLoggedIn();
		if (this.isLoggedIn) {
			var info = auth.getUserInfo();
			if (info) {
				this.userInfo = {
					nickname: info.nickname || '',
					phone: info.phone || '',
					avatar: info.avatar || ''
				};
			}
		} else {
			this.userInfo = { nickname: '', phone: '', avatar: '' };
		}
	},
	methods: {
		onUserClick() {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' });
			}
		},
		onMenuClick(item) {
			if (!this.isLoggedIn) {
				uni.navigateTo({ url: '/pages/login/login' });
				return;
			}
			if (item.path) {
				uni.navigateTo({ url: item.path });
			} else {
				uni.showToast({ title: item.name + ' 开发中', icon: 'none' });
			}
		},
		onDownloadReport(item) {
			if (item.url) {
				uni.downloadFile({
					url: item.url,
					success: function(res) {
						uni.openDocument({ filePath: res.tempFilePath });
					}
				});
			} else {
				uni.showToast({ title: '报告由后台生成，接口对接后可下载', icon: 'none' });
			}
		},
		onLogout() {
			var that = this;
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: function(res) {
					if (res.confirm) {
						auth.logout();
						that.isLoggedIn = false;
						that.userInfo = { nickname: '', phone: '', avatar: '' };
						uni.showToast({ title: '已退出登录', icon: 'success' });
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F3F5F7;
}

/* 头部背景 */
.header-bg {
	background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 60%, #66BB6A 100%);
	padding-bottom: 60rpx;
	position: relative;
}

.user-section {
	display: flex;
	align-items: center;
	padding: 40rpx 32rpx 20rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	flex-shrink: 0;
	border: 6rpx solid rgba(255, 255, 255, 0.4);
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.user-detail {
	flex: 1;
	margin-left: 24rpx;
	display: flex;
	flex-direction: column;
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 8rpx;
}

.user-sub {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.75);
}

/* 审核浮动卡片 */
.status-float-card {
	margin: -40rpx 24rpx 0;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 28rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	position: relative;
	z-index: 10;
}

.sf-row {
	display: flex;
	align-items: center;
}

.sf-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.sf-pending { background-color: #FFF3E0; }
.sf-reviewing { background-color: #E3F2FD; }
.sf-passed { background-color: #E8F5E9; }
.sf-rejected { background-color: #FFEBEE; }

.sf-icon-text {
	font-size: 36rpx;
}

.sf-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.sf-label {
	font-size: 30rpx;
	font-weight: bold;
	color: #1A1A1A;
	margin-bottom: 6rpx;
}

.sf-desc {
	font-size: 24rpx;
	color: #666666;
	line-height: 36rpx;
}

/* 通用卡片 */
.card {
	margin: 20rpx 24rpx 0;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.card-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx 28rpx 16rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.card-count {
	font-size: 24rpx;
	color: #999999;
}

/* 报告列表 */
.report-list {
	padding: 0;
}

.report-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.report-item:last-child {
	border-bottom: none;
}

.report-item-hover {
	background-color: #FAFAFA;
}

.report-icon {
	width: 72rpx;
	height: 72rpx;
	background: linear-gradient(135deg, #E53935, #FF5252);
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.report-icon-label {
	font-size: 20rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.report-detail {
	flex: 1;
	margin-left: 20rpx;
	display: flex;
	flex-direction: column;
}

.report-name {
	font-size: 28rpx;
	color: #1A1A1A;
	margin-bottom: 6rpx;
}

.report-size {
	font-size: 22rpx;
	color: #999999;
}

.report-dl-btn {
	flex-shrink: 0;
	padding: 8rpx 24rpx;
	background: linear-gradient(135deg, #43A047, #66BB6A);
	border-radius: 20rpx;
}

.report-dl-text {
	font-size: 22rpx;
	color: #FFFFFF;
	font-weight: 500;
}

/* 列表项 */
.list-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.list-item:last-child {
	border-bottom: none;
}

.list-item-hover {
	background-color: #FAFAFA;
}

.list-left {
	display: flex;
	align-items: center;
}

.list-icon-wrap {
	width: 64rpx;
	height: 64rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
}

.list-icon {
	width: 34rpx;
	height: 34rpx;
}

.list-text {
	font-size: 30rpx;
	color: #1A1A1A;
}

.list-arrow {
	font-size: 24rpx;
	color: #CCCCCC;
}

/* 分隔 */
.divider-gap {
	height: 0;
}

/* 退出登录 */
.logout-wrap {
	margin: 50rpx 24rpx 0;
}

.logout-btn {
	height: 92rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.logout-btn-hover {
	background-color: #FFF5F5;
}

.logout-text {
	font-size: 30rpx;
	color: #E53935;
	font-weight: 500;
}
</style>
