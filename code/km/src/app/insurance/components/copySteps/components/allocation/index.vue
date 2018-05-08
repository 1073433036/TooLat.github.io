<template>
  <div class="insurance_allocation">
    <app-header title="保险配置"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="main">
						<div class="top">投保具体金额以保险公司报价为准</div>
            <!-- <ul class="list">
              <li class="item"
                v-for="(item, index) in insureType"
                :key="index"
                @click="toggleType(item.name)"
                :class="{ 'active': insureTypeIndex == item.name }">
                <span class="name">{{ item.name }}</span>
                          </li>
            </ul> -->
          </div>
          <div class="vehicle-tips">以上数据为用户模拟体验，一切以保险核保价格为准。请确认承保条件（可修改）</div>
          <div class="general_page">
            <div class="risks">商业险</div>
            <div class="normal">
              <ul class="list">

                <li class="item">
                  <div class="vehicle">机动车损失保险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.VehicleDemageIns.amount }"
                      @click="handleBombBoxChange('VehicleDemageIns')">
                      {{ insuranceCode.VehicleDemageIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('VehicleDemageIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.VehicleDemageIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">机动车第三者责任保险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.ThirdPartyIns.amount }"
                      @click="handleBombBoxChange('ThirdPartyIns')">
                      {{ insuranceCode.ThirdPartyIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('ThirdPartyIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.ThirdPartyIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">司机责任险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.DriverIns.amount }"
                      @click="handleBombBoxChange('DriverIns')">
                      {{ insuranceCode.DriverIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('DriverIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.DriverIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">乘客责任险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.PassengerIns.amount }"
                      @click="handleBombBoxChange('PassengerIns')">
                      {{ insuranceCode.PassengerIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('PassengerIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.PassengerIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">机动车全车盗抢保险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.TheftIns.amount }"
                      @click="handleBombBoxChange('TheftIns')">
                      {{ insuranceCode.TheftIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('TheftIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.TheftIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">玻璃单独破碎险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.GlassIns.amount }"
                      @click="handleBombBoxChange('GlassIns', 1)">
                      {{ insuranceCode.GlassIns.name }}
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">自燃损失险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.CombustionIns.amount }"
                      @click="handleBombBoxChange('CombustionIns', 1)">
                      {{ insuranceCode.CombustionIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('CombustionIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.CombustionIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">车身划痕损失险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.ScratchIns.amount }"
                      @click="handleBombBoxChange('ScratchIns', 1)">
                      {{ insuranceCode.ScratchIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('ScratchIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.ScratchIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">发动机涉水损失险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.WadingIns.amount }"
                      @click="handleBombBoxChange('WadingIns', 1)">
                      {{ insuranceCode.WadingIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('WadingIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.WadingIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">机动车损失保险无法找到第三方特约险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.VehicleDemageMissedThirdPartyCla.amount }"
                      @click="handleBombBoxChange('VehicleDemageMissedThirdPartyCla', 1)">
                      {{ insuranceCode.VehicleDemageMissedThirdPartyCla.name }}
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">指定专修厂险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.SpecifyingPlantCla.amount }"
                      @click="handleBombBoxChange('SpecifyingPlantCla', 1)">
                      {{ insuranceCode.SpecifyingPlantCla.name }}
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">车上货物责任险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.GoodsOnVehicleIns.amount }"
                      @click="handleBombBoxChange('GoodsOnVehicleIns', 2)">
                      {{ insuranceCode.GoodsOnVehicleIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('GoodsOnVehicleIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.GoodsOnVehicleIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="vehicle">精神损害抚慰金责任险</div>
                  <div class="right">
                    <div class="insure"
                      :class="{ 'on': insuranceCode.CompensationForMentalDistressIns.amount }"
                      @click="handleBombBoxChange('CompensationForMentalDistressIns')">
                      {{ insuranceCode.CompensationForMentalDistressIns.name }}
                    </div>
                    <div class="select" @click="checkStatus('CompensationForMentalDistressIns')">
                      <div class="radio-group">
                        <div class="label">
                          <label class="checkbox-wrappe">
                            <span class="checkbox" :class="{ 'checkbox-checked': insuranceCode.CompensationForMentalDistressIns.notDeductible == 'Y' }">
                              <span class="checkbox-inner"></span>
                            </span>
                          </label>
                          <span>不计免赔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

              </ul>
            </div>
            <div class="box">
              <div class="tallage">交强险/车船税</div>
              <ul class="list">
                <li class="item">
                  <div class="name">交强险</div>
                  <div class="buy">
                    <Checkbox v-model="efcInsureInfo" ref="efcInsureInfo">
                      <span>购买</span>
                    </Checkbox>
                  </div>
                </li>
                <li class="item">
                  <div class="name">车船税</div>
                  <div class="buy">
                    <Checkbox v-model="isPaymentTax" ref="paymentTax">
                      <span>代缴</span>
                    </Checkbox>
                    <div class="mask" v-show="!efcInsureInfo" @click="$toast('请先购买交强险')"></div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="box">
              <div class="tallage">保险生效日期</div>
              <ul class="list">
                <li class="item">
                  <div class="name">商业险</div>
                  <div class="buy" @click="handleDateChange('bizInsureInfoDate')">
                    <input type="text"
                      readonly
                      v-model="bizInsureInfoDate.startDate"
                      placeholder="请选择保险生效日期">
                    <i class="icon icon-enter"></i>
                  </div>
                </li>
                <li class="item">
                  <div class="name">交强险</div>
                  <div class="buy" @click="handleDateChange('efcInsureInfoDate')">
                    <input type="text"
                      readonly
                      v-model="efcInsureInfoDate.startDate"
                      placeholder="请选择保险生效日期">
                    <i class="icon icon-enter"></i>
                  </div>
                </li>
              </ul>
            </div>
            <div class="btn" @click="handelQuote">{{ taskId && prvId ? '保存配置' : '开始报价' }}</div>
          </div>
        </div>
      </div>
    </scroller>

    <BombBox v-on:bombClick="handleBomb"
      :show="bombShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex">
    </BombBox>

    <Dates v-on:onDateClick="handelDateClick"
      :show="isShow"
      :today="false"></Dates>

    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
      <div class="limit-company" v-show="iSwarn">
        <div class="container">
          <div class="title">温馨提示</div>
          <i class="icon icon-close" @click="iSwarn = false"></i>
          <div class="content">
            <scroller>
              <ul class="list">
                <li class="item" v-for="(item, index) in warnList">
                  <div class="logo">
                    <img :src="item.logo" alt="">
                  </div>
                  <div class="warn">{{ item.msg + ' 系统将在报价中自动去掉该保险公司，请确认！' }}</div>
                </li>
              </ul>
            </scroller>
          </div>
          <ul class="btn-list">
            <li class="item" @click="iSwarn = false">返回修改</li>
            <li class="item" @click="handlePrvId">确认</li>
          </ul>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import Index from "./index.js";
  export default Index;
</script>