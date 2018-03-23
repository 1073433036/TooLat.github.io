<template>
    <main id="contingencyPlanManage">
      <CommonNavMenu @handleSelect="handleSelect" :NavMenuName="componentName"></CommonNavMenu>
      <header class="contingencyPlanHeader" v-if="activeIndex==='PlansEntry'">
        <el-select v-model="PlanType"
                   class="Plan_select"
                   placeholder="预案类型">
          <el-option
            v-for="item in PlanTypes"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-select v-model="DisasterType"
                   class="Plan_select"
                   placeholder="灾害类型">
          <el-option
            v-for="item in DisasterTypes"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
        <el-select v-model="levelType"
                   class="Plan_select"
                   placeholder="灾害等级">
          <el-option
            v-for="(item,key) in levelTypes"
            :key="key"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <div class="PlanBtn">
          <button class="infoManageBtn infoManageBtn_del" @click="deleteMoreInfo">删除</button>
        </div>
        <div class="PlanBtn">
          <el-upload
            :show-file-list="false"
            class="upload-demo buttonUpLoad"
            action="http://10.148.83.86:8080/JYTY/planmeasure/addexcel"
            :on-success="loadSuccess"
            :on-error="loadError"
            name="multipartFile">
            <button class="infoManageBtn infoManageBtn_entry" size="small">导入</button>
          </el-upload>
        </div>
        <div class="PlanBtn">
          <button class="infoManageBtn infoManageBtn_add" @click="addContingPlan">新增</button>
        </div>
      </header>
      <section class="contingencyPlanMain">
          <ContingencyPlanTable v-if="activeIndex=='PlansEntry'"
                                :tableData="tableData"
                                @deleteInfo="deleteInfo"
                                @showInfo="showInfo"
                                @handleSelectionChange="handleSelectionChange"/>
          <HistoryPlans v-if="activeIndex==='HistoryPlans'"></HistoryPlans>
          <PlansTemplate v-if="activeIndex==='PlansTemplate'"></PlansTemplate>
          <ExpertDatabase v-if="activeIndex==='expertDatabase'"></ExpertDatabase>
          <Department v-if="activeIndex==='InstiFrame'"/>
      </section>
      <ContingPlanPopup v-if="ContingPlanPopupFlag"
                        @clickSave="clickSave"
                        :closeContingPlanPopup="closeContingPlanPopup"></ContingPlanPopup>
    </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import CommonNavMenu from '../../CommonComponents/CommonNavMenu.vue'
  import ContingencyPlanTable from './ContingencyPlanTable.vue'
  import Department from "./Department.vue"
  import ContingPlanPopup from '../InfoManagePopup/ContingPlanPopup.vue'
  import ExpertDatabase from './ExpertDatabase.vue'
  import PlansTemplate from './PlansTemplate.vue'
  import HistoryPlans from './HistoryPlans.vue'
  import { plansClient } from "../../../util/ClientHelper"
  import contingencyPlanHttp from "../../../util/ContingencyPlanHttp"
  let ContingencyPlanHttp=new contingencyPlanHttp()
  let allData:any
  @Component({
    components:{
      CommonNavMenu,
      ContingencyPlanTable,
      Department,
      ContingPlanPopup,
      ExpertDatabase,
      PlansTemplate,
      HistoryPlans,
    }
  })
  export default class contingencyPlanManage extends Vue {
    activeIndex:string='PlansEntry'
    componentName:string='contingencyPlan'
    tableData:any[]=[]
    PlanType:string=''
    PlanTypes:{ id: number, code: string, name: string}[]=[]
    DisasterType:string=''
    DisasterTypes:{
      id: number,
      code: string,
      name: string,
      relationId: number
    }[]=[]
    levelType:{ label:string, value:number }={
      label:'Ⅰ级',
      value:1
    }
    levelTypes:{ label:string, value:number }[]=[]
    ContingPlanPopupFlag:boolean=false
    tableSelects:any=[]
    @Watch('PlanType')
    changePlanType(val){
      this.PlanTypes.forEach(async v=>{
        if(v.name===val){
          this.DisasterTypes = await plansClient.getdetailEmergencyType(v.id)
          this.DisasterType=this.DisasterTypes[0].name
        }
      })
    }
    @Watch('DisasterType')
    changeDisasterType(val){
      this.getPlanDataByType(val)
    }
    @Watch('levelType')
    changelevelType(val){
      this.selectLevelData(allData)
    }
    //tab栏选项
    handleSelect(param:string){
      this.activeIndex=param
      switch (param){
        case 'PlansEntry':
          this.getTypeInfos()
          this.getPlanDataByType(this.DisasterType)
          break
        case 'HistoryPlans':
          break
        case 'PlansTemplate':
          break
        case 'expertDatabase':
          break
        case 'InstiFrame':
          break
      }
    }

    //表哥勾选的选项
    handleSelectionChange(params:any){
      this.tableSelects=params
    }

    //点击表格的删除按钮
    async deleteInfo(params:any){
      let res = await ContingencyPlanHttp.deleContPlan({ids: [params.id]})
      res?this.$message({
        message: '该预案信息删除成功',
        type: 'success'
      }):this.$message({
        message: '该预案信息删除失败',
        type: 'warning'
      });
      this.getPlanDataByType(this.DisasterType)

    }

    //点击表格的查看功能
    showInfo(params:any){
      if(!params.scan){
        this.$message({
          message: '该预案信息无传真文件',
          type: 'warning'
        });
      }
    }
    //点击批量删除
    async deleteMoreInfo(){
      if( this.tableSelects.length==0)return
      let params:any[]=[]
      this.tableSelects.forEach(v=>{
        params.push(v.id)
      })
      let res = await ContingencyPlanHttp.deleContPlan({ids: params})
      res?this.$message({
        message: '该预案信息删除成功',
        type: 'success'
      }):this.$message({
        message: '该预案信息删除失败',
        type: 'warning'
      });
      this.getPlanDataByType(this.DisasterType)


    }

    //根据灾害类型获取数据
    async getPlanDataByType(val){
      let params:any
      if(val){
        params={e_name:val}
      }else {
        params={}
      }
      allData= await ContingencyPlanHttp.getAllMoreContPlan(params)
      this.selectLevelData(allData)
    }
    //根据灾害等级筛选数据
    selectLevelData(Data){
      let arr:any=[]
      Data.forEach(v=>{
        if(v.level==this.levelType.value){
          arr.push(v)
        }
      })
      arr.forEach(v=>{
        try {
          v.scan=JSON.parse(v.scan)[0]
        }catch (e){
          v.scan=''
        }
      })
      this.tableData=arr
      arr=null
    }
    //打开弹窗 新增预案
    addContingPlan(){
      this.ContingPlanPopupFlag=true
    }
    //关闭弹窗
    closeContingPlanPopup(){
      this.ContingPlanPopupFlag=false
    }
    //点击预案录入保存
    clickSave(par:boolean){
      if(par)this.getPlanDataByType(this.DisasterType)
    }
    //文件导入成功
    loadSuccess(response, file, fileList){
      console.log(response,file,fileList)
      if(response.result=="S_OK"){
        Vue['prototype']['$message']({ type: 'success', message: '文件导入成功' })
      }else {
        Vue['prototype']['$message']({ type: 'warning', message: '导入失败,文件类型或文件内容不对' })
      }
    }
    loadError(err, file, fileList){
      console.log(err,file,fileList)
      Vue['prototype']['$message']({ type: 'warning', message: '导入失败' })
    }

    //获取各类型信息
    async getTypeInfos(){
      this.PlanTypes= await plansClient.getEmergencyType()
      this.PlanType=this.PlanTypes[0].name
      this.DisasterTypes = await plansClient.getdetailEmergencyType(this.PlanTypes[0].id)
      this.DisasterType=this.DisasterTypes[0].name
      this.levelTypes = [
        {
          label:'Ⅰ级',
          value:1
        },
        {
          label:'Ⅱ级',
          value:2
        },
        {
          label:'Ⅲ级',
          value:3
        },
        {
          label:'Ⅳ级',
          value:4
        },
      ]
    }
    async mounted(){
      this.getTypeInfos()
    }
  }
</script>

<style lang="scss" scoped>
#contingencyPlanManage{
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  background: white;
  box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
  .contingencyPlanHeader{
    height: 70px;
    padding: 15px 40px;
    box-sizing: border-box;
    .Plan_select{
      width: 150px;
      margin-right: 30px;
    }
    .PlanBtn{
      float: right;
      height: 40px;
      box-sizing: border-box;
      padding: 5px 0px;
      margin-left: 20px;
    }
  }
  .contingencyPlanMain{
    height: 100%;
  }
}
</style>
