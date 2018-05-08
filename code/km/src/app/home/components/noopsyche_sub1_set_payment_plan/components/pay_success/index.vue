<template>
  <div class="pay-success-page">
    <app-header title="设置还款计划" :other="true" v-on:other="goHomePage"></app-header>
    <div class="content">
      <div class="success">
        <i class="sp sp-pay-complete"></i>
        <h3>恭喜您，支付成功！</h3>
      </div>
      <div class="btn-success" v-on:click.stop="checkProgerssPage">查看进度</div>
    </div>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>