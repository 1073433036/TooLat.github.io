<template>
  <main id="geologicalDisaster">
      <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
      <div class="geologicalDisaster_search">
        <div class="geologicalDisaster_search_1" v-if="activeIndex=='geologicalDisasterPoint'">
          <div class="geologicalDisaster_smallFeature">
            <button class="smallFeature_addBtn" @click="openInfoPopup">新增</button>
            <el-upload
              class="upload-demo buttonUpLoad"
              :show-file-list="false"
              action="http://10.148.83.86:8080/JYTY/geol/insertsexcel"
              name="multipartFile"
              :on-success="loadSuccess"
              :on-error="loadError">
              <button class="smallFeature_leadBtn" size="small">导入</button>
            </el-upload>
            <button class="infoManageBtn_entry" size="small" @click="createExcel">导出</button>
            <button class="smallFeature_deleBtn" @click="deleteGeologicalInfoPoint()">删除</button>
            <div class="DisasterRelief_search_box">
              <input type="text" class="DisasterRelief_search_input" placeholder="搜索" v-model="searchValue">
              <span class="DisasterRelief_search_btn" @click="clickSearchBtn">
              <i></i>
            </span>
            </div>
          </div>
        </div>
        <div class="geologicalDisaster_search_2" v-if="activeIndex=='geologicalDisasterState'">
          <el-select v-model="waringStatusValue"
                     class="geologicalDisaster_select"
                     clearable
                     @change="getWarningState"
                     placeholder="预警状态">
            <el-option
              v-for="item in waringStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <el-select v-model="warningLevelValue"
                     clearable
                     class="geologicalDisaster_select"
                     @change="getWarningLevel" placeholder="预警等级">
            <el-option
              v-for="item in warningLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <el-select v-model="disasterTypeValue"
                     clearable
                     class="geologicalDisaster_select"
                     @change="geidisasterType" placeholder="灾害类型">
            <el-option
              v-for="item in disasterTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="startTime"
            class="geologicalDisaster_prick"
            format="yyyy-MM-dd"
            type="date"
            placeholder="起始时间">
          </el-date-picker>
          <el-date-picker
            v-model="endTime"
            type="date"
            format="yyyy-MM-dd"
            class="geologicalDisaster_prick"
            placeholder="终止时间">
          </el-date-picker>
          <el-button type="primary"
                      class="search_btn"
                      @click="searchWaringInfo"
                     style="margin-right: 40px"
                     icon="el-icon-search">搜索</el-button>
        </div>
        <div class="geologicalDisaster_search_3" v-if="activeIndex=='geologicalDisasterReport'">
          <el-date-picker
            v-model="startTimeReport"
            class="geologicalDisaster_prick geologicalDisaster_prick_1"
            format="yyyy-MM-dd"
            type="date"
            placeholder="起始时间">
          </el-date-picker>
          <span class="prick_line">~</span>
          <el-date-picker
            v-model="endTimeReport"
            type="date"
            format="yyyy-MM-dd"
            class="geologicalDisaster_prick"
            placeholder="终止时间">
          </el-date-picker>
          <el-button type="primary"
                     class="search_btn"
                     @click="searchWaringReport"
                     style="margin-right: 40px"
                     icon="el-icon-search">查询</el-button>
        </div>
      </div>
      <section class="geologicalDisaster_table">
        <geologicalDisasterTable :tableType="activeIndex"
                                 @handleSelectionChange="deleteSelectInfo"
                                 @deleteRow="deleteGeologicalInfoPoint"
                                 @changeRow="changeGeologicInfo"
                                 @showYuZhiInfo="showYuZhiInfo"
                                 @showRainInfo="showRainInfo"
                                 @changeThreshold="changeThreshold"
                                 :tableData="tableData">
        </geologicalDisasterTable>
      </section>

      <ThresholdPopup v-if="thresholdPopupFlag"
                      :YuZhiInfo="YuZhiInfo"
                      :thresholdClose="thresholdClose" />
    <EditThresholdPopup v-if="EditThresholdPopupFlag"
                        :closeThresholdPopup="closeThresholdPopup"
                        @getEditThresholdData="getEditThresholdData"
                        :thresholdData="thresholdData"></EditThresholdPopup>
      <HourRainPopup v-if="hourRainPopupFlag"
                     :hourRainClose="hourRainClose"
                     :hourRainInfo="hourRainInfo" />

    <infoFormPopup v-if="infoFormPopupFlag"
                   @getInfoFormData="getInfoFormData"
                   :infoPopupClose="infoPopupClose"
                   :infoFormData="infoFormData"></infoFormPopup>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component,Watch,Prop } from 'vue-property-decorator'
  import geologicalDisasterTable from './GeologicalDisasterTable.vue'
  import ThresholdPopup from "../InfoManagePopup/ThresholdPopup.vue"
  import HourRainPopup from "../InfoManagePopup/HourRainPopup.vue"
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import infoFormPopup from '../InfoManagePopup/InfoFormPopup.vue'
  import EditThresholdPopup from "../InfoManagePopup/EditThresholdPopup.vue"
  import {GeolPoi, GeolWarningState } from '../../../interface/DisasterPoi'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import DisasterPoiHelper from '../../../util/DisasterPoiHelper'
  import LoadingPopup from '../InfoManagePopup/LoadingPopup.vue'
  import { createExcel } from "../../../util/InfoManageFunction"
  let tableDataSeal:any=[]
  interface WarningItem {
    value: string
    label: string
  }
  @Component({
    components: {
      LoadingPopup,
      geologicalDisasterTable,
      ThresholdPopup,
      HourRainPopup,
      CommonNavMenu,
      infoFormPopup,
      EditThresholdPopup
    }
  })
  export default class GeologicalDisaster extends Vue {
    REQUEST_TYPE:string='geol'
    activeIndex: string = 'geologicalDisasterPoint'
    componentName:string='geologicalDisaster'
    waringStatusValue: string = ''
    waringStatusList: Array<WarningItem> = [
      { value: 'allStatus', label: '全部' },
      { value: 'waringIn', label: '预警中' },
      { value: 'waringOut', label: '已解除' }
    ]
    warningLevelValue: string= ''
    warningLevelList: Array<WarningItem> = [
      { value: 'allLevel', label: '全部' },
      { value: 'oneLevel', label: 'I级' },
      { value: 'twoLevel', label: 'II级' },
      { value: 'threeLevel', label: 'III级' },
      { value: 'fourLevel', label: 'IV级' },
      { value: 'fiveLevel', label: 'V级' }
    ]
    disasterTypeValue: string = ''
    disasterTypeList: Array<WarningItem> = [
      { value: 'allType',  label: '全部' },
      { value: 'type1',  label: '崩塌' },
      { value: 'type2', label: '滑坡' },
      { value: 'type3', label: '崩塌群' },
      { value: 'type4', label: '滑坡群' },
      { value: 'type5', label: '泥石流' },
      { value: 'type6', label: '地裂缝' },
      { value: 'type7', label: '地面塌陷' },
      { value: 'type8', label: '地面沉降' }
    ]
    startTime: string = ''
    endTime: string = ''
    startTimeReport: string = ''
    endTimeReport: string = ''
    tableHeight: number = 300
    tableData: GeolPoi| GeolWarningState [] = []
    searchValue: string = ''
    selectInfos:GeolPoi| GeolWarningState [] |any = []//勾选的信息id数组
    thresholdPopupFlag: boolean = false
    EditThresholdPopupFlag:boolean=false
    hourRainPopupFlag: boolean = false
    YuZhiInfo:any = null
    hourRainInfo: any = null
    infoFormPopupFlag:boolean=false
    infoFormData:any=null
    thresholdData:any=null

    @Watch('waringStatusValue')
    changewaringStatusValue(val){
      this.tableData=this.matchingData(tableDataSeal,this.waringStatusValue,this.warningLevelValue,this.disasterTypeValue)
    }
    @Watch('warningLevelValue')
    changewarningLevelValue(){
      this.tableData=this.matchingData(tableDataSeal,this.waringStatusValue,this.warningLevelValue,this.disasterTypeValue)
    }
    @Watch('disasterTypeValue')
    changedisasterTypeValue(){
      this.tableData=this.matchingData(tableDataSeal,this.waringStatusValue,this.warningLevelValue,this.disasterTypeValue)
    }

    //tab栏类型选择
    async handleSelect(key: string, keyPath: Array<any>):Promise<void> {
      if(this.activeIndex == key) return
      switch(key) {
        case 'geologicalDisasterPoint':
          await this.getAllGeoloDisInfo()
          break
        case 'geologicalDisasterState':
          await this.getAllWarningInfo()
          break
        case 'geologicalDisasterReport':
          await this.getAllWaringReport()
          break
      }
      this.activeIndex = key
    }

    //文件导入成功
    loadSuccess(response, file, fileList):void{
      console.log(response,file,fileList)
      if(response.result=="S_FAILED"){
        Vue['prototype']['$message']({ type: 'warning', message: '导入失败,不支持此类文件' })
      }else {
        Vue['prototype']['$message']({ type: 'success', message: '文件导入成功' })
      }
    }

    //文件导入失败
    loadError(err, file, fileList):void{
      console.log(err,file,fileList)
      Vue['prototype']['$message']({ type: 'warning', message: '文件导入失败' })
    }

     getWarningState():void{}

     getWarningLevel():void{}

     geidisasterType():void{}

     //查询报告
    searchWaringReport():void{
      let arr:any=[]
      if(this.startTimeReport&&!this.endTimeReport){
        tableDataSeal.forEach(v=>{
          if(new Date(this.startTimeReport).getTime()<new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else if(!this.startTimeReport&&this.endTimeReport){
        tableDataSeal.forEach(v=>{
          if(new Date(this.endTimeReport).getTime()>new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else if(this.startTimeReport&&this.endTimeReport){
        tableDataSeal.forEach(v=>{
          if(new Date(this.startTimeReport).getTime()<new Date(v.dataTime).getTime()&&new Date(this.endTimeReport).getTime()>new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else {
        this.tableData=tableDataSeal
      }
    }

     //隐患点搜索
     clickSearchBtn():void{
       switch(this.activeIndex) {
         case 'geologicalDisasterPoint':
           let a:any[]=[]
           let rage = new RegExp(this.searchValue)
           tableDataSeal.forEach((v)=>{
             if(rage.test(v.name)){
               a.push(v)
             }
           })
           this.tableData=a
           break
         case 'geologicalDisasterState':

           break
         case 'geologicalDisasterReport':

           break
       }
     }

     //勾选的隐患点选项
     deleteSelectInfo(val:GeolPoi[]|any):void{
       this.selectInfos=[]
       val.forEach(v=>{
         this.selectInfos.push(v.id)
       })
     }

     //打开编辑窗口，编辑隐患点
     async changeGeologicInfo(val:GeolPoi):Promise<void>{
       this.infoFormPopupFlag=true
       this.infoFormData={
         type:'edit',
         title:'编辑地质隐患点',
         className:'width600',
         ruleForm: val,
         config:{
           name:{
             type:'input',
             label:'灾害点名称'
           },
           type:{
             type:'select',
             label:'灾害类型',
             options: [
               {
                 value: '选项1',
                 label: '黄金糕'
               }, {
                 value: '选项2',
                 label: '双皮奶'
               }, {
                 value: '选项3',
                 label: '蚵仔煎'
               }, {
                 value: '选项4',
                 label: '龙须面'
               }, {
                 value: '选项5',
                 label: '北京烤鸭'
               }]
           },
           level:{
             type:'input',
             label:'灾害等级'
           },
           scale:{
             type:'input',
             label:'规模'
           },
           stability:{
             type:'input',
             label:'稳定性'
           },
           risk:{
             type:'input',
             label:'风险大小'
           },
           factor:{
             type:'input',
             label:'产生因素'
           },
           people:{
             type:'input',
             label:'受灾人数'
           },
           gdp:{
             type:'input',
             label:'损失(万元)'
           },
           measure:{
             type:'input',
             label:'采取措施'
           },
           address:{
             type:'input',
             label:'地点'
           },
           manager:{
             type:'input',
             label:'负责人'
           },
           cellphone:{
             type:'input',
             label:'联系电话'
           },
           detail:{
             type:'textarea',
             label:'详细'
           },
         },
         rules: {
           name:[
             { required: true, message: '请输入灾害隐患点名称', trigger: 'blur' }
           ],
           detail: [{ required: false, message: '', trigger: 'blur' }],
           manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
           cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' }],
           type:[{ required: false, message: '', trigger: 'blur' }],
           scale:[{ required: false, message: '', trigger: 'blur' }],
           stability:[{ required: false, message: '', trigger: 'blur' }],
           risk:[{ required: false, message: '', trigger: 'blur' }],
           factor:[{ required: false, message: '', trigger: 'blur' }],
           people:[{ required: false, message: '', trigger: 'blur' }],
           gdp:[{ required: false, message: '', trigger: 'blur' }],
           measure:[{ required: false, message: '', trigger: 'blur' }],
           level:[{ required: false, message: '', trigger: 'blur' }],
           address:[{ required: false, message: '请输入灾害地址', trigger: 'blur' }],
         }
       }
     }

     //删除隐患点
     async deleteGeologicalInfoPoint(par: any = null):Promise<void> {
      let arr:any=[]
       if(par){
         arr.push(par.id)
       }else {
         if(this.selectInfos.length==0)return
         arr=this.selectInfos
       }
       await Vue['prototype']['$confirm']('是否删除该信息?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(async () => {
         let disasterPoiHelper:any= new DisasterPoiHelper()
         let res = await disasterPoiHelper.deleteDisasterPoi(this.REQUEST_TYPE,arr)
         disasterPoiHelper=null
         res? Vue['prototype']['$message']({
             duration:1000,
             showClose: true,
             type: 'success',
             message: '删除成功!'
           }): Vue['prototype']['$message']({
           duration:1000,
           showClose: true,
           type: 'error',
           message: '删除失败!'
         })
         this.getAllGeoloDisInfo()
       }).catch(() => {return});

     }
     //新增隐患点
     async addGeologicalInfo(params:GeolPoi):Promise<void>{
        let par= {
          cityid: 1,
          countyid: 1,
          townid: 1,
          lon: params.lon,
          lat: params.lat,
          ddatetime: 1510575419000,
          detail: params.detail,
          manager: params.manager,
          cellphone: params.cellphone,
          address: params.address,
          type: params.type,
          scale: params.scale,
          stability:params.stability,
          risk: params.risk,
          factor: params.factor,
          people: params.people,
          gdp: params.gdp,
          measure: params.measure,
          level: params.level,
        }
       let disasterPoiHelper:any= new DisasterPoiHelper()
       let res = await disasterPoiHelper.addDisasterPoi(this.REQUEST_TYPE,par)
       disasterPoiHelper=null
       res? this.$message({
         duration:1000,
         showClose: true,
         type: 'success',
         message: '灾害点添加成功!'
       }): this.$message({
         duration:1000,
         showClose: true,
         type: 'error',
         message: '灾害点添加失败!'
       })
       this.getAllGeoloDisInfo()
     }

     //获取所有隐患点信息
     async getAllGeoloDisInfo():Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
       let res = await disasterPoiHelper.getDisasterInfo(this.REQUEST_TYPE)
       this.tableData=tableDataSeal=res
       disasterPoiHelper=null
     }

     //获取所有预警状态信息
     async getAllWarningInfo():Promise<void>{
       let disasterPoiHelper:any= new DisasterPoiHelper()
       //最新自动预警信息
       let res = await disasterPoiHelper.getNewDisasterWarning(this.REQUEST_TYPE)
       this.tableData=tableDataSeal=res
       disasterPoiHelper=null
     }

     //获取预警报告列表
     async getAllWaringReport():Promise<void>{
       let disasterPoiHelper:any= new DisasterPoiHelper()
       let res = await disasterPoiHelper.getAllWaringReport(this.REQUEST_TYPE)
       this.tableData=tableDataSeal=res
       disasterPoiHelper=null
     }

    //预警信息搜索
    async searchWaringInfo():Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      if(!this.startTime&&!this.endTime){
        let res = await disasterPoiHelper.getAllDisasterWarning(this.REQUEST_TYPE)
        this.tableData=tableDataSeal=this.matchingData(res,this.waringStatusValue,this.warningLevelValue,this.disasterTypeValue)
      }else{
        let startTime:any,endTime:any
        if(!this.startTime){
          startTime=new Date('1970/1/1')
          endTime=this.endTime
        }else if(!this.endTime){
          startTime=this.startTime
          endTime=new Date()
        }else {
          startTime=this.startTime
          endTime=this.endTime
        }
        let res = await disasterPoiHelper.getDisasterWarningByTime(this.REQUEST_TYPE,startTime,endTime)
        tableDataSeal=res
        this.tableData=this.matchingData(res,this.waringStatusValue,this.warningLevelValue,this.disasterTypeValue)
      }
      disasterPoiHelper=null
    }

    //预警状态的信息匹配
    matchingData(data:any[],status?:string,level?:string,type?:string):GeolPoi | GeolWarningState[]{
      if(status){
        let arrObject:any[]=[]
        data.forEach(v=>{
          if(status!='全部'){
            if(v.status==status){
              arrObject.push(v)
            }
          }else {
            arrObject.push(v)
          }
        })
        data=arrObject
      }
      if(type){
        let arrObject:any[]=[]
        data.forEach(v=>{
          if(type!='全部'){
            if(v.type==type){
              arrObject.push(v)
            }
          }else {
            arrObject.push(v)
          }
        })
        data=arrObject
      }
      if(level){
        let arrObject:any[]=[]
        data.forEach(v=>{
          if(level!='全部'){
            if(v.level==level){
              arrObject.push(v)
            }
          }else {
            arrObject.push(v)
          }
        })
        data=arrObject
      }
      return data
    }

    //查看阈值信息
    showYuZhiInfo(par:GeolWarningState):void{
      console.log(par,'阈值信息')
      this.YuZhiInfo={
        type:'灾害点',
        value:par
      }
      this.thresholdPopupFlag=true
    }

    //关闭阈值弹窗
    thresholdClose():void{
      this.thresholdPopupFlag=false
    }

    //查看雨量信息
    showRainInfo(par:GeolWarningState):void{
      this.hourRainInfo={
        type:'灾害点',
        value:par
      }
      this.hourRainPopupFlag=true
    }

    //关闭雨量弹窗
    hourRainClose():void{
      this.hourRainPopupFlag=false
    }

    //打开infoPopup弹窗
    openInfoPopup():void{
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'add',
        title:'新增地质隐患点',
        className:'width600',
        ruleForm: {
          name:'',
          detail:'',
          manager:'',
          cellphone:'',
          type:'',
          scale:'',
          stability:'',
          risk:'',
          factor:'',
          people:'',
          gdp:'',
          measure:'',
          level:'',
          address:'',
        },
        config:{
          name:{
            type:'input',
            label:'灾害点名称'
          },
          type:{
            type:'select',
            label:'灾害类型',
            options: [
              { value: 'type1',  label: '崩塌' },
              { value: 'type2', label: '滑坡' },
              { value: 'type3', label: '崩塌群' },
              { value: 'type4', label: '滑坡群' },
              { value: 'type5', label: '泥石流' },
              { value: 'type6', label: '地裂缝' },
              { value: 'type7', label: '地面塌陷' },
              { value: 'type8', label: '地面沉降' }
              ]
          },
          level:{
            type:'input',
            label:'灾害等级'
          },
          scale:{
            type:'input',
            label:'规模'
          },
          stability:{
            type:'input',
            label:'稳定性'
          },
          risk:{
            type:'input',
            label:'风险大小'
          },
          factor:{
            type:'input',
            label:'产生因素'
          },
          people:{
            type:'input',
            label:'受灾人数'
          },
          gdp:{
            type:'input',
            label:'损失(万元)'
          },
          measure:{
            type:'input',
            label:'采取措施'
          },
          address:{
            type:'input',
            label:'地点'
          },
          manager:{
            type:'input',
            label:'负责人'
          },
          cellphone:{
            type:'input',
            label:'联系电话'
          },
          detail:{
            type:'textarea',
            label:'详细'
          },
        },
        rules: {
          name:[
            { required: true, message: '请输入灾害隐患点名称', trigger: 'blur' }
          ],
          detail: [{ required: false, message: '', trigger: 'blur' }],
          manager: [{ required: false, message: '负责人必填', trigger: 'blur' }],
          cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' }],
          type:[{ required: false, message: '', trigger: 'blur' }],
          scale:[{ required: false, message: '', trigger: 'blur' }],
          stability:[{ required: false, message: '',trigger: 'blur' }],
          risk:[{ required: false, message: '', trigger: 'blur' }],
          factor:[{ required: false, message: '', trigger: 'blur' }],
          people:[{ required: false, message: '', trigger: 'blur' }],
          gdp:[{ required: false, message: '', trigger: 'blur' }],
          measure:[{ required: false, message: '', trigger: 'blur' }],
          level:[{ required: false, message: '', trigger: 'blur' }],
          address:[{ required: false, message: '请输入灾害地址', trigger: 'blur' }],
        }
      }
    }
    //关闭infoPopup弹窗
    infoPopupClose():void{
      this.infoFormPopupFlag = false;
    }
    //获取InfoForm弹窗的数据
    async getInfoFormData(params:any):Promise<void>{
      switch(params.type){
        case 'add':
          await this.addGeologicalInfo(params.ruleForm)
          break
        case 'edit':
          let disasterPoiHelper:any= new DisasterPoiHelper()
          let res = await disasterPoiHelper.modifyDisasterPoi(this.REQUEST_TYPE,params.ruleForm)
          disasterPoiHelper=null
          res? this.$message({
            duration:1000,
            showClose: true,
            type: 'success',
            message: '灾害点信息修改成功!'
          }): this.$message({
            duration:1000,
            showClose: true,
            type: 'error',
            message: '灾害点信息修改失败!'
          })
          this.getAllGeoloDisInfo()
          this.infoPopupClose()
          break
      }

    }

    //点击表格的阈值修改
    changeThreshold(params:any):void{
      if(!params.threshold){
        params.threshold= "{\"p72\":0,\"p48\":0,\"p24\":0,\"p12\":0,\"p6\":0,\"p3\":0,\"p2\":0,\"p1\":0,\"p0\":0,\"r1\":0,\"r2\":0,\"r3\":0}"
      }
      this.EditThresholdPopupFlag=true
      this.thresholdData={
        className:'width650',
        type:'隐患点',
        data:params,
      }
    }

    //获取阈值修改弹窗的数据
    async getEditThresholdData(params:any):Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      let res = await disasterPoiHelper.modifyDisasterPoi(this.REQUEST_TYPE,params.data)
      disasterPoiHelper=null
      res? this.$message({
        duration:1000,
        showClose: true,
        type: 'success',
        message: '灾害点信息修改成功!'
      }): this.$message({
        duration:1000,
        showClose: true,
        type: 'error',
        message: '灾害点信息修改失败!'
      })
      this.getAllGeoloDisInfo()
      this.closeThresholdPopup()
    }
    //点击关闭阈值修改弹窗
    closeThresholdPopup():void{
      this.EditThresholdPopupFlag=false
    }

    //导出当前表格数据到excel文件
    createExcel(){
      let title=moment(new Date()).format('YYYY-MM-DD HH:mm')+'地址灾害'
      createExcel(this.tableData,InfoManageTableType['geologicalDisasterPoint'],title)
    }

    mounted(){
      this.getAllGeoloDisInfo()
    }
  }
</script>

<style lang="scss" scoped>
  #geologicalDisaster{
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    min-height: 100%;
    position: relative;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
  .geologicalDisaster_search{
    margin-top: 12px;
    padding-left: 40px;
    font-size: 12px;
    .geologicalDisaster_select{
      float: left;
      width: 150px;
      margin-right: 40px;
    }
    .geologicalDisaster_prick{
      float: left;
      margin-right: 40px;
      width: 150px;
    }
    .search_btn{
      float: left;
      margin-top: 5px;
      padding: 0px 15px;
      height: 30px;
      line-height: 29px;
    }
    .geologicalDisaster_search_2{
      height: 40px;
    }
    .geologicalDisaster_search_3{
      overflow: hidden;
      .prick_line{
        float: left;
        height: 40px;
        line-height: 40px;
        padding: 0px 10px;
      }
      .geologicalDisaster_prick_1{
        margin-right: 0px;
      }
    }

  }
  .geologicalDisaster_table{
    margin-top: 12px;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
    font-size: 12px;
  }

  }
  .geologicalDisaster_smallFeature{
    overflow: hidden;
    height: 40px;
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
    margin-top: 5px;
    overflow: hidden;
    border-radius: 2px;/*no*/
  }
    .buttonUpLoad{
      position: relative;
      width: 100px;
      height: 30px;
      border: none;
      outline: none;
      float: left;
      margin-right: 20px;
      cursor: pointer;
      line-height: 29px;
      font-size: 14px;
      margin-top: 5px;
      overflow: hidden;
    }
  .smallFeature_addBtn{
    background-color: #11a9f5;
    color: #fff;
    line-height: 28px;
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
    top:0px;
    left: 0;
    width: 100px;
    height: 30px;
    position: absolute;
    margin-top: 0px;
    line-height: 26px;
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
    line-height: 28px;
  }
  .smallFeature_deleBtn:hover{
    background-color: #d93c48;
    color: #fff;
  }
  .smallFeature_deleBtn:active{
    background-color:  #eb414f;
    color: #fff;
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

</style>
<style>
  .el-upload.el-upload--text{
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
</style>
