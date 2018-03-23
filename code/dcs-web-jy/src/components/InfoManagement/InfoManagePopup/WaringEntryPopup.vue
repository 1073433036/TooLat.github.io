<template>
    <main id="WaringEntryPopup" v-drag>
      <header class="WaringEntryPopup_header">
        <span class="WaringEntryPopup_title">新增录入</span>
        <i class="el-icon-close" @click="closeWaringEntryPopup"></i>
      </header>
      <section class="WaringEntryPopup_main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="发送单位" class="width50">
            <span>揭阳市气象台</span>
          </el-form-item>
          <el-form-item label="发布时间" required class="width50">
            <el-col>
              <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="模板名称" prop="region" class="width100">
            <el-select v-model="ruleForm.region" placeholder="请选择模板">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="I级事件类型" prop="region" class="width50">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="I级事件等级" prop="region" class="width50">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预报员" prop="region" class="width50">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="签发人" prop="region" class="width50">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="确认电话" prop="name" class="width50">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="name" class="width50">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="发布渠道" prop="type" class="width100">
            <el-checkbox-group v-model="ruleForm.type" >
              <el-checkbox label="微博" name="type"></el-checkbox>
              <el-checkbox label="微信" name="type"></el-checkbox>
              <el-checkbox label="省突短信" name="type"></el-checkbox>
              <el-checkbox label="本地短信" name="type"></el-checkbox>
              <el-checkbox label="网站" name="type"></el-checkbox>
              <el-checkbox label="FTP" name="type"></el-checkbox>
              <el-checkbox label="传真" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="短信" prop="region" class="width50">
            <el-select v-model="ruleForm.region" placeholder="请选择短信群组">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--短信内容-->
          <el-form-item label="" prop="desc" class="width100">
            <el-input type="textarea" resize="none" v-model="ruleForm.desc"></el-input>
          </el-form-item>


          <el-form-item label="预警内容" prop="desc" class="width100">
            <el-input type="textarea" resize="none" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="防御指引" prop="desc" class="width100">
            <el-input type="textarea" resize="none" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <div class="width100 width100_btn">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </div>
        </el-form>
      </section>
    </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Action,Getter } from 'vuex-class'
  import userInfo from '../../../interface/UserInfo'
  import { Component,Watch,Prop } from 'vue-property-decorator'

  @Component
  export default class WaringEntryPopup extends Vue {
    options:any= [
      {
      value: '选项1',
      label: '黄金糕'
    }, {
      value: '选项2',
      label: '双皮奶'
    }, {
      value: '选项3',
      label: '蚵仔煎'
    }, {
      value: '选项4',
      label: '龙须面'
    }, {
      value: '选项5',
      label: '北京烤鸭'
    }]
    ruleForm:any= {
      name: '',
      region: '',
      date1: '',
      date2: '',
      delivery: false,
      type: [],
      resource: '',
      desc: ''
    }
    rules:any= {
      name: [
        { required: true, message: '请输入', trigger: 'blur' }
        ],
      region: [
        { required: true, message: '请选择', trigger: 'change' }
        ],
      date1: [
        { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
        ],
      date2: [
        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
      type: [
        { type: 'array', required: false, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
      resource: [
        { required: true, message: '请选择', trigger: 'change' }
        ],
      desc: [
        { required: true, message: '请填写', trigger: 'blur' }
        ]
    }
    @Prop()
    closeWaringEntryPopup
    submitForm() {
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          setTimeout(v=>{
            this.$refs['ruleForm']['resetFields']();
          },4000)
          return false;
        }
      });
    }
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
#WaringEntryPopup{
  width: 762px;
  position: fixed;
  left: 50%;
  margin-left: -385px;
  top: 100px;
  background: white;
  z-index: 99;
  box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.41);
  overflow: hidden;
  .WaringEntryPopup_header{
    height: 36px;
    line-height: 36px;
    background: #11A9F5;
    cursor: move;
    .WaringEntryPopup_title{
      float: left;
      color: white;
      margin-left: 20px;
    }
    .el-icon-close{
      float: right;
      margin-right: 5px;
      font-size: 18px;
      color: white;
      width: 36px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
  }
  .WaringEntryPopup_main{
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding-top: 20px;
    .demo-ruleForm{
      overflow: hidden;
      .width50{
        width: 350px;
        float: left;
        margin-left: 20px;
        .el-select{
          width: 100%;
        }
      }
      .width100{
        width: 720px;
        float: left;
        margin-left: 20px;
        .el-select{
          width: 100%;
        }
        .el-checkbox-group{
          .el-checkbox{
            margin-left: 0px;
            margin-right: 20px;
          }
        }
      }
      .width100_btn{
        text-align: center;
        margin-bottom: 20px;
        button{
          background: #11A9F5;
          width: 100px;
          padding: 0px;
          line-height: 28px;
          height: 30px;
          text-align: center;
        }
        button:hover{
          background: #11a0e8;
        }
        button:active{
          background: #11A9F5;
        }
      }
    }
  }
}
</style>
<style>
  #WaringEntryPopup .el-form-item__label{
    text-align: left;
    width: 100px!important;
  }
  #WaringEntryPopup .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
  #WaringEntryPopup .width50 >.el-form-item__content,.width100 >.el-form-item__content{
    margin-left: 100px!important;
  }
</style>
