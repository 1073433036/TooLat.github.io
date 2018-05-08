<template>
  <div class="header-page" :class="{ on: status }">
    <a v-show="isBack && isReferrer || other" href="javascript:" class="header-back back" v-on:click="handleBack()"></a>
    <div class="title">
      <img v-if="logImg" :src="logImg">
      <span>{{ title }}</span>
    </div>
    <div class="head-right">
      <slot name="right"></slot>
      <div v-if="jsObj" class="app-share" v-on:click="handleShareClick()">
        <i class="sp sp-app-share"></i>
      </div>
    </div>

    <locationSelecter v-on:locationClick="locationClick" :isOpen="isOpen"></locationSelecter>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>