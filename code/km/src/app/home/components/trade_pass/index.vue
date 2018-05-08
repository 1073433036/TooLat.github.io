<template>
  <div class="trade-pass-page">
    <app-header title="设置交易密码"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-item">
              <i class="sp sp-pass"></i>
              <span>交易密码</span>
              <input vd-required
                vd-validate
                vd-type="password"
                v-model.trim="formData.password1"
                type="password"
                vd-notify='{
                  "text": "交易密码不能为空",
                  "patt": "交易密码格式不正确"
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
                placeholder="再次确认交易密码">

            </div>
            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">下一步</button>
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