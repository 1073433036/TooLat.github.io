<template>
  <div class="exhibition_card-page">
		<div class="main">
			<ul class="list">
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomCardDetail' }">
						<div class="image">
							<div class="info">
								<div class="left">
									<div class="phone">
										<i class="sp sp-phone-02"></i>
										<span>13512345678</span>
									</div>
									<div class="wechat">
										<i class="sp sp-wechat-02"></i>
										<span>13512345678</span>
									</div>
								</div>
								<div class="right">
									<div class="photo">
										<img src="~assets/images/code-00.png" alt="" />
									</div>
								</div>
							</div>
						</div>
						<div class="title">标题一二三四五六七八九十一</div>
					</router-link>
				</li>
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomCardDetail' }">
						<div class="image">
							<div class="info">
								<div class="left">
									<div class="phone">
										<i class="sp sp-phone-02"></i>
										<span>13512345678</span>
									</div>
									<div class="wechat">
										<i class="sp sp-wechat-02"></i>
										<span>13512345678</span>
									</div>
								</div>
								<div class="right">
									<div class="photo">
										<img src="~assets/images/code-00.png" alt="" />
									</div>
								</div>
							</div>
						</div>
						<div class="title">标题一二三四五六七八九十一</div>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>