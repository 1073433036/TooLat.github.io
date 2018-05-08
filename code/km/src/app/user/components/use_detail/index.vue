<template>
  <div class="use-detail-page">
    <app-header :title="title"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <img v-if="image == '1'" src="~assets/images/flow/flow1.jpg" alt="">
          <img v-if="image == '2'" src="~assets/images/flow/flow2.jpg" alt="">
          <img v-if="image == '3'" src="~assets/images/flow/flow3.jpg" alt="">
          <img v-if="image == '4'" src="~assets/images/flow/flow4.jpg" alt="">
          <img v-if="image == '5'" src="~assets/images/flow/flow5.jpg" alt="">
          <img v-if="image == '6'" src="~assets/images/flow/flow6.jpg" alt="">
          <img v-if="image == '7'" src="~assets/images/flow/flow7.jpg" alt="">
          <img v-if="image == '8'" src="~assets/images/flow/flow8.jpg" alt="">
          <img v-if="image == '9'" src="~assets/images/flow/flow9.jpg" alt="">
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>