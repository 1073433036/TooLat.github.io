<template>
  <main id="mountainTorrents">
    <div>
      <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
      <div class="mountainTorrents_search_1" v-if="activeIndex=='mountainTorrentsPoint'">
        <span class="checkbox_text">站点类型</span>
       <!-- <el-checkbox-group v-model="stationType" class="checkbox_list" >
          <el-checkbox label="reservoir">水库站</el-checkbox>
          <el-checkbox label="river">河道站</el-checkbox>
        </el-checkbox-group>-->
        <el-radio-group class="checkbox_list"  v-model="stationType">
          <el-radio label="reservoir">水库站</el-radio>
          <el-radio label="river">河道站</el-radio>
        </el-radio-group>
        <span class="checkbox_text">水势</span>
        <el-checkbox-group class="checkbox_list" v-model="waterFlow">
          <el-checkbox label="rose">涨</el-checkbox>
          <el-checkbox label="flat">平</el-checkbox>
          <el-checkbox label="fall">落</el-checkbox>
        </el-checkbox-group>
        <div class="DisasterRelief_search_box">
          <input type="text" class="DisasterRelief_search_input"
                 @keyup.enter="clickSearchBtn"
                 placeholder="搜索"
                 v-model="searchValue">
          <span class="DisasterRelief_search_btn" @click="clickSearchBtn">
            <i></i>
          </span>
        </div>
      </div>
      <div class="mountainTorrents_search_2" v-if="activeIndex=='mountainTorrentsState'">
        <el-date-picker
          v-model="startTime1"
          class="mountainTorrents_select "
          type="date"
          format="yyyy-MM-dd"
          placeholder="预警起始时间">
        </el-date-picker>
        <span class="pinck_text">~</span>
        <el-date-picker
          v-model="endTime1"
          type="date"
          format="yyyy-MM-dd"
          class="mountainTorrents_select "
          placeholder="预警终止时间">
        </el-date-picker>
        <el-button type="primary"
                   class="torren_search"
                   @click="waringSearch"
                   style="margin-left: 30px"
                   icon="el-icon-search">查询</el-button>
      </div>
      <div class="mountainTorrents_search_3" v-if="activeIndex=='mountainTorrentsReport'">
        <el-date-picker
          v-model="startTimeReport"
          class="mountainTorrents_select"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          placeholder="预警起始时间">
        </el-date-picker>
        <span class="pinck_text">~</span>
        <el-date-picker
          v-model="endTimeReport"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          class="mountainTorrents_select "
          placeholder="预警终止时间">
        </el-date-picker>
        <el-button type="primary"
                   class="torren_search"
                   style="margin-left: 30px" icon="el-icon-search" @click="searchWaringReport">查询</el-button>
       <!-- <span class="pinck_line"></span>
        <el-date-picker
          v-model="endTime3"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          class="mountainTorrents_select  mountainTorrents_prick"
          placeholder="时间">
        </el-date-picker>
        <el-button type="primary" class="torren_search">生成报告</el-button>-->
      </div>
    </div>
    <section class="mountainTorrents_table">
      <mountainTorrentsTable :tableType="tableType"
                             @handleSelectionChange="deleteSelectInfo"
                             @changeRow="changeGeologicInfo"
                             :tableData="tableData">
      </mountainTorrentsTable>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Getter } from 'vuex-class'
  import Region from '../../../interface/Region'
  import { Component,Watch } from 'vue-property-decorator'
  import mountainTorrentsTable from './MountainTorrentTable.vue'
  import LoadingPopup from '../InfoManagePopup/LoadingPopup.vue'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import DisasterPoiHelper from '../../../util/DisasterPoiHelper'
  import {TorrentReservoirPoi, TorrentRiverPoi, TorrentWarningState } from '../../../interface/DisasterPoi'
  import {getReservoirInfo, getRiverInfo, getReservoirInfo_, getRiverInfo_} from "../../../util/InfoManageHttp"
  let AllData:any[]=[]
  let stationData:any=null//书库数据 河流数据
  @Component({
    components: {
      mountainTorrentsTable,
      LoadingPopup,
      CommonNavMenu,
    }
  })
  export default class MountainTorrents extends Vue {
    @Getter('systemStore/region_global') regionGlobal
    REQUEST_TYPE:string='torrent'
    activeIndex:string='mountainTorrentsPoint'
    componentName:string='mountainTorrents'
    stationType:string='reservoir'
    waterFlow:Array<any>=[]
    searchValue:string=''
    startTime1:string=''
    endTime1:string=''
    startTimeReport:string=''
    endTimeReport:string=''
    endTime3:string=''
    tableData:any=[]
    tableType:string='reservoirTable'
    @Watch('stationType')
    changestationType(val):void{
      AllData=this.tableData=stationData[val]
      this.tableType=val
      this.shaixuanData(this.waterFlow)
    }
    @Watch('waterFlow')
    changewaterFlow(val):void{
      this.shaixuanData(val)
    }
    //tab栏类型选择
    async handleSelect(key:string):Promise<void>{
      if(this.activeIndex===key)return
      this.activeIndex=key
      switch(key){
        case 'mountainTorrentsPoint':
          await this.getData()
          AllData=this.tableData=stationData[this.stationType]
          this.shaixuanData(this.waterFlow)
          this.tableType=this.stationType
          break
        case 'mountainTorrentsState':
          this.tableData=[]
          await this.getWaringInfo()
          this.tableType='mountainTorrentsState'
          break
        case 'mountainTorrentsReport':
          await this.getAllWaringReport()
          this.tableType='mountainTorrentsReport'
          break
      }
    }
    //点击水库或者河道站搜索
    clickSearchBtn():void{
      let arr_:any=[]
      switch(this.activeIndex){
        case 'mountainTorrentsPoint':
          let rage = new RegExp(this.searchValue)
          AllData.forEach((v)=>{
            if(this.stationType=='reservoir'){
              if(rage.test(v.VF01015_CN)){
                arr_.push(v)
              }
            }
            if(this.stationType=='river'){
              if(rage.test(v.RIVER)){
                arr_.push(v)
              }
            }
          })
          this.tableData=arr_
          break
        case 'mountainTorrentsState':
          break
        case 'mountainTorrentsReport':
          break
      }
      arr_=null
    }
    //勾选的隐患点选项
    deleteSelectInfo(val):void{

    }
    //编辑隐患点
    changeGeologicInfo(val):void{

    }

    //获取水库河流站点信息
    async getData():Promise<void>{
      let time=new Date().getTime()
      let params={
        start:moment(new Date(time-1000*60*60)).format('YYYY-MM-DD HH:00:00'),
        end:moment(new Date(time)).format('YYYY-MM-DD HH:00:00')
      }
      let res1 =await getReservoirInfo()//水库
      let res2 = await getRiverInfo()//河流
      let idsAlert1:any={}
      let idsAlert2:any={}
      res1.forEach(v=>{
        let key = v.id
        idsAlert1[key]=v.alertlevel
        key=null
      })
      res2.forEach(v=>{
        let key = v.id
        idsAlert2[key]=v.alertlevel
        key=null
      })
      let res1_ = await getReservoirInfo_(params)
      let res2_ = await getRiverInfo_(params)
      res1_.forEach(v=>{
        v.alertlevel=idsAlert1[v.V01301]?idsAlert1[v.V01301]:null
      })
      res2_.forEach(v=>{
        v.alertlevel=idsAlert2[v.STACODE]?idsAlert2[v.STACODE]:null
      })
      stationData={
        reservoir:res1_,
        river:res2_
      }
      AllData=this.tableData=res1_
      this.tableType='reservoir'
    }

    //获取预警信息
    async getWaringInfo():Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      let res = await disasterPoiHelper.getAllDisasterWarning(this.REQUEST_TYPE)
      this.tableData=AllData=res.filter(v=>{
        return v['city'].indexOf(this.regionGlobal.cityName)!==-1
      })
      disasterPoiHelper=null
    }

    //获取预警报告列表
    async getAllWaringReport():Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      let res = await disasterPoiHelper.getAllWaringReport(this.REQUEST_TYPE)
      this.tableData=AllData=res
      disasterPoiHelper=null
    }

    //根据时间搜索预警信息
    async waringSearch():Promise<void>{
      let disasterPoiHelper:any= new DisasterPoiHelper()
      if(!this.startTime1&&!this.endTime1){
        if(this.tableData.length==0&&!this.startTime1&&!this.endTime1){
          await this.getWaringInfo()
        }
      }
      else{
        let startTime:any,endTime:any
        if(!this.startTime1){
          startTime=new Date('1970/1/1')
          endTime=this.endTime1
        }else if(!this.endTime1){
          startTime=this.startTime1
          endTime=new Date()
        }else{
          startTime=this.startTime1
          endTime=this.endTime1
        }
        let res = await disasterPoiHelper.getDisasterWarningByTime(this.REQUEST_TYPE,startTime,endTime)
        this.tableData=res.filter(v=>{
          return v['city'].indexOf(this.regionGlobal.cityName)!==-1
        })
        disasterPoiHelper=null
      }
    }

    //根据涨落平按钮删选数据
    shaixuanData(params:any[]):void{
      if(params.length==0){
        this.tableData=AllData
      }else{
        this.tableData=[]
        params.forEach(v=>{
          switch (v){
            case 'rose'://涨
              AllData.forEach(k=>{
                if(k.Differ>0){
                  this.tableData.push(k)
                }
              })
              break
            case 'flat'://平
              AllData.forEach(k=>{
                if(k.Differ==0){
                  this.tableData.push(k)
                }
              })
              break
            case 'fall'://落
              AllData.forEach(k=>{
                if(k.Differ<0){
                  this.tableData.push(k)
                }
              })
              break
          }
        })
      }
    }

    //查询报告
    searchWaringReport():void{
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

    async mounted():Promise<void>{
      this.getData()
    }

  }
