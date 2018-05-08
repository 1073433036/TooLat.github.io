<template>
	<!-- 遮罩层 -->
	<div class="SimulationApplyLoan-page">
		<div class="content" ref="SwiperPage">
			<ul class="list swiper-wrapper">
				<li class="item swiper-slide">
					<span class="sp sp-Applay"></span>
					<a class="resPath" href="javascript:" @click="tuNextpage">进入答题</a>
				</li>
				<li class="item swiper-slide" v-for="(item,firstIndex) in swiperList" :key="firstIndex">
					<div class="container">
						<h2>{{item.title}} ? ({{item.swiperPage}}/9)</h2>
						<div class="round">
							<ul>
								<li v-for="(Next,index) in item.options" :key="index" @click.stop="chlick(Next, index)">
									<span :class="{ 'borderColoer': index === swIperindex }">{{Next.Whatchoice}}</span>
								</li>
							</ul>
						</div>
						<div class="nextTab" @click.stop="toNext(firstIndex)">
							<span>{{text}}</span>
						</div>
					</div>
				</li>
			</ul>
			<!-- <div class="swiper-pagination"></div> -->
		</div>
	</div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>