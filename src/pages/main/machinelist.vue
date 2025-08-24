<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="设备查询" />
      <div class="pagepadding">
        <el-button
          size="small"
          type="success"
          style="margin-left: 16px;margin-bottom: 16px;"
          @click="searchDialog = true">筛选设置</el-button>
        <el-button
          size="small"
          type="warning"
          style="margin-left: 16px;margin-bottom: 16px;"
          @click="newDialog = true">新增/修改设备</el-button>
        <el-tabs v-model="activeIndex" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item" :name="index"></el-tab-pane>
        </el-tabs>
        <div>
          <el-tag style="margin-left: 16px;margin-bottom: 16px;" v-for="tag, tagindex in searchObj" 
            :key="tagindex" closable :type="warning" @close="() => { delete searchObj[tagindex]; getList(); }">
            {{ (searchNameList.find(item => item.label == tagindex)).name + '：' + ((searchNameList.find(item => item.label == tagindex)).list ? 
              (searchNameList.find(item => item.label == tagindex)).list.find(item => item.value == tag).name : tag) }}
          </el-tag>
        </div>
        <div v-loading="loading">
          <el-table
            :data="tableData"
            :row-key="row => row.id"
            style="width: 100%">
            <el-table-column label="唯一ID" prop="id"> </el-table-column>
            <el-table-column label="创建人id" prop="adminid"> </el-table-column>
            <el-table-column label="名称" prop="name"> </el-table-column>
            <el-table-column label="种类" prop="type">
              <template #default="scope">
                {{ statulist.find(item => item.value == scope.row.type).name }}
              </template>
            </el-table-column>
            <el-table-column label="设备ip" prop="ip"> </el-table-column>
            <el-table-column label="动作列表" prop="actionlist"> </el-table-column>
            <el-table-column label="状态" prop="statu">
              <template #default="scope">
                {{ statulist2.find(item => item.value == scope.row.statu).name }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="tip"> </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 30px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="params.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="allamount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="搜索内容" v-model="searchDialog">
      <div v-for="(search, index1) in searchNameList" :key="index1">
        <el-input placeholder="请输入内容" v-model="searchObj[search.label]" style="margin:5px;" v-if="!search.list">
          <template #prepend>{{search.name}}</template>
        </el-input>
        <el-select v-model="searchObj[search.label]" style="margin:5px;" v-if="search.list">
          <template #prefix>{{search.name}}<el-divider direction="vertical"/></template>
          <el-option v-for="item in search.list" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="searchDialog = false">取 消</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="新增/修改设备" v-model="newDialog" v-loading="newLoading">
      <div v-for="(user, index2) in userNameList" :key="index2">
        <el-input placeholder="请输入内容" v-model="userInfoObj[user.label]" style="margin:5px;" v-if="!user.list"
          :show-password="(user.label == 'password' || user.label == 'confirmPassword' || user.label == 'pw' ) ? true : false">
          <template #prepend>{{user.name}}</template>
        </el-input>
        <el-select v-model="userInfoObj[user.label]" style="margin:5px;" :multiple="user.multiple" v-if="user.list" @change="selectchange">
          <template #prefix>{{user.name}}<el-divider direction="vertical"/></template>
          <el-option v-for="item in user.list" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newDialog = false">取 消</el-button>
        <el-button type="primary" @click="newUser()">新增/修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import api from '@/api';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
const router = useRouter();

const params = ref({
  page: 1,
  pagesize: 10
});

const statulist = ref([
  {name: '乐白机械臂', value: 0}, 
  {name: '法奥机械臂', value: 1}, 
]);

const statulist2 = ref([
  {name: '使用中', value: 0}, 
  {name: '已停用', value: 1}, 
  {name: '已注销', value: 2}, 
]);

const actionlist = ref([]);

const tableData = ref([]);
const allamount = ref(0);
const loading = ref(false);
const searchObj = ref({});
const searchNameList = ref([]);
const searchDialog = ref(false);
const newLoading = ref(false);
const userInfoObj = ref({});
const userNameList = ref([]);
const newDialog = ref(false);

onMounted(async () => {
  searchNameList.value = [];
  searchNameList.value.push({name: '状态',label: 'statu', list: statulist.value });
  userNameList.value = [];
  userNameList.value.push({name: '唯一id，不填则新增',label: 'id'});
  userNameList.value.push({name: '名称',label: 'name'});
  userNameList.value.push({name: '种类',label: 'type', 
    list: statulist.value 
  });
  userNameList.value.push({name: '设备ip',label: 'ip'});
  userNameList.value.push({name: '动作列表',label: 'actionlist',
    list: actionlist.value, multiple: true
  });
  userNameList.value.push({name: '状态',label: 'statu',
    list: statulist2.value
  });
  userNameList.value.push({name: '备注',label: 'tip'});
  await getList();
})

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  params.value.pagesize = val;
  params.value.page = 1;
  getList();
}
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  params.value.page = val;
  getList();
}
const search = () => {
  searchDialog.value = false;
  params.value.page = 1;
  getList();
}
const getList = async () => {
  try{
    loading.value = true;
    var postbody = {};
    if(params.value.page >= 1){
      postbody.offset = (params.value.page - 1) * params.value.pagesize;
      postbody.limit = params.value.pagesize;
    } 
    postbody.searchObj = searchObj.value;
    const { result } = await api.post('/searchmachine', postbody);
    console.log(result);
    tableData.value = result.rows;
    allamount.value = result.count;
    loading.value = false;
  }catch(e){
    console.error(e);
    loading.value = false;
  }
}
const newUser = async () => {
  try{
    newLoading.value = true;
    const result = await api.post('/addmachine', {
      obj: userInfoObj.value
    });
    console.log(result);
    ElMessage('创建成功')
    userInfoObj.value = {};
    newDialog.value = false;
    newLoading.value = false;
    await getList();
  }catch(e){
    console.error(e);
    newLoading.value = false;
  }
}

const selectchange = async (value) => {
  console.log(value)
  await getActionList();
}

const getActionList = async () => {
  const { result } = await api.post('/searchaction', {
    searchObj: {
      type: userInfoObj.value.type
    }
  });
  console.log(result);
  var newactionlist = [];
  for(const index in result.rows){
    newactionlist.push({
      name: result.rows[index].name,
      value: result.rows[index].actionid
    })
  }
  actionlist.value = newactionlist;
  userNameList.value[4].list = newactionlist;
}

const activeIndex = ref(0);
const tabKey = ref('statu');
const tabList = ref(['全部', '正常', '冻结', '注销']);
const tabValueList = ref([0, 0, 1, 2]);

const handleClick = (tab) => {
  if(tab.index == 0){
    delete searchObj.value[tabKey.value];
  }else{
    searchObj.value[tabKey.value] = tabValueList.value[tab.index];
  }
  getList();
}

const timestamptodate = (timestamp) => {
  if(!timestamp) return "";
  const getdate = new Date(parseInt(timestamp))
  let mf = getdate.getHours() < 10 ? '0' + getdate.getHours() : getdate.getHours();
  let ss = getdate.getMinutes() < 10 ? '0' + getdate.getMinutes() : getdate.getMinutes();
  return getdate.getFullYear() + "-" + (getdate.getMonth() + 1) + "-" + getdate.getDate() + " " + mf + ":" + ss;
}

</script>

<style scoped>

</style>
