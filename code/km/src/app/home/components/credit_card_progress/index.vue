<template>
  <div class="creditcard-progress-page">
    <app-header title="进度查询"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
				<div class="tips">
					<i class="icon icon-horn"></i>
					<div class="notice">
						<div class="marquee">卡盟金服信贷流量服务平台告知：因部分合作银行因自身系统原因，为了保护客户隐私问题，不直接提供客户详细数据，必须有我们平台用户主动申请查询办卡信息，才能快速结算佣金，谢谢大家配合！已有同一银行信用卡的用户，重复申请（附属卡）将无法产生佣金奖励。立即查询：审批结果成功下卡、审批拒绝、平台都会奖励价值68元的大礼包</div>
					</div>
				</div>
        <div class="big-title">按银行查询批卡进度</div>
        <ul class="bank-list">
          <li class="item" v-for="(item, index) in bankList" :key="index">
            <!-- <router-link :to="{ name: 'home.CreditCardProgressQuery', params: { id: item.id } }"> -->
            <a href="javascript:" @click="jumpQuery(item)">
              <div class="logo">
                <div class="image">
                  <img :src="item.thumb" alt="">
                  <div class="info-tips" v-show="item.num">
                    <span>{{ item.num }}</span>
                  </div>
                </div>
              </div>
              <div class="name">{{ item.name }}</div>
							<div class="refer">进度查询</div>
            </a>
          </li>
        </ul>
      </div>
			<app-footing></app-footing>
    </scroller>
    <Socket ref="socket"></Socket>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
