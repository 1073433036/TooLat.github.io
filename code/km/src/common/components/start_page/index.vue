<template>
	<transition name="fade">
		<div class="start-page" v-on:click="handleStartClose" :class="{ hide: !isStart }">
      <img v-if="image == 0" src="~assets/images/start-page01.jpg">
      <img v-if="image == 1" src="~assets/images/start-page01.jpg">
      <img v-if="image == 2" src="~assets/images/start-page04.jpg">
      <img v-if="image == 3" src="~assets/images/start-page02.jpg">
    </div>
	</transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>