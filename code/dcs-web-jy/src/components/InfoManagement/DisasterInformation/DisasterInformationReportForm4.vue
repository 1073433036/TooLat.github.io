<template>
  <main id="reportFrom4">
    <header class="reportFrom1_title">农业损失</header>
    <section class="reportFrom1_main">
      <el-form :model="agricultureLoss" :rules="agricultureLossRules" ref="agricultureLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="agricultureLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="受灾面积" >
            <el-input class="width200" v-model="agricultureLoss.damArea"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="成灾面积" >
            <el-input class="width200" v-model="agricultureLoss.InuArea"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="绝收面积" >
            <el-input class="width200" v-model="agricultureLoss.cropArea"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="损失粮食	" >
            <el-input class="width200" v-model="agricultureLoss.LosGrain"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="损坏大棚" >
            <el-input class="width200" v-model="agricultureLoss.DamGreenhouse"></el-input>
          </el-form-item>
        </div>
        <el-form-item  label="受灾作物名称" >
          <el-input class="width600" v-model="agricultureLoss.affCropName"></el-input>
        </el-form-item>
      </el-form>
    </section>
    <header class="reportFrom1_title">林业损失</header>
    <section class="reportFrom1_main">
      <el-form :model="forestryLoss" :rules="forestryLossRules" ref="forestryLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="forestryLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="林木损失数" >
            <el-input class="width200" v-model="forestryLoss.forLoss"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="林业受灾面积" >
            <el-input class="width200" v-model="forestryLoss.forAffArea"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </section>
    <header class="reportFrom1_title">渔业损失</header>
    <section class="reportFrom1_main">
      <el-form :model="fisheryLoss" :rules="fisheryLossRules" ref="fisheryLoss" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400" label="经济损失" >
            <el-input class="width200" v-model="fisheryLoss.maneyLoss"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="捕捞船只翻船数" >
            <el-input class="width200" v-model="fisheryLoss.fisBoaCapNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" label="捕捞船只翻船总吨数" >
            <el-input class="width200" v-model="fisheryLoss.fisBoaCapTon"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" label="渔业受灾面积" >
            <el-input class="width200" v-model="fisheryLoss.FisAffArea"></el-input>
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
  export default class ReportFrom4 extends Vue {
    agricultureLoss:{
      maneyLoss:string,
      damArea:string,
      InuArea:string,
      cropArea:string,
      LosGrain:string,
      DamGreenhouse:string,
      affCropName:string
    }={
      maneyLoss:'',
      damArea:'',
      InuArea:'',
      cropArea:'',
      LosGrain:'',
      DamGreenhouse:'',
      affCropName:'',
    }
    forestryLoss:{
      maneyLoss:string,
      forLoss:string,
      forAffArea:string,
    }={
      maneyLoss:'',
      forLoss:'',
      forAffArea:'',
    }
    fisheryLoss:{
      maneyLoss:string,
      fisBoaCapNum:string,
      fisBoaCapTon:string,
      FisAffArea:string,
    }={
      maneyLoss:'',
      fisBoaCapNum:'',
      fisBoaCapTon:'',
      FisAffArea:'',
    }
    agricultureLossRules:{
      maneyLoss:roule[],
      damArea:roule[],
      InuArea:roule[],
      cropArea:roule[],
      LosGrain:roule[],
      DamGreenhouse:roule[],
      affCropName:roule[],
    }={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' },
        ],
      damArea:[
        { required: false, message: '', trigger: 'blur' },
        ],
      InuArea:[
        { required: false, message: '', trigger: 'blur' },
        ],
      cropArea:[
        { required: false, message: '', trigger: 'blur' },
        ],
      LosGrain:[
        { required: false, message: '', trigger: 'blur' },
        ],
      DamGreenhouse:[
        { required: false, message: '', trigger: 'blur' },
        ],
      affCropName:[
        { required: false, message: '', trigger: 'blur' },
        ],
    }
    forestryLossRules:{
      maneyLoss:roule[],
      forLoss:roule[],
      forAffArea:roule[],
    }={
      maneyLoss:[
        { required: false, message: '', trigger: 'blur' }
      ],
      forLoss:[
        { required: false, message: '', trigger: 'blur' }
      ],
      forAffArea:[
        { required: false, message: '', trigger: 'blur' }
      ],
    }
    fisheryLossRules:{
      maneyLoss: roule[],
      fisBoaCapNum: roule[],
      fisBoaCapTon: roule[],
      FisAffArea: roule[],
    }={
      maneyLoss: [
        { required: false, message: '', trigger: 'blur' }
      ],
      fisBoaCapNum: [
        { required: false, message: '', trigger: 'blur' }
      ],
      fisBoaCapTon: [
        { required: false, message: '', trigger: 'blur' }
      ],
      FisAffArea: [
        { required: false, message: '', trigger: 'blur' }
      ],
    }
    name:string='reportFrom4'
    @Prop()
    submitFlag:any
    @Watch('submitFlag')
    changesubmitFlag(){
      this.$emit('submitFunction',{
        'agricultureLoss':JSON.stringify(this.agricultureLoss),
        'forestryLoss':JSON.stringify(this.forestryLoss),
        'fisheryLoss':JSON.stringify(this.fisheryLoss),
      })
    }
    submitForm(formName) {
      this.$refs[formName]['validate']((valid) => {
        if (valid) {
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    resetForm(formName) {
      this.$refs[formName]['resetFields']();
    }
    mounted(){

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
  #reportFrom4{
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
