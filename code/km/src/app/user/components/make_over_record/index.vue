<template>
  <div class="make_over_record">
    <app-header title="转让记录">
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
										<div class="data">{{ item.add_time | toDate }}</div>
										<div class="time">{{ item.add_time | toTime }}</div>
									</div>
									<div class="middle">
										<span class="out">转出：</span>
										<span class="integral">{{ item.integral }}积分</span>
									</div>
									<div class="right">
										<div class="name">{{ item.extend.username }}</div>
										<div>受让人</div>
									</div>
								</li>
								<!-- <li class="list">
                  <div class="left">
                    <div class="data">2017-11-19</div>
                    <div class="time">15:30:30</div>
                  </div>
                  <div class="middle">
                    <span class="out">转出：</span>
                    <span class="integral">50积分</span>
                  </div>
                  <div class="right">
                    <div class="name">候耀华</div>
                    <div>受让人</div>
                  </div>
                </li> -->
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