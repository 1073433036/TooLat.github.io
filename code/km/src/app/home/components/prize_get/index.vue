<template>
  <div class="prize_get">
    <app-header title="奖品领取">
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="main">
              <div class="photo_box">
                <div class="photo">
                  <div class="shop_img">
                    <img v-if="formTemp.goods.img2" :src="formTemp.goods.img2" alt="">
                    <img v-else src="~assets/images/backdrop-02.png" alt="">
                  </div>
                  <div class="info">
                    <p class="shop">{{ formTemp.goods.prize }}</p>
                    <p class="shop_info">{{ formTemp.goods.description }}</p>
                  </div>
                </div>
              </div>
              <form class="info_box" ref="form" @submit.prevent="handleSumbit">
                <div class="info">
                  <h3 class="title">奖品领取需要填写收件人、联系方式和收件地址</h3>

                  <label for="" class="receiver">
                    <span class="people">收件人</span>
                    <input type="text"
                      class="recipients"
                      v-model.trim="formData.name"
                      vd-required
                      vd-notify='{
                        "text": "请填写收件人姓名",
                      }'
                      placeholder="请填写收件人姓名">
                  </label>

                  <label for="" class="receiver">
                    <span class="people">联系方式</span>
                    <input type="text"
                      class="recipients"
                      v-model.trim="formData.phone"
                      vd-required
                      vd-validate
                      vd-type="phone"
                      vd-notify='{
                        "text": "手机号码不能为空",
                        "patt": "手机号码格式不正确"
                      }'
                      placeholder="请输入手机号码">
                  </label>

                  <label for="" class="receiver" @click="handleCityShowChange">
                    <span class="people">收件地址</span>
                    <div class="recipients on">{{ region || '请选择省市区' }}</div>
                  </label>

                  <label for="" class="receiver">
                    <span class="people"></span>
                    <input type="text"
                      class="recipients"
                      v-model.trim="formData.address"
                      vd-required
                      vd-notify='{
                        "text": "请填写详细的收件地址",
                      }'
                      placeholder="请填写详细的收件地址">
                  </label>

                  <button type="submit" class="btn" :class="{ 'active': active }" :disabled="!active">确定提交</button>
                </div>
              </form>
              <div class="inform">
                <h4 class="message">兑换须知</h4>
                <div class="text">积分一经兑换，概不退回；填写信息时，请认真检查再提交，以免造成不必要的损失；兑换领取礼品后会有专人联系您，请注意接听；兑换领取，无需任何费用。</div>
              </div>
          </div>
        </div>
      </div>
    </scroller>
    <CityList :point="false"></CityList>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>