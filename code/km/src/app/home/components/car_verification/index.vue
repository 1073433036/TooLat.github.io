<template>
  <main class="car_verification-page">
    <app-header title="车辆信息验证"></app-header>
    <scroller ref="myscroller">

      <main>
        <div class="keep-secret">以下信息仅供交管局查询，我们将严格保密</div>

        <div class="car-info">
          <div class="list-wrapper">
            <span class="text">车牌号</span>
            <div class="prov" @click="isProvPopupShow = true">{{ carProvSelected }} ></div>
            <input class="car-number" type="text" placeholder="请输入车牌号" v-model="carNumber">
            <div class="photo-btn" @click="showPhotoDialog"></div>
            <div class="photo-tip" v-show="!carNumber">拍摄行驶证快速填充</div>
          </div>

          <div class="list-wrapper">
            <span class="text">车身架号</span>
            <i class="vin-tip" @click="showVinDialog"></i>
            <input type="text" placeholder="请输入车身架号" v-model="vin">
          </div>

          <div class="list-wrapper">
            <span class="text">发动机号</span>
            <i class="vin-tip" @click="showVinDialog"></i>
            <input type="text" placeholder="请输入发动机号" v-model="carDriveNumber">
          </div>
        </div>

        <!-- <div class="phone-remind">
          <div class="list-wrapper">
            <span class="text">违章通知及年检提醒</span>
            <div :class="['switch-btn', { on: isConfirmOn }]" @click="isConfirmOn = !isConfirmOn">
              {{ isConfirmOn ? 'ON' : 'OFF' }}
              <div class="inner-circle"></div>
            </div>
          </div>

          <div class="list-wrapper" style="border-bottom: 0;">
            <span class="text">手机号码</span>
            <input type="text" placeholder="请输入手机号码" v-model="phone">
          </div>
        </div> -->

        <button class="save-btn" @click="addCar">保存并查询</button>
      </main>

    </scroller>

    <div class="region" v-if="isProvPopupShow">
      <ul>
        <li v-for="(el, index) in carProvinces" @click="selectProv(el)" :key="index">{{ el }}</li>
      </ul>
    </div>

    <transition name="fade">
      <div class="car-dialog" v-if="isDialogShow">
        <div class="bg" @click="closeDialog"></div>
        <div class="take-photo-wrapper" v-if="isPhotoShow">

          <header>
            拍照识别说明
            <i class="close-btn" @click="closeDialog"></i>
          </header>

          <section class="take-photo-content">
            <div class="take-photo-tip">请对准行驶证正面拍照上传，拍照时确保图像清晰，避免反光影响，以提高识别的正确率。</div>
            <div class="photo-card-wrapper">
              <img v-if="photoData" class="photo-card" alt="图片" :src="base64" />
              <img v-else class="photo-card" alt="图片" src="~assets/images/car-verification/card-photo.png" />
              <input class="photo-card" type="file" accept="image/*" @change="uploadLocalPhoto">
            </div>
            <div class="upload-btn" @click="takePhoto">识别</div>
          </section>

        </div>
        <div class="vin-default" v-if="isVinShow" @click="closeDialog"></div>
      </div>
    </transition>

  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
