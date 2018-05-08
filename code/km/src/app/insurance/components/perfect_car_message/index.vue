<template>
  <div class="card_insurance">
    <app-header title="完善车辆信息">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
            	<form class="form-group" @submit.prevent="handleSumbit" ref="form">
								<ul class="list">

									<li class="item" @click="handleBombBoxChange('idcardType')">
										<div class="box">
											<div class="name">证件类型</div>
												<input type="text"
													readonly
													vd-required
													v-model.trim="formData.idcardType.name"
													vd-notify='{
					                  "text": "请选择证件类型",
					                }'
													placeholder="请选择">
											<i class="sp sp-right"></i>
										</div>
									</li>

									<li class="item">
										<div class="box">
											<div class="name">证件号码</div>
											<input type="text"
												vd-required
												v-model.trim="formData.idcardNo"
												vd-notify='{
				                  "text": "请输入证件号码",
				                  "patt": "证件号码格式不正确"
				                }'
				                ref="idcardNo"
												placeholder="请输入证件号码">
										</div>
									</li>

									<li class="item" @click="handleDateChange('registDate')">
										<div class="box">
											<div class="name">车辆初登日期</div>
											<input type="text"
												vd-required
												readonly
												v-model.trim="formData.registDate"
												vd-notify='{
				                  "text": "请选择日期",
				                }'
												placeholder="请选择日期">
											<span class="num registDate" v-show="!formData.registDate">1</span>
                      <img src="~assets/images/camera.png" class="camera registDate" alt="拍照识别" @click.stop="isDialogShow = true">
										</div>
									</li>

									<li class="item">
										<div class="box">
											<div class="name">车辆识别代号</div>
											<input type="text"
												maxlength="17"
												vd-required
												v-model.trim="formData.vinCode"
												vd-notify='{
				                  "text": "请输入17位车辆识别代号",
				                }'
												placeholder="请输入17位车辆识别代号">
											<span class="num vinCode" v-show="!formData.vinCode">2</span>
                      <img src="~assets/images/camera.png" class="camera vinCode" alt="拍照识别" @click.stop="isDialogShow = true">
										</div>
									</li>

									<li class="item">
										<div class="box">
											<div class="name">发动机号码</div>
											<input type="text"
												maxlength="20"
												minlength="6"
												vd-required
												v-model.trim="formData.engineNo"
												vd-notify='{
				                  "text": "请输入发动机号码",
				                }'
												placeholder="请输入发动机号码">
											<span class="num engineNo" v-show="!formData.engineNo">3</span>
                      <img src="~assets/images/camera.png" class="camera engineNo" alt="拍照识别" @click.stop="isDialogShow = true">
										</div>
									</li>

									<li class="item" @click="isShow = true">
										<div class="box">
											<div class="name">品牌类型</div>
											<input type="text"
												readonly
												vd-required
												v-model="formData.brand.vehicleName"
												vd-notify='{
				                  "text": "请选择品牌类型",
				                }'
												placeholder="请选择">
											<i class="sp sp-right"></i>
											<span class="num vehicleName" v-show="!formData.brand.vehicleName">4</span>
                      <img src="~assets/images/camera.png" class="camera vehicleName" alt="拍照识别" @click.stop="isDialogShow = true">
										</div>
									</li>

									<li class="item">
										<div class="box">
											<div class="name">核定载人数</div>
											<input type="text"
												v-model.trim="formData.seat"
												vd-notify='{
				                  "text": "请输入核定载人数",
				                }'
												placeholder="请输入核定载人数">
										</div>
									</li>

									<li class="item" v-show="isRegister || isNew">
										<div class="box">
											<div class="name">新车发票价</div>
											<input type="text"
												v-model="formData.price"
												placeholder="请输入发票价(元)">
										</div>
									</li>

									<li class="item" @click="handleBombBoxChange('property')">
										<div class="box">
											<div class="name">车辆所属性质</div>
											<input type="text"
													readonly
													vd-required
													v-model="formData.property.name"
													vd-notify='{
					                  "text": "请选择车辆所属性质",
					                }'
													placeholder="请选择">
											<i class="sp sp-right"></i>
										</div>
									</li>

									<li class="item" @click="handleBombBoxChange('carProperty')">
										<div class="box">
											<div class="name">车辆使用性质</div>
											<input type="text"
													readonly
													vd-required
													v-model="formData.carProperty.name"
													vd-notify='{
					                  "text": "请选择车辆使用性质",
					                }'
													placeholder="请选择">
											<i class="sp sp-right"></i>
										</div>
									</li>

									<li class="item" v-if="isModelLoads">
										<div class="box">
											<div class="name">核定载重量</div>
											<input type="text"
												vd-required
												v-model="formData.modelLoads"
												vd-notify='{
				                  "text": "请输入(千克)",
				                }'
												placeholder="请输入(千克)">
										</div>
									</li>

									<li class="item" @click="handleBombBoxChange('isTransferCar')">
										<div class="box">
											<div class="name">是否过户车</div>
											<input type="text"
													readonly
													vd-required
													v-model="formData.isTransferCar.name"
													vd-notify='{
					                  "text": "请选择是否过户车",
					                }'
													placeholder="请选择">
											<i class="sp sp-right"></i>
										</div>
									</li>

									<li class="item" @click="handleDateChange('transferDate')" v-if="formData.isTransferCar.value == 'Y'">
										<div class="box">
											<div class="name">过户日期</div>
											<input type="text"
												vd-required
												readonly
												v-model.trim="formData.transferDate"
												vd-notify='{
				                  "text": "请选择过户日期",
				                }'
				                name="过户日期"
												placeholder="请选择过户日期">
										</div>
									</li>

								</ul>
								<div class="affirm">
									<button type="submit" class="btn" :class="{ active: active }" :disabled="!active">确认</button>
								</div>
								<div class="driving-license">
									<img src="~assets/images/driving-license.png" alt="">
								</div>
							</form>
            </div>
          </div>
        </div>
      </scroller>

			<BombBox v-on:bombClick="handleBomb"
				:show="bombShow"
				:formData="formTemp[formIndex]"
				:formIndex="formIndex"></BombBox>

			<Search v-model="isShow"
				:vehicleName="formData.brand.vehicleName"
				v-on:handleCar="handleCar"></Search>

			<Dates v-on:onDateClick="handelDateClick"
      :show="isDate"
      :today="true"></Dates>

      <transition name="fade">
        <div class="photo-dialog" v-if="isDialogShow">
          <div class="bg" @click="isDialogShow = false"></div>
          <div class="take-photo-wrapper">

            <header>
              拍照识别说明
              <i class="close-btn" @click="isDialogShow = false"></i>
            </header>

            <section class="take-photo-content">
              <div class="take-photo-tip">请对准行驶证正面拍照上传，拍照时确保图像清晰，避免反光影响，以提高识别的正确率。</div>
              <div class="photo-card-wrapper">
                <img v-if="photoData" class="photo-card" alt="图片" :src="base64" />
                <img v-else class="photo-card" alt="图片" src="~assets/images/car-verification/card-photo.png" />
                <input class="photo-card" type="file" accept="image/*" @change="uploadLocalPhoto">
              </div>
              <div class="upload-btn" @click="takePhoto">识别</div>
            </section>

          </div>
        </div>
      </transition>

  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
