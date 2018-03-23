<template>
  <main id="reportFrom3">
    <header class="reportFrom1_title">水文水利损失</header>
    <section class="reportFrom1_main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" prop="maneyLoss" label="经济损失" >
            <el-input class="width200" v-model="ruleForm.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="dieUnWatResNum" label="死水位以下水库数" >
            <el-input class="width200" v-model="ruleForm.dieUnWatResNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="breBigResNum" label="损毁大型水库数" >
            <el-input class="width200" v-model="ruleForm.breBigResNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="driRivRes" label="水库塘堰干涸" >
            <el-input class="width200" v-model="ruleForm.driRivRes"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="breMidResNum" label="损毁中型水库数	" >
            <el-input class="width200" v-model="ruleForm.breMidResNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="breProNum" label="提拔决口数" >
            <el-input class="width200" v-model="ruleForm.breProNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="breSmaResNum" label="损毁小型水库数" >
            <el-input class="width200" v-model="ruleForm.breSmaResNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="damRivLeng" label="损毁河堤长度" >
            <el-input class="width200" v-model="ruleForm.damRivLeng"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="damDreLeng" label="损毁沟渠长度" >
            <el-input class="width200" v-model="ruleForm.damDreLeng"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="damBriNum" label="损毁桥梁数" >
            <el-input class="width200" v-model="ruleForm.damBriNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400"  label="供水管网损毁长度" prop="supNetDamWatLen" >
            <el-input class="width200" v-model="ruleForm.supNetDamWatLen"></el-input>
          </el-form-item>
        </div>
        <el-form-item  label="水文情况描述"  prop="hyConDes" >
          <el-input class="width600" v-model="ruleForm.hyConDes"></el-input>
        </el-form-item>
      </el-form>
    </section>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import roule from '../../../interface/formRoule'
  interface ruleform {
    maneyLoss: string,
    dieUnWatResNum: string,
    breBigResNum: string,
    driRivRes: string,
    breMidResNum: string,
    breProNum: string,
    breSmaResNum:string,
    damRivLeng:string,
    damDreLeng:string,
    damBriNum:string,
    supNetDamWatLen:string,
    hyConDes:string,
  }
  @Component
  export default class ReportFrom3 extends Vue {
    ruleForm:ruleform={
      maneyLoss: '',
      dieUnWatResNum: '',
      breBigResNum: '',
      driRivRes: '',
      breMidResNum: '',
      breProNum: '',
      breSmaResNum: '',
      damRivLeng:'',
      damDreLeng:'',
      damBriNum:'',
      supNetDamWatLen:'',
      hyConDes:'',
    }
    rules:{
      maneyLoss:roule[],
      dieUnWatResNum:  roule[],
      breBigResNum: roule[],
      driRivRes:roule[],
      breMidResNum: roule[],
      breProNum: roule[],
      breSmaResNum: roule[],
      damRivLeng:roule[],
      damDreLeng:roule[],
      damBriNum:roule[],
      supNetDamWatLen:roule[],
      hyConDes: roule[],
    }={
      maneyLoss: [
        { required: false, message: '', trigger: 'blur' },
      ],
      dieUnWatResNum:  [
        { required: false, message: '', trigger: 'blur' },
      ],
      breBigResNum: [
        { required: false, message: '', trigger: 'blur' },
      ],
      driRivRes:  [
        { required: false, message: '', trigger: 'blur' },
      ],
      breMidResNum:  [
        { required: false, message: '', trigger: 'blur' },
      ],
      breProNum:  [
        { required: false, message: '', trigger: 'blur' },
      ],
      breSmaResNum:  [
        { required: false, message: '', trigger: 'blur' },
      ],
      damRivLeng: [
        { required: false, message: '', trigger: 'blur' },
      ],
      damDreLeng: [
        { required: false, message: '', trigger: 'blur' },
      ],
      damBriNum: [
        { required: false, message: '', trigger: 'blur' },
      ],
      supNetDamWatLen: [
        { required: false, message: '', trigger: 'blur' },
      ],
      hyConDes: [
        { required: false, message: '', trigger: 'blur' },
      ],
    }
    name:string='reportFrom3'
    @Prop()
    submitFlag:any
    @Watch('submitFlag')
    changesubmitFlag(){
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          this.$emit('submitFunction',{'hydrologyLoss':JSON.stringify(this.ruleForm)})
        } else {
          console.log('error submit!!水文水利损失验证失败');
          this.$emit('submitFunction',false)
          setTimeout(()=>{
            this.$refs['ruleForm']['clearValidate']();
          },3000)
          return false;
        }
      });
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
  #reportFrom3{
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

