<template>
  <div class="credit-card-large-page">
    <app-header title="大额信用卡办理"></app-header>
    <scroller ref="myscroller">
	    <div class="banner">
	    	<img src="~assets/images/banner-large.jpg">
	    </div>
			<form class="info_box" ref="form" @submit.prevent="handleSumbit">
				<ul class="info">

					<li class="receiver">
						<span class="people">姓名：</span>
						<input type="text"
							vd-required
							vd-notify='{
                  "text": "姓名不能为空",
                }'
							class="input-item"
							placeholder="请填写真实姓名"
							v-model="formData.name">
					</li>

					<li class="receiver">
						<span class="people">所在单位：</span>
						<input type="text"
							vd-required
							vd-notify='{
                "text": "所在单位不能为空",
              }'
							class="input-item"
							placeholder="请填写所在单位名称"
							v-model="formData.company">
					</li>

					<li class="receiver">
						<span class="people">手机号码：</span>
						<input type="text"
							vd-required
							vd-validate
							vd-type="phone"
							vd-notify='{
                "text": "请输入11位手机号码",
                "patt": "手机号码格式不正确"
              }'
							class="input-item"
							placeholder="请填写11位手机号码"
							v-model="formData.phone">
					</li>

					<li class="receiver">
						<span class="people">年龄：</span>
						<input type="text"
							vd-required
							vd-notify='{
                "text": "年龄不能为空",
              }'
							class="input-item"
							placeholder="请填写真实年龄"
							v-model="formData.age">
					</li>

					<li class="receiver">
						<span class="people">是否有房：</span>
						<div class="input-box radio">
							<Radio v-model="formData.house" :dataList="formTemp.house"></Radio>
						</div>
					</li>

					<li class="receiver" v-show="formData.house">
						<span class="people">房屋面积：</span>
						<input type="text"
							class="recipients"
							placeholder="0.00"
							v-model="formData.house_size">
						<i class="money">平米</i>
					</li>

					<li class="receiver" v-show="formData.house">
						<span class="people">房产证所在城市：</span>
						<div class="select on" v-on:click="handleCityShowChange()">
							<span class="region">{{ city.region_name || '请选择' }}</span>
						</div>
						<i class="indicate sp sp-right"></i>
					</li>

					<li class="receiver" v-show="formData.house">
						<span class="people">房屋价值：</span>
						<input type="text"
							class="recipients"
							placeholder="0.00"
							v-model="formData.house_price">
						<i class="money">万元</i>
					</li>

					<li class="receiver">
						<span class="people">是否有车：</span>
						<div class="input-box radio">
							<Radio v-model="formData.car" :dataList="formTemp.car"></Radio>
						</div>
					</li>

					<li class="receiver" v-show="formData.car">
						<span class="people">汽车型号：</span>
						<input type="text"
							class="recipients"
							placeholder="请输入汽车型号"
							v-model="formData.car_ts">
					</li>

					<li class="receiver" v-show="formData.car">
						<span class="people">汽车估值：</span>
						<input type="text"
							class="recipients"
							placeholder="0.00"
							v-model="formData.car_price">
						<i class="money">万元</i>
					</li>

					<li class="receiver" v-show="formData.car">
						<span class="people">汽车所使用年限：</span>
						<input type="text"
							class="recipients"
							placeholder="0"
							v-model="formData.car_year">
						<i class="money">年</i>
					</li>

					<li class="receiver">
						<span class="people">是否有社保：</span>
						<div class="input-box radio">
							<Radio v-model="formData.is_ss" :dataList="formTemp.is_ss"></Radio>
						</div>
					</li>

					<li class="receiver">
						<span class="people">是否公积金：</span>
						<div class="input-box radio">
							<Radio v-model="formData.has_public_fund" :dataList="formTemp.has_public_fund"></Radio>
						</div>
					</li>

					<li class="receiver">
						<span class="people">是否有有价值理财产品：</span>
						<div class="input-box radio">
							<Radio v-model="formData.has_fp" :dataList="formTemp.has_fp"></Radio>
						</div>
					</li>

				</ul>
				<button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active">立即申请</button>
			</form>
    </scroller>

		<CityList></CityList>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
