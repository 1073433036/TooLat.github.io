<template>
    <div id="warning-publish">
      <main class="warning-publish-wrapper">
        <header class="warning-publish-header">
          <span class="warning-publish-title">预警信息发布</span>
          <i class="el-icon-close" @click.stop="closePublishPopup(false)"></i>
        </header>
        <section class="warning-publish-main">
          <el-form :model="formData" :rules="formRules" ref="publishForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="发送单位" class="width50">
              <el-select v-model="formData.unit" placeholder="请选择发送单位">
                <el-option v-for="val in units" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布时间" class="width50">
              <el-col>
                <el-form-item prop="publishTime">
                  <el-date-picker type="datetime" placeholder="选择日期"
                    v-model="formData.publishTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- <el-form-item label="模板名称" prop="template" class="width100">
              <el-select v-model="formData.template" placeholder="请选择模板">
                <el-option v-for="item in warningTemps" :key="item.name" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="预警信号" prop="typewarn" class="width100">
              <div class="signal-tag" v-for="(signal, index) in formData.typewarn" :key="index"
                  @click="selectWarningSignal(signal, index)">
                <el-tag style="margin-right: 10px;" closable @close.stop="deleteWarningSignal(index)">
                  {{signal.type + signal.level}}
                </el-tag>
              </div>
              <el-button size="mini" @click.stop="showSignalSelects">+ 新增预警</el-button>
            </el-form-item>
            <el-form-item v-if="isShowSelects" label="" prop="warnType" class="width100">
              <el-select class="signal-visible" v-model="formData.warnType" placeholder="请选择">
                <el-option v-for="item in warningTypes"
                  :key="item" :label="item" :value="item"
                  :disabled="isDisasbledOpt('type', item)"></el-option>
              </el-select>
              <el-select class="signal-visible" v-model="formData.level" placeholder="请选择">
                <el-option v-for="val in levels"
                  :key="val" :label="val" :value="val"
                  :disabled="isDisasbledOpt('level', val)"></el-option>
              </el-select>
              <el-button class="button-new-warning" type="primary" size="mini" icon="el-icon-check" @click.stop="addNewWarningSignal(true)"></el-button>
              <el-button class="button-new-warning" type="danger" size="mini" icon="el-icon-close" @click.stop="addNewWarningSignal(false)"></el-button>
            </el-form-item>
            <!-- <el-form-item v-if="isAddNewSignal" label="预警等级" prop="level1" class="width50">
              <el-select v-model="formData.level1" placeholder="请选择">
                <el-option v-for="val in levels" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="事件类型2" prop="warnType2" class="width50">
              <el-select v-model="formData.warnType2" clearable placeholder="请选择">
                <el-option v-for="item in warningTypes" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="事件等级2" prop="level2" class="width50">
              <el-select v-model="formData.level2" clearable placeholder="请选择">
                <el-option v-for="val in levels" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="录入人员" prop="forecaster" class="width50">
              <el-input v-model="formData.forecaster"></el-input>
              <!-- <el-select v-model="formData.forecaster" placeholder="请选择">
                <el-option v-for="val in forecasters" :key="val" :label="val" :value="val"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="签发人" prop="signer" class="width50">
              <el-select v-model="formData.signer" placeholder="请选择">
                <el-option v-for="val in signers" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="确认电话" prop="phone" class="width50">
              <el-select v-model="formData.phone" placeholder="请选择">
                <el-option v-for="val in phones" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="传真" prop="fax" class="width50">
              <el-select v-model="formData.fax" placeholder="请选择">
                <el-option v-for="val in faxes" :key="val" :label="val" :value="val"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发布渠道" prop="channel" class="width100" style="margin-bottom: 0;">
              <el-checkbox-group v-model="formData.channel">
                <el-checkbox v-for="item in channels" :key="item.key" :label="item.name"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="预警内容" prop="warningMessage" class="width100">
              <el-input type="textarea" :rows="3" resize="none" v-model="formData.warningMessage"></el-input>
            </el-form-item>
            <el-form-item label="防御指引" prop="warningGuide" class="width100">
              <el-input type="textarea" :rows="3" resize="none" v-model="formData.warningGuide"></el-input>
            </el-form-item>
            <el-form-item label="短信渠道" prop="smsChannel" class="width100" style="margin-bottom: 0;">
              <el-checkbox-group v-model="formData.smsChannel">
                <el-checkbox v-for="item in smsChannels" :key="item.key" :label="item.name"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="短信群组" prop="smsGroup" class="width100" style="margin-bottom: 0;">
              <el-checkbox-group v-model="formData.smsGroup">
                <el-checkbox v-for="item in smsGroups" :key="item.id" :label="item.groupname"></el-checkbox>
              </el-checkbox-group>
              <!-- <el-select v-model="formData.smsGroup" placeholder="请选择短信群组">
                <el-option v-for="item in smsGroups" :key="item.id" :label="item.groupname" :value="item.id"></el-option>
              </el-select> -->
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
  import { Action, Getter } from 'vuex-class'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { WarningTemplate, SmsGroup, WarningForm, WarningDetail, DefenseGuide,Signal } from '../../../interface/WarningPublish'
  import InfoPublishHttp from '../../../util/InfoPublishHttp'


  @Component
  export default class WarningPublish extends Vue {
    @Prop()
    closePublishPopup: Function

    //是否显示预警类型与等级选择框
    isShowSelects: boolean = false
    //被选中的预警信号的index，点击预警信号切换预警信号类型与等级选择框的选中值
    selectedSignalIndex: number = -1
    //是否新增预警信号
    isAddNewSignal: boolean = false
    signers: string[] = []
    forecasters: string[] = []
    levels: string[] = ['红色', '橙色', '黄色', '蓝色', '白色']
    warningTypes: string[] = []
    warningTemps: WarningTemplate[] = []
    templatesDetail: any = {}
    phones: string[] = []
    faxes: string[] = []
    units: string[] = []
    channels: {name: string, key: string}[] = [
      { name: '微博', key: 'web', },
      { name: '微信', key: 'wechat', },
      { name: '网站', key: 'website', },
      { name: 'FTP', key: 'ftp', },
      { name: '传真', key: 'faxes', }
    ]
    smsChannels: {name: string, key: string}[] = [
      { name: '省突短信', key: 'pNote', },
      { name: '本地短信', key: 'nNote', },
    ]
    smsGroups: SmsGroup[] = []
    formData: any = {
      unit: '',
      publishTime: new Date(),
      template: '',
      warnType: '',
      level: '红色',
      typewarn: [],
      forecaster: '',
      signer: '',
      phone: '',
      fax: '',
      channel: [],
      smsChannel: [],
      smsGroup: [],
      smsMessage: '',
      warningMessage: '',
      warningGuide: ''
    }
    formRules: any = {
      // publishTime: [{ type: 'date', required: true, message: '请选择发布时间', trigger: 'change' }],
      // tempalte: [{ required: true, message: '请选择模板', trigger: 'change' }],
      // warnType1: [{ required: true, message: '请选择事件类型', trigger: 'change' }],
      // level1: [{ required: true, message: '请选择事件等级', trigger: 'change' }],
      forecaster: [{ required: true, message: '请填写录入人员', trigger: 'blur' }],
      signer: [{ required: true, message: '请选择签发人', trigger: 'change' }],
      phone: [{ required: true, message: '请填写确认电话', trigger: 'blur' }],
      fax: [{ required: true, message: '请填写传真', trigger: 'change' }],
      channel: [{ type: 'array', required: true, message: '请至少选择一种发布渠道', trigger: 'change' }],
      smsMessage: [{ required: true, message: '请填写短信内容', trigger: 'blur' }],
      warningMessage: [{ required: true, message: '请填写预警内容', trigger: 'blur' }]
    }

    //监控当前选中的预警类型与预警等级，以供判断是否需要禁用已存在的预警信号选项
    get disableLevelOpts(): string[] {
      let options: Signal[] = this.formData.typewarn.filter(el => {
        return this.formData.warnType === el.type && this.formData.level === el.level;
      });
      if(!options.length && !this.formData.level)
        this.formData.level = this.levels[0];
      return options.length ? options.map(el => el.level) : [];
    }

    get disableTypeOpts(): string[] {
      console.log('disabled type');
      if(!this.isAddNewSignal)
        return [];
      let selectedOpts: string[] = this.formData.typewarn.map(el => el.type);
      let unSelected: string[] = this.warningTypes.filter(el => !selectedOpts.includes(el));
      this.formData.warnType = unSelected[0];
      return selectedOpts;
    }

    //判断当前预警类型+等级是否已经存在，存在即禁用选项，防止重复选择
    isDisasbledOpt(type: string, value: string): boolean {
      console.log(this.disableLevelOpts, this.disableTypeOpts);
      return type === 'level' ? this.disableLevelOpts.includes(value) : this.disableTypeOpts.includes(value);
    }

    //确定选中的预警类型与预警等级
    addNewWarningSignal(isAdd: boolean): void {
      this.isShowSelects = false;
      // this.isAddNewSignal = false;
      if(isAdd) {
        this.formData.typewarn.push({
          type: this.formData.warnType,
          level: this.formData.level
        });
        // this.generateWarningMsg(true, true);
      } else {
        this.generateWarningMsg(false, true);
      }
      if (this.selectedSignalIndex >= 0) {
        this.selectedSignalIndex = -1;
      }
    }

    selectWarningSignal(signal: Signal, index: number): void {
      if(this.selectedSignalIndex === index)
        return;
      this.selectedSignalIndex = index;
      this.formData.warnType = signal.type;
      this.formData.level = signal.level;
      this.showSignalSelects();
    }

    //显示预警类型与预警等级选择框
    showSignalSelects(): void {
      if(!this.isShowSelects)
        this.isShowSelects = true;
      this.isAddNewSignal = true;
      if(!this.formData.level)
        this.formData.level = this.levels[0];
      if(!this.formData.typewarn.length && this.selectedSignalIndex === -1)
        this.generateWarningMsg(true);
    }

    //删除预警信号
    deleteWarningSignal(index: number): void {
      this.formData.typewarn.splice(index, 1);
      this.generateWarningMsg(false);
    }

    @Watch('formData.warnType')
    @Watch('formData.level')
    @Watch('formData.publishTime')
    onWatchWarningMsg(nv, ov): void {
      console.log(ov, this.selectedSignalIndex);
      this.generateWarningMsg(ov !== '' && this.selectedSignalIndex === -1);
    }

    generateWarningMsg(isAdded: boolean, isBtnClick?: boolean): void {
      console.log('212121', isAdded);
      if(isAdded && isBtnClick)
        return;
      this.formData.warningGuide = '';
      let details = this.templatesDetail;
      let message: string = '';
      if(Object.keys(details).length) {
        let formData = this.formData;
        let publishTime = formData.publishTime ? moment(formData.publishTime).format('YYYY年MM月DD日HH时mm分') : ' ';
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
          message += details[signal.type].publishRelease.replace('{时间}', publishTime)
            .replace('{预警事件}', `${signal.level + signal.type}预警`);
          this.getWarningGuide(signal.type, signal.level);
        }
      }
      this.formData.warningMessage = message;
      this.formData.smsMessage = message;
    }

    async mounted(): Promise<void> {
      await this.getTemplatesContent();
      this.getWarningTemplates();
      this.getSmsGroups();
    }

    //提交预警表单信息
    submitForm(): void {
      //验证表单信息格式
      this.$refs['publishForm']['validate'](valid => {
        if (valid) {
          this.addWarningFormInfo();
        } else {
          this.$message({
            type: 'warning',
            message: '请检查表单信息是否正确'
          });
          return false;
        }
      });
    }

    //获取所有预警模板
    async getWarningTemplates(): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: WarningTemplate[] = await infoPublish.getWarningTemplates();
      if(data.length === 1 && data[0].hasOwnProperty('name') === false)
        this.formData.template = data[0].name = '默认模板';
      this.warningTemps = data;
      let keys: string[] = ['units', 'warnType', 'signer', 'forecaster', 'affirmNumber', 'fax'];
      ['units', 'warningTypes', 'signers', 'forecasters', 'phones', 'faxes'].forEach((el, index) => {
        let key = keys[index];
        this[el] = data[0][key].split('，');
        if(key in this.formData)
          this.formData[key] = this[el][0];
      });
      this.formData.phone = this.phones[0];
      this.formData.unit = this.units[0];
      this.formData.warnType = this.warningTypes[0];
      this.formData.typewarn.push({
        type: this.warningTypes[0],
        level: this.formData.level
      })
    }

    //发布预警信息
    async addWarningFormInfo(): Promise<void> {
      let formData = this.formData;
      let params: WarningForm = {
        units: formData.unit,
        time: moment(formData.publishTime).milliseconds(),
        typeWarn: formData.typewarn.map(el => `${el.type}${el.level}`).join(',')|| '',
        forecaster: formData.forecaster,
        signer: formData.signer,
        affirmNumber: formData.phone,
        fax: formData.fax,
        web: 0,
        wechat: 0,
        pNote: 0,
        nNote: 0,
        website: 0,
        ftp: 0,
        faxes: 0,
        noteMessage: formData.smsMessage,
        warningMessage: formData.warningMessage,
        defense: formData.warningGuide,
        state: 1,
        smsGroup: formData.smsGroup
      };
      this.formData.channel.forEach(el => {
        let arr = this.channels.filter(item => item.name === el);
        if(arr.length)
          params[arr[0].key] = 1;
      })

      let flag =  false;
      if(flag) {
        let infoPublish = new InfoPublishHttp();
        let bool: boolean = await infoPublish.addWaringFormInfo(params);
        infoPublish = null;
        if(bool) {
          this.$message({
            type: 'success',
            message: '预警表单提交成功'
          });
        } else {
          this.$message({
            type: 'error',
            message: '预警表单提交失败'
          });
        }
      }

    }

    //获取所有短信群组
    async getSmsGroups(): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: SmsGroup[] = await infoPublish.getWarningSmsGroups();
      this.smsGroups = data;
      infoPublish = null;
    }

    //获取所有事件类型预警模板内容
    async getTemplatesContent(): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: WarningDetail[] = await infoPublish.getTemplateDetails();
      if(data.length) {
        let details = {};
        for(let item of data) {
          details[item.eventType] = item;
        }
        this.templatesDetail = details;
      }
    }

    //获取防御指引
    async getWarningGuide(type: string, level: string): Promise<void> {
      let infoPublish = new InfoPublishHttp();
      let data: DefenseGuide[] = await infoPublish.getWarningGuide(type, level);
      // if(type !== this.formData['warnType1'] || level !== this.formData['level1'])
      //   return;
      if(data.length) {
        let defenseGuide: DefenseGuide = data[0];
        if(this.formData.warningGuide != '')
          this.formData.warningGuide += '\n';
        this.formData.warningGuide += `${type}${level}：\n${defenseGuide.guidelines}`;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';

  #warning-publish {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    overflow-y: auto;
    z-index: 99;
    @include scrollStyle;
    .warning-publish-wrapper {
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
      .warning-publish-header {
        height: 40px;
        line-height: 40px;
        background: #11A9F5;
        cursor: move;
        .warning-publish-title {
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
      .warning-publish-main {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 20px;
        .demo-ruleForm {
          overflow: hidden;
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
        .signal-tag {
          position: relative;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
        }
      }
    }
  }
  .signal-visible {
    width: 30% !important;
    margin-left: 10px;
    &:first-of-type {
      margin-left: 0;
    }
  }
</style>
<style lang="scss">
  #warning-publish .el-form-item__label {
    text-align: left;
    width: 100px !important;
  }
  #warning-publish .el-tag{
    cursor: pointer;
  }
  #warning-publish .el-form-item.is-required .el-form-item__label:before {
    display: none;
  }
  #warning-publish .width50 >.el-form-item__content,.width100 >.el-form-item__content {
    margin-left: 100px !important;
  }
  #warning-publish .button-new-warning {
    margin-left: 15px !important;
  }
</style>
