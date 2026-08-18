<template>
	<view class="page">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view :style="{ height: statusBarHeight + 'px' }"></view>
			<view class="nav-content">
				<view class="nav-left">
					<image class="logo-wrap" src="/static/icons/logo.png" mode="aspectFit"></image>
					<text class="nav-title">绿易融</text>
				</view>
				<view class="search-box" @click="onSearch">
					<text class="search-icon-text">&#x1F50D;</text>
					<text class="search-placeholder">搜索企业名称</text>
				</view>
			</view>
		</view>

		<!-- Banner 轮播 -->
		<swiper class="swiper-banner" indicator-dots autoplay :interval="4000" :duration="300" circular>
			<swiper-item v-for="(item, index) in bannerList" :key="index">
				<view class="banner-item" :style="{ background: item.bg }">
					<view class="banner-text-area">
						<text class="banner-title">{{item.title}}</text>
						<text class="banner-desc">{{item.desc}}</text>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- 功能导航 -->
		<view class="card">
			<view class="card-body">
				<view class="nav-grid">
					<view class="nav-item" v-for="(item, index) in funcList" :key="index" @click="onFuncClick(item)" hover-class="nav-item-hover">
						<view class="nav-icon-wrap" :style="{ background: item.color }">
							<image class="nav-icon" :src="item.icon" mode="aspectFit"></image>
						</view>
						<text class="nav-text">{{item.name}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 待办事项 -->
		<view class="card">
			<view class="card-head">
				<text class="card-title">待办事项</text>
				<view class="card-badge">
					<text class="card-badge-text">{{todoList.length}}</text>
				</view>
			</view>
			<view class="card-body">
				<view class="todo-item" v-for="(item, index) in todoList" :key="index" hover-class="todo-item-hover">
					<view class="todo-left">
						<view class="todo-dot" :class="'dot-' + (index % 3)"></view>
						<text class="todo-text">{{item.text}}</text>
					</view>
					<view class="todo-btn" @click="onApprove(item)">
						<text class="todo-btn-text">去审批</text>
					</view>
				</view>
				<view class="todo-empty" v-if="todoList.length === 0">
					<text class="todo-empty-text">暂无待办事项</text>
				</view>
			</view>
		</view>

		<!-- 资讯动态 -->
		<view class="card">
			<view class="card-head">
				<text class="card-title">资讯动态</text>
				<text class="card-more">更多 ></text>
			</view>
			<view class="card-body">
				<view class="news-item" v-for="(item, index) in newsList" :key="index" hover-class="news-item-hover">
					<view class="news-info">
						<text class="news-title">{{item.title}}</text>
						<view class="news-meta">
							<text class="news-source">{{item.source}}</text>
							<text class="news-time">{{item.time}}</text>
						</view>
					</view>
					<view class="news-cover" v-if="item.cover">
						<view class="news-cover-placeholder" :style="{ background: item.coverBg || '#E8F5E9' }">
							<text class="news-cover-icon">&#x1F4C4;</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view style="height: 30rpx;"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			statusBarHeight: 20,
			bannerList: [
				{ title: '从识绿到扩绿', desc: '让绿色金融更普及', bg: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)' },
				{ title: '企业绿色转型', desc: '一站式智慧服务平台', bg: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' },
				{ title: '碳核算·绿融资', desc: '助力企业可持续发展', bg: 'linear-gradient(135deg, #388E3C 0%, #81C784 100%)' }
			],
			funcList: [
		{ name: '转型通', icon: '/static/icons/icon-zhuanxing.png', path: '/pages/zhuanxing/zhuanxing', color: '#FFFFFF' },
			{ name: '绿融资', icon: '/static/icons/icon-liudai.png', path: '', color: '#FFFFFF' },
			{ name: '找政策', icon: '/static/icons/icon-zhengce.png', path: '', color: '#FFFFFF' }
			],
			todoList: [
				{ id: 1, text: '流贷识别:江西正辉新能源有限公司待审批' },
				{ id: 2, text: '流贷识别:井冈山市国源铭半导体照明有限公司待审批' },
				{ id: 3, text: '流贷识别:井冈山市国源铭半导体照明有限公司待审批' }
			],
			newsList: [
				{ title: '国家发改委发布绿色产业指导目录（2024版）', source: '绿易融资讯', time: '2024-03-15', cover: true, coverBg: '#E8F5E9' },
				{ title: '央行推出碳减排支持工具助力企业转型', source: '金融时报', time: '2024-03-12', cover: true, coverBg: '#E3F2FD' }
			]
		}
	},
	onLoad() {
		var sysInfo = uni.getSystemInfoSync();
		this.statusBarHeight = sysInfo.statusBarHeight || 20;
	},
	methods: {
		onSearch() {
			uni.showToast({ title: '搜索功能开发中', icon: 'none' });
		},
		onFuncClick(item) {
			if (item.path) {
				uni.navigateTo({ url: item.path });
			} else {
				uni.showToast({ title: item.name + ' 功能开发中', icon: 'none' });
			}
		},
		onApprove(item) {
			uni.showToast({ title: '前往审批', icon: 'none' });
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F3F5F7;
}

/* 导航栏 */
.nav-bar {
	background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
	padding-bottom: 0;
}

.nav-content {
	display: flex;
	align-items: center;
	padding: 16rpx 24rpx 20rpx;
}

.nav-left {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.logo-wrap {
	width: 56rpx;
	height: 56rpx;
	border-radius: 14rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.nav-title {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
	margin-left: 14rpx;
}

.search-box {
	flex: 1;
	height: 64rpx;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 32rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
}

.search-icon-text {
	font-size: 26rpx;
	margin-right: 12rpx;
}

.search-placeholder {
	color: rgba(255, 255, 255, 0.7);
	font-size: 26rpx;
}

/* Banner 轮播 */
.swiper-banner {
	height: 300rpx;
}

.banner-item {
	height: 300rpx;
	display: flex;
	align-items: center;
	padding: 0 50rpx;
}

.banner-text-area {
	display: flex;
	flex-direction: column;
}

.banner-title {
	color: #FFFFFF;
	font-size: 42rpx;
	font-weight: bold;
	margin-bottom: 14rpx;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.banner-desc {
	color: rgba(255, 255, 255, 0.85);
	font-size: 28rpx;
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
	padding: 28rpx 28rpx 0;
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.card-badge {
	background-color: #E53935;
	border-radius: 20rpx;
	padding: 2rpx 16rpx;
	min-width: 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.card-badge-text {
	color: #FFFFFF;
	font-size: 22rpx;
	font-weight: bold;
}

.card-more {
	font-size: 24rpx;
	color: #999999;
}

.card-body {
	padding: 24rpx 28rpx;
}

/* 导航网格 */
.nav-grid {
	display: flex;
	justify-content: space-around;
}

.nav-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10rpx 20rpx;
}

.nav-item-hover {
	opacity: 0.7;
}

.nav-icon-wrap {
	width: 96rpx;
	height: 96rpx;
	border-radius: 24rpx;
	border: 2rpx solid #E5E5E5;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 14rpx;
	box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
}

.nav-icon {
	width: 50rpx;
	height: 50rpx;
}

.nav-text {
	font-size: 24rpx;
	color: #333333;
	font-weight: 500;
}

/* 待办事项 */
.todo-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 22rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.todo-item:last-child {
	border-bottom: none;
}

.todo-item-hover {
	background-color: #FAFAFA;
}

.todo-left {
	display: flex;
	align-items: center;
	flex: 1;
	margin-right: 16rpx;
}

.todo-dot {
	width: 14rpx;
	height: 14rpx;
	border-radius: 50%;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.dot-0 { background-color: #4CAF50; }
.dot-1 { background-color: #FF9800; }
.dot-2 { background-color: #2196F3; }

.todo-text {
	font-size: 26rpx;
	color: #333333;
	line-height: 38rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}

.todo-btn {
	flex-shrink: 0;
	padding: 10rpx 24rpx;
	background: linear-gradient(135deg, #43A047, #66BB6A);
	border-radius: 24rpx;
}

.todo-btn-text {
	font-size: 22rpx;
	color: #FFFFFF;
	font-weight: 500;
}

.todo-empty {
	padding: 40rpx 0;
	display: flex;
	justify-content: center;
}

.todo-empty-text {
	font-size: 26rpx;
	color: #CCCCCC;
}

/* 资讯列表 */
.news-item {
	display: flex;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}

.news-item:last-child {
	border-bottom: none;
}

.news-item-hover {
	background-color: #FAFAFA;
}

.news-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	margin-right: 24rpx;
}

.news-title {
	font-size: 28rpx;
	color: #1A1A1A;
	line-height: 42rpx;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	margin-bottom: 12rpx;
}

.news-meta {
	display: flex;
	align-items: center;
}

.news-source {
	font-size: 22rpx;
	color: #999999;
	margin-right: 20rpx;
}

.news-time {
	font-size: 22rpx;
	color: #CCCCCC;
}

.news-cover-placeholder {
	width: 180rpx;
	height: 120rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.news-cover-icon {
	font-size: 44rpx;
}
</style>
