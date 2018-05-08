<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="set-amount" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">上传影像</div>
        <div class="save-btn">
          <a href="javascript:" @click="handleSubmit">保存</a>
        </div>
      </div>
      <scroller>
        <div class="box">
					<div class="identity-card" @click="clickInput('avatarFront')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarFront"
						v-on:change="setImage($event,'avatarFront')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarFront" :src="formData.avatarFront">
								<img v-else src="~assets/images/identity-just.png" alt="">
							</div>
							<span class="front">被保人身份证正面照</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
					<div class="identity-card" @click="clickInput('avatarBack')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarBack"
						v-on:change="setImage($event,'avatarBack')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarBack" :src="formData.avatarBack">
								<img v-else src="~assets/images/identity-back.png" alt="">
							</div>
							<span class="front">被保人身份证反面照</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
					<div class="identity-card" @click="clickInput('avatarCard')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarCard"
						v-on:change="setImage($event,'avatarCard')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarCard" :src="formData.avatarCard">
								<img v-else src="~assets/images/identity-card.png" alt="">
							</div>
							<span class="front">行驶证正页照</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
					<div class="identity-card" @click="clickInput('avatarInvoice')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarInvoice"
						v-on:change="setImage($event,'avatarInvoice')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarInvoice" :src="formData.avatarInvoice">
								<img v-else src="~assets/images/identity-invoice.png" alt="">
							</div>
							<span class="front">行驶证副页照</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
					<div class="identity-card" @click="clickInput('avatarSeat')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarSeat"
						v-on:change="setImage($event,'avatarSeat')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarSeat" :src="formData.avatarSeat">
								<img v-else src="~assets/images/identity-invoice.png" alt="">
							</div>
							<span class="front">行驶证副页照(有座位)</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
					<div class="identity-card" @click="clickInput('avatarCertificate')">
						<input type="file"
						class="input"
						name="image"
						accept="image/*"
						ref="avatarCertificate"
						v-on:change="setImage($event,'avatarCertificate')"/>
						<div class="uploading">
							<div class="head">
								<img v-if="formData.avatarCertificate" :src="formData.avatarCertificate">
								<img v-else src="~assets/images/identity-invoice.png" alt="">
							</div>
							<span class="front">行驶证副页照(有合格证)</span>
							<i class="sp sp-right"></i>
						</div>
					</div>
        </div>
				<!-- <div class="btn">
					<a href="javascript:" @click="handleSubmit">保存</a>
				</div> -->
      </scroller>
			<cropper v-on:uploadFileClose="fileClose"></cropper>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>