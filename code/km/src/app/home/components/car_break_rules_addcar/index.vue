<template>
  <div class="add-car-page">
    <app-header title="添加车辆"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="head-add-car">
          <img v-if="photoData" class="photo-cont" alt="图片" :src="base64" />
          <img v-else class="photo-cont" alt="图片" src="~assets/images/add-car.png" />
          <input class="photo-cont" type="file" accept="image/*" @change="uploadLocalPhoto">
          <div class="tip-btn" @click="isDialogShow = true">说明</div>
        </div>

        <div class="car-number">
          <div class="title"><img src="~assets/images/break-icon-che.png" alt="车牌号码"> 车牌号码</div>
          <div class="prov" @click="isProvPopupShow = true">{{ carProvSelected }} ></div>
          <input type="text" placeholder="请输入车牌号码" v-model="carNumber">
        </div>

        <div class="new-save">
          <button @click="goCarInfoVerifyHome">新添保存</button>
        </div>
      </div>
    </scroller>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <section class="region-layer" v-if="isProvPopupShow">
        <div class="region">
          <ul>
            <li v-for="(el, index) in carProvinces" @click="selectProv(el)" :key="index">{{ el }}</li>
          </ul>
        </div>
      </section>
    </transition>

    <transition name="fade">
      <div class="car-dialog" v-if="isDialogShow">
        <div class="bg" @click="isDialogShow = false"></div>
        <div class="take-photo-wrapper">
          <header>
            拍照识别说明
            <i class="close-btn" @click="isDialogShow = false"></i>
          </header>
          <section class="take-photo-content">
            <div class="take-photo-tip">请对准行驶证正面拍照上传，拍照时确保图像清晰，避免反光影响，以提高识别的正确率。</div>
            <div class="photo-card-wrapper">
              <img class="photo-card" alt="图片" src="~assets/images/car-verification/card-photo.png" />
            </div>
          </section>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
