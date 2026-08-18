<template>
	<view class="page">
		<!-- Tab 栏 -->
		<view class="tab-bar">
			<view :class="['tab-item', currentTab === index ? 'tab-active' : '']" v-for="(tab, index) in tabs" :key="index" @click="switchTab(index)">
				<text :class="['tab-text', currentTab === index ? 'tab-text-active' : '']">{{tab.name}}</text>
			</view>
		</view>

		<!-- 问卷内容 -->
		<scroll-view scroll-y class="content-scroll">
			<view class="question-list">
				<view class="question-item" v-for="(q, qIndex) in currentQuestions" :key="qIndex">
					<view class="question-title">
						<text class="required">*</text>
						<text class="question-title-text">{{q.title}}</text>
					</view>
					<text class="question-desc">{{q.desc}}</text>
					<view class="option-list">
						<view class="option-item" v-for="(opt, oIndex) in q.options" :key="oIndex" @click="selectOption(qIndex, opt.value)">
							<view :class="['radio-circle', answers[currentTab][qIndex] === opt.value ? 'radio-active' : '']">
								<view class="radio-dot" v-if="answers[currentTab][qIndex] === opt.value"></view>
							</view>
							<text class="option-text">{{opt.label}}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部按钮区（固定底部） -->
		<view class="bottom-area">
			<view class="btn-row">
				<view class="prev-btn" @click="onPrev">
					<text class="prev-btn-text">上一步</text>
				</view>
				<view class="save-btn" @click="onSave">
					<text class="save-btn-text">暂时保存</text>
				</view>
				<view class="next-btn" @click="onNext">
					<text class="next-btn-text">下一步</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyName: '',
			projectName: '',
			currentTab: 0,
			tabs: [
				{ name: '能源' },
				{ name: '材料' },
				{ name: '物流' },
				{ name: '排放' }
			],
			/* 每个 tab 4 道题，每题3个选项（短期/中期/长期） */
			questions: [
				/* 能源 */
				[
					{
						title: '类型：蒸汽',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：燃油',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：天然气',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：电力',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					}
				],
				/* 材料 */
				[
					{
						title: '类型：原材料替代',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：包装材料',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：辅助材料',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：回收利用',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					}
				],
				/* 物流 */
				[
					{
						title: '类型：运输方式',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：仓储管理',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：冷链物流',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：路线优化',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					}
				],
				/* 排放 */
				[
					{
						title: '类型：废气处理',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：废水处理',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：固废处理',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					},
					{
						title: '类型：碳排放监测',
						desc: '食品加工中减少能耗和碳排放的节能减排技术应用，例如余热回收、热泵干燥、变频电机、光伏发电等',
						options: [{ label: '短期', value: '短期' }, { label: '中期', value: '中期' }, { label: '长期', value: '长期' }]
					}
				]
			],
			/* 每个 tab 的答案数组 */
			answers: [
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', ''],
				['', '', '', '']
			]
		}
	},
	computed: {
		currentQuestions: function() {
			return this.questions[this.currentTab] || [];
		}
	},
	onLoad(options) {
		if (options.companyName) {
			this.companyName = decodeURIComponent(options.companyName);
		}
		if (options.projectName) {
			this.projectName = decodeURIComponent(options.projectName);
		}
	},
	methods: {
		switchTab(index) {
			this.currentTab = index;
		},
		selectOption(qIndex, value) {
			/* Vue2 数组嵌套需要 $set 触发响应 */
			this.$set(this.answers[this.currentTab], qIndex, value);
		},
		onPrev() {
			if (this.currentTab > 0) {
				this.currentTab--;
			} else {
				uni.navigateBack();
			}
		},
		onSave() {
			uni.showToast({ title: '已暂时保存', icon: 'success' });
		},
		onNext() {
			/* 检查当前 tab 是否全部作答 */
			var currentAnswers = this.answers[this.currentTab];
			for (var i = 0; i < currentAnswers.length; i++) {
				if (!currentAnswers[i]) {
					uni.showToast({ title: '请完成当前页所有题目', icon: 'none' });
					return;
				}
			}
			if (this.currentTab < this.tabs.length - 1) {
				this.currentTab++;
			} else {
				/* 最后一个 tab，提交 */
				uni.showToast({ title: '提交成功', icon: 'success' });
				setTimeout(function() {
					/* 返回到创建计划书页面 */
					uni.navigateBack({ delta: 2 });
				}, 1500);
			}
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

/* Tab 栏 */
.tab-bar {
	display: flex;
	background-color: #FFFFFF;
	border-bottom: 1rpx solid #F0F0F0;
}

.tab-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx 0;
	position: relative;
}

.tab-active {
	border-bottom: 4rpx solid #4CAF50;
}

.tab-text {
	font-size: 28rpx;
	color: #999999;
}

.tab-text-active {
	color: #4CAF50;
	font-weight: bold;
}

/* 内容滚动区 */
.content-scroll {
	flex: 1;
	padding: 0 0 200rpx;
}

/* 问题项 */
.question-item {
	background-color: #FFFFFF;
	padding: 30rpx;
	margin-bottom: 2rpx;
}

.question-title {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.required {
	color: #E53935;
	font-size: 28rpx;
	margin-right: 6rpx;
}

.question-title-text {
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.question-desc {
	font-size: 24rpx;
	color: #999999;
	line-height: 38rpx;
	margin-bottom: 24rpx;
}

/* 选项 */
.option-list {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 40rpx;
}

.option-item {
	display: flex;
	align-items: center;
}

.radio-circle {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 3rpx solid #CCCCCC;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.radio-active {
	border-color: #4CAF50;
}

.radio-dot {
	width: 22rpx;
	height: 22rpx;
	border-radius: 50%;
	background-color: #4CAF50;
}

.option-text {
	font-size: 28rpx;
	color: #333333;
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

.prev-btn {
	flex: 1;
	height: 88rpx;
	border: 2rpx solid #999999;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
}

.prev-btn-text {
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
</style>
