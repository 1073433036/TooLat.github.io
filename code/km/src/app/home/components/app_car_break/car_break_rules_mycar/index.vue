<template>
  <div class="app-my-car-page">
    <app-header title="我的车辆" :other="true" v-on:other="goCarBreakHomePage"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="mycar-list">
          <div class="mycar-item" v-for="item in userCarList">
            <p>车牌号：<span>{{item.car_number}}</span></p>
            <p>发动机号：<span>{{item.car_drive_number}}</span></p>
            <p>车辆识别代号：<span>{{item.car_code}}</span></p>
            <span class="delete-btn" v-on:click.stop="setDeleteCarId(item.id)">
              <i class="sp sp-bank-delete"></i>
            </span>
            <span class="detail-btn" v-on:click.stop="goPeccancyPage(item)">违章详情</span>
          </div>
        </div>
        <div class="peccancy-empty-img" v-if="isShowEmptyImg">
          <img src="~assets/images/car-break-empty-img.png" alt="">
        </div>
      </div>
    </scroller>
    <div class="delete-car-popup" v-show="isShowDeletePopup">
      <div class="popup-content">
        <h4>确定要删除该车辆吗？</h4>
        <div class="delete-btn" v-on:click.stop="deteleCar">删除</div>
        <div class="cancel-btn" v-on:click.stop="isShowDeletePopup = false">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>