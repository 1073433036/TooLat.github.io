<template>

  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
    <div class="day" v-show="isOpen">
      <div class="day-layer">
        <div class="day-wrapper">
          <div class="head">
            <span>账单日期</span>
            <div class="close" v-on:click="handleClose()">
              <i class="sp sp-close"></i>
            </div>
          </div>
          <div class="body">
            <div v-for="item in 31" class="item" :class="{ active: item === today }" v-on:click="today = item">{{ item }}</div>
          </div>
          <div class="bot">
            <button type="button" class="transit" v-on:click="handleClose(1)">确定</button>
          </div>

        </div>
      </div>
    </div>
  </transition>

</template>

<script>
  import Index from './index.js';
  export default Index;
</script>