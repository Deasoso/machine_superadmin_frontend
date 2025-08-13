<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style>
.pagepadding {
  padding: 20px;
}
.app-container {
  padding: 20px;
}
.pageborder{
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
}
.pageback{
  margin: 12px;
  background-color: #ffffff;
}
.pageinpadding{
  padding: 16px;
}
body{
  margin: 0
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.overhide{
  width: 144px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialog-footer{
  margin: 5px;
}
</style>