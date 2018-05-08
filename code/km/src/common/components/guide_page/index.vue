<template>
  <div v-show="isShow" class="guide-page">
    <div class="controller">
      <div class="guide-close" v-on:click="handleGuideClose()"></div>
      <ul class="list">
        <li class="item item-01" :class="{ active: 'home.Home' === $route.name }">
          <img class="touch" src="~assets/images/guide.png">
          <!-- <img class="info" src="~assets/images/guide-01.png"> -->
        </li>

        <li class="item item-02" :class="{ active: 'user.Home' === $route.name }">
          <img class="touch" src="~assets/images/guide.png">
          <!-- <img class="info" src="~assets/images/guide-02.png"> -->
        </li>

        <li class="item item-03" :class="{ active: 'user.Home' === $route.name }">
          <img class="touch" src="~assets/images/guide.png">
          <!-- <img class="info" src="~assets/images/guide-03.png"> -->
        </li>

        <li class="item item-04" :class="{ active: 'user.Home' === $route.name }">
          <img class="touch" src="~assets/images/guide.png">
          <!-- <img class="info" src="~assets/images/guide-04.png"> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>