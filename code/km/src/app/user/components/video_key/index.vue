<template>
  <div class="video_key">
    <app-header title="视频激活码"></app-header>
    <div class="box">
			<div class="wrapper">
        <div class="payment">
					<img src="~assets/images/video-vip.jpg" alt="">
				</div>
      </div>
			<div class="content">
				<!-- <div class="activate">
					<div class="video-activate">
            <div class="code-area">
						  <span class="sp sp-activate"></span>
						  <div class="video-key">
                <p  v-for="item in videoKey">视频激活码：<span class="color-1">{{item.code}}</span></p>
              </div>
            </div>
						<div class="info">温馨提示：请您下载安装<a href="http://www.51xyj.cn/" class="world">全新视界</a>，输入激活码激活，祝您观看愉快！</div>
					</div>
				</div> -->
        <div v-if="videoKey.length != 0" class="big-title">长按账号可直接复制粘贴</div>
        <ul class="list" v-if="videoKey.length != 0">
          <li class="item" v-for="item in videoKey">
            <img src="~assets/images/video-vip02.png" alt="">
            <p class="code">{{ item.code }}</p>
            <i class="icon icon-del" @click="del(item.id)"></i>
          </li>
        </ul>
        <ul class="list" v-else>
          <li class="empty">暂无视频激活码</li>
        </ul>
				<div class="title">注释：</div>
				<div class="text">视频VIP会员，有第三方平台友情赞助，是免费赠送给平台会员使用，不再收取其他费用，后期因第三方不可抗拒因素影响，导致VIP账号停用，只能更换相同的视频会员，卡盟金服平台不承担任何赔偿责任。
				</div>
				<div  class="btn">
					<div class="download">
            <router-link :to="{ name: 'home.AppHorizon' }">前往下载APP使用</router-link>
					</div>
				</div>
		  </div>
	  </div>
  </div>
</template>

<script>
  import Index from "./index.js";
  export default Index;
</script>