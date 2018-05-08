<template>
  <div class="create-pass-page">
    <app-header title="创建登录密码"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-item">
              <i class="sp sp-pass"></i>
              <span>登录密码</span>
              <input vd-required
                vd-validate
                vd-type="password"
                v-model.trim="formData.password1"
                type="password"
                vd-notify='{
                  "text": "登录密码不能为空",
                  "patt": "登录密码格式不正确"
                }'
                placeholder="输入交易密码">
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
              <span>邀请码</span>
              <input type="text"
                v-model.trim="formData.code"
                placeholder="可选择填写">
            </div>
            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">完成</button>
            </div>
          </form>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>