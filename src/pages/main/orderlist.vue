<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="账单查询" />
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
          @click="newDialog = true">新增/修改账单</el-button>
        <el-tabs v-model="activeIndex" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item" :name="index"></el-tab-pane>
        </el-tabs>
        <div v-loading="loading">
          <el-table
            :data="tableData"
            :row-key="row => row.id"
            style="width: 100%">
            <el-table-column label="唯一ID" prop="id"> </el-table-column>
            <el-table-column label="创建用户id" prop="adminid"> </el-table-column>
            <el-table-column label="创建公司id" prop="companyid"> </el-table-column>
            <el-table-column label="合约id" prop="contractid"> </el-table-column>
            <el-table-column label="总资金" prop="money"> </el-table-column>
            <el-table-column label="账单备注字符串" prop="orderstr"> </el-table-column>
            <el-table-column label="生效时间" prop="timestamp">
              <template #default="scope">
                {{ timestamptodate(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="结清时间" prop="endtimestamp">
              <template #default="scope">
                {{ timestamptodate(scope.row.endtimestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="statu"> </el-table-column>
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
    <el-dialog :close-on-click-modal="false" title="新增/修改公司" v-model="newDialog" v-loading="newLoading">
      <div v-for="(user, index2) in userNameList" :key="index2">
        <el-input placeholder="请输入内容" v-model="userInfoObj[user.label]" style="margin:5px;" v-if="!user.list"
          :show-password="(user.label == 'password' || user.label == 'confirmPassword' || user.label == 'pw' ) ? true : false">
          <template #prepend>{{user.name}}</template>
        </el-input>
        <el-select v-model="userInfoObj[user.label]" style="margin:5px;" v-if="user.list">
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
  searchNameList.value.push({name: '成员id',label: 'tableid'});
  userNameList.value = [];
  userNameList.value.push({name: '唯一id，不填则新增',label: 'id'});
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
    const { result } = await api.post('/searchorder', postbody);
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
    const result = await api.post('/addorder', {
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

const activeIndex = ref(0);
const tabKey = ref('statu');
const tabList = ref(['全部', '已结清', '到期未结', '未到期', '收款过多']);
const tabValueList = ref([0, 0, 1, 2, 3]);

const handleClick = (tab) => {
  if(tab.index == 0){
    delete searchObj.value[tabKey.value];
  }else{
    searchObj.value[tabKey.value] = tabValueList.value[tab.index];
  }
  getList();
  console.log(searchObj.value);
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
