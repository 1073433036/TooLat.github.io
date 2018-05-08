<template>
  <div class="app-add-car-page">
    <app-header title="添加车辆"></app-header>
      <div class="wrapper">
        <div class="add-car-main">
          <ul class="carinfo-list">
            <li class="carinfo-item" v-on:click.stop="showCityList('province')">
              <span class="title">车牌号所在省：</span>
              <span v-if="province_name" class="item-input-span">{{ province_name }}</span>
              <span v-else class="item-input-span span-empty">请选择车牌号所在省</span>
              <i class="sp sp-right"></i>
            </li>
            <li class="carinfo-item" v-on:click.stop="showCityList('city')">
              <span class="title">车牌号所在市：</span>
              <span v-if="city_name" class="item-input-span">{{ city_name }}</span>
              <span v-else class="item-input-span span-empty">请选择车牌号所在市</span>
              <i class="sp sp-right"></i>
            </li>
            <li class="carinfo-item">
              <span class="title">车牌号码：</span>
              <span class="area-choice" :class="{'placeholder-color': !formData.carPrefix}" v-on:click="chooseCarPrefix">
              {{formData.carPrefix || '请选择车牌前缀'}}
              <i class="sp sp-app-car-break-point-bottom"></i>
              </span>
              <input type="text" class="item-input input-width" v-model="formData.carNumber" placeholder="请输入车牌号码">
            </li>
            <li class="carinfo-item">
              <span class="title">车辆识别代号：</span>
              <input type="text" class="item-input" v-model.trim="formData.carCode" placeholder="请输入车架号后6位" maxlength="6">
            </li>
            <li class="carinfo-item">
              <span class="title">发动机号：</span>
              <input type="text" class="item-input" v-model.trim="formData.carDriveNumber" placeholder="请输入发动机号">
            </li>
          </ul>
          <div class="tips">所填信息为当地交管所查询所需，您的车辆信息我们将严格保密，请放心填写！</div>
          <div class="addcar-btn" v-on:click.stop="submitCarData">保存并查询</div>
        </div>
      </div>

      <CityList :remark="cityRemark"></CityList>

      <botSelect :show="isShowBotSelect"
      :formData="carPrefixList"
      v-on:dismissEvent="isShowBotSelect = false"
      v-on:chenkedItemEvent="checkedCarPrefix"></botSelect>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>