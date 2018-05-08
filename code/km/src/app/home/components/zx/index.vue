<template>
  <div class="zx-page">
    <app-header title="征信查询"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="login">
            <img src="~assets/images/zx_logo.png">
          </div>

          <div class="main">
            <h2 class="title">个人征信记录，尽在掌握！</h2>
            <div class="item">个人信用信息提示</div>
            <div class="item">个人信用信息概要</div>
            <div class="item">个人信用报告</div>
            <div class="item">
							<a href="http://u5150735.viewer.maka.im/k/ARPMAMEY">信用与生活</a>
						</div>
          </div>
        </div>
				<div class="foot">
            <a class="authorize" v-on:click="goToAuth()">授权</a>
            <router-link :to="{ name: 'home.ZxDetail' }" class="history">
              历史记录
            </router-link>
            <a href="https://ipcrs.pbccrc.org.cn/" class="reg">首次查询，立即注册</a>
          </div>

          <div class="copyright">
            <span>数据来源于：</span>
            <i class="sp sp-zx-foot-logo"></i>
            <span>中国人民银行征信中心</span>
          </div>
      </div>
			<app-footing></app-footing>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>