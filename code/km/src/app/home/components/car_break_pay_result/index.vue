<template>
  <main class="car-break-pay-result-page">
    <header>我的订单</header>
    <div :class="['result-icon', { fail: !isSuccess }]"></div>
    <div class="result-tip">
      {{ isSuccess ? '支付成功！' : '支付失败，请稍后重试' }}
    </div>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
