<template>
  <div class="secondhand-house-loan-page">
    <app-header title="二手房贷款"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="change-btn-group">
          <a class="loan-btn active-btn" @click="goLoanOrAreaPage($event, 'loan')">按贷款额度算</a>
          <a class="area-btn" @click="goLoanOrAreaPage($event, 'area')">按面积算</a>
        </div>

        <div v-show="isLoanPage" class="loanPage">
          <ul class="list">
            <li class="item">
              <div class="left">
                <span>贷款金额：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.loanAmountPageData.loanAmount" class="width" placeholder="请填写">
                </div>
                <div class="tips">万元</div>
              </div>
            </li>
            <li class="item" @click="handleBotSelectChange('loanDeadline')">
              <div class="left">
                <span>贷款期限：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.loanAmountPageData.loanDeadline.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item bordernone">
              <div class="left">
                <span>贷款利率：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.loanAmountPageData.loanRate" class="width" placeholder="请填写">
                </div>
                <div class="tips move-lt">%</div>
              </div>
            </li>
          </ul>
          <div class="calculate">
            <a class="calculate-btn" v-on:click="">开始计算</a>
            <a class="reset-btn" v-on:click="handlereset('loanAmountPageData')">重置</a>
          </div>
        </div>

        <div v-show="!isLoanPage" class="areaPage">
          <ul class="list">
            <li class="item">
              <div class="left">
                <span>平米单价：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.areaPageData.unit" class="width1" placeholder="请填写">
                </div>
                <div class="tips">元/平米</div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <span>房屋面积：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" v-model="formData.areaPageData.proportion" class="width1" placeholder="请填写">
                </div>
                <div class="tips">平米</div>
              </div>
            </li>
            <li class="item">
              <div class="left">
                <span>购房性质：</span>
              </div>
              <div class="right">
                <div class="input">
                  <div class="radio-group">
                    <input type="radio" id="radio-h1" name="housenum1" v-model="formData.areaPageData.houseNum" class="radio-h" value="1"  checked="checked">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                    <label class="label" for="radio-h1">一套房</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="radio-h2" name="housenum1" v-model="formData.areaPageData.houseNum" class="radio-h" value="2">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                    <label class="label" for="radio-h2">二套房</label>
                  </div>
                </div>
              </div>
            </li>
            <li class="item" @click="handleBotSelectChange('loanDeadline')">
              <div class="left">
                <span>贷款期限：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.areaPageData.loanDeadline.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
            <li class="item bordernone" @click="">
              <div class="left">
                <span>贷款利率：</span>
              </div>
              <div class="right">
                <div class="input">
                  <input type="text" class="readyonly-input" v-model="formData.areaPageData.loanDeadline.name" readonly placeholder="请选择">
                </div>
                <i class="sp sp-right"></i>
              </div>
            </li>
          </ul>
          <div class="calculate">
            <a class="calculate-btn" v-on:click="">开始计算</a>
            <a class="reset-btn" v-on:click="handlereset('areaPageData')">重置</a>
          </div>
        </div>
      </div>
    </scroller>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>