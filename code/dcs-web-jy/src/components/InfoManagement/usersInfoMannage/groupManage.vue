<template>
  <main id="groupManage">
    <aside class="groupManage_left">
      <header class="groupList_top">
        <el-popover
          ref="popover5"
          placement="bottom"
          v-model="newGroupPopu"
          width="160">
          <el-input v-model="newGroupName" placeholder="请输入群组名"></el-input>
          <el-button class="newGroupBtn newGroupBtn_sel"
                     plain
                     size="mini"
                     @click="newGroupPopu=false; newGroupName=''">取消</el-button>
          <el-button class="newGroupBtn" type="primary" size="mini" @click="addNewGroup">确定</el-button>
        </el-popover>
        <div class="groupList_top_L">群组列表</div>
        <el-button class="groupList_top_R" v-popover:popover5>
          <i class="el-icon-plus"></i>
          新建群组
        </el-button>
      </header>
      <section class="groupList_bottom">
        <ul>
          <li v-for="(item,key) in groupList" :key="key">
            <div class="groupListInfo"
                 v-show="!item.disabled"
                 :title="groupList[key]['groupname']"
                 :class="{'activeStyle':item.activeStyle}"
                 @click="selectGroup(item)">
              {{groupList[key]['groupname']}}
            </div>
            <input class="groupListInfo_input" type="text"
                   v-show="item.disabled"
                   v-model="groupList[key]['groupname']"
                   :class="{'disabledP':item.disabled,'activeStyle':item.activeStyle}"
                   ref="groupNameInput">
            <i class="ico_ok" v-if="item.disabled"
               @click="setGroupNameOk(item)"
               :class="{'el-icon-circle-check-outline':!item.icoFlag,'el-icon-circle-check':item.icoFlag}"></i>
            <i class="el-icon-circle-close-outline"
               @click="item.disabled=!item.disabled"
               v-if="item.disabled" ></i>
            <span class="groupListNum">{{item.groupnum}}</span>
            <div class="groupNameBtn" @click="item.flagBtn=!item.flagBtn">
              <i class="el-icon-caret-bottom"></i>
            </div>
            <ul class="groupNameBtn_list" v-if="item.flagBtn">
              <li @click="changeGroupName(item,key)">改名</li>
              <li @click="deleGroup(item)">删除</li>
            </ul>
          </li>
        </ul>
      </section>
    </aside>
    <section class="groupManage_right">
      <header class="groupMembers_title">
        <span>{{groupName}}</span>
      </header>
      <main class="groupMembersList">
        <div class="groupMemberBtns">
          <el-popover
            ref="popover6"
            popper-class="popoverTable"
            placement="bottom"
            v-model="groupMemberListFlag">
            <div class="groupMemberAddList">
              <div class="AddList_main">
                <div class="AddList_search">
                  <i class="el-icon-search"></i>
                  <input autofocus type="text"
                         @keyup.enter="keyUpMailSearch"
                         @blur="keyUpMailSearch"
                         v-model="mailSearchValue"
                         class="AddList_search_input"
                         placeholder="搜索">
                </div>
                <div class="AddListTable">
                  <div>
                    <el-table
                      :data="mailSearchData"
                      v-if="groupMemberListFlag"
                      stripe
                      :show-header="false"
                      @selection-change="handleSelectionChangeMail"
                      header-row-class-name="groupTableHeader">
                      <el-table-column
                        type="selection"
                        width="20">
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        align="left"
                        width="58"
                        label="">
                      </el-table-column>
                      <el-table-column
                        prop="cellphone"
                        align="left"
                        label="">
                      </el-table-column>
                      <el-table-column
                        prop="department"
                        align="left"
                        label="">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <footer class="groupMemberAddList_btns">
                  <span class="btns_1" @click="addGroupNmber">确定</span>
                  <span class="btns_2" @click="groupMemberListFlag=false">取消</span>
                </footer>
              </div>
            </div>
          </el-popover>
          <el-button v-popover:popover6>新增成员</el-button>
          <el-button @click="deleteGroupNum">删除</el-button>
        </div>
        <el-table
          :data="tableData"
          stripe
          :height="tableHeight"
          header-row-class-name="groupTableHeader"
          @selection-change="handleSelectionChangeGroup"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="20">
          </el-table-column>
          <el-table-column
            prop="name"
            label="全选"
            width="180">
          </el-table-column>
          <el-table-column
            prop="cellphone"
            label=""
            width="180">
          </el-table-column>
          <el-table-column
            prop="department"
            label="">
          </el-table-column>
        </el-table>
      </main>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import {getComputeTableHeight} from '../../../util/InfoManageFunction'
  import mailListHttp from '../../../util/MailListHttp'
  import groupHttp from '../../../util/GroupHttp'
  let MailListHttp = new mailListHttp ()
  let GroupHttp = new groupHttp ()
  interface mailListInfo{
    id: number,
    name: string,
    department: string,
    title?: string,
    phone?: string,
    cellphone?: string
  }
  interface groupListIn {
    groupname:string,
    groupnum:number,
    groupid:number,
    updatetime:number,
    disabled:boolean,
    flagBtn:boolean,
    icoFlag:boolean,
    activeStyle:boolean,
  }
  @Component({
    components:{

    }
  })
  export default class GroupManage extends Vue {
    newGroupPopu:boolean= false
    newGroupName:string=''
    activeIndex:string='users'
    component:any = ''
    groupList: groupListIn[]=[]
    tableData:any[]= []
    groupMemberListFlag:boolean=false
    tableHeight:number=300
    mailList:mailListInfo[]=[]
    mailSearchData:mailListInfo[]=[]
    selectedMail:mailListInfo[]=[]
    deleSelectGroupNum:mailListInfo[]=[]
    mailSearchValue:string=''
    groupName:string=''
    currentGroupId:number=0

    //tab栏选择
    handleSelect(tabType:string):void{
      this.activeIndex=tabType
    }

    //选择群组
    async selectGroup(item:groupListIn):Promise<void>{
      if(item.activeStyle)return
     this.groupList.forEach(v=>{
       v.activeStyle=false
     })
      item.activeStyle=true
      this.groupName=item.groupname
      this.currentGroupId=item.groupid
      this.getGroupNumber(item.groupid)
    }

    //添加新群组
    async addNewGroup():Promise<void>{
      if(this.newGroupName===''){
        this.$message({
          type: 'warning',
          message: '群组名不能为空'
        });
      }else if(/\s/g.test(this.newGroupName)){
        this.$message({
          type: 'warning',
          message: '群组名不能有空格'
        });
      }else {
        let res:boolean = await GroupHttp.addGroup(this.newGroupName)
        if(res){
          this.$message({
            type: 'success',
            message: '添加群组成功'
          });
          this.getGroupInfo()
        }else {
          this.$message({
            type: 'error',
            message: '添加群组失败'
          });
        }
        this.newGroupName=''
        this.newGroupPopu=false
      }
    }

    //根据群id获取群成员
    async getGroupNumber(id:number):Promise<void>{
      this.tableData=await GroupHttp.getGroupInfoById(id)
    }

    //通讯录新增成员搜索
    keyUpMailSearch():void{
      let searchM:mailListInfo[]=[],
        rage:any = new RegExp(this.mailSearchValue)
      this.mailList.forEach((v)=>{
        if(rage.test(v.name)){
          searchM.push(v)
        }
      })
      this.mailSearchData=searchM
    }

    //通讯录多选框
    handleSelectionChangeMail(par:mailListInfo[]):void{
      this.selectedMail=par
    }

    //群组表格多选框
    handleSelectionChangeGroup(par:mailListInfo[]):void{
      this.deleSelectGroupNum=par
    }

    //改变群组名字
    changeGroupName(item:groupListIn,key:number):void{
      item.flagBtn=!item.flagBtn
      item.disabled=!item.disabled
      item.icoFlag=false
      let timer:any=setTimeout(()=>{
        this.$refs['groupNameInput'][key].focus()
        timer=null
      },100)
    }

    //确认是否修改群组名
    async setGroupNameOk(item:groupListIn):Promise<void>{
      item.icoFlag=!item.icoFlag
      await this.$confirm('是否确认修改群组名?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        item.disabled=!item.disabled
        let res:boolean=await GroupHttp.editGroupInfo({
          id: item.groupid,
          groupname: item.groupname,
          updatetime: item.updatetime,
          number:item.groupnum,
        })
        if(res){
          this.$message({
            type: 'success',
            message: '群组名修改成功!'
          });
        }
      }).catch(() => {
        item.icoFlag=!item.icoFlag
      });
    }

    //删除群组
    async deleGroup(item:groupListIn):Promise<void>{
      let res =GroupHttp.deleGroup(item.groupid)
      item.flagBtn=!item.flagBtn
      if(res){
        this.$message({
          type: 'success',
          message: '删除群组成功'
        });
        let arr:any=[]
        this.groupList.forEach((v,i)=>{
          if(v.groupid!==item.groupid){
            arr.push(v)
          }
        })
        this.groupList=arr
        this.getGroupInfo()
      }
    }

    //删除群组成员
    async deleteGroupNum():Promise<void>{
      if(this.deleSelectGroupNum.length===0)return
      let arr:{ contactsId: number, groupGatherId: number}[]=[]
      this.deleSelectGroupNum.forEach(v=>{
        arr.push({
          contactsId: v.id,
          groupGatherId: this.currentGroupId
        })
      })
      let res = await GroupHttp.deletGroupUser(arr)
      if(res){
        this.$message.success('群组成员删除成功')
      }else {
        this.$message.error('群组成员删除失败')
      }
      this.deleSelectGroupNum=[]
      this.getGroupNumber(this.currentGroupId)
      this.getGroupInfo()
    }

    //获取群组信息
    async getGroupInfo():Promise<void>{
      let arr:Array<any>=[]
      let groupListData:{ id: string, groupname: string, updatetime: string,number:string }[]= await GroupHttp.getAllGroup()
      groupListData.forEach((v,i)=>{
        arr.push({
          groupname:v.groupname,
          groupnum:v.number,
          groupid:v.id,
          updatetime:v.updatetime,
          disabled:false,
          flagBtn:false,
          icoFlag:false,
          activeStyle:i==0?true:false,
        })
      })
      this.groupList=arr
    }

    //添加群组成员
   async addGroupNmber():Promise<void>{
      let arrObj:any[] = []
     let ids:any=[]
      if(this.selectedMail.length>0){
        this.selectedMail.forEach(v=>{
          let flag=false
          this.tableData.forEach(k=>{
            if(v.id==k.id){
              flag=true
              return
            }
          })
          ids.push({
            flag,
            data:v
          })
        })
        ids.forEach(v=>{
          if(!v.flag){
            arrObj.push({
              contactsId: v.data.id,
              groupGatherId: this.currentGroupId
            })
          }
        })
        if(arrObj.length>0){
          let res=await GroupHttp.addGroupUser(arrObj)
          if(res==='群组成员添加成功'){
            this.$message.success(res)
          }else {
            this.$message.error(res)
          }
          this.getGroupNumber(this.currentGroupId)
          this.getGroupInfo()
        }else {
          this.$message.success('群组成员添加成功')
        }
        this.groupMemberListFlag=false
        this.selectedMail=[]
        ids=null
      }
    }

    async mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(380)
      })
      await this.getGroupInfo()
      this.mailList=this.mailSearchData= await MailListHttp.getAllMailInfo()
      this.tableData=await GroupHttp.getGroupInfoById(this.groupList[0].groupid)
      this.groupName=this.groupList[0].groupname
      this.currentGroupId=this.groupList[0].groupid
    }
  }

