<template>
  <div class="add_payment_plan_page">
    <app-header title="新增计划"></app-header>
    <scroller>
    <div class="main">
      <ul class="list">
        <li class="item">
          <div class="left">
            <span>精养卡卡号</span>
          </div>
          <div class="right">
            <div class="input">
              <input type="text" class="readyonly-input" v-model="formData.card_no" readonly>
            </div>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>还款类别</span>
          </div>
          <div class="right">
            <div class="input">
              <input type="text" class="readyonly-input" v-model="formData.type" readonly>
            </div>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>还款总金额</span>
          </div>
          <div class="right">
            <div class="input">
              <input type="text"
                class="readyonly-input"
                v-model="formData.paymentAmount"
                @input="vdMoney(formData.paymentAmount)"
                v-on:blur="handleChangePaymentAmount()"
                placeholder="请输入还款总金额">元
            </div>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>预留资金</span>
          </div>
          <div class="right">
            <div class="input" v-on:click.stop="selectRate('reservedMoney')">
              <input type="text" class="readyonly-input" v-model="formData.reservedMoney.name" readonly placeholder="请选择">
            </div>
            <i class="sp sp-right"></i>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>分拆笔数</span>
          </div>
          <div class="right">
            <div class="input1">
              <span class="subtract" v-on:click.stop="subtractAmount">&ndash;</span>
              <input type="text" class="sub-input" v-model="formData.cutAmount" readonly>
              <span class="plus" v-on:click.stop="plusAmount">+</span>
            </div>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>身份</span>
          </div>
          <div class="right">
            <div class="input">
              <input type="text" class="readyonly-input" v-model="formData.identity" @input="vdMoney(formData.paymentAmount)" placeholder="申请信用卡时所填的身份">
            </div>
          </div>
        </li>
        <li class="item">
          <div class="left">
            <span>年收入</span>
          </div>
          <div class="right">
            <div class="input">
              <input type="text" class="readyonly-input" v-model="formData.income" @input="vdMoney(formData.paymentAmount)" placeholder="申请信用卡时所填的年收入">元
            </div>
          </div>
        </li>
      </ul>
      <div class="apply-tips">请如实填写，系统会根据您申办信用卡时所填写的资料信息，智能合理安排刷卡，配合银行信用卡中心达到快速提额的目的</div>

      <div class="btn-next" v-on:click.stop="goConfirmPlanPage">下一步</div>
      <div class="user-tips">
				<div class="hint">【温馨提示】</div>
        <h4 class="h4">亲爱的用户您好！</h4>
        <p>根据支付行业智能养卡相关规则，支付平台要求用户账户内需预留信用卡总额度5—10%资金，如有临时额度到期的，相关费用利息，需在到期前用户自行还上，或您在精养期间通过绑定微信、支付宝使用卡内余额而导致卡内余额不足，造成未能及时还款，未能全额还款，产生的费用及相关责任，与平台无关。</p>
        <p>您的卡片由中国人保承保您账户的安全，请您放心使用！</p>
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
import Index from "./index.js";
export default Index;
</script>