<template>
  <div class="help_center">
    <app-header title="帮助中心">
      <section slot="right">
        <ul class="help-nav">
          <li class="item" :class="{ 'on': formText == '金融业务' }" @click="switchNav('金融业务')">
            <a href="javascript:">金融业务</a>
          </li>
          <li class="item" :class="{ 'on': formText == '汽车保险' }" @click="switchNav('汽车保险')">
            <a href="javascript:">汽车保险</a>
          </li>
        </ul>
        <input type="text" v-model="searchString" class="search-box" placeholder="搜索">
      </section>
    </app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="controller">
					<div class="help">
						<ul class="list" v-for="(item, index) in formTemp.list" :key="index">
							<li class="item">
								<div class="generalize" @click="switchItem(index)">
									<span class="num">{{ index + 1 }}、</span>
									<span class="text">{{ item.post_title }}</span>
									<div class="right">
										<i class="sp sp-bottom" v-show="!item.status"></i>
										<i class="sp sp-top" v-show="item.status"></i>
									</div>
									<transition enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight">
										<div class="content" v-show="item.status" v-html="item.post_content"></div>
									</transition>
								</div>
							</li>
						</ul>
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
