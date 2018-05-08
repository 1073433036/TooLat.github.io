<template>
  <div class="selecter-page" :class="{ on: change }">
    <div class="controller">
      <div class="head">
        <div class="title">选择</div>
        <div class="close" v-on:click="handelClose()">关闭</div>
      </div>
      <div class="body">
        <scroller>
          <slot></slot>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>