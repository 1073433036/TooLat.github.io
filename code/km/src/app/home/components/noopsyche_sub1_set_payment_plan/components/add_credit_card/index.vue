<template>
  <div class="add-credit-card-page">
    <app-header title="添加信用卡" :other="isOther" v-on:other="controlCityChoiceOnOff"></app-header>
    <scroller>
      <div class="container">
        <form class="form-group">
          <ul class="list">
            <li class="item">
              <div class="box">
                <div class="name">持卡人</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.name" placeholder="请如实填写持卡人姓名">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">身份证号</div>
                <div class="content">
                  <input type="text"
                  class="input-item"
                  v-model="formData.id_card"
                  maxlength="19"
                  placeholder="请填写持卡人身份证号码">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">信用卡号</div>
                <div class="content">
                  <input type="text"
                  class="input-item"
                  v-model="formData.card_no"
                  maxlength="19"
                  placeholder="请填写所持信用卡号码">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">cvn2安全码</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.cvn2" maxlength="3" placeholder="请填写安全码（后三位）">
                </div>
                <i v-show="isCvn2Show" class="sp sp-sea" v-on:click="handleCvn()"></i>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">信用卡有效期</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.card_date" maxlength="4" placeholder="年月，如：1801">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">信用卡账单日</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.bill_date" v-on:blur="handleDayBlur()" placeholder="例如：01">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">信用卡还款日</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.repay_date" v-on:blur="handleDayBlur()" placeholder="例如：01">
                </div>
              </div>
            </li>

          </ul>
          <ul class="list">
            <li class="item">
              <div class="box box1">
                <div class="name">银行名称</div>
                <div class="content1" v-on:click.stop="isShowBank = true">
                  <span class="sp sp-right"></span>
                  <input type="text" class="input-readonly" v-model="formData.bankInfo.bank_name" readonly placeholder="请选择信用卡所属银行">
                </div>
              </div>
            </li>
<!--             <li class="item1">
              <div class="left">
                <span>支行地址</span>
              </div>
              <div class="right">
                <div class="select-group">
                  <div class="select-item" v-on:click.stop="handleChangeAddres('prov')">
                    <span>{{ formData.prov.region_name}}</span>
                    <i class="sp sp-right"></i>
                  </div>
                  <div class="select-item" v-on:click.stop="handleChangeAddres('city')">
                    <span>{{ formData.city.region_name}}</span>
                    <i class="sp sp-right"></i>
                  </div>
                </div>
                <div class="input">
                  <input type="text" v-model="formData.address" placeholder="请填写详细地址，如：xx路xx街道xx号">
                </div>
              </div>
            </li> -->
          </ul>
          <ul class="list">
            <li class="item">
              <div class="box">
                <div class="name">手机号码</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.phone" placeholder="请填写信用卡预留手机号码">
                </div>
              </div>
            </li>
            <li class="item">
              <div class="box">
                <div class="name">验证码</div>
                <div class="content">
                  <input type="text" class="input-item" v-model="formData.code" placeholder="请填写收到的验证码">
                </div>
                <div class="code">
                  <phoneCode title="获取验证码" :phone="formData.phone"></phoneCode>
                </div>
              </div>
            </li>
          </ul>
          <div class="submit-btn">
            <div class="btn" :class="{'active': state.active}" v-on:click.stop="submitCreditData">提交</div>
          </div>
        </form>
      </div>
    </scroller>
    <!-- <Selecter v-on:itemClick="dismiss" :change="prov">
      <ul class="list">
        <li v-for="(item, index) in formTemp" class="item" v-on:click.stop="handelClick(item)">{{ item.region_name || item.name }}</li>
      </ul>
    </Selecter> -->
    <Banks :isShowBank="isShowBank" v-on:closeBankEvent="isShowBank = false" v-on:chooseItemEvent="chooseItem"></Banks>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>