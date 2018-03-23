<template>
  <main id="GroupManagement">
    <div class="GroupManagement_left">
      <p class="title">短信接收人员</p>
      <section class="main">
        <header class="main_header">
          <div class="search_box">
            <input type="text" class="search_box_input"v-model="searchValue" placeholder="搜索">
            <span class="search_box_btn" @click="searchSmsMember"><i></i></span>
          </div>
        </header>
        <div class="content" v-if="checkTypes.length>0">
          <div v-for="(item,key) in checkTypes" :key="key">
            <div class="content_name">
              <span class="content_name_t"
                    :class="{'':item.lineStatus}"
                    @click="lineChange(item,key,'check')">{{item.lineStatus?'－':'＋'}}</span>
              <el-checkbox
                v-model="item.checkAll"
                @change="handleCheckAllChange($event,key,'check')">所有成员 </el-checkbox>
              <!--<i class="el-icon-delete" title="删除"></i>-->
              <i class="el-icon-circle-plus-outline" title="添加成员" @click="addSmsMember"></i>
            </div>
            <el-checkbox-group class="content_list"
                               ref="check"
                               v-model="item.activeType"
                               :class="{'active':!item.lineStatus}"
                               @change="handleCheckedCitiesChange($event,key,'check')">
              <div v-for="(val,key) in item.selectType" :key="key">
                <span class="content_list_L">一</span>
                <el-checkbox  :label="val">{{val.name}}</el-checkbox>
                <i class="el-icon-delete" title="删除" @click="deleteSmsMenber(val)"></i>
              </div>
            </el-checkbox-group>
          </div>
          <span class="last_c" v-if="checkTypes[checkTypes.length-1].lineStatus"></span>
        </div>
      </section>
    </div>
    <div class="GroupManagement_middle">
      <el-button type="primary" @click="addMember">添加<i class="el-icon-d-arrow-right"></i></el-button>
      <br>
      <el-button plain @click="removeMember"><i class="el-icon-d-arrow-left"></i>移除</el-button>
    </div>
    <div class="GroupManagement_right">
      <p class="title">短信接收群组</p>
      <section class="main">
        <header class="main_header">
          <el-popover
            ref="popover1"
            placement="bottom"
            v-model="newGroupPopu"
            width="160">
            <el-input v-model="newGroupName" placeholder="请输入群组名" style="margin-bottom: 10px"></el-input>
            <el-button class="" type="primary" size="mini" @click="addNewGroup">确定</el-button>
            <el-button class="" plain size="mini" @click="newGroupPopu=false; newGroupName=''">取消</el-button>
          </el-popover>
          <el-button plain v-popover:popover1>
            <i class="el-icon-plus"></i>添加群组
          </el-button>
        </header>
        <div class="content" v-if="groupTypes.length>0">
          <div v-for="(item,key) in groupTypes" :key="key">
            <div class="content_name">
              <span class="content_name_t"
                    @click="lineChange(item,key,'group')">{{item.lineStatus?'－':'＋'}}</span>
              <el-checkbox
                v-model="item.checkAll"
                @change="handleCheckAllChange($event,key,'group')">{{item.groupName}} </el-checkbox>
              <i class="el-icon-delete" title="删除" @click="deleteGroup(item,key)"></i>
            </div>
            <el-checkbox-group class="content_list"
                               ref="group"
                               v-model="item.activeType"
                               :class="{'active':!item.lineStatus}"
                               @change="handleCheckedCitiesChange($event,key,'group')">
              <div v-for="(val,key) in item.selectType" :key="key">
                <span class="content_list_L">一</span>
                <el-checkbox  :label="val">{{val.name}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <span class="last_c" v-if="groupTypes[groupTypes.length-1].lineStatus"></span>
        </div>
      </section>
    </div>
    <infoFormPopup v-if="infoFormPopupFlag"
                   @getInfoFormData="getInfoFormData"
                   :infoPopupClose="infoPopupClose"
                   :infoFormData="infoFormData"/>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import groupHttp from '../../../util/GroupHttp'
  import { Component,Prop } from 'vue-property-decorator'
  import infoFormPopup from '../InfoManagePopup/InfoFormPopup.vue'
  let GroupHttp = new groupHttp()
  @Component({
    components:{
      infoFormPopup
    }
  })
  export default class GroupManagement extends Vue {
    infoFormPopupFlag:boolean= false
    infoFormData:any=null
    newGroupPopu:boolean=false
    newGroupName:string=''
    searchValue:string=''
    checkTypes:{id?:number, lineStatus:boolean, checkAll:boolean, groupName:string, activeType:any[], number:number, selectType:any[] }[]=[]
    groupTypes:{id?:number,requestFlag:boolean, lineStatus:boolean, checkAll:boolean, groupName:string, activeType:any[], number:number, selectType:any[] }[]=[]
    groupIndex:number=-1

    //根据姓名搜索短信接收人员,展开并勾选
    searchSmsMember(){
      if(this.searchValue){
        console.log(this.searchValue)
        this.checkTypes.forEach((v,i)=>{
          let flag = false
          v.selectType.forEach(k=>{
            if(k.name.indexOf(this.searchValue)!=-1){
              v.activeType.push(k)
              flag=true
            }
          })
          if(flag&&!v.lineStatus){
            this.lineChange(v,i,'check')
          }
        })
      }
    }

    //全选事件
    handleCheckAllChange(val:any,key:number,type:string) {
      switch (type){
        case 'check':
          this.checkTypes[key].activeType = val ? this.checkTypes[key].selectType : [];
          break
        case 'group':
          this.groupTypes[key].activeType = val ? this.groupTypes[key].selectType : [];
          break
      }
    }

    //部门勾选事件
    handleCheckedCitiesChange(value:any,key:number,type:string) {
      let checkedCount:any=0
      switch (type){
        case 'check':
          checkedCount = value.length;
          this.checkTypes[key].checkAll = checkedCount === this.checkTypes[key].selectType.length;
          break
        case 'group':
          checkedCount = value.length;
          this.groupTypes[key].checkAll = checkedCount === this.groupTypes[key].selectType.length;
          break
      }
    }

    //添加新群组
    async addNewGroup():Promise<void>{
       if(this.newGroupName==''){
         this.$message.warning('请输入群组名')
         return
       }
       let res  = await GroupHttp.addGroup(this.newGroupName)
      if(res){
         this.initRightSmsGroup()
      }else {
         this.$message.warning('添加群组失败')
      }
      this.newGroupPopu=false
      this.newGroupName=''
    }

    //点击给左边添加短信接收人打开弹窗
    addSmsMember(){
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'add',
        title:'添加短信接收人',
        className:'width600',
        ruleForm: {
          phone: "",
          name: "",
          units: "",
          position: ""
        },
        config:{
          name:{
            type:'input',
            label:'姓名'
          },
          phone:{
            type:'input',
            label:'手机号码'
          },
          units:{
            type:'input',
            label:'所属部门'
          },
          position:{
            type:'input',
            label:'职位'
          },
        },
        rules: {
          name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
          units: [{ required: false, message: '', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
          position: [{ required: false, message: '', trigger: 'blur' }],
        }
      }
    }

    //关闭infoPopup弹窗
    infoPopupClose():void{
      this.infoFormPopupFlag = false;
    }

    //获取infoPopup弹窗信息
    async getInfoFormData(params:any){
      let res = await GroupHttp.addSmsMember(params.ruleForm)
      if(!res){
        this.$message.warning('信息添加失败')
      }else {
        await this.initLefetSmsMember()
        this.$nextTick(()=>{
          this.lineChange(this.checkTypes[0],0,'check')
        })
      }
      this.infoPopupClose()
    }

    //点击删除短信接收人
    async deleteSmsMenber(params:any){
      let res  = await GroupHttp.deleteSmsMember(params.id)
      if(res){
        await this.initLefetSmsMember()
        this.$nextTick(()=>{
          this.lineChange(this.checkTypes[0],0,'check')
        })
      }else {
        this.$message.warning('删除失败')
      }
    }

    //移除群组
    deleteGroup(item:any,index:number){
      this.$confirm('此操作将永久删除该模板群组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await GroupHttp.deleGroup(item.id)
        if(res){
          this.initRightSmsGroup()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          });
        }
      }).catch(() => {return});
    }

    //点击展开
    async lineChange(item:any,key:number,type:string){
      if(!item.requestFlag&&type=='group'){
        item.requestFlag=true
        let res_=await GroupHttp.getGroupInfoById(item.id)
        console.log(res_)
        item.selectType=res_
      }
      this.$nextTick(()=>{
        switch (type){
          case 'check':
            break
          case 'group'://控制群组部门的选择永远只能展开一项
            this.groupTypes.forEach((v,i)=>{
              if(v.lineStatus&&key!=i){
                this.$refs.group[i].$el.style.height='0px'
                this.$refs.group[i].$el.style.marginBottom='10px'
                v.lineStatus=false
              }
            })
            break
        }
        let height:any=0
        if(!item.lineStatus){
          switch (type){
            case 'check':
              height = item.selectType.length*this.$refs.check[key].$el.firstChild.offsetHeight
              this.$refs.check[key].$el.style.height=height+'px'
              this.$refs.check[key].$el.style.marginBottom='0px'
              break
            case 'group':
              if(item.selectType.length==0){
                this.$refs.group[key].$el.style.height='20px'
                this.$refs.group[key].$el.style.marginBottom='0px'
              }else {
                height = item.selectType.length*this.$refs.group[key].$el.firstChild.offsetHeight
                this.$refs.group[key].$el.style.height=height+'px'
                this.$refs.group[key].$el.style.marginBottom='0px'
              }
              break
          }
        }
        else {
          switch (type){
            case 'check':
              this.$refs.check[key].$el.style.height='0px'
              this.$refs.check[key].$el.style.marginBottom='10px'
              break
            case 'group':
              this.$refs.group[key].$el.style.height='0px'
              this.$refs.group[key].$el.style.marginBottom='10px'
              break
          }

        }
        item.lineStatus=!item.lineStatus
        if(type=='group'){
          item.lineStatus? this.groupIndex=key:this.groupIndex=-1//记录群组选中的下标
        }
      })

    }
    //点击往群组添加成员
    async addMember(){
      let checkArr:any=[]//存储被选中的值
      this.checkTypes.forEach(v=>{
        v.activeType.forEach(k=>{
            checkArr.push(k)
        })
      })
      checkArr=unique5(checkArr)
      if(checkArr.length==0)return
      if(this.groupIndex==-1){
        this.$message.warning('请点击展开要添加的群组')
      }else {
        let arr:any =[]
        checkArr.forEach(v=>{
          // this.groupTypes[this.groupIndex].selectType.push(v)
          if(this.groupTypes[this.groupIndex].selectType.length>0){
            let flag:boolean=true
            this.groupTypes[this.groupIndex].selectType.forEach(k=>{
              if(v.id==k.id){
                flag=false
                return
              }
            })
            if(flag){
              arr.push({
                contactsId: v.id,
                groupGatherId: this.groupTypes[this.groupIndex].id
              })
            }
          }else {
            arr.push({
              contactsId: v.id,
              groupGatherId: this.groupTypes[this.groupIndex].id
            })
          }
        })
        if(arr.length>0){
          let res = await GroupHttp.addGroupUser(arr)
          if(res=='群组成员添加成功'){
            let res_=await GroupHttp.getGroupInfoById(this.groupTypes[this.groupIndex].id)
            this.groupTypes[this.groupIndex].selectType=res_
          }else {
            this.$message.warning(res)
          }
        }
        // this.groupTypes[this.groupIndex].selectType=unique5(this.groupTypes[this.groupIndex].selectType)
        this.$nextTick(()=>{
          let height = this.groupTypes[this.groupIndex].selectType.length*this.$refs.group[this.groupIndex].$el.firstChild.offsetHeight
          this.$refs.group[this.groupIndex].$el.style.height=height+'px'
          this.$refs.group[this.groupIndex].$el.style.marginBottom='0px'
        })
      }
    }

    //点击移除群组里的成员
    async removeMember(){
      if(this.groupIndex==-1){
        this.$message.warning('请点击展开要移除的群组,并勾选')
      }else {
        if(this.groupTypes[this.groupIndex].activeType.length>0){
          let arr_:any= []
          this.groupTypes[this.groupIndex].activeType.forEach(v=>{
            arr_.push({
              contactsId: v.id,
              groupGatherId: this.groupTypes[this.groupIndex].id
            })
          })
          let res = await GroupHttp.deletGroupUser(arr_)
          if(res){
            let res_ = await GroupHttp.getGroupInfoById(this.groupTypes[this.groupIndex].id)
            this.groupTypes[this.groupIndex].selectType=res_
            this.groupTypes[this.groupIndex].activeType=[]
            this.groupTypes[this.groupIndex].checkAll=false
            this.$nextTick(()=>{
              if(this.groupTypes[this.groupIndex].selectType.length==0){
                this.$refs.group[this.groupIndex].$el.style.height='20px'
              }else {
                let height = this.groupTypes[this.groupIndex].selectType.length*this.$refs.group[this.groupIndex].$el.firstChild.offsetHeight
                this.$refs.group[this.groupIndex].$el.style.height=height+'px'
                this.$refs.group[this.groupIndex].$el.style.marginBottom='0px'
              }
            })
          }
          /*let arr:any=[]
          let obj:any={}
          this.groupTypes[this.groupIndex].activeType.forEach((k,i)=>{
            obj[k.id]=true
          })
          this.groupTypes[this.groupIndex].selectType.forEach(j=>{
            if(!obj[j.id]){
              arr.push(j)
            }
          })
          this.groupTypes[this.groupIndex].selectType=arr*/
        }
      }
    }

    //初始化右边的短信群组信息
    async initRightSmsGroup(){
      this.groupTypes=[]
      let data:any = await GroupHttp.getAllGroup()
      data.forEach((v,i)=>{
        this.groupTypes.push({
          id:v.id,
          lineStatus:false,
          requestFlag:false,
          checkAll:false,
          groupName:v.groupname,
          activeType:[],
          selectType: [],
          number:v.number
        })
      })
     /* let num = 0
      let abc =async()=> {
        let res=await GroupHttp.getGroupInfoById(data[num].id)
        this.groupTypes[num].selectType=res
        num+=1
        if(num<(data.length)){
          abc()
        }
      }
      abc()*/
    }

    //初始化左边的接收人群
    async initLefetSmsMember(){
      let arr:any =[]
      let res = await GroupHttp.getAllSmsMember()
      arr.push({
          lineStatus:false,
          checkAll:false,
          groupName:'所有成员',
          number:res.length,
          activeType:[],
          selectType: res
        })
      this.checkTypes=arr
      arr=null
    }

    mounted(){
      this.initLefetSmsMember()
      this.initRightSmsGroup()
    }
  }
  //对象数组去重
  function unique5(array){
    var r :any= [];
    for(var i = 0, l = array.length; i < l; i++) {
      for(var j = i + 1; j < l; j++)
        if (JSON.stringify(array[i]) === JSON.stringify(array[j])) j = ++i;
      r.push(array[i]);
    }
    return r;
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/theme";
#GroupManagement{
  width: 100%;
  height: 100%;
  background: white;
  box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
  padding: 20px 40px 0px 40px;
  box-sizing: border-box;
  position: relative;
  .GroupManagement_left,.GroupManagement_right{
    float: left;
    width: 420px;
    height:700px;
    box-sizing: border-box;
    .title{
      height: 40px;
      line-height: 40px;
      font-size: 14px;/*no*/
      color: #677888;
      font-weight: bold;
    }
    .main{
      border: 1px solid #dfe4ed;
      width: 100%;
      box-sizing: border-box;
      height: calc(100% - 40px);
      .main_header{
        height: 60px;
        border-bottom: 1px solid #dfe4ed;
        line-height: 60px;
        text-align: center;
        .search_box{
          display: inline-block;
          width: 360px;
          height: 40px;
          border: 1px solid #D2D4DB;
          margin-top: 9px;
          .search_box_input{
            border: none;
            outline: none;
            float: left;
            height: 100%;
            border-right: 1px solid #D2D4DB;
            width: 309px;
            text-indent: 15px;
          }
          .search_box_btn{
            height: 100%;
            width:49px;
            float: right;
            line-height: 40px;
            text-align: center;
            background-color: #F2F2F2;
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
          .search_box_btn:hover{
            background-color: #fff;
            transition: all .2s;
          }
        }
      }
      .content{
        overflow: hidden;
        padding-left: 20px;
        padding-top: 15px;
        padding-bottom: 2px;
        height: calc(100% - 60px);
        box-sizing: border-box;
        overflow-y: auto;
        @include scrollStyle;
        >div{
          .content_name{
            height: 22px;
            line-height: 22px;
            margin-bottom: 1px;
            .content_name_t{
              font-size:15px ;
              border: 1px solid #11A9F5;
              color: #11A9F5;
              text-align: center;
              padding: 1px 2px;
              margin-top: 3px;
              margin-right: 10px;
              cursor: pointer;
              user-select: none;
            }
            .el-checkbox{
            }
            .el-icon-circle-plus-outline,.el-icon-delete{
              height: 24px;
              line-height: 24px;
              float: right;
              padding: 0 5px;
              margin-right: 10px;
              font-size: 16px;/*no*/
              cursor: pointer;
              transform-origin: 12px;
            }
            .el-icon-delete:hover{
              color: red;
              animation: yaobai .2s .1s ease;
            }
            .el-icon-circle-plus-outline:hover{
              color: #11A9F5;
            }
          }
          .content_list{
            margin-left: 10px;
            border-left: 1px solid #11A9F5;
            overflow: hidden;
            height: 0px;
            margin-bottom: 10px;
            transition: all .4s;
            >div{
              height: 40px;
              line-height: 40px;
              .content_list_L{
                float: left;
                font-size: 16px;/*no*/
                padding: 0 5px;
                height: 40px;
                line-height: 40px;
                color: #11A9F5;
              }
              .el-checkbox{
                float: left;
                margin: 0px;
                height: 40px;
                line-height: 40px;
              }
            }
            .el-icon-delete{
              float: right;
              width: 40px;
              height: 40px;
              font-size: 16px;/*no*/
              line-height: 40px;
              text-align: center;
              cursor: pointer;
            }
            .el-icon-delete:hover{
              color: red;
              animation: yaobai .2s .1s ease;
            }
          }
        }
        .last_c{
          border-top: 1px solid #11A9F5;
          color: #11A9F5;
          padding: 0px 11px;
          user-select: none;
        }
      }
    }
  }
  .GroupManagement_middle{
    float: left;
    height:700px;
    width: 150px;
    button{
      margin-left: 33px;
    }
    button:first-of-type{
      margin-top: 300px;
    }
    button:last-of-type{
      margin-top: 20px;
    }
  }
}
  @keyframes yaobai {
    0%{
      transform: rotate(0deg);
    }
    25%{
      transform: rotate(-30deg);
    }
    50%{
      transform: rotate(0deg);
    }
    75%{
      transform: rotate(30deg);
    }
    100%{
      transform: rotate(0deg);
    }
  }
</style>
<style lang="scss">
  #GroupManagement .el-checkbox{
   .el-checkbox__input{
     width: 20px;
     height: 18px;
     box-sizing: border-box;
     .el-checkbox__inner{
       width: 100%;
       height:  20px;
       text-align: center;
       line-height: 20px;
       margin-top: -2px;
     }
     .el-checkbox__inner::after{
       width: 7px;
       height: 15px;
       transform: rotate(45deg) scaleY(1);
       top: -2px;
       left: 5px;
     }
   }
    .el-checkbox__label{
      line-height: 24px;
    }
  }
</style>
