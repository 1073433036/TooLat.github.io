<template>
  <div class="simulationBank-page">
    <app-header title="模拟办卡"></app-header>

    <scroller>
      <!-- <router-link :to="{name: 'home.TestTheBankCard'}" tag="div" class="link"> -->
			<div href="javascript:void(0)" @click="linkToRoute({name: 'home.TestTheBankCard'})" class="link">
        <div class="content-page">
          <div class="Bank-title">
            <h4>办卡评估</h4>
            <span>"精准预测大大提高成功率"</span>
            <div class="border"></div>
          </div>
          <img src="~assets/images/Bank_card/Bankto.png" alt="">
        </div>
			</div>
      <!-- </router-link> -->

      <!-- <router-link :to="{name: 'home.SimulationApplyLoan'}" tag="div" class="link"> -->
			<div href="javascript:void(0)" @click="linkToRoute({name: 'home.SimulationApplyLoan'})" class="link">
        <div class="content-page">
          <div class="Bank-title">
            <h4>贷款评估</h4>
            <span>"轻松查询贷款额度"</span>
            <div class="border"></div>
          </div>
          <img src="~assets/images/Bank_card/Banknext.png" alt="">
        </div>
			</div>
      <!-- </router-link> -->
    </scroller>

  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>