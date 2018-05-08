<template>
  <div class="pre-money-page">
    <app-header :title="data.name + '预审额度查询'"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="head">
            <div class="img">
              <img :src="data.thumb">
            </div>
            <span>{{ data.name }}</span>
          </div>
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">

            <div class="input-item">
              <i class="sp sp-identity"></i>
              <span>身份证</span>
              <input vd-required
                vd-validate
                vd-type="identity"
                v-model.trim="formData.identity"
                type="text"
                vd-notify='{
                  "text": "请输入身份证号码",
                  "patt": "身份证格式不正确"
                }'
                placeholder="请输入身份证号码">
            </div>

            <div class="input-item">
              <i class="sp sp-phone"></i>
              <span>手机号</span>
              <input vd-required
                vd-validate
                v-model.trim="formData.phone"
                vd-type="phone"
                type="text"
                vd-notify='{
                  "text": "请输入手机号码",
                  "patt": "手机号码格式不正确"
                }'
                placeholder="请输入手机号码">
            </div>

            <div class="input-item">
              <i class="sp sp-phone-code"></i>
              <span>验证码</span>
              <input vd-required
                vd-validate
                v-model.trim="formData.code"
                vd-type="smsCode"
                type="text"
                vd-notify='{
                  "text": "请输入验证码",
                  "patt": "验证码格式不正确"
                }'
                maxlength="6"
                placeholder="请输入6位数字验证码">
                <div class="code">
                  <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                </div>
            </div>

            <div class="input-item">
              <i class="sp sp-money"></i>
              <span>额   度</span>
              <span class="input">{{ formData.money }}</span>
            </div>

            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">{{ btnTxt }}</button>
            </div>
          </form>

          <div class="foot">
            <div class="desc">
              <div class="tips">
                <p>您对您的信用卡预审额度满意吗？</p>
                <p>如果您觉得额度不够用，您可要申请网贷哦！</p>
              </div>
              <div class="tips">
                <p>如果您有房、有车、有其他资产，想要更高的额度，可以<router-link :to="{ name: 'home.LoanLoans' }">填写申请</router-link>，我们资深信贷经理会联系您，可为您办理更高额度的贷款哦！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>