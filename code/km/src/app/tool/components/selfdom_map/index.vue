<template>
  <div class="selfdom_map-page">
    <app-header title="个性趣图"></app-header>
			<div class="nav-group">
				<ul class="nav-item">
					<li class="nav-list" v-for="(item, index) in arr" :key="index" @click="toggleTabs(index)" :class="{ active:activeIndex == index }">{{ item }}</li>
      	</ul>
      </div>
      <scroller
      :on-refresh="refresh"
      :on-infinte="infinte"
      ref="my_scroller">
        <div class="wrapper">
          <div class="controller">
            <Drawing v-show="activeIndex == 0 ? true : false"></Drawing>
            <Card v-show="activeIndex == 1 ? true : false"></Card>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>