<template>
  <div class="car_manage-page">
    <app-header title="车辆管理"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
					<ul class="list">
						<li class="item" v-for="(item, index) in formTemp.list" :key="index">
							<i class="icon icon-del" @click.stop="del(item)"></i>
							<div class="car">
								<span class="number">车牌号码：</span>
								<span class="info">{{ item.carLicenseNo || '无' }}</span>
							</div>
							<div class="car">
								<span class="number">品牌型号：</span>
								<span class="info">{{ item.brand || '无' }}</span>
							</div>
							<div class="car">
								<span class="number">车辆识别代码：</span>
								<span class="info">{{ item.vinCode || '无' }}</span>
							</div>
							<div class="car">
								<div class="left">
									<span class="number">发动机号：</span>
									<span class="info">{{ item.engineNo || '无' }}</span>
								</div>
								<div class="right">
									<span class="number">初登日期：</span>
									<span class="info">{{ item.registDate || '无' }}</span>
								</div>
							</div>
              <a href="javascript:" class="insurBtn" @click="offer(item)">投保</a>
						</li>
					</ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>