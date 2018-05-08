<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div v-show="isWechat" class="wechat-code-page">
      <div class="wechat-code-inner">
        <div class="content">
          <div class="wechat-code-head">
            <span>{{ formTemp.title }}</span>
            <i class="sp sp-close" v-on:click="handleClose()"></i>
          </div>
          <div class="wechat-code-body">
            <div class="qr-code">
              <img v-if="formTemp.wx_qrcode" :src="formTemp.wx_qrcode">
              <div v-else class="text">
                <p v-if="formTemp.wechat_account">抱歉！他没有上传微信二维码，您可以复制以下微信号添加好友</p>
                <p v-else>抱歉！他没有上传微信二维码</p>
              </div>
            </div>
            <div v-if="formTemp.wechat_account" class="qr-code-no">微信号：{{ formTemp.wechat_account }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>