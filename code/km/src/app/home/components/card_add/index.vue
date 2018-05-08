<template>
  <div class="card-page">
    <app-header title="添加储蓄卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-item">
              <i class="sp sp-username"></i>
              <span>真实姓名</span>
              <input vd-required
                v-model.trim="formData.username"
                type="text"
                vd-notify='{
                  "text": "真实姓名不能为空",
                }'
                placeholder="请输入真实姓名">
            </div>
            <div class="input-item">
              <i class="sp sp-identity"></i>
              <span>身份证</span>
              <input vd-required
                vd-validate
                vd-type="identity"
                v-model.trim="formData.identity"
                type="text"
                vd-notify='{
                  "text": "身份证不能为空",
                  "patt": "身份证格式不正确"
                }'
                placeholder="请输入身份证">
            </div>

            <div class="input-item">
              <i class="sp sp-card"></i>
              <span>银行卡卡号</span>
              <input vd-required
                vd-validate
                vd-type="bank"
                v-model.trim="formData.card"
                type="text"
                maxlength="19"
                vd-notify='{
                  "text": "银行卡卡号不能为空",
                  "patt": "银行卡卡号格式不正确"
                }'
                placeholder="请输入银行卡卡号">
            </div>

            <div class="input-item">
              <i class="sp sp-phone"></i>
              <span>手机号码</span>
              <input vd-required
                vd-validate
                vd-type="phone"
                v-model.trim="formData.phone"
                type="text"
                vd-notify='{
                  "text": "手机号码不能为空",
                  "patt": "手机号码格式不正确"
                }'
                placeholder="请输入手机号码">
            </div>
            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">下一步</button>
            </div>
          </form>
        </div>
      </div>
    </scroller>

    <div class="mask-layer" :class="{ on: sendSms }">
      <div class="sms-layer">
        <div class="head">
          <span>已向您的手机<em>133******2313</em>手机发送验证码</span>
        </div>

        <div class="main">
          <input type="text" maxlength="6" v-model="formData.phoneCode">
          <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
        </div>

        <div class="foot">
          <div class="btn-group">
            <a class="item close" v-on:click="sendSms = false">取消</a>
            <a class="item transit sumbit" v-on:click="handleTradePass()">确认</a>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>