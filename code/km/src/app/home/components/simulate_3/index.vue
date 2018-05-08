<template>
  <div class="simulate3-page">
    <app-header title="测试办卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>保险</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.insurance"
                      :key="index"
                      :class="{ act: item.value === formData.insurance }"
                      class="btn-item"
                      v-on:click="formData.insurance = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>公积金</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.accumulation_fund"
                      :key="index"
                      :class="{ act: item.value === formData.accumulation_fund }"
                      class="btn-item"
                      v-on:click="formData.accumulation_fund = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>征信状况</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.credit_investigation"
                      :key="index"
                      class="btn-item"
                      :class="{ act: item.value === formData.credit_investigation }"
                      v-on:click="formData.credit_investigation = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>近1个月信用卡申请记录</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.apply_times"
                      :key="index"
                      class="btn-item"
                      :class="{ act: item.value === formData.apply_times }"
                      v-on:click="formData.apply_times = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>已有信用卡(可多选)</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.card"
                      class="btn-item"
                      :class="{ act: -1 !== formData.card.indexOf(item.value) }"
                      v-on:click="handleHaveCard(item.value)">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>已有信用卡张数</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.card_num" class="width" placeholder="请填写整数">
                  </div>
                  <div class="tips">张</div>
                </div>
              </li>

              <li class="item">
                <div class="left">
                  <span>信用卡总额度</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.card_money" class="width" placeholder="请填写总额度">
                  </div>
                  <div class="tips">万</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>银行贷款</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.loan"
                      :key="index"
                      :class="{ act: item.value === formData.loan }"
                      class="btn-item"
                      v-on:click="formData.loan = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-show="1 === formData.loan" class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>贷款类型(可多选)</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.loan_type"
                      :key="index"
                      class="btn-item"
                      :class="{ act: -1 !== formData.loan_type.indexOf(item.value) }"
                      v-on:click="handleHaveLoanTye(item)">{{ item.name }}</a>
                  </div>
                </div>
              </li>

              <li v-show="-1 !== formData.loan_type.indexOf('house_loan')" class="item">
                <div class="left">
                  <span>房贷</span>
                </div>
                <div class="right">
                  <div class="input w200">
                    <input type="text" v-model="formData.house_loan_bank" placeholder="请填写贷款银行">
                  </div>
                  <div class="input w200">
                    <span>已还</span>
                    <input type="text" v-model="formData.house_loan_repayments_time" class="border">
                    <span>期</span>
                  </div>
                </div>
              </li>

              <li v-show="-1 !== formData.loan_type.indexOf('car_loan')" class="item">
                <div class="left">
                  <span>车贷</span>
                </div>
                <div class="right">
                  <div class="input w200">
                    <input type="text" v-model="formData.car_loan_bank" placeholder="请填写贷款银行">
                  </div>
                  <div class="input w200">
                    <span>已还</span>
                    <input type="text" v-model="formData.car_loan_repayments_time" class="border">
                    <span>期</span>
                  </div>
                </div>
              </li>

              <li v-show="-1 !== formData.loan_type.indexOf('credit_loan')" class="item">
                <div class="left">
                  <span>信用贷款</span>
                </div>
                <div class="right">
                  <div class="input w200">
                    <input type="text" v-model="formData.credit_loan_bank" placeholder="请填写贷款银行">
                  </div>
                  <div class="input w200">
                    <span>已还</span>
                    <input type="text" v-model="formData.credit_loan_repayments_time" class="border">
                    <span>期</span>
                  </div>
                </div>
              </li>

            </ul>
          </div>

          <div class="button-item">
            <button type="button" class="btn" v-on:click="handleSumbit()">提交</button>
          </div>

        </div>
      </div>
    </scroller>

    <Dates v-on:onDateClick="handelDateClick" :show="isShow"></Dates>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>