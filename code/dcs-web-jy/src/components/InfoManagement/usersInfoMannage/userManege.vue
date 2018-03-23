<template>
  <main id="userManage">
    <nav class="userManage_top">
      <div class="DisasterRelief_search_box">
        <input type="text" class="DisasterRelief_search_input" placeholder="输入姓名" v-model="searchValue">
        <span class="DisasterRelief_search_btn" @click="searchUser">
            <i></i>
          </span>
      </div>
      <div class="userManage_top_right">
        <button class="smallFeature_addBtn" @click="openUserPopup()">新增</button>
        <button class="smallFeature_deleBtn" @click="deleUser('multiple')">删除</button>
      </div>
    </nav>
    <section class="userManage_main">
      <el-table
        class="userManage_table"
        :data="currentData"
        :height="tableHeight"
        min-height="100px"
        header-row-class-name="table_header_title"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="20">
        </el-table-column>
        <el-table-column type="expand" label="权限信息" width="80">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="APP视频直播权限:">
                <span>{{ props.row.roles.app_live_broadcast?'有':'无'}}</span>
              </el-form-item>
              <el-form-item label="发布系统审核权限:">
                <span>{{ props.row.roles.rs_audit?'有':'无'}}</span>
              </el-form-item>
              <el-form-item label="修改用户权限:">
                <span>{{ props.row.roles.role_modify?'有':'无'}}</span>
              </el-form-item>
              <el-form-item label="发布系统录入权限:">
                <span>{{ props.row.roles.rs_entry?'有':'无'}}</span>
              </el-form-item>
              <br>
              <el-form-item label="发布系统模板管理权限:">
                <span>{{ props.row.roles.rs_t_manager?'有':'无'}}</span>
              </el-form-item>
              <el-form-item label="灾情上报审核权限:">
                <span>{{ props.row.roles.d_r_audit?'有':'无'}}</span>
              </el-form-item>
              <el-form-item label="发布系统渠道管理权限:">
                <span>{{ props.row.roles.rs_c_manager?'有':'无'}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="用户头像"
          align="center"
          width="80">
          <template slot-scope="scope">
            <img class="userImage" :src="scope.row.image?scope.row.image:'http://10.148.83.86:8080/File/file/-2001227679-pic_moren.png'"/>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableType"
          :key="key"
          :prop="item.prop"
          :align="item.align"
          :width="item.width"
          :label="item.label">
        </el-table-column>
        <el-table-column
          label="角色"
          align="center"
          width="100">
          <template slot-scope="scope">
            <span>{{scope.row.role?scope.row.role:''}}</span>
            <span>{{scope.row.roles.user_command?'指挥员':''}}</span>
            <span>{{scope.row.roles.user_linkage?'联动人员':''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button class="infoTab_btn tab_btn_1"
                       @click="handleClick(scope.row)"
                       type="text" size="small"></el-button>
            <el-button class="infoTab_btn tab_btn_2" @click="deleUser('single',scope.row)"
                       type="text" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
    <UserInfoPopup v-if="UserInfoPopupFlag"
                   :closeUserPopup="closeUserPopup"
                   @getUserInfo="getUserInfo"
                   :UserInfoPopupData="UserInfoPopupData"></UserInfoPopup>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Action,Getter } from 'vuex-class'
  import { Component } from 'vue-property-decorator'
  import UserInfo from '../../../interface/UserInfo'
  import UserInfoPopup from '../InfoManagePopup/UserInfoPopup'
  import UsersInfoHttp from '../../../util/UsersInfoHttp'
  import {getComputeTableHeight} from '../../../util/InfoManageFunction'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import InfoManageTableType from '../../../config/InfoManageTableType'

  let usersInfoHttp = new UsersInfoHttp()

  @Component({
    components:{
      CommonPagination,
      UserInfoPopup,
    }
  })

  export default class userManage extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal
    activeIndex:string='users'
    searchValue:string=''
    tableHeight:number=300
    popupComponent:any=null
    tableData:any=[]
    selectUserIdList:any=[]
    currentData:any=[]
    tableType:{ prop:string, label:string, align:string, width:string }[]=InfoManageTableType['users']
    UserInfoPopupFlag:boolean=false
    UserInfoPopupData:{ type:string, data:any }={
      type:'add',
      data:{
        name: '',
        nick: '',
        phone: '',
        password: '',
        department: '',
        role: '',
        account: '',
        image: '',
        office: '',
        state: false,
        dr_count: 0,
        roles: {
          app_linkage_command: false,
          rs_audit: false,
          role_modify: false,
          rs_entry: false,
          rs_t_manager: false,
          d_r_audit: false,
          rs_c_manager: false,
          app_live_broadcast: false
        }
      }
    }
    //tab栏选择
    handleSelect(tabType:string){
      this.activeIndex=tabType
    }
    //获取当前页数的数据
    getCurrentData($event:any){
      this.currentData=$event
    }
    //添加用户打开弹窗
    openUserPopup(){
      this.UserInfoPopupFlag=true
      this.UserInfoPopupData={
        type:'add',
        data:{
          name: '',
          nick: '',
          phone: '',
          password: '',
          department: '',
          role: '',
          account: '',
          image: '',
          office: '',
          state: false,
          dr_count: 0,
          roles: {
            app_linkage_command: false,
            rs_audit: false,
            role_modify: false,
            rs_entry: false,
            rs_t_manager: false,
            d_r_audit: false,
            rs_c_manager: false,
            app_live_broadcast: false
          }
        }
      }
    }

    //关闭用户弹出框
    closeUserPopup(){
      this.UserInfoPopupFlag=false
    }

    //获取用户弹窗的信息
    getUserInfo(params:{ type:string, data?:UserInfo|any }){
      switch (params.type){
        case 'add':
          this.addNewUser({
            account:params.data.account,
            password:params.data.password,
            phone:params.data.phone,
            name:params.data.name,
            nick:params.data.nick,
            department:params.data.department,
            image:'',
            office:params.data.office,
          })
          break
        case 'edit':
          this.editUserInfo({
            userid:params.data.userid,
            account:params.data.account,
            phone:params.data.phone,
            name:params.data.name,
            nick:params.data.nick,
            department:params.data.department,
            image:'',
            office:params.data.office,
          })
          break
      }
    }
    //添加新用户
    async addNewUser(params:any){
      let res = await usersInfoHttp.addUsersInfo(params)
      if(res==='注册成功！'){
        this.$message.success(res);
        this.UserInfoPopupFlag=false
      }else {
        this.$message.error(res);
      }
      this.tableData =await usersInfoHttp.selectUsersInfo({})

    }


    //修改用户信息
   async editUserInfo(params:UserInfo|any){
      let res = await usersInfoHttp.editUsersInfo(params)
      if(res==='修改用户信息成功'){
        this.$message.success(res);
        this.UserInfoPopupFlag=false
      }else {
        this.$message.error(res);
      }
      this.tableData =await usersInfoHttp.selectUsersInfo({})
    }

    handleSelectionChange(val:UserInfo[]){
      this.selectUserIdList=[]
      val.forEach(v=>{
        this.selectUserIdList.push(v.userid)
      })
    }
    //编辑用户信息
    handleClick(params:UserInfo){
      if(this.userInfo_global.userid==params.userid||this.userInfo_global.roles.role_modify){
        this.UserInfoPopupFlag=true
        this.UserInfoPopupData={
          type:'edit',
          data:params
        }
      }else {
        this.$message.warning('没有权限')
      }
    }
    //删除用户
    async deleUser(type:'multiple'|'single',userInfo:any){
      if(type==='multiple'){
        if(this.selectUserIdList.length==0){return}
        await this.$confirm('是否永久删除这些用户信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res:boolean =await usersInfoHttp.deleUsers({'userIds':this.selectUserIdList})
          if(res){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(() => {
          return
        });
        this.selectUserIdList=[]
      }
      if(type==='single'){
        await this.$confirm('是否永久删除该用户信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let obj:any={'userIds':[userInfo.userid]}
          let res:any =await usersInfoHttp.deleUsers(obj)
          if(res){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(() => {
          return false
        });
      }
      this.tableData =await usersInfoHttp.selectUsersInfo({})
    }
    //搜索用户
    async searchUser(){
      this.tableData =await usersInfoHttp.selectUsersInfo({nick:this.searchValue.replace(/\s/g,'')})
    }
    async mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(460)
      })
      this.tableData =await usersInfoHttp.selectUsersInfo({})
      if( window.sessionStorage['userInfo']) {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
      let res = await usersInfoHttp.searchUserJurisdiction()
      console.log(res)
    }
  }

</script>

<style lang="scss" scoped>
  #userManage{
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    .userManage_top{
      margin-top:15px;
      height: 40px;
      padding:0px 40px;
      overflow: hidden;
      .DisasterRelief_search_box{
        width: 256px;
        height:40px;
        float: left;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border: 1px solid #D2D4DB;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        .DisasterRelief_search_btn{
          position: absolute;
          width: 48px;
          height: 38px;
          border-left:1px solid #D2D4DB;
          top: 0;
          right: 0px;
          cursor: pointer;
          background-color: #F2F2F2;
          transition: all .6s;
          i{
            float: left;
            margin-top: 10.5px;
            margin-left:15.5px;
            width: 17px;
            height: 17px;
            background-image: url("../../../assets/imgs/infoManage/home_search.png");
            background-size:34px 17px;
            background-repeat: no-repeat;
            background-position: 0px 0px;
          }
        }
        .DisasterRelief_search_btn:hover{
          background-color: #e0e0e0;
          transition: all .6s;
          i{
            background-position: -17px 0px;
          }
        }
        .DisasterRelief_search_btn:active{
          background-color:#F2F2F2;
          i{
            background-position:0px 0px;
          }
        }
        .DisasterRelief_search_input{
          width: 100%;
          height: 100%;
          border: none;
          padding-right:55px;
          text-indent: 15px;
          margin: 0;
          color: #1c1c1c;
          font-size: 14px;
          line-height: 38px;
          background-color: transparent;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
      .userManage_top_right{
        height:40px;
        float: right;
        button{
          margin-top:5px;
          width: 100px;
          height: 30px;
          border: none;
          outline: none;
          float: left;
          cursor: pointer;
          line-height: 29px;
          font-size: 14px;
        }
        .smallFeature_addBtn{
          background-color: #11a9f5;
          color: #fff;
          margin-right: 20px;
        }
        .smallFeature_addBtn:hover{
          background-color: rgb(16, 152, 221);
        }
        .smallFeature_addBtn:active{
          background-color: #11a9f5;
        }
        .smallFeature_deleBtn{
          background-color: #eb414f;
          color: #fff;
        }
        .smallFeature_deleBtn:hover{
          background-color: #d93c48;
          color: #fff;
        }
        .smallFeature_deleBtn:active{
          background-color:  #eb414f;
          color: #fff;
        }
      }
    }
    .userManage_main{
      padding: 0 40px;
      overflow: hidden;
      margin-top: 15px;
      .userManage_table{
        border: 1px solid #ebeef5;/*no*/
      }
      .userImage{
        width: 47px;/*no*/
        height: 47px;/*no*/
      }
    }
  }
</style>
<style lang="scss">
  .table_header_title div{
    text-align: center !important;
  }
  #userManage .el-table__expanded-cell{
    padding-top: 10px!important;
    padding-bottom: 0px!important;
    .demo-table-expand{
      padding-left: 60px;
    }
    .el-form-item{
      margin-bottom: 0px!important;
      margin-right: 0px!important;
      padding-right: 30px!important;
      width: 24%;
      box-sizing: border-box;
    }
  }
</style>
