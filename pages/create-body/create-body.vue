<template>
	<view class="page">
		<!-- 步骤指示器 -->
		<view class="step-bar">
			<view class="step-item" v-for="(s, i) in stepNames" :key="i" :class="{ 'step-active': displayStep === i, 'step-done': displayStep > i }">
				<view class="step-num">
					<text class="step-num-text">{{displayStep > i ? '✓' : (i + 1)}}</text>
				</view>
				<text class="step-name">{{s}}</text>
			</view>
		</view>

		<!-- ========== Step 0: 基本信息 ========== -->
		<view v-if="currentStep === 0" class="step-content">
			<view class="section-title"><text class="section-title-text">企业基本信息</text></view>
			<view class="form-card">
				<view class="field">
					<text class="field-label"><text class="req">*</text> 企业名称</text>
					<input class="field-input" v-model="form.companyName" placeholder="请输入企业名称" />
				</view>
				<view class="field" @click="showNaturePicker = true">
					<text class="field-label">企业性质</text>
					<view class="field-select">
						<text :class="form.companyNature ? 'sel-val' : 'sel-ph'">{{form.companyNature || '请选择企业性质'}}</text>
						<text class="sel-arrow">&#x276F;</text>
					</view>
				</view>
				<view class="field">
					<text class="field-label"><text class="req">*</text> 统一社会信用代码</text>
					<input class="field-input" v-model="form.creditCode" placeholder="18位统一社会信用代码" maxlength="18" />
				</view>
				<view class="field" @click="showIndustryPicker = true">
					<text class="field-label"><text class="req">*</text> 所属行业</text>
					<view class="field-select">
						<text :class="form.industry ? 'sel-val' : 'sel-ph'">{{form.industry || '请选择行业类型'}}</text>
						<text class="sel-arrow">&#x276F;</text>
					</view>
				</view>
				<view class="field">
					<text class="field-label">法定代表人</text>
					<input class="field-input" v-model="form.legalPerson" placeholder="选填" />
				</view>
				<view class="field">
					<text class="field-label">联系电话</text>
					<input class="field-input" v-model="form.phone" placeholder="选填" type="number" />
				</view>
				<view class="field">
					<text class="field-label">注册地址</text>
					<input class="field-input" v-model="form.regAddress" placeholder="选填" />
				</view>
				<view class="field">
					<text class="field-label">生产地址</text>
					<input class="field-input" v-model="form.prodAddress" placeholder="选填" />
				</view>
				<view class="field">
					<text class="field-label">联系人邮箱</text>
					<input class="field-input" v-model="form.email" placeholder="选填" />
				</view>
				<view class="field">
					<text class="field-label">主要产品与工艺</text>
					<textarea class="field-input field-textarea" v-model="form.products" placeholder="选填" />
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">环境污染责任保险</text></view>
			<view class="form-card">
				<view class="radio-group">
					<view class="radio-item" @click="onSelectInsurance('insured')">
						<view class="radio-circle" :class="{ 'radio-on': form.insuranceStatus === 'insured' }">
							<view class="radio-dot" v-if="form.insuranceStatus === 'insured'"></view>
						</view>
						<text class="radio-text">已投保</text>
					</view>
					<view class="radio-item" @click="onSelectInsurance('uninsured')">
						<view class="radio-circle" :class="{ 'radio-on': form.insuranceStatus === 'uninsured' }">
							<view class="radio-dot" v-if="form.insuranceStatus === 'uninsured'"></view>
						</view>
						<text class="radio-text">未投保</text>
					</view>
				</view>

				<view v-if="form.insuranceStatus === 'insured'">
					<view class="field">
						<text class="field-label"><text class="req">*</text> 保险公司</text>
						<input class="field-input" v-model="form.insureEnter" placeholder="请输入保险公司名称" />
					</view>
					<view class="field">
						<text class="field-label"><text class="req">*</text> 保险期限</text>
						<view class="date-range">
							<picker mode="date" :value="form.insureStartDate" @change="onInsureStartChange">
								<view class="date-box" :class="{ 'date-filled': form.insureStartDate }">
									<text :class="form.insureStartDate ? '' : 'sel-ph'">{{form.insureStartDate || '起始日期'}}</text>
								</view>
							</picker>
							<text class="date-sep">至</text>
							<picker mode="date" :value="form.insureEndDate" @change="onInsureEndChange">
								<view class="date-box" :class="{ 'date-filled': form.insureEndDate }">
									<text :class="form.insureEndDate ? '' : 'sel-ph'">{{form.insureEndDate || '结束日期'}}</text>
								</view>
							</picker>
						</view>
					</view>
					<view class="field">
						<text class="field-label"><text class="req">*</text> 保险金额（万元）</text>
						<input class="field-input" v-model="form.insureMoney" placeholder="请输入保险金额" type="digit" />
					</view>
				</view>

				<view v-if="form.insuranceStatus === 'uninsured'">
					<view class="field">
						<text class="field-label"><text class="req">*</text> 未投保原因</text>
						<textarea class="field-input field-textarea" v-model="form.noReason" placeholder="请输入未投保原因" />
					</view>
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">基本合规要求 (6.1条款)</text></view>
			<view class="form-card">
				<view class="check-item" v-for="(c, ci) in complianceList" :key="ci" @click="toggleCompliance(ci)">
					<view class="check-box" :class="{ 'check-box-on': form.compliance[ci] }">
						<text class="check-icon" v-if="form.compliance[ci]">✓</text>
					</view>
					<text class="check-text">{{c}}</text>
				</view>
			</view>
		</view>

		<!-- ========== Step 1: 能耗数据 ========== -->
		<view v-if="currentStep === 1" class="step-content">
			<view class="section-title"><text class="section-title-text">能耗数据填报（近2年）</text></view>

			<view class="form-card" v-for="(group, gi) in energyGroups" :key="gi">
				<view class="group-header">
					<text class="group-title">{{group.name}}</text>
				</view>
				<view class="energy-row" v-for="(item, ii) in group.items" :key="ii">
					<text class="energy-label">{{item.name}} <text class="energy-unit">({{item.unit}})</text></text>
					<view class="energy-inputs">
						<view class="year-input-wrap">
							<text class="year-tag">上年</text>
							<input class="year-input" v-model="form.energy[item.key + '_prev']" type="digit" placeholder="0" />
						</view>
						<view class="year-input-wrap">
							<text class="year-tag">本年</text>
							<input class="year-input" v-model="form.energy[item.key + '_curr']" type="digit" placeholder="0" />
						</view>
					</view>
				</view>
			</view>

			<view class="form-card">
				<view class="group-header"><text class="group-title">营业收入</text></view>
				<view class="energy-row">
					<text class="energy-label">营业收入金额 <text class="energy-unit">(万元)</text></text>
					<view class="energy-inputs">
						<view class="year-input-wrap">
							<text class="year-tag">上年</text>
							<input class="year-input" v-model="form.revenuePrev" type="digit" placeholder="0" />
						</view>
						<view class="year-input-wrap">
							<text class="year-tag">本年</text>
							<input class="year-input" v-model="form.revenueCurr" type="digit" placeholder="0" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- ========== Step 2: 碳排放计算 & 评分 ========== -->
		<view v-if="currentStep === 2" class="step-content">
			<view class="section-title"><text class="section-title-text">碳排放计算结果</text></view>
			<view class="result-card">
				<view class="result-row">
					<text class="result-label">上年碳排放总量</text>
					<text class="result-value">{{calcResult.emissionPrev}} tCO₂</text>
				</view>
				<view class="result-row">
					<text class="result-label">本年碳排放总量</text>
					<text class="result-value">{{calcResult.emissionCurr}} tCO₂</text>
				</view>
				<view class="result-row highlight">
					<text class="result-label">碳排放总量变化</text>
					<text class="result-value" :class="calcResult.emissionChange < 0 ? 'text-green' : 'text-red'">{{calcResult.emissionChangeStr}}</text>
				</view>
				<view class="result-divider"></view>
				<view class="result-row">
					<text class="result-label">上年碳排放强度</text>
					<text class="result-value">{{calcResult.intensityPrev}} tCO₂/万元</text>
				</view>
				<view class="result-row">
					<text class="result-label">本年碳排放强度</text>
					<text class="result-value">{{calcResult.intensityCurr}} tCO₂/万元</text>
				</view>
				<view class="result-row highlight">
					<text class="result-label">碳强度变化</text>
					<text class="result-value" :class="calcResult.intensityChange < 0 ? 'text-green' : 'text-red'">{{calcResult.intensityChangeStr}}</text>
				</view>
				<view class="result-divider"></view>
				<view class="result-row highlight">
					<text class="result-label">非化石能源占比</text>
					<text class="result-value">{{calcResult.nonFossilRatio}}%</text>
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">第一次评分（客观指标）</text></view>
			<view class="score-card">
				<view class="score-item">
					<text class="score-name">碳排放总量 (满分30)</text>
					<text class="score-val">{{scores.emission}}</text>
				</view>
				<view class="score-item">
					<text class="score-name">碳排放强度 (满分30)</text>
					<text class="score-val">{{scores.intensity}}</text>
				</view>
				<view class="score-item">
					<text class="score-name">非化石能源占比 (满分10)</text>
					<text class="score-val">{{scores.nonFossil}}</text>
				</view>
				<view class="score-divider"></view>
				<view class="score-total">
					<text class="score-total-label">客观指标合计</text>
					<text class="score-total-val" :class="scores.objectiveTotal >= 48 ? 'text-green' : 'text-red'">{{scores.objectiveTotal}} / 70</text>
				</view>
				<view class="score-result" :class="scores.objectiveTotal >= 48 ? 'pass' : 'fail'">
					<text class="score-result-text">{{scores.objectiveTotal >= 48 ? '通过初步评分，请继续填写' : '未达到48分门槛，建议优化后重新填报'}}</text>
				</view>
			</view>
		</view>

		<!-- ========== Step 3: 行业目录勾选 ========== -->
		<view v-if="currentStep === 3" class="step-content">
			<view class="section-title"><text class="section-title-text">转型金融支持经济活动目录勾选</text></view>
			<view class="tip-box">
				<text class="tip-text">请根据企业实际情况，勾选适用的行业转型活动目录（可多选）</text>
			</view>
			<view class="form-card">
				<view class="catalog-item" v-for="(cat, ci) in catalogList" :key="ci" @click="toggleCatalog(ci)">
					<view class="check-box" :class="{ 'check-box-on': form.catalogs[ci] }">
						<text class="check-icon" v-if="form.catalogs[ci]">✓</text>
					</view>
					<text class="catalog-text">{{cat}}</text>
				</view>
			</view>
		</view>

		<!-- ========== Step 4: 路径状态选择（目录勾选子步骤2） ========== -->
		<view v-if="currentStep === 4" class="step-content">
			<view class="section-title"><text class="section-title-text">目录选择</text></view>

			<!-- 领域切换栏（有子领域的行业才显示） -->
			<scroll-view v-if="showPathTabs" scroll-x class="field-tab-bar">
				<view class="field-tab-item" v-for="(tab, fi) in pathTabs" :key="tab.key" :class="{ 'field-tab-active': currentFieldIndex === fi }" @click="switchField(fi)">
					<text :class="['field-tab-text', currentFieldIndex === fi ? 'field-tab-text-active' : '']">{{tab.label}}</text>
				</view>
			</scroll-view>

			<!-- 无数据提示 -->
			<view v-if="!currentPaths.length" class="path-empty">
				<text class="path-empty-text">该行业暂无目录数据</text>
			</view>

			<!-- 路径列表 -->
			<view class="path-list">
				<view class="path-card" v-for="(path, pi) in currentPaths" :key="pi">
					<view class="path-top-row">
						<text class="path-title">{{path.title}}</text>
						<view class="path-status-options">
							<view class="path-status-item" @click="selectPathStatus(pi, '已完成')">
								<view :class="['radio-circle', 'radio-sm', getPathStatus(pi) === '已完成' ? 'radio-on' : '']">
									<view class="radio-dot" v-if="getPathStatus(pi) === '已完成'"></view>
								</view>
								<text class="path-status-label">已完成</text>
							</view>
							<view class="path-status-item" @click="selectPathStatus(pi, '进行中')">
								<view :class="['radio-circle', 'radio-sm', getPathStatus(pi) === '进行中' ? 'radio-on' : '']">
									<view class="radio-dot" v-if="getPathStatus(pi) === '进行中'"></view>
								</view>
								<text class="path-status-label">进行中</text>
							</view>
							<view class="path-status-item" @click="selectPathStatus(pi, '计划中')">
								<view :class="['radio-circle', 'radio-sm', getPathStatus(pi) === '计划中' ? 'radio-on' : '']">
									<view class="radio-dot" v-if="getPathStatus(pi) === '计划中'"></view>
								</view>
								<text class="path-status-label">计划中</text>
							</view>
						</view>
					</view>
					<view class="path-bottom-row">
						<text class="path-desc">{{path.desc}}</text>
						<text class="path-detail-link" @click="openDetail(path)">查看详情</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 路径详情弹窗 -->
		<view class="mask" v-if="showDetailPopup" @click="showDetailPopup = false">
			<view class="popup popup-wide" @click.stop="">
				<view class="popup-header">
					<text class="popup-title">路径详情</text>
					<text class="popup-close" @click="showDetailPopup = false">✕</text>
				</view>
				<scroll-view scroll-y class="popup-detail-scroll">
					<view class="popup-detail-content">
						<text class="popup-detail-title">{{detailPath.title}}</text>
						<text class="popup-detail-desc">{{detailPath.desc}}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- ========== Step 5: 承诺 ========== -->
		<view v-if="currentStep === 5" class="step-content">
			<view class="section-title"><text class="section-title-text">企业转型承诺</text></view>
			<view class="form-card">
				<view class="check-item" @click="form.commitReduce = !form.commitReduce">
					<view class="check-box" :class="{ 'check-box-on': form.commitReduce }">
						<text class="check-icon" v-if="form.commitReduce">✓</text>
					</view>
					<text class="check-text">承诺本年较上年碳排放总量下降</text>
				</view>
				<view class="check-item" @click="form.commitIntensity = !form.commitIntensity">
					<view class="check-box" :class="{ 'check-box-on': form.commitIntensity }">
						<text class="check-icon" v-if="form.commitIntensity">✓</text>
					</view>
					<text class="check-text">承诺本年较上年碳排放强度下降</text>
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">承诺值填写</text></view>
			<view class="form-card">
				<view class="field">
					<text class="field-label">碳排放总量目标下降比例 (%)</text>
					<input class="field-input" v-model="form.commitEmissionPct" type="digit" placeholder="例如: 5" />
				</view>
				<view class="field">
					<text class="field-label">碳排放强度目标下降比例 (%)</text>
					<input class="field-input" v-model="form.commitIntensityPct" type="digit" placeholder="例如: 8" />
				</view>
			</view>

			<view class="section-title">
				<text class="section-title-text">中期目标</text>
				<text class="section-title-sub">到2030年末，企业碳强度水平</text>
			</view>
			<view class="form-card">
				<view class="goal-option" v-for="(opt, oi) in mediumGoalOptions" :key="oi" @click="form.mediumGoal = opt.value">
					<view class="radio-circle" :class="{ 'radio-on': form.mediumGoal === opt.value }">
						<view class="radio-dot" v-if="form.mediumGoal === opt.value"></view>
					</view>
					<text class="goal-option-text">{{opt.label}}</text>
				</view>
			</view>

			<view class="section-title">
				<text class="section-title-text">长期目标</text>
				<text class="section-title-sub">实现碳中和愿景的时间</text>
			</view>
			<view class="form-card">
				<view class="goal-option" v-for="(opt, oi) in longGoalOptions" :key="oi" @click="form.longGoal = opt.value">
					<view class="radio-circle" :class="{ 'radio-on': form.longGoal === opt.value }">
						<view class="radio-dot" v-if="form.longGoal === opt.value"></view>
					</view>
					<text class="goal-option-text">{{opt.label}}</text>
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">数据使用授权</text></view>
			<view class="form-card">
				<view class="check-item" @click="form.agreeProtocol = !form.agreeProtocol">
					<view class="check-box" :class="{ 'check-box-on': form.agreeProtocol }">
						<text class="check-icon" v-if="form.agreeProtocol">✓</text>
					</view>
					<text class="check-text">本企业充分知晓并授权普惠征信公司使用上述数据进行科研/商业活动</text>
				</view>
			</view>
		</view>

		<!-- ========== Step 6: 综合评分 & 提交 ========== -->
		<view v-if="currentStep === 6" class="step-content">
			<view class="section-title"><text class="section-title-text">综合评分结果</text></view>
			<view class="final-card">
				<view class="final-score-circle" :class="finalGradeClass">
					<text class="final-score-num">{{scores.total}}</text>
					<text class="final-score-label">总分</text>
				</view>
				<text class="final-grade">等级：{{finalGrade}}</text>
				<text class="final-desc">{{finalDesc}}</text>
			</view>

			<view class="section-title"><text class="section-title-text">评分明细</text></view>
			<view class="score-card">
				<view class="score-item">
					<text class="score-name">碳排放总量</text>
					<text class="score-val">{{scores.emission}} / 30</text>
				</view>
				<view class="score-item">
					<text class="score-name">碳排放强度</text>
					<text class="score-val">{{scores.intensity}} / 30</text>
				</view>
				<view class="score-item">
					<text class="score-name">非化石能源占比</text>
					<text class="score-val">{{scores.nonFossil}} / 10</text>
				</view>
				<view class="score-item">
					<text class="score-name">转型计划</text>
					<text class="score-val">{{scores.plan}} / 10</text>
				</view>
				<view class="score-item">
					<text class="score-name">融资计划</text>
					<text class="score-val">{{scores.finance}} / 10</text>
				</view>
				<view class="score-item">
					<text class="score-name">治理计划</text>
					<text class="score-val">{{scores.governance}} / 10</text>
				</view>
			</view>

			<view class="section-title"><text class="section-title-text">待生成材料</text></view>
			<view class="form-card">
				<view class="doc-item" v-for="(d, di) in docList" :key="di">
					<view class="doc-icon"><text class="doc-icon-text">PDF</text></view>
					<text class="doc-name">{{d}}</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="btn-prev" v-if="currentStep > 0" @click="prevStep" hover-class="btn-hover">
				<text class="btn-prev-text">上一步</text>
			</view>
			<view class="btn-next" @click="nextStep" hover-class="btn-hover" :class="{ 'btn-full': currentStep === 0 }">
				<text class="btn-next-text">{{currentStep === 6 ? '提交审核' : '下一步'}}</text>
			</view>
		</view>

		<!-- 行业选择弹窗 -->
		<view class="mask" v-if="showIndustryPicker" @click="showIndustryPicker = false">
			<view class="popup" @click.stop="">
				<view class="popup-header"><text class="popup-title">选择行业</text></view>
				<scroll-view scroll-y class="popup-list">
					<view class="popup-item" v-for="(item, index) in industryList" :key="index" @click="onSelectIndustry(item)">
						<text :class="['popup-item-text', form.industry === item ? 'popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 企业性质选择弹窗 -->
		<view class="mask" v-if="showNaturePicker" @click="showNaturePicker = false">
			<view class="popup" @click.stop="">
				<view class="popup-header"><text class="popup-title">选择企业性质</text></view>
				<scroll-view scroll-y class="popup-list">
					<view class="popup-item" v-for="(item, index) in natureList" :key="index" @click="onSelectNature(item)">
						<text :class="['popup-item-text', form.companyNature === item ? 'popup-item-active' : '']">{{item}}</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
