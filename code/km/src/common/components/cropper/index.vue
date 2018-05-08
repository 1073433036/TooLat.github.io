<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
  	<div v-show="isShow" class="cropper">
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
          <a class="cancel" @click="cancel">取消</a>
          <a class="upload" @click="upload">上传</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
