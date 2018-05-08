<template>
  <div class="spoil_get">
    <app-header title="奖品领取">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<div class="present">
									<div class="photo">
										<img src="~assets/images/succeed-01.png" alt="">
									</div>
									<div class="shop">
										<img src="~assets/images/shopping-02.png" alt="">
									</div>
								</div>
            </div>
						<div class="backtrack" @click="goBack()">返回首页</div>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>