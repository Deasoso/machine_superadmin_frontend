<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="图片上传" />
      <div class="pageinpadding">
        <el-upload
          class="avatar-uploader"
          action="http://39.108.167.152:8481/api/useruploadpicture/"
          :headers="getheader()"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        {{imageQiniuUrl}}
      </div>
    </div>
  </div>
</template>

<script>
// action="http://localhost:7979/api/uploadpic/"
// action="https://yuezhuoapi.deaso40.com/api/uploadpic/"
export default {
    data() {
      return {
        imageUrl: '',
        imageQiniuUrl: ''
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageQiniuUrl = res.picurl;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      getheader(){
        return {
          'token': localStorage.getItem("machine_superadmin_userInfo")
        }
      }
    }
  }
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
