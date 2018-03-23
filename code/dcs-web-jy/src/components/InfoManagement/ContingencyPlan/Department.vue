<template>
  <main class="Department">
    <div class="Department_top">
      <h6 class="Department_List_title">部门列表
        <span @click="editDepart">编辑</span>
      </h6>
      <ul class="Department_List">
        <li v-for="(item,index) in departmentList">
          <div class="text_btn" @click="clickDepartment(item)" :class="{'active':item.flag}">
            {{item.department}}
          </div>
        </li>
      </ul>
    </div>
    <section class="Department_table">
      <header class="Department_table_title">
        部门负责人
        <div class="PlanBtn">
          <el-upload
            :show-file-list="false"
            class="upload-demo buttonUpLoad"
            action="http://10.148.83.86:8080/JYTY/departmenthead/insertsexcel"
            :on-success="loadSuccess"
            :on-error="loadError"
            name="multipartFile">
            <button class="infoManageBtn infoManageBtn_entry" size="small">导入</button>
          </el-upload>
        </div>
        <div class="PlanBtn">
          <button class="infoManageBtn infoManageBtn_add" @click="addDepartManage">添加</button>
        </div>
      </header>
      <el-table
        :data="tableData"
        border
        stripe
        header-cell-class-name="tableHeader"
        :height="tableHeight"
        style="width: 100%">
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
            <el-button class="infoTab_btn tab_btn_1" @click="editInfo(scope.row)" type="text" size="small"></el-button>
            <el-button class="infoTab_btn tab_btn_2" @click="deleteInfo(scope.row)" type="text" size="small"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <infoFormPopup @getInfoFormData="getInfoFormData"
                   :infoPopupClose="infoPopupClose"
                   v-if="infoFormPopupFlag"
                   :infoFormData="infoFormData"></infoFormPopup>
    <keep-alive>
      <DepartmentEditPopup v-if="editFlag"
                           :editDepartClose="editDepartClose"/>
    </keep-alive>

  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import departmentInfoHttp from "../../../util/DepartmentInfoHttp"
  import InfoFormPopup from "../InfoManagePopup/InfoFormPopup.vue"
  import DepartmentEditPopup from "../InfoManagePopup/DepartmentEditPopup.vue"
  import { getComputeTableHeight } from "../../../util/InfoManageFunction"
  import InfoManageTableType from '../../../config/InfoManageTableType'
  let DepartmentInfoHttp = new departmentInfoHttp()
  @Component({
    components:{
      InfoFormPopup,
      DepartmentEditPopup
    }
  })
  export default class Department extends Vue {
    tableHeight:number=300
    tableData:any= []
    departmentList:{ did:number, department:string, scan: string,flag:boolean,flag_:boolean}[]=[]
    tableType:{ prop: string, label: string, width: string, align:string }[]=InfoManageTableType['InstiFrame']
    infoFormData:any=null
    infoFormPopupFlag:boolean=false
    options:{ value: string,  label: string }[]=[]
    editFlag:boolean=false
    //获取部门类型
    async getDepartmentTypes(){
      let res = await DepartmentInfoHttp.getDepartmentTypes({})
      let arr:any=[]
      this.options=[]
      res.forEach(v=>{
        arr.push({
          did: v.did,
          department:v.department,
          scan: v.scan,
          flag:false,
          flag_:false
        })
        this.options.push({value: v.department,  label: v.department})
      })
      this.departmentList=arr
      this.tableData=await DepartmentInfoHttp.searchDerpartManage()
      arr=null
    }
    //点击选择部门
    clickDepartment(item:{ did:number, department:string, scan: string,flag:boolean,flag_:boolean}){
      this.departmentList.forEach(v=>{
        if(item.department!=v.department){
          v.flag=false
        }
      })
      item.flag=!item.flag
      if(item.flag){
        this.getDepartmentManage(item.department)
      }else {
        this.getDepartmentTypes()
      }
    }

    //获取部门负责人
    async getDepartmentManage(par:string){
      this.tableData=await DepartmentInfoHttp.getDerPartmentNumber({keyword:par})
    }

    //删除部门负责人
    async deleteInfo(params:any){
      let res  = await DepartmentInfoHttp.deleteDerpartManage({ids:[params.id]})
      res? this.$message.success('删除成功') :this.$message.error('删除失败')
      this.getDepartmentManage(params.department)
    }
    //添加部门负责人
    addDepartManage(){
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'add',
        title:'添加部门负责人',
        className:'width300',
        ruleForm: {
          name: "",
          department: "",
          position: "",
          phone: "",
          cellphone: ""
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
          position:{
            type:'input',
            label:'职位'
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
    //编辑部门负责人信息
    editInfo(params:any){
      this.infoFormPopupFlag=true
      this.infoFormData={
        type:'edit',
        title:'编辑部门负责人',
        className:'width300',
        ruleForm: {
          id:params.id,
          name: params.name,
          department:params.department,
          position: params.position,
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
          position:{
            type:'input',
            label:'职位'
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
    //获取部门负责人弹窗数据
    async getInfoFormData(params:any){
      switch (params.type){
        case 'add':
          let ts = {"departmentHeads": [params.ruleForm]}
          let res = await DepartmentInfoHttp.addDerpartmentManage(ts)
          if(res){
            this.$message({
              message: '部门负责人添加成功',
              type: 'success'
            });
          }else {
            this.$message({
              message: '部门负责人添加失败',
              type: 'warning'
            });
          }
          break
        case 'edit':
          let res1 = await DepartmentInfoHttp.updataDerpartmentManage(params.ruleForm)
          if(res1){
            this.$message({
              message: '部门负责人修改成功',
              type: 'success'
            });
          }else {
            this.$message({
              message: '部门负责人修改失败',
              type: 'warning'
            });
          }
          this.getDepartmentManage(params.ruleForm.department)
          break
      }
      this.infoFormPopupFlag=false
    }
    //关闭弹窗
    infoPopupClose(){
      this.infoFormPopupFlag=false
    }
    //编辑部门
    editDepart(){
      this.editFlag=true
    }
    //关闭编辑部门
    editDepartClose(){
      this.editFlag=false
      this.getDepartmentTypes()
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

    //文件导入失败
    loadError(err, file, fileList){
      console.log(err,file,fileList)
      Vue['prototype']['$message']({ type: 'warning', message: '文件导入失败' })
    }

    mounted(){
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(530)
      })
      this.getDepartmentTypes()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
.Department{
  width: 100%;
  height: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  .Department_top{
    float: left;
    width: 200px;
    height: 500px;
    box-sizing: border-box;
    border-right:1px solid #dcdcdc ;
    padding-top: 10px;
    .Department_List_title{
      height: 40px;
      line-height: 40px;
      font-size: 14px;/*no*/
      width: 100%;
      span{
        float: right;
        color: #11A9F5;
        line-height: 40px;
        height: 40px;
        padding: 0px 8px;
        cursor: pointer;
      }
      span:hover{
        text-decoration:underline
      }
    }
    .Department_List{
      padding-bottom: 10px;
      float: left;
      width: 100%;
      height: 460px;
      overflow-y: auto;
      box-sizing: border-box;
      @include scrollStyle;
      li{
        float: left;
        height: 36px;
        width: 100%;
        transition: all .5s;
        line-height: 36px;
        text-indent: 10px;
        margin-bottom: 5px;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        .text_btn{
          height: 100%;
          width: 100%;
          float: left;
          overflow: hidden;
        }
        .edit_btn{
          position: absolute;
          left: 0px;
          top: 0;
          height: 100%;
          width: 100%;
          z-index: 10;
          background: white;
          overflow: hidden;
          .el-icon-edit-outline{
            float: right;
            height: 36px;
            width: 36px;
            text-align: center;
            line-height: 36px;
          }
        }
      }
      li:last-of-type{
        margin-bottom: 0;
      }
      li .text_btn:hover{
        background: #f5f5f5;
      }
      li .text_btn:active{
        color: #11A9F5;
        background: #f2f2f2;
      }
      li .text_btn.active,li .edit_btn.active{
        color: #11A9F5;
        background: #f2f2f2;
        transition: all .5s;
      }
    }

  }
  .Department_table{
    float: left;
    width:calc(100% - 212px);
    height: 100%;
    margin-left: 10px;
    box-sizing: border-box;
    .Department_table_title{
      height: 40px;
      line-height: 40px;
      font-size: 14px;/*no*/
      width: 100%;
      text-indent: 20px;
      margin: 10px 0px;
      .PlanBtn{
        float: right;
        height: 40px;
        box-sizing: border-box;
        padding: 5px 0px;
        margin-left: 20px;
      }
    }
  }
}
</style>
<style>
  .el-upload-list{
    display: none;
  }
</style>
