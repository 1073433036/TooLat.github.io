<template>
  <div class="agency_withdraw-page">
    <app-header title="提现"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
					<div class="main">
						<ul class="list">
							<li class="item">
								<div class="left">到账银行卡</div>
								<div class="middle">
									<div class="name">招商银行卡</div>
									<div class="number">6003************2138</div>
									<div class="day">1-5个工作日到账</div>
								</div>
								<i class="sp sp-right"></i>
							</li>
						</ul>
					</div>
					<div class="money">
						<span class="balance">当前余额：50000</span>
						<span class="withdraw">全部提现</span>
					</div>
					<div class="extract">
						<div class="sum">提取金额</div>
						<div class="input">
							<span class="symbol">￥</span>
							<input type="text">
						</div>
					</div>
					<div class="btn">立即提现</div>
        </div>
      </div>
    </scroller>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>