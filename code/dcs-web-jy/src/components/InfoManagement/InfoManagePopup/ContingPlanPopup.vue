<template>
  <main id="ContingPlanPopup" v-drag>
    <header class="ContingPlanPopup_header">
      <span>新增预案</span>
      <i class="el-icon-close" @click="closeContingPlanPopup"></i>
    </header>
    <section class="ContingPlanPopup_main">
      <div class="ContingPlan_selects">
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
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="ContingPlanPopup_bu">
        <ul class="ContingPlanPopup_bu_top">
          <li class="bumen">部门</li>
          <li class="ker">单位预案</li>
          <li class="ker">短信</li>
          <li class="chuanzhen">传真</li>
        </ul>
        <ul class="ContingPlanPopup_bu_mid" v-for="(item,index) in PlanDepartments" :key="index">
          <li>
            <el-select v-model="item.departmentType"
                       class="Plan_select"
                       clearable
                       placeholder="选择部门">
              <el-option
                v-for="item in departmentTypes"
                :key="item.did"
                :label="item.department"
                :value="item.department">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-input v-model="item.unitPlan" clearable placeholder="请输入内容"></el-input>
          </li>
          <li>
            <el-input v-model="item.noteContent" clearable placeholder="请输入内容"></el-input>
          </li>
          <li>
            <input type="text" ref="filesName" disabled>
            <div class="loading">浏览...
              <input type="file"
                     name="files"
                     ref="fax"
                     value="点击上传"
                     class="fileOne"
                     @change="selectFile(index)">
            </div>
          </li>
        </ul>
      </div>
      <div class="ContingPlanPopup_allBtn">
        <button class="infoManageBtn infoManageBtn_save" @click="addPlanDepartment">＋</button>
        <button class="infoManageBtn infoManageBtn_add" @click="clickSave">保存</button>
      </div>
    </section>

  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import { plansClient } from "../../../util/ClientHelper"
  import contingencyPlanHttp from "../../../util/ContingencyPlanHttp"
  let ContingencyPlanHttp=new contingencyPlanHttp()
  @Component
  export default class ContingPlanPopup extends Vue {
    input:string=''
    PlanType:string=''
    PlanTypes:{ id: number, code: string, name: string}[]=[]
    DisasterType:string=''
    DisasterTypes:{ id: number, code: string, name: string, relationId: number }[]=[]
    levelType:string='1级'
    levelTypes:string[]=[]
    departmentType:string= ""
    departmentTypes:{ did: number, department: string, scan: any}[]=[]
    PlanDepartments:{ departmentType:string, unitPlan:string, noteContent:string, fax:any, scan:number, }[]=[{
      departmentType:'',
      unitPlan:'',
      noteContent:'',
      fax:null,
      scan:0
    }]
    numberTag:number=0
    @Prop()
    closeContingPlanPopup
    @Watch('PlanType')
    changePlanType(val){
      this.PlanTypes.forEach(async v=>{
        if(v.name===val){
          this.DisasterTypes = await plansClient.getdetailEmergencyType(v.id)
          this.DisasterType=this.DisasterTypes[0].name
        }
      })
    }

    //选择传真文件
    selectFile(parmas:number){
      this.PlanDepartments[parmas].fax=this.$refs.fax[parmas]['files'][0]
      this.$refs.filesName[parmas].value=this.$refs.fax[parmas]['files'][0]['name']
    }
    //点击添加预案发送部门
    addPlanDepartment(){
      this.numberTag+=1
      this.PlanDepartments.push({
        departmentType:'',
        unitPlan:'',
        noteContent:'',
        fax:null,
        scan:this.numberTag
      })
    }

    //点击保存,录入预案
    async clickSave(){
      let params:any =[]
      this.PlanDepartments.forEach((v,i)=>{
        if(v.departmentType===''){return}
        params.push({
            e_name: this.DisasterType,
            department: v.departmentType,
            level: parseInt(this.levelType.replace('级','')),
            detail: v.unitPlan,
            measure: v.noteContent,
            scan: v.scan
        })
      })
      if(params.length===0){
        this.$message({
          message: '请选择要录入的部门并完善信息',
          type: 'warning'
        });
        return
      }
      let res = await ContingencyPlanHttp.addMoreContPlan({planMeasures:params})
      this.PlanDepartments.forEach((v,i)=>{
        if(v.departmentType&&this.PlanDepartments[v.scan].fax){
          res.forEach( async (k,j)=>{
            if(k.scan==v.scan){
              await ContingencyPlanHttp.updateContPlan({
                multipartFiles:v.fax,
                id:k.id,
                userId:'B3B4C7E051DE61EB7E83C96C4DDBEB0D'
              })
            }
          })
        }
      })
      this.$message({
        message: '预案录入成功',
        type: 'success'
      });
      this.closeContingPlanPopup()
      this.$emit('clickSave',true)
    }

    //获取各类型信息
    async getTypeInfos(){
      this.PlanTypes= await plansClient.getEmergencyType()
      this.PlanType=this.PlanTypes[0].name
      this.DisasterTypes = await plansClient.getdetailEmergencyType(this.PlanTypes[0].id)
      this.DisasterType=this.DisasterTypes[0].name
      this.levelTypes = ['1级', '2级', '3级', '4级']
      this.departmentTypes = await ContingencyPlanHttp.getDepartmentTypes()
    }
    mounted(){
      this.getTypeInfos()
    }

  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
#ContingPlanPopup{
  position: fixed;
  width: 1140px;
  top: 200px;
  left: 50%;
  margin-left: -570px;
  background: white;
  box-shadow: 0px 0px 5px rgba(137, 137, 137, 0.41);
  z-index: 99;
  .ContingPlanPopup_header{
    height: 36px;
    line-height: 36px;
    cursor: move;
    background: #11A9F5;
    >span{
      float: left;
      color: white;
      margin-left: 20px;
    }
    .el-icon-close{
      float: right;
      margin-right: 10px;
      font-size: 18px;/*no*/
      color: white;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .ContingPlanPopup_main{
    width: 100%;
    max-height: 700px;
    padding:  20px;
    overflow: auto;
    box-sizing: border-box;
    @include scrollStyle;
    .ContingPlan_selects{
      margin-bottom: 10px ;
      height: 40px;
      overflow: hidden;
      .Plan_select{
        float: left;
        width: 150px;
        margin-right: 30px;
      }
    }
    .ContingPlanPopup_bu{
      width: 1100px;
      overflow: hidden;
      .ContingPlanPopup_bu_top{
        height: 30px;
        line-height: 30px;
        li{
          float: left;
          margin-right: 10px;
        }
        li.bumen{
          width: 150px;
        }
        li.ker{
          width: 320px;

        }
        li.chuanzhen{
          width: 280px;
          margin-right: 0px;
        }
      }
      .ContingPlanPopup_bu_mid{
        height: 40px;
        line-height: 40px;
        margin-bottom: 10px;
        li{
          height: 40px;
          float: left;
          margin-right: 10px;
          overflow: hidden;
        }
        li:first-of-type{
          width: 150px;
        }
        li:nth-of-type(2),li:nth-of-type(3){
          width: 320px;
          box-sizing: border-box;
          input{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: none;
            outline: none;
            background: white;
            line-height: 38px;
          }
        }
        li:last-of-type{
          width: 280px;
          margin-right: 0px;
          border:1px solid #dcdfe6;
          box-sizing: border-box;
          border-radius: 3px;
          input{
            width: 220px;
            height: 100%;
            text-indent: 15px;
            box-sizing: border-box;
            border: none;
            outline: none;
            background: white;
            line-height: 38px;
          }
          .loading{
            float: right;
            width: 57px;
            height: 100%;
            line-height: 38px;
            text-align: center;
            border-left: 1px solid #dcdfe6;
            box-sizing: border-box;
            background: #F2F2F2;
            cursor: pointer;
            position: relative;
            .fileOne{
              height: 100%;
              width: 100%;
              opacity: 0;
              background: transparent;
              color: transparent;
              position: absolute;
              top: 0;
              left: 0;
            }
          }
          .loading:hover{
            background: #efefef;
          }
        }
      }
    }
    .ContingPlanPopup_allBtn{
      overflow: hidden;
      text-align: center;
      height: 40px;
      padding-top: 10px;
      .infoManageBtn_save{
        font-size: 14px;/*no*/
        border: 1px solid #D2D4DB;
        color: #11A9F5;
        font-weight: bold;
        margin-bottom: 10px;
        line-height: 27px;
        margin-right: 20px;
        margin-left: 400px;
      }
      .infoManageBtn_save:hover{
        border: 1px solid #11A9F5;
      }
    }
  }


}
</style>
