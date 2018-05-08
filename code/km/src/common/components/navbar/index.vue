<template>
  <div class="navbar-page">
    <div class="navlist">
      <ul class="ullist">
        <li v-for="(text, index) in navList" @click="handleClick($event, index)">
          <span v-if="(index>0 ? true: false)" class="spanline">|</span>
          <em :class="(index == 0 ? 'litext itemTx':'itemTx')">{{text}}</em>
        </li>
      </ul>
    </div>
    <!-- <div class="block">
      <component :is=""></component>
    </div> -->
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>