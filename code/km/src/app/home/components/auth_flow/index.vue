<template>
  <div class="auth-flow-page">
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
                      ref="account_no"
                      maxlength="19"
                      class="input-item"
                      @blur="handleBankNoOnBlur()"
                      placeholder="请输入银行储蓄卡卡号">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">发卡行</div>
                  <!-- <div class="content"></div> -->
                  <div class="select" v-on:click="chnageBank()">
                    <span>{{ bank_name || '请选择' }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">支行地区</div>
                  <!-- <div class="content"></div> -->
                  <div class="select" v-on:click="handleCityShowChange()">
                    <span>{{ bank_province.region_name || '请选择' }}{{ bank_city.region_name }}{{ area.region_name }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">所属支行</div>
                  <!-- <div class="content"></div> -->
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
                      class="input-item in_code"
                      placeholder="请填写验证码">
                  </div>
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                  </div>
                </div>
              </li>
            </ul>

            <ul class="list identity">
              <li class="item">
                <div class="box">
                  <div class="name">上传身份证正面</div>
                  <div class="content ">
                    <div class="image">
                      <img v-if="formTemp.id_card_front" :src="formTemp.id_card_front">
                      <img v-else src="~assets/images/identity-just.png">
                    </div>
                    <i class="sp sp-right"></i>
                    <input
                    type="file"
                    class="input-item files"
                    name="file" accept="image/*"
                    ref="id_card_front"
                    v-on:change="setImage($event,'id_card_front')">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">上传身份证反面</div>
                  <div class="content ">
                    <div class="image">
                      <img v-if="formTemp.id_card_back" :src="formTemp.id_card_back">
                      <img v-else src="~assets/images/identity-back.png">
                    </div>
                    <i class="sp sp-right"></i>
                    <input
                    type="file"
                    class="input-item files"
                    name="file" accept="image/*"
                    ref="id_card_back"
                    v-on:change="setImage($event,'id_card_back')">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">上传手持银行卡+身份证</div>
                  <div class="content ">
                    <div class="image">
                      <img v-if="formTemp.id_card_person" :src="formTemp.id_card_person">
                      <img v-else src="~assets/images/identity-self.png">
                    </div>
                    <i class="sp sp-right"></i>
                    <input
                    type="file"
                    class="input-item files"
                    name="file" accept="image/*"
                    ref="id_card_person"
                    v-on:change="setImage($event,'id_card_person')">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">上传银行卡正面</div>
                  <div class="content files">
                    <div class="image">
                      <img v-if="formTemp.card_front" :src="formTemp.card_front">
                      <img v-else src="~assets/images/identity-bank.png">
                    </div>
                    <i class="sp sp-right"></i>
                    <input
                      type="file"
                      class="input-item"
                      name="file" accept="image/*"
                      ref="card_front"
                      v-on:change="setImage($event,'card_front')">
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

    <cropper v-on:uploadFileClose="fileClose"></cropper>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
