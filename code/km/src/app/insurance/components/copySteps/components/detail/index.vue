<template>
  <div class="car-insurance-detail-page">
    <app-header title="查看详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="order-info">
          <ul class="info-list">
            <li class="item">
              <span class="item-h">订单状态：</span>
              <span class="item-c">初步报价</span>
              <span class="item-image on">
                <img src="~assets/images/quoteinfo/status25.png" alt="">
              </span>
            </li>
            <li class="item">
              <span class="item-h">保险公司：</span>
<!--               <span class="item-c" v-if="prvId == 1">平安财险</span>
              <span class="item-c" v-if="prvId == 2">人保财险</span>
              <span class="item-c" v-if="prvId == 3">太平洋财险</span>
              <span class="item-image sp sp-insurance-pa" v-if="prvId == 1"></span>
              <span class="item-image sp sp-insurance-rb" v-if="prvId == 2"></span>
              <span class="item-image sp sp-insurance-tp" v-if="prvId == 3"></span> -->

              <span class="item-c">{{ seller.prvName }}</span>
              <img class="item-image" :src="seller.info.logo">
            </li>
            <li class="item">
              <span class="item-h">保费合计：</span>
              <span class="item-c color-1">{{ formTemp.insureInfo.totalPremium }}</span>
            </li>
            <li class="item">
              <span class="item-h">商业险生效日期：</span>
              <span class="item-c">{{ startDate }}至{{ endDate }}</span>
            </li>
            <li class="item">
              <span class="item-h">交强险生效日期：</span>
              <span class="item-c">{{ startDate }}至{{ endDate }}</span>
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
                <span class="item-c">{{ formTemp.list.carLicenseNo || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">品牌型号：</span>
                <span class="item-c" v-if="formTemp.list.brand">{{ formTemp.list.brand.vehicleName || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">车辆识别代码：</span>
                <span class="item-c">{{ formTemp.list.vinCode || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">发动机号：</span>
                <span class="item-c">{{ formTemp.list.engineNo || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">初登日期：</span>
                <span class="item-c">{{ formTemp.list.registDate || '无' }}</span>
              </li>
            </ul>
            <h3>车主信息</h3>
            <ul class="carinfo-list">
              <li class="item">
                <span class="item-h">姓名：</span>
                <span class="item-c">{{ formTemp.carOwner.name || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">证件类型：</span>
                <span class="item-c" v-if="formTemp.list.idcardType">{{ formTemp.list.idcardType.name || '无' }}</span>
              </li>
              <li class="item">
                <span class="item-h">身份证号：</span>
                <span class="item-c">{{ formTemp.list.idcardNo || '无' }}</span>
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
            <div>
              <h3>商业险<span class="tips">（商业险折扣率：1.00）</span>
              </h3>
              <div class="item" v-for="(item, index) in formTemp.insureInfo.bizInsureInfo.riskKinds">
                <span class="item-h">{{ item.riskCode }}</span>
                <span class="item-c1">{{ item.amount }}</span>
                <span class="item-c2">{{ item.premium }}</span>
                <span class="item-c3">{{ item.ncfPremium }}</span>
              </div>
            </div>
            <div v-if="formTemp.insureInfo.efcInsureInfo.premium">
              <h3>交强险<span class="tips">（交强险折扣率：1.00）</span>
              </h3>
              <div class="item">
                <span class="item-h">交强险</span>
                <span class="item-c1">购买</span>
                <span class="item-c2">{{ formTemp.insureInfo.efcInsureInfo.premium }}</span>
              </div>
            </div>
            <div v-if="formTemp.insureInfo.taxInsureInfo.taxFee">
              <h3>交强险</h3>
              <div class="item">
                <span class="item-h">车船税</span>
                <span class="item-c1">购买</span>
                <span class="item-c2">{{ formTemp.insureInfo.taxInsureInfo.taxFee }}</span>
              </div>
            </div>
            <div class="footer-item">
              合计
              <span>{{ formTemp.insureInfo.totalPremium }}</span>
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