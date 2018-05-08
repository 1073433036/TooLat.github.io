<template>
  <main class="car-break-detail-page">
    <app-header title="车辆详情"></app-header>
    <div class="add-car-btn">添加车辆</div>
    <div class="head-banner"></div>
    <scroller ref="myscroller">

      <section class="car-list-wrapper">
        <ul class="car-number-tab">
          <li v-for="(el, index) in carList" :key="index"
              :class="{on: carSelected == el.id}"
              @click="carSelected = el.id">{{ el.car_number.substring(0, 2) + ' ' + el.car_number.substring(2)  }}</li>
        </ul>

        <div class="car-detail">
          <div class="car-detail-top">
            <span class="car-number" ref='carcode'>{{
              carList.filter(el => el.id == carSelected) && carList.filter(el => el.id == carSelected)[0]
              ? carList.filter(el => el.id == carSelected)[0].car_number.substring(0, 2) + ' ' +  carList.filter(el => el.id == carSelected)[0].car_number.substring(2)
              : ''
            }}</span>
            <span class="car-detail-link" @click="goMyCarPage">车辆详细信息</span>
            <div class="car-wrapper" @click="Accreditation">
              <i class="del" @click.stop="deleteCar"></i>
              <em v-if="!carLogo"></em>
              <img :src="carLogo" v-else>
              <div class="car-desc">{{ isFillData ? '修改信息' : '完善信息' }}</div>
            </div>
          </div>
          <div class="car-detail-bottom">
            <div class="illegal-number">{{ violation.unDeal && violation.unDeal.total_num ? violation.unDeal.total_num : 0 }}</div>
            <span class="bottom-text">未办理违章</span>
            <div class="illegal-wrapper">
              <span class="point"></span>
              <span class="val">{{ violation.unDeal && violation.unDeal.total_degree ? violation.unDeal.total_degree : 0 }}分</span>
              <span class="money"></span>
              <span class="val">{{ violation.unDeal && violation.unDeal.total_count ? violation.unDeal.total_count : 0 }}元</span>
            </div>
            <div :class="['handle-btn', { off: !violation.unDeal || (violation.unDeal && !violation.unDeal.total_num) }]" @click="handleIllegal">去办理</div>
          </div>
        </div>
      </section>

      <ul class="fun-list">
        <li v-for="(el, index) in funList" :key="index" @click="selectFun(el.key)">
          <i :class="el.key"></i>
          <span class="name">{{ el.name }}</span>
          <span class="desc" v-if="el.desc">{{ el.desc }}</span>
          <span class="desc" v-else>距年检预约还有{{ ctime }}天</span>
          <em></em>
        </li>
      </ul>

    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
