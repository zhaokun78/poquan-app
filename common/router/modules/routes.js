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
		path: '/pages/diary/diaryview',
		name: 'diaryview',
		meta: {
			title: '日记查看',
		},
	},
	{
		path: '/pages/diary/diaryedit',
		name: 'diaryedit',
		meta: {
			title: '日记编辑',
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
		path: '/pages/user/user_gerenjingyan',
		name: 'user_gerenjingyan',
		meta: {
			title: '个人经验',
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
