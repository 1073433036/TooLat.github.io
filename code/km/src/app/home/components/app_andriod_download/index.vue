<template>
  <main class="app-andriod-download-page">
    <app-header title="安卓APP下载流程"></app-header>
    <scroller ref="myscroller">
      <img src="~assets/images/andriod-app-tip.jpg" alt="安卓APP下载流程">
      <div class="btn-wrapper">
        <div class="download-btn" @click="download">
          前往下载
        </div>
      </div>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
