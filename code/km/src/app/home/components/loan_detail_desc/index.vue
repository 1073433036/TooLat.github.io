<template>
  <main class="loan-detail-desc-page">
    <app-header title="注意事项"></app-header>
    <scroller>

      <div class="wrapper">
        <div class="content">
					<div class="photo">
						<img :src="'http://cdn.kamengjinfu.com/assets/' + config[loanId].banner" alt="">
					</div>
				</div>
				<div class="flow">
					<ul class="item">
						<li class="list" v-for="(item, index) in config[loanId].content" :key="index">
							<div class="title">
								<div class="step">办理流程 {{ index + 1 }}/{{ config[loanId].content.length }}</div>
								<div class="open">{{ item.title }}</div>
							</div>
							<div class="info">
								<div class="photo">
									<img :src="'http://cdn.kamengjinfu.com/assets/' + el" v-for="(el, i) in item.img" :key="i" @click="enlarge(el)">
								</div>
								<div :class="['text', { right: item.img.length === 2 }]">{{ item.text }}</div>
							</div>
						</li>
					</ul>
				</div>
      </div>
      <img class="bottom-desc" v-if="loanId == '27'" src="~assets/images/loan/nwd-bottom.png">
      <img class="bottom-desc" v-else-if="loanId == '43'" src="~assets/images/loan/rxf-bottom.png">
      <img class="bottom-desc" v-else src="~assets/images/loan/crk-bottom.png">

    </scroller>

		<div class="big-photo" v-show="isShow">
			<div class="mask" @click="isShow = false"></div>
			<div class="box">
				<scroller>
					<img :src="'http://cdn.kamengjinfu.com/assets/' + image" alt="">
				</scroller>
			</div>
			<i class="icon icon-close" @click="isShow = false"></i>
		</div>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
