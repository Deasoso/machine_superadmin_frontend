<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="合约查询" />
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
          @click="newDialog = true">修改合约</el-button>
        <el-tabs v-model="activeIndex" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item" :name="index"></el-tab-pane>
        </el-tabs>
        <div v-if="activeIndex == 0">
          <div v-loading="loading">
            <el-table
              :data="tableData"
              :row-key="row => row.id"
              style="width: 100%">
              <el-table-column label="唯一ID" prop="id"> </el-table-column>
              <el-table-column label="创建用户id" prop="adminid"> </el-table-column>
              <el-table-column label="创建公司id" prop="companyid"> </el-table-column>
              <el-table-column label="名称" prop="title"> </el-table-column>
              <el-table-column label="总资金" prop="money"> </el-table-column>
              <el-table-column label="开始时间" prop="starttimestamp">
                <template #default="scope">
                  {{ timestamptodate(scope.row.starttimestamp) }}
                </template>
              </el-table-column>
              <el-table-column label="结束时间" prop="endtimestamp">
                <template #default="scope">
                  {{ timestamptodate(scope.row.endtimestamp) }}
                </template>
              </el-table-column>
              <el-table-column label="付款频率" prop="payrate"> </el-table-column>
              <el-table-column label="开头字符" prop="startstr"> </el-table-column>
              <el-table-column label="状态" prop="statu"> </el-table-column>
              <el-table-column label="备注" prop="tip"> </el-table-column>
              <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="seeContract(scope.row.id)">查看</el-button>
                <el-button
                  size="small"
                  type="warning"
                  @click="changeContract(scope.row.id)">修改</el-button>
              </template>
            </el-table-column>
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
        <div v-if="activeIndex == 1">
          <div style="margin-top: 8px;">
            输入名字
            <el-input v-model="input1" style="width: 240px;margin-left: 10px;" :autosize="true" placeholder="输入合约名字"/>
          </div>
          <div style="margin-top: 8px;">
            选择银行卡
            <el-select v-model="input2" placeholder="选择银行卡" style="width: 240px;margin-left: 10px;">
              <el-option
                v-for="item in bankcardlist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div style="margin-top: 8px;">
            开始时间
            <el-date-picker
              style="margin-left: 10px;"
              v-model="input3"
              type="datetime"
              placeholder="选择起始时间"
            />
          </div>
          <div style="margin-top: 8px;">
            结束时间
            <el-date-picker
              style="margin-left: 10px;"
              v-model="input4"
              type="datetime"
              placeholder="选择结束时间"
            />
          </div>
          <div style="margin-top: 8px;">
            选择频率
            <el-select v-model="input5" placeholder="选择频率" style="width: 120px;margin-left: 10px;margin-right: 10px;">
              <el-option
                v-for="item in options5"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            第
            <el-select v-model="input6" placeholder="选择日期" style="width: 120px;margin-left: 10px;">
              <el-option
                v-for="item in options6"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            日
          </div>
          <div style="margin-top: 8px;">
            输入每次支付价格
            <el-input v-model="input7" style="width: 240px;margin-left: 10px;" :autosize="true" placeholder="输入价格"/>
          </div>
          <el-button type="primary" style="margin-top: 8px;" @click="afterselect">生成账单</el-button>
          <div style="margin-top: 8px;">生成账单列表</div>
          <el-table
            :data="orderlist1"
            :row-key="row => row.id"
            style="width: 100%;">
            <el-table-column label="账单id" prop="orderstr"> </el-table-column>
            <el-table-column label="账单单价" prop="money"> </el-table-column>
            <el-table-column label="预支付时间" prop="timestamp">
              <template #default="scope">
                {{ timestamptodate(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="statu">
              <template #default="scope">
                待确认
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="tip"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="openChange(scope.row.id)">修改</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteChange(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 8px;">自定义账单列表</div>
          <el-table
            :data="orderlist2"
            :row-key="row => row.id"
            style="width: 100%;">
            <el-table-column label="账单id" prop="orderstr"> </el-table-column>
            <el-table-column label="账单单价" prop="money"> </el-table-column>
            <el-table-column label="预支付时间" prop="timestamp">
              <template #default="scope">
                {{ timestamptodate(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="statu">
              <template #default="scope">
                待确认
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="tip"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="openChange(scope.row.id)">修改</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteChange(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" style="margin-top: 8px;" @click="addmyself">添加自定义账单</el-button>
          <div>
            <el-button type="success" style="margin-top: 8px;" @click="confirmcontract">确认合约</el-button>
          </div>
        </div>
        <div v-if="activeIndex == 2">
          <div style="margin-top: 8px;">
            合约名称： {{ truecontract.title || '未选择合约' }}
          </div>
          <div style="margin-top: 8px;">合约账单列表</div>
          <el-table
            :data="trueorderlist"
            :row-key="row => row.id"
            style="width: 100%;margin-top: 8px;">
            <el-table-column label="账单id" prop="orderstr"> </el-table-column>
            <el-table-column label="账单单价" prop="money"> </el-table-column>
            <el-table-column label="预支付时间" prop="timestamp">
              <template #default="scope">
                {{ timestamptodate(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="statu"> </el-table-column>
            <el-table-column label="备注" prop="tip"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="openChange(scope.row.id)">修改</el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteChange(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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

const changeIndex = ref(0);
const changeObj = ref({});
const changeNameList = ref([]);
const changeDialog = ref(false);

const bankcardlist = ref([]);

const initedContractid = ref(0);

const input1 = ref('');
const input2 = ref('');
const options2 = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
const input3 = ref('');
const input4 = ref('');
const input5 = ref('');
const options5 = ref(['每月', '每两月', '每三月', '每六月', '每年']);
const input6 = ref('');
const options6 = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
const input7 = ref('');

const listData = ref([]);
const orderlist1 = ref([]);
const orderlist2 = ref([]);

const trueorderid = ref(0);
const trueorderlist = ref([]);
const truecontract = ref({});

onMounted(async () => {
  searchNameList.value = [];
  searchNameList.value.push({name: '成员id',label: 'tableid'});
  userNameList.value = [];
  userNameList.value.push({name: '唯一id，不填则新增',label: 'id'});
  userNameList.value.push({name: '归属管理员id',label: 'adminid'});
  userNameList.value.push({name: '名称',label: 'name'});
  userNameList.value.push({name: '头像url',label: 'avatar'});
  userNameList.value.push({name: '备注',label: 'tip'});
  changeNameList.value = [];
  changeNameList.value.push({name: '单价',label: 'money'});
  changeNameList.value.push({name: '预支付时间',label: 'timestamp'});
  changeNameList.value.push({name: '备注',label: 'tip'});
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
    const { result } = await api.post('/searchcontract', postbody);
    console.log(result);
    tableData.value = result.rows;
    allamount.value = result.count;
    const getbankcards = await api.post('/searchbankcard', postbody);
    console.log(getbankcards);
    bankcardlist.value = getbankcards.result.rows;
    loading.value = false;
  }catch(e){
    console.error(e);
    loading.value = false;
  }
}
const getOrderList = async () => {
  try{
    loading.value = true;
    const gettrueorders = await api.post('/searchorder', {
      searchObj: {
        contractid: trueorderid.value
      }
    });
    console.log(gettrueorders);
    trueorderlist.value = gettrueorders.result.rows;
    truecontract.value = gettrueorders.getcontract;
    loading.value = false;
  }catch(e){
    console.error(e);
    loading.value = false;
  }
}
const newUser = async () => {
  try{
    newLoading.value = true;
    const result = await api.post('/addcontract', {
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
const initContract = async () => {
  try{
    newLoading.value = true;
    const result = await api.post('/initcontract');
    console.log(result);
    initedContractid.value = result.newcontract.id;
    ElMessage('初始化成功')
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
const tabList = ref(['合约列表', '新建合约', '合约账单列表']);
const tabValueList = ref([0, 1]);

const handleClick = async (tab) => {
  console.log(tab.index);
  if(tab.index == 0){
    await getList();
  }else if(tab.index == 1){
    if(initedContractid.value == 0){
      await initContract();
    }
  }else{
    await getOrderList();
  }
}

const afterselect = () => {
  orderlist1.value = [];
  console.log(input3.value);
  var currentstamp = input3.value;
  var stampindex = 0;
  const endstamp = input4.value;
  console.log(endstamp);
  var monthday = input6.value;
  if(monthday >= currentstamp.getDate()){
    currentstamp = new Date(currentstamp.getFullYear(), currentstamp.getMonth() - 1, currentstamp.getDate());
  }
  while(currentstamp.getTime() <= endstamp.getTime()){
    monthday = input6.value;
    stampindex += 1;
    if(input5.value == '每月'){
      if(new Date(currentstamp.getFullYear(), currentstamp.getMonth() + 2, 0).getDate() < input6.value){
        monthday = new Date(currentstamp.getFullYear(), currentstamp.getMonth() + 2, 0).getDate();
      }
      currentstamp = new Date(currentstamp.getFullYear(), currentstamp.getMonth() + 1, monthday);
    }
    if(currentstamp.getTime() <= endstamp.getTime()){
      orderlist1.value.push(
        {
          id: stampindex,
          orderstr: 'FS' + initedContractid.value + 'N' + stampindex,
          money: input7.value,
          timestamp: currentstamp.getTime(), 
          tip: ''
        }
      );
    }
  }
  console.log(orderlist1.value);
  refreshlistid();
}

const addmyself = () => {
  orderlist2.value.push(
    {
      orderstr: 'FS' + initedContractid.value + 'U' + (orderlist2.value.length + 1),
      money: input7.value,
      timestamp: (new Date).setHours(0, 0, 0, 0),
      tip: ''
    }
  );
  refreshlistid();
}

const openChange = (index) => {
  changeIndex.value = index;
  changeDialog.value = true;
  console.log(index);
  if(index < orderlist1.value.length){
    console.log(orderlist1.value)
    for(var index1 in orderlist1.value[changeIndex.value]){
      changeObj.value[index1] = orderlist1.value[changeIndex.value][index1];
    }
  }else{
    for(var index2 in orderlist2.value[changeIndex.value]){
      changeObj.value[index2] = orderlist2.value[changeIndex.value][index2];
    }
  }
  console.log(changeObj.value);
}

const deleteChange = (index) => {
  if(index < orderlist1.value.length){
    delete orderlist1.value[index];
  }else{
    delete orderlist2.value[index];
  }
  refreshlistid();
}

const confirmlist = () => {
  if(changeIndex.value < orderlist1.value.length){
    for(var index1 in changeObj.value){
      orderlist1.value[changeIndex.value][index1] = changeObj.value[index1];
    }
  }else{
    for(var index2 in changeObj.value){
      orderlist2.value[changeIndex.value][index2] = changeObj.value[index2];
    }
  }
  changeDialog.value = false;
  refreshlistid();
}

const refreshlistid = () => {
  var onelistid = 0;
  for(var index1 in orderlist1.value){
    orderlist1.value[index1].id = onelistid;
    onelistid += 1;
  }
  for(var index2 in orderlist2.value){
    orderlist2.value[index2].id = onelistid;
    onelistid += 1;
  }
}

const confirmcontract = async () => {
  try{
    newLoading.value = true;
    const result = await api.post('/addcontract', {
      obj: {
        id: initedContractid.value,
        companyid: input2.value,
        starttimestamp: input3.value.getTime(),
        endtimestamp: input4.value.getTime(),
        payrate: input5.value + ',' + input6.value,
        startstr: 'FS' + initedContractid.value,
        title: input1.value,
        statu: 1,
      },
      orderlist1: orderlist1.value,
      orderlist2: orderlist2.value
    });
    console.log(result);
    ElMessage('创建成功')
    userInfoObj.value = {};
    newDialog.value = false;
    newLoading.value = false;
    trueorderid.value = initedContractid.value;
    activeIndex.value = 2;
    await getOrderList();
  }catch(e){
    console.error(e);
    newLoading.value = false;
  }
}

const seeContract = async (id) => {
  trueorderid.value = id;
  activeIndex.value = 2;
  await getOrderList();
}

const changeContract = (id) => {
  userInfoObj.value = {
    id: id
  };
  newDialog.value = true;
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
