<template>
  <div class="class-room-page">
    <app-header title="培训课堂"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <ul class="list">
            <div class="item-wrapper" v-if="isGetFromServer">
              <li class="item" v-for="(item, index) in serverList">
                <a :href="item.post_source">
                  <img class="item-logo" :src="item.more.thumbnail" alt="">

                  <div class="content">
                    <span>{{ item.post_title }}</span>
                  </div>
                  <i class="icon icon-enter"></i>
                </a>
              </li>
            </div>
            <div class="item-wrapper" v-else>
              <li class="item" v-for="(item, index) in currentList">
                <a :href="item.url" v-if="item.location">
                  <i class="sp sp-class_room" :class="'sp-class_room_0' + item.id"></i>

                  <div class="content">
                    <span>{{ item.name }}</span>
                  </div>
                  <i class="icon icon-enter"></i>
                </a>
                <router-link v-else :to="item.url">
                  <i class="sp sp-class_room" :class="'sp-class_room_0' + item.id"></i>

                  <div class="content">
                    <span>{{ item.name }}</span>
                  </div>
                  <i class="icon icon-enter"></i>
                </router-link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
