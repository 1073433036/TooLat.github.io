<template>
  <div class="insurance_deploy_page">
    <app-header title="保险配置"></app-header>
    <scroller>
      <div class="box">
				<div class="wrapper">
        <div class="payment">
					<div class="payment-log">
						<span  class="sp sp-pay-complete"></span>
					</div>
					<p class="succeed">保险配置订单已提交，等待各保险公司报价；可在订单处查看查看订单详情。</p>
          <router-link :to="{ name: 'insurance.Indent' }" class="btn">查看订单</router-link>
				</div>
			</div>
			</div>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>