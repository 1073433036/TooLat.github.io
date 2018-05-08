<template>
  <div class="tax-rate-page">
    <scroller>
      <div class="wrapper">
        <div class="payment-list">
          <div class="rate-list">
            <h3 class="list-h3">个人缴纳比例（%）</h3>
            <ul class="list">
              <li class="item" @click="goRateInput(['yourself.provide','养老'])">
                <div class="left">
                  <span>养老：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.yourself.provide" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['yourself.medical','医疗'])">
                <div class="left">
                  <span>医疗：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.yourself.medical" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['yourself.unemployment','失业'])">
                <div class="left">
                  <span>失业：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.yourself.unemployment" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item bordernone" @click="goRateInput(['yourself.accumulation','公积金'])">
                <div class="left">
                  <span>公积金：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.yourself.accumulation" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
          </div>
          <div class="rate-list">
            <h3 class="list-h3">公司缴纳比例（%）</h3>
            <ul class="list">
              <li class="item" @click="goRateInput(['company.provide','养老'])">
                <div class="left">
                  <span>养老：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.provide" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['company.medical','医疗'])">
                <div class="left">
                  <span>医疗：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.medical" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['company.unemployment','失业'])">
                <div class="left">
                  <span>失业：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.unemployment" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['company.injury','工伤'])">
                <div class="left">
                  <span>工伤：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.injury" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item" @click="goRateInput(['company.pregnancy','生育'])">
                <div class="left">
                  <span>生育：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.pregnancy" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item bordernone" @click="goRateInput(['company.accumulation','公积金'])">
                <div class="left">
                  <span>公积金：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company.accumulation" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
          </div>
          <div class="rate-list">
            <h3 class="list-h3">缴纳基数（元）</h3>
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>养老：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.provide" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="left">
                  <span>医疗：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.medical" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="left">
                  <span>失业：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.unemployment" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="left">
                  <span>工伤：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.injury" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item">
                <div class="left">
                  <span>生育：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.pregnancy" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
              <li class="item bordernone">
                <div class="left">
                  <span>公积金：</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.taxBasic.accumulation" readonly class="width" placeholder="请填写">
                  </div>
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-show="isRateInputPage" class="input-rate">
          <div class="input-group">
            <span class="title-span">{{inputTitle}}</span>
            <input type="text" v-model="formData.rateInput" class="width1" placeholder="请输入">
          </div>
          <em>*输入比例范围在0~100之间</em>

          <a class="save-rate" @click="handleSaveValue">保存</a>

        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>