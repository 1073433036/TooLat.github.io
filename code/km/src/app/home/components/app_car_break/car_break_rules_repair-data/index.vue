<template>
  <div class="app-repair-data-page">
    <app-header title="补充资料"></app-header>
      <scroller>
        <div class="wrapper">
          <div class="tips-group">
            <p class="repair-data-notice">1.特别注意：请拍照时确保证件边缘完整并且字体清晰可辨认的拍入照片内，否则将造成无法办理，敬请理解</p>
            <p>2.请提供清晰的图片，拍照时请防止反光</p>
            <p>3.照片模糊和字体无法清晰辨识的将可能造成无法办理，敬请理解。</p>
          </div>
          <h3>
            行驶证信息
            <i class="sp sp-help-info"></i>
          </h3>
          <div class="upload-papers">
            <div class="upload-item">
              <label for="upload-input2">
                <input id="upload-input2" type="file" accept="image/*" class="upload-input" v-on:change="upload($event, 'front')" :value="fileVlaue">
                <img v-if="frontImg" :src="frontImg" alt="">
                <img v-else src="~assets/images/upload-paper-front.jpg" alt="">
              </label>
              <i class="sp sp-paper-reset-btn reset" v-on:click.stop="insertAnimation($event, 'front')"></i>
            </div>
            <div class="tips">
              <p>请务必按样板，将行驶证正副本放一起拍照，否则将无法处理违章。感谢您的配合！</p>
            </div>
            <!-- <div class="upload-item">
              <label for="upload-input1">
                <input id="upload-input1" type="file" accept="image/*" class="upload-input" v-on:change="upload($event, 'reverse')">
                <img v-if="reverseImg" :src="reverseImg" alt="">
                <img v-else src="~assets/images/upload-paper-reverse.png" alt="">
              </label>
              <i class="sp sp-paper-reset-btn reset" v-on:click.stop="insertAnimation($event, 'reverse')"></i>
            </div> -->
          </div>
          <div class="submit-btn" v-on:click.stop="goOrderPayPage">立即上传</div>
        </div>
      </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>