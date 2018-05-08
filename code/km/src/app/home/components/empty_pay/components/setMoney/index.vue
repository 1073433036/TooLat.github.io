<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="set-amount" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">设置金额</div>
      </div>
      <scroller>
        <div class="body">
          <div class="box">
            <div class="title">设置金额</div>
            <div class="content">
              <i class="icon">¥</i>
              <input type="number" v-model="money" ref="money">
            </div>
            <div class="submit-btn">
              <button type="button" class="btn" :class="{ 'active': inputFlag }" @click="submit">确认金额</button>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>