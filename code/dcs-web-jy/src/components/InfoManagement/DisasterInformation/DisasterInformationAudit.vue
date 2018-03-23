<template>
  <main id="DisasterInformationAudit">
    <aside class="Audit_tab">
      <ul>
        <li v-for="item in AuditTabList" :class="{'current':item.flag}">
          <span style="cursor:pointer;padding: 0px 15px;height: 100%;display: inline-block"
                @click.stop="selectAuditTab(item)">
            {{item.name}}
          </span>
          <span class="Audit_num">{{item.num}}</span>
        </li>
      </ul>
    </aside>
    <section class="Audit_main">
      <componented :is="component"
                   :detailInfo="detailInfo"
                   :tableType="tableType"
                   :AuditDatas="AuditDatas[tableType]"
                   :tableShow="tableShow"
                   :ClickAudit="clickAudit"
                   @goBackAuditTable="goBackAuditTable"
                   @infoDetail="getInfoDetail"></componented>
    </section>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Getter,Action } from 'vuex-class'
  import { Component,Watch } from 'vue-property-decorator'
  import Disaster from '../../../interface/Disaster'
  import AuditTable from './DisasterInformationAuditTable.vue'
  import AuditDetail from './DisasterInformationAuditDetail.vue'
  import DisasterService from '../../../util/DisasterService'

  let DisasterHttp = new DisasterService()
  @Component({
    components:{
      AuditTable,
      AuditDetail
    }
  })
  export default class DisasterInformationAudit extends Vue {
    @Getter('systemStore/userInfo_global') userInfo_global
    @Action('systemStore/storeUserInfo_global') storeUserInfoGlobal
    tableShow:boolean=false
    component:any=AuditTable
    detailInfo:any=null
    tableType:string='notAudit'
    AuditTabList:Array<{ name:string, label:string, num:number, flag:boolean }>=[
      {
        name:'未审核灾情',
        label:'notAudit',
        num:0,
        flag:true
      },
      {
        name:'已审核灾情',
        label:'Audit',
        num:0,
        flag:false
      },
      {
        name:'不通过灾情',
        label:'noPass',
        num:0,
        flag:false
      },
    ]
    AuditDatas:{ notAudit:Array<Disaster>, Audit:Array<Disaster>, noPass:Array<Disaster>}={
      notAudit:[],
      Audit:[],
      noPass:[]
    }
    @Watch('tableType')

    //选择审核类型
    selectAuditTab(item:{ name:string, label:string, num:number, flag:boolean }):void{
      if(this.component!=AuditTable){
        this.getAuditInfo()
      }
      if(item.flag==undefined){return}
      this.AuditTabList.forEach(v=>{
        v.flag=false
      })
      item.flag=true
      switch (item.label){
        case 'notAudit':
          this.tableType='notAudit'
          this.tableShow=false
          setTimeout(()=>{
            this.tableShow=true
          },100)
          break
        case 'Audit':
          this.tableType='Audit'
          this.tableShow=false
          setTimeout(()=>{
            this.tableShow=true
          },100)
          break
        case 'noPass':
          this.tableType='noPass'
          this.tableShow=false
          setTimeout(()=>{
            this.tableShow=true
          },100)
          break
      }
      this.component=AuditTable
    }

    //灾情详细
    getInfoDetail(par:Disaster){
      this.detailInfo=par
      this.component=AuditDetail
    }

    //获取根据审核条件获取灾情审核的信息
    getAuditInfo():void{
      let params={}
      let audit1:any=[],audit2:any=[],audit3:any=[]
      DisasterHttp.getTaoDisastersInfo(params).then(res=>{
        res.forEach(v=>{
          if(v.auditStatus=='unchecked'){
            audit1.push(v)
          }
          if(v.auditStatus=='passcheck'){
            audit2.push(v)
          }
          if(v.auditStatus=='unpasscheck'){
            audit3.push(v)
          }
        })
        this.AuditTabList[0].num=audit1.length
        this.AuditTabList[1].num=audit2.length
        this.AuditTabList[2].num=audit3.length
        this.AuditDatas['notAudit']=audit1
        this.AuditDatas['Audit']=audit2
        this.AuditDatas['noPass']=audit3
      })
    }

    //点击返回灾情列表
    goBackAuditTable():void{
      this.getAuditInfo()
      this.component=AuditTable
      this.tableShow=false
      setTimeout(()=>{
        this.tableShow=true
      },200)
    }

    //点击审核
    async clickAudit(item: Disaster, flag: boolean): Promise<void> {
      if(!this.userInfo_global.roles.d_r_audit) {  //判断用户是否有审核权限
        this.$message.warning('没有权限审核');
        return;
      }
      item['auditStatus'] = flag ? 'passcheck' : 'unpasscheck';
      let data: boolean = await DisasterHttp.upInfoDisasterById(item);
      if(data) {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.getAuditInfo();
      } else {
        this.$message({
          type: 'error',
          message: '提交失败'
        });
      }
    }
    mounted(){
      this.getAuditInfo()
      setTimeout(()=>{
        this.tableShow=true
      },200)
      if( window.sessionStorage['userInfo']) {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo') || '{}');
        this.storeUserInfoGlobal(userInfo);
      }
    }
  }
</script>
<style lang="scss" scoped>
  #DisasterInformationAudit{
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    height: 100%;
    overflow: hidden;
    .Audit_tab{
      float: left;
      width: 250px;
      text-align: center;
      font-size: 16px;
      line-height: 50px;
      height: 100%;
      color: #5c6064;
      border-right: 1px solid #e6e6e6;
      ul li.current{
        color: #11a9f5;
      }
      ul li{
        position: relative;
      }
      ul li .Audit_num{
        position: absolute;
        height: 100%;
        padding: 0 5px;
        top: 0;
        right: 30px;
        font-size: 14px;
        color: #989898;
        max-width: 110px;
        overflow: hidden;
      }
    }
    .Audit_main{
      width: calc(100% - 252px);
      height: 100%;
      float: left;
      box-sizing: border-box;
    }
  }
</style>
