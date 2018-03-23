<template>
  <main id="DisasterRelief">
    <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    <div class="DisasterRelief_main" style="background-color: white;">
      <header class="DisasterRelief_search" v-if="activeIndex==='basicInfo'">
        <el-select v-model="GeographicInfo"
                   class="DisasterRelief_select"
                   placeholder="地理信息">
          <el-option
            v-for="item in GeographicInfos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="InfoPoint"
                   class="DisasterRelief_select"
                   placeholder="信息点">
          <el-option
            v-for="item in InfoPoints"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="DisasterRelief_search_box">
          <input type="text" class="DisasterRelief_search_input" placeholder="搜索" v-model="searchValue">
          <span class="DisasterRelief_search_btn" @click="clickSearchBtn">
            <i></i>
          </span>
        </div>
        <div class="DisasterRelief_smallFeature">
          <button class="smallFeature_addBtn" @click="addMailClick">新增</button>
          <!--<el-upload
            class="upload-demo buttonUpLoad"
            :show-file-list="false"
            action=""
            :on-success="loadSuccess"
            :on-error="loadError"
            name="multipartFile">
            <button class="smallFeature_leadBtn" size="small">导入</button>
          </el-upload>-->
          <button class="smallFeature_deleBtn" @click="deleSelectInfo">删除</button>
        </div>
      </header>
      <header class="DisasterRelief_search" v-if="activeIndex==='rescueInfo'">
        <el-select v-model="rescueInfo"
                   class="DisasterRelief_select"
                   placeholder="地理信息">
          <el-option
            v-for="item in rescueInfos"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="InfoPoint"
                   class="DisasterRelief_select"
                   placeholder="信息点">
          <el-option
            v-for="item in InfoPoints"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="DisasterRelief_smallFeature">
          <button class="smallFeature_addBtn" @click="addMailClick">新增</button>
         <!-- <el-upload
            class="upload-demo buttonUpLoad"
            :show-file-list="false"
            action=""
            :on-success="loadSuccess"
            :on-error="loadError"
            name="multipartFile">
            <button class="smallFeature_leadBtn" size="small">导入</button>
          </el-upload>-->
          <button class="smallFeature_deleBtn" @click="deleSelectInfo">删除</button>
        </div>
      </header>
      <header class="DisasterRelief_search" v-if="activeIndex==='addressBook'">
        <el-select v-model="departmentInfo"
                   clearable
                   class="DisasterRelief_select"
                   placeholder="部门">
          <el-option
            v-for="item in departmentList"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
        <div class="DisasterRelief_search_box">
          <input type="text" class="DisasterRelief_search_input" placeholder="输入姓名" v-model="searchValue">
          <span class="DisasterRelief_search_btn" @click="clickSearchBtn">
            <i></i>
          </span>
        </div>
        <div class="DisasterRelief_smallFeature">
          <button class="smallFeature_addBtn" @click="addMailClick">新增</button>
         <!-- <el-upload
            :show-file-list="false"
            class="upload-demo buttonUpLoad"
            action=""
            :on-success="loadSuccess"
            :on-error="loadError"
            name="multipartFile">
            <button class="smallFeature_leadBtn" size="small">导入</button>
          </el-upload>-->
          <button class="smallFeature_deleBtn" @click="deleSelectInfo">删除</button>
        </div>
      </header>
      <main class="DisasterRelief_Table">
        <DisasterReliefTable
          @editInfo="editInfo"
          @deleteInfo="deleteInfo"
          @handleSelectionChange="handleSelectionChange"
          :tableData="tableData"
          :GeographicInfoType="GeographicInfoType">
        </DisasterReliefTable>
      </main>
    </div>
    <componented
      :is="popupComponent"
      @getInfoFormData="getInfoFormData"
      :infoPopupClose="closeUserPopup"
      :infoFormData="infoFormData"></componented>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Getter } from 'vuex-class'
  import Region from '../../../interface/Region'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import DisasterReliefTable from './DisasterRelief_table.vue'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import { getGeographicInfo,addBasicInfo,editBasicInfo,deleteBasicInfo }  from '../../../util/InfoManageHttp'
  import BasicInforPopupType from '../../../config/BasicInforPopupType'
  import { Loading } from 'element-ui';
  import { getComputePage } from "../../../util/InfoManageFunction"
  import mailListHttp from "../../../util/MailListHttp"
  import mailInfos from '../../../interface/mailInfos'
  import infoFormPopup from '../InfoManagePopup/InfoFormPopup.vue'
  import departmentInfoHttp from "../../../util/DepartmentInfoHttp"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  const  DepartmentInfoHttp = new departmentInfoHttp()
  let MailListHttp = new mailListHttp()
  let loadingInstance: any;
  let scelData:any[]=[]
  @Component({
    components: {
      DisasterReliefTable,
      CommonNavMenu,
      infoFormPopup
    },
  })
  export default class DisasterRelief extends Vue {
    @Getter('systemStore/region_global') regionGlobal
    activeIndex:string='basicInfo'
    componentName:string='disasterRelief'
    GeographicInfos:{value:string,label:string}[]= [
      {
      value: 'school',
      label: '学校信息'
    },
      {
      value: 'hospital',
      label: '医院信息'
    },
      {
      value: 'chemical',
      label: '危化物品'
    },
      {
      value: 'shelter',
      label: '避难场所'
    },
      {
        value: 'economy',
        label: '人口经济'
      },
      ]
    GeographicInfo:string='school'
    rescueInfos:{value:string,label:string}[]=[
      {
        value:'rescueteam',
        label:'救援队伍'
      },
      {
        value:'material',
        label:'救援物资'
      },
    ]
    rescueInfo:string='rescueteam'
    GeographicInfoType:any=null
    InfoPoints:{value:number,label:string}[]=  [
      {
        value: 120,
        label: '榕城区'
      }, {
        value: 121,
        label: '揭东县'
      }, {
        value: 122,
        label: '揭西县'
      }, {
        value: 123,
        label: '惠来县'
      }, {
        value: 124,
        label: '普宁县'
      }
    ]
    InfoPoint:number=120
    searchValue:string=''
    tableData:Array<any>=[]
    popupComponent:any=null
    SelectionInfos:any[]=[]
    infoFormData:any=null//地理信息点弹窗配置
    departmentInfo:string=''
    departmentList:{value:string,label:string}[]=[]//部门选项
    @Watch('GeographicInfo')
    changeGeographicInfo(val){
      if(val=='')return
      this.getGeographicInfoValue('typeChange')
    }
    @Watch('rescueInfo')
    changerescueInfo(val){
      if(val=='')return
      this.getGeographicInfoValue('typeChange')
    }
    @Watch('InfoPoint')
    changeInfoPoint(val){
      if(val=='')return
      this.getGeographicInfoValue('')
    }

    @Watch('departmentInfo')
    changedepartmentInfo(val){
      if(val){
        let arrObj:any[]=[]
        scelData.forEach(v=>{
          if(v.department==val){
            arrObj.push(v)
          }
        })
        this.tableData=arrObj
      }else {
        this.tableData=scelData
      }
    }
    // tab选项
    async handleSelect(val:string){
      if(this.activeIndex===val)return
      this.activeIndex=val
      switch (val){
        case 'basicInfo':
          this.getGeographicInfoValue('typeChange')
          this.SelectionInfos=[]
          this.popupComponent=null
          break
        case 'rescueInfo':
          this.getGeographicInfoValue('typeChange')
          this.SelectionInfos=[]
          this.popupComponent=null
          break
        case 'addressBook':
          this.SelectionInfos=[]
          await this.getAddressBookInfos()
          this.GeographicInfoType=null
          let time_:any = setTimeout(()=>{
            this.GeographicInfoType=InfoManageTableType['mail']
            time_=null
          },10)
          this.popupComponent=null
          break
      }
    }
    //点击搜索按钮
    clickSearchBtn(){
      let arr:any[]=[]
      let rage:any
      switch(this.activeIndex){
        case 'basicInfo':
          rage = new RegExp(this.searchValue)
          scelData.forEach((v)=>{
            if(rage.test(v.name)){
              arr.push(v)
            }
          })
          this.tableData=arr
          break
        case 'rescueInfo':
          rage = new RegExp(this.searchValue)
          scelData.forEach((v)=>{
            if(rage.test(v.name)){
              arr.push(v)
            }
          })
          this.tableData=arr
          break
        case 'addressBook':
          rage = new RegExp(this.searchValue)
          scelData.forEach((v)=>{
            if(rage.test(v.name)){
              arr.push(v)
            }
          })
          this.tableData=arr
          break
      }
    }

    //文件导入成功
    loadSuccess(response, file, fileList){
      console.log(response,file,fileList)
      if(response.result=="S_FAILED"){
        Vue['prototype']['$message']({ type: 'warning', message: '导入失败,不支持此类文件' })
      }else {
        Vue['prototype']['$message']({ type: 'success', message: '文件导入成功' })
      }
    }
    loadError(err, file, fileList){
      console.log(err,file,fileList)
      Vue['prototype']['$message']({ type: 'warning', message: '导入失败' })
    }

    //获取基础地理信息
    getGeographicInfoValue(par:string){
      let time:any =setTimeout(()=>{
        loadingInstance = Loading.service({
          target:'.el-table__empty-block',
          text:'加载中.......'
        });
        clearTimeout(time)
        time=null
      },800)
      let  type:string=''
      switch(this.activeIndex){
        case 'basicInfo':
          type=this.GeographicInfo
          break
        case 'rescueInfo':
          type=this.rescueInfo
          break
      }
      getGeographicInfo(type,this.regionGlobal.cityName,this.InfoPoint)
        .then(data=>{
          if(time==null){
            loadingInstance.close();
          }else {
            clearTimeout(time)
            time=null
          }
          this.tableData=scelData=data
          if(par==='typeChange'){
            this.GeographicInfoType=null
            let time_:any = setTimeout(()=>{
              this.GeographicInfoType=InfoManageTableType[type]
              time_=null
            },10)
          }
      }).catch(err=>{
        if(time==null){
          loadingInstance.close();
        }else {
          clearTimeout(time)
          time=null
        }
          this.tableData=scelData=[]
      })
    }

    //获取通讯录信息
    async getAddressBookInfos(){
      this.tableData=scelData=await MailListHttp.getAllMailInfo()
    }

    //关闭弹窗
    closeUserPopup(){
      this.popupComponent=null
    }

    //获取地理信息点弹窗的信息
    async getInfoFormData(params:any){
      let res:boolean
      switch (params.type[0]){
        case 'add':
          switch (params.type[2]){
            case 'addressBook':
              res = await MailListHttp.addMailInfo(params.ruleForm)
              if(res){
                this.$message.success('添加成功')
                this.getAddressBookInfos()
              }else {
                this.$message.error('添加失败');
              }
              break
            default:
              res = await addBasicInfo(params.type[1],params.ruleForm,this.regionGlobal.cityId)
              if(res){
                this.$message.success('信息添加成功')
                this.getGeographicInfoValue('')
              }else {
                this.$message.error('信息添加失败');
              }
          }
          break
        case 'edit':
          switch (params.type[2]){
            case 'addressBook':
              res = await MailListHttp.editMailInfo(params.ruleForm)
              if(res){
                this.getAddressBookInfos()
                this.$message.success('信息修改成功');
              }else {
                this.$message.error('信息编辑失败');
              }
              break
            default:
              res = await editBasicInfo(params.type[1],params.ruleForm)
              if(res){
                this.$message.success('信息修改成功')
                this.getGeographicInfoValue('')
              }else {
                this.$message.error('信息修改失败')
              }
          }
          break
      }
      this.popupComponent=null
    }
    //table勾选的信息
    handleSelectionChange(params){
      this.SelectionInfos=params

    }
    //删除勾选信息
    async deleSelectInfo(){
      switch (this.activeIndex){
        case 'basicInfo':
          await this.$confirm('是否确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let params:any=this.SelectionInfos.map(v=>{
              return v.id
            })
            let res1 = await deleteBasicInfo(this.GeographicInfo,params)
            res1? this.$message.success('信息删除成功'):this.$message.error('信息删除失败');
            this.getGeographicInfoValue('')
          }).catch(() => {
            return
          });
          break
        case 'rescueInfo':
          await this.$confirm('是否确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let params2:any=this.SelectionInfos.map(v=>{
              return v.id
            })
            let res2 = await deleteBasicInfo(this.rescueInfo,params2)
            res2? this.$message.success('信息删除成功'):this.$message.error('信息删除失败');
            this.getGeographicInfoValue('')
          }).catch(() => {
            return
          });
          break

        case 'addressBook':
          let idArr:number[]=[]
          this.SelectionInfos.forEach(v=>{
            idArr.push(v.id)
          })
          await this.$confirm('是否确认删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            //删除通讯录信息
            let res = await MailListHttp.deleMailInfo(idArr.join(','))
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.SelectionInfos=[]
            }else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.getAddressBookInfos()
          })
          break
      }
    }

    //删除单个信息
    async deleteInfo(params){
      console.log(params,'删除单个信息')
      switch (this.activeIndex){
        case 'basicInfo':
          await this.$confirm('是否确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let res1 = await deleteBasicInfo(this.GeographicInfo,[params.id])
            res1? this.$message.success('信息删除成功'):this.$message.error('信息删除失败');
            this.getGeographicInfoValue('')
          }).catch(() => {
            return
          });
          break
        case 'rescueInfo':
          await this.$confirm('是否确认删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let res2 = await deleteBasicInfo(this.rescueInfo,[params.id])
            res2? this.$message.success('信息删除成功'):this.$message.error('信息删除失败');
            this.getGeographicInfoValue('')
          }).catch(() => {
            return
          });
          break
        case 'addressBook':
          await this.$confirm('是否确认删除该信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            //删除通讯录信息
            let res = await MailListHttp.deleMailInfo(params.id)
            if(res){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
            this.getAddressBookInfos()
          }).catch(() => {
            return
          });
          break
      }
    }

    //点击增加
    addMailClick(){
      let title:string=''
      switch (this.activeIndex){
        case 'basicInfo':
          switch(this.GeographicInfo){
            case 'school':
              title='新增学校信息点'
              break
            case 'hospital':
              title='新增医院信息点'
              break
            case 'chemical':
              title='新增危化物品信息点'
              break
            case 'shelter':
              title='新增避难场所'
              break
            case 'economy':
              title='新增人口经济信息'
              break
          }
          this.infoFormData={
            type:['add',this.GeographicInfo,this.activeIndex],
            title:title,
            className:'width600',
            ruleForm: BasicInforPopupType[this.GeographicInfo]['ruleForm'],
            config:BasicInforPopupType[this.GeographicInfo]['config'],
            rules: BasicInforPopupType[this.GeographicInfo]['rules'],
          }
          this.popupComponent=infoFormPopup
          break
        case 'rescueInfo':
          switch(this.rescueInfo){
            case 'rescueteam':
              title='新增救援队伍'
              break
            case 'material':
              title='新增救援物资'
              break
          }
          this.infoFormData={
            type:['add',this.rescueInfo,this.activeIndex],
            title:title,
            className:'width600',
            ruleForm: BasicInforPopupType[this.rescueInfo]['ruleForm'],
            config:BasicInforPopupType[this.rescueInfo]['config'],
            rules: BasicInforPopupType[this.rescueInfo]['rules'],
          }
          this.popupComponent=infoFormPopup
          break
        case 'addressBook':
          this.infoFormData={
            type:['add','',this.activeIndex],
            title:'新增成员',
            className:'width300',
            ruleForm: {
              name: '',
              cellphone: '',
              department: '',
              title: '',
              phone:''
            },
            config:{
              name:{
                type:'input',
                label:'姓名'
              },
              title:{
                type:'input',
                label:'职位'
              },
              department:{
                type:'select',
                label:'部门',
                options:this.departmentList
              },
              cellphone:{
                type:'input',
                label:'手机号码',
              },
              phone:{
                type:'input',
                label:'电话'
              }
            },
            rules: {
              name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
              title:[{ required: false, message: '', trigger: 'blur' }],
              department:[{required:false,message:'',trigger:'change'}],
            },
          }
          this.popupComponent=infoFormPopup
          break
      }
    }

    //编辑信息
    async editInfo(params){
      let title:string=''
      switch (this.activeIndex){
        case 'basicInfo':
          switch(this.GeographicInfo){
            case 'school':
              title='编辑学校信息点'
              break
            case 'hospital':
              title='编辑医院信息点'
              break
            case 'chemical':
              title='编辑危化物品信息点'
              break
            case 'shelter':
              title='编辑避难场所'
              break
            case 'economy':
              title='编辑人口经济信息'
              break
          }
          this.infoFormData={
            type:['edit',this.GeographicInfo,this.activeIndex],
            title:title,
            className:'width600',
            ruleForm: params,
            config:BasicInforPopupType[this.GeographicInfo]['config'],
            rules: BasicInforPopupType[this.GeographicInfo]['rules'],
          }
          this.popupComponent=infoFormPopup
          break
        case 'rescueInfo':
          switch(this.rescueInfo){
            case 'rescueteam':
              title='编辑救援队伍'
              break
            case 'material':
              title='编辑救援物资'
              break
          }
          this.infoFormData={
            type:['edit',this.rescueInfo,this.activeIndex],
            title:title,
            className:'width600',
            ruleForm:params,
            config:BasicInforPopupType[this.rescueInfo]['config'],
            rules: BasicInforPopupType[this.rescueInfo]['rules'],
          }
          this.popupComponent=infoFormPopup
          break
        case 'addressBook':
          this.infoFormData={
            type:['edit','',this.activeIndex],
            title:'编辑成员',
            className:'width300',
            ruleForm: {
              id:params.id,
              name: params.name,
              cellphone: params.cellphone,
              department: params.department,
              title: params.title,
              phone:params.phone
            },
            config:{
              name:{
                type:'input',
                label:'姓名'
              },
              title:{
                type:'input',
                label:'职位'
              },
              department:{
                type:'select',
                label:'部门',
                options:this.departmentList
              },
              cellphone:{
                type:'input',
                label:'手机号码',
              },
              phone:{
                type:'input',
                label:'电话'
              }
            },
            rules: {
              name:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
              title:[{ required: false, message: '', trigger: 'blur' }],
              department:[{required:false,message:'',trigger:'change'}],
            },
          }
          this.popupComponent=infoFormPopup
          break
      }
    }
    async mounted(){
      this.getGeographicInfoValue('typeChange')
      this.departmentList=(await DepartmentInfoHttp.getDepartmentTypes({})).map(v=>{return {value:v.department, label:v.department,}})
    }
  }
