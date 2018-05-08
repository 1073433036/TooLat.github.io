<template>
  <div class="query-credit-success-page">
    <app-header title="支付成功"></app-header>
    <scroller>
      <div class="box">
				<div class="wrapper">
        <div class="payment">
					<div class="payment-log">
						<span  class="sp sp-pay-complete"></span>
					</div>
					<p class="succeed">已支付成功，可在历史报告处查看详情。</p>
          <router-link :to="{ name: 'home.QueryCreditHistory' }" class="btn">历史报告</router-link>
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