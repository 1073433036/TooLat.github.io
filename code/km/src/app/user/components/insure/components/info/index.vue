<template>
  <div class="user-insure-info-page">
    <app-header title="保险设置"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="inner">
            <div class="head">
              <i class="sp sp-upload"></i>
              <span>上传行驶证信息</span>
            </div>

            <div class="img-group">
              <div class="img">
                <input type="file"
                  class="input"
                  name="image"
                  accept="image/*"
                  ref="file"/>
                <span>上传行驶证主页</span>
              </div>

              <div class="img">
                <input type="file"
                  class="input"
                  name="image"
                  accept="image/*"
                  ref="file"/>
                <span>上传行驶证副页</span>
              </div>

            </div>

            <form class="input-group" ref="form" @submit.prevent="handleSubmit">
              <div class="item">
                <i class="sp sp-task-mobile"></i>
                <input type="text"
                  v-model.trim="formData.mobile"
                  vd-required
                  vd-validate
                  vd-type="phone"
                  vd-notify='{
                    "text": "手机号码不能为空",
                    "patt": "手机号码格式不正确"
                  }'
                  maxlength="11"
                  placeholder="请输入手机号码">
                <i class="sp sp-right"></i>
              </div>
              <div class="item">
                <i class="sp sp-insure-code"></i>
                <input vd-required
                  v-model.trim="formData.code"
                  type="text"
                  vd-notify='{
                    "text": "请输入验证码",
                  }'
                  maxlength="6"
                  placeholder="请输入验证码">
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.mobile"></phoneCode>
                  </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </scroller>


    <div class="btn">
      <button type="button" v-on:click="handleSubmit()">提交</button>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>