<template>
  <div class="car-break-pay-success-page">
    <app-header title="支付订单" :other="true" v-on:other="goHomePage"></app-header>
    <div class="content">
      <div class="success">
        <i class="sp sp-pay-complete"></i>
        <h3>恭喜您，支付成功！</h3>
      </div>
      <div class="btn-success" v-on:click.stop="goCarBreakHome">完成</div>
    </div>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>