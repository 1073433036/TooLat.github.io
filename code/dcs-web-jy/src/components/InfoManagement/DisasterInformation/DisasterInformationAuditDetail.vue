<template>
  <main id="DisasterInformationAuditDetail">
    <header class="AuditDetail_title" @click="goBackAuditTable"><span>返回</span></header>
    <section class="AuditDetail_main">
      <div class="basicInfo" v-if="disasterBasicInfo">
        <header class="infoTitle">灾情基本信息</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in disasterBasicInfoList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR" v-if="item.label!=='fileName'">
                {{disasterBasicInfo[item.label]?disasterBasicInfo[item.label]:'--'}}
              </span>
              <div class="textR" v-if="item.label==='fileName'">
                <div class="textFileName"
                     v-for="(fileT,key2) in disasterBasicInfo[item.label]" :key="key2">
                  <span>{{fileT.replace('/disareport/','')}}</span>
                  <a :href="fileRootUrl+disasterBasicInfo.sourcePath[key2]"
                     style="color: #11a9f5" download>下载</a>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div class="basicLoss" v-if="basicLoss">
        <header class="infoTitle">灾情基本损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in basicLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{basicLoss[item.label]?basicLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="hydrologyLoss" v-if="hydrologyLoss">
        <header class="infoTitle">水文水利损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in hydrologyLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{hydrologyLoss[item.label]?hydrologyLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="agricultureLoss" v-if="agricultureLoss">
        <header class="infoTitle">农业损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in agricultureLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{agricultureLoss[item.label]?agricultureLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="forestryLoss" v-if="forestryLoss">
        <header class="infoTitle">林业损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in forestryLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{forestryLoss[item.label]?forestryLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="fisheryLoss" v-if="fisheryLoss">
        <header class="infoTitle">渔业损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in fisheryLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{fisheryLoss[item.label]?fisheryLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="electricityLoss" v-if="electricityLoss">
        <header class="infoTitle">电力损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in electricityLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{electricityLoss[item.label]?electricityLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="communicationLoss" v-if="communicationLoss">
        <header class="infoTitle">通讯损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in communicationLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{communicationLoss[item.label]?communicationLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="animalsLoss" v-if="animalsLoss">
        <header class="infoTitle">畜牧业损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in animalsLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{animalsLoss[item.label]?animalsLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="trafficLoss" v-if="trafficLoss">
        <header class="infoTitle">交通损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in trafficLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{trafficLoss[item.label]?trafficLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="businessLoss" v-if="businessLoss">
        <header class="infoTitle">商业损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in businessLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{businessLoss[item.label]?businessLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="othersLoss" v-if="othersLoss">
        <header class="infoTitle">其他损失</header>
        <section class="infoConten">
          <ul>
            <li v-for="(item,key) in othersLossList" :key="key" :class="item.classNmae">
              <span class="textL">{{item.name}}：</span>
              <span class="textR">{{othersLoss[item.label]?othersLoss[item.label]:'--'}}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="AuditInforbtn">
        <div v-show="this.auditStatus=='notAudit'">
          <el-button
            class="AuditInforbtn_1"
            type="primary"
            plain
            size="mini" @click="clickAudit(true)">通过</el-button>
          <el-button type="danger" plain size="mini" @click="clickAudit(false)">不通过</el-button>
        </div>
        <div v-show="this.auditStatus==='Audit'">
          <span class="AuditInforbtn_1">审核通过</span>
        </div>
        <div v-show="this.auditStatus==='noPass'">
          <span class="AuditInforbtn_1">审核不通过</span>
        </div>
      </div>
    </section>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Getter,Action } from 'vuex-class'
  import { Component,Prop } from 'vue-property-decorator'
  import Disaster from '../../../interface/Disaster'
  interface detailLis {
    name:string,
    label:string,
    classNmae:string,
  }
  @Component({
    components:{

    }
  })
  export default class AuditDetail extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal
    fileRootUrl:string='http://10.148.83.86:8080'
    auditStatus:string=''
    detailInfoData:any={}
    disasterBasicInfoList:detailLis[]=[
      {
        name:'灾害类型',
        label:'disaster',
        classNmae:'width50',
      },
      {
        name:'二级灾害',
        label:'secondDisaster',
        classNmae:'width50',
      },
      {
        name:'发生时间',
        label:'starttime',
        classNmae:'width50',
      },
      {
        name:'结束时间',
        label:'endtime',
        classNmae:'width50',
      },
      {
        name:'采集来源',
        label:'origin',
        classNmae:'width50',
      },
      {
        name:'经济损失',
        label:'economyLoss',
        classNmae:'width50',
      },
      {
        name:'死亡人数',
        label:'injuryPerson',
        classNmae:'width50',
      },
      {
        name:'上报单位',
        label:'releaseUnit',
        classNmae:'width50',
      },
      {
        name:'上报时间',
        label:'releaseTime',
        classNmae:'width50',
      },
      {
        name:'上报人',
        label:'reportMan',
        classNmae:'width50',
      },
      {
        name:'联系电话',
        label:'phone',
        classNmae:'width50',
      },
      {
        name:'灾情状态',
        label:'disasterStatus',
        classNmae:'width50',
      },
      {
        name:'上传附件',
        label:'fileName',
        classNmae:'width100',
      },
      {
        name:'灾情概述',
        label:'remarks',
        classNmae:'width100',
      },
      {
        name:'灾害影响描述',
        label:'influenceDesc',
        classNmae:'width100',
      },
      {
        name:'天气概况描述',
        label:'weatherDesc',
        classNmae:'width100',
      },
      {
        name:'预警发布描述',
        label:'warningsignDesc',
        classNmae:'width100',
      },
      ]
    disasterBasicInfo:{disaster:any,
      secondDisaster:any,
      starttime:any,
      endtime:any,
      origin:any,
      economyLoss:any,
      releaseUnit:any,
      releaseTime:any,
      reportMan:any,
      phone:any,
      disasterStatus:any,
      remarks:any,
      influenceDesc:any,
      weatherDesc:any,
      warningsignDesc:any,
      injuryPerson:any,
      fileName:any,
      sourcePath:any}|null=null
    basicLossList: detailLis[]=[
      {
        name:'受灾总人数',
        label:'bruiseNumber',
        classNmae:'width50',
      },
      {
        name:'受伤人数',
        label:'disasterAllNumber',
        classNmae:'width50',
      },
      {
        name:'死亡人数',
        label:'dieNumber',
        classNmae:'width50',
      },
      {
        name:'失踪人数',
        label:'missingNumber',
        classNmae:'width50',
      },
      {
        name:'安置转移人数',
        label:'moveNumber',
        classNmae:'width50',
      },
      {
        name:'饮水困难',
        label:'noWaterNumber',
        classNmae:'width50',
      },
      {
        name:'倒塌房屋数',
        label:'housesCollapsedNum',
        classNmae:'width50',
      },
      {
        name:'损坏房屋数',
        label:'damageHouseNum',
        classNmae:'width50',
      },
      {
        name:'停课学校数',
        label:'closeSchoolNumber',
        classNmae:'width50',
      },
      {
        name:'停产工厂数',
        label:'closeFactoryNumber',
        classNmae:'width50',
      }
    ]
    basicLoss:any=null
    hydrologyLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'死水位以下水库数',
        label:'dieUnWatResNum',
        classNmae:'width50',
      },
      {
        name:'损毁大型水库数',
        label:'breBigResNum',
        classNmae:'width50',
      },
      {
        name:'水库塘堰干涸',
        label:'driRivRes',
        classNmae:'width50',
      },
      {
        name:'损毁中型水库数',
        label:'breMidResNum',
        classNmae:'width50',
      },
      {
        name:'提拔决口数',
        label:'breProNum',
        classNmae:'width50',
      },
      {
        name:'损毁小型水库数',
        label:'breSmaResNum',
        classNmae:'width50',
      },
      {
        name:'损毁河堤长度',
        label:'damRivLeng',
        classNmae:'width50',
      },
      {
        name:'损毁沟渠长度',
        label:'damDreLeng',
        classNmae:'width50',
      },
      {
        name:'损毁桥梁数',
        label:'damBriNum',
        classNmae:'width50',
      },
      {
        name:'供水管网损毁长度',
        label:'supNetDamWatLen',
        classNmae:'width50',
      },
      {
        name:'水文情况描述',
        label:'hyConDes',
        classNmae:'width100',
      },
    ]
    hydrologyLoss:any=null
    agricultureLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'受灾面积',
        label:'damArea',
        classNmae:'width50',
      },
      {
        name:'成灾面积',
        label:'InuArea',
        classNmae:'width50',
      },
      {
        name:'绝收面积',
        label:'cropArea',
        classNmae:'width50',
      },
      {
        name:'损失粮食',
        label:'LosGrain',
        classNmae:'width50',
      },
      {
        name:'损坏大棚',
        label:'DamGreenhouse',
        classNmae:'width50',
      },
      {
        name:'受灾作物名称',
        label:'affCropName',
        classNmae:'width100',
      },
    ]
    agricultureLoss:any=null
    forestryLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'林木损失数',
        label:'forLoss',
        classNmae:'width50',
      },
      {
        name:'林业受灾面积',
        label:'forAffArea',
        classNmae:'width50',
      },
    ]
    forestryLoss:any=null
    fisheryLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'捕捞船只翻船数',
        label:'fisBoaCapNum',
        classNmae:'width50',
      },
      {
        name:'捕捞船只翻船总吨数',
        label:'fisBoaCapTon',
        classNmae:'width50',
      },
      {
        name:'渔业受灾面积',
        label:'FisAffArea',
        classNmae:'width50',
      },
    ]
    fisheryLoss:any=null
    electricityLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'倒断电杆数',
        label:'PouBroPole',
        classNmae:'width50',
      },
      {
        name:'倒断电塔数',
        label:'invPowTowerNum',
        classNmae:'width50',
      },
      {
        name:'电力线路损毁长度',
        label:'PowLinDamLeng',
        classNmae:'width50',
      },
      {
        name:'电力中断时长',
        label:'powIntTime',
        classNmae:'width50',
      },
      {
        name:'停电用户数',
        label:'PowUsers',
        classNmae:'width50',
      },
    ]
    electricityLoss:any=null
    communicationLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'通信中断数',
        label:'ComIntNum',
        classNmae:'width50',
      },
      {
        name:'通信中断时长',
        label:'comIntTime',
        classNmae:'width50',
      },
    ]
    communicationLoss:any=null
    animalsLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'牧草受灾面积',
        label:'GraAffArea',
        classNmae:'width50',
      },
      {
        name:'饮水困难牲畜数',
        label:'DriWatLivTocNum',
        classNmae:'width50',
      },
      {
        name:'死亡大牲畜数',
        label:'newPigKilAniNum',
        classNmae:'width50',
      },
      {
        name:'受灾大牲畜数',
        label:'newPigAffNum',
        classNmae:'width50',
      },
      {
        name:'死亡家禽数',
        label:'deadPoulNum',
        classNmae:'width50',
      },
      {
        name:'影响牧草名称',
        label:'infHerName',
        classNmae:'width100',
      },
    ]
    animalsLoss:any=null
    trafficLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'道路堵塞或封闭数',
        label:'closedRoadCongestion',
        classNmae:'width50',
      },
      {
        name:'桥梁涵洞损坏数',
        label:'DamBriCul',
        classNmae:'width50',
      },
      {
        name:'公路中断数',
        label:'higIntNum',
        classNmae:'width50',
      },
      {
        name:'铁路中断数',
        label:'RailroadsNum',
        classNmae:'width50',
      },
      {
        name:'公路中断长度',
        label:'HigIntLength',
        classNmae:'width50',
      },
      {
        name:'铁路中断长度',
        label:'RailroadsLength',
        classNmae:'width50',
      },
      {
        name:'飞机航班延误数',
        label:'planeFlightNum',
        classNmae:'width50',
      },
      {
        name:'飞机航班取消数',
        label:'AirFlightCancell',
        classNmae:'width50',
      },
      {
        name:'运输船只翻沉数',
        label:'shipmentBeforehand',
        classNmae:'width50',
      },
      {
        name:'交通工具损坏数',
        label:'transportationDamage',
        classNmae:'width50',
      },
      {
        name:'交通停运时间',
        label:'trafficStoppageTime',
        classNmae:'width50',
      },
    ]
    trafficLoss:any=null
    businessLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'停业商店数',
        label:'shopClosedNum',
        classNmae:'width50',
      },
    ]
    businessLoss:any=null
    othersLossList:detailLis[]=[
      {
        name:'经济损失',
        label:'maneyLoss',
        classNmae:'width50',
      },
      {
        name:'其他行业影响',
        label:'otherLoss',
        classNmae:'width50',
      },
    ]
    othersLoss:any=null
    @Prop()
    detailInfo
    @Prop()
    ClickAudit
    //返回灾情列表
    goBackAuditTable(){
      this.$emit('goBackAuditTable','')
    }

    //点击审核操作
    clickAudit(par:boolean){
      if(!this.userInfo_global.roles.d_r_audit){
        this.$message.warning('没有权限审核')
        return
      }
      this.ClickAudit(this.detailInfo['detail'],par)
      if(par){
        this.auditStatus='Audit'
      }else {
        this.auditStatus='noPass'
      }
    }

    //获取各类损失的数据
    changedetailInfoData(){
      this.auditStatus=this.detailInfo.type
      this.detailInfoData=this.detailInfo.detail
      this.disasterBasicInfo={
        disaster:this.detailInfoData.disaster,
        secondDisaster:this.detailInfoData.secondDisaster,
        starttime:this.detailInfoData.starttime,
        endtime:this.detailInfoData.endtime,
        origin:this.detailInfoData.origin,
        economyLoss:this.detailInfoData.economyLoss?this.detailInfoData.economyLoss+'万元':'',
        releaseUnit:this.detailInfoData.releaseUnit,
        releaseTime:this.detailInfoData.releaseTime,
        reportMan:this.detailInfoData.reportMan,
        phone:this.detailInfoData.phone,
        disasterStatus:this.detailInfoData.disasterStatus,
        remarks:this.detailInfoData.remarks,
        influenceDesc:this.detailInfoData.influenceDesc,
        weatherDesc:this.detailInfoData.weatherDesc,
        warningsignDesc:this.detailInfoData.warningsignDesc,
        injuryPerson:this.detailInfoData['injuryPerson'],
        fileName:this.detailInfoData.sourceName?this.detailInfoData.sourceName.split(','):'',
        sourcePath:this.detailInfoData.sourcePath==''?[]:JSON.parse(this.detailInfoData['sourcePath'])
      }

      //基本损失
      this.basicLoss=this.detailInfoData.basicLoss==''?null:JSON.parse(this.detailInfoData.basicLoss)
      if(this.basicLoss){
        for(let key in this.basicLoss){
          switch (key){
            case 'disasterAllNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'bruiseNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'dieNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'missingNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'moveNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'noWaterNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'人':'--'
              break
            case 'housesCollapsedNum':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'间':'--'
              break
            case 'damageHouseNum':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'间':'--'
              break
            case 'closeSchoolNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'间':'--'
              break
            case 'closeFactoryNumber':
              this.basicLoss[key]=this.basicLoss[key]?this.basicLoss[key]+'间':'--'
              break
          }
        }
      }
      //水文水利损失
      this.hydrologyLoss=this.detailInfoData.hydrologyLoss==''?null:JSON.parse(this.detailInfoData.hydrologyLoss)
      if(this.hydrologyLoss){
        for( let key in this.hydrologyLoss){
          switch (key){
            case 'maneyLoss':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'万元':'--'
              break
            case 'dieUnWatResNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'breBigResNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'driRivRes':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'breMidResNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'breProNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'breSmaResNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'damRivLeng':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'米':'--'
              break
            case 'damDreLeng':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'米':'--'
              break
            case 'damBriNum':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'座':'--'
              break
            case 'supNetDamWatLen':
              this.hydrologyLoss[key]=this.hydrologyLoss[key]?this.hydrologyLoss[key]+'米':'--'
              break
          }
        }
      }
      //农业损失
      this.agricultureLoss=this.detailInfoData.agricultureLoss==''?null:JSON.parse(this.detailInfoData.agricultureLoss)
      if(this.agricultureLoss){
        for( let key in this.agricultureLoss){
          switch (key){
            case 'maneyLoss':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'万元':'--'
              break
            case 'damArea':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'公顷':'--'
              break
            case 'InuArea':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'公顷':'--'
              break
            case 'cropArea':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'公顷':'--'
              break
            case 'LosGrain':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'吨':'--'
              break
            case 'DamGreenhouse':
              this.agricultureLoss[key]=this.agricultureLoss[key]?this.agricultureLoss[key]+'座':'--'
              break
          }
        }
      }
      //林业损失
      this.forestryLoss=this.detailInfoData.forestryLoss==''?null:JSON.parse(this.detailInfoData.forestryLoss)
      if(this.forestryLoss){
        for( let key in this.forestryLoss){
          switch (key){
            case 'maneyLoss':
              this.forestryLoss[key]=this.forestryLoss[key]?this.forestryLoss[key]+'万元':'--'
              break
            case 'forLoss':
              this.forestryLoss[key]=this.forestryLoss[key]?this.forestryLoss[key]+'棵':'--'
              break
            case 'forAffArea':
              this.forestryLoss[key]=this.forestryLoss[key]?this.forestryLoss[key]+'公顷':'--'
              break
          }
        }
      }
      //渔业损失
      this.fisheryLoss=this.detailInfoData.fisheryLoss==''?null:JSON.parse(this.detailInfoData.fisheryLoss)
      if(this.fisheryLoss){
        for( let key in this.fisheryLoss){
          switch (key){
            case 'maneyLoss':
              this.fisheryLoss[key]=this.fisheryLoss[key]?this.fisheryLoss[key]+'万元':'--'
              break
            case 'fisBoaCapNum':
              this.fisheryLoss[key]=this.fisheryLoss[key]?this.fisheryLoss[key]+'艘':'--'
              break
            case 'fisBoaCapTon':
              this.fisheryLoss[key]=this.fisheryLoss[key]?this.fisheryLoss[key]+'吨':'--'
              break
            case 'FisAffArea':
              this.fisheryLoss[key]=this.fisheryLoss[key]?this.fisheryLoss[key]+'公顷':'--'
              break
          }
        }
      }
      //电力损失
      this.electricityLoss=this.detailInfoData.electricityLoss==''?null:JSON.parse(this.detailInfoData.electricityLoss)
      if(this.electricityLoss){
        for( let key in this.electricityLoss){
          switch (key){
            case 'maneyLoss':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'万元':'--'
              break
            case 'PouBroPole':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'根':'--'
              break
            case 'invPowTowerNum':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'座':'--'
              break
            case 'PowLinDamLeng':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'公里':'--'
              break
            case 'powIntTime':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'小时':'--'
              break
            case 'PowUsers':
              this.electricityLoss[key]=this.electricityLoss[key]?this.electricityLoss[key]+'户':'--'
              break
          }
        }
      }
      //通讯损失
      this.communicationLoss=this.detailInfoData.communicationLoss==''?null:JSON.parse(this.detailInfoData.communicationLoss)
      if(this.communicationLoss){
        for( let key in this.communicationLoss){
          switch (key){
            case 'maneyLoss':
              this.communicationLoss[key]=this.communicationLoss[key]?this.communicationLoss[key]+'万元':'--'
              break
            case 'ComIntNum':
              this.communicationLoss[key]=this.communicationLoss[key]?this.communicationLoss[key]+'次':'--'
              break
            case 'comIntTime':
              this.communicationLoss[key]=this.communicationLoss[key]?this.communicationLoss[key]+'小时':'--'
              break
          }
        }
      }
      //畜牧业损失
      this.animalsLoss=this.detailInfoData.animalsLoss==''?null:JSON.parse(this.detailInfoData.animalsLoss)
      if(this.animalsLoss){
        for( let key in this.animalsLoss){
          switch (key){
            case 'maneyLoss':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'万元':'--'
              break
            case 'GraAffArea':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'公顷':'--'

              break
            case 'DriWatLivTocNum':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'头':'--'
              break
            case 'newPigKilAniNum':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'头':'--'
              break
            case 'newPigAffNum':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'头':'--'
              break
            case 'deadPoulNum':
              this.animalsLoss[key]=this.animalsLoss[key]?this.animalsLoss[key]+'只':'--'
              break
          }
        }
      }
      //交通损失
      this.trafficLoss=this.detailInfoData.trafficLoss==''?null:JSON.parse(this.detailInfoData.trafficLoss)
      if(this.trafficLoss){
        for( let key in this.trafficLoss){
          switch (key){
            case 'maneyLoss':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'万元':'--'
              break
            case 'closedRoadCongestion':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'条':'--'
              break
            case 'DamBriCul':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'座':'--'
              break
            case 'higIntNum':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'条':'--'
              break
            case 'RailroadsNum':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'条':'--'
              break
            case 'HigIntLength':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'公里':'--'
              break
            case 'RailroadsLength':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'公里':'--'
              break
            case 'planeFlightNum':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'架':'--'
              break
            case 'AirFlightCancell':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'架':'--'
              break
            case 'shipmentBeforehand':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'艘':'--'
              break
            case 'transportationDamage':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'个':'--'
              break
            case 'trafficStoppageTime':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'小时':'--'
              break
            case 'passengersNum':
              this.trafficLoss[key]=this.trafficLoss[key]?this.trafficLoss[key]+'人':'--'
              break
          }
        }
      }
      //商业损失
      this.businessLoss=this.detailInfoData.businessLoss==''?null:JSON.parse(this.detailInfoData.businessLoss)
      if(this.businessLoss){
        for( let key in this.businessLoss){
          switch (key){
            case 'maneyLoss':
              this.businessLoss[key]=this.businessLoss[key]?this.businessLoss[key]+'万元':'--'
              break
            case 'shopClosedNum':
              this.businessLoss[key]=this.businessLoss[key]?this.businessLoss[key]+'间':'--'
              break
          }
        }
      }
      //其他损失
      this.othersLoss=this.detailInfoData.othersLoss==''?null:JSON.parse(this.detailInfoData.othersLoss)
      if(this.othersLoss){
        for( let key in this.othersLoss){
          switch (key){
            case 'maneyLoss':
              this.othersLoss[key]=this.othersLoss[key]?this.othersLoss[key]+'万元':'--'
              break
          }
        }
      }
    }

    mounted(){
      this.changedetailInfoData()
      if( window.sessionStorage['userInfo']) {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
  #DisasterInformationAuditDetail{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-clip: content-box;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding-bottom: 100px;
    @include scrollStyle;
    .AuditDetail_title{
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      padding-left: 40px;
      span{
        cursor: pointer;
      }
    }
    .AuditDetail_main{
      padding-left: 40px;
      .infoTitle{
        height: 40px;
        font-size: 14px;
        color: #11a9f5;
        line-height: 40px;
        margin-bottom: 10px;
      }
      .infoConten{
        padding-left: 20px;
        ul{
          width: 842px;
          overflow: hidden;
          .width50{
            float: left;
            width: 400px;
            line-height: 24px;
            min-height: 35px;
            padding-right: 20px;
            margin-bottom: 15px;
            span{
              float: left;
              height: 100%;
            }
            span.textL{
              width: 150px;
            }
            span.textR{
              width: 250px;
              word-wrap:break-word
            }
          }
          .width100{
            float: left;
            width: 800px;
            line-height: 24px;
            min-height: 35px;
            margin-bottom: 15px;
            span{
              float: left;
            }
            span.textL{
              width: 150px;
            }
            span.textR{
              width: 650px;
              word-wrap:break-word;
              overflow: hidden;
              .textFileName{
                display: block;
                margin-bottom: 5px;
              }
            }
            div.textR{
              width: 650px;
              word-wrap:break-word;
              overflow: hidden;
              float: left;
              .textFileName{
                display: block;
                line-height: 24px;
                margin-bottom: 5px;
                span{
                  margin-right: 20px;
                }
              }
            }
          }
        }
      }
      .AuditInforbtn{
        margin-top: 20px;
        .AuditInforbtn_1{
          margin-left: 300px;
        }
      }
    }
  }
</style>
