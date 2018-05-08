<template>
  <div class="convert_record">
    <app-header title="兑奖记录">
    </app-header>
      <scroller ref="my_scroller"
        :on-refresh="refresh"
        :on-infinite="infinite">
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list" v-for="(item, index) in formTemp.log">
										<p class="info">
											<span class="shop_name">{{ item.desc }}</span>
											<span class="state">兑换成功</span>
										</p>
										<p class="info_time">
											<span>{{ item.add_time }}</span>
											<span class="get">-{{ item.integral }}</span>
										</p>
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