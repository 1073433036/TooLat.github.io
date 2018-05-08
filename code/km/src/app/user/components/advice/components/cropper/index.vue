<template>
  <div class="cropper">
    <div class="cropper-dialog">
      <div class="cropper-body">
        <vue-cropper
          ref='cropper'
          :responsive="true"
          :view-mode="2"
          :checkCross="true"
          :rotatable="true"
          :min-container-width="100"
          :min-container-height="100"
          :min-crop-box-width="100"
          :min-crop-box-height="100"
          :auto-crop-area="1"

          drag-mode="crop"
          :background="true"
          :src="imgSrc"
          :img-style="{ width: '400px', 'height': '450px' }"
          >
        </vue-cropper>
      </div>

      <div class="cropper-toolsbar">
        <a class="cancel" @click="fileClose">取消</a>
        <a class="upload" @click="upload">发送</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
