<template>
  <div class="add-deposit-card-authflow-page">
    <app-header title="实名认证"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <!-- <app-tips title="申请开通本项功能需进行实名认证，请如实填写信息。"></app-tips> -->
					<div class="tips">
						<i class="icon icon-horn"></i>
						<div class="notice">
            	<div class="marquee">卡盟金服信贷流量服务平台：无卡支付秒到通道需要实名认证，本人银行卡绑定，才能刷信用卡支付，费率最低0.3%--0.49%，近期因上级支付通道银联管束，微信支付、支付宝暂停使用，开放日期需等上级通知。</div>
          	</div>
					</div>
          <div class="nav">
            <ul class="list">
              <li class="item on">
                <span class="name">储蓄卡实名认证</span>
              </li>
              <li class="item">
                <span class="name">附件提交</span>
              </li>
            </ul>
          </div>
          <div class="form-group">
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">持卡人</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.name"
                      class="input-item"
                      placeholder="请如实填写持卡人姓名">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">身份证号</div>
                  <div class="content">
                     <input type="text"
                        v-model.trim="formData.id_card"
                        class="input-item"
                        placeholder="请如实填写持卡人身份证号码">
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">银行卡号</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.account_no"
                      maxlength="19"
                      class="input-item"
                      placeholder="请填写所持银行卡号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">发卡行</div>
                  <div class="content"></div>
                  <div class="select" v-on:click="chnageBank()">
                    <span>{{ bank_name || '请选择' }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">支行地区</div>
                  <div class="content"></div>
                  <div class="select" v-on:click="handleCityShowChange()">
                    <span>{{ bank_province.region_name || '请选择' }}{{ bank_city.region_name }}{{ area.region_name }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">所属支行</div>
                  <div class="content"></div>
                  <div class="select" v-on:click="handleBankBranch()">
                    <span>{{ branch.lName || '请选择' }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                </div>
              </li>
            </ul>
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">手机号</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.phone"
                      class="input-item"
                      placeholder="请填写信用卡预留手机号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">验证码</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.code"
                      class="input-item"
                      placeholder="请填写收到的验证码">
                  </div>
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
                </div>
              </li>
            </ul>
            <div class="submit-btn">
              <div type="button" class="btn" :class="{active: !submitStatus}" v-on:click.stop="submitData">下一步</div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <Banks></Banks>
    <Branch></Branch>
    <CityList :point="false"></CityList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
