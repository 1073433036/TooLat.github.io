<template>
  <div class="creditcard-list-page">
    <app-header :title="'信用卡列表'"></app-header>
    <div class="creditcard-layer">
      <scroller>
        
        <div class="creditcard-list-box">
          <ul class="creditcard-list">
            <li class="item" v-for="(item, index) in formTemp.data" :key="index">
              <div class="box">
                
              </div>
            </li>
          </ul>
          <!-- <div class="submit-btn"> -->
            <!-- <div type="button" class="btn" v-on:click.stop="addCreditcar"><i class="sp sp-add"></i>添加信用卡</div> -->
          <!-- </div> -->
        </div>
        <div class="nocard-add">
          <img src="~assets/images/credit-card/creditcard_add.png" alt="信用卡添加"   @click="selectFun()"/>
        </div>
      </scroller>
    </div>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
