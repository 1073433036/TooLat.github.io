<template>
  <main id="DutyManage">
    <header class="DutyManage_header">
      <el-date-picker
        style="float: left"
        v-model="searchTime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <button class="infoManageBtn infoManageBtn_add searchbtn" @click="searchDutyByTime">查询</button>
      <button class="infoManageBtn infoManageBtn_del marginRight20" @click="deleDutyInfos">删除</button>
      <button class="infoManageBtn infoManageBtn_entry marginRight20" size="small" @click="createExcel">导出</button>
      <button class="infoManageBtn infoManageBtn_entry marginRight20" size="small">
        导入
        <input type="file" ref="fileInput" @change="additionFile" accept=".xls,.xlsx">
      </button>
      <button class="infoManageBtn infoManageBtn_add marginRight20" @click="openDutyPopup">新增</button>
    </header>
    <section class="DutyManage_main">
      <el-table
        id="DutyManageTable"
        :data="currentData"
        style="width: 100%"
        border
        :height="tableHeight"
        header-row-class-name="table_header_title"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="20">
        </el-table-column>
        <el-table-column
          v-for="(item,key) in tableType"
          :key="key"
          :prop="item.prop"
          :label="item.label"
          :align="item.align"
          :width="item.width">
        </el-table-column>
      </el-table>
    </section>
    <CommonPagination :tableData="tableData" @getCurrentData="getCurrentData"/>
    <InfoFormPopup v-if="DutyPopupFlag"
                   @getInfoFormData="getInfoFormData"
                   :infoPopupClose="closeDutyPopup"
                   :infoFormData="infoFormData" />
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Action,Getter } from 'vuex-class'
  import { Component } from 'vue-property-decorator'
  import userInfo from '../../../interface/UserInfo'
  import Duty from '../../../interface/DutyInfo'
  import InfoFormPopup from '../InfoManagePopup/InfoFormPopup.vue'
  import DutyHttp from '../../../util/DutyHttp'
  import {getComputeTableHeight} from '../../../util/InfoManageFunction'
  import {export_json_to_excel} from '../../../util/Export2Excel.js'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  
  @Component({
    components:{
      CommonPagination,
      InfoFormPopup,
    }
  })
  export default class DutyManage extends Vue {
    @Action('infoManageStore/changeInfoPopupStatus') changeInfoPopupStatus
    @Getter('infoManageStore/infoPopupStatus') infoPopupStatus
    tableHeight:number=300
    tableData:any[]=[]
    currentData:any=[]
    searchTime:string=''
    tableType:{ prop: string, label: string, width: string, align:string }[] = InfoManageTableType['duty']
    DutyPopupFlag:boolean=false
    infoFormData:any=null
    selectDutyInfos:Duty[]=[]//存储表格勾选的信息
    //获取当前页数的数据
    getCurrentData(parmas: any) {
      this.currentData = parmas
    }
    //勾选
    handleSelectionChange(params: Duty | any) {
      this.selectDutyInfos = params
    }

    //获取值班信息
    async getDutyAllInfos() {
      let params: any
      if(this.searchTime) {
        params = {
          dutydate: moment(this.searchTime).format('YYYY-MM-DD')
        }
      } else {
        params = {}
      }
      let dutyHttp = new DutyHttp();
      this.tableData = await dutyHttp.getDutyAllInfos(params);
    }

    //点击通过日期查询值班信息
    searchDutyByTime() {
      this.getDutyAllInfos()
    }

    //打开值班信息弹窗
    openDutyPopup() {
      this.DutyPopupFlag = true
      this.infoFormData = {
        type:'add',
        title:'新增值班信息',
        className:'width600',
        ruleForm: {
          dutydate: '',//值班日期
          leader:'',//值班领导
          cheif: '',//首席岗
          captain_day: '',//白天领班
          short_impending: '',//短临
          audit: '',//审核
          captain_night: '',//夜间领班
          emergency_day:'',//应急白班
          cheif_service: '',//服务首席
          onbusiness: '',//出差
          vacation: '',//休假
          vice_day: '',//白天副班
          vice_night: '',//夜间副班
          office: '',//办公班
          consultation: '',//会商
          remark: ''//备注
        },
        config:{
          dutydate:{
            type:'picker',
            label:'值班日期'
          },
          leader:{
            type:'input',
            label:'值班领导',
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
          cheif:{
            type:'input',
            label:'首席岗'
          },
          captain_day:{
            type:'input',
            label:'白天领班'
          },
          short_impending:{
            type:'input',
            label:'短临'
          },
          audit:{
            type:'input',
            label:'审核'
          },
          captain_night:{
            type:'input',
            label:'夜间领班'
          },
          emergency_day:{
            type:'input',
            label:'应急白班'
          },
          cheif_service:{
            type:'input',
            label:'服务首席'
          },
          onbusiness:{
            type:'input',
            label:'出差'
          },
          vacation:{
            type:'input',
            label:'休假'
          },
          vice_day:{
            type:'input',
            label:'白天副班'
          },
          vice_night:{
            type:'input',
            label:'夜间副班'
          },
          office:{
            type:'input',
            label:'办公班'
          },
          consultation:{
            type:'input',
            label:'会商'
          },
          remark:{
            type:'input',
            label:'备注'
          },
        },
        rules: {
          dutydate: [{ type: 'date', required: true, message: '请选择日期', trigger: 'blur' }],
          leader: [{ required: false, message: '', trigger: 'blur' }],
          cheif: [{ required: false, message: '', trigger: 'blur' }],//首席岗
          captain_day: [{ required: false, message: '', trigger: 'blur' }],//白天领班
          short_impending: [{ required: false, message: '', trigger: 'blur' }],//短临
          audit:[{ required: false, message: '', trigger: 'blur' }],//审核
          captain_night: [{ required: false, message: '', trigger: 'blur' }],//夜间领班
          emergency_day:[{ required: false, message: '', trigger: 'blur' }],//应急白班
          cheif_service: [{ required: false, message: '', trigger: 'blur' }],//服务首席
          onbusiness: [{ required: false, message: '', trigger: 'blur' }],//出差
          vacation: [{ required: false, message: '', trigger: 'blur' }],//休假
          vice_day: [{ required: false, message: '', trigger: 'blur' }],//白天副班
          vice_night: [{ required: false, message: '', trigger: 'blur' }],//夜间副班
          office: [{ required: false, message: '', trigger: 'blur' }],//办公班
          consultation: [{ required: false, message: '', trigger: 'blur' }],//会商
          remark: [{ required: false, message: '', trigger: 'blur' }],//备注
        }
      }
    }
    //关闭值班信息弹窗
   closeDutyPopup() {
      this.DutyPopupFlag = false
    }
    //获取新增值班信息并添加
    async getInfoFormData(params: any) {
      let dutyHttp = new DutyHttp();
      params['ruleForm']['dutydate'] = moment(params['ruleForm']['dutydate']).format('YYYY-MM-DD')
      let res = await dutyHttp.addDutyInfos({dutySchedules:[params['ruleForm']]})
      res ? this.$message({
          message: '值班信息添加成功',
          type: 'success'
      }) : this.$message({
        message: '值班信息添加失败/已存在当日值班信息',
        type: 'warning'
      });
      this.closeDutyPopup()
      this.getDutyAllInfos()
    }
    //删除值班信息
    async deleDutyInfos(){
      if(this.selectDutyInfos.length <= 0)
        return;
      let params: any = [];
      this.selectDutyInfos.forEach(v => {
        params.push(v.id);
      })
      let dutyHttp: any = new DutyHttp();
      let res = await dutyHttp.deleDutyInfos({ids: params});
      res ? this.$message({
        message: '值班信息删除成功',
        type: 'success'
      }) : this.$message({
        message: '值班信息删除失败',
        type: 'warning'
      });
      this.getDutyAllInfos();
    }

    //导入值班信息
    async additionFile(){
      let fd = new FormData();
      let dutyHttp = new DutyHttp();
      fd.append('multipartFile',this.$refs['fileInput']['files'][0])
      let res = await dutyHttp.additionFile(fd)
      res ? this.$message({
        message: '值班信息导入成功',
        type: 'success'
      }) : this.$message({
        message: '值班信息导入失败/类型或格式错误',
        type: 'warning'
      });
    }

    //导出表格数据
    createExcel() {
      let th: string[] = ['值班日期','值班领导','首席岗','白天领班','短临','审核','夜间领班','应急白班','服务首席','出差','休假','白天副班','夜间副班','办公班','会商','备注']
      let tb: any = []
      this.tableData.forEach((v,i) => {
        tb.push([
          v.dutydate,
          v.leader,
          v.cheif,
          v.captain_day,
          v.short_impending,
          v.audit,
          v.captain_night,
          v.emergency_day,
          v.cheif_service,
          v.onbusiness,
          v.vacation,
          v.vice_day,
          v.vice_night,
          v.office,
          v.consultation,
          v.remark
        ])
      })
      let title = new Date().toLocaleString() + '值班表';
      export_json_to_excel(th, tb, title);
      th = null;
      tb = null;
  }

    async mounted(){
      this.getDutyAllInfos()
      this.$nextTick(()=>{
        this.tableHeight=getComputeTableHeight(460)
      })
    }
  }

</script>

<style lang="scss" scoped>
  .marginRight20{
    margin-right:20px ;
    margin-top: 5px;
    float: right;
    position: relative;
    overflow: hidden;
    >input{
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
  }
#DutyManage{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .DutyManage_header{
    height: 40px;
    padding: 0 40px;
    margin: 15px 0px;
    .searchbtn{
      width: 80px;
      margin-right:60px ;
      margin-left: 10px;
      margin-top: 5px;
      border-radius: 3px;
    }
    .upload_text{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      line-height: 30px;
    }
  }
  .DutyManage_main{
    padding: 0 40px;
  }
}
</style>
<style>
  .table_header_title div{
    text-align: center !important;
  }
</style>
