<template>
  <main id="PlansTemplate">
    <header class="PlansTemplate_header">
      <div class="ptSel">
        <el-select v-model="temType"
                   class="Plan_select"
                   placeholder="预案类型">
          <el-option
            v-for="(item,key) in temTypes"
            :key="key"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="ptSel" v-if="temType=='预案类型'">
        <el-select v-model="PlanType"
                   class="Plan_select"
                   placeholder="事件类型">
          <el-option
            v-for="item in PlanTypes"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
      <div class="ptSel" v-if="temType=='预案类型'">
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
      </div>
      <div class="ptBtn">
        <button class="infoManageBtn infoManageBtn_del" @click="deletePTInfoS">删除</button>
      </div>
      <div class="ptBtn">
        <button class="infoManageBtn infoManageBtn_add" @click="addPTInfo">新增</button>
      </div>
    </header>
    <section class="PlansTemplate_main">
      <el-table
        :data="currentData"
        border
        stripe
        header-cell-class-name="tableHeader"
        @selection-change="handleSelectionChange"
        :height="tableHeight">
        <el-table-column
          type="selection"
          width="20">
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableType"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :width="item.width">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="110">
          <template slot-scope="scope">
            <el-button class="infoTab_btn tab_btn_1" @click="upDatePTInfo(scope.row)" type="text" size="small"></el-button>
            <el-button class="infoTab_btn tab_btn_2" @click="deletePTInfo(scope.row)" type="text" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
    <infoFormPopup @getInfoFormData="getInfoFormData"
                   :infoPopupClose="infoPopupClose"
                   v-if="infoFormPopupFlag"
                   :infoFormData="infoFormData"></infoFormPopup>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import { plansClient } from "../../../util/ClientHelper"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import InfoFormPopup from "../InfoManagePopup/InfoFormPopup.vue"
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import contingencyPlanHttp from "../../../util/ContingencyPlanHttp"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  let ContingencyPlanHttp=new contingencyPlanHttp()
  @Component({
    components:{
      InfoFormPopup,
      CommonPagination
    }
  })
  export default class PlansTemplate extends Vue{
    tableHeight:number=0
    temType:string='预案类型'
    temTypes:string[]=['预案类型','工作备忘']//预案提示信息和工作备忘
    PlanType:string=''
    PlanTypes:{ id: number, code: string, name: string}[]=[]
    DisasterType:string=''
    DisasterTypes:{
      id: number,
      code: string,
      name: string,
      relationId: number
    }[]=[]
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['PTAlertInfo']
    tableData:any=[]
    currentData:any=[]
    infoFormPopupFlag:boolean=false
    infoFormData:any=null
    tableSelectInfos:any[]=[]
    @Watch('temType')
    async changetemType(val){
      switch (val){
        case '预案类型':
          this.tableType=InfoManageTableType['PTAlertInfo']
          this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
          break
        case '工作备忘':
          this.tableType=InfoManageTableType['PTWorkingMemo']
          this.tableData=await ContingencyPlanHttp.getWorkConten({})
          break
      }
    }
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
    async changeDisasterType(val){
      this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
    }

    //获取当前页面信息
    getCurrentData(params:any){
      this.currentData=params
    }
    //表格勾选
    handleSelectionChange(par){
      this.tableSelectInfos=par
    }

    //点击删除勾选的信息
    async deletePTInfoS(){
      if(this.tableSelectInfos.length==0)return
      let res:boolean
      let arr:number[]=[]
      this.tableSelectInfos.forEach(v=>{
        arr.push(v.id)
      })
      switch (this.temType){
        case '预案类型':
          res = await ContingencyPlanHttp.deleteAlertInfo({ids:arr})
          if(res){
            this.$message.success('删除成功')
            this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
          }else {
            this.$message.error('删除失败')
          }
          break
        case '工作备忘':
          res = await ContingencyPlanHttp.deleteWorkConten({ids:arr})
          if(res){
            this.$message.success('删除成功')
            this.tableData=await ContingencyPlanHttp.getWorkConten({})
          }else {
            this.$message.error('删除失败')
          }
          break
      }
    }
    //点击表格删除按钮
    async deletePTInfo(params:any){
      let res:boolean
      switch (this.temType){
        case '预案类型':
          res = await ContingencyPlanHttp.deleteAlertInfo({ids:[params.id]})
          if(res){
            this.$message.success('删除成功')
            this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
          }else {
            this.$message.error('删除失败')
          }
          break
        case '工作备忘':
          res = await ContingencyPlanHttp.deleteWorkConten({ids:[params.id]})
          if(res){
            this.$message.success('删除成功')
            this.tableData=await ContingencyPlanHttp.getWorkConten({})
          }else {
            this.$message.error('删除失败')
          }
          break
      }
    }
    //点击添加
    addPTInfo(){
      this.infoFormPopupFlag=true
      switch (this.temType){
        case '预案类型':
          this.infoFormData={
            type:'add',
            title:'添加预案提示信息',
            className:'width600',
            ruleForm: {
              e_name: '',
              starttip: '',
              downtip: '',
              uptip: '',
              finishtip:'',
              description:''
            },
            config:{
              e_name:{
                type:'input',
                label:'预案名称'
              },
              starttip: {
                type:'textarea',
                label:'启动提示'
              },
              downtip: {
                type:'textarea',
                label:'降级提示'
              },
              uptip: {
                type:'textarea',
                label:'升级提示'
              },
              finishtip: {
                type:'textarea',
                label:'结束提示'
              },
              description:{
                type:'textarea',
                label:'描述'
              },
            },
            rules: {
              e_name:[
                { required: true, message: '请输入', trigger: 'blur' }
              ],
            }
          }
          break
        case '工作备忘':
          this.infoFormData={
            type:'add',
            title:'添加工作备忘',
            className:'width300',
            ruleForm: {
              name: "",
            },
            config:{
              name:{
                type:'textarea',
                label:'备忘内容'
              },
            },
            rules: {
              name:[
                { required: true, message: '请输入', trigger: 'blur' }
              ],
            }
          }
          break
      }
    }
    //点击表格的编辑按钮
    upDatePTInfo(params:any){
      this.infoFormPopupFlag=true
      switch (this.temType){
        case '预案类型':
          this.infoFormData={
            type:'edit',
            title:'修改预案提示信息',
            className:'width600',
            ruleForm: {
              id:params.id,
              e_name: params.e_name,
              starttip: params.starttip,
              downtip: params.downtip,
              uptip: params.uptip,
              finishtip:params.finishtip,
              description:params.description
            },
            config:{
              e_name:{
                type:'input',
                label:'预案名称'
              },
              starttip: {
                type:'textarea',
                label:'启动提示'
              },
              downtip: {
                type:'textarea',
                label:'降级提示'
              },
              uptip: {
                type:'textarea',
                label:'升级提示'
              },
              finishtip: {
                type:'textarea',
                label:'结束提示'
              },
              description:{
                type:'textarea',
                label:'描述'
              },
            },
            rules: {
              e_name:[
                { required: true, message: '请输入', trigger: 'blur' }
              ],
            }
          }
          break
        case '工作备忘':
          this.infoFormData={
            type:'edit',
            title:'修改工作备忘',
            className:'width300',
            ruleForm: {
              id:params.id,
              name: params.name,
            },
            config:{
              name:{
                type:'textarea',
                label:'备忘内容'
              },
            },
            rules: {
              name:[
                { required: true, message: '请输入', trigger: 'blur' }
              ],
            }
          }
          break
      }
    }
    //获取从弹窗传来的信息
    async getInfoFormData(params:any){
      let res:boolean
      switch (this.temType){
        case '预案类型':
          switch (params.type){
            case 'add':
              res = await ContingencyPlanHttp.addAlertInfo({planTips:[params.ruleForm]})
              if(res){
                this.$message.success('预案提示添加成功')
                this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
              }else {
                this.$message.success('预案提示添加失败')
              }
              break
            case 'edit':
              res = await ContingencyPlanHttp.upDateAlertInfo(params.ruleForm)
              if(res){
                this.$message.success('预案提示修改成功')
                this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
              }else {
                this.$message.success('预案提示修改失败')
              }
              break
          }
          break
        case '工作备忘':
          switch (params.type){
            case 'add':
              res = await ContingencyPlanHttp.addWorkConten({planMemos:[params.ruleForm]})
              if(res){
                this.$message.success('工作备忘内容添加成功')
                this.tableData=await ContingencyPlanHttp.getWorkConten({})
              }else {
                this.$message.success('工作备忘内容添加失败')
              }
              break
            case 'edit':
              res = await ContingencyPlanHttp.upDateWorkConten(params.ruleForm)
              if(res){
                this.$message.success('工作备忘内容修改成功')
                this.tableData=await ContingencyPlanHttp.getWorkConten({})
              }else {
                this.$message.success('工作备忘内容修改失败')
              }
              break
          }
          break
      }
      this.infoFormPopupFlag=false
    }
    //关闭弹窗
    infoPopupClose(){
      this.infoFormPopupFlag=false
    }
    //获取各类型信息
    async getTypeInfos(){
      this.PlanTypes= await plansClient.getEmergencyType()
      this.PlanType=this.PlanTypes[0].name
      this.DisasterTypes = await plansClient.getdetailEmergencyType(this.PlanTypes[0].id)
      this.DisasterType=this.DisasterTypes[0].name
      this.tableData=await ContingencyPlanHttp.getAlertInfo({e_name:this.DisasterType})
    }
    mounted(){
      this.getTypeInfos()
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(470)
      })
    }
  }
</script>

<style lang="scss" scoped>
  #PlansTemplate{
    width: 100%;
    height: 100%;
    overflow: hidden;
    .PlansTemplate_header{
      height: 70px;
      padding: 15px 40px;
      box-sizing: border-box;
      .ptSel{
        height: 100%;
        width: 150px;
        float: left;
        margin-right: 20px;
        overflow: hidden;
      }
      .ptBtn{
        padding: 5px 0px;
        height: 30px;
        float: right;
        margin-left: 20px;
      }
    }
    .PlansTemplate_main{
      padding: 0 40px;
    }
  }
</style>
