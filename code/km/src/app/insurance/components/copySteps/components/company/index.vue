<template>
  <div class="card_insurance">
    <app-header title="保险公司">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list" v-for="(item, index) in formTemp.list">
										<div class="logo">
                      <img class="image" :src="item.logo">
                      <!-- <span class="image sp" :class="'sp-' + item.logo"></span> -->
                    </div>
										<div class="name">{{ item.prvName }}</div>
										<div class="select">
                      <div class="box">
                        <div class="money">保费合计：{{ item.price }}元</div>
                        <div class="detail">
                          <router-link :to="{ name: 'insurance.CopyStepsDetail', query: { prvId: item.prvId, type: type } }">查看详情</router-link>
                          <router-link :to="{ name: 'insurance.CopyStepsAllocation', query: { type: type } }">马上投保</router-link>
                        </div>
                      </div>
                      <!-- <label class="checkbox-wrappe">
                        <span class="checkbox" :class="{ 'checkbox-checked': item.status }">
                          <span class="checkbox-inner"></span>
                        </span>
                      </label> -->
										</div>
									</li>
              	</ul>
								<!-- <div class="btn active" @click="submint">确认</div> -->
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