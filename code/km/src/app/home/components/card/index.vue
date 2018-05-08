<template>
  <div class="home-card-page">
    <app-header title="办卡查询"></app-header>
		<div class="my-team">
      <i class="sp sp-sea"></i>
			<div class="input">
				<input type="text" placeholder="请输入人名 + 手机号码">
			</div>
    </div>
    <div class="nav">
      <div class="nav-group">
        <div class="item" :class="{ active: 0 === active}" v-on:click="active = 0">
					<div class="sprite">
						<span class="sp sp-refer01"></span>
					</div>
					<div class="title">待确定</div>
				</div>
        <div class="item" :class="{ active: 1 === active}" v-on:click="active = 1">
					<div class="sprite">
						<span class="sp sp-refer02"></span>
					</div>
					<div class="title">待审核</div>
				</div>
        <div class="item" :class="{ active: 2 === active}" v-on:click="active = 2">
					<div class="sprite">
						<span class="sp sp-refer03"></span>
					</div>
					<div class="title">未通过</div>
				</div>
        <div class="item" :class="{ active: 3 === active}" v-on:click="active = 3">
					<div class="sprite">
						<span class="sp sp-refer04"></span>
					</div>
					<div class="title">已完成</div>
				</div>
      </div>
    </div>
    <scroller
      ref="my_scroller">
      <div class="wrapper">
				<div class="container">
          <ul v-show="0 === active" class="list">
            <li class="item" tag="li">
              <div class="avatar">
								<div class="photo">
									<img src="~assets/images/bank_logo/gs.png" alt="">
								</div>
								<div class="title">工商银行</div>
              </div>
              <div class="info">
                <h2 class="name">申请人 ：赵**</h2>
                <span class="grade">（专员）</span>
                <p class="phone">手机号：13512345678</p>
                <p class="time">浏览时间：2017-12-14
									<span class="date">10:20:21</span>
								</p>
              </div>
              <div class="right" v-on:click="handleQuery()">查进度</div>
            </li>
            <li class="item" tag="li">
              <div class="avatar">
								<div class="photo">
									<img src="~assets/images/bank_logo/zs.png" alt="">
								</div>
								<div class="title">招商银行</div>
              </div>
              <div class="info">
                <h2 class="name">申请人 ：赵**</h2>
                <span class="grade">（专员）</span>
                <p class="phone">手机号：13512345678</p>
                <p class="time">浏览时间：2017-12-14
									<span class="date">10:20:21</span>
								</p>
              </div>
              <div class="right" v-on:click="handleQuery()">查进度</div>
            </li>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>