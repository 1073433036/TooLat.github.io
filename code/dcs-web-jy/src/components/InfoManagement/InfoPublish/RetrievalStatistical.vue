<template>
  <main id="RetrievalStatistical">
    <header class="RetSta_header">
      <el-select v-model="queryCondition.typeWarn"
                 class="RetSta_select"
                 clearable
                 placeholder="预警类型">
        <el-option
          v-for="item in eventTypes.types"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <!--<el-select v-model="queryCondition.level"
                 class="RetSta_select"
                 clearable
                 placeholder="预警级别">
        <el-option
          v-for="(item,key) in eventTypes.levels"
          :key="key"
          :label="item"
          :value="item">
        </el-option>
      </el-select>-->
      <el-date-picker
        class="RetSta_picker"
        v-model="queryCondition.starttime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <span class="RetSta_line">~</span>
      <el-date-picker
        class="RetSta_picker RetSta_picker_marLeft"
        v-model="queryCondition.endtime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <el-select v-model="queryCondition.channel"
                 class="RetSta_select"
                 clearable
                 placeholder="发布渠道">
        <el-option
          v-for="item in PublishChannels"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="RetStaBtn">
        <button class="infoManageBtn infoManageBtn_add" @click="clickSearch('查询')">查询</button>
      </div>
      <div class="DisasterRelief_search_box">
        <input type="text" class="DisasterRelief_search_input" placeholder="请输入" v-model="searchValue">
        <span class="DisasterRelief_search_btn" @click="clickSearch('搜索')">
            <i></i>
        </span>
      </div>
      <!--<span class="resize">重置</span>-->
    </header>
    <section class="RetSta_main">
      <h6 class="RetSta_Title">统计列表</h6>
      <main class="RetSta_table">
        <el-table
          :data="currentData"
          :height="tableHeight"
          stripe
          header-cell-class-name="tableHeader"
          border
          style="width: 100%">
          <el-table-column
            type="selection"
            width="20"></el-table-column>
          <el-table-column
            v-for="(item,key) in tableType"
            :key="key"
            :prop="item.prop"
            :label="item.label"
            :align="item.align"
            :min-width="item.width">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="100"
            align="center"
            label="发布渠道">
            <template slot-scope="scope">
              {{scope.row.web?publishChannel.web:''}}
              {{scope.row.wechat?publishChannel.wechat:''}}
              {{scope.row.pNote?publishChannel.pNote:''}}
              {{scope.row.nNote?publishChannel.nNote:''}}
              {{scope.row.website?publishChannel.website:''}}
              {{scope.row.ftp?publishChannel.ftp:''}}
              {{scope.row.fax?publishChannel.fax:''}}
            </template>
          </el-table-column>
        </el-table>
        <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
      </main>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import infoPublishHttp from "../../../util/InfoPublishHttp"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  let InfoPublishHttp = new infoPublishHttp()
  @Component({
    components:{
      CommonPagination
    }
  })
  export default class RetrievalStatistical extends Vue {
    tableType:any=InfoManageTableType['waringEntry']
    tableData:any[]=[]
    currentData:any[]=[]
    tableHeight:number=300
    eventTypes:{types:string[],levels:string[]}={types:[], levels:[]}
    PublishChannels:{value:string,label:string}[]=[
      {
        value:'web',
        label:'微博'
      },
      {
        value:'wechat',
        label:'微信'
      },
      {
        value:'p_note',
        label:'省突'
      },
      {
        value:'n_note',
        label:'本地短信'
      },
      {
        value:'ftp',
        label:'FTP'
      },
      {
        value:'faxes',
        label:'传真'
      },
    ]
    searchTime:{startTime:string,endTime:string}={startTime:'',endTime:''}
    searchValue:string=''
    publishChannel:any={
      web:'微博',
      wechat:'微信',
      pNote:'省突',
      nNote:'本地短信',
      website:'网站',
      ftp:'FTP',
      fax:'传真',
    }
    queryCondition:{ typeWarn?:string, level?:string, starttime?:string, endtime?:string, channel?:string }={
      typeWarn:'',
      level:'',
      starttime:'',
      endtime:'',
      channel:''
    }
    //获取当前页数数据
    getCurrentData(params:any){
      this.currentData=params
    }
    //点击搜索
    async clickSearch(par:string){
      if(par==='查询'){
        this.queryCondition.starttime=this.queryCondition.starttime?moment(this.queryCondition.starttime).format('YYYY-MM-DD HH:mm:00'):''
        this.queryCondition.endtime=this.queryCondition.endtime?moment(this.queryCondition.endtime).format('YYYY-MM-DD HH:mm:00'):''
        console.log(this.queryCondition)
        this.tableData=await InfoPublishHttp.getMsgByCondition(this.queryCondition)
      }
      if(par=='搜索'){
        if(!this.searchValue)return
        this.tableData=await InfoPublishHttp.getWaringFormBySearch(this.searchValue)
      }
    }
    async initQueryCondition() {
      let res = await InfoPublishHttp.getTemplateDetails()
      res.forEach(v => {
        this.eventTypes.types.push(v.eventType)
      })
      let res_ = await InfoPublishHttp.getWarningLevel(this.eventTypes.types[0])
      res_.forEach(v => {
        this.eventTypes.levels.push(v.colour)
      })
    }
    async mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(440)
      })
      this.tableData=await InfoPublishHttp.getMsgByCondition(this.queryCondition)
      this.initQueryCondition()
    }
  }
</script>

<style lang="scss" scoped>
#RetrievalStatistical{
  background: white;
  box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px 40px;
  .RetSta_header{
    height: 40px;
    margin-bottom: 10px;
    .RetSta_select{
      float: left;
      width: 150px;
      margin-right: 30px;
    }
    .RetSta_picker{
      float: left;
      width: 150px;
    }
    .RetSta_picker_marLeft{
      margin-right: 30px;
    }
    .RetSta_line{
      float: left;
      margin: 0 10px;
      line-height: 40px;
    }
    .DisasterRelief_search_box{
      width: 200px;
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
    .RetStaBtn{
      height: 30px;
      padding: 5px 0px;
      float: left;
      margin-right: 30px;
      overflow: hidden;
    }
    .resize{
      float: left;
      padding: 5px 0px;
      height: 30px;
      margin-left: 10px;
      color: #11A9F5;
      line-height: 30px;
      width: 60px;
      text-align: center;
      cursor: pointer;
    }
  }
  .RetSta_main{
    .RetSta_Title{
      height: 36px;
      line-height: 36px;
      font-size: 14px;/*no*/
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

}
</style>
