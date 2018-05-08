<template>
  <div class="user-issue-page">
    <app-header title="我的发布"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <ul class="list">
            <li v-show="0 <= list.length" class="item" v-for="(item, index) in list" :key="index">
              <div class="time">
                <span>{{ item.add_time }}</span>
              </div>
              <div class="box">
                <div class="person">
                  <span class="name">{{ item.name }}</span>
                  <span class="text">贷款<span class="fc">{{ item.amount }}</span>元</span>
                  <span class="text"><span class="fc">{{ item.repay_date_limit }}</span>期还款</span>
                  <!-- <i class="icon icon-del"></i> -->
                </div>
                <div class="company">
                  <div class="line">
                    <i class="sp sp-task-home"></i>
                    <div class="info">
                      <span>单位：</span>
                      <span>{{ item.company }}</span>
                    </div>
                  </div>
                  <div class="line">
                    <i class="sp sp-task-phone"></i>
                    <div class="info">
                      <span>联系方式：</span>
                      <a href="tel:13800138000">{{ item.phone }}</a>
                    </div>
                  </div>
                  <router-link :to="{ name: 'user.Peer', params: {id: item.id} }" class="line" tag="div">
                    <i class="sp sp-task-order-02"></i>
                    <div class="info">
                      <span>我的抢单经理：</span>
                      <span>{{ item.get_num }}人</span>
                    </div>
                    <div class="enter sp sp-right"></div>
                  </router-link>
                </div>
                <div class="tips">提升浏览量？更快贷款成功？</div>
                <router-link :to="{ name: 'home.LoanStick', params: {id: item.id} }" class="stick">我要置顶</router-link>
                <i class="sp sp-task-order-ok status"></i>
                <!-- <i v-if="0 !== index % 2" class="sp sp-task-order-fail status"></i> -->
              </div>
            </li>
          </ul>
					<div class="photo" v-show="0 >= list.length">
						<img src="~assets/images/no-data.png" alt="">
					</div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>