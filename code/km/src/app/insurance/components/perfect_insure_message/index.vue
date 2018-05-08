<template>
  <div class="perfect_insure_message-page">
    <app-header title="完善投保信息"></app-header>
    <scroller ref="scroller">
      <div class="wrapper">
        <div class="container">
					<div class="main">
						<div class="tips">
							<i class="icon icon-horn"></i>
							<div class="notice">
								<div class="marquee">卡盟金服信贷流量服务平台：我们将对您填写的信息严格保密，不会将信息透露给任何第三方。</div>
							</div>
						</div>
						<form ref="form" @submit.prevent="handleSumbit">

							<div class="insure-people">
								<div class="people">
									<span class="name">车主信息</span>
								</div>
							</div>
							<div class="list-box">
								<div class="box">
									<div class="call">
										<i class="sp sp-task-name"></i>
										<span class="name">姓名</span>
										<input type="text"
											vd-required
											v-model.trim="formData.carOwner.name"
											vd-notify='{
			                  "text": "请输入姓名",
			                }'
			                name="姓名"
											placeholder="请输入姓名">
									</div>
								</div>

								<div class="box" @click="handleBombBoxChange('carOwner')">
									<div class="call">
										<i class="sp sp-profile-01"></i>
										<span class="name">证件类型</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											vd-required
											v-model.trim="formData.carOwner.idcardName"
											vd-notify='{
			                  "text": "请选择证件类型",
			                }'
			                class="readonly"
			                name="证件类型"
											placeholder="请选择证件类型">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-profile-04"></i>
										<span class="name">证件号码</span>
										<input type="text"
											vd-required
											v-model.trim="formData.carOwner.idcardNo"
											vd-notify='{
			                  "text": "请输入证件号码",
			                }'
			                name="证件号码"
											placeholder="请输入证件号码">
									</div>
								</div>

								<div class="box" @click="handleDateChange('ownerIDCardValidDate')">
									<div class="call">
										<i class="sp sp-code"></i>
										<span class="name">证件有效止期</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											vd-required
											v-model.trim="ownerIDCardValidDate.itemValue"
											vd-notify='{
			                  "text": "请选择证件有效止期",
			                }'
			                class="readonly"
			                name="证件有效止期"
											placeholder="请选择证件有效止期">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-address"></i>
										<span class="name">证件地址</span>
										<input type="text"
											vd-required
											v-model.trim="ownerAddress.itemValue"
											vd-notify='{
			                  "text": "请输入证件地址",
			                }'
			                name="证件地址"
											placeholder="请输入证件地址">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-task-mobile"></i>
										<span class="name">手机号</span>
										<input type="text"
											vd-required
											vd-validate
			                vd-type="phone"
			                v-model.trim="formData.carOwner.phone"
			                vd-notify='{
			                  "text": "请输入11位手机号码",
			                  "patt": "手机号码格式不正确"
			                }'
			                name="手机号"
											placeholder="请输入手机号">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-mailbox"></i>
										<span class="name">邮箱</span>
										<input type="text"
											vd-required
											vd-validate
											vd-type="email"
											v-model.trim="formData.carOwner.email"
			                vd-notify='{
			                  "text": "请输入邮箱",
			                  "patt": "邮箱格式不正确"
			                }'
			                name="邮箱"
											placeholder="请输入邮箱">
									</div>
								</div>

                <div class="box">
									<div class="call">
										<i class="sp sp-address"></i>
										<span class="name">行驶证地址</span>
										<input type="text"
											vd-required
											v-model.trim="drivingLicenseAddress.itemValue"
											vd-notify='{
			                  "text": "请输入行驶证地址",
			                }'
			                name="行驶证地址"
											placeholder="请输入行驶证地址">
									</div>
								</div>
							</div>

							<div class="insure-people">
								<div class="people">
									<span class="name">投保人信息</span>
									<div class="fit">
										<Checkbox v-model="isApplicant" ref="applicant"><span>与车主一致</span></Checkbox>
									</div>
								</div>
							</div>
							<div class="list-box" v-show="!isApplicant">
								<div class="box">
									<div class="call">
										<i class="sp sp-task-name"></i>
										<span class="name">姓名</span>
										<input type="text"
											v-model.trim="formData.applicant.name"
											placeholder="请输入姓名">
									</div>
								</div>

								<div class="box" @click="handleBombBoxChange('applicant')">
									<div class="call">
										<i class="sp sp-profile-01"></i>
										<span class="name">证件类型</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="formData.applicant.idcardName"
											class="readonly"
											placeholder="请选择证件类型">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-profile-04"></i>
										<span class="name">证件号码</span>
										<input type="text"
											v-model.trim="formData.applicant.idcardNo"
											placeholder="请输入证件号码">
									</div>
								</div>

								<div class="box" @click="handleDateChange('applicantIDCardValidDate')">
									<div class="call">
										<i class="sp sp-code"></i>
										<span class="name">证件有效止期</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="applicantIDCardValidDate.itemValue"
			                class="readonly"
			                name="证件有效止期"
											placeholder="请选择证件有效止期">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-address"></i>
										<span class="name">证件地址</span>
										<input type="text"
											v-model.trim="applicantAddress.itemValue"
											placeholder="请输入证件地址">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-task-mobile"></i>
										<span class="name">手机号</span>
										<input type="text"
			                v-model.trim="formData.applicant.phone"
											placeholder="请输入手机号">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-mailbox"></i>
										<span class="name">邮箱</span>
										<input type="text"
											v-model.trim="formData.applicant.email"
											placeholder="请输入邮箱">
									</div>
								</div>
							</div>

							<div class="insure-people">
								<div class="people">
									<span class="name">被保人信息</span>
									<div class="fit">
										<Checkbox v-model="isInsured" ref="insured"><span>与车主一致</span></Checkbox>
									</div>
								</div>
							</div>
							<div class="list-box" v-show="!isInsured">
								<div class="box">
									<div class="call">
										<i class="sp sp-task-name"></i>
										<span class="name">姓名</span>
										<input type="text"
											v-model.trim="formData.insured.name"
											placeholder="请输入姓名">
									</div>
								</div>

								<div class="box" @click="handleBombBoxChange('insured')">
									<div class="call">
										<i class="sp sp-profile-01"></i>
										<span class="name">证件类型</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="formData.insured.idcardName"
											class="readonly"
											placeholder="请选择证件类型">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-profile-04"></i>
										<span class="name">证件号码</span>
										<input type="text"
											v-model.trim="formData.insured.idcardNo"
											placeholder="请输入证件号码">
									</div>
								</div>

								<div class="box" @click="handleDateChange('insuredIDCardValidDate')">
									<div class="call">
										<i class="sp sp-code"></i>
										<span class="name">证件有效止期</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="insuredIDCardValidDate.itemValue"
			                class="readonly"
			                name="证件有效止期"
											placeholder="请选择证件有效止期">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-address"></i>
										<span class="name">证件地址</span>
										<input type="text"
											v-model.trim="insuredAddress.itemValue"
											placeholder="请输入证件地址">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-task-mobile"></i>
										<span class="name">手机号</span>
										<input type="text"
			                v-model.trim="formData.insured.phone"
											placeholder="请输入手机号">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-mailbox"></i>
										<span class="name">邮箱</span>
										<input type="text"
											v-model.trim="formData.insured.email"
											placeholder="请输入邮箱">
									</div>
								</div>
							</div>

							<div class="insure-people">
								<div class="people">
									<span class="name">权益索赔人信息</span>
									<div class="fit">
										<Checkbox v-model="isBeneficiary" ref="beneficiary"><span>与车主一致</span></Checkbox>
									</div>
								</div>
							</div>
							<div class="list-box" v-show="!isBeneficiary">
								<div class="box">
									<div class="call">
										<i class="sp sp-task-name"></i>
										<span class="name">姓名</span>
										<input type="text"
											v-model.trim="formData.beneficiary.name"
											placeholder="请输入姓名">
									</div>
								</div>

								<div class="box" @click="handleBombBoxChange('beneficiary')">
									<div class="call">
										<i class="sp sp-profile-01"></i>
										<span class="name">证件类型</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="formData.beneficiary.idcardName"
											class="readonly"
											placeholder="请选择证件类型">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-profile-04"></i>
										<span class="name">证件号码</span>
										<input type="text"
											v-model.trim="formData.beneficiary.idcardNo"
											placeholder="请输入证件号码">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-task-mobile"></i>
										<span class="name">手机号</span>
										<input type="text"
			                v-model.trim="formData.beneficiary.phone"
											placeholder="请输入手机号">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-mailbox"></i>
										<span class="name">邮箱</span>
										<input type="text"
											v-model.trim="formData.beneficiary.email"
											placeholder="请输入邮箱">
									</div>
								</div>
							</div>

							<div class="insure-people">
								<div class="people">
									<span class="name">投递收件地址</span>
								</div>
							</div>
							<div class="list-box">
								<div class="box">
									<div class="call">
										<i class="sp sp-task-name"></i>
										<span class="name">姓名</span>
										<input type="text"
											v-model.trim="formData.delivery.name"
											placeholder="请输入姓名">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-task-mobile"></i>
										<span class="name">手机号</span>
										<input type="text"
			                v-model.trim="formData.delivery.phone"
											placeholder="请输入手机号">
									</div>
								</div>

								<div class="box" @click="handleCityShowChange()">
									<div class="call">
										<i class="sp sp-location"></i>
										<span class="name">省市区</span>
										<div class="right"><i class="sp sp-right"></i></div>
										<input type="text"
											readonly
											v-model.trim="showAddress"
											class="readonly"
											placeholder="请选择省市区">
									</div>
								</div>

								<div class="box">
									<div class="call">
										<i class="sp sp-address"></i>
										<span class="name">详细地址</span>
										<input type="text"
											v-model.trim="formData.delivery.address"
											placeholder="请输入详细地址">
									</div>
								</div>
							</div>

							<div class="box on" @click="isImage = true">
								<div class="call">
									<i class="sp sp-image"></i>
									<span class="name">上传影像</span>
									<div class="image-box" :class="{ 'on': isUploadImage }">{{ isUploadImage ? '已上传' : '请选择' }}</div>
									<div class="right"><i class="sp sp-right"></i></div>
								</div>
							</div>

							<div class="box on" @click="isInvoice = true">
								<div class="call">
									<i class="sp sp-invoice"></i>
									<span class="name">发票信息</span>
									<div class="image-box" :class="{ 'on': invoiceInfo.invoiceType === 0 || invoiceInfo.invoiceType === 1 }">
										{{ invoiceInfo.invoiceType === 0 ? '增值税普通发票' : invoiceInfo.invoiceType === 1 ? '增值税专用发票' : '请上传' }}
									</div>
									<div class="right"><i class="sp sp-right"></i></div>
								</div>
							</div>

							<div class="insure-people">
								<div class="people">
									<span class="name">核保补充数据项</span>
								</div>
							</div>

							<div class="box">
								<div class="call">
									<span class="name">备注</span>
									<!-- @focus="focusUpdata"
									@blur="blurUpdata" -->
									<input type="text"
										v-model.trim="remark"
										placeholder="请填写备注">
								</div>
							</div>

							<div class="read">
								<Checkbox v-model="isProtocol">我已阅读并同意</Checkbox><span class="statement" @click.stop="isStatement = true">《投保声明》</span>
							</div>
							<button type="submit" class="btn">提交投保</button>

						</form>
					</div>
        </div>
      </div>
    </scroller>

		<UploadingImages v-model="isImage" :taskId="taskId" v-on:upload="handleUpload"></UploadingImages>

		<Invoice v-model="isInvoice"
			v-on:saveInvoice="handleInvoice"></Invoice>

		<transition name="fade" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
			<div class="insure-statement" v-show="isStatement">
				<div class="box">
					<scroller>
						<div class="text">
							<p>1、投保人请确保投保时各项填写内容及提供的相关资料真实有效。必须保证所有的资料在续保时亦真实有效，如相关资料信息发生变更，应提交最新的投保资料为准。投保人应清楚故意或因重大过失未履行如实告知义务的法律后果。</p>
							<p>2、投保人在本平台进行投保，需阅读 《机动车综合商业保险条款》和《机动车交通事故责任强制保险条例》，并特别就条款中免除保险人责任和投保人、被保险人义务的内容进行阅读，投保人对免除保险人责任的条款的概念、内容及其法律后果，均因本平台声明的明确说明已完全理解并同意投保。</p>
							<p>3、投保人于本平台填写并提交完整投保信息、确认投保的行为可视为向本平台提出保险要求，据《保险法》，经保险公司同意承保后保险合同即成立。</p>
							<p>4、投保人于投保生效即授权本平台，基于为投保人提供更优质服务和产品的目的，投保人享受保险服务所产生的信息可用于本平台及因服务必要而委托的第三方为投保人提供服务及推荐产品，法律禁止的除外。本平台及其委托的第三方对上述信息负有保密义务。本条款自本单证签署时生效，具有独立法律效力，不受合同成立与否及效力状态变化的。</p>
						</div>
					</scroller>
				</div>
				<div class="close" @click="isStatement = false">关闭</div>
			</div>
		</transition>

		<BombBox v-on:bombClick="handleBomb"
			:show="bombShow"
			:formData="formTemp[formIndex]"
			:formIndex="formIndex"></BombBox>

		<CityList :point="false"></CityList>

		<Dates v-on:onDateClick="handelDateClick"
			:show="isDate"
			:today="false"></Dates>

  </div>
</template>


<script>
  import Index from './index.js';
  export default Index;
</script>
