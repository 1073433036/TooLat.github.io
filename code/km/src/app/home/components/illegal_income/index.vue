<template>
  <main class="illegal_income">
    <app-header title="违章代缴"></app-header>
    <scroller ref="myscroller">

      <section class="illegal_income_wrapper">
        <div class="info-header com-header">
         <img src="~assets/images/payment.jpg">
         <p>根据交通管理局在线办理违章的要求 请填写 <span>{{carCode}}</span>   车主本人的信息</p>
        </div>
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">

            <li class="list">
              <span class="title">车架号</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "车主姓名不能为空",
                  }'
                class="input-item"
                v-model="userInfo.code"
                placeholder="请输入车架号">
					  </li>

            <li class="list">
              <span class="title">驾驶证号</span>
              <input type="text"
                vd-required
                vd-validate
                vd-type="number"
                v-model="userInfo.number"
                vd-notify='{
                    "text": "驾驶证号不能为空",
                  }'
                class="input-item"
                placeholder="驾驶证号完整 15位或者18位">
					  </li>

            <li class="list">
              <span class="title">档案编号</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "档案编号不能为空",
                  }'
                v-model="userInfo.seriaNumber"
                class="input-item"
                placeholder="档案编号完整 12位">
            </li>

            <li class="list">
              <span class="title">预留手机号码</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "手机号不能为空",
                  }'
                class="input-item "
                v-model="userInfo.phone"
                placeholder="请输入手机号码">
					  </li>

            <!-- <li class="list">
              <span class="title">手机号码</span>
              <input type="text"
                vd-required
                vd-notify='{
                    "text": "手机号码",
                  }'
                v-model="userInfo.phoneNum"
                class="input-item"
                placeholder="输入手机号码">
            </li> -->

          </ul>
          <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active" @click = "save">提交</button>
        </form>
      </section>

    </scroller>
    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