var { catalogData, getFieldsByIndustry, getPathsByIndustryAndField, hasSubFields } = require('../../utils/catalogData.js');

var INDUSTRY_MAP = {
	'钢铁行业': '钢铁行业',
	'煤电行业': '煤电行业',
	'建材行业': '建材行业',
	'农业': '农业行业',
	'化工行业': '化工业',
	'石化行业': '石化行业',
	'冶金行业(铜)': '冶金行业 铜',
	'冶金行业(铝)': '冶金行业 铝',
	'纺织行业': '纺织行业',
	'水上运输行业': '水上运输行业',
	'陶瓷行业': '陶瓷行业'
};

var CATALOG_INDUSTRIES = [
	'钢铁行业', '煤电行业', '建材行业', '农业行业', '化工业', '石化行业',
	'冶金行业 铜', '冶金行业 铝', '纺织行业', '水上运输行业', '陶瓷行业'
];

var EMISSION_FACTORS = {
	electricity: { factor: 0.3, unit: 'kg', perUnit: 'kWh', scale: 1 },
	heat: { factor: 0.0341, unit: 't', perUnit: 'GJ', scale: 1 },
	coal: { factor: 1.9780, unit: 'kg', perUnit: 'kg', scale: 1000 },
	coke: { factor: 2.8604, unit: 'kg', perUnit: 'kg', scale: 1000 },
	crude_oil: { factor: 2.15, unit: 'kg', perUnit: 'kg', scale: 1000 },
	natural_gas: { factor: 2.1622, unit: 'kg', perUnit: 'm3', scale: 1 },
	lpg: { factor: 3.1013, unit: 'kg', perUnit: 'kg', scale: 1000 },
	gasoline: { factor: 2.9251, unit: 'kg', perUnit: 'kg', scale: 1000 },
	diesel: { factor: 3.0959, unit: 'kg', perUnit: 'kg', scale: 1000 }
};

