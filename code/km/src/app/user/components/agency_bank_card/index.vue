<template>
  <div class="agency_bank_card-page">
    <app-header title="银行卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
					<div class="main">
						<ul class="list">
							<li class="item">
								<div class="name">银行卡号</div>
								<div class="input">
									<input type="text" placeholder="请填写所持银行卡号">
								</div>
							</li>
							<li class="item">
								<div class="name">发卡行</div>
								<div class="box" @click="changeBank()">
									<span class="select">{{ bank_name || '请选择' }}</span>
									<i class="sp sp-right"></i>
								</div>
							</li>
							<li class="item">
								<div class="name">支行地区</div>
								<div class="box" @click="handleCityShowChange()">
									<span class="select">{{ bank_province.region_name || '请选择' }}{{ bank_city.region_name }}{{ area.region_name }}</span>
									<i class="sp sp-right"></i>
								</div>
							</li>
							<li class="item">
								<div class="name">所属支行</div>
								<div class="box" @click="handleBankBranch()">
									<span class="select">{{ branch.lName || '请选择' }}</span>
									<i class="sp sp-right"></i>
								</div>
							</li>
						</ul>
						<ul class="list">
							<li class="item">
								<div class="name">手机号</div>
								<div class="input">
									<input type="text" maxlength="11" placeholder="请填写银行预留手机号码">
								</div>
							</li>
							<li class="item">
								<div class="name">验证码</div>
								<div class="input">
									<input type="text" placeholder="请填写收到的验证码">
									<div class="auth-code">
										<phoneCode title="获取验证码"></phoneCode>
									</div>
								</div>
							</li>
						</ul>
						<div class="submit-btn">
              <div type="button" class="btn">完成</div>
            </div>
					</div>
        </div>
      </div>
    </scroller>
			<Banks></Banks>
			<CityList :point="false"></CityList>
			<Branch></Branch>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>