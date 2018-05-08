<template>
  <div class="agency_my_team-page">
    <app-header title="我的团队"></app-header>
		<scroller>
			<div class="wrapper">
				<div class="container">
					<div class="main">
						<div class="top">
							<div class="head">
								<img src="~assets/images/head-01.png" alt="">
							</div>
							<div class="info">
								<div class="team">团队（人）</div>
								<div class="number">20</div>
							</div>
						</div>
						<div class="today">
							<div class="new-add">
								<div>今日新增（人）</div>
								<div class="number">1</div>
							</div>
							<div class="attention">
								<div>今日新增关注（人）</div>
								<div class="number">1</div>
							</div>
						</div>
					</div>
					<div class="list-group">
						<ul class="list">
							<li class="item" @click="vip = true">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-04"></i>
									<span class="number">高级会员</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item" @click="insurance = true">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-05"></i>
									<span class="number">保险专员</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-06"></i>
									<span class="number">保险经理</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-07"></i>
									<span class="number">个人代理</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-08"></i>
									<span class="number">区域代理</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-09"></i>
									<span class="number">锁粉人数</span>
								</div>
								<div class="right">2人</div>
							</li>
							<li class="item">
								<i class="sp sp-right"></i>
								<div class="left">
									<i class="sp sp-team-10"></i>
									<span class="number">今日新增</span>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</scroller>
		<Insurance v-show="insurance"></Insurance>
		<Vip v-show="vip"></Vip>
	</div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>