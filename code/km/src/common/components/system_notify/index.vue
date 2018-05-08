<template>
  <main class="system-notify-page" v-if="isPopupOn">
    <section class="wrapper">
      <div class="popup-wrapper">
        <header>{{ message.title }}</header>
        <div class="cont">{{ message.content }}</div>
        <div class="bottom">
          <div class="issuer">{{ message.issuer }}</div>
          <div class="time">{{ message.add_time }}</div>
        </div>
      </div>
      <div class="system-notify-close-btn" @click="isPopupOn = false">关闭</div>
    </section>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
