<template>
  <main id="reportFrom2">
    <header class="reportFrom1_title">灾情基本损失</header>
    <section class="reportFrom1_main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item class="float_l width400"
                        prop="disasterAllNumber"
                        label="受灾总人数">
            <el-input class="width200" v-model="ruleForm.disasterAllNumber"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"
                        label="受伤人数"
                        prop="bruiseNumber">
            <el-input class="width200" v-model="ruleForm.bruiseNumber"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400"
                        label="死亡人数"
                        prop="dieNumber">
            <el-input class="width200" v-model="ruleForm.dieNumber"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"
                        label="失踪人数"
                        prop="missingNumber">
            <el-input class="width200" v-model="ruleForm.missingNumber"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400"
                        label="安置转移人数"
                        prop="moveNumber">
            <el-input class="width200" v-model="ruleForm.moveNumber"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"
                        label="饮水困难"
                        prop="noWaterNumber">
            <el-input class="width200" v-model="ruleForm.noWaterNumber"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400"
                        label="倒塌房屋数"
                        prop="housesCollapsedNum">
            <el-input class="width200" v-model="ruleForm.housesCollapsedNum"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"
                        label="损坏房屋数"
                        prop="damageHouseNum">
            <el-input class="width200" v-model="ruleForm.damageHouseNum"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400"
                        label="停课学校数"
                        prop="closeSchoolNumber">
            <el-input class="width200" v-model="ruleForm.closeSchoolNumber"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"
                        label="停产工厂数"
                        prop="closeFactoryNumber">
            <el-input class="width200" v-model="ruleForm.closeFactoryNumber"></el-input>
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
  interface ruleform{
    bruiseNumber: string
    disasterAllNumber: string
    dieNumber: string
    missingNumber: string
    moveNumber: string
    noWaterNumber: string
    housesCollapsedNum:string
    damageHouseNum:string
    closeSchoolNumber: string
    closeFactoryNumber:string
  }
  @Component
  export default class ReportFrom2 extends Vue {
    ruleForm:ruleform={
      bruiseNumber: '',
      disasterAllNumber: '',
      dieNumber: '',
      missingNumber: '',
      moveNumber: '',
      noWaterNumber: '',
      housesCollapsedNum:'',
      damageHouseNum:'',
      closeSchoolNumber: '',
      closeFactoryNumber:'',
    }
    rules:{
      bruiseNumber:roule[]
      disasterAllNumber:roule[]
      dieNumber: roule[]
      missingNumber:roule[]
      moveNumber: roule[]
      noWaterNumber: roule[]
      closeSchoolNumber:roule[]
      closeFactoryNumber:roule[]
      housesCollapsedNum:roule[]
      damageHouseNum:roule[]
    }={
      bruiseNumber: [
        { required: false, message: '请输入受灾人数', trigger: 'blur' },
      ],
      disasterAllNumber: [
        { required: false, message: '请输入总受灾人数', trigger: 'blur' },
      ],
      dieNumber: [
        { required: false, message: '请输入死亡人数', trigger: 'blur' },
      ],
      missingNumber: [
        { required: false, message: '请输入失踪人数', trigger: 'blur' },
      ],
      moveNumber: [
        { required: false, message: '请输入安置人数', trigger: 'blur' },
      ],
      noWaterNumber: [
        { required: false, message: '', trigger: 'blur' },
      ],
      closeSchoolNumber: [
        { required: false, message: '请输入', trigger: 'blur' },
      ],
      closeFactoryNumber:[
        { required: false, message: '请输入', trigger: 'blur' },
      ],
      housesCollapsedNum:[
        { required: false, message: '请输入', trigger: 'blur' },
      ],
      damageHouseNum:[
        { required: false, message: '请输入', trigger: 'blur' },
      ],
    }
    name:string='reportFrom2'
    @Prop()
    submitFlag:any
    @Watch('submitFlag')
    changesubmitFlag(){
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          this.$emit('submitFunction',{
            'basicLoss':JSON.stringify(this.ruleForm),
            'injuryPerson':this.ruleForm.dieNumber
          })
        } else {
          console.log('error submit!!灾情基本损失验证失败');
          this.$emit('submitFunction',false)
          setTimeout(()=>{
            this.$refs['ruleForm']['clearValidate']();
          },3000)
          return false;
        }
      });
    }
    submitForm(formName) {

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
  #reportFrom2{
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
