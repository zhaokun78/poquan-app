const routes = [{
		path: "/pages/login/login",
		name: 'login',
		meta: {
			title: '登录',
		},
	},
	{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/index/index',
		name: 'index',
		meta: {
			title: '主页',
		},
	},
	{
		//注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
		path: '/pages/home/home',
		//aliasPath:'/',  //对于h5端你必须在首页加上aliasPath并设置为/
		name: 'home',
		meta: {
			title: '首页',
		},
	},
	{
		path: '/pages/shop/shop',
		name: 'shop',
		meta: {
			title: '商城',
		},
	},
	{
		path: '/pages/diary/supply/supplydetail',
		name: 'supplydetail',
		meta: {
			title: '供应查看',
		},
	},
	{
		path: '/pages/diary/supply/supplyedit',
		name: 'supplyedit',
		meta: {
			title: '供应编辑',
		},
	},
	{
		path: '/pages/diary/diaryindex',
		name: 'diaryindex',
		meta: {
			title: '个人主页',
		},
	},
	{
		path: '/pages/diary/diaryview',
		name: 'diaryview',
		meta: {
			title: '需求查看',
		},
	},
	{
		path: '/pages/diary/diaryedit',
		name: 'diaryedit',
		meta: {
			title: '需求编辑',
		},
	},
	{
		path: '/pages/diary/daily/dailydetail',
		name: 'dailydetail',
		meta: {
			title: '日常查看',
		},
	},
	{
		path: '/pages/diary/daily/dailyedit',
		name: 'dailyedit',
		meta: {
			title: '日常编辑',
		},
	},
	{
		path: '/pages/product/productedit',
		name: 'productedit',
		meta: {
			title: '商品编辑',
		},
	},
	{
		path: '/pages/product/productdetail',
		name: 'productdetail',
		meta: {
			title: '商品详情',
		},
	},
	{
		path: '/pages/user/people',
		name: 'people',
		meta: {
			title: '个人中心',
		},
	},
	{
		path: '/pages/user/promo_code',
		name: 'promo_code',
		meta: {
			title: '推广码',
		},
	},
	{
		path: '/pages/user/register',
		name: 'register',
		meta: {
			title: '用户注册',
		},
	},
	{
		path: '/pages/user/forgetpassword',
		name: 'forgetpassword',
		meta: {
			title: '忘记密码',
		},
	},
	{
		path: '/pages/user/userdetail',
		name: 'userdetail',
		meta: {
			title: '个人详情',
		},
	},
	{
		path: '/pages/user/useredit',
		name: 'useredit',
		meta: {
			title: '个人编辑',
		},
	},
	{
		path: '/pages/user/user_gerenjingli',
		name: 'user_gerenjingli',
		meta: {
			title: '个人经历',
		},
	},
	{
		path: '/pages/user/address/address-list/address-list',
		name: 'address-list',
		meta: {
			title: '地址管理',
		},
	},
	{
		path: '/pages/order/order',
		name: 'order',
		meta: {
			title: '订单管理',
		},
	},
	{
		path: '/pages/order/order_list',
		name: 'order_list',
		meta: {
			title: '订单列表',
		},
	},
	{
		path: '/pages/user/address/address-edit/address-edit',
		name: 'address-edit',
		meta: {
			title: '地址编辑',
		},
	},
	{
		path: '/pages/user/userexit',
		name: 'userexit',
		meta: {
			title: '退出',
		},
	},
	{
		path: '/pages/common/exit',
		name: 'exit',
		meta: {
			title: '退出',
		},
	},
	{
		path: '/pages/common/success',
		name: 'success',
		meta: {
			title: 'success',
		},
	},
]
export default routes
