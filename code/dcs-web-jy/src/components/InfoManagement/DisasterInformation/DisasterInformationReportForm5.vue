<template>
  <main id="reportFrom5">
    <header class="reportFrom1_title">电力损失</header>
    <section class="reportFrom1_main">
      <el-form :model="electricityLoss" :rules="electricityLossRules" ref="electricityLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="electricityLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="倒断电杆数" >
            <el-input class="width200" v-model="electricityLoss.PouBroPole"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="倒断电塔数" >
            <el-input class="width200" v-model="electricityLoss.invPowTowerNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="电力线路损毁长度" >
            <el-input class="width200" v-model="electricityLoss.PowLinDamLeng"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="电力中断时长	" >
            <el-input class="width200" v-model="electricityLoss.powIntTime"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="停电用户数" >
            <el-input class="width200" v-model="electricityLoss.PowUsers"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <header class="reportFrom1_title">通讯损失</header>
    <section class="reportFrom1_main">
      <el-form :model="communicationLoss" :rules="communicationLossRules" ref="communicationLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="communicationLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="通信中断数" >
            <el-input class="width200" v-model="communicationLoss.ComIntNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="通信中断时长	" >
            <el-input class="width200" v-model="communicationLoss.comIntTime"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <header class="reportFrom1_title">畜牧业损失</header>
    <section class="reportFrom1_main">
      <el-form :model="animalsLoss" :rules="animalsLossRules" ref="animalsLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="animalsLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="牧草受灾面积	" >
            <el-input class="width200" v-model="animalsLoss.GraAffArea"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="饮水困难牲畜数" >
            <el-input class="width200" v-model="animalsLoss.DriWatLivTocNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="死亡大牲畜数	" >
            <el-input class="width200" v-model="animalsLoss.newPigKilAniNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="受灾大牲畜数" >
            <el-input class="width200" v-model="animalsLoss.newPigAffNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="死亡家禽数	" >
            <el-input class="width200" v-model="animalsLoss.deadPoulNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item  label="影响牧草名称" >
            <el-input class="width600" v-model="animalsLoss.infHerName"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import roule from '../../../interface/formRoule'
  @Component
  export default class ReportFrom5 extends Vue {
    electricityLoss:{
      maneyLoss:string,
      PouBroPole:string,
      invPowTowerNum:string,
      PowLinDamLeng:string,
      powIntTime:string,
      PowUsers:string,
    }= {
      maneyLoss:'',
      PouBroPole:'',
      invPowTowerNum:'',
      PowLinDamLeng:'',
      powIntTime:'',
      PowUsers:'',
    }
    communicationLoss:{
      maneyLoss:string,
      ComIntNum:string,
      comIntTime:string,
    }={
      maneyLoss:'',
      ComIntNum:'',
      comIntTime:'',
    }
    animalsLoss:{
      maneyLoss:string,
      GraAffArea:string,
      DriWatLivTocNum:string,
      newPigKilAniNum:string,
      newPigAffNum:string,
      deadPoulNum:string,
      infHerName:string,
    }={
      maneyLoss:'',
      GraAffArea:'',
      DriWatLivTocNum:'',
      newPigKilAniNum:'',
      newPigAffNum:'',
      deadPoulNum:'',
      infHerName:'',
    }
    electricityLossRules:{
      maneyLoss:roule[]
      PouBroPole:roule[]
      invPowTowerNum:roule[]
      PowLinDamLeng:roule[]
      powIntTime:roule[]
      PowUsers:roule[]
    }= {
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      PouBroPole:[
        { required: false, message: '', trigger: 'blur' },
        ],
      invPowTowerNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      PowLinDamLeng:[
        { required: false, message: '', trigger: 'blur' },
        ],
      powIntTime:[
        { required: false, message: '', trigger: 'blur' },
        ],
      PowUsers:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    communicationLossRules:{
      maneyLoss:roule[]
      ComIntNum:roule[]
      comIntTime:roule[]
    } ={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      ComIntNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      comIntTime:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    animalsLossRules:{
      maneyLoss:roule[]
      GraAffArea:roule[]
      DriWatLivTocNum:roule[]
      newPigKilAniNum:roule[]
      newPigAffNum:roule[]
      deadPoulNum:roule[]
      infHerName:roule[]
    }={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      GraAffArea:[
        { required: false, message: '', trigger: 'blur' },
        ],
      DriWatLivTocNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      newPigKilAniNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      newPigAffNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      deadPoulNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      infHerName:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    name:string='reportFrom5'
    @Prop()
    submitFlag:any
    @Watch('submitFlag')
    changesubmitFlag(){
      this.$emit('submitFunction',{
        'electricityLoss':JSON.stringify(this.electricityLoss),
        'communicationLoss':JSON.stringify(this.communicationLoss),
        'animalsLoss':JSON.stringify(this.animalsLoss),
      })
    }
    handleRemove(file, fileList) {
      console.log(file, fileList);
    }
    handlePreview(file) {
      console.log(file);
    }
    handleExceed(files, fileList) {
      Vue['prototype']['$message']({ type: 'warning', message: `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件` })
    }
    submitForm(formName) {
      this.$refs[formName]['validate']((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    resetForm(formName) {
      this.$refs[formName]['resetFields']();
    }

  }
</script>
<style lang="scss" scoped>
  .width400{
    width: 450px;
  }
  .float_l{
    float: left;
  }
  .width200{
    width: 200px;
  }
  .hidden{
    overflow: hidden;
  }
  .width600{
    width: 650px;
  }
  #reportFrom5{
    .reportFrom1_title{
      font-size: 14px;
      font-weight: bold;
      color: #11a9f5;
      height: 30px;
      line-height: 30px;
    }
    .reportFrom1_main{
      padding-left: 15px;

    }
  }
</style>
<style>
  .el-form-item__label{
    text-align: left!important;
  }
</style>
