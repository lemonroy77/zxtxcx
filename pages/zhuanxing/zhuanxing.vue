<template>
	<view class="page">
		<!-- 头部介绍 -->
		<view class="intro-card">
			<view class="intro-icon-wrap">
				<text class="intro-icon">&#x1F331;</text>
			</view>
			<view class="intro-info">
				<text class="intro-title">转型通</text>
				<text class="intro-desc">一站式解决转型路径判别、碳排放核算及评分认定，助力银行高效落地转型金融</text>
			</view>
		</view>

		<!-- 流程步骤导航 -->
		<view class="section-title"><text class="section-title-text">认定流程</text></view>
		<view class="flow-card">
			<view class="flow-item" v-for="(f, fi) in flowSteps" :key="fi" @click="onFlowClick(f)" hover-class="flow-item-hover">
				<view class="flow-num" :class="'flow-color-' + (fi % 4)">
					<text class="flow-num-text">{{fi + 1}}</text>
				</view>
				<view class="flow-detail">
					<text class="flow-name">{{f.name}}</text>
					<text class="flow-tip">{{f.tip}}</text>
				</view>
				<text class="flow-arrow">&#x276F;</text>
			</view>
		</view>

		<!-- 统计看板 -->
		<view class="section-title"><text class="section-title-text">我的数据</text></view>
		<view class="stat-grid">
			<view class="stat-card" v-for="(s, si) in statItems" :key="si">
				<text class="stat-num">{{s.value}}</text>
				<text class="stat-label">{{s.label}}</text>
			</view>
		</view>

		<!-- 快捷操作 -->
		<view class="section-title"><text class="section-title-text">快捷操作</text></view>
		<view class="action-card">
			<view class="action-item" v-for="(a, ai) in quickActions" :key="ai" @click="onQuickAction(a)" hover-class="action-item-hover">
				<view class="action-icon-wrap" :style="{ background: a.bg }">
					<text class="action-icon-text">{{a.icon}}</text>
				</view>
				<text class="action-name">{{a.name}}</text>
			</view>
		</view>

		<view style="height: 30rpx;"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			flowSteps: [
				{ name: '基本要求判断', tip: '企业名称、信用代码、行业合规', action: 'create' },
				{ name: '碳排放与碳强度计算', tip: '能耗数据填报、碳排放核算', action: 'create' },
				{ name: '第一次评分计算', tip: '客观指标≥48分方可通过', action: 'create' },
				{ name: '勾选行业目录', tip: '12大行业转型活动目录', action: 'create' },
				{ name: '承诺', tip: '碳减排承诺与数据授权', action: 'create' },
				{ name: '第二次评分计算', tip: '综合评分与等级划分', action: 'create' },
				{ name: '材料撰写', tip: '转型规划书、披露报告', action: 'create' },
				{ name: '文件生成', tip: '规划书、认定报告自动生成', action: 'create' }
			],
			statItems: [
				{ label: '已认定企业', value: 2 },
				{ label: '审核中', value: 1 },
				{ label: '待填写', value: 0 },
				{ label: '草稿', value: 1 }
			],
			quickActions: [
				{ name: '开始认定', icon: '📋', bg: 'linear-gradient(135deg, #43A047, #66BB6A)', action: 'create' },
				{ name: '继续填写', icon: '✏️', bg: 'linear-gradient(135deg, #1565C0, #42A5F5)', action: 'draft' },
				{ name: '查看报告', icon: '📄', bg: 'linear-gradient(135deg, #E65100, #FF9800)', action: 'report' },
				{ name: '历史记录', icon: '📁', bg: 'linear-gradient(135deg, #6D4C41, #8D6E63)', action: 'history' }
			]
		}
	},
	methods: {
		onFlowClick: function(f) {
			if (f.action === 'create') {
				uni.navigateTo({ url: '/pages/create-body/create-body' });
			}
		},
		onQuickAction: function(a) {
			if (a.action === 'create') {
				uni.navigateTo({ url: '/pages/create-body/create-body' });
			} else if (a.action === 'draft') {
				uni.showToast({ title: '暂无草稿', icon: 'none' });
			} else if (a.action === 'report') {
				uni.showToast({ title: '暂无报告', icon: 'none' });
			} else {
				uni.showToast({ title: '暂无历史记录', icon: 'none' });
			}
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F3F5F7;
}

/* 头部介绍 */
.intro-card {
	margin: 20rpx 24rpx 0;
	padding: 28rpx;
	background: linear-gradient(135deg, #2E7D32, #4CAF50);
	border-radius: 16rpx;
	display: flex;
	align-items: flex-start;
}

.intro-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(255,255,255,0.2);
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.intro-icon {
	font-size: 40rpx;
}

.intro-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.intro-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 8rpx;
}

.intro-desc {
	font-size: 24rpx;
	color: rgba(255,255,255,0.85);
	line-height: 38rpx;
}

/* 段落标题 */
.section-title {
	padding: 24rpx 28rpx 12rpx;
}

.section-title-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #1A1A1A;
}

/* 流程卡片 */
.flow-card {
	margin: 0 24rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.flow-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.flow-item:last-child { border-bottom: none; }

.flow-item-hover { background-color: #FAFAFA; }

.flow-num {
	width: 52rpx;
	height: 52rpx;
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 20rpx;
}

.flow-color-0 { background: linear-gradient(135deg, #43A047, #66BB6A); }
.flow-color-1 { background: linear-gradient(135deg, #1565C0, #42A5F5); }
.flow-color-2 { background: linear-gradient(135deg, #E65100, #FF9800); }
.flow-color-3 { background: linear-gradient(135deg, #6D4C41, #8D6E63); }

.flow-num-text {
	color: #FFFFFF;
	font-size: 24rpx;
	font-weight: bold;
}

.flow-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.flow-name {
	font-size: 28rpx;
	color: #1A1A1A;
	font-weight: 500;
	margin-bottom: 4rpx;
}

.flow-tip {
	font-size: 22rpx;
	color: #999999;
}

.flow-arrow {
	font-size: 24rpx;
	color: #CCCCCC;
	flex-shrink: 0;
}

/* 统计看板 */
.stat-grid {
	display: flex;
	margin: 0 24rpx;
	gap: 16rpx;
}

.stat-card {
	flex: 1;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.stat-num {
	font-size: 40rpx;
	font-weight: bold;
	color: #1A1A1A;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #999999;
}

/* 快捷操作 */
.action-card {
	margin: 0 24rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	display: flex;
	padding: 28rpx 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.action-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.action-item-hover { opacity: 0.7; }

.action-icon-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 10rpx;
}

.action-icon-text {
	font-size: 36rpx;
}

.action-name {
	font-size: 22rpx;
	color: #333333;
}
</style>
