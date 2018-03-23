<template>
  <div id="images-viewer">
    <div class="image-header">
      <div class="image-count">{{(imageIndex + 1) + '/' + images.length}}</div>
      <div class="image-viewer-close" @click.stop="closeViewer">&#10006</div>
    </div>
    <div class="image-view">
      <img :src="imageUrl" />
    </div>
    <div class="prev-image" v-if="images.length > 1" @click.stop="changeImage('prev')">&#139</div>
    <div class="next-image" v-if="images.length > 1" @click.stop="changeImage('next')">&#155</div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'

  @Component
  export default class ImageView extends Vue {
    @Prop()
    images: string[]
    @Prop()
    showIndex?: number
    @Prop()
    closeViewer: Function

    imageUrl: string = ''
    imageIndex: number = 0

    mounted(): void {
      if(this.showIndex) {
        this.imageIndex = this.showIndex;
      }
      this.imageUrl = this.images[this.imageIndex];
    }

    changeImage(oper: 'prev' | 'next'): void {
      if(oper === 'prev') {
        if(this.imageIndex === 0) {
          this.imageIndex = this.images.length - 1;
        } else {
          this.imageIndex -= 1;
        }
      } else {
        if(this.imageIndex === (this.images.length  -1)) {
          this.imageIndex = 0;
        } else {
          this.imageIndex += 1;
        }
      }
      this.imageUrl = this.images[this.imageIndex];
    }
  }
</script>
<style lang="scss" scoped>
  #images-viewer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    .image-header {
      width: 100%;
      height: 50px;
      position: relative;
      background-color: rgba(0, 0, 0, .1);
      line-height: 50px;
      color: white;
      .image-count {
        height: 100%;
        position: relative;
        margin-left: 20px;
        font-size: 20px;
        font-weight: bold;
      }
      .image-viewer-close {
        width: 50px;
        height: 50px;
        position: absolute;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .image-view {
      height: calc(100% - 70px);
      position: relative;
      margin: 0 auto;
      text-align: center;
      >img {
        width: auto;
        height: 100%;
        display: inline-block;
        vertical-align: top;
      }
    }
    .prev-image,
    .next-image {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 50%;
      margin-top: -25px;
      font-size: 24px;
      text-align: center;
      line-height: 50px;
      color: white;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.1);
      cursor: pointer;
      &.prev-image {
        left: 10px;
      }
      &.next-image {
        right: 10px;
      }
      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  }
</style>
