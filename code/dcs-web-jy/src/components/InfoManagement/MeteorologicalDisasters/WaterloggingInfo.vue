<template>
  <main id="waterlogging">
    <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
    <section class="waterlogging_main">
      <div class="WaterloggingPoint_btns" v-if="activeIndex === 'waterloggingPoint'">
        <button class="smallFeature_addBtn" @click="openInfoPopup">新增</button>
        <el-upload
          class="upload-demo buttonUpLoad"
          :show-file-list="false"
          action="http://10.148.83.86:8080/JYTY/waterlog/insertsexcel"
          :on-success="loadSuccess"
          :on-error="loadError"
          name="multipartFile">
          <button class="smallFeature_leadBtn" size="small">导入</button>
        </el-upload>
        <button class="smallFeature_leadBtn" size="small" @click="createExcel">导出</button>
        <button class="smallFeature_deleBtn" @click="deleteWaterloggings(-1)">删除</button>
      </div>
      <div class="warningState_search" v-if="activeIndex=='warningState'">
        <el-date-picker
          v-model="starttimeState"
          class="mountainTorrents_select"
          type="date"
          format="yyyy-MM-dd"
          placeholder="起始时间">
        </el-date-picker>
        <span class="pinck_text">~</span>
        <el-date-picker
          v-model="endtimeState"
          type="date"
          format="yyyy-MM-dd"
          class="mountainTorrents_select"
          placeholder="终止时间">
        </el-date-picker>
        <el-button type="primary"
                  class="torren_search"
                  @click="waringSearch"
                  style="margin-left: 40px"
                  icon="el-icon-search">查询</el-button>
      </div>
      <div class="warningReport_search_title" v-if="activeIndex=='warningReport'">
        <div class="warningReport_search">
          <el-date-picker
            v-model="startTimeReport"
            class="warningReport_picker warningReport_float"
            format="yyyy-MM-dd HH:00"
            type="datetime"
            placeholder="起始时间">
          </el-date-picker>
          <span class="warningReport-picker_text1 warningReport_float">~ </span>
          <el-date-picker
            v-model="endTimeReport"
            type="datetime"
            format="yyyy-MM-dd HH:00"
            class="warningReport_picker warningReport_margin warningReport_float"
            placeholder="终止时间">
          </el-date-picker>
          <el-button type="primary"
                    class="warningReport_float warningReport_btns"
                    icon="el-icon-search" @click="searchWaringReport">查询</el-button>
          <!--<em class="warningReport_line warningReport_float"></em>
          <span class="warningReport-picker_text2 warningReport_float">生成报告时间</span>
          <el-date-picker
            v-model="reportTime"
            format="yyyy-MM-dd HH:00"
            class="warningReport_picker warningReport_float"
            type="datetime"
            placeholder="起始时间">
          </el-date-picker>
          <el-radio class="warningReport_radio warningReport_float" v-model="warningReportRadio" label="1">未来1小时</el-radio>
          <el-radio class="warningReport_radio warningReport_float warningReport_margin" v-model="warningReportRadio" label="2">未来2小时</el-radio>
          <el-button type="primary" class="warningReport_float warningReport_margin warningReport_btns">生成</el-button>-->
        </div>
      </div>
      <div class="waterlogging_table">
        <WaterloggingTable
          :tableData="tableData"
          @handleSelectionChange="handleSelectionChange"
          @deleteRow="deleteRow"
          @changeRow="changeRow"
          @showYuZhiInfo="showYuZhiInfo"
          @showRainInfo="showRainInfo"
          @changeThreshold="changeThreshold"
          :tableType="activeIndex" />
      </div>
    </section>
    <ThresholdPopup :YuZhiInfo="YuZhiInfo"
                    :thresholdClose="thresholdClose"
                    v-if="thresholdPopupFlag" />
    <EditThresholdPopup v-if="EditThresholdPopupFlag"
                        :closeThresholdPopup="closeThresholdPopup"
                        @getEditThresholdData="getEditThresholdData"
                        :thresholdData="thresholdData"/>
    <HourRainPopup v-if="hourRainPopupFlag"
                   :hourRainClose="hourRainClose"
                   :hourRainInfo="hourRainInfo" />
    <infoFormPopup v-if="infoFormPopupFlag"
                   @getInfoFormData="getInfoFormData"
                   :infoPopupClose="infoPopupClose"
                   :infoFormData="infoFormData"/>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import moment from 'moment'
  import { Getter,Action } from 'vuex-class'
  import WaterloggingTable from './WaterloggingTable.vue'
  import infoFormPopup from '../InfoManagePopup/InfoFormPopup.vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  import DisasterPoiHelper from '../../../util/DisasterPoiHelper'
  import HourRainPopup from "../InfoManagePopup/HourRainPopup.vue"
  import { createExcel } from "../../../util/InfoManageFunction"
  import ThresholdPopup from "../InfoManagePopup/ThresholdPopup.vue"
  import EditThresholdPopup from "../InfoManagePopup/EditThresholdPopup.vue"
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import { WaterloggingPoi, WaterloggingState } from '../../../interface/DisasterPoi'
  let AllData:any=[]
  @Component({
    components: {
      WaterloggingTable,
      ThresholdPopup,
      infoFormPopup,
      HourRainPopup,
      EditThresholdPopup,
      CommonNavMenu
    }
  })
  export default class WaterloggingInfo extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal
    REQUEST_TYPE: string = 'waterlog'
    waterlogging: string = 'waterlogging'
    activeIndex: string = 'waterloggingPoint'
    componentName:string='waterlogging'
    starttimeState: string = ''  //预警状态-开始时间
    endtimeState: string = '' //预警状态-结束时间
    reportTime: string = ''  //生成报告文档时间
    startTimeReport: string = '' //预警报告-开始时间
    endTimeReport: string = ''  //预警报告-结束时间
    warningReportRadio: string = '1'
    tableData: WaterloggingPoi[]| WaterloggingState[] = []
    deleteInfos: any = []
    YuZhiInfo: any = null
    thresholdPopupFlag: boolean = false
    EditThresholdPopupFlag:boolean=false
    hourRainInfo:any=null
    hourRainPopupFlag:boolean=false
    infoFormPopupFlag:boolean=false
    infoFormData:any=null
    thresholdData:any=null


    async mounted(): Promise<void> {
      this.getAllWaterloggingInfos();
      if(window.sessionStorage['userInfo']) {//页面刷新时获取已登录用户的信息
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
    }

    loadImageFile(file):void {
        let oFReader = new FileReader();
        let oFile:any = document.getElementById("file1");
        oFile=oFile.files[0];
        oFReader.readAsDataURL(oFile);
        oFReader.onload = (oFREvent)=> {};
      let fd = new FormData()
       fd.append('multipartFile', file)
       axios({
         method: 'post',
          url: 'http://10.148.83.86:8080/JYTY/waterlog/insertsexcel',
          timeout: 20000,
          data: fd
     }).then(res=>{
       console.log(res)
       }).catch(err=>{
         console.log(err)
       })
    }
    //文件导入成功
    loadSuccess(response, file, fileList) :void{
      console.log(response,file,fileList)
      if(response.result=="S_FAILED"){
        Vue['prototype']['$message']({ type: 'warning', message: '导入失败,不支持此类文件' })
      }else {
        Vue['prototype']['$message']({ type: 'success', message: '文件导入成功' })
      }
    }
    loadError(err, file, fileList):void{
      console.log(err,file,fileList)
      Vue['prototype']['$message']({ type: 'warning', message: '导入失败' })
    }

     //tab栏类型选择
    async handleSelect(key: string): Promise<void> {
      if(this.activeIndex === key) return;
      this.tableData = [];
      switch(key) {
        case 'waterloggingPoint':
          this.getAllWaterloggingInfos();
          break;
        case 'warningState':
          this.getAllWarningInfo();
          break;
        case 'warningReport':
          await this.getAllWaringReport()
          break;
      }
      this.activeIndex = key;
    }

     //添加内涝点
    async addWaterloggings(params): Promise<void> {
      let objWater: WaterloggingPoi = {
        cityid: 0,
        countyid: 0,
        townid: 0,
        lon:params.lon,
        lat: params.lat,
        address:params.address,
        ddatetime: "2017-11-10 10:00:00",
        detail: params.detail,
        manager: params.manager,
        cellphone: params.cellphone,
        name: '',
        threshold: ''
      };
      let disaHelper:any = new DisasterPoiHelper();
      let isAdded: boolean = await disaHelper.addDisasterPoi(this.REQUEST_TYPE, objWater);
      disaHelper = null;
      if(!isAdded)
        Vue['prototype']['$message']({ type: 'warning', message: '添加内涝点失败' })
      else {
        Vue['prototype']['$message']({ type: 'success', message: '添加内涝点成功' })
        this.getAllWaterloggingInfos();
      }
      this.infoPopupClose()
    }

    //编辑内涝点
    async editWaterLoggings(params:WaterloggingPoi): Promise<void>{
      let disaHelper:any = new DisasterPoiHelper();
      let isChanged: boolean = await disaHelper.modifyDisasterPoi(this.REQUEST_TYPE, params);
      if(isChanged) {
        this.$message({
          type: 'success',
          message: '编辑成功'
        });
        this.getAllWaterloggingInfos();
      } else {
        this.$message({
          type: 'warning',
          message: '编辑失败'
        });
      }
      disaHelper = null;
    }
     //获取所有内涝点数据
    async getAllWaterloggingInfos(): Promise<void> {
      let disaHelper:any = new DisasterPoiHelper();
      let data = await disaHelper.getDisasterInfo(this.REQUEST_TYPE);
      this.tableData = data;
      disaHelper = null;
    }

     //获取所有预警信息
    async getAllWarningInfo(): Promise<void> {
      let disaHelper:any = new DisasterPoiHelper();
      let data = await disaHelper.getAllDisasterWarning(this.REQUEST_TYPE);
      this.tableData = data;
      disaHelper = null;
    }

    //获取预警报告列表
    async getAllWaringReport(): Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      let res = await disasterPoiHelper.getAllWaringReport(this.REQUEST_TYPE)
      this.tableData=AllData=res
      disasterPoiHelper=null
    }

     //删除内涝点
    async deleteWaterloggings(id?: number): Promise<void> {
      let idArray:any = [];
      if(id!==-1) {
        idArray.push(id);
      } else {
        if(this.deleteInfos.length)
          idArray = this.deleteInfos.map((pt: WaterloggingPoi): any => pt.id);
      }
      if(idArray.length) {
        await Vue['prototype']['$confirm']('是否删除该信息?', '提示', { type: 'warning'});

        let disaHelper:any = new DisasterPoiHelper();
        let isDeleted: boolean = await disaHelper.deleteDisasterPoi(this.REQUEST_TYPE, idArray);
        if(isDeleted) {
          Vue['prototype']['$message']({
            duration: 1000,
            showClose: true,
            type: 'success',
            message: '删除成功'
          });
        } else {
          Vue['prototype']['$message']({
            duration: 1000,
            showClose: true,
            type: 'warning',
            message: '删除失败'
          });
        }
        this.getAllWaterloggingInfos();
        //disaHelper = null;
      }
    }


    //表格组件触发的事件
    //批量勾选删除
    handleSelectionChange(val: any): void {
      this.deleteInfos = val;
    }

    //单个勾选删除
    deleteRow(item: WaterloggingPoi): void {
      this.deleteWaterloggings(item.id);
    }

    //点击编辑内涝点
    async changeRow(poi: WaterloggingPoi): Promise<void> {
      console.log(poi)
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'edit',
        title:'编辑内涝点',
        className:'width600',
        ruleForm: poi,
        config:{
          name:{
            type:'input',
            label:'内涝点'
          },
          lat: {
            type:'input',
            label:'纬度'
          },
          lon: {
            type:'input',
            label:'经度'
          },
          manager: {
            type:'input',
            label:'负责人'
          },
          cellphone: {
            type:'input',
            label:'联系方式'
          },
          address:{
            type:'input',
            label:'地址'
          },
          detail: {
            type:'textarea',
            label:'详细'
          },
        },
        rules: {
          name: [
            { required: true, message: '请输入内涝点地址', trigger: 'blur' }
          ],
          lat: [
            { required: false, message: '', trigger: 'change' }
          ],
          lon: [
            { required: false, message: '', trigger: 'change' }
          ],
          manager: [
            { required: false, message: '请输入负责人', trigger: 'blur' }
          ],
          cellphone: [
            { required: false, message: '请输入负责人电话', trigger: 'blur' }
          ],
          address:[
            { required: false, message: '', trigger: 'change' }
          ],
          detail: [
            { required: false, message: '', trigger: 'change' }
          ],
        }
      }
    }

    //点击表格的阈值修改
    changeThreshold(params:any): void{
      if(!params.threshold){
        params.threshold= "{\"p3\":0,\"p2\":0,\"p1\":0,\"r1\":0,\"r2\":0,\"r3\":0}"
      }
      this.EditThresholdPopupFlag=true
      this.thresholdData={
        className:'width650',
        type:'内涝点',
        data:params,
      }
    }

    //获取阈值修改弹窗的数据
    getEditThresholdData(params:any): void{
      this.editWaterLoggings(params.data)
      this.closeThresholdPopup()
    }

    //点击关闭阈值修改弹窗
    closeThresholdPopup(): void{
      this.EditThresholdPopupFlag=false
    }

     //根据时间搜索预警信息
    async waringSearch(): Promise<void> {
      let disaHelper:any = new DisasterPoiHelper();
      if(!this.starttimeState&&!this.endtimeState) {
        this.getAllWarningInfo();
      }else {
        if(!this.starttimeState){
          let data: WaterloggingState[] = await disaHelper.getDisasterWarningByTime(this.REQUEST_TYPE, new Date('1970/1-1'), this.endtimeState);
          this.tableData = data;
        }else if(!this.endtimeState){
          let data:WaterloggingState[] = await disaHelper.getDisasterWarningByTime(this.REQUEST_TYPE, this.starttimeState, new Date());
          this.tableData = data;
        }else {
          let data:WaterloggingState[] = await disaHelper.getDisasterWarningByTime(this.REQUEST_TYPE, this.starttimeState, this.endtimeState);
          this.tableData = data;
        }
      }
      disaHelper = null;
    }

    //查看阈值信息
    showYuZhiInfo(par):void {
      this.YuZhiInfo = {
        type: '内涝点',
        value: par
      }
      this.thresholdPopupFlag = true;
    }

    //关闭阈值弹窗
    thresholdClose():void {
      this.thresholdPopupFlag = false;
    }

    //查看雨量信息
    showRainInfo(par):void{
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
        className:'width600',
        title:'新增内涝点',
        ruleForm: {
          name: '',
          lat: '',
          lon: '',
          manager: '',
          cellphone: '',
          address: '',
          detail: '',
          threshold:'{}'
        },
        config:{
          name:{
            type:'input',
            label:'内涝点'
          },
          lat: {
            type:'input',
            label:'纬度'
          },
          lon: {
            type:'input',
            label:'经度'
          },
          manager: {
            type:'input',
            label:'负责人'
          },
          cellphone: {
            type:'input',
            label:'联系方式'
          },
          address:{
            type:'input',
            label:'地址'
          },
          detail: {
            type:'textarea',
            label:'详细'
          },
        },
        rules: {
          name: [
            { required: true, message: '请输入内涝点地址', trigger: 'blur' }
          ],
          lat: [
            { required: false, message: '', trigger: 'change' }
          ],
          lon: [
            { required: false, message: '', trigger: 'change' }
          ],
          manager: [
            { required: false, message: '请输入负责人', trigger: 'blur' }
          ],
          cellphone: [
            { required: false, message: '请输入负责人电话', trigger: 'blur' }
          ],
          detail: [
            { required: false, message: '', trigger: 'change' }
          ],
          address: [
            { required: false, message: '', trigger: 'change' }
          ],
        }
      }
    }
    //关闭infoPopup弹窗
    infoPopupClose():void{
      this.infoFormPopupFlag=false
    }

    //获取infoPopup的数据
    getInfoFormData(params:any):void{
      switch (params.type){
        case 'add':
          this.addWaterloggings(params.ruleForm)
          break
        case 'edit':
          console.log(params.ruleForm)
          this.editWaterLoggings(params.ruleForm)
          this.infoPopupClose()
          break
      }
    }

    //查询报告
    searchWaringReport(): void{
      let arr:any=[]
      if(this.startTimeReport&&!this.endTimeReport){
        AllData.forEach(v=>{
          if(new Date(this.startTimeReport).getTime()<new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else if(!this.startTimeReport&&this.endTimeReport){
        AllData.forEach(v=>{
          if(new Date(this.endTimeReport).getTime()>new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else if(this.startTimeReport&&this.endTimeReport){
        AllData.forEach(v=>{
          if(new Date(this.startTimeReport).getTime()<new Date(v.dataTime).getTime()&&new Date(this.endTimeReport).getTime()>new Date(v.dataTime).getTime()){
            arr.push(v)
          }
        })
        this.tableData=arr
        arr=null
      }
      else {
        this.tableData=AllData
      }
    }
    //导出当前表格数据到excel文件
    createExcel(){
      let title=moment(new Date()).format('YYYY-MM-DD HH:mm')+'内涝点'
      createExcel(this.tableData,InfoManageTableType['waterloggingPoint'],title)
    }
  }
</script>

<style lang="scss" scoped>
  #waterlogging{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    min-height: 100%;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    .waterlogging_main{
      padding-left: 40px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .warningReport_search_title{
      overflow: hidden;
    }
      .warningReport_search{
      overflow: hidden;
      padding: 10px 0px;
      line-height: 40px;
      height: 40px;
      .warningReport_margin{
        margin-right: 30px;
      }
      .warningReport_float{
        float: left;
      }
      .warningReport-picker_text1{
        padding: 0px 10px;
      }
      .warningReport-picker_text2{
        margin-right: 10px;
        line-height: 40px;
      }
      .warningReport_picker{
        width: 200px;
        height: 40px;
        font-size: 12px;
        color: #677888;
      }
      .warningReport_btns{
        width: 100px;
        height: 30px;
        line-height: 29px;
        padding: 0;
        margin-top:5px;
      }
      .warningReport_line{
        display: inline-block;
        width: 1px;
        height: 40px;
        background: #D1D4DB;
        margin: 0 20px;
      }
      .warningReport_radio{
        margin-left: 20px;
        margin-top: 12px;
      }
    }
      .warningReport_title{
        font-size: 14px;
        color: #66798A;
    }
      .waterlogging_table{
        margin-top: 15px;
        overflow: hidden;
        padding:0px 40px 0px 0px;
    }
      .warningState_search{
        padding-top: 15px;
        line-height: 40px;
        height: 40px;
        overflow: hidden;
        .mountainTorrents_select{
          width: 150px;
          height: 40px;
          float: left;
        }
        .pinck_text{
          float: left;
          padding: 0px 15px;
        }
        .torren_search{
          float: left;
          padding: 0px 15px;
          height: 30px;
          line-height: 29px;
          margin-top: 5px;
        }
      }
    }
  }
  /*//删除导入按钮样式*/
  .WaterloggingPoint_btns{
      height:30px;
      padding-top: 20px;
      padding-bottom: 5px;
      button{
        width: 100px;
        height: 30px;
        border: none;
        outline: none;
        float: left;
        margin-right: 20px;
        cursor: pointer;
        line-height: 28px;
        font-size: 14px;
        border-radius: 2px;/*no*/
        overflow: hidden;
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
        line-height: 29px;
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
        position: relative;
        line-height: 27px;
        .file{
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
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
</style>
