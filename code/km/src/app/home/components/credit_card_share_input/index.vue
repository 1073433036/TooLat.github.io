<template>
  <div class="creditcard-share-input-page">
    <app-header title="信用卡/买单吧"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="box">
            <div class="title">
              <span>邀请人：</span>
              <span>来淑萍</span>
              <span>13316455798</span>
            </div>
            <form class="form-group" ref="form" @submit.prevent="handleSumbit">

              <div class="input-item">
                <i class="icon icon-phone"></i>
                <input vd-required
                  vd-validate
                  vd-type="phone"
                  v-model.trim="formData.phone"
                  type="text"
                  vd-notify='{
                    "text": "请输入11位手机号码",
                    "patt": "手机号码格式不正确"
                  }'
                  placeholder="请输入11位手机号码">
              </div>

              <div class="input-item">
                <i class="icon icon-password"></i>
                <input vd-required
                  vd-validate
                  vd-type="password"
                  v-model.trim="formData.password"
                  type="password"
                  vd-notify='{
                    "text": "请输入6-16位数字或字母",
                    "patt": "请输入6-16位数字或字母"
                  }'
                  placeholder="请输入6-16位数字或字母">
              </div>

              <div class="input-item">
                <i class="icon icon-vali"></i>
                <input vd-required
                  v-model.trim="formData.code"
                  type="text"
                  vd-notify='{
                    "text": "请输入短信验证码",
                  }'
                  placeholder="请输入短信验证码">
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
              </div>

              <div class="button-item">
                <button type="submit" class="btn" :class="{ on: state.active }" :disabled="!state.active">立即注册</button>
              </div>
            </form>
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