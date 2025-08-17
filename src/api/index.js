import axios from 'axios';
import { ElMessage } from 'element-plus'

var addr = 'http://localhost:8481/api'
// var addr = 'http://120.55.115.156:1031/api';

const login = async function(url, data){
  const result = await axios.post(
    addr + url, 
    data
  );
  return result.data;
}

const post = async function(url, data){
  const userinfo = localStorage.getItem("school_superadmin_userInfo");
  if(!userinfo){
    ElMessage('请先登录！')
    throw('未登录')
  } 
  const result = await axios.post(
    addr + url, 
    data,
    {
      headers: {
        'token': localStorage.getItem("school_superadmin_userInfo"),
        logintype: 3
      }
    }
  );
  return result.data;
}

const postWithoutHead = async function(url, data){
  const result = await axios.post(
    addr + url, 
    data
  );
  return result.data;
}

export default {
  post,
  login,
  postWithoutHead
}