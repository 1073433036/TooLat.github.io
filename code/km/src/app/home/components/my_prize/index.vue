<template>
  <div class="my_prize">
    <app-header title="我的奖品">
    </app-header>
    <scroller ref="my_scroller"
        :on-refresh="refresh"
        :on-infinite="infinite">
      <div class="wrapper">
        <div class="controller">
          <div class="main">
							<ul class="item">

								<li class="list" v-for="(item, index) in formTemp.list" v-if="item.is_lucky == 1">
									<p class="info">
										<span class="shop_name">{{ item.prize }}</span>
                    <span class="state" v-if="item.address">领取成功</span>
                    <span class="no_state" v-else>未领取</span>
									</p>
									<p class="info_time">
										<span class="date">{{ item.add_time }}</span>
										<span class="get" v-if="!item.address">
											<router-link :to="{ name: 'home.PrizeGet', params: { id: item.id } }">去领取</router-link>
										</span>
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