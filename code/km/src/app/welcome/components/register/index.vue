<template>
  <div class="register-page">
    <app-header title="注册"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">

            <div class="input-item">
              <i class="sp sp-phone"></i>
              <span>手机号</span>
              <input vd-required
                vd-validate
                vd-type="phone"
                v-model.trim="formData.username"
                type="text"
                vd-notify='{
                  "text": "请输入11位手机号码",
                  "patt": "手机号码格式不正确"
                }'
                placeholder="请输入11位手机号码">
            </div>

            <div class="input-item">
              <i class="sp sp-phone-code"></i>
              <span>验证码</span>
              <input vd-required
                v-model.trim="formData.code"
                type="text"
                vd-notify='{
                  "text": "请输入验证码",
                }'
                placeholder="请输入验证码">
                <div class="code">
                  <phoneCode title="获取验证码" :phone="formData.username"></phoneCode>
                </div>
            </div>

            <div class="input-item">
              <i class="sp sp-pass"></i>
              <span>登录密码</span>
              <input vd-required
                vd-validate
                vd-type="password"
                v-model.trim="formData.password"
                type="password"
                vd-notify='{
                  "text": "登录密码不能为空",
                  "patt": "登录密码格式不正确"
                }'
                placeholder="输入登录密码">
            </div>

            <div class="input-item">
              <i class="sp sp-pass"></i>
              <span>确认密码</span>
              <input vd-required
                vd-validate
                vd-type="password"
                v-model.trim="formData.password2"
                type="password"
                vd-notify='{
                  "text": "确认密码不能为空",
                  "patt": "确认密码格式不正确"
                }'
                placeholder="再次确认登录密码">
            </div>

            <div class="input-item">
              <i class="sp sp-please-code"></i>
              <span>微信号</span>
              <input vd-required
                type="text"
                v-model.trim="formData.wechat_account"
                vd-notify='{
                  "text": "微信号不能为空",
                }'
                placeholder="请输入微信号">
            </div>

            <div class="input-item">
              <i class="sp sp-phone-code"></i>
              <span>邀请码</span>
              <input vd-required
                type="text"
                v-model.trim="formData.invite_code"
                vd-notify='{
                  "text": "邀请码不能为空",
                }'
                placeholder="请输入邀请码">
            </div>

            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">注册</button>
            </div>
            <div class="agree">
              <Checkbox v-model="single">
                <span>阅读并同意</span>
                <a class="link" href="javascript:" @click.stop="see">《卡盟金服服务协议》</a>
              </Checkbox>
            </div>
          </form>
        </div>
      </div>
    </scroller>
    <ServiceAgreement v-model="isShow"></ServiceAgreement>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>