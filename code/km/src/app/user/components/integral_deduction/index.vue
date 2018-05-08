<template>
  <div class="integral_deduction">
    <app-header title="积分抵扣">
    </app-header>
    <scroller ref="my_scroller"
      :on-refresh="refresh"
      :on-infinite="infinite">
      <div class="wrapper">
        <div class="controller">
          <div class="main">
							<ul class="item">
								<li class="list" v-for="(item, index) in formTemp.list">
									<div class="left">
										<div class="data">{{ item.add_time.split(' ')[0] }}</div>
										<div class="time">{{ item.add_time.split(' ')[1]}}</div>
									</div>
									<div class="middle">{{ item.desc }}</div>
									<div class="right">{{ item.integral }}</div>
								</li>
            	</ul>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>