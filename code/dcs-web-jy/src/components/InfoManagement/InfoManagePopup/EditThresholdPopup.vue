<template>
  <main class="EditThresholdPopup" v-drag :class="this.thresholdData.className">
    <header class="threshold_header">
     修改{{this.thresholdData.data.name}}阈值信息
      <i class="el-icon-close threshold_close" @click="closeThresholdPopup"></i>
    </header>
    <section class="threshold_main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="(item,key) in EditThresholdData"
                      class="EditThresholdForm"
                      :key="key"
                      :label="item"
                      :prop="key">
          <el-input v-model.number="ruleForm[key]"></el-input>
        </el-form-item>
        <div class="EditThresholdForm_btn">
          <el-button type="primary" class="btn_1" @click="submitForm()">确定</el-button>
          <el-button class="btn_2" @click="resetForm()">重置</el-button>
        </div>
      </el-form>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  @Component
  export default class EditThresholdPopup extends Vue {
    ruleForm:any= {}
    rules:any= {}
    EditThresholdData:any={}
    @Prop()
    closeThresholdPopup
    @Prop()
    thresholdData
    @Watch('YuZhiInfo')
    changeYuZhiInfo(val){
      this.parsingJson(this.thresholdData.data.threshold)
    }
    //解析json字符串
    parsingJson(par:string){
      let obj = JSON.parse(par)
      this.ruleForm=obj
      for(let key in obj){
        let str:any
        if(key.indexOf('p')!=-1){
          if(key.replace('p','')=='0'){
            str=`现在`
          }else {
            str=`过去${key.replace('p','')}小时`
          }
        }
        if(key.indexOf('r')!=-1){
          str=`未来${key.replace('r','')}小时`
        }
        this.EditThresholdData[key]=str
        this.rules[key]=[{ required: true, message: '必填', trigger: 'change' }]
      }
    }
    submitForm() {
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          this.thresholdData.data.threshold=JSON.stringify(this.ruleForm)
          this.$emit('getEditThresholdData',this.thresholdData)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    resetForm() {
      this.$refs['ruleForm']['resetFields']();
    }
    mounted(){
      this.parsingJson(this.thresholdData.data.threshold)
    }
  }
</script>

<style lang="scss" scoped>
  .EditThresholdPopup{
    box-shadow: 0px 0px 15px rgba(53, 53, 53, 0.30);
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -210px;
    margin-top: -240px;
    overflow: hidden;
    background: white;
    z-index: 1000;
    .threshold_header{
      position: relative;
      line-height: 36px;
      height: 36px;
      color: white;
      background: #11A9F5;
      cursor: move;
      padding-left: 20px;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      padding-right: 40px;
      overflow: hidden;
      .threshold_close{
        position: absolute;
        text-align: center;
        cursor: pointer;
        font-size: 18px;
        top: 0;
        right: 0;
        height: 36px;
        width: 36px;
        color: white;
        line-height: 36px;
      }
    }
    .threshold_main{
      width:100%;
      padding:10px 0px;
      box-sizing: border-box;
      .demo-ruleForm{
        overflow: hidden;
      }
      .EditThresholdForm{
        width: 298px;
        height: 36px;
        float: left;
        margin-left: 20px;
      }
      .EditThresholdForm_btn{
        width:100%;
        float: left;
        text-align: center;
        padding-bottom: 2px;
        button{
          width: 100px;
          padding: 0px;
          line-height: 28px;
          height: 30px;
          text-align: center;
        }
        .btn_1{
          background: #11A9F5;
        }
        .btn_2{
          background: white;
        }
        .btn_1:hover{
          background: #11a0e8;
        }
        .btn_1:active{
          background: #11A9F5;
        }
      }
    }
  }
  .width650{
    width:650px;
  }
  .width335{
    width:335px;
  }
</style>
<style>
  .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
  .EditThresholdPopup .el-form-item__label{
    text-align: left;
  }
</style>
