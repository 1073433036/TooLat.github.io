<template>
  <!-- <div class="input-pay-password"> -->
    <div class="payment" :class="{payOpacity}" v-if="payShow">
        <!-- <div class="payment-main" :class={payShow:payShow}> -->
          <div class="payment-title">
            <h1>
              <i class="sp sp-close" v-on:click.stop="payClose"></i>
              请输入支付密码
            </h1>
            <div class="block-tx">
              <div class="item1">{{paymentType}}</div>
              <div class="item2">￥{{money}}</div>
              <div class="item3">额外扣除￥{{serviceCharge}}</div>
            </div>
            <div class="payment-input">
              <ul class="list">
                  <li v-for="item in 6">
                      <input type="password" disabled name="password" :value="password[item-1]" id="">
                  </li>
              </ul>
            </div>
              <!-- <div class="payment-close" @click="payClose">
              </div> -->
          </div>
            <div class="payment-main" :class={payShow:payShow}>
            <div class="input-block">
                <!-- <div class="payment-input">
                    <ul>
                        <li v-for="item in 6">
                            <input type="password" disabled name="password" :value="password[item-1]" id="">
                        </li>
                    </ul>
                </div> -->
                <div class="payment-keyboard">
                    <ul>
                        <li @touchstart="keytouchStart" @touchend="keytouchEnd($event,item)" v-for="item in 9" :data-val="item">{{item}}</li>
                        <li data-val="delete" @touchstart="keytouchStart" @touchend="keytouchEnd($event,'delete')">-</li>
                        <li data-val="0" @touchstart="keytouchStart" @touchend="keytouchEnd($event,0)">0</li>
                        <li data-val="complete" @touchstart="keytouchStart" @touchend="keytouchEnd($event,'complete')" class="complete">完成</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

  <!-- </div> -->
</template>

<script>
import Index from "./index.js";
export default Index;
</script>