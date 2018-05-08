<template>
  <div class="popup2-page">
    <div class="popup-wrapper">
      <div v-for="(item, index) in popupTxt" class="insure" v-on:click.stop="handleClick($event, index)">{{item.text}}</div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>