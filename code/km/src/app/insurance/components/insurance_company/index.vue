<template>
  <div class="card_insurance">
    <app-header title="保险公司">
    </app-header>
      <scroller ref="my_scroller"
        :on-refresh="refresh">
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list" v-for="(item, index) in formTemp.list" @click="selectPrv(item)">
										<div class="logo">
                      <img v-if="item.info" :src="item.info.logo" alt="">
                    </div>
										<div class="name">{{ item.prvName }}</div>
										<div class="select">
                      <label class="checkbox-wrappe">
                        <span class="checkbox" :class="{ 'checkbox-checked': item.status }">
                          <span class="checkbox-inner"></span>
                        </span>
                      </label>
										</div>
									</li>
              	</ul>
								<div class="btn active" @click="submint">确认</div>
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