</script>

<style lang="scss" scoped>
#DisasterRelief{
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  background-clip: content-box;
  min-height: 100%;
  box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
  .DisasterRelief_main{
    padding: 15px 0px 0px 40px;
    padding-bottom: 80px;
    overflow: hidden;
  }
}
.DisasterRelief_search{
  font-size: 14px;
  height: 40px;
  margin-bottom: 15px;
  .DisasterRelief_select{
    width: 150px;
    float: left;
    margin-right: 40px
  }
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
      transition: all .3s;
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
}
//删除导入按钮样式
.DisasterRelief_smallFeature{
  float: right;
  height:30px;
  margin-right: 20px;
  button{
    width: 100px;
    height: 30px;
    border: none;
    outline: none;
    float: left;
    margin-right: 20px;
    cursor: pointer;
    line-height: 29px;
    font-size: 14px;
  }
  .buttonUpLoad{
    box-sizing: border-box;
    overflow: hidden;
    width: 100px;
    height: 30px;
    border: none;
    outline: none;
    float: left;
    margin-right: 20px;
    cursor: pointer;
    line-height: 27px;
    font-size: 14px;
  }
  .smallFeature_addBtn{
    background-color: #11a9f5;
    color: #fff;
  }
  .smallFeature_addBtn:hover{
    background-color: rgb(16, 152, 221);
  }
  .smallFeature_addBtn:active{
    background-color: #11a9f5;
  }
  .smallFeature_leadBtn{
    background-color:white;
    box-sizing: border-box;
    border: 1px solid #11a9f5;
    color: #11a9f5;
  }
  .smallFeature_leadBtn:hover{
    border: 1px solid #303030;
    color: #303030;
  }
  .smallFeature_leadBtn:active{
    border: 1px solid #11a9f5;
    color:#11a9f5;
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
.DisasterRelief_Table{
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 40px;
}
</style>
