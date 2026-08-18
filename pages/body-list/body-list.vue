<template>
	<view class="page">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-wrap">
				<text class="search-icon">Q</text>
				<input class="search-input" v-model="keyword" placeholder="输入企业名称关键字进行搜索" placeholder-class="search-placeholder" @input="onSearch" />
			</view>
			<view class="filter-btn" @click="onFilter">
				<text class="filter-icon">V</text>
				<text class="filter-text">筛选</text>
			</view>
		</view>

		<!-- 记录数提示 -->
		<view class="record-tip">
			<text class="record-tip-text">共找到{{filteredList.length}}条记录</text>
		</view>

		<!-- 主体卡片列表 -->
		<scroll-view scroll-y class="list-scroll">
			<view class="card" v-for="(item, index) in filteredList" :key="index" @click="onCardClick(index)">
				<view class="card-info">
					<text class="card-name">{{item.companyName}}</text>
					<text class="card-detail">行业及工艺流程：{{item.industry}} / {{item.processes}}</text>
					<text class="card-time">创建时间：{{item.createTime}}</text>
				</view>
				<view class="card-delete" @click="onDelete(index)">
					<text class="card-delete-text">删除</text>
				</view>
			</view>

			<!-- 底部提示 -->
			<view class="no-more">
				<text class="no-more-text">没有更多记录</text>
			</view>
		</scroll-view>

		<!-- 底部创建按钮 -->
		<view class="bottom-btn-area">
			<view class="create-btn" @click="onCreate">
				<text class="create-btn-text">创建转型主体</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			keyword: '',
			bodyList: []
		}
	},
	computed: {
		filteredList: function() {
			var kw = this.keyword;
			if (!kw) return this.bodyList;
			return this.bodyList.filter(function(item) {
				return item.companyName.indexOf(kw) > -1;
			});
		}
	},
	onShow() {
		/* 从 globalData 同步数据 */
		var app = getApp();
		if (app.globalData && app.globalData.bodyList) {
			this.bodyList = app.globalData.bodyList;
		}
		/* 从创建页返回时，检查是否有新建的主体数据 */
		var newBody = app.globalData && app.globalData.newBody;
		if (newBody) {
			this.bodyList.unshift(newBody);
			app.globalData.newBody = null;
		}
	},
	methods: {
		onSearch: function() {
			/* 搜索由 computed 自动处理 */
		},
		onFilter: function() {
			uni.showToast({ title: '筛选功能', icon: 'none' });
		},
		onDelete: function(index) {
			var that = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除该转型主体吗？',
				success: function(res) {
					if (res.confirm) {
						that.bodyList.splice(index, 1);
						uni.showToast({ title: '已删除', icon: 'success' });
					}
				}
			});
		},
		onCardClick: function(index) {
			uni.navigateTo({ url: '/pages/body-detail/body-detail?index=' + index });
		},
		onCreate: function() {
			uni.navigateTo({ url: '/pages/create-body/create-body' });
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F5F5F5;
	display: flex;
	flex-direction: column;
}

/* 搜索栏 */
.search-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	background-color: #FFFFFF;
}

.search-input-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #F5F5F5;
	border-radius: 36rpx;
	padding: 16rpx 24rpx;
}

.search-icon {
	font-size: 28rpx;
	color: #999999;
	margin-right: 12rpx;
}

.search-input {
	flex: 1;
	font-size: 26rpx;
	color: #333333;
}

.search-placeholder {
	color: #CCCCCC;
	font-size: 26rpx;
}

.filter-btn {
	display: flex;
	align-items: center;
	margin-left: 20rpx;
	flex-shrink: 0;
}

.filter-icon {
	font-size: 24rpx;
	color: #666666;
	margin-right: 4rpx;
}

.filter-text {
	font-size: 26rpx;
	color: #666666;
}

/* 记录数提示 */
.record-tip {
	padding: 16rpx 24rpx;
}

.record-tip-text {
	font-size: 24rpx;
	color: #999999;
}

/* 列表滚动区 */
.list-scroll {
	flex: 1;
	padding: 0 24rpx;
}

/* 卡片 */
.card {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	position: relative;
}

.card-info {
	display: flex;
	flex-direction: column;
}

.card-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
}

.card-detail {
	font-size: 26rpx;
	color: #666666;
	margin-bottom: 12rpx;
	line-height: 38rpx;
}

.card-time {
	font-size: 24rpx;
	color: #999999;
}

.card-delete {
	position: absolute;
	right: 30rpx;
	bottom: 30rpx;
	border: 1rpx solid #E53935;
	border-radius: 8rpx;
	padding: 8rpx 24rpx;
}

.card-delete-text {
	font-size: 24rpx;
	color: #E53935;
}

/* 没有更多 */
.no-more {
	padding: 30rpx 0 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.no-more-text {
	font-size: 24rpx;
	color: #CCCCCC;
}

/* 底部创建按钮 */
.bottom-btn-area {
	padding: 20rpx 40rpx;
	padding-bottom: 40rpx;
	background-color: #F5F5F5;
}

.create-btn {
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 48rpx;
	height: 96rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.create-btn-text {
	color: #FFFFFF;
	font-size: 32rpx;
	font-weight: bold;
}
</style>
