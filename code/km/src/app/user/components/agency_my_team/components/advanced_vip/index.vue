<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="insurance_attache" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">高级会员</div>
      </div>
      <scroller>
        <div class="main">
						<ul class="list">
							<li class="item">
								<div class="head">
									<img src="~assets/images/head-01.png" alt="">
								</div>
								<div class="box">
									<div class="info">
										<div class="person">
											<span class="name">赵敏</span>
											<span class="partner">保险专员</span>
										</div>
										<div class="date">
											<span>2018-3-21</span>
											<span>12:20:21</span>
										</div>
									</div>
									<div class="phone">
										<div class="person">13312345678</div>
										<div class="date">（升级会员时间）</div>
									</div>
								</div>
							</li>
							<li class="item">
								<div class="head">
									<img src="~assets/images/head-01.png" alt="">
								</div>
								<div class="box">
									<div class="info">
										<div class="person">
											<span class="name">赵敏</span>
											<span class="partner">保险专员</span>
										</div>
										<div class="date">
											<span>2018-3-21</span>
											<span>12:20:21</span>
										</div>
									</div>
									<div class="phone">
										<div class="person">13312345678</div>
										<div class="date">（升级会员时间）</div>
									</div>
								</div>
							</li>
						</ul>
        </div>
      </scroller>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>