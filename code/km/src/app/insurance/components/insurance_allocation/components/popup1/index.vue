<template>
  <div class="popup1-page">
    <div class="popup-wrapper">
      <h2>请选择</h2>
      <div class="insure" v-on:click.stop="handleClick($event, 1)">{{popupTxt[0]}}</div>
      <div class="no-insure" v-on:click.stop="handleClick($event, 0)">{{popupTxt[1]}}</div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>