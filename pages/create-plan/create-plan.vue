<template>
	<view class="page">
		<!-- 企业名称（只读） -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">企业名称</text>
			</view>
			<view class="form-readonly">
				<text class="readonly-value">{{form.companyName}}</text>
			</view>
		</view>

		<!-- 项目名称（选择） -->
		<view class="form-item" @click="openProjectPicker">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目名称</text>
			</view>
			<view class="form-select">
				<text :class="form.projectName ? 'select-value' : 'placeholder'">{{form.projectName || '请选择'}}</text>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 说明文字 -->
		<view class="desc-area">
			<text class="desc-text">项目为选填项。若未选择，则填写主体相关的转型路径，并生成转型计划书；若已选择，则内容与所选项目相关。</text>
		</view>

		<!-- 底部按钮区（固定底部） -->
		<view class="bottom-area">
			<view class="btn-row">
				<view class="abandon-btn" @click="onAbandon">
					<text class="abandon-btn-text">放弃填写</text>
				</view>
				<view class="save-btn" @click="onSave">
					<text class="save-btn-text">暂时保存</text>
				</view>
				<view class="next-btn" @click="onNext">
					<text class="next-btn-text">下一步</text>
				</view>
			</view>
		</view>

		<!-- 选择项目弹窗 -->
		<view class="mask" v-if="showProjectPicker" @click="showProjectPicker = false">
			<view class="center-popup" @click.stop="">
				<view class="center-popup-header">
					<text class="center-popup-title-text">选择项目</text>
					<text class="center-popup-cancel" @click="showProjectPicker = false">取消</text>
				</view>
				<!-- 搜索框 -->
				<view class="popup-search">
					<text class="popup-search-icon">Q</text>
					<input class="popup-search-input" v-model="searchKey" placeholder="输入关键字进行搜索" placeholder-class="popup-search-placeholder" />
				</view>
				<scroll-view scroll-y class="center-popup-list">
					<view :class="['center-popup-item', selectedProject && selectedProject.projectName === item.projectName ? 'center-popup-item-selected' : '']" v-for="(item, index) in filteredProjectList" :key="index" @click="onSelectProject(item)">
						<text :class="['center-popup-item-name', selectedProject && selectedProject.projectName === item.projectName ? 'center-popup-item-name-active' : '']">{{item.projectName}}</text>
						<text class="center-popup-item-info">行业及工艺流程：</text>
						<text class="center-popup-item-detail">{{item.industry}} / {{item.processes.join('、')}}</text>
					</view>
					<view class="center-popup-empty" v-if="!filteredProjectList.length">
						<text class="center-popup-empty-text">暂无已创建的项目</text>
					</view>
				</scroll-view>
				<view class="center-popup-footer">
					<view class="center-popup-confirm-btn" @click="confirmProject">
						<text class="center-popup-confirm-text">确认</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				companyName: '',
				projectName: ''
			},
			selectedProject: null,
			showProjectPicker: false,
			searchKey: '',
			projectList: []
		}
	},
	computed: {
		filteredProjectList: function() {
			var key = this.searchKey;
			var companyName = this.form.companyName;
			var list = this.projectList.filter(function(item) {
				return item.companyName === companyName;
			});
			if (!key) return list;
			return list.filter(function(item) {
				return item.projectName.indexOf(key) > -1;
			});
		}
	},
	onLoad(options) {
		if (options.companyName) {
			this.form.companyName = decodeURIComponent(options.companyName);
		}
	},
	onShow() {
		/* 从 globalData 读取项目列表 */
		var app = getApp();
		if (app.globalData && app.globalData.projectList) {
			this.projectList = app.globalData.projectList;
		}
	},
	methods: {
		openProjectPicker() {
			this.searchKey = '';
			this.showProjectPicker = true;
		},
		onSelectProject(item) {
			this.selectedProject = item;
			this.form.projectName = item.projectName;
			this.showProjectPicker = false;
		},
		confirmProject() {
			this.showProjectPicker = false;
		},
		onAbandon() {
			uni.showModal({
				title: '提示',
				content: '确定要放弃填写吗？已填内容将不会保存。',
				success: function(res) {
					if (res.confirm) {
						uni.navigateBack();
					}
				}
			});
		},
		onSave() {
			uni.showToast({ title: '已暂时保存', icon: 'success' });
		},
		onNext() {
			var params = 'companyName=' + encodeURIComponent(this.form.companyName);
			if (this.form.projectName) {
				params += '&projectName=' + encodeURIComponent(this.form.projectName);
			}
			uni.navigateTo({ url: '/pages/questionnaire/questionnaire?' + params });
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 0 0 200rpx;
}

/* 表单项 */
.form-item {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.form-label {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.required {
	color: #E53935;
	font-size: 28rpx;
	margin-right: 6rpx;
}

.label-text {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

/* 只读字段 */
.form-readonly {
	padding: 16rpx 0;
}

.readonly-value {
	font-size: 28rpx;
	color: #666666;
}

/* 选择器 */
.form-select {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
}

.select-value {
	font-size: 28rpx;
	color: #333333;
	flex: 1;
}

.placeholder {
	color: #CCCCCC;
	font-size: 28rpx;
}

.arrow {
	color: #CCCCCC;
	font-size: 28rpx;
	margin-left: 16rpx;
}

/* 说明文字 */
.desc-area {
	padding: 30rpx;
}

.desc-text {
	font-size: 26rpx;
	color: #999999;
	line-height: 40rpx;
}

/* 底部按钮区（固定底部） */
.bottom-area {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #FFFFFF;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.btn-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.abandon-btn {
	flex: 1;
	height: 88rpx;
	border: 2rpx solid #999999;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
}

.abandon-btn-text {
	color: #999999;
	font-size: 28rpx;
}

.save-btn {
	flex: 1;
	height: 88rpx;
	border: 2rpx solid #4CAF50;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
}

.save-btn-text {
	color: #4CAF50;
	font-size: 28rpx;
}

.next-btn {
	flex: 1;
	height: 88rpx;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.next-btn-text {
	color: #FFFFFF;
	font-size: 28rpx;
}

/* 中间弹窗 */
.mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.center-popup {
	width: 620rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	max-height: 70vh;
	overflow: hidden;
}

.center-popup-header {
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.center-popup-title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.center-popup-cancel {
	font-size: 28rpx;
	color: #999999;
}

/* 搜索框 */
.popup-search {
	display: flex;
	align-items: center;
	margin: 0 30rpx 20rpx;
	background-color: #F5F5F5;
	border-radius: 36rpx;
	padding: 16rpx 24rpx;
}

.popup-search-icon {
	font-size: 28rpx;
	color: #999999;
	margin-right: 12rpx;
}

.popup-search-input {
	flex: 1;
	font-size: 26rpx;
	color: #333333;
}

.popup-search-placeholder {
	color: #CCCCCC;
	font-size: 26rpx;
}

.center-popup-list {
	max-height: 400rpx;
}

.center-popup-item {
	padding: 24rpx 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.center-popup-item:last-child {
	border-bottom: none;
}

.center-popup-item-selected {
	background-color: #F0FAF0;
}

.center-popup-item-name {
	font-size: 28rpx;
	color: #333333;
	font-weight: bold;
}

.center-popup-item-name-active {
	color: #4CAF50;
}

.center-popup-item-info {
	font-size: 24rpx;
	color: #999999;
	margin-top: 12rpx;
}

.center-popup-item-detail {
	font-size: 24rpx;
	color: #666666;
	margin-top: 4rpx;
	line-height: 36rpx;
}

.center-popup-empty {
	padding: 60rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.center-popup-empty-text {
	font-size: 28rpx;
	color: #CCCCCC;
}

.center-popup-footer {
	padding: 20rpx 40rpx 36rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.center-popup-confirm-btn {
	width: 240rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.center-popup-confirm-text {
	color: #FFFFFF;
	font-size: 30rpx;
	font-weight: bold;
}
</style>
