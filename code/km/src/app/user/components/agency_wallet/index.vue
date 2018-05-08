<template>
  <div class="wallet-page">
    <app-header title="钱包">
			<div class="slot" slot="right">
				<div class="right" v-if="$route.path == '/user/wallet'">
					<router-link :to="{}">
						<i class="sp sp-name"></i>
					</router-link>
				</div>
			</div>
		</app-header>
		<scroller>
			<div class="wrapper">
				<div class="container">
					<div class="main">
						<div class="top">
							<div class="earnings">总收益</div>
							<div class="money">￥<span>10000.00</span></div>
							<div class="kiting"><span class="text">我要提现</span></div>
							<div class="info">
								<ul class="list">
									<li class="item">
										<div class="number">0.00</div>
										<div class="balance">账户余额</div>
									</li>
									<li class="item">
										<div class="number">0.00</div>
										<div class="balance">分润余额</div>
									</li>
									<li class="item">
										<div class="number">0.00</div>
										<div class="balance">推广余额</div>
									</li>
								</ul>
							</div>
						</div>
						<div class="menu-group">
							<router-link :to="{ name: 'home.Loan' }" class="item">
								<i class="sp sp-type-01"></i>
								<em>收益明细</em>
							</router-link>
							<router-link :to="{ name: 'home.Peer' }" class="item">
								<i class="sp sp-type-02"></i>
								<em>积分明细</em>
							</router-link>
							<div class="item" v-on:click.stop="skipPayPage">
								<i class="sp sp-type-03"></i>
								<em>提现记录</em>
							</div>
							<router-link :to="{ name: 'home.Zx' }" class="item">
								<i class="sp sp-type-04"></i>
								<em>卡管理</em>
							</router-link>
						</div>
						<div class="box">
							<div class="team">
								<div class="left">团队</div>
								<div class="info">轻松管理我的团队信息</div>
							</div>
							<div class="content">
								<div class="people"><span class="number">10</span>人</div>
								<div class="my-team">（我的团队人数）</div>
								<div class="examine">立即查看</div>
							</div>
						</div>
						<div class="list-group">
							<ul class="list">
								<li class="item">
									<div class="title">
										<i class="sp sp-agent"></i>
										<span class="area">合伙人专区</span>
									</div>
									<div class="info">
										<div class="left">
											<img src="~assets/images/team-02.png" alt="">
										</div>
										<div class="middle">
											<div class="know">了解合伙人</div>
											<div class="help">共同帮助更多需求的用户</div>
										</div>
										<div class="watch">立即查看</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="list-group">
							<ul class="list">
								<li class="item">
									<div class="title">
										<i class="sp sp-agent"></i>
										<span class="area">合伙人详情</span>
									</div>
									<div class="info">
										<div class="left">
											<img src="~assets/images/team-04.png" alt="">
										</div>
										<div class="middle">
											<div class="know">合伙人账户管理</div>
											<div class="help">未激活账户管理</div>
										</div>
										<div class="watch">立即查看</div>
									</div>
								</li>
							</ul>
						</div>
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