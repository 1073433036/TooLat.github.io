<template>
  <div class="exhibition_drawing-page">
		<div class="main">
			<ul class="list">
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomMapDetail' }">
						<div class="image">
							<img src="~assets/images/selfdom.jpg" alt="">
						</div>
						<div class="title">标题一二三四五六七八九十一</div>
					</router-link>
				</li>
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomMapDetail' }">
						<div class="image">
							<img src="~assets/images/selfdom.jpg" alt="">
						</div>
						<div class="title">标题一二三四五六七八九十一</div>
					</router-link>
				</li>
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomMapDetail' }">
						<div class="image">
							<img src="~assets/images/selfdom.jpg" alt="">
						</div>
						<div class="title">标题一二三四五六七八九十一</div>
					</router-link>
				</li>
				<li class="item">
					<router-link :to="{ name: 'tool.SelfdomMapDetail' }">
						<div class="image">
							<img src="~assets/images/selfdom.jpg" alt="">
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