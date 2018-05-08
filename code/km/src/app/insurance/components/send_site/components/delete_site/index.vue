<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="delete_site" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="title">修改地址</div>
				<div class="right" @click="delSite">删除</div>
      </div>
      <scroller>
        <div class="content">
					<form>
						<div class="box">
							<div class="name">收货人</div>
							<input type="text" placeholder="请填写姓名">
						</div>
						<div class="box">
							<div class="name">手机号</div>
							<input type="text" placeholder="请填写手机号">
						</div>
						<div class="box" @click="select">
							<div class="name">所在地区</div>
							<span v-if="address">{{ address }}</span>
							<span v-else class="fc">请选择地区</span>
							<i class="sp sp-right"></i>
						</div>
						<div class="box">
							<div class="name">详细地址</div>
							<input type="text" placeholder="请填写详细地址">
						</div>
						<div class="box">
							<div class="name">邮政编码</div>
							<input type="text" placeholder="请填写邮政编码">
						</div>
					</form>
					<div class="btn">保存</div>
        </div>
      </scroller>

			<CityList></CityList>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>