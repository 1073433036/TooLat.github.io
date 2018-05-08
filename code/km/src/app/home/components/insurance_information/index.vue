<template>
  <main class="insuranceInformation">
    <app-header title="填写投保信息"></app-header>
    <scroller ref="myscroller">
      <section class="basic-info-wrapper">
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list" @click="selectDestination">
              <em class="Destination"></em>
              <span class="people">目的地</span>
              <span class="input-item date ">{{city ? city:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  @click="handleBotSelectChange('deadline')">
              <em class="deadline"></em>
              <span class="people">保障期限</span>
              <span class="input-item date ">{{userInfo.deadline ? userInfo.deadline:'请选择' }}</span>
              <div class="arrow"></div>
            </li>

            <li class="detail_list"  @click="handleDateChange('beginTime')">
              <em class="beginTime"></em>
              <span class="people">起保时间</span>
              <span class="input-item date ">{{userInfo.beginTime ? userInfo.beginTime:'请选择' }}</span>
              <div class="arrow"></div>
            </li>

            <li class="detail_list"  @click="handleDateChange('terminationTime')">
              <em class="beginTime"></em>
              <span class="people">终保时间</span>
              <span class="input-item date ">{{userInfo.terminationTime ? userInfo.terminationTime:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
          </ul>
          <ul class="info">
            <li class="detail_list">
              <em class="name"></em>
              <span class="people">姓名</span>
              <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.name">
              <div class="arrow"></div>
            </li>
            <li class="detail_list"  @click="handleBotSelectChange('idType')" >
              <em class=" idType"></em>
              <span class="people">证件类型</span>
             <span class="input-item date ">{{userInfo.idType ? userInfo.idType:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list">
              <em class="idCode"></em>
              <span class="people">证件号码</span>
              <input type="text"
                class="input-item"
                placeholder="请输入证件号码"
                v-model="userInfo.idCode">
              <div class="arrow"></div>
            </li>
            <li class="detail_list" @click="ShowLiveClick('live')">
              <em class="live"></em>
              <span class="people">居住地</span>
              <span class="input-item date ">{{userInfo.live ? userInfo.live:'请选择' }}</span>
              <div class="arrow"></div>
              <div class="arrow"></div>
            </li>
            <li class="detail_list">
              <em class="phone"></em>
              <span class="people">手机号</span>
              <input type="text"
                class="input-item"
                placeholder="请输入手机号码"
                v-model="userInfo.phone">
              <div class="arrow"></div>
            </li>
            <li class="detail_list">
              <em class="email"></em>
              <span class="people">邮箱</span>
              <input type="text"
                class="input-item"
                placeholder="请输入邮箱"
                v-model="userInfo.email">
              <div class="arrow"></div>
            </li>
          </ul>
          <ul class="info">
            <li class="detail_list"  @click="handleBotSelectChange('relation')" >
              <em class=" relation"></em>
              <span class="people">你在为谁投保<span class="relative">（关系）</span></span>
             <span class="input-item date ">{{userInfo.relation ? userInfo.relation:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
            <li class="detail_list">
              <em class="en"></em>
              <span class="people">英文名</span>
              <input type="text"
                class="input-item"
                placeholder="请输入英文名"
                v-model="userInfo.en">
              <div class="arrow"></div>
            </li>
            <li class="detail_list" @click="handleBotSelectChange('copies')" >
              <em class="copies"></em>
              <span class="people">份数</span>
             <span class="input-item date ">{{userInfo.copies ? userInfo.copies:'请选择' }}</span>
              <div class="arrow"></div>
            </li>
          </ul>
        </form>
      </section>
    </scroller>
    <div class="information_insure">
      <p class="price"><span>￥320.00</span>&nbsp;起</p>
      <p class="account">(推广费￥15.00)</p>
      <p class="insure" @click="insure"><span>立即投保</span></p>
    </div>
    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>
    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
    <BotSelect v-on:onChildClick="botSelectClick" :title="botTitle" :show="Show" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelect>
    <Live v-on:onLiveClick="LiveClick"  :show="ShowLive" :formData="formTemp[formIndex]" :formIndex="formIndex"></Live>

  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
