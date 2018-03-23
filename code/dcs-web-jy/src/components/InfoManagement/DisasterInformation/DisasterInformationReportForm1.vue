<template>
  <main id="reportFrom1">
    <header class="reportFrom1_title">灾情基本信息</header>
    <section class="reportFrom1_main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <div class="hidden">
          <el-form-item label="灾害类型"  prop="disaster" class="float_l width400">
            <el-select v-model="ruleForm.disaster"
                       class="width200"
                       clearable
                       placeholder="请选择">
              <el-option
                v-for="(item,key) in disasterType"
                :key="key"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="float_l width400"  label="二级灾害" prop="secondDisaster">
            <el-input class="width200" v-model="ruleForm.secondDisaster"></el-input>
          </el-form-item>
        </div>
        <div class="hidden"  >
          <el-form-item label="起始时间"  class="float_l width400" required>
            <el-col :span="11">
              <el-form-item prop="starttime" class="width200">
                <el-date-picker type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                class="width200"
                                placeholder="选择日期"
                                v-model="ruleForm.starttime"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="结束时间"  class="float_l width400">
            <el-col :span="11">
              <el-form-item prop="endtime" class="width200">
                <el-date-picker type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                class="width200"
                                placeholder="选择时间"
                                v-model="ruleForm.endtime"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="origin"  label="采集来源">
            <el-input class="width200" v-model="ruleForm.origin"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400"  label="直接经济损失">
            <el-input class="width200" v-model="ruleForm.economyLoss"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="releaseUnit"  label="上报单位">
            <el-input class="width200" v-model="ruleForm.releaseUnit"></el-input>
          </el-form-item>
          <el-form-item label="上报时间"  class="float_l width400" required>
            <el-col :span="11">
              <el-form-item prop="releaseTime" class="width200">
                <el-date-picker type="datetime"
                                format="yyyy-MM-dd HH:mm"
                                class="width200"
                                placeholder="选择时间"
                                v-model="ruleForm.releaseTime"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="reportMan"  label="上报人">
            <el-input class="width200" v-model="ruleForm.reportMan"></el-input>
          </el-form-item>
          <el-form-item class="float_l width400" prop="phone"  label="联系方式">
            <el-input class="width200" v-model="ruleForm.phone"></el-input>
          </el-form-item>
        </div>
        <div class="hidden">
          <el-form-item class="float_l width400" prop="disasterStatus"  label="灾情状态">
            <el-select v-model="ruleForm.disasterStatus"
                       class="width200"
                       clearable
                       placeholder="请选择">
              <el-option
                v-for="item in disasterStatusType"
                :key="item.value"
                :label="item.label"
                :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="上传附件" >
          <div class="fileText">
            <div class="fileText_box"
                 v-for="(item,key) in fileName" :key="key" >
              <input class="fileText_input" v-blur="setFileName" type="text" v-model="fileName[key]">
                <i class="el-icon-circle-close-outline" @click="deleteFile(key)"></i>
            </div>
          </div>
          <span class="fileBox">
            浏览 ...
             <input type="file" multiple name="files" value="点击上传" id="fileOne" @change="selectFile">
          </span>
        </el-form-item>
        <el-form-item  label="灾情概述" >
          <el-input class="width600" resize="none" :rows="3"  type="textarea" v-model="ruleForm.remarks"></el-input>
        </el-form-item>
        <el-form-item  label="灾害影响概述" >
          <el-input class="width600" resize="none" :rows="3"  type="textarea" v-model="ruleForm.influenceDesc"></el-input>
        </el-form-item>
        <el-form-item  label="天气过程概述" >
          <el-input class="width600" resize="none" :rows="3"  type="textarea" v-model="ruleForm.weatherDesc"></el-input>
        </el-form-item>
        <el-form-item  label="预警发布情况描述" >
          <el-input class="width600" resize="none" :rows="3"  type="textarea" v-model="ruleForm.warningsignDesc"></el-input>
        </el-form-item>
      </el-form>
    </section>
  </main>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import moment from 'moment'
  import roule from '../../../interface/formRoule'
  import DisasterService from '../../../util/DisasterService'
  let DisasterHttp = new DisasterService()
  interface formdata {
    disaster:string,
    secondDisaster: string,
    starttime: string,
    endtime: string,
    origin:string,
    economyLoss:string,
    reportMan:string,
    phone:string,
    files?:File|null,
    releaseUnit:string,
    releaseTime:string,
    disasterStatus:string,
    remarks:string,
    influenceDesc:string,
    weatherDesc:string,
    warningsignDesc:string
    sourceName:string
  }
  @Component
  export default class ReportFrom1 extends Vue {
    disasterType:any[]= []
    disasterStatusType:Array<{ value: string, label: string }>=[
      {
        value: 'happening',
        label: '正在发生'
      },
      {
        value: 'ended',
        label: '已结束'
      },
    ]
    ruleForm:formdata={
      disaster:'',
      secondDisaster: '',
      starttime: '',
      endtime: '',
      origin:'',
      economyLoss:'',
      reportMan:'',
      phone:'',
      files:null,
      releaseUnit:'',
      releaseTime:'',
      disasterStatus:'',
      remarks:'',
      influenceDesc:'',
      weatherDesc:'',
      warningsignDesc:'',
      sourceName:''
    }
    formData:formdata={
      disaster:'',
      secondDisaster: '',
      starttime: '',
      endtime: '',
      origin:'',
      economyLoss:'',
      reportMan:'',
      phone:'',
      files:null,
      releaseUnit:'',
      releaseTime:'',
      disasterStatus:'',
      remarks:'',
      influenceDesc:'',
      weatherDesc:'',
      warningsignDesc:'',
      sourceName:''
    }
    rules:{
      disaster:roule[]
      secondDisaster:roule[]
      starttime: roule[]
      endtime: roule[]
      origin:roule[]
      economyLoss:roule[]
      reportMan:roule[]
      phone:roule[]
      files:roule[]
      releaseUnit:roule[]
      releaseTime:roule[]
      disasterStatus:roule[]
      remarks:roule[]
      influenceDesc:roule[]
      weatherDesc:roule[]
      warningsignDesc:roule[]
    } = {
      disaster: [
        { required: true, message: '请选择灾害类型', trigger: 'blur' }
      ],
      secondDisaster: [
        { required: false, message: '选择类型', trigger: 'change' }
      ],
      starttime: [
        { type: 'date', required: true, message: '请选择时间', trigger: 'blur' }
      ],
      endtime: [
        { required: false, message: '请选择时间', trigger: 'change' }
      ],
      origin:[
        { required: true, message: '请填写采集来源', trigger: 'blur' },
      ],
      economyLoss:[
        { required: true, message: '请输入损失', trigger: 'blur' },
      ],
      reportMan:[
        { required: true, message: '上报人不能为空', trigger: 'blur' }
      ],
      phone:[
        { required: true, message: '联系方式不能为空', trigger: 'blur' }
      ],
      files:[
        { required: false, message: '', trigger: 'blur' }
      ],
      releaseUnit:[
        { required: true, message: '请填写上报单位', trigger: 'blur' }
      ],
      releaseTime:[
        { type: 'date', required: true, message: '请选择上报时间', trigger: 'blur' }
      ],
      disasterStatus:[
        { required: true, message: '请选择灾情状态', trigger: 'blur' }
      ],
      remarks:[
        { required: false, message: '请填写', trigger: 'blur' }
      ],
      influenceDesc:[
        { required: false, message: '请填写', trigger: 'blur' }
      ],
      weatherDesc:[
        { required: false, message: '请填写', trigger: 'blur' }
      ],
      warningsignDesc:[
        { required: false, message: '请填写', trigger: 'blur' }
      ],
    }
    name:string='reportFrom1'
    fileName:string[]=[]
    disabledFlag:boolean=true
    file:any=[]
    //获取文件对象数组
    selectFile():void{
      if(this.file.length>=3){
        this.$message({
          duration:2000,
          showClose: true,
          type: 'warning',
          message: '最多只能上传3个文件'
        });
        return
      }
      // let file:any = document.getElementById('fileOne')['files'][0]
      let el:any = <HTMLInputElement>document.getElementById('fileOne')
      let file = el['files'][0]
      this.fileName.push(file.name)
      this.disabledFlag=false
      this.file.push(file)
    }
    //文件输入框失去焦点设置文件名
    setFileName(el):void{
      let flag=false
      this.fileName.forEach((v,i)=>{
        if(v==''){
          flag=true
        }
        if(/,|，/g.test(v)){
          this.fileName[i]=v.replace(',','').replace('，','')
        }
      })
      if(flag){
        this.$message({
          duration:2000,
          showClose: true,
          type: 'error',
          message: '文件名不能为空'
        });
        el.classList.add('fileText_input_el')
      }else {
        el.classList.remove('fileText_input_el')
      }
    }
    //删除文件
    deleteFile(key:number):void{
      this.fileName.splice(key,1)
      this.file.splice(key,1)
      console.log(this.fileName)
      console.log(this.file)
    }
    @Prop()
    submitFlag:any
    @Watch('submitFlag')
    changesubmitFlag():void{
      this.ruleForm.files=this.file
      this.ruleForm.sourceName=''
      console.log(this.ruleForm.files)
      this.fileName.forEach(v=>{
        this.ruleForm.sourceName+=v+','
      })
      this.ruleForm.sourceName =  this.ruleForm.sourceName.substr(0, this.ruleForm.sourceName.length-1)
      console.log(this.ruleForm.sourceName)
      for(let key in this.ruleForm){
        if(key=='starttime'||key=='endtime'||key=='releaseTime'){
          this.formData[key]=this.ruleForm[key]?moment(this.ruleForm[key]).format('YYYY-MM-DD HH:mm'):''
        }else {
          this.formData[key]=this.ruleForm[key]
        }
      }
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          this.$emit('submitFunction',this.formData)
        } else {
          console.log('error submit!!灾情基本信息验证失败');
          this.$emit('submitFunction',false)
          Vue['prototype']['$message']({
            duration:2000,
            showClose: true,
            type: 'warning',
            message: '必填信息不能为空!'
          });
          setTimeout(()=>{
            this.$refs['ruleForm']['clearValidate']();
          },3000)
          return false;
        }
      });
    }

    //浏览器下载指定内容
    downloadFile(fileName, content):void{
      console.log(fileName,content)
      var aLink = document.createElement('a');
      var blob = new Blob([content]);
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", false, false);//
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      aLink.dispatchEvent(evt);
      if (navigator.userAgent.indexOf('Firefox') >= 0)
        aLink.click();
    }
    submitForm(formName):void {
      let el:any = <HTMLInputElement>document.getElementById('fileOne')
      let file:any = el['files'][0]
      this.$refs[formName]['validate']((valid) => {
        console.log(this.ruleForm)
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    resetForm(formName):void {
      this.$refs[formName]['resetFields']();
    }
    //获取灾情类别
    async getDisasterType():Promise<void>{
      let res = await DisasterHttp.getDisasterType()
      this.disasterType=res
    }
    mounted():void{
      this.getDisasterType()
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
    width:650px;
  }
  #reportFrom1{
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
  .fileText{
    float: left;
    width: 573px;
    outline: none;
    height:38px;
    border: 1px solid #dcdfe6;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    border-right:none ;
    line-height: 37px;
    text-indent: 15px;
    background: transparent;
    outline: none;
    .fileText_box{
      width: 33.3333%;
      height: 100%;
      float: left;
      position: relative;
      box-sizing: border-box;
      .fileText_input{
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        float: left;
        text-align: center;
        background: transparent;
        padding: 0;
        padding-right: 30px;
        padding-left: 5px;
        box-sizing: border-box;
        margin: 0;
        border-radius: 3px;
        overflow: hidden;
        transition: all .4s;
      }
      .fileText_input_el{
        box-shadow: 0px 0px 10px #a5a7ac inset;
        transition: all .4s;
      }
      .el-icon-circle-close-outline{
        opacity: 0;
        transition: all .4s;
        position: absolute;
        top: 13px;
        right: 13px;
        cursor: pointer;
        width: 15px;
        height: 15px;
        text-align: center;
        line-height: 15px;
        font-size: 14px;/*no*/
      }
      .el-icon-circle-close-outline:hover{
        color: red;
      }
      .el-icon-circle-close-outline:before{
        margin-left: -15px;
      }
    }
    .fileText_box:hover{
      .fileText_input{
        box-shadow: 0px 0px 10px  #a5a7ac inset;
        transition: all .4s;
      }
      .el-icon-circle-close-outline{
        opacity: 1;
        transition: all .4s;
      }
    }
  }
  .fileBox{
    float: left;
    width: 74px;
    height: 38px;
    background: #F2F2F2;
    border: 1px solid #dcdfe6;
    overflow: hidden;
    position: relative;
    line-height: 37px;
    text-align: center;
    transition: all .4s;
  }
  .fileBox:hover{
    transition: all .4s;
    background: #e9e9e9;
  }
  #fileOne{
    height: 100%;
    width: 100%;
    opacity: 0;
    background: transparent;
    color: transparent;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
<style>
  .el-form-item__label{
    text-align: left!important;
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
    border-color: #d8dce5 !important;
  }
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
    border-color: #d8dce5 !important;
  }
</style>