</script>

<style lang="scss" scoped>
  #mountainTorrents{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    min-height: 100%;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    .mountainTorrents_search_1{
      font-size: 12px;
      padding-left: 40px;
      height: 40px;
      margin-top: 15px;
      .checkbox_text{
        float: left;
        line-height: 40px;
        margin-right: 25px;
      }
      .checkbox_list{
        float: left;
        margin-right: 70px;
        line-height: 40px;
        label{
          line-height: 40px;
        }
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
          transition: all .3s;
          i{
            transition: all .3s;
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
    .mountainTorrents_search_2{
      height: 40px;
      padding-left: 40px;
      padding-top: 10px;
      .mountainTorrents_select{
        height: 40px;
        width: 200px;
        float: left;
      }
      .pinck_text{
        line-height: 40px;
        padding: 0 10px;
        float: left;
      }
      .torren_search{
        height: 30px;
        line-height: 29px;
        padding: 0px 15px;
        margin-top: 5px;
        float: left;
      }
    }
    .mountainTorrents_search_3{
      overflow: hidden;
      padding-left: 40px;
      padding-top: 10px;
      .mountainTorrents_select{
        height: 40px;
        width: 200px;
        float: left;
      }
      .pinck_text{
    line-height: 40px;
    padding: 0 10px;
    float: left;
  }
      .mountainTorrents_prick{
        margin-right: 40px;
      }
      .pinck_line{
        float: left;
        height: 40px;
        width: 1px;
        background-color: #D2D4DB;
        margin: 0px 40px;
      }
      .torren_search{
        height: 30px;
        line-height: 29px;
        padding: 0px 15px;
        margin-top: 5px;
        float: left;
      }
    }
    .mountainTorrents_table{
      margin-top: 15px;
      padding: 0px 40px;
    }
  }
</style>
