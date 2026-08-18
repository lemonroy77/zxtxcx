<script>
export default {
	globalData: {
		newBody: null,
		projectList: [],
		bodyList: [
			{
				companyName: '顺风农业集团有限公司',
				industry: '农业',
				processes: '农副产品加工业',
				createTime: '2026-04-09 10:25:14'
			},
			{
				companyName: '吉安市农好农业发展有限公司',
				industry: '农业',
				processes: '农副产品加工业',
				createTime: '2026-03-23 10:31:20'
			},
			{
				companyName: '吉安市农好农业发展有限公司',
				industry: '农业',
				processes: '农副产品加工业',
				createTime: '2026-03-18 15:58:29'
			}
		]
	},
	onLaunch: function() {
		console.log('App Launch')
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
}
</script>

<style>
page {
	background-color: #F5F5F5;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
