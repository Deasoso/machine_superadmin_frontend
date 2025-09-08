// json太菜了，改为用js文件来存数值
// 左侧导航栏用
// 格式如下，没有的项最好不要出现在json里：
// [{
//   "icon": "",
//   "name": "",
//   "route": "",
//   "children": [{
//     "icon": "",
//     "name": "",
//     "route": "",
//   },{
//     "icon": "",
//     "name": "",
//     "route": "",
//   }]
// }]
export default [{
  "icon": "el-icon-s-home",
  "name": "首页",
  "route": "mainPage",
},{
  "icon": "el-icon-user-solid",
  "name": "管理员列表",
  "route": "adminlist",
},{
  "icon": "el-icon-user-solid",
  "name": "全局变量",
  "route": "globallist",
},{
  "icon": "el-icon-user-solid",
  "name": "动作列表",
  "route": "actionlist",
},{
  "icon": "el-icon-user-solid",
  "name": "设备列表",
  "route": "machinelist",
},{
  "icon": "el-icon-user-solid",
  "name": "活动列表",
  "route": "activitylist",
}
// ,{
//   "icon": "el-icon-user-solid",
//   "name": "上传图片",
//   "route": "uploadpic",
// }
]
