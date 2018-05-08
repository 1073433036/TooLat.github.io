<template>
  <div class="apply-guide">
    <app-header title="信用卡申请指南"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="content">
					<div class="photo">
						<img :src="bank.banner" alt="">
					</div>
				</div>
				<div class="flow">
					<ul class="item">
						<li class="list" v-for="(item, index) in bank.content" @click="enlarge(item.img)" :key="index">
							<div class="title">
								<div class="step">办理流程 {{ index + 1 }}/7</div>
								<div class="open">{{ item.title }}</div>
							</div>
							<div class="info">
								<div class="photo">
									<img :src="item.img" alt="">
								</div>
								<div class="text">{{ item.text }}</div>
							</div>
						</li>
					</ul>
				</div>

        <div class="card-guide">
          <img src="~assets/images/card-guide.jpg">
        </div>
      </div>
    </scroller>
		<div class="big-photo" v-show="isShow">
			<div class="mask" @click="isShow = false"></div>
			<div class="box">
				<scroller>
					<img :src="image" alt="">
				</scroller>
			</div>
			<i class="icon icon-close" @click="isShow = false"></i>
		</div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