</script>

<style lang="scss" scoped>
  .fade-enter-active{
    transition: opacity 0s .1s;
  }
  .fade-leave-active {
    /*transition: opacity .3s .2s;*/
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
    /*transition: opacity .1s;*/
  }
  .groupMembersListAn-enter-active, .fade-leave-active{
    transition: opacity .3s;
  }
  .groupMembersListAn-enter-active{
    transition: all .5s;
    height: 330px;
    opacity: 1;
  }
  .groupMembersListAn-leave-active{
    transition: all .5s;
    height: 0px;
    opacity: 0;
  }
  .groupMembersListAn-leave{
    height: 330px;
    opacity: 1;
  }
  .groupMembersListAn-enter{
    height: 0px;
    opacity: 0;
  }

  #groupManage{
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    height: 100%;
    position: relative;
    overflow: hidden;
    padding-right: 70px;
    .groupManage_left{
      float: left;
      width: 300px;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid #e6e6e6;/*no*/
      overflow-y: auto;
      .groupList_top{
        height: 60px;
        padding-left: 50px;
        >div{
          float: left;
        }
        .groupList_top_L{
          line-height: 60px;
          font-size: 16px;
          color: #677888;
        }
        .groupList_top_R{
          outline: none;
          padding: 0;
          background: white;
          line-height: 30px;
          width: 100px;
          font-size: 14px;
          color: #677888;
          border: 1px solid #e6e6e6;
          margin-left: 40px;
          margin-top: 15px;
          text-align: center;
          cursor: pointer;
          position: relative;
          .el-icon-plus{
            color: #11a9f5;
          }
        }
        .groupList_top_R:active{
          box-shadow: 0px 0px 4px #ccc;
        }
      }
      .groupList_bottom{
        padding-left: 50px;
        >ul{
          >li{
            min-height: 50px;
            width: 96%;
            font-size: 14px;
            position: relative;
            background: white;
            .groupListInfo{
              width: 120px;
              height: 40px;
              line-height: 40px;
              float: left;
              box-sizing: border-box;
              outline: none;
              background: transparent;
              padding: 0;
              margin-top: 5px;
              padding-left: 10px;
              border:1px solid transparent ;
              transition: all .3s;
              padding-right: 5px;
              color: #5C6064;
              cursor: pointer;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .groupListInfo_input{
              position: absolute;
              left: 0;
              width: 220px;
              height: 40px;
              line-height: 40px;
              float: left;
              box-sizing: border-box;
              outline: none;
              background: transparent;
              padding: 0;
              margin-top: 5px;
              padding-left: 10px;
              border:1px solid transparent ;
              padding-right: 5px;
              overflow: hidden;
              font-size: 12px;
              color: #5C6064;
            }
            .activeStyle{
              color: #11a9f5;
            }
            .ico_ok{
              position: absolute;
              z-index: 100;
              top: 50%;
              margin-top: -8px;/*no*/
              right: 55px;
              font-size: 16px;/*no*/
              cursor: pointer;
              color: #d0d0d0;
            }
            .ico_ok:hover{
              color: #11a9f5;
            }
            .el-icon-circle-close-outline{
              position: absolute;
              z-index: 100;
              top: 50%;
              margin-top: -8px;/*no*/
              right: 30px;
              font-size: 16px;/*no*/
              cursor: pointer;
              color: #d0d0d0;
            }
            .el-icon-circle-check{
              color: #11a9f5;
            }
            input.disabledP{
              width: 220px;
              position: absolute;
              border:1px solid #e6e6e6 ;
              z-index: 99;
              background: white;
              padding-right: 60px;
              color: #5C6064;
            }
            .groupListNum{
              position: absolute;
              top: 14px;
              right: 75px;
              height: 24px;
              line-height: 24px;
              max-width: 40px;
              overflow: hidden;
            }
            .groupNameBtn{
              position: absolute;
              width: 20px;
              height: 20px;
              top: 14px;
              right: 44px;
              border: 1px solid #e6e6e6;
              line-height: 20px;
              text-align: center;
            }
            .groupNameBtn:hover{
              background: #f3f3f3;
            }
            .groupNameBtn:active{
              background: #e6e6e6;
            }
            .groupNameBtn_list{
              position: absolute;
              width: 70px;
              height: 50px;
              top:40px;
              right: 44px;
              z-index: 999;
              border: 1px solid #e6e6e6;
              background: white;
              li{
                line-height: 25px;
                height: 25px;
                text-align: center;
                font-size: 12px;
                cursor: pointer;
              }
              li:hover{
                background: #eceeef;
              }
              li:active{
                background: #e0e2e3;
              }
            }
          }
          li:hover{
            background: #f6f6f6;
            .groupListInfo{
              color: #11a9f5;
            }
            .disabledP{
              color: #5C6064;
            }
          }
        }
      }
    }
    .groupManage_right{
      float: left;
      width:calc(100% - 303px);
      padding-left: 30px;
      box-sizing: border-box;
      .groupMembers_title{
        height: 60px;
        line-height: 60px;
        vertical-align: middle;
        span{
          font-size: 16px;
        }
      }
      .groupMembersList{
        border: 1px solid #e6e6e6;
        position: relative;
        .groupMemberBtns{
          position: absolute;
          top: 8px;
          left: 130px;
          width: 220px;
          height: 32px;
          z-index: 99;
          button{
            border: 1px solid #e6e6e6;
            outline: none;
            width: 100px;
            height: 30px;
            background: white;
            text-align: center;
            transition: all .3s;
          }
          .groupMemberBtns_add{
            float: left;
            background: #ECEEEF;
          }
          .groupMemberBtns_del{
            float: right;
          }
          .groupMemberBtns_add:hover,.groupMemberBtns_del:hover{
            background: #eff1f2;
            transition: all .3s;
          }
          .groupMemberBtns_add:active,.groupMemberBtns_del:active{
            transition: all .3s;
            background: white;
          }
        }

      }
    }
  }
  .groupMemberAddList{
    width: 350px;
    height: 348px;
    z-index: 100;
    box-sizing: border-box;
    .AddList_main{
      background: white;
      vertical-align: middle;
      .AddList_search{
        height: 40px;
        border-bottom: 1px solid #dcdcdc;
        position: relative;
        line-height: 46px;
        .AddList_search_input{
          left: 0;
          top: 0;
          background: transparent;
          position: absolute;
          padding: 0;
          margin: 0;
          line-height: 40px;
          outline: 0;
          border: none;
          height: 100%;
          width: 100%;
          text-indent: 40px;
        }
        .el-icon-search{
          margin-left: 10px;
          font-size: 18px;
          font-weight: bold;
          color: #ccc;
        }
      }
      .AddListTable{
        height: 250px;
        border-bottom: 1px solid #dcdcdc;
        >div{
          height: 100%;
          overflow: auto;
        }
      }
      .AddListTable >div::-webkit-scrollbar {/*隐藏滚轮*/
        display: none;
      }
      .groupMemberAddList_btns{
        height: 60px;
        span{
          width: 100px;
          box-sizing: border-box;
          height: 30px;
          text-align: center;
          float: left;
          margin-left: 50px;
          line-height: 30px;
          margin-top:15px;
          cursor: pointer;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .btns_1{
          background: #11A9F5;
          color: white;
        }
        .btns_1:hover{
          background: #12b0ff;
          color: white;
          transition: all .3s ;
        }
        .btns_1:active{
          background: #11A9F5;
          color: white;
          transition: all .3s ;
        }
        .btns_2{
          border: 1px solid #dcdcdc;
        }
        .btns_2:hover{
          border: 1px solid #12b0ff;
          color: #12b0ff;
          transition: all .3s ;
        }
        .btns_2:active{
          border: 1px solid #dcdcdc;
          color: rgba(80, 80, 80, 0.93);
          transition: all .3s ;
        }
      }
    }
    .groupMember_angel{
      position: absolute;
      top: 11px;
      left: 50%;
      margin-left: -10px;
      height: 20px;
      box-sizing: border-box;
      border-top: 1px solid #dcdcdc;/*no*/
      border-left: 1px solid #dcdcdc;/*no*/
      width: 20px;
      font-size: 20px;
      background: white;
      transform: rotate(45deg);
      z-index: 0;
    }
  }
</style>
<style>
  .popoverTable{
    padding: 0px;
    width: 350px;
    height: 350px;
    box-shadow: 0px 0px 6px 2px #d7d7d7;
  }
  .groupMemberBtns .el-button{
   padding: 0px;
  }
  .groupTableHeader th{
    background: #f2f5f7!important;
  }
  .groupMemberAddList .el-table .cell{
    line-height: 20px!important;
  }
  .groupMemberAddList .el-table-column--selection .cell{
    padding: 0px;
    padding-left: 15px;
  }
  .groupMemberAddList .el-table .cell, .groupMemberAddList .el-table th div{
    padding-right: 0px!important;
  }
  .newGroupBtn{
    background: #11a9f5;
    margin-top: 10px;
    padding: 5px 10px;
    float: right;
  }
  .newGroupBtn_sel{
    background: white;
    margin-left: 20px;
  }
</style>
