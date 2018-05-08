<template>
  <div class="user-insure-money-page">
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="inner">
            <div class="title">三者险</div>
            <ul class="list">
              <li v-for="(item, index) in formTemp.data" class="item" v-on:click="handleSelect(item)">
                <div class="body">
                  <span class="tit" :class="{ on: item.active }">{{ item.title }}</span>
                </div>

                <div class="right">
                  <i class="sp sp-right"></i>
                </div>
              </li>
            </ul>
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