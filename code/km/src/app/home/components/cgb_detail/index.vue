<template>
<div class="cgb_wrap">
    <app-header title="广发银行"></app-header>
    <scroller ref="my_scroller">
      <main class="cgb_detail">
        <img src="~assets/images/cgb_detail.jpg" alt="广发银行宣传图" />
        <div class="btn-wrapper">
          <router-link :to="{name: 'home.studentCreditCard'}" class="back-btn" tag="div">立即申请</router-link>
        </div>
      </main>
    </scroller>

</div>
</template>
<script>
  import Index from './index.js';
  export default Index;
</script>
