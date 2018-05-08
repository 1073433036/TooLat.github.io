<template>
  <main class="CheckData">
    <app-header title="核对资料"></app-header>
    <scroller ref="myscroller">

      <section class="CheckData_wrapper">
        <div class="com-header">
          <p  @click="switchState(1)"><span :class="{ active: 1 == status}" class="message" >上传资料</span></p>
          <p  @click="switchState(2)"><span  :class="{ active: 2 == status}" class="apply">我的申请</span></p>
        </div>
        <form class="info_box_top" ref="form"  v-show="1 == status">
          <ul class="info" >
            <li class="list">
              <i class="name"></i>
              <span class="title">下卡人姓名</span>
              <input type="text"
                class="input-item"
                v-model="userInfo.name"
                placeholder="姓名">
					  </li>

            <li class="list">
              <i class="phone"></i>
              <span class="title">手机号码</span>
              <input type="text"
                vd-type="number"
                v-model="userInfo.phone"
                class="input-item"
                placeholder="请输入手机号码">
					  </li>

            <li class="list" @click="handleBotSelectChange('bank_list')" >
              <i class="bank"></i>
              <span class="title">申请银行</span>
              <span class="select">{{userInfo.bank_list.bank_name ? userInfo.bank_list.bank_name:'请选择' }}</span>
              <div class="arrow"></div>
            </li>    

            <li class="list" @click="handleDateChange('date1')">
              <i class="date"></i>
              <span class="title">申请时间</span>
              <span class="select">{{userInfo.date1 ? userInfo.date1:'2018-4-24  16:15:12' }}</span>
              <div class="arrow"></div>
					  </li>
          </ul>
          <div class="reminder">
             <p>
              您所下卡的佣金金额是<span> 15元</span>，请上传资料核对，经人工审核信息无误，平台将发放佣金，到时间可提现。
             </p>
          </div>
          <div class="information">
            <div class="title"><i></i>资料信息上传</div>
            <div class="uploading">
              <div class="left">
                  <img v-if="currentFile" class="photo-cont" alt="图片" :src="currentFile"/>
                  <img src="~assets/images/card_manage/uploading.png">
                  <p>手持下卡照片</p>
                  <input type="file"
                    class="photo-cont"
                    name="image"
                    accept="image/*"
                    ref="file"
                    v-on:change="setImage($event, 'file')"/>
              </div>
              <div class="right">
                  <img v-if="idPic" class="photo-cont" alt="图片" :src="idPic"/>
                  <img src="~assets/images/card_manage/uploading2.png">
                   <input type="file"
                    class="photo-cont"
                    name="image"
                    accept="image/*"
                    ref="file"
                    v-on:change="setImage($event, 'file')"/>
                  <p>核卡短信照片</p>
              </div>
            </div>
          </div>
          <button type="submit" class="btn" :class="{ 'on': active }" :disabled="!active" @click.once = "save">添加确认</button>
        </form>

        <div class="info_box_bottom"  v-show="2 == status">
          <ul>
            <li class="list">
              <div class="list_top">
                <p class="left">提交时间 : <span>2018-4-4 23:50:00</span></p>
                <p class="right">佣金金额 : <span>45000</span></p>
              </div>
              <div class="list_btn">
                <i class="bank_logo"></i>
                <span class="name">交通银行</span>
                <span class="phone">手机号：53453453453</span>
                <span class="status"><em class="ok"></em>已结算</span>
              </div>
            </li> 
            <li class="list mbank">
              <div class="list_top">
                <p class="left">提交时间 : <span>2018-4-4 23:50:00</span></p>
                <p class="right">佣金金额 : <span>45000</span></p>
              </div>
              <div class="list_btn">
                <i class="bank_logo "></i>
                <span class="name">民生</span>
                <span class="phone">手机号：53453453453</span>
                <span class="status unliquidstatus"><em  class="unliquidated"></em>未结算</span>
              </div>
            </li> 
            <li class="list mbank">
              <div class="list_top">
                <p class="left">提交时间 : <span>2018-4-4 23:50:00</span></p>
                <p class="right">佣金金额 : <span>45000</span></p>
              </div>
              <div class="list_btn">
                <i class="bank_logo"></i>
                <span class="name">民生</span>
                <span class="phone">手机号：53453453453</span>
                <span class="status"><em class="error"></em></span>
              </div>
            </li>
          </ul>
        </div>
      </section>

    </scroller>
    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>
    <cropper v-on:uploadFileClose="fileClose"></cropper>
    <BotSelect v-on:onChildClick="botSelectClick" :title="botTitle" :show="Show" :isBankList="isBankList" :formData="formTemp[formIndex]" :formIndex="formIndex"></BotSelect>
     <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false" :child="['year', 'month', 'day', 'hour', 'minute', 'second']"></Dates>
  </main>
</template>
<script>
  import Index from './index.js';
  export default Index;
</script>
