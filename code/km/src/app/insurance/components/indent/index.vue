<template>
  <div class="indent-page">
    <app-header title="订单" :other="true" v-on:other="goBackHomePage"></app-header>
    <scroller
      :on-refresh="refresh"
      :on-infinite="infinite"
      ref="my_scroller">
      <div class="wrapper">
        <div class="container">
					<ul class="list">
						<li class="item" v-for="(item, index) in formTemp.list" :key="index">

							<div class="top" @click="quoted(item)">
								<div class="head">
									<img v-if="item.avatar" :src="item.avatar" alt="">
									<img v-else src="~assets/images/avatar.png" alt="">
								</div>
								<div class="box">
									<div class="info">
										<span class="name">车主：{{ item.carOwner.name }}</span>
										<div class="day">
											<span class="time">{{ item.create_at }}</span>
										</div>
									</div>
									<div class="info">
										<span class="plate-number">{{ item.carInfo.carLicenseNo }}</span>
										<div class="day">
											<span class="city">{{ item.area_name }}</span>
											<span class="time">
												共计
												<span class="num" v-if="item.offer_list">{{ item.offer_list.length }}</span>
												<span class="num" v-else>0</span>
												家完成报价
											</span>
										</div>
									</div>
								</div>
							</div>

              <transition-group name="flip-list" enter-active-class="animated bounceInLeft" leave-active-class="animated bounceOutRight" class="list-insure" v-if="item.offer_list && item.offer_list.length != 0" tag="ul">
								<li class="insurance" v-for="(insure, i) in item.offer_list" :key="i" v-show="2 > i || item.state" @click="quoted(item)">
									<div class="name" v-if="insure.i">{{ insure.i.name }}</div>
                  <div class="name" v-else-if="insure.q">{{ insure.q.prvName }}</div>
                  <div class="content" v-if="insure.q.errorMsg">{{ insure.q.errorMsg }}</div>
                  <div class="content" v-else-if="insure.q.insureInfo && insure.q.insureInfo.totalPremium">{{ insure.q.insureInfo.totalPremium }}</div>
                  <div class="content" v-else></div>
									<div class="policy" v-if="insure.q">{{ insure.q.taskStateDescription }}</div>
								</li>
              </transition-group>

							<div class="offer" v-if="item.offer_list && item.offer_list.length != 0">
								<span class="unfold" :class="{ 'on': item.state }" @click="switchShow(item)">
									<i class="sp sp-unfold"></i>
									{{  item.state ? '点击收起' : '点击展开' }}
								</span>
								<span class="amend" @click="handleDelOrder(item, index)">
									<i class="icon icon-del"></i>
									删除订单
								</span>
							</div>

						</li>
					</ul>
        </div>
      </div>
    </scroller>

    <transition name="fade">
      <div v-if="isPopupShow" class="dialog" >
        <div class="content">
          <div>
              <span><i class="warning"></i></span>
              <span class="close " v-on:click="isPopupShow = false"><i class="cancel2"></i></span>
          </div>
          <div class="bd">
            <p>您的订单已经核保成功，请您尽快支付，订单在3个工作日之后才可删除。</p>
          </div>
          <button class="delect">确定</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
