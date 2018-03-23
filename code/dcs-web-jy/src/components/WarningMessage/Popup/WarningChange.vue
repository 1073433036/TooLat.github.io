<template>
  <div id="warning-change">
    <main class="warning-change-wrapper">
      <header>
        <span class="warning-change-title">预警变更</span>
        <i class="el-icon-close" @click.stop="closePopup(false)"></i>
      </header>
      <section>
        <el-form :model="warningData" ref="changeForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="预警信号" prop="typewarn" class="width100">
            <div class="signal-tag" v-for="(signal, index) in formData.typeWarn" :key="index"
                @click="selectWarningSignal(signal,index)">
              <el-tag style="margin-right: 10px;">
                {{signal.type + signal.level}}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="预警类型" prop="warnType" class="width50"  >
            <el-select v-model="formData.warnType" placeholder="请选择" disabled>
              <el-option v-for="(item,key) in warningTypes" :key="key" :label="item.color" :value="item"
                ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警等级" prop="level" class="width50">
            <el-select v-model="formData.level" placeholder="请选择" @change="levelChange">
              <el-option v-for="item in warningLevels"
                         :key="item.colour"
                         :label="item.level"
                         :value="item.colour"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录入人员" prop="forecaster" class="width50">
            <el-input v-model="formData.forecaster"></el-input>
          </el-form-item>
          <el-form-item label="签发人" prop="signer" class="width50">
            <el-select v-model="formData.signer" placeholder="请选择">
              <el-option v-for="val in signers" :key="val" :label="val" :value="val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警内容" prop="warningMessage" class="width100">
            <el-input type="textarea" :rows="3" resize="none" v-model="formData.warningMessage"></el-input>
          </el-form-item>
          <el-form-item label="防御指引" prop="warningGuide" class="width100">
            <el-input type="textarea" :rows="3" resize="none" v-model="formData.warningGuide"></el-input>
          </el-form-item>
          <!--短信内容-->
          <el-form-item label="短信内容" prop="smsMessage" class="width100">
            <el-input type="textarea" :rows="3" resize="none" v-model="formData.smsMessage"></el-input>
          </el-form-item>
          <div class="width100 width100_btn">
            <el-button type="primary" @click.stop="submitForm">提交</el-button>
          </div>
        </el-form>
      </section>
    </main>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  import { WarningTemplate, WarningForm, WarningDetail, DefenseGuide, Signal } from '../../../interface/WarningPublish'
  import InfoPublishHttp from '../../../util/InfoPublishHttp'

  @Component
  export default class WarningChange extends Vue {
    @Prop()
    warningData: WarningForm
    @Prop()
    closePopup: Function

    PUBLISH_TIME:string= moment().format('YYYY年MM月DD日HH时mm分')
    value:any=''
    selectedIndex: number = 0
    signers: string[] = []
    warningTypes: any[] = []
    warningLevels:any[] = []
    allWarningTypes:any=[]
    typeWarnIndex:number=0
    // warningLevels: string[] = []
    defenseGuides: any = {}
    formData: any = {
      warnType: '',
      level: '',
      typeWarn: [],
      forecaster: '',
      signer: '',
      smsMessage: '',
      warningMessage: '',
      warningGuide: ''
    }


    @Watch('selectedIndex')
    onSelectedIndex(nv: number, ov: number):void{

    }



    async mounted() {
      for (let i in this.formData) {
        if (i === 'warnType'||i === 'level')
          continue;
        if (i === 'typeWarn') {
          let warnTypes: string[] =['台风白色','寒冷橙色']||this.warningData[i].split(',');
          let arr=[]
          warnTypes.forEach(el =>{
            let str:string=el.length<4?'寒冷红色':el
            arr.push({
              type: str.substr(0,str.length-2),
              level: str.substr(str.length-2)
            })
          })
          this.formData[i]=arr
        } else {
          this.formData[i] = this.warningData[i];
        }
      }
      if (this.formData.typeWarn.length>0) {
        await this.getAllDefenseGuide()
        this.selectWarningSignal(this.formData.typeWarn[0],0)
      }
      this.getWarningTemplates()

    }

    //根据预警类型获取预警级别
    async getAllDefenseGuide(){
      let infoPublishHttp = new InfoPublishHttp()
      let res = await infoPublishHttp.getAllDefenseGuide()
      let obj:any={}
      res.forEach(v=>{
        if(obj[v.event_type]){
          obj[v.event_type].push(v)
        }else {
          obj[v.event_type]=[]
          obj[v.event_type].push(v)
        }
      })
      for(let key in obj){
        this.allWarningTypes.push({
          event_type:key,
          list:obj[key]
        })
      }
      infoPublishHttp=null
      res=null
      obj=null
    }
    selectWarning(index: number): void {
      if (this.selectedIndex !== index)
        this.selectedIndex = index;
    }

    generateWarningMsg(isAdded: boolean, isBtnClick?: boolean): void {
    /*  console.log('212121', isAdded);
      if(isAdded && isBtnClick)
        return;
      this.formData.warningGuide = '';
      let details = this.templatesDetail;
      let message: string = '';
      if(Object.keys(details).length) {
        let formData = this.formData;
        let signals: Signal[] = formData.typewarn;
        if(isAdded) {
          signals = signals.concat([
            {type: formData.warnType, level: formData.level}
          ]);
        }

        for(let signal of signals) {
          if(signal.type in details === false)
            continue;
          if(message.length)
            message += '\n';
          message += details[signal.type].publishRelease.replace('{时间}', this.PUBLISH_TIME)
            .replace('{预警事件}', `${signal.level + signal.type}预警`);
          this.getWarningGuide(signal.type, signal.level);
        }
      }
      this.formData.warningMessage = message;
      this.formData.smsMessage = message;*/
    }

    //获取所有预警模板
    async getWarningTemplates(): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: WarningTemplate[] = await infoPublish.getWarningTemplates();
      infoPublish = null;
      if (!data.length) {
        this.$message({
          type: 'warning',
          message: '获取预警模板数据失败'
        })
        return;
      }

      // this.warningTypes = data[0].warnType.split(',');
      this.signers = data[0].signer.split('，');
      console.log(this.signers,'签发人')
    }

    async getAllWarningInfo(): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: DefenseGuide[] = await infoPublish.getAllDefenseGuide();
      infoPublish = null;
      if (!data.length) {
        this.$message({
          type: 'warning',
          message: '获取预警类型数据失败'
        })
        return;
      }

      for(let guide of data) {
        let type: string = guide.name;
        if (type in this.defenseGuides === false) {
          this.defenseGuides[type] = [];
        }
        this.defenseGuides[type].push(guide);
      }
    }
    //点击预警信号
    selectWarningSignal(item:any,index:number){
      this.typeWarnIndex=index
      this.formData.warnType = item.type;
      let arr:any=[]
      let index_:number=0
      this.allWarningTypes.forEach(v=>{
        if(v.event_type== item.type){
          arr=v.list
          return
        }
      })
      arr.forEach((v,i)=>{
        if(item.level==v.colour){
          index_=i
        }
      })
      arr.forEach((v,i)=>{
        if(index_==i){
          v.level='当前级别'+v.colour
          this.formData.level = v.level
          this.formData.warningGuide=v.guidelines
        }
        else if(index_<i){
          v.level='升级到'+v.colour+'级别'
        }
        else if(index_>i){
          v.level='降级到'+v.colour+'级别'
        }
      })
      this.warningLevels=arr
    }
    //预警等级升降
    levelChange(val:string){
      console.log(val,'eerr')
      this.warningLevels.forEach(v=>{
        if(val==v.colour){
          this.formData.warningGuide=v.guidelines
          this.formData.typeWarn[this.typeWarnIndex]={
            type: v.event_type,
            level: v.colour
          }
        }
      })
    }
    async submitForm(){
      for(let key in this.formData){
        if(key=='warnType'||key=='level'){

        }
        else if(key=='typeWarn'){
          console.log(this.formData[key])
          let arr=[]
          this.formData[key].forEach(v=>{
            let str=v.type+v.level
            arr.push(str)
          })
          console.log(arr)
          this.warningData.typeWarn=arr.join(',')
          console.log(this.warningData.typeWarn)
        }
        else {
          this.warningData[key]=this.formData[key]
        }
      }
      console.log(this.warningData,'warning')
      let params:any={}
      for(let key in this.warningData){
        if(key=='warningGuide'){
          params['defense']=this.warningData['warningGuide']
        }
        else if(key=='time'){
          params[key]=new Date(this.warningData[key]).getTime()
        }
        else if(key=='id'){

        }else {
          params[key]=this.warningData[key]
        }
      }
      let infoPublishHttp = new InfoPublishHttp()
      let res = await infoPublishHttp.addWaringFormInfo(params)
      if(res){
        this.$message.success('预警信息已变更')
        this.closePopup(false)
      }else {
        this.$message.warning('预警信息变更失败')
      }

    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../styles/theme';

  #warning-change {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    overflow-y: auto;
    z-index: 99;
    @include scrollStyle;
    .warning-change-wrapper {
      width: 762px;
      position: absolute;
      left: 50%;
      top: 60px;
      margin-left: -385px;
      margin-bottom: 20px;
      background: white;
      box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.41);
      overflow: hidden;
      z-index: 99;
      > header {
        height: 40px;
        line-height: 40px;
        background: #11A9F5;
        cursor: move;
        .warning-change-title {
          float: left;
          color: white;
          margin-left: 20px;
          font-size: 14px;
        }
        .el-icon-close {
          float: right;
          margin-right: 5px;
          font-size: 16px;/*no*/
          color: white;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
        }
      }

      >section {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 20px;
        .width50 {
          width: calc(50% - 46px);
          float: left;
          margin-left: 30px;
          .el-select {
            width: 100%;
          }
        }
        .width100 {
          width: calc(100% - 62px);
          float: left;
          margin-left: 30px;
          .el-select {
            width: 100%;
          }
          .el-checkbox-group {
            .el-checkbox {
              margin-left: 0px;
              margin-right: 20px;
            }
          }
        }
        .width100_btn {
          text-align: center;
          margin-bottom: 20px;
          button {
            background: #11A9F5;
            width: 100px;
            padding: 0px;
            line-height: 28px;
            height: 30px;
            text-align: center;
          }
          button:hover {
            background: #11a0e8;
          }
          button:active {
            background: #11A9F5;
          }
        }
      }
    }
    .signal-tag{
      position: relative;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
    }
  }
</style>
<style lang="scss">
  #warning-change .el-form-item__label {
    text-align: left;
    width: 100px !important;
  }
  #warning-change .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
  #warning-change .width50 >.el-form-item__content,.width100 >.el-form-item__content {
    margin-left: 100px !important;
  }
  #warning-change .button-new-warning {
    margin-left: 15px !important;
  }
</style>
