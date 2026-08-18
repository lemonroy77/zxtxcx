<template>
	<view class="page">
		<!-- 基本信息标题（卡片外） -->
		<view class="outer-title">
			<text class="outer-title-text">基本信息</text>
		</view>
		<!-- 基本信息卡片 -->
		<view class="section">
			<view class="info-row">
				<view class="info-dot"></view>
				<text class="info-label">企业名称</text>
			</view>
			<text class="info-value">{{bodyInfo.companyName}}</text>

			<view class="info-row">
				<view class="info-dot"></view>
				<text class="info-label">所属行业</text>
			</view>
			<text class="info-value">{{bodyInfo.industry}}</text>

			<view class="info-row">
				<view class="info-dot"></view>
				<text class="info-label">工艺流程</text>
			</view>
			<text class="info-value">{{bodyInfo.processes}}</text>
		</view>

		<!-- 相关信息标题（卡片外） -->
		<view class="outer-title">
			<text class="outer-title-text">相关信息</text>
		</view>

		<!-- 转型项目 -->
		<view class="section">
			<view class="section-header">
				<text class="section-header-title">转型项目</text>
				<view class="section-action" @click="onCreateProject">
					<text class="action-icon">+</text>
					<text class="action-text">创建项目</text>
				</view>
			</view>
			<view class="stat-row">
				<view class="stat-item">
					<text class="stat-label">填写中</text>
					<text class="stat-value">{{project.filling}}</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">已创建</text>
					<text class="stat-value">{{project.created}}</text>
				</view>
			</view>
		</view>

		<!-- 转型计划书 -->
		<view class="section">
			<view class="section-header">
				<text class="section-header-title">转型计划书</text>
				<view class="section-action" @click="onCreatePlan">
					<text class="action-icon">+</text>
					<text class="action-text">创建计划书</text>
				</view>
			</view>
			<view class="stat-row">
				<view class="stat-item">
					<text class="stat-label">填写中</text>
					<text class="stat-value">{{plan.filling}}</text>
				</view>
				<view class="stat-item">
					<text class="stat-label">已创建</text>
					<text class="stat-value">{{plan.created}}</text>
				</view>
			</view>
		</view>

		<!-- 非金融服务建议 -->
		<view class="section">
			<view class="section-header">
				<text class="section-header-title">非金融服务建议</text>
			</view>
			<text class="advice-desc">该功能基于企业已录入的行业、工艺流程、转型路径等信息，自动生成企业在转型过程中可能需要的非金融服务建议。</text>
			<view class="stat-row single">
				<text class="stat-label">已生成</text>
				<text class="stat-value">{{advice.generated}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bodyIndex: -1,
			bodyInfo: {
				companyName: '',
				industry: '',
				processes: '',
				relatedInfo: ''
			},
			project: { filling: 0, created: 0 },
			plan: { filling: 0, created: 0 },
			advice: { generated: 0 }
		}
	},
	onLoad(options) {
		if (options.index !== undefined) {
			this.bodyIndex = parseInt(options.index);
			var app = getApp();
			if (app.globalData && app.globalData.bodyList && app.globalData.bodyList[this.bodyIndex]) {
				var item = app.globalData.bodyList[this.bodyIndex];
				this.bodyInfo = {
					companyName: item.companyName || '',
					industry: item.industry || '',
					processes: item.processes || '',
					relatedInfo: item.relatedInfo || ''
				};
			}
		}
	},
	onShow() {
		/* 从 globalData 读取该企业的项目数量 */
		var app = getApp();
		var companyName = this.bodyInfo.companyName;
		if (app.globalData && app.globalData.projectList && companyName) {
			var count = 0;
			for (var i = 0; i < app.globalData.projectList.length; i++) {
				if (app.globalData.projectList[i].companyName === companyName) {
					count++;
				}
			}
			this.project.created = count;
		}
	},
	methods: {
		onCreateProject() {
			var params = 'companyName=' + encodeURIComponent(this.bodyInfo.companyName);
			uni.navigateTo({ url: '/pages/create-project/create-project?' + params });
		},
		onCreatePlan() {
			var params = 'companyName=' + encodeURIComponent(this.bodyInfo.companyName);
			uni.navigateTo({ url: '/pages/create-plan/create-plan?' + params });
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 0 24rpx 40rpx;
}

/* 区块卡片 */
.section {
	background-color: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-top: 24rpx;
}

/* 卡片外一级标题 */
.outer-title {
	padding: 24rpx 0 12rpx;
}

.outer-title-text {
	font-size: 30rpx;
	color: #999999;
}

/* 信息行 */
.info-row {
	display: flex;
	align-items: center;
	margin-top: 24rpx;
}

.info-row:first-child {
	margin-top: 0;
}

.info-dot {
	width: 14rpx;
	height: 14rpx;
	background-color: #4CAF50;
	border-radius: 50%;
	margin-right: 12rpx;
	flex-shrink: 0;
}

.info-label {
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}

.info-value {
	font-size: 28rpx;
	color: #333333;
	margin-left: 26rpx;
	margin-bottom: 16rpx;
	line-height: 40rpx;
}

/* 区块头部带操作 */
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.section-header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.section-action {
	display: flex;
	align-items: center;
}

.action-icon {
	color: #4CAF50;
	font-size: 28rpx;
	margin-right: 4rpx;
}

.action-text {
	color: #4CAF50;
	font-size: 26rpx;
}

/* 统计行 */
.stat-row {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 20rpx 0;
}

.stat-row.single {
	justify-content: center;
	flex-direction: row;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stat-label {
	font-size: 26rpx;
	color: #999999;
	margin-bottom: 8rpx;
}

.stat-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
}

.single .stat-label {
	margin-right: 16rpx;
	margin-bottom: 0;
}

/* 描述文字 */
.advice-desc {
	font-size: 24rpx;
	color: #999999;
	line-height: 38rpx;
	margin-bottom: 16rpx;
}
</style>
