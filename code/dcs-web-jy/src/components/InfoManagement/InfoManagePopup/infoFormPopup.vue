<template>
  <main id="infoFormPopup" v-drag :class="infoFormData.className">
    <header class="infoFormPopup_header">
      {{infoFormData.title}}
      <i class="el-icon-close userPopup_close" @click="infoPopupClose"></i>
    </header>
    <section class="infoFormPopup_main">
      <el-form :model="infoFormData.ruleForm" :rules="infoFormData.rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="(items,key) in infoFormData.config"
                      :label="items.label"
                      :key="key"
                      :class="{'formItem_textarea':items.type==='textarea'}"
                      :prop="key">
          <el-input v-model="infoFormData.ruleForm[key]"
                    v-if="items.type==='input'&&items.valueType!=='number'"></el-input>
          <el-input v-model.number="infoFormData.ruleForm[key]"
                    v-if="items.type==='input'&&items.valueType==='number'"></el-input>

          <el-select v-model="infoFormData.ruleForm[key]"
                     v-if="items.type==='select'"
                     placeholder="请选择">
            <el-option
              v-for="item in items.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-form-item class="form_pinck"
                        :prop="key"
                        v-if="items.type==='picker'">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="infoFormData.ruleForm[key]"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>

          <el-input type="textarea"
                    resize="none"
                    v-model="infoFormData.ruleForm[key]"
                    v-if="items.type==='textarea'">
          </el-input>
        </el-form-item>
        <el-form-item class="form_btn">
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  @Component
  export default class InfoFormPopup extends Vue {
    @Prop()
    infoFormData
    @Prop()
    infoPopupClose
    submitForm() {
      this.$refs['ruleForm']['validate']((valid) => {
        if (valid) {
          this.$emit('getInfoFormData',{type:this.infoFormData.type,'ruleForm':this.infoFormData.ruleForm})
        } else {
          this.$message.error('信息未填写完整');
          console.log('error submit!!');
          return false;
        }
      });
    }
    resetForm() {
      this.$refs['ruleForm']['resetFields']();
    }
    mounted(){

    }
  }
</script>

<style lang="scss" scoped>
  #infoFormPopup{
    box-shadow: 0px 0px 15px rgba(53, 53, 53, 0.30);
    position: fixed;
    left: 50%;
    top: 50%;
    margin-top: -240px;
    overflow: hidden;
    background: white;
    z-index: 100;
    .infoFormPopup_header{
      position: relative;
      line-height: 36px;
      height: 36px;
      color: white;
      background: #11A9F5;
      cursor: move;
      padding-left: 18px;
      font-family: "Microsoft YaHei";
      padding-right: 40px;
      overflow: hidden;
      .userPopup_close{
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
    .infoFormPopup_main{
      padding: 15px;
      padding-left: 0px;
      overflow: hidden;
    }
  }
  #infoFormPopup.width300{
    width:330px;
    margin-left: -166px;
  }
  #infoFormPopup.width600{
    width:648px;
    margin-left: -325px;
  }
</style>
<style lang="scss">
  #infoFormPopup .el-form-item{
    margin-bottom: 16px;/*no*/
    float: left;
    width: 296px;
    margin-left: 18px;
    height: 36px;
  }
  #infoFormPopup .el-form-item.is-required .el-form-item__label:before{
    display: none;
  }
  #infoFormPopup .el-form-item .form_pinck{
    margin-bottom: 0px!important;
    margin-left: 0px;
  }

  #infoFormPopup .el-form-item__content{
    margin-left: 0px!important;
    float: left;
    width: 200px;
    height: 35px;
    box-sizing: border-box;
  }
  #infoFormPopup .el-form-item__content .el-input .el-input__inner{
    height: 35px;
  }
  #infoFormPopup .formItem_textarea{
    height: 58px;
  }
  #infoFormPopup .formItem_textarea .el-form-item__content{
    height: 58px;
  }
  #infoFormPopup .el-form-item__label{
    width: 95px!important;
    text-align: left;
    padding-right: 5px!important;
  }
  #infoFormPopup .form_btn{
    margin-bottom: 0px;
    width: 100%;
    height: 30px;
  }
  #infoFormPopup .el-form-item__content .el-button{
    padding: 8px 15px;
  }
  #infoFormPopup .form_btn .el-form-item__content{
    width: 100%;
    text-align: center;
    height: 30px;
    .el-button{
      padding: 0px;
      height: 30px;
      width: 100px;
    }
  }

  #infoFormPopup .el-form-item .el-form-item__label{
    font-size: 12px;
    line-height: 36px;
    height: 36px;
    overflow: hidden;
  }
</style>
