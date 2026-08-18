<template>
	<view class="page">
		<!-- 项目名称 -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目名称</text>
			</view>
			<input class="form-input" v-model="form.projectName" placeholder="请输入" placeholder-class="placeholder" />
		</view>

		<!-- 所属企业（只读） -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">所属企业</text>
			</view>
			<view class="form-readonly">
				<text class="readonly-value">{{form.companyName}}</text>
			</view>
		</view>

		<!-- 所属行业（可选择） -->
		<view class="form-item" @click="showIndustryPicker = true">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">所属行业</text>
			</view>
			<view class="form-select">
				<text :class="form.industry ? 'select-value' : 'placeholder'">{{form.industry || '请选择所属行业'}}</text>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 工艺流程（可多选） -->
		<view class="form-item" @click="openProcessPicker">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">工艺流程</text>
				<text class="label-tip">（可多选）</text>
			</view>
			<view class="form-select">
				<text :class="form.processes.length ? 'select-value' : 'placeholder'">{{form.processes.length ? form.processes.join('、') : '请选择'}}</text>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 项目类型 -->
		<view class="form-item" @click="showTypePicker = true">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目类型</text>
			</view>
			<view class="form-select">
				<text :class="form.projectType ? 'select-value' : 'placeholder'">{{form.projectType || '请选择'}}</text>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 项目投资总额 -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目投资总额(万元)</text>
			</view>
			<input class="form-input" v-model="form.totalInvestment" type="digit" placeholder="请输入" placeholder-class="placeholder" />
		</view>

		<!-- 项目立项方式 -->
		<view class="form-item" @click="showMethodPicker = true">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目立项方式</text>
			</view>
			<view class="form-select">
				<text :class="form.approvalMethod ? 'select-value' : 'placeholder'">{{form.approvalMethod || '请选择'}}</text>
				<text class="arrow">></text>
			</view>
		</view>

		<!-- 项目批复文件编号 -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目批复文件编号</text>
			</view>
			<input class="form-input" v-model="form.approvalNo" placeholder="请输入" placeholder-class="placeholder" />
		</view>

		<!-- 项目建设地区（省市区三级联动） -->
		<picker mode="region" @change="onRegionChange">
			<view class="form-item">
				<view class="form-label">
					<text class="required">*</text>
					<text class="label-text">项目建设地区</text>
				</view>
				<view class="form-select">
					<text :class="form.region ? 'select-value' : 'placeholder'">{{form.region || '请选择'}}</text>
					<text class="arrow">></text>
				</view>
			</view>
		</picker>

		<!-- 项目建设周期 -->
		<view class="form-item">
			<view class="form-label">
				<text class="required">*</text>
				<text class="label-text">项目建设周期(月)</text>
			</view>
			<input class="form-input" v-model="form.buildPeriod" type="digit" placeholder="请输入" placeholder-class="placeholder" />
		</view>

		<!-- 立项批复等相关合规性材料 -->
		<view class="form-item">
			<view class="form-label">
				<text class="label-text">立项批复等相关合规性材料</text>
			</view>
			<view class="upload-area" @click="onChooseFile">
				<view class="upload-box">
					<text class="upload-icon">+</text>
				</view>
				<text class="upload-tip">请添加附件（支持图片、视频、文件上传）</text>
			</view>
			<view class="upload-note">
				<text class="upload-note-text">材料上传说明</text>
			</view>
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
				<view class="submit-btn" @click="onSubmit">
					<text class="submit-btn-text">确认创建</text>
				</view>
			</view>
		</view>

		<!-- 行业选择中间弹窗 -->
		<view class="mask" v-if="showIndustryPicker" @click="showIndustryPicker = false">
			<view class="center-popup" @click.stop="">
				<view class="center-popup-title">
					<text class="center-popup-title-text">所属行业</text>
				</view>
				<scroll-view scroll-y class="center-popup-list">
					<view class="center-popup-item" v-for="(item, index) in industryList" :key="index" @click="onSelectIndustry(item)">
						<text :class="['center-popup-item-text', form.industry === item ? 'center-popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 工艺流程多选中间弹窗 -->
		<view class="mask" v-if="showProcessPicker" @click="showProcessPicker = false">
			<view class="center-popup" @click.stop="">
				<view class="center-popup-header">
					<text class="center-popup-cancel" @click="showProcessPicker = false">取消</text>
				</view>
				<scroll-view scroll-y class="center-popup-list">
					<view class="center-popup-item" v-for="(item, index) in processList" :key="index" @click="toggleProcess(item)">
						<text :class="['center-popup-item-text', tempProcesses.indexOf(item) > -1 ? 'center-popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
				<view class="center-popup-footer">
					<view class="center-popup-confirm-btn" @click="confirmProcess">
						<text class="center-popup-confirm-text">确认</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 项目类型中间弹窗 -->
		<view class="mask" v-if="showTypePicker" @click="showTypePicker = false">
			<view class="center-popup" @click.stop="">
				<view class="center-popup-title">
					<text class="center-popup-title-text">项目类型</text>
				</view>
				<scroll-view scroll-y class="center-popup-list">
					<view class="center-popup-item" v-for="(item, index) in typeList" :key="index" @click="onSelectType(item)">
						<text :class="['center-popup-item-text', form.projectType === item ? 'center-popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 立项方式中间弹窗 -->
		<view class="mask" v-if="showMethodPicker" @click="showMethodPicker = false">
			<view class="center-popup" @click.stop="">
				<view class="center-popup-title">
					<text class="center-popup-title-text">项目立项方式</text>
				</view>
				<scroll-view scroll-y class="center-popup-list">
					<view class="center-popup-item" v-for="(item, index) in methodList" :key="index" @click="onSelectMethod(item)">
						<text :class="['center-popup-item-text', form.approvalMethod === item ? 'center-popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				projectName: '',
				companyName: '',
				industry: '',
				processes: [],
				projectType: '',
				totalInvestment: '',
				approvalMethod: '',
				approvalNo: '',
				region: '',
				buildPeriod: ''
			},
			showIndustryPicker: false,
			showProcessPicker: false,
			showTypePicker: false,
			showMethodPicker: false,
			tempProcesses: [],
			industryList: [
				'电力、热力生产和供应业',
				'石油、煤炭及其他燃料加工业',
				'化学原料和化学制品制造业',
				'黑色金属冶炼和压延加工业',
				'有色金属冶炼和压延加工业',
				'非金属矿物制品业',
				'交通运输、仓储和邮政业',
				'建筑业'
			],
			processList: [
				'燃烧工艺',
				'化学反应工艺',
				'电解工艺',
				'熔炼工艺',
				'干燥工艺',
				'发酵工艺',
				'蒸馏工艺',
				'机械加工工艺'
			],
			typeList: [
				'新建',
				'改造'
			],
			methodList: [
				'审批制',
				'核准制',
				'备案制'
			]
		}
	},
	onLoad(options) {
		if (options.companyName) {
			this.form.companyName = decodeURIComponent(options.companyName);
		}
	},
	methods: {
		onSelectIndustry(item) {
			this.form.industry = item;
			this.showIndustryPicker = false;
		},
		openProcessPicker() {
			this.tempProcesses = [].concat(this.form.processes);
			this.showProcessPicker = true;
		},
		toggleProcess(item) {
			var idx = this.tempProcesses.indexOf(item);
			if (idx > -1) {
				this.tempProcesses.splice(idx, 1);
			} else {
				this.tempProcesses.push(item);
			}
		},
		confirmProcess() {
			this.form.processes = [].concat(this.tempProcesses);
			this.showProcessPicker = false;
		},
		onSelectType(item) {
			this.form.projectType = item;
			this.showTypePicker = false;
		},
		onSelectMethod(item) {
			this.form.approvalMethod = item;
			this.showMethodPicker = false;
		},
		onRegionChange(e) {
			this.form.region = e.detail.value.join(' ');
		},
		onChooseFile() {
			uni.showToast({ title: '文件上传功能', icon: 'none' });
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
		onSubmit() {
			if (!this.form.projectName) {
				uni.showToast({ title: '请输入项目名称', icon: 'none' });
				return;
			}
			if (!this.form.industry) {
				uni.showToast({ title: '请选择所属行业', icon: 'none' });
				return;
			}
			if (!this.form.processes.length) {
				uni.showToast({ title: '请选择工艺流程', icon: 'none' });
				return;
			}
			if (!this.form.projectType) {
				uni.showToast({ title: '请选择项目类型', icon: 'none' });
				return;
			}
			if (!this.form.totalInvestment) {
				uni.showToast({ title: '请输入项目投资总额', icon: 'none' });
				return;
			}
			if (!this.form.approvalMethod) {
				uni.showToast({ title: '请选择项目立项方式', icon: 'none' });
				return;
			}
			if (!this.form.approvalNo) {
				uni.showToast({ title: '请输入项目批复文件编号', icon: 'none' });
				return;
			}
			if (!this.form.region) {
				uni.showToast({ title: '请选择项目建设地区', icon: 'none' });
				return;
			}
			if (!this.form.buildPeriod) {
				uni.showToast({ title: '请输入项目建设周期', icon: 'none' });
				return;
			}
			/* 保存项目到 globalData */
			var app = getApp();
			var now = new Date();
			var timeStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
			var projectData = {
				projectName: this.form.projectName,
				companyName: this.form.companyName,
				industry: this.form.industry,
				processes: [].concat(this.form.processes),
				projectType: this.form.projectType,
				totalInvestment: this.form.totalInvestment,
				approvalMethod: this.form.approvalMethod,
				approvalNo: this.form.approvalNo,
				region: this.form.region,
				buildPeriod: this.form.buildPeriod,
				createTime: timeStr
			};
			if (app.globalData && app.globalData.projectList) {
				app.globalData.projectList.push(projectData);
			}
			uni.showToast({ title: '创建成功', icon: 'success' });
			setTimeout(function() {
				uni.navigateBack();
			}, 1500);
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

.label-tip {
	font-size: 24rpx;
	color: #999999;
	margin-left: 8rpx;
}

.form-input {
	font-size: 28rpx;
	color: #333333;
	padding: 16rpx 0;
}

.placeholder {
	color: #CCCCCC;
	font-size: 28rpx;
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

.arrow {
	color: #CCCCCC;
	font-size: 28rpx;
	margin-left: 16rpx;
}

/* 上传区 */
.upload-area {
	display: flex;
	align-items: center;
	padding: 20rpx 0;
}

.upload-box {
	width: 120rpx;
	height: 120rpx;
	border: 2rpx dashed #CCCCCC;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.upload-icon {
	font-size: 48rpx;
	color: #CCCCCC;
}

.upload-tip {
	font-size: 24rpx;
	color: #999999;
	line-height: 36rpx;
}

.upload-note {
	padding: 12rpx 0 0;
}

.upload-note-text {
	font-size: 24rpx;
	color: #999999;
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

.submit-btn {
	flex: 1;
	height: 88rpx;
	background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.submit-btn-text {
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
	width: 580rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	max-height: 70vh;
	overflow: hidden;
}

.center-popup-title {
	padding: 36rpx 30rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.center-popup-title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.center-popup-header {
	padding: 30rpx;
	display: flex;
	align-items: center;
}

.center-popup-cancel {
	font-size: 28rpx;
	color: #999999;
}

.center-popup-list {
	max-height: 500rpx;
}

.center-popup-item {
	padding: 28rpx 40rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.center-popup-item:last-child {
	border-bottom: none;
}

.center-popup-item-text {
	font-size: 28rpx;
	color: #333333;
}

.center-popup-item-active {
	color: #4CAF50;
	font-weight: bold;
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
