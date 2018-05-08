<template>
  <div class="insurance-page">
    <app-header :title="isTest ? '模拟投保' : '汽车保险'">
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="main">
            <div class="photo" ref="mySwiper">
							<ul class="item swiper-wrapper">
							  <li class="list swiper-slide">
                  <router-link :to="{name: 'insurance.AutoH5'}">
								    <img src="~assets/images/card-insurance.jpg" alt="">
                  </router-link>
							  </li>
								<li class="list swiper-slide">
                  <router-link :to="{name: 'insurance.AutoBanner'}">
									  <img src="~assets/images/card-insurance-01.jpg" alt="">
                  </router-link>
								</li>
								<li class="list swiper-slide">
                  <router-link :to="{name: 'insurance.AutoBanner'}">
									  <img src="~assets/images/card-insurance-02.jpg" alt="">
                  </router-link>
								</li>
								<li class="list swiper-slide">
                  <router-link :to="{name: 'insurance.AutoBanner'}">
									  <img src="~assets/images/card-insurance-03.jpg" alt="">
                  </router-link>
								</li>
							</ul>
							<div class="swiper-pagination"></div>
            </div>
						<div class="tips">
							<i class="icon icon-horn"></i>
							<div class="notice">
								<div class="marquee">卡盟金服信贷流量服务平台：卡盟金服平台负责互联网拓客推广办理服务，车险办理不需要任何前期费用，核单成功后由合作保险公司结算报价，保险业务，西藏、青海、新疆、以上地区暂时不能受理车险业务。谨防电话诈骗。客服电话400-018-8616</div>
							</div>
            </div>
            <div class="info">
              <div class="left">
                <!-- <router-link :to="{ name: 'insurance.Indent' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({ name: 'insurance.Indent' })">
                  <div class="indent">
										<i class="sp sp-indent"></i>
										<span>订单</span>
                  </div>
								</a>
                <!-- </router-link> -->
              </div>
              <div class="right">
                <!-- <router-link :to="{ name: 'insurance.CarManage' }"> -->
								<a href="javascript:void(0)" @click="linkToRoute({ name: 'insurance.CarManage' })">
                  <div class="indent">
										<i class="sp sp-car"></i>
										<span>车辆管理</span>
                  </div>
								</a>
                <!-- </router-link> -->
              </div>
            </div>
            <div class="box">
              <ul class="item">

                <li class="list" @click="isShow = true">
                  <div class="select">
                    <div class="name">投保地区</div>
                    <div class="city">
                      <i class="sp sp-location-01"></i>
                      <span v-if="address" class="text">{{ address }}</span>
											<span v-else class="text">请选择</span>
                      <i class="sp sp-right right"></i>
                    </div>
                  </div>
                </li>

                <li class="list">
                  <div class="select">
                    <div class="name">车牌号码</div>
                    <input v-show="!formData.isNew"
                      type="text"
                      maxlength="8"
                      v-model.trim="formData.carLicenseNo"
                      ref="carLicenseNo"
                      placeholder="请输入车牌号码">
                    <input v-show="formData.isNew"
                      type="text"
                      value="未上牌"
                      readonly
                      placeholder="请输入车牌号码">
                    <div class="city">
                      <Checkbox v-model="formData.isNew">未上牌</Checkbox>
                    </div>
                  </div>
                </li>

                <li class="list" v-show="isJiangSu">
                  <div class="select">
                    <div class="name">车架号</div>
                    <input type="text"
                      maxlength="17"
                      v-model.trim="formData.vinCode"
                      ref="vinCode"
                      placeholder="请输入车架号">
                  </div>
                </li>

                <li class="list">
                  <div class="select">
                    <div class="name">车主姓名</div>
                    <input type="text"
                      v-model.trim="formData.name"
                      ref="name"
                      placeholder="请输入车主姓名">
                  </div>
                </li>

                <li v-show="!formData.isNew && isTest" class="list" @click="handleDateChange('endDate')">
                  <div class="select">
                    <div class="name">到期时间</div>
                    <input type="text"
                      vd-required
                      readonly
                      v-model.trim="formData.endDate"
                      vd-notify='{
                        "text": "请选择日期",
                      }'
                      placeholder="请选择日期">
                  </div>
                </li>

              </ul>
            </div>

            <div class="help">
              <router-link :to="{ name: 'user.HelpCenter', query: { id: 2 } }">《帮助中心》</router-link>
              <!-- <router-link v-show="!isTest" :to="{ name: 'insurance.Home', query: { act: 'test' } }" class="test">《模拟投保》</router-link> -->
							<a href="javascript:void(0)" v-show="!isTest" @click="linkToRoute({ name: 'insurance.Home', query: { act: 'test' } })" class="test">《模拟投保》</a>
              <router-link :to="{ name: 'insurance.AutoH5' }">《了解车险》</router-link>
            </div>

            <div class="btn" @click="submint">下一步</div>

						<!-- <div class="explain">2017年中国汽车拥有量已达2.43亿辆，预计每年将以15%-20%的速度递增，车险是每年必须购买的，一次性推广，你年年躺赚！</div> -->
            <div class="remarks">
              <h3>注意事项</h3>
              <p>工作时间：08:30 - 12:00  14:00 - 18:00</p>
              <p>1、核保、支付、承保打单、配送受机构上班时间限制，非上班时间提交的任务无法处理，待业管上班处理。</p>
              <p>2、对于即日起保单需在当天上班时间内完成支付，否则保险公司无法确认承保，有可能无法生成保单，会出现脱保的情况。</p>
            </div>
            <div class="remarks">
              <h3>汽车保险投保须知</h3>
              <p>汽车保险投保大部分地区可提前90天投保；长沙、温州、浙江、山东地区可提前60天；江苏可提前40天；福建、宁波可提前30天。感谢大家的配合。</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="to-real-auth" v-if="userInfo.level <= 1" @click="handleInsur"></div> -->
    </scroller>
		<CityList :isShow="isShow" v-on:onCityClick="handleCityClick"></CityList>

    <Dates v-on:onDateClick="handelDateClick"
    :show="isDate"
    :today="true"></Dates>

<!--     <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div v-show="isMaskVip" class="mask-vip">
        <div class="mask" @click="isMaskVip = false"></div>
        <div class="inner">
          <div class="close" @click="isMaskVip = false">
            <i class="icon icon-close"></i>
          </div>
          <scroller>
            <img src="~assets/images/creditcard-04.jpg">
          </scroller>
        </div>
      </div>
    </transition> -->

    <section class="order-msg" v-if="orderMsgHolder">
      <div class="order-msg-popup" >
        <header>
          <i class="sp sp-close" @click="orderMsgHolder = false"></i>
        </header>
        <div class="cont">
          <div class="title">{{ orderMsg.title }}</div>
          <div class="content">{{ orderMsg.content }}</div>
          <div class="time">{{ orderMsg.time }}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
