<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div v-show="show" class="mask-bank">
      <div class="inner">
        <div class="content">
          <div class="head">
            <div class="bank-logo">
              <img :src="data.logo">
            </div>
            <span>{{ data.bank }}</span>
            <em>( 签约合作银行 )</em>
            <i class="sp sp-close" v-on:click="handleClose()"></i>
          </div>
          <div class="main">
            <scroller
							scrollbar-y="500px"
              v-show="0 < formTemp.data.length"
              ref="my_scroller">
              <ul class="list">
                <li v-for="(item, index) in formTemp.data" :key="index" class="item">
                  <div class="left">
                    <h3 class="name">{{ item.bank_name }}</h3>
                    <div class="area">{{ item.address }}</div>
                    <div class="tel">{{ item.phone }}</div>
                  </div>
                </li>
              </ul>
            </scroller>
            <scroller v-show="0 >= formTemp.data.length">
              <div class="no-data">
								<p class="hint">温馨提示：</p>
                <p>亲！您所在的城市没有{{ data.bank }}，可能会降低您的申卡通过率哦！如果确认您当地没有{{ data.bank }}，建议您可以填写附近有该银行的城市的单位和住址哦，卡盟金服祝您批卡成功！</p>

                <div class="btn">
                  <button type="button" v-on:click="handleClose()">继续操作</button>
                </div>
              </div>
            </scroller>
          </div>
        </div>
				<div class="scrollbar-y"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>