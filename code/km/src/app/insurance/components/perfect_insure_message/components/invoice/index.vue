<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="invoice-page" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">发票信息</div>
      </div>
      <scroller>
      	<div class="box">
      		<div class="head" @click="handleBombBoxChange('invoiceType')">
      			<div class="name">发票信息</div>
      			<!-- <div class="content">
                          {{ invoiceInfo.invoiceType == 0 ? '增值税普通发票' : '增值税专用发票' }}
                        </div> -->
            <div class="content" v-show="invoiceInfo.invoiceType == -1">请选择</div>
            <div class="content" v-show="invoiceInfo.invoiceType == 0">增值税普通发票</div>
            <div class="content" v-show="invoiceInfo.invoiceType == 1">增值税专用发票</div>
      			<i class="icon icon-enter"></i>
      		</div>
          <form ref="form" @submit.prevent="handleSumbit" v-show="invoiceInfo.invoiceType == 1">
        		<ul class="body-list">

        			<li class="item">
        				<div class="name">开户银行名称</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    v-model.trim="invoiceInfo.bankName"
                    vd-notify='{
                      "text": "请填写开户银行名称",
                    }'
                    name="开户银行名称"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>

        			<li class="item">
        				<div class="name">银行账号</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    vd-validate
                    vd-type="bank"
                    v-model.trim="invoiceInfo.accountNumber"
                    vd-notify='{
                      "text": "请填写银行账号",
                      "patt": "银行账号格式不正确"
                    }'
                    name="银行账号"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>

        			<li class="item">
        				<div class="name">纳税人识别号/</br>统一社会信用代码</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    v-model.trim="invoiceInfo.identifyNumber"
                    vd-notify='{
                      "text": "请填写纳税人识别号/统一社会信用代码",
                    }'
                    name="纳税人识别号/统一社会信用代码"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>

        			<li class="item">
        				<div class="name">纳税登记电话</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    v-model.trim="invoiceInfo.registerPhone"
                    vd-notify='{
                      "text": "请填写纳税登记电话",
                    }'
                    name="纳税登记电话"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>

        			<li class="item">
        				<div class="name">纳税登记地址</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    v-model.trim="invoiceInfo.registerAddress"
                    vd-notify='{
                      "text": "请填写纳税登记地址",
                    }'
                    name="纳税登记地址"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>

        			<li class="item">
        				<div class="name">电子邮箱</div>
        				<div class="content">
        					<input type="text"
                    vd-required
                    vd-validate
                    vd-type="email"
                    v-model.trim="invoiceInfo.email"
                    vd-notify='{
                      "text": "请填写电子邮箱",
                      "patt": "电子邮箱格式不正确"
                    }'
                    name="电子邮箱"
  	      					class="input-item"
  	      					placeholder="请填写">
        				</div>
        			</li>
        		</ul>
  					<div class="submit-btn">
              <button type="submit" class="btn">保存</button>
  					</div>
          </form>
          <div class="submit-btn" v-show="invoiceInfo.invoiceType == 0">
            <div class="btn" @click="handleSave">保存</div>
          </div>
      	</div>
      </scroller>

      <BombBox v-on:bombClick="handleBomb"
        :show="bombShow"
        :formData="formTemp[formIndex]"
        :formIndex="formIndex">
      </BombBox>

    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>