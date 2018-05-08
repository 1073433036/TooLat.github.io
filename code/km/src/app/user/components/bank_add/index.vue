<template>
  <div class="auth-flow-page">
    <app-header title="添加银行卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="form-group">
            <ul class="list">
              <li class="item">
                <div class="box">
                  <div class="name">持卡人</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.real_name"
                      class="input-item"
                      placeholder="请如实填写持卡人姓名">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">银行卡号</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.bank_card"
                      class="input-item"
                      placeholder="请填写所持银行卡号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">发卡行</div>
                  <div class="content" v-if="isShowChooseBanks"></div>
                  <div class="select"  v-if="isShowChooseBanks" v-on:click="chnageBank()">
                    <span>{{ bank_name || '请选择' }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                  <div class="content" v-else>
                    <input type="text"
                      v-model.trim="customData.bank_name"
                      class="input-item"
                      placeholder="请填写发卡行">
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
                  <div class="content" v-if="isShowChooseBranch"></div>
                  <div class="select"  v-if="isShowChooseBranch" v-on:click="handleBankBranch()">
                    <span>{{ branch.lName || '请选择' }}</span>
                    <i class="icon icon-direction2"></i>
                  </div>
                  <div class="content" v-else>
                    <input type="text"
                      v-model.trim="customData.branch"
                      class="input-item"
                      placeholder="请填写银行卡所属支行">
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
                      v-model.trim="formData.mobile"
                      class="input-item"
                      placeholder="请填写银行卡预留手机号码">
                  </div>
                </div>
              </li>
              <li class="item">
                <div class="box">
                  <div class="name">验证码</div>
                  <div class="content">
                    <input type="text"
                      v-model.trim="formData.verification_code"
                      class="input-item"
                      placeholder="请填写收到的验证码">
                  </div>
                  <div class="code">
                    <phoneCode title="获取验证码" :phone="formData.mobile"></phoneCode>
                  </div>
                </div>
              </li>
            </ul>
            <div class="submit-btn">
              <div class="btn" :class="{active: !submitCount}" v-on:click.stop="submitData">下一步</div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <Banks  v-on:customInputEvent="handleCustomBanksInput"></Banks>
    <Branch v-on:customBranchInputEvent="handleCustomBranchInput"></Branch>
    <CityList></CityList>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>