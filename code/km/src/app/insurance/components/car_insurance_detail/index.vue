<template>
  <div class="car-insurance-detail-page">
    <app-header title="查看详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="order-info">
          <ul class="info-list">
            <li class="item">
              <span class="item-h">订单状态：</span>
              <span class="item-c" v-if="formTemp.list.q">{{ formTemp.list.q.taskStateDescription }}</span>
              <span class="item-image on">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 2" src="~assets/images/quoteinfo/status2.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 13" src="~assets/images/quoteinfo/status13.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 14" src="~assets/images/quoteinfo/status14.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 16" src="~assets/images/quoteinfo/status16.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 19" src="~assets/images/quoteinfo/status19.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 20" src="~assets/images/quoteinfo/status20.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 23" src="~assets/images/quoteinfo/status23.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 25" src="~assets/images/quoteinfo/status25.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 30" src="~assets/images/quoteinfo/status30.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 33" src="~assets/images/quoteinfo/status33.png" alt="">
                <img v-if="formTemp.list.q && formTemp.list.q.taskState == 51" src="~assets/images/quoteinfo/status51.png" alt="">
              </span>
              <span class="plate" v-if="formTemp.list.q && formTemp.list.q.carInfo && formTemp.list.q.carInfo.carLicenseNo">({{ formTemp.list.q.carInfo.carLicenseNo }})</span>
              <span class="plate" v-else>无</span>
            </li>
            <li class="item">
              <span class="item-h">保险公司：</span>
              <span class="item-c" v-if="formTemp.list.i">{{ formTemp.list.i.name || formTemp.list.q.prvName }}</span>
              <span class="item-image" v-if="formTemp.list.i"><img :src="formTemp.list.i.logo" alt=""></span>
            </li>
            <li class="item">
              <span class="item-h">保费合计：</span>
              <span class="item-c color-1" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.totalPremium">￥{{ formTemp.list.q.insureInfo.totalPremium }}</span>
              <span class="item-c color-1" v-else>暂无报价</span>
            </li>
            <li class="item" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.bizInsureInfo">
              <span class="item-h">商业险生效日期：</span>
              <span class="item-c">{{ formTemp.list.q.insureInfo.bizInsureInfo.startDate || '无' }}至{{ formTemp.list.q.insureInfo.bizInsureInfo.endDate || '无' }}</span>
            </li>
            <li class="item" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.efcInsureInfo">
              <span class="item-h">交强险生效日期：</span>
              <span class="item-c">{{ formTemp.list.q.insureInfo.efcInsureInfo.startDate || '无' }}至{{ formTemp.list.q.insureInfo.efcInsureInfo.endDate || '无' }}</span>
            </li>
          </ul>
        </div>
        <div class="car-insurance-detail">
          <div class="h-group">
            <h3><span :class="{ 'active': isSwitchNav == 1 }" v-on:click.stop="isSwitchNav = 1">基本信息</span></h3>
            <h3><span :class="{ 'active': isSwitchNav == 2 }" v-on:click.stop="isSwitchNav = 2">险种信息</span></h3>
          </div>
          <div class="basic-info" v-show="isSwitchNav == 1">
            <h3>车辆信息</h3>
            <ul class="carinfo-list">
              <li class="item">
                <span class="item-h">车牌号码：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carInfo">{{ formTemp.list.q.carInfo.carLicenseNo || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">品牌型号：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carInfo">{{ formTemp.list.q.carInfo.vehicleName || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">车辆识别代码：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carInfo">{{ formTemp.list.q.carInfo.vinCode || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">发动机号：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carInfo">{{ formTemp.list.q.carInfo.engineNo || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">初登日期：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carInfo">{{ formTemp.list.q.carInfo.registDate || '无' }}</span>
              </li>
            </ul>
            <h3>车主信息</h3>
            <ul class="carinfo-list">
              <li class="item">
                <span class="item-h">姓名：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carOwner">{{ formTemp.list.q.carOwner.name || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">证件类型：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carOwner">{{ formTemp.list.q.carOwner.idcardType | idType }}</span>
              </li>
              <li class="item">
                <span class="item-h">证件号：</span>
                <span class="item-c" v-if="formTemp.list.q && formTemp.list.q.carOwner">{{ formTemp.list.q.carOwner.idcardNo || '无' }}</span>
              </li>
            </ul>
          </div>
          <div class="insurance-type-info" v-show="isSwitchNav == 2">
            <div class="titile-item">
              <span class="item-h">险种</span>
              <span class="item-c1">保额(元)</span>
              <span class="item-c2">保费(元)</span>
              <span class="item-c3">不计免赔(元)</span>
            </div>
            <div v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.bizInsureInfo && formTemp.list.q.insureInfo.bizInsureInfo.riskKinds">
              <h3>
                商业险
                <span class="tips" v-if="formTemp.list.q.insureInfo.bizInsureInfo.discountRate">（商业险折扣率：{{ formTemp.list.q.insureInfo.bizInsureInfo.discountRate }}）</span>
              </h3>
              <div class="item" v-for="(item, index) in formTemp.list.q.insureInfo.bizInsureInfo.riskKinds">
                <span class="item-h">{{ item.riskCode | riskFilter }}</span>
                <span class="item-c1">{{ item.amount | amountFilter(item.riskCode) }}</span>
                <span class="item-c2" v-if="item.premium">{{ item.premium ? '￥' + item.premium : '暂无' }}</span>
                <span class="item-c3" v-if="item.ncfPremium">{{ item.ncfPremium ? '￥' + item.ncfPremium : '' }}</span>
              </div>
            </div>
            <div v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.efcInsureInfo">
              <h3>
                交强险
                <span class="tips" v-if="formTemp.list.q.insureInfo.efcInsureInfo.discountRate">（交强险折扣率：{{ formTemp.list.q.insureInfo.efcInsureInfo.discountRate }}）</span>
              </h3>
              <div class="item" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.efcInsureInfo">
                <span class="item-h">交强险</span>
                <span class="item-c1">购买</span>
                <span class="item-c2" v-if="formTemp.list.q.insureInfo.efcInsureInfo.premium">{{ formTemp.list.q.insureInfo.efcInsureInfo.premium ? '￥' + formTemp.list.q.insureInfo.efcInsureInfo.premium : '暂无' }}</span>
                <span class="item-c2" v-else>暂无</span>
              </div>
            </div>
            <div v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.taxInsureInfo">
              <h3>
                交强险
                <!-- <span class="tips">（商业险折扣率：0.8）</span> -->
              </h3>
              <div class="item">
                <span class="item-h">车船税</span>
                <span class="item-c1">购买</span>
                <span class="item-c2">{{ formTemp.list.q.insureInfo.taxInsureInfo.taxFee ? '￥' + formTemp.list.q.insureInfo.taxInsureInfo.taxFee : '暂无' }}</span>
              </div>
            </div>
            <div class="footer-item">
              <div class="box-item">
                <span class="name">合计:</span>
                <span class="text" v-if="formTemp.list.q && formTemp.list.q.insureInfo && formTemp.list.q.insureInfo.totalPremium">{{ formTemp.list.q.insureInfo.totalPremium }}元</span>
                <span v-else>暂无</span>
              </div>
              <div class="box-item">
                <span class="name">商业险:</span>
                <span class="text on" v-if="formTemp.list.q && formTemp.list.q.insureInfo">{{ formTemp.list.q.insureInfo.bizInsureInfo.premium }}元</span>
              </div>
              <div class="box-item">
                <span class="text" v-if="formTemp.list.q && formTemp.list.q.carInfo && formTemp.list.q.carInfo.carLicenseNo">{{ formTemp.list.q.carInfo.carLicenseNo | carLicenseNoFilter }}</span>
                <span class="text" v-else>无</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>