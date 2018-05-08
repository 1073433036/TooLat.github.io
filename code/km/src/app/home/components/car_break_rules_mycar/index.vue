<template>
  <div class="my-car-page">
    <app-header title="车辆违章信息"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="car-title">
          <div><img src="~assets/images/break-icon-che.png" alt="">{{ carNumber ? carNumber.substring(0, 2) + ' ' + carNumber.substring(2) : '' }}</div>
        </div>
        <div class="car-state">
          <ul class="state-list">
            <li>
              <p class="num">{{breakRules.unDeal && breakRules.unDeal.total_num ? breakRules.unDeal.total_num : 0}}</p>
              <p>违章</p>
            </li>
            <li>
              <p class="num">{{breakRules.unDeal && breakRules.unDeal.total_degree ? breakRules.unDeal.total_degree : 0}}</p>
              <p>扣分</p>
            </li>
            <li>
              <p class="num">{{breakRules.unDeal && breakRules.unDeal.total_count ? breakRules.unDeal.total_count : 0}}</p>
              <p>罚款</p>
            </li>
          </ul>
        </div>

        <div class="car-break-list-wrapper" v-if="breakRules.peccancy_list && breakRules.peccancy_list.length">
          <div class="car-break-list" v-for="(el, index) in breakRules.peccancy_list" :key="index">
            <div class="title">
              <div :class="['check-box', { on: el.selected }]" @click="toggleSingle(el)" v-if="el.status === 0"></div>
              <span v-else>已处理</span>
              <div :class="['time', { right: el.status === 1 }]">{{el.time}}</div>
              <div class="can-process" v-if="el.status === 0 && el.can_process === 1">可代缴</div>
              <div class="tool" @click="goCarDetails(el)">查看更多</div>
            </div>
            <div class="conter">
              <div class="conter-tit">{{el.location}}</div>
              <p class="detail">{{el.reason}}</p>
            </div>
            <div class="bottom-btn">
              <ul>
                <li>
                  <span class="blue">扣</span>{{el.actual_degree}}
                </li>
                <li>
                  <span class="yellow">罚</span>{{el.count}}
                </li>
                <li>
                  <span class="red">滞</span>{{el.latefine}}
                </li>
                <li>
                  <span class="green">服</span>{{ el.servicePrice }}
                </li>
              </ul>
              <!-- <button :class="{ deal: el.status === 1 }" @click="dealIllegal(el)">
                {{ el.status === 1 ? '已处理' : '去办理' }}
              </button> -->
            </div>
          </div>
        </div>

      </div>
    </scroller>

    <div class="deal-wrapper" v-if="breakRules.peccancy_list && breakRules.peccancy_list.length">
      <div class="select-btn-wrapper" @click="toggleAllSelected">
        <em :class="{on : isAllSelected}"></em>
        <div class="select-btn">全选</div>
      </div>
      <div class="order-detail">
        <div class="top">已选 {{ countOfSelected }} 笔 共扣 {{ pointOfSelected }} 分</div>
        <div class="bottom">合计费用 <span>￥{{ priceOfSelected }}</span></div>
      </div>
      <div :class="['deal-btn', { off: !hasSelected }]" @click="dealIllegal">去办理</div>
    </div>
  </div>
</template>
<script>
  import Index from './index.js';
  export default Index;
</script>
