import { createRouter, createWebHashHistory } from 'vue-router'

import home from '@/pages/home'
import login from '@/pages/login/login'
import mainpage from '@/components/mainPage'

import adminlist from '@/pages/main/adminlist'
import companylist from '@/pages/main/companylist'
import contractlist from '@/pages/main/contractlist'
import bankcardlist from '@/pages/main/bankcardlist'
import globallist from '@/pages/main/globallist'
import orderlist from '@/pages/main/orderlist'
import bankorderlist from '@/pages/main/bankorderlist'


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
			path: '/companylist',
			component: companylist,
			meta: ['公司列表'],
		},{
			path: '/contractlist',
			component: contractlist,
			meta: ['合约列表'],
		},{
			path: '/bankcardlist',
			component: bankcardlist,
			meta: ['合约列表'],
		},{
			path: '/globallist',
			component: globallist,
			meta: ['全局变量列表'],
		},{
			path: '/orderlist',
			component: orderlist,
			meta: ['待付账单列表'],
		},{
			path: '/bankorderlist',
			component: bankorderlist,
			meta: ['银行账单列表'],
		}
	]},

]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
