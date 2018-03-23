<template>
  <main id="UserInfoPopup" v-drag>
    <header class="UserInfoPopup_header">
      {{UserInfoPopupData.type==='add'?'新增用户':`修改用户${UserInfoPopupData.data.name}的信息`}}
      <i class="el-icon-close UserInfoPopup_close" @click="closeUserPopup"></i>
    </header>
    <section class="UserInfoPopup_main">
      <div class="tabSelect" v-if="UserInfoPopupData.type==='edit'">
        <span :class="{'active':selectActive==='first'}" @click="selectActive='first'">基本信息</span>
        <span :class="{'active':selectActive==='second'}" @click="selectActive='second'">用户权限</span>
      </div>
      <div class="UserInfoPopup_info" v-if="selectActive==='first'|| UserInfoPopupData.type==='add'">
        <el-form :model="UserInfoPopupData.data"
                 :rules="rules"
                 ref="ruleForm"
                 label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户头像"
                        v-if="UserInfoPopupData.type==='edit'"
                        class="width100"
                        prop="image">
            <el-upload
              class="avatar-uploader"
              action="http://10.148.83.86:8080/JYTY/user/modify/image"
              :data="{userid:UserInfoPopupData.data.userid}"
              name="multipartFiles"
              :show-file-list="false"
              :on-error="handleAvatarError"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img title="点击上传" v-if="UserInfoPopupData.data.image" :src="UserInfoPopupData.data.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="userImgAlert">
              <p>注：</p>
              <p>图片为 JPG或PNG 格式!</p>
              <p>图片大小不能超过 4MB!</p>
            </div>
          </el-form-item>
          <el-form-item label="账号" prop="account" class="width50">
            <el-input v-model="UserInfoPopupData.data.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" class="width50" v-if="UserInfoPopupData.type==='add'">
            <el-input v-model="UserInfoPopupData.data.password"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="name" class="width50">
            <el-input v-model="UserInfoPopupData.data.name"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="nick" class="width50">
            <el-input v-model="UserInfoPopupData.data.nick"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" class="width50">
            <el-input v-model="UserInfoPopupData.data.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="department" class="width50">
            <el-select v-model="UserInfoPopupData.data.department" clearable placeholder="请选择">
              <el-option
                v-for="(item,key) in departmentList"
                :key="key"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="office" class="width50">
            <el-input v-model="UserInfoPopupData.data.office"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role" class="width50">
            <el-input v-model="UserInfoPopupData.data.role"></el-input>
          </el-form-item>
          <div class="width100 userForm_btn">
            <el-button type="primary" @click="submitForm('submit')">
              {{UserInfoPopupData.type==='add'?'立即添加':'保存'}}</el-button>
            <el-button @click="submitForm('reset')">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="UserInfoPopup_power" v-if="selectActive==='second'">
        <el-form :model="UserInfoPopupData.data.roles"
                 ref="switchForm"
                 label-width="0px" class="demo-ruleForm">
          <el-form-item label="" :prop="item.prop"
                        class="switch"v-for="(item,key) in switchConfig"
                        :key="key">
            <el-switch
              v-model="UserInfoPopupData.data.roles[item.prop]"
              active-color="#11a9f5"
              inactive-color="#dcdfe6"
              :disabled="!userInfo_global.roles.role_modify"
              :active-text="item.label">
            </el-switch>
          </el-form-item>
        <div class="switch_btn">
          <el-button type="primary" @click="submitSwitchForm('submit')">保存</el-button>
          <el-button @click="submitSwitchForm('reset')">重置</el-button>
        </div>
        </el-form>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Action,Getter } from 'vuex-class'
  import userInfo from '../../../interface/UserInfo'
  import { Component,Watch,Prop } from 'vue-property-decorator'
  import departmentInfoHttp from "../../../util/DepartmentInfoHttp"
  import usersInfoHttp from "../../../util/UsersInfoHttp"
  let DepartmentInfoHttp=new departmentInfoHttp()
  let UsersInfoHttp=new usersInfoHttp()

  @Component
  export default class UserInfoPopup extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal
    selectActive:string='first'
    name:string= "UserPopup"
    departmentList:string[]=[]
    rules:any= {
      account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 1, max:25, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
      nick: [
        { required: true, message: '请选择姓名', trigger: 'blur' }
        ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' }
      ],
      department: [
        { required: false, message: '请选择部门', trigger: 'blur' }
        ]
    }
    switchConfig:{ label:string, prop:string }[]=[
      {
        label:'APP视频直播权限',
        prop:'app_live_broadcast'
      },
      {
        label:'发布系统审核权限',
        prop:'rs_audit'
      },
      {
        label:'修改用户权限',
        prop:'role_modify'
      },
      {
        label:'发布系统录入权限',
        prop:'rs_entry'
      },
      {
        label:'发布系统模板管理权限',
        prop:'rs_t_manager'
      },
      {
        label:'灾情上报审核权限',
        prop:'d_r_audit'
      },
      {
        label:'发布系统渠道管理权限',
        prop:'rs_c_manager'
      },
    ]
    @Prop()
    closeUserPopup
    @Prop()
    UserInfoPopupData
    //提交添加用户或者修改用户信息
    submitForm(par:string) {
      switch (par){
        case 'submit':
          this.$refs['ruleForm']['validate']((valid) => {
            if (valid) {
              this.$emit('getUserInfo',this.UserInfoPopupData)
            } else {
              console.log('error submit!!');
              return false;
            }
          });
          break
        case 'reset':
          this.$refs['ruleForm']['resetFields']();
          break
      }
    }
    //提交修改的权限信息
    async submitSwitchForm(par:string){
      switch (par){
        case 'submit':
          if(!this.userInfo_global.roles.role_modify){//判断用户权限
            this.$message.warning('没有权限')
            this.$refs['switchForm']['resetFields']();
            return
          }
          let role:string=''
          let permission:string=''
          for(let key in this.UserInfoPopupData.data.roles){
            role+=`${key},`
            permission+=`${this.UserInfoPopupData.data.roles[key]},`
          }
          role = role.substr(0,role.length-1);
          permission = permission.substr(0,permission.length-1);
           let res = await UsersInfoHttp.editUserPower({userId:this.UserInfoPopupData.data.userid,role:role,permission:permission})
          res?this.$message.success('权限已修改'):this.$message.warning('权限修改失败')
          this.closeUserPopup()
          break
        case 'reset':
          this.$refs['switchForm']['resetFields']();
          break
      }
    }
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg'|| 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 4MB!');
      }
    }
    handleAvatarSuccess(res, file) {
      this.UserInfoPopupData.data.image = URL.createObjectURL(file.raw);
    }
    handleAvatarError(){
      this.$message.error('上传头像失败');
    }

    //获取部门信息//
    async getDepartmentInfo(params:{department?:string}){
      let res = await DepartmentInfoHttp.getDepartmentTypes(params)
      this.departmentList=res.map(v=>{
        return v.department
      })
    }
    mounted(){
      this.getDepartmentInfo({})
      if( window.sessionStorage['userInfo']) {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #UserInfoPopup{
    box-shadow: 0px 0px 15px rgba(53, 53, 53, 0.30);
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -210px;
    margin-top: -240px;
    width:670px;
    overflow: hidden;
    background: white;
    padding-bottom: 20px;
    z-index: 1000;
    .UserInfoPopup_header{
      position: relative;
      line-height: 36px;
      height: 36px;
      color: white;
      background: #11A9F5;
      cursor: move;
      padding-left: 20px;
      font-family: "Microsoft YaHei";
      padding-right: 40px;
      overflow: hidden;
      text-align: left;
      font-size: 14px;
      .UserInfoPopup_close{
        position: absolute;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
        top: 0;
        right: 0;
        height: 36px;
        width: 36px;
        color: white;
        line-height: 36px;
      }
    }
    .UserInfoPopup_main{
      .tabSelect{
        overflow: hidden;
        text-align: center;
        padding: 5px 0px;
        span{
          padding: 5px 15px;
          margin-right: 10px;
          cursor: pointer;
          line-height: 30px;
          background: #f5f5f5;
        }
        span:hover{
          color: #11A9F5;
        }
        span.active{
          background: #11A9F5;
          color: white;
          font-weight: 600;
        }
      }
      .UserInfoPopup_info{
        .demo-ruleForm{
          padding-top: 15px;
          overflow: hidden;
          .userForm_btn{
            text-align: center;
            .el-button{
              padding: 10px 15px;
            }
          }
        }
      }
      .UserInfoPopup_info{
        .width50{
          width: 50%;
          padding:0px 20px;
          height: 40px;
          box-sizing: border-box;
          float: left;
          .el-form-item__content{
            height: 40px;
            overflow: hidden;
            box-sizing: border-box;
            button{
              height: 40px;
              overflow: hidden;
              box-sizing: border-box;
            }
          }
        }
        .width100{
          width: 100%;
          float: left;
          box-sizing: border-box;
          padding-left: 20px;
        }
      }
    }
    .UserInfoPopup_power{
      padding-top: 5px;
      .switch{
        width: 50%;
        height: 40px;/*no*/
        padding-left:20px;
        padding-right:10px;
        float: left;
        text-align: left;
        box-sizing: border-box;
        .el-form-item__content{
          /*box-shadow: 0 1px 5px #ccc;*/
        }
      }
      .switch_btn{
        width: 100%;
        text-align: center;
        overflow: hidden;
        .el-button{
          padding: 10px 15px;
        }
      }
    }
  }
</style>
<style lang="scss">
  #UserInfoPopup .UserInfoPopup_info .el-form-item.is-required .el-form-item__label:before{
    /*display: none;*/
  }
  #UserInfoPopup .UserInfoPopup_info .el-form-item {
    .el-form-item__label{
      text-align: left;
      width: 100px!important;
    }
    .el-form-item__content{
      margin-left: 100px!important;
    }
  }
  #UserInfoPopup .UserInfoPopup_main{
    .UserInfoPopup_info{
      .avatar-uploader{
        height: 85px;
        float: left;
        .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          .avatar-uploader-icon {
            font-size: 20px;
            color: #8c939d;
            width: 80px;
            height: 80px;
            line-height: 80px;
            text-align: center;
          }
        }
        .el-upload:hover {
          border-color: #409EFF;
        }
      }
      .avatar {
        width: 80px;
        height: 80px;
        display: block;
      }
      .userImgAlert{
        float: left;
        line-height: 25px;
        font-size: 12px;
        color: #ff842b;
        padding-left: 20px;
        p{
          padding-left: 20px;
        }
        p:first-of-type{
          padding-left: 0px;
        }
      }
    }
    .el-switch__core{
      width: 40px!important;/*no*/
      height: 20px;/*no*/
      border-radius: 10px;/*no*/
    }
    .el-switch__core .el-switch__button{
      position: absolute;
      top: 1px;/*no*/
      left: 1px;/*no*/
      border-radius: 100%;
      transition: transform .3s;
      width: 16px;/*no*/
      height: 16px;/*no*/
      background-color: #fff;
    }
    .el-switch__label *{
      line-height: 14px;/*no*/
      height: 14px;/*no*/
      font-size: 14px;/*no*/
    }
  }
  #UserInfoPopup .UserInfoPopup_power{
    .switch{
      .el-form-item__content{
        padding-left: 20px;
        /*box-shadow: 0 0px 0px #ccc;*/
      }
      .el-form-item__content:hover{
        /*box-shadow: 0 5px 15px #ccc;*/
        transition: all .1s;
      }
    }
  }
</style>
