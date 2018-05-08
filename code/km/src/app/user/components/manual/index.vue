<template>
  <div class="manual-page">
    <app-header title="平台手册"></app-header>
    <ul class="nav-list">
      <li class="item" :class="{ 'on': formIndex == item.id }" v-for="(item, index) in formTemp.navList" :key="index"
          v-if="item.isShow" @click="switchNav(item)">
        <a href="javascript:">
          <span>{{ item.name }}</span>
        </a>
      </li>
    </ul>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="image">
            <img v-if="formIndex == 1" src="~assets/images/manual/manual1.jpg" alt="" ref="image">
            <img v-if="formIndex == 2" src="~assets/images/manual/manual2.jpg" alt="" ref="image">
            <img v-if="formIndex == 3" src="~assets/images/manual/manual3.jpg" alt="" ref="image">
            <img v-if="formIndex == 4" src="~assets/images/manual/manual4.jpg" alt="" ref="image">
            <img v-if="formIndex == 5" src="~assets/images/manual/manual5.jpg" alt="" ref="image">
            <img v-if="formIndex == 6" src="~assets/images/manual/manual6.jpg" alt="" ref="image">
            <img v-if="formIndex == 7" src="~assets/images/manual/manual7.jpg" alt="" ref="image">
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
