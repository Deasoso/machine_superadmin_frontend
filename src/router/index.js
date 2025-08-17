import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/pages/home'
import login from '@/pages/login/login'
import mainpage from '@/components/mainPage'

import adminlist from '@/pages/main/adminlist'
import globallist from '@/pages/main/globallist'
import actionlist from '@/pages/main/actionlist'
import activitylist from '@/pages/main/activitylist'
import machinelist from '@/pages/main/machinelist'

const routes = [
	{
		path: '/',
		component: login
	},{
		path: '/login',
		component: login
	},
	{
		path: '/mainpage',
		component: mainpage,
		name: '',
		children: [{
			path: '',
			component: home,
		},{
			path: '/home',
			component: home,
		},{
			path: '/adminlist',
			component: adminlist,
			meta: ['管理员列表'],
		},{
			path: '/globallist',
			component: globallist,
			meta: ['全局变量列表'],
		},{
			path: '/actionlist',
			component: actionlist,
			meta: ['机器动作列表'],
		},{
			path: '/activitylist',
			component: activitylist,
			meta: ['活动列表'],
		},{
			path: '/machinelist',
			component: machinelist,
			meta: ['设备列表'],
		}
	]},

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
