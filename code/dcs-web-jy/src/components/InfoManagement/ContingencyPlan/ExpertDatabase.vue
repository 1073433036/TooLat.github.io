<template>
    <main id="expertDatabase">
      <header class="expertDatabase_title">
        <div class="experBtn">
          <button class="infoManageBtn infoManageBtn_add" @click="addZjkInfo">新增</button>
        </div>
      </header>
      <section class="expertDatabase_main">
        <el-table
          :data="currentData"
          style="width: 100%"
          border
          stripe
          header-cell-class-name="tableHeader"
          :height="tableHeight">
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
              <el-button class="infoTab_btn tab_btn_1" @click="upDateZjkInfo(scope.row)" type="text" size="small"></el-button>
              <el-button class="infoTab_btn tab_btn_2" @click="deleteZjkInfo(scope.row)" type="text" size="small"></el-button>
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
  import { Component,Prop } from 'vue-property-decorator'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import InfoFormPopup from "../InfoManagePopup/InfoFormPopup.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import departmentInfoHttp from "../../../util/DepartmentInfoHttp"
  import contingencyPlanHttp from "../../../util/ContingencyPlanHttp"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  let ContingencyPlanHttp=new contingencyPlanHttp()
  let DepartmentInfoHttp = new departmentInfoHttp()
  @Component({
    components:{
      InfoFormPopup,
      CommonPagination
    }
  })
  export default class ExpertDatabase extends Vue{
    infoFormPopupFlag:boolean=false
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['expertDatabase']
    ExpertDatabaseTable:string='ExpertDatabaseTable'
    tableHeight:number=300
    tableData:any=[]
    currentData:any=[]
    options:{ value: string,  label: string }[]=[]
    infoFormData:any=null
    //获取当前页面信息
    getCurrentData(params:any){
      this.currentData=params
    }
    infoPopupClose(){
      this.infoFormPopupFlag=false
    }
    //获取部门类型
    async getDepartmentTypes(){
      let res = await DepartmentInfoHttp.getDepartmentTypes({})
      this.options=[]
      res.forEach(v=>{
        this.options.push({
          value: v.department,  label: v.department
        })
      })
    }
    //获取专家信息
    async getZjkInfo(){
      this.tableData=await ContingencyPlanHttp.getZjkInfo({})
    }

    //打开弹窗添加专家信息
    addZjkInfo(){
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'add',
        title:'添加专家信息',
        className:'width300',
        ruleForm: {
          name: '',
          department: '',
          address: '',
          phone: '',
          cellphone: ''
        },
        config:{
          name:{
            type:'input',
            label:'姓名'
          },
          department:{
            type:'select',
            label:'部门',
            options: this.options
          },
          address:{
            type:'input',
            label:'居住地'
          },
          phone:{
            type:'input',
            label:'电话'
          },
          cellphone:{
            type:'input',
            label:'手机号'
          },
        },
        rules: {
          name:[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' }],
        }
      }
    }
    //打开弹窗修改专家信息
    upDateZjkInfo(params){
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'edit',
        title:'修改专家信息',
        className:'width300',
        ruleForm: {
          id:params.id,
          name:params.name,
          department: params.department,
          address: params.address,
          phone: params.phone,
          cellphone: params.cellphone,
        },
        config:{
          name:{
            type:'input',
            label:'姓名'
          },
          department:{
            type:'select',
            label:'部门',
            options: this.options
          },
          address:{
            type:'input',
            label:'居住地'
          },
          phone:{
            type:'input',
            label:'电话'
          },
          cellphone:{
            type:'input',
            label:'手机号'
          },
        },
        rules: {
          name:[
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          cellphone: [{ required: false, message: '负责人联系电话必填', trigger: 'blur' }],
        }
      }
    }
    //获取从弹窗修改或添加的专家信息
    async getInfoFormData(params:any){
      let res:boolean
      switch (params.type){
        case 'add':
          let ts = {"planExperts": [params.ruleForm]}
          res = await ContingencyPlanHttp.addZjkInfo(ts)
          if(res){
            this.$message.success('添加成功')
            this.getZjkInfo()
          }else{
            this.$message.error('添加失败')
          }
          break
        case 'edit':
          res = await ContingencyPlanHttp.upDateZjkInfo(params.ruleForm)
          if(res){
            this.$message.success('修改成功')
            this.getZjkInfo()
          }else{
            this.$message.error('修改失败')
          }
          break
      }
      this.infoFormPopupFlag=false
    }
    //删除专家信息
    async deleteZjkInfo(params){
      let res = await ContingencyPlanHttp.deleteZjkInfo({ids:[params.id]})
      if(res){
        this.$message.success('删除成功')
        this.getZjkInfo()
      }else{
        this.$message.error('删除失败')
      }
    }
    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(450)
      })
      this.getZjkInfo()
      this.getDepartmentTypes()
    }
  }
</script>

<style lang="scss" scoped>
#expertDatabase{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .expertDatabase_title{
    height: 60px;
    padding: 10px 40px;
    box-sizing: border-box;
    .experBtn{
      padding: 5px 0px;
      height: 30px;
    }
  }
  .expertDatabase_main{
    overflow: hidden;
    padding: 0 40px;
  }
}
</style>
