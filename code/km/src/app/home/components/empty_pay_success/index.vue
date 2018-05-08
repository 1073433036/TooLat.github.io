<template>
  <div class="empty-pay-success-page">
    <app-header title="快捷支付" :other="true" v-on:other="goBackHomePage"></app-header>
    <div class="wrapper" v-if="isSuccess">
      <i class="sp sp-pay-complete"></i>
      <h3>恭喜您，支付成功</h3>
      <router-link :to="{path:'/'}">
        <div class="bnt-success">支付完成</div>
      </router-link>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>