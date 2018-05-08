<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="mask-wrapper" :value="value" v-show="visible">
      <div class="mask"></div>
        <div class="container">
          <a href="javascript:" class="btn" @click="unbund">解除绑定</a>
          <a href="javascript:" class="btn" @click="cancel">取消</a>
        </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>