var STANDARD_COAL = {
    // 等价值 0.3 kgce/kWh（与样例报告一致）
    electricity: { factor: 0.3, nonFossilRatio: 0.363 },
    
    heat: { factor: 110, nonFossilRatio: 0 },
    coal: { factor: 0.7143, nonFossilRatio: 0 },
    coke: { factor: 0.9714, nonFossilRatio: 0 },
    crude_oil: { factor: 1.4286, nonFossilRatio: 0 },
    natural_gas: { factor: 1.33, nonFossilRatio: 0 },
    lpg: { factor: 1.7143, nonFossilRatio: 0 },
    gasoline: { factor: 1.4714, nonFossilRatio: 0 },
    diesel: { factor: 1.4571, nonFossilRatio: 0 }
};

export default {
	data() {
		return {
			currentStep: 0,
			currentFieldIndex: 0,
			showDetailPopup: false,
			detailPath: { title: '', desc: '' },
			stepNames: ['基本信息', '能耗数据', '碳排放评分', '目录勾选', '承诺', '综合评分'],
			showIndustryPicker: false,
			showNaturePicker: false,
			form: {
				companyName: '',
				companyNature: '',
				creditCode: '',
				industry: '',
				legalPerson: '',
				phone: '',
				regAddress: '',
				prodAddress: '',
				email: '',
				products: '',
				insuranceStatus: '',
				insureEnter: '',
				insureStartDate: '',
				insureEndDate: '',
				insureMoney: '',
				noReason: '',
				compliance: [false, false, false, false, false, false],
				energy: {},
				revenuePrev: '',
				revenueCurr: '',
				catalogs: [],
				commitReduce: false,
				commitIntensity: false,
				commitEmissionPct: '',
				commitIntensityPct: '',
				mediumGoal: '',
				longGoal: '',
				agreeProtocol: false,
				pathStatus: {}
			},
			complianceList: [
				'(a) 企业依法设立，具有独立法人资格',
				'(b) 信用表现良好，未列入失信名录',
				'(c) 企业正常经营，未列入异常名录',
				'(d) 遵守环保法规，近一年无环保处罚',
				'(e) 近一年无产品质量不合格情况',
				'(f) 三年内无重大劳动争议'
			],
			industryList: [
				'钢铁行业', '煤电行业', '建材行业', '农业',
				'化工行业', '石化行业', '冶金行业(铜)', '冶金行业(铝)',
				'纺织行业', '水上运输行业', '陶瓷行业'
			],
			natureList: [
				'国有企业', '民营企业', '外资企业',
				'重点排污单位', '强制性清洁生产审核企业'
			],
			energyGroups: [
				{
					name: '电力与热力',
					items: [
						{ name: '用电量', unit: '千瓦时', key: 'electricity' },
						{ name: '用热量', unit: 'GJ', key: 'heat' }
					]
				},
				{
					name: '燃料燃烧',
					items: [
						{ name: '原煤', unit: '吨', key: 'coal' },
						{ name: '焦炭', unit: '吨', key: 'coke' },
						{ name: '原油', unit: '吨', key: 'crude_oil' },
						{ name: '天然气', unit: '立方米', key: 'natural_gas' },
						{ name: '液化石油气', unit: '吨', key: 'lpg' },
						{ name: '汽油', unit: '吨', key: 'gasoline' },
						{ name: '柴油', unit: '吨', key: 'diesel' }
					]
				}
			],
			catalogList: [
				'1.钢铁行业经济活动目录',
				'2.煤电行业经济活动目录',
				'3.建材行业经济活动目录',
				'4.农业经济活动目录',
				'5.化工行业经济活动目录',
				'6.石化行业经济活动目录',
				'7.冶金行业(铜)经济活动目录',
				'8.冶金行业(铝)经济活动目录',
				'9.纺织行业经济活动目录',
				'10.水上运输行业经济活动目录',
				'11.陶瓷行业经济活动目录'
			],
			docList: [
				'转型认定报告',
				'融资主体转型规划书',
				'企业环境信息披露报告',
				'碳核算报告'
			],
			mediumGoalOptions: [
				{ value: '1', label: '优于《联合国气候变化框架公约》等气候责任及国家、省、市“双碳”行动目标' },
				{ value: '2', label: '达到《联合国气候变化框架公约》等气候责任及国家、省、市“双碳”行动目标' },
				{ value: '3', label: '接近《联合国气候变化框架公约》等气候责任及国家、省、市“双碳”行动目标' }
			],
			longGoalOptions: [
				{ value: '1', label: '2045年前' },
				{ value: '2', label: '2050年前' },
				{ value: '3', label: '2055年前' },
				{ value: '4', label: '2060年前' }
			]
		}
	},
	computed: {
		displayStep: function() {
			if (this.currentStep <= 3) return this.currentStep;
			return this.currentStep - 1;
		},
		selectedCatalogIndustries: function() {
			var selected = [];
			for (var i = 0; i < CATALOG_INDUSTRIES.length; i++) {
				if (this.form.catalogs[i]) selected.push(CATALOG_INDUSTRIES[i]);
			}
			if (!selected.length && this.form.industry) {
				selected.push(INDUSTRY_MAP[this.form.industry] || this.form.industry);
			}
			return selected;
		},
		pathTabs: function() {
			var industries = this.selectedCatalogIndustries;
			var hasFields = false;
			var tabs = [];
			for (var i = 0; i < industries.length; i++) {
				if (hasSubFields(industries[i])) {
					hasFields = true;
					break;
				}
			}
			for (var j = 0; j < industries.length; j++) {
				var industry = industries[j];
				var fields = getFieldsByIndustry(industry);
				if (fields.length) {
					for (var k = 0; k < fields.length; k++) {
						tabs.push({ key: industry + '::' + fields[k], label: fields[k], industry: industry, field: fields[k] });
					}
				} else if (hasFields) {
					tabs.push({ key: industry + '::', label: industry, industry: industry, field: '' });
				}
			}
			return tabs;
		},
		showPathTabs: function() {
			return this.pathTabs.length > 0;
		},
		activePathKey: function() {
			if (this.showPathTabs) {
				var tab = this.pathTabs[this.currentFieldIndex] || this.pathTabs[0];
				return tab ? tab.key : '';
			}
			return this.selectedCatalogIndustries.join('::');
		},
		currentPaths: function() {
			var paths = [];
			if (this.showPathTabs) {
				var tab = this.pathTabs[this.currentFieldIndex] || this.pathTabs[0];
				if (!tab) return paths;
				return getPathsByIndustryAndField(tab.industry, tab.field);
			}
			for (var i = 0; i < this.selectedCatalogIndustries.length; i++) {
				paths = paths.concat(getPathsByIndustryAndField(this.selectedCatalogIndustries[i]));
			}
			return paths;
		},
		calcResult: function() {
			var prevTotal = 0, currTotal = 0;
			var keys = Object.keys(EMISSION_FACTORS);
		for (var k in EMISSION_FACTORS) {
		    var ef = EMISSION_FACTORS[k];
		    var pv = parseFloat(this.form.energy[k + '_prev']) || 0;
		    var cv = parseFloat(this.form.energy[k + '_curr']) || 0;
		    // 用 scale 转换单位（吨→kg 乘以1000）
		    var pvScaled = pv * ef.scale;
		    var cvScaled = cv * ef.scale;
		    if (ef.unit === 'kg') {
		        prevTotal += pvScaled * ef.factor / 1000;  // kg → t
		        currTotal += cvScaled * ef.factor / 1000;
		    } else {
		        prevTotal += pvScaled * ef.factor;
		        currTotal += cvScaled * ef.factor;
		    }
		}
			var revPrev = parseFloat(this.form.revenuePrev) || 1;
			var revCurr = parseFloat(this.form.revenueCurr) || 1;
			var intPrev = revPrev > 0 ? prevTotal / revPrev : 0;
			var intCurr = revCurr > 0 ? currTotal / revCurr : 0;
			var emChange = prevTotal > 0 ? (currTotal - prevTotal) / prevTotal : 0;
			var intChange = intPrev > 0 ? (intCurr - intPrev) / intPrev : 0;

			var totalStdCoal = 0, nonFossilStdCoal = 0;
			var scKeys = Object.keys(STANDARD_COAL);
			for (var j = 0; j < scKeys.length; j++) {
				var sk = scKeys[j];
				var sc = STANDARD_COAL[sk];
				var val = parseFloat(this.form.energy[sk + '_curr']) || 0;
				var scale = EMISSION_FACTORS[sk] ? EMISSION_FACTORS[sk].scale || 1 : 1;  // ← 新增
				var valScaled = val * scale;  // ← 新增：吨→kg转换
				var std = valScaled * sc.factor / 1000;
				totalStdCoal += std;
				nonFossilStdCoal += std * sc.nonFossilRatio;
			}
			var nfRatio = totalStdCoal > 0 ? (nonFossilStdCoal / totalStdCoal * 100) : 0;

			return {
				emissionPrev: prevTotal.toFixed(2),
				emissionCurr: currTotal.toFixed(2),
				emissionChange: emChange,
				emissionChangeStr: (emChange * 100).toFixed(1) + '%',
				intensityPrev: intPrev.toFixed(4),
				intensityCurr: intCurr.toFixed(4),
				intensityChange: intChange,
				intensityChangeStr: (intChange * 100).toFixed(1) + '%',
				nonFossilRatio: nfRatio.toFixed(1)
			};
		},
		scores: function() {
			var emDrop = -this.calcResult.emissionChange;
			var intDrop = -this.calcResult.intensityChange;
			var nfr = parseFloat(this.calcResult.nonFossilRatio);

			var emScore = 0;
			if (emDrop >= 0.10) emScore = 30;
			else if (emDrop >= 0.05) emScore = 24;
			else if (emDrop > 0) emScore = 15;

			var intScore = 0;
			if (intDrop >= 0.10) intScore = 30;
			else if (intDrop >= 0.05) intScore = 24;
			else if (intDrop > 0) intScore = 15;

			var nfScore = 0;
			if (nfr > 25) nfScore = 10;
			else if (nfr >= 20) nfScore = 5;

			var planScore = 8;
			var financeScore = 8;
			var govScore = 8;
			var objectiveTotal = emScore + intScore + nfScore;
			var total = objectiveTotal + planScore + financeScore + govScore;

			return {
				emission: emScore,
				intensity: intScore,
				nonFossil: nfScore,
				plan: planScore,
				finance: financeScore,
				governance: govScore,
				objectiveTotal: objectiveTotal,
				total: total
			};
		},
		finalGrade: function() {
			var t = this.scores.total;
			if (t >= 90) return '领先';
			if (t >= 70) return '良好';
			if (t >= 50) return '一般';
			return '较差';
		},
		finalGradeClass: function() {
			var t = this.scores.total;
			if (t >= 90) return 'grade-lead';
			if (t >= 70) return 'grade-good';
			if (t >= 50) return 'grade-normal';
			return 'grade-poor';
		},
		finalDesc: function() {
			var g = this.finalGrade;
			if (g === '领先' || g === '良好') return '符合转型融资主体认定要求，可提交审核';
			if (g === '一般') return '建议优化转型计划后提交';
			return '暂不符合认定要求，请优化后重新填报';
		}
	},
	onLoad() {
		var catalogs = [];
		for (var i = 0; i < this.catalogList.length; i++) {
			catalogs.push(false);
		}
		this.form.catalogs = catalogs;
	},
	methods: {
		initPathStatus: function() {
			this.currentFieldIndex = 0;
			var tabs = this.pathTabs;
			if (tabs.length) {
				for (var i = 0; i < tabs.length; i++) {
					this.ensurePathStatus(tabs[i].key, getPathsByIndustryAndField(tabs[i].industry, tabs[i].field).length);
				}
			} else {
				this.ensurePathStatus(this.activePathKey, this.currentPaths.length);
			}
		},
		ensurePathStatus: function(key, length) {
			if (!key) return;
			var values = this.form.pathStatus[key] || [];
			for (var i = values.length; i < length; i++) values.push('');
			this.$set(this.form.pathStatus, key, values);
		},
		switchField: function(index) {
			this.currentFieldIndex = index;
		},
		getPathStatus: function(pathIndex) {
			var values = this.form.pathStatus[this.activePathKey] || [];
			return values[pathIndex] || '';
		},
		selectPathStatus: function(pathIndex, status) {
			this.ensurePathStatus(this.activePathKey, this.currentPaths.length);
			this.$set(this.form.pathStatus[this.activePathKey], pathIndex, status);
		},
		openDetail: function(path) {
			this.detailPath = path;
			this.showDetailPopup = true;
		},
		closeDetail: function() {
			this.showDetailPopup = false;
		},
		toggleCompliance: function(idx) {
			var arr = [].concat(this.form.compliance);
			arr[idx] = !arr[idx];
			this.form.compliance = arr;
		},
		toggleCatalog: function(idx) {
			var arr = [].concat(this.form.catalogs);
			arr[idx] = !arr[idx];
			this.form.catalogs = arr;
		},
		onSelectIndustry: function(item) {
			if (this.form.industry !== item) {
				this.form.pathStatus = {};
				this.currentFieldIndex = 0;
			}
			this.form.industry = item;
			this.showIndustryPicker = false;
		},
		onSelectNature: function(item) {
			this.form.companyNature = item;
			this.showNaturePicker = false;
		},
		onInsureStartChange: function(e) {
			this.form.insureStartDate = e.detail.value;
		},
		onInsureEndChange: function(e) {
			this.form.insureEndDate = e.detail.value;
		},
		buildInsuranceData: function() {
			if (this.form.insuranceStatus === 'insured') {
				var start = this.form.insureStartDate.replace(/-/g, '');
				var end = this.form.insureEndDate.replace(/-/g, '');
				return {
					insure: {
						insure_enter: this.form.insureEnter,
						insure_time: start + '-' + end,
						insure_money: parseFloat(this.form.insureMoney) || 0
					}
				};
			} else if (this.form.insuranceStatus === 'uninsured') {
				return {
					no_insure: {
						no_reason: this.form.noReason
					}
				};
			}
			return {};
		},
		onSelectInsurance: function(status) {
			if (this.form.insuranceStatus === status) return;
			this.form.insuranceStatus = status;
			this.form.insureEnter = '';
			this.form.insureStartDate = '';
			this.form.insureEndDate = '';
			this.form.insureMoney = '';
			this.form.noReason = '';
		},
		prevStep: function() {
			if (this.currentStep > 0) this.currentStep--;
		},
		nextStep: function() {
			if (this.currentStep === 0) {
				if (!this.form.companyName) {
					uni.showToast({ title: '请输入企业名称', icon: 'none' }); return;
				}
				if (!this.form.creditCode || this.form.creditCode.length < 15) {
					uni.showToast({ title: '请输入有效的社会信用代码', icon: 'none' }); return;
				}
				if (!this.form.industry) {
					uni.showToast({ title: '请选择所属行业', icon: 'none' }); return;
				}
				if (this.form.insuranceStatus === 'insured') {
					if (!this.form.insureEnter) {
						uni.showToast({ title: '请输入保险公司名称', icon: 'none' }); return;
					}
					if (!this.form.insureStartDate) {
						uni.showToast({ title: '请选择保险起始日期', icon: 'none' }); return;
					}
					if (!this.form.insureEndDate) {
						uni.showToast({ title: '请选择保险结束日期', icon: 'none' }); return;
					}
					if (!this.form.insureMoney) {
						uni.showToast({ title: '请输入保险金额', icon: 'none' }); return;
					}
				}
				if (this.form.insuranceStatus === 'uninsured') {
					if (!this.form.noReason) {
						uni.showToast({ title: '请输入未投保原因', icon: 'none' }); return;
					}
				}
			}
			if (this.currentStep === 2 && this.scores.objectiveTotal < 48) {
				uni.showModal({
					title: '提示',
					content: '客观指标评分未达到48分门槛，是否仍要继续？',
					success: function(res) {
						if (res.confirm) {
							this.currentStep++;
						}
					}.bind(this)
				});
				return;
			}
			if (this.currentStep === 3) {
				this.currentStep = 4;
				this.initPathStatus();
				return;
			}
			if (this.currentStep === 6) {
				this.onSubmit();
				return;
			}
			if (this.currentStep < 6) this.currentStep++;
		},
		onSubmit: function() {
			if (!this.form.agreeProtocol) {
				uni.showToast({ title: '请先同意数据使用授权协议', icon: 'none' }); return;
			}
			if (!this.form.mediumGoal) {
				uni.showToast({ title: '请选择中期目标', icon: 'none' }); return;
			}
			if (!this.form.longGoal) {
				uni.showToast({ title: '请选择长期目标', icon: 'none' }); return;
			}
			var submitData = this.buildInsuranceData();
			submitData.medium_goal = this.form.mediumGoal;
			submitData.long_goal = this.form.longGoal;
			console.log('submitData:', JSON.stringify(submitData));
			uni.showLoading({ title: '提交中...' });
			var that = this;
			setTimeout(function() {
				uni.hideLoading();
				uni.showModal({
					title: '提交成功',
					content: '您的企业信息已提交审核，审核结果将在"我的"页面展示',
					showCancel: false,
					success: function() {
						uni.navigateBack();
					}
				});
			}, 1500);
		}
	}
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background-color: #F3F5F7;
	padding-bottom: 140rpx;
}

