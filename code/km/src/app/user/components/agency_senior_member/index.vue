<template>
	<div class="agency_senior_member-page">
		<app-header title="高级会员"></app-header>
		<div class="main">
			<ul class="list">
				<li class="item" v-for="(item, index) in arr" :key="index"
				@click="toggleTabs(index)" :class="{ active:activeIndex == index }">
						{{item}}
				</li>
			</ul>
		</div>
		<scroller
			:on-refresh="refresh"
			:on-infinite="infinite"
			ref="my_scroller">
			<div class="wrapper">
				<div class="controller">
					<Primary  v-show="activeIndex == 0 ? true: false"></Primary>
					<Manager  v-show="activeIndex == 1 ? true: false"></Manager>
					<Advanced v-show="activeIndex == 2 ? true: false"></Advanced>
				</div>
			</div>
		</scroller>
	</div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>