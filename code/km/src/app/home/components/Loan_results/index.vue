<template>
  <!-- 遮罩层 -->
  <div class="LoanResults-page">
    <div class="Pop-up">
      <span>根据您测试的分数
        <em>{{Allfraction}}分</em>
      </span>
      <p>
        您的个人资质还不错哦~
        <br> 如果有信用卡，可以办理宜人贷、嘉卡贷、读秒贷、卡卡贷、闪电借款
        <br> 没有信用卡的话，可以办理拍拍贷、现金巴士、发薪贷、马上贷、贷款王
      </p>
    </div>
    <router-link :to="{name: 'home.Loan'}">
      <div class="toLoanResult">
        <img src="~assets/images/Bank_card/btn_apply.png" alt="">
      </div>
    </router-link>

  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>