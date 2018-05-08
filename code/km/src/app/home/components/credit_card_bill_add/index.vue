<template>
  <div class="credit-card-bill-page">
    <app-header title="添加信用卡账单"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-group">
              <div class="input-item">
                <i class="sp sp-card"></i>
                <span>卡号</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.cardNum"
                    v-on:blur="handleCardNumChange()"
                    type="text"
                    maxlength="19"
                    vd-notify='{
                      "text": "信用卡卡号不能为空",
                      "patt": "信用卡卡号格式不正确"
                    }'
                    placeholder="输入信用卡卡号">
                  </div>
              </div>
              <div class="input-item">
                <i class="sp sp-username"></i>
                <span>姓名</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.userName"
                    type="text"
                    vd-notify='{
                      "text": "请输入持卡人姓名",
                      "patt": "持卡人姓名格式不正确"
                    }'
                    placeholder="输入持卡人姓名">
                </div>
              </div>
              <div class="input-item" v-on:click="chnageBank()">
                <i class="sp sp-bank"></i>
                <i class="sp sp-right"></i>
                <span>所属银行</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.bankName"
                    type="text"
                    vd-notify='{
                      "text": "请选择发卡银行"
                    }'
                    readonly
                    placeholder="选择发卡银行">
                </div>
              </div>
              <div class="input-item">
                <i class="sp sp-card-tye"></i>
                <span>卡类型</span>
                <div class="right">
                  <span>信用卡</span>
                </div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-item">
                <i class="sp sp-money"></i>
                <span>信用额度</span>
                <div class="right">
                  <input vd-required
                    vd-validate
                    vd-type="money"
                    v-model="formData.money"
                    type="text"
                    vd-notify='{
                      "text": "信用额度不能为空",
                      "patt": "信用额度格式不正确"
                    }'
                    placeholder="输入卡额度(元)">
                  </div>
              </div>
              <div class="input-item">
                <i class="sp sp-money"></i>
                <span>账单金额</span>
                <div class="right">
                  <input vd-required
                    vd-validate
                    vd-type="money"
                    v-model="formData.billMoney"
                    type="text"
                    vd-notify='{
                      "text": "账单金额不能为空",
                      "patt": "账单金额格式不正确"
                    }'
                    placeholder="输入账单金额(元)">
                  </div>
              </div>

              <div class="input-item">
                <i class="sp sp-money"></i>
                <span>还款金额</span>
                <div class="right">
                  <input vd-required
                    vd-validate
                    vd-type="money"
                    v-model="formData.repayMoney"
                    type="text"
                    vd-notify='{
                      "text": "还款金额不能为空",
                      "patt": "还款金额格式不正确"
                    }'
                    placeholder="输入还款金额(元)">
                  </div>
              </div>

              <div class="input-item" v-on:click="handleDays('orderDay')">
                <i class="sp sp-order"></i>
                <i class="sp sp-right"></i>
                <span>账单日</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.orderDay"
                    type="text"
                    vd-notify='{
                      "text": "请选择账单日"
                    }'
                    readonly
                    placeholder="选择账单日">
                </div>
              </div>

              <div class="input-item" v-on:click="handleDays('repayTime')">
                <i class="sp sp-time"></i>
                <i class="sp sp-right"></i>
                <span>还款日</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.repayTime"
                    type="text"
                    vd-notify='{
                      "text": "请选择还款日"
                    }'
                    readonly
                    placeholder="选择还款日">
                </div>
              </div>

              <!-- <div class="input-item">
                <i class="sp sp-money"></i>
                <span>免息期</span>
                <div class="right">
                  <span>{{ formData.freeDays ? formData.freeDays + '天' : '免息期(天)' }}</span>
                </div>
              </div> -->

            </div>

            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }">保存</button>
            </div>
          </form>
        </div>
      </div>
    </scroller>

    <Banks></Banks>

    <Dates v-on:onDateClick="handelDateClick" :show="isOpen" :today="false" :child="['day']"></Dates>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>