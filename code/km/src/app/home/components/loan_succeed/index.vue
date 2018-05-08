<template>
  <div class="spoil_get">
    <app-header title="申请贷款">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
							<div class="apply">
								<div class="photo">
									<span class="sp sp-core-circle06"></span>
								</div>
								<div class="info">
									<div class="title">贷款申请提交成功</div>
									<div class="text">您的大额贷款申请已提交，稍后会有专属客户经理和您联系，祝您贷款成功！</div>
								</div>
							</div>
							<div class="stick">
								<router-link :to="{ name: 'home.LoanStick', params: {id: $route.params.id} }">我要置顶</router-link>
							</div>
							<div class="go-back">
								<router-link :to="{ name: 'home.Home' }">返回首页</router-link>
							</div>
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