/* 步骤条 */
.step-bar {
	display: flex;
	background-color: #FFFFFF;
	padding: 24rpx 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.step-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.step-num {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: #E0E0E0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 8rpx;
}

.step-active .step-num {
	background: linear-gradient(135deg, #43A047, #66BB6A);
}

.step-done .step-num {
	background-color: #A5D6A7;
}

.step-num-text {
	color: #FFFFFF;
	font-size: 22rpx;
	font-weight: bold;
}

.step-name {
	font-size: 20rpx;
	color: #999999;
}

.step-active .step-name {
	color: #2E7D32;
	font-weight: bold;
}

.step-done .step-name {
	color: #4CAF50;
}

/* 内容区 */
.step-content {
	padding: 0 0 20rpx;
}

/* ===== Step 4: 路径状态选择 ===== */
/* 领域切换栏 */
.field-tab-bar {
	display: flex;
	white-space: nowrap;
	background-color: #FFFFFF;
	margin: 0 24rpx 16rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.field-tab-item {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 24rpx 32rpx;
	position: relative;
	flex-shrink: 0;
}

.field-tab-active {
	border-bottom: 4rpx solid #4CAF50;
}

.field-tab-text {
	font-size: 26rpx;
	color: #999999;
}

.field-tab-text-active {
	color: #4CAF50;
	font-weight: bold;
}

/* 路径列表 */
.path-list {
	padding: 0 0 20rpx;
}

.path-card {
	margin: 0 24rpx 16rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx 24rpx 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.path-top-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 12rpx;
}

.path-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	flex: 1;
	margin-right: 16rpx;
	line-height: 40rpx;
}

.path-status-options {
	display: flex;
	align-items: center;
	gap: 8rpx;
	flex-shrink: 0;
}

.path-status-item {
	display: flex;
	align-items: center;
}

.path-status-label {
	font-size: 20rpx;
	color: #999999;
	margin-left: 4rpx;
	flex-shrink: 0;
}

.path-bottom-row {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.path-desc {
	font-size: 24rpx;
	color: #999999;
	line-height: 36rpx;
	flex: 1;
	margin-right: 20rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.path-detail-link {
	font-size: 24rpx;
	color: #4CAF50;
	flex-shrink: 0;
}

/* 无数据提示 */
.path-empty {
	padding: 80rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.path-empty-text {
	font-size: 28rpx;
	color: #CCCCCC;
}

/* 详情弹窗 */
.popup-wide {
	width: 640rpx;
	max-width: calc(100vw - 48rpx);
}

.popup-close {
	font-size: 32rpx;
	color: #999999;
}

.popup-detail-scroll {
	width: 100%;
	height: 600rpx;
	max-height: 600rpx;
	box-sizing: border-box;
	padding: 20rpx 36rpx 40rpx;
}

.popup-detail-content {
	width: 100%;
	box-sizing: border-box;
}

.popup-detail-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #1A1A1A;
	line-height: 44rpx;
	display: block;
	margin-bottom: 20rpx;
	word-break: break-all;
	white-space: normal;
}

.popup-detail-desc {
	font-size: 26rpx;
	color: #666666;
	line-height: 42rpx;
	display: block;
	word-break: break-all;
	white-space: normal;
}

.section-title {
	padding: 28rpx 28rpx 12rpx;
}

.section-title-text {
	font-size: 28rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.section-title-sub {
	font-size: 22rpx;
	color: #999999;
	margin-left: 12rpx;
}

/* 表单卡片 */
.form-card {
	margin: 0 24rpx 16rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.field {
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.field:last-child {
	border-bottom: none;
}

.field-label {
	font-size: 26rpx;
	color: #333333;
	margin-bottom: 12rpx;
	display: block;
}

.req {
	color: #E53935;
	margin-right: 4rpx;
}

.field-input {
	font-size: 28rpx;
	color: #1A1A1A;
	padding: 12rpx 0;
}

.field-textarea {
	width: 100%;
	height: 100rpx;
	padding: 8rpx 0;
}

.field-select {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12rpx 0;
}

.sel-val { font-size: 28rpx; color: #1A1A1A; }
.sel-ph { font-size: 28rpx; color: #CCCCCC; }
.sel-arrow { font-size: 24rpx; color: #CCCCCC; }

/* 合规勾选 */
.check-item {
	display: flex;
	align-items: flex-start;
	padding: 22rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.check-item:last-child { border-bottom: none; }

.check-box {
	width: 40rpx;
	height: 40rpx;
	border: 3rpx solid #D0D0D0;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	margin-right: 16rpx;
	margin-top: 4rpx;
}

.check-box-on {
	background: linear-gradient(135deg, #43A047, #66BB6A);
	border-color: #43A047;
}

.check-icon {
	color: #FFFFFF;
	font-size: 24rpx;
	font-weight: bold;
}

.check-text {
	font-size: 26rpx;
	color: #333333;
	line-height: 40rpx;
	flex: 1;
}

/* 能耗数据 */
.group-header {
	padding: 22rpx 28rpx 10rpx;
	border-bottom: 1rpx solid #F0F0F0;
}

.group-title {
	font-size: 26rpx;
	font-weight: bold;
	color: #4CAF50;
}

.energy-row {
	padding: 18rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.energy-row:last-child { border-bottom: none; }

.energy-label {
	font-size: 26rpx;
	color: #333333;
	margin-bottom: 12rpx;
	display: block;
}

.energy-unit {
	font-size: 22rpx;
	color: #999999;
}

.energy-inputs {
	display: flex;
	gap: 16rpx;
}

.year-input-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 0 16rpx;
}

.year-tag {
	font-size: 22rpx;
	color: #999999;
	margin-right: 12rpx;
	flex-shrink: 0;
}

.year-input {
	flex: 1;
	font-size: 26rpx;
	color: #1A1A1A;
	height: 68rpx;
}

/* 计算结果 */
.result-card {
	margin: 0 24rpx 16rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx 28rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.result-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14rpx 0;
}

.highlight { padding: 18rpx 0; }

.result-label {
	font-size: 26rpx;
	color: #666666;
}

.result-value {
	font-size: 28rpx;
	color: #1A1A1A;
	font-weight: 500;
}

.text-green { color: #2E7D32 !important; }
.text-red { color: #E53935 !important; }

.result-divider {
	height: 1rpx;
	background-color: #F0F0F0;
	margin: 8rpx 0;
}

/* 评分卡片 */
.score-card {
	margin: 0 24rpx 16rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 24rpx 28rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.score-item {
	display: flex;
	justify-content: space-between;
	padding: 14rpx 0;
	border-bottom: 1rpx solid #F8F8F8;
}

.score-item:last-child { border-bottom: none; }

.score-name {
	font-size: 26rpx;
	color: #666666;
}

.score-val {
	font-size: 28rpx;
	color: #1A1A1A;
	font-weight: bold;
}

.score-divider {
	height: 2rpx;
	background: linear-gradient(90deg, #4CAF50, #81C784);
	margin: 16rpx 0;
	border-radius: 2rpx;
}

.score-total {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
}

.score-total-label {
	font-size: 30rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.score-total-val {
	font-size: 32rpx;
	font-weight: bold;
}

.score-result {
	margin-top: 16rpx;
	padding: 20rpx;
	border-radius: 12rpx;
	text-align: center;
}

.pass { background-color: #E8F5E9; }
.fail { background-color: #FFF3E0; }

.score-result-text {
	font-size: 26rpx;
	font-weight: 500;
}

.pass .score-result-text { color: #2E7D32; }
.fail .score-result-text { color: #E65100; }

/* 目录勾选 */
.tip-box {
	margin: 0 24rpx 12rpx;
	padding: 20rpx 24rpx;
	background-color: #E8F5E9;
	border-radius: 12rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #2E7D32;
	line-height: 38rpx;
}

.catalog-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.catalog-item:last-child { border-bottom: none; }

.catalog-text {
	font-size: 26rpx;
	color: #333333;
	flex: 1;
}

/* 综合评分圆圈 */
.final-card {
	margin: 0 24rpx 16rpx;
	background-color: #FFFFFF;
	border-radius: 16rpx;
	padding: 40rpx 28rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.final-score-circle {
	width: 180rpx;
	height: 180rpx;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.grade-lead { background: linear-gradient(135deg, #1B5E20, #388E3C); }
.grade-good { background: linear-gradient(135deg, #2E7D32, #66BB6A); }
.grade-normal { background: linear-gradient(135deg, #E65100, #FF9800); }
.grade-poor { background: linear-gradient(135deg, #B71C1C, #E53935); }

.final-score-num {
	font-size: 48rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.final-score-label {
	font-size: 22rpx;
	color: rgba(255,255,255,0.8);
}

.final-grade {
	font-size: 32rpx;
	font-weight: bold;
	color: #1A1A1A;
	margin-bottom: 10rpx;
}

.final-desc {
	font-size: 24rpx;
	color: #666666;
	text-align: center;
}

/* 待生成文件 */
.doc-item {
	display: flex;
	align-items: center;
	padding: 24rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.doc-item:last-child { border-bottom: none; }

.doc-icon {
	width: 56rpx;
	height: 56rpx;
	background: linear-gradient(135deg, #E53935, #FF5252);
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.doc-icon-text {
	font-size: 18rpx;
	font-weight: bold;
	color: #FFFFFF;
}

.doc-name {
	font-size: 28rpx;
	color: #333333;
}

/* 底部按钮 */
.bottom-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	padding: 20rpx 24rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background-color: #FFFFFF;
	box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.06);
	z-index: 100;
	gap: 20rpx;
}

.btn-prev {
	flex: 1;
	height: 88rpx;
	border: 2rpx solid #4CAF50;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-prev-text {
	font-size: 30rpx;
	color: #4CAF50;
	font-weight: 500;
}

.btn-next {
	flex: 2;
	height: 88rpx;
	background: linear-gradient(135deg, #2E7D32, #4CAF50);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-full {
	flex: 1;
}

.btn-next-text {
	font-size: 30rpx;
	color: #FFFFFF;
	font-weight: bold;
}

.btn-hover {
	opacity: 0.8;
}

/* 弹窗 */
.mask {
	position: fixed;
	top: 0; left: 0; right: 0; bottom: 0;
	background-color: rgba(0,0,0,0.5);
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.popup {
	width: 600rpx;
	background-color: #FFFFFF;
	border-radius: 20rpx;
	max-height: 70vh;
	overflow: hidden;
}

.popup-header {
	padding: 32rpx 28rpx 16rpx;
	text-align: center;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #1A1A1A;
}

.popup-list {
	max-height: 500rpx;
}

.popup-item {
	padding: 26rpx 36rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.popup-item:last-child { border-bottom: none; }

.popup-item-text {
	font-size: 28rpx;
	color: #333333;
}

.popup-item-active {
	color: #2E7D32;
	font-weight: bold;
}
/* 单选按钮 */
.radio-group {
	display: flex;
	padding: 24rpx 28rpx;
	gap: 48rpx;
	border-bottom: 1rpx solid #F5F5F5;
}

.radio-item {
	display: flex;
	align-items: center;
}

.radio-circle {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	border: 3rpx solid #D0D0D0;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;
}

.radio-sm.radio-circle {
	width: 30rpx;
	height: 30rpx;
	margin-right: 4rpx;
}

.radio-sm .radio-dot {
	width: 14rpx;
	height: 14rpx;
}

.radio-on {
	border-color: #43A047;
}

.radio-dot {
	width: 18rpx;
	height: 18rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #43A047, #66BB6A);
}

.radio-text {
	font-size: 26rpx;
	color: #333333;
}

/* 目标单选 */
.goal-option {
	display: flex;
	align-items: flex-start;
	padding: 22rpx 28rpx;
	border-bottom: 1rpx solid #F8F8F8;
}

.goal-option:last-child { border-bottom: none; }

.goal-option .radio-circle {
	flex-shrink: 0;
	margin-top: 2rpx;
}

.goal-option-text {
	font-size: 26rpx;
	color: #333333;
	line-height: 40rpx;
	flex: 1;
}

/* 保险日期范围选择 */
.date-range {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 12rpx 0;
}

.date-box {
	flex: 1;
	padding: 12rpx 20rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	font-size: 26rpx;
}

.date-filled {
	background-color: #E8F5E9;
}

.date-sep {
	font-size: 24rpx;
	color: #999999;
	flex-shrink: 0;
}
</style>
