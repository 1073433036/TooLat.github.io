<template>
  <div class="zx-page">
    <app-header title="综合信息"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="message_logo">
            <img src="~assets/images/general_message/1.png">
          </div>

         <div class="main">
            <div class="list list1">

              <a class=" list_item list_item1">
                <i class="icon1"></i>
                <em>信用卡佣金</em>
              </a> 

              <a class="list_item list_item2">
                <i class="icon2"></i>
                <em>车险佣金</em>
              </a> 

              <a class="list_item list_item3">
                <i class="icon3"></i>
                <em>招商佣金</em>
              </a>

            </div>

            <div class="list list2">
              <a class="list_item list_item1">
                <i class="icon4"></i>
                <em>贷款佣金</em>
              </a> 
              <a class="list_item list_item2">
                <i class="icon5"></i>
                <em>锁粉信息</em>
              </a> 
              <a class="list_item list_item3">
                <i class="icon6"></i>
                <em>违章信息</em>
              </a>
            </div>

            <div class="list list3">
              <a class="list_item list_item1">
                <i class="icon7"></i>
                <em>精养卡信息</em>
              </a> 
              <a class="list_item list_item2">
                <i class="icon8"></i>
                <em>征信信息</em>
              </a> 
              <a class="list_item list_item3">
                <i class="icon9"></i>
                <em>无卡支付信息</em>
              </a>
            </div>

            <div class="list list4">
              <a class="list_item list_item1">
                <i class="icon10"></i>
                <em>意向代理</em>
              </a> 
              <a class="list_item list_item2">
                <!-- <i class="icon1"></i>
                <em>信用卡佣金</em> -->
              </a> 
              <a class="list_item list_item3">
             <!--    <i class="icon1"></i>
                <em>信用卡佣金</em> -->
              </a>
            </div>

         </div> 
        <!-- <div class="foot"> -->
				<!-- <div class="foot"> -->
     <!--        <a class="authorize" v-on:click="goToAuth()">授权</a>
            <router-link :to="{ name: 'home.ZxDetail' }" class="history">
              历史记录
            </router-link>
            <a href="https://ipcrs.pbccrc.org.cn/" class="reg">首次查询，立即注册</a>
          </div>

          <div class="copyright">
            <span>数据来源于：</span>
            <i class="sp sp-zx-foot-logo"></i>
            <span>中国人民银行征信中心</span> -->
          </div>
      </div>
			<!-- <app-footing></app-footing> -->
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>