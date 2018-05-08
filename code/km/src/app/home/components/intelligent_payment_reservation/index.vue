<template>
  <div class="intelligentPaymentReservation">
    <app-header title="计划模式"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="container_header">
              <div class="item" @click="addconsumePlan('addPlan')">
                <p class="consume"><i></i>添加消费计划</p>
              </div>
              <div class="item">
                <p class="Repayment" @click="addrepaymentPlan('addPlan')"><i></i>添加还款计划</p>
              </div>
          </div>
          <div class="form-group" >

            <ul class="list">

              <li class="item item1" v-show="consumePlan">
                <div class="order">
                  <p>
                    <i class="msg_icon"></i>
                    <span><em>消费账单</em></span>
                    <i class="delect "></i>
                  </p>
                </div>
                <div class="money">
                  <p class="select-item" @click="handleDateChange('date1')">{{time.date1 ? time.date1:'日期' }}</p>
                  <p><input class="input-item" type="text" placeholder="金额"></p>
                </div>
                <div class="service">
                 <p class="select-item" @click=" handleBotSelectChange('region')">{{userInfo.region ? userInfo.region:'地区' }}<i class="more"></i></p>
                 <p class="select-item"  @click=" handleBotSelectChange('industry')">{{userInfo.industry ? userInfo.industry:'行业' }}<i class="more"></i></p>
                </div>
              </li>

              <li class="item item2" v-show="repaymentPlan">
               <div class="order">
                 <p>
                   <i class="msg_icon"></i>
                   <span><em>还款账单</em></span>
                   <i class="delect "></i>
                 </p>
               </div>
               <div class="money">
                 <p class="select-item" @click="handleDateChange('date2')">{{time.date2 ? time.date2:'日期' }}</p>
                 <p><input class="input-item" type="text" placeholder="金额"></p>
               </div>
              </li>

            </ul>

          </div>
          <button type="submit" class="affirmAdd active" v-show="consumePlan" @click="confirmAdd">确认添加</button>
        </div> 
      </div>
    </scroller>
    <BotSelect v-on:onChildClick="getRegionClick" :title="botTitle" :show="Show" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelect>
    <AddPaln v-on:onAddPalnClick="AddPalnClick"  :show="ShowPlan" :formData="formTemp[formIndex]" :formIndex="formIndex"></AddPaln>

    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false" :child="['year', 'month', 'day', 'hour', 'minute', 'second']"></Dates>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
