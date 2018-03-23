<template>
  <main id="reportFrom5">
    <header class="reportFrom1_title">交通损失</header>
    <section class="reportFrom1_main">
      <el-form :model="trafficLoss" :rules="trafficLossRules" ref="trafficLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="trafficLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="道路堵塞或封闭数" >
            <el-input class="width200" v-model="trafficLoss.closedRoadCongestion"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="桥梁涵洞损坏数" >
            <el-input class="width200" v-model="trafficLoss.DamBriCul"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="公路中断数" >
            <el-input class="width200" v-model="trafficLoss.higIntNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="铁路中断数	" >
            <el-input class="width200" v-model="trafficLoss.RailroadsNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="公路中断长度" >
            <el-input class="width200" v-model="trafficLoss.HigIntLength"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="铁路中断长度	" >
            <el-input class="width200" v-model="trafficLoss.RailroadsLength"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="飞机航班延误数" >
            <el-input class="width200" v-model="trafficLoss.planeFlightNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="飞机航班取消数	" >
            <el-input class="width200" v-model="trafficLoss.AirFlightCancell"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="运输船只翻沉数" >
            <el-input class="width200" v-model="trafficLoss.shipmentBeforehand"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="交通工具损坏数	" >
            <el-input class="width200" v-model="trafficLoss.transportationDamage"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="交通停运时间" >
            <el-input class="width200" v-model="trafficLoss.trafficStoppageTime"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="旅客滞留数	" >
            <el-input class="width200" v-model="trafficLoss.passengersNum"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <header class="reportFrom1_title">商业损失</header>
    <section class="reportFrom1_main">
      <el-form :model="businessLoss" :rules="businessLossanyRules" ref="businessLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="businessLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="停业商店数" >
            <el-input class="width200" v-model="businessLoss.shopClosedNum"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <header class="reportFrom1_title">其他损失</header>
    <section class="reportFrom1_main">
      <el-form :model="othersLoss" :rules="othersLossanyRules" ref="othersLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="othersLoss.maneyLoss"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item  label="其他行业影响" >
            <el-input class="width600" v-model="othersLoss.otherLoss"></el-input>
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
    trafficLoss:{
      maneyLoss:string,
      closedRoadCongestion:string,
      DamBriCul:string,
      higIntNum:string,
      RailroadsNum:string,
      HigIntLength:string,
      RailroadsLength:string,
      planeFlightNum:string,
      AirFlightCancell:string,
      shipmentBeforehand:string,
      transportationDamage:string,
      trafficStoppageTime:string,
      passengersNum:string,
    }
    = {
      maneyLoss:'',
      closedRoadCongestion:'',
      DamBriCul:'',
      higIntNum:'',
      RailroadsNum:'',
      HigIntLength:'',
      RailroadsLength:'',
      planeFlightNum:'',
      AirFlightCancell:'',
      shipmentBeforehand:'',
      transportationDamage:'',
      trafficStoppageTime:'',
      passengersNum:'',
    }
    businessLoss:{
      maneyLoss:string,
      shopClosedNum:string,
    }
    ={
      maneyLoss:'',
      shopClosedNum:'',
    }
    othersLoss:{
      maneyLoss:string,
      otherLoss:string
    }
    ={
      maneyLoss:'',
      otherLoss:''
    }
    trafficLossRules:{
      maneyLoss:roule[]
      closedRoadCongestion:roule[]
      DamBriCul:roule[]
      higIntNum:roule[]
      RailroadsNum:roule[]
      HigIntLength:roule[]
      RailroadsLength:roule[]
      planeFlightNum:roule[]
      AirFlightCancell:roule[]
      shipmentBeforehand:roule[]
      transportationDamage:roule[]
      trafficStoppageTime:roule[]
      passengersNum:roule[]
    }
    = {
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      closedRoadCongestion:[
        { required: false, message: '', trigger: 'blur' },
        ],
      DamBriCul:[
        { required: false, message: '', trigger: 'blur' },
        ],
      higIntNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      RailroadsNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      HigIntLength:[
        { required: false, message: '', trigger: 'blur' },
        ],
      RailroadsLength:[
        { required: false, message: '', trigger: 'blur' },
        ],
      planeFlightNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
      AirFlightCancell:[
        { required: false, message: '', trigger: 'blur' },
        ],
      shipmentBeforehand:[
        { required: false, message: '', trigger: 'blur' },
        ],
      transportationDamage:[
        { required: false, message: '', trigger: 'blur' },
        ],
      trafficStoppageTime:[
        { required: false, message: '', trigger: 'blur' },
        ],
      passengersNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    businessLossanyRules:{
      maneyLoss:roule[]
      shopClosedNum:roule[]
    }
    ={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      shopClosedNum:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    othersLossanyRules:{
      maneyLoss:roule[]
      otherLoss:roule[]
    }
    ={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      otherLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    name:string='reportFrom5'

    @Prop()
    submitFlag:any

    @Watch('submitFlag')
    changesubmitFlag(){
      this.$emit('submitFunction',{
        'trafficLoss':JSON.stringify(this.trafficLoss),
        'businessLoss':JSON.stringify(this.businessLoss),
        'othersLoss':JSON.stringify(this.othersLoss)
      })
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
