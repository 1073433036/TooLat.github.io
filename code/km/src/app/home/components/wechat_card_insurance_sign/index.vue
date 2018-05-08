<template>
  <div class="wechat_card_insurance_sign_page">
    <app-header title="汽车保险签约" :isBack="false"></app-header>
    <div class="wrapper">
    	<div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
          	<div class="controller">
			        <div class="main">
								<div class="photo">
									<img src="~assets/images/car-insurance-01.png" alt="">
								</div>
								<form class="form-box" ref="form" @submit.prevent="handleSumbit">
									<ul class="list">
										<li class="item">
											<input type="text"
												vd-required
												v-model.trim="formData.company"
												vd-notify='{
													"text": "保险机构名称不能为空",
													"patt": "保险机构名称格式不正确"
												}'
												placeholder="请输入保险机构名称">
										</li>
										<li class="item">
											<input type="text"
												vd-required
												v-model.trim="formData.quantity"
												vd-notify='{
													"text": "新车投保月考核数量不能为空",
													"patt": "新车投保月考核数量格式不正确"
												}'
												placeholder="新车投保月考核数量">
										</li>
										<li class="item">
											<input type="text"
												vd-required
												v-model.trim="formData.sum"
												vd-notify='{
													"text": "投保车辆月考核总台数不能为空",
													"patt": "投保车辆月考核总台数格式不正确"
												}'
												placeholder="投保车辆月考核总台数">
										</li>
										<li class="item">
											<input type="text"
												vd-required
												v-model.trim="formData.way"
												vd-notify='{
													"text": "佣金结算方式不能为空",
													"patt": "佣金结算方式格式不正确"
												}'
												placeholder="佣金结算方式">
										</li>
										<li class="item">
											<input type="text"
												vd-required
												v-model.trim="formData.name"
												vd-notify='{
													"text": "联系人不能为空",
													"patt": "联系人格式不正确"
												}'
												placeholder="联系人">
										</li>
										<li class="item">
											<input type="text"
												vd-required
												vd-validate
												vd-type="phone"
												maxlength="11"
												v-model.trim="formData.phone"
												vd-notify='{
													"text": "手机号码不能为空",
													"patt": "手机号码格式不正确"
												}'
												placeholder="请输入您常用的手机号码">
										</li>
									</ul>
									<div class="affirm">
										<button type="submit" class="btn" :class="{ active: active }" :disabled="!active">立即提交</button>
									</div>
								</form>
			        </div>
			      </div>
          </div>
        </div>
        <div class="swiper-scrollbar" ref="scrollbar"></div>
      </div>
    </div>
  </div>
</template>

<script>
	import Index from "./index.js";
	export default Index;
</script>