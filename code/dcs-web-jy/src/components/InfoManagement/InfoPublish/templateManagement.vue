<template>
  <main id="TemplateManagement">
    <header class="TemplateManagement_top">
      <span class="TemplateManagement_title">模板管理</span>
      <div class="PlanBtn" style="margin-left: 10px">
        <button v-if="!editFlag" class="infoManageBtn infoManageBtn_add" @click="editFlag=!editFlag">取消</button>
      </div>
      <div class="PlanBtn">
        <button class="infoManageBtn infoManageBtn_add" @click="clickEdit">{{editFlag?'编辑':'保存'}}</button>
      </div>
    </header>
    <section class="TemplateManagement_main">
      <table class="TemplateManagement_table" border="1" cellspacing="0">
        <tr v-for="(item,key) in templateDataType">
          <td class="col_first">{{item.label}}:</td>
          <td class="col_second">
            <el-input
              :key="key"
              type="textarea"
              :rows="item.rows"
              v-model="templateData[item.value]"
              placeholder="请输入内容"
              :disabled="editFlag"
              resize="none">
            </el-input>
            <i class="el-icon-edit" v-show="!editFlag"></i>
          </td>
        </tr>
      </table>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop } from 'vue-property-decorator'
  import InfoManageTableType from '../../../config/InfoManageTableType'
  import CommonPagination from "../../CommonComponents/CommonPagination.vue"
  import infoPublishHttp from '../../../util/InfoPublishHttp'
  const InfoPublishHttp = new infoPublishHttp ()
  @Component({
    components:{
      CommonPagination,
    }
  })
  export default class TemplateManagement extends Vue {
    tableType:any=InfoManageTableType['templateManage']
    templateDataType:{ label:string, value:string,rows:number }[]=[
      {
        label:'发布单位',
        value:'units',
        rows:2
      },
      {
        label:'预报员',
        value:'forecaster',
        rows:2
      },
      {
        label:'签发人',
        value:'signer',
        rows:2
      },
      {
        label:'确认电话',
        value:'affirmNumber',
        rows:2
      },
      {
        label:'传真号',
        value:'fax',
        rows:2
      },
      {
        label:'预警模板',
        value:'warnType',
        rows:3
      },
    ]
    editFlag:boolean=true
    templateData:any={}
    async clickEdit(){
      this.editFlag=!this.editFlag
      if(this.editFlag){
        let res = await InfoPublishHttp.updataTemplate(this.templateData)
        res?this.$message.success('模板信息修改成功'):this.$message.error('模板信息修改失败')
      }
    }
    async mounted(){
      let data =await InfoPublishHttp.getWarningTemplates()
      this.templateData=data[0]

    }
  }
</script>

<style lang="scss" scoped>
  #TemplateManagement{
    width: 100%;
    height: 100%;
    background: white;
    box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.25);
    color: #677888;
    .TemplateManagement_top{
      width: 1000px;
      padding: 15px 0px 15px 40px;
      height: 30px;
      .TemplateManagement_title{
        line-height: 30px;
        font-weight: 600;
        font-size: 16px;
      }
      .PlanBtn{
        float: right;
      }
    }
    .TemplateManagement_main{
      padding: 0 40px;
      width: 1000px;
      .TemplateManagement_table{
        border: 1px solid #ccc;/*no*/
        tr{
          min-height: 100px;
          td{
            height: 30px;
            line-height: 26px;
            padding: 0px;
          }
        }
        tr .col_first{
          width: 300px;
          padding-left: 10px;
          text-indent: 10px;
        }
        tr .col_second{
          width: 700px;
          position: relative;
          .el-textarea{
            border: none;
            textarea{
              border: none;
            }
            .el-textarea__inner{
              border: none;
            }
          }
          .el-icon-edit{
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  #TemplateManagement{
    .el-textarea__inner{
      border: none !important;
      background: transparent!important;
    }
    .el-textarea.is-disabled .el-textarea__inner{
      color: #677888;
    }
  }
</style>
