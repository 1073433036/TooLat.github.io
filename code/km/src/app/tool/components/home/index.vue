<template>
  <div class="tool-home-page">
    <app-header title="展业工具">
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list">
										<!-- <router-link :to="{ name: 'user.Business' }"> -->
                    <a href="javascript:void(0)" @click="linkToRoute({ name: 'user.Business' })">
											<div class="logo"><img src="~assets/images/exhibit-06.png" alt=""></div>
											<div class="box">
												<div class="name">微名片</div>
												<div class="state">个性微名片展示</div>
											</div>
                    </a>
										<!-- </router-link> -->
									</li>
								<!-- 	<li class="list">
										<router-link :to="{name: 'home.TracelessCode'}">
											<div class="logo"><img src="~assets/images/exhibit-01.png" alt=""></div>
											<div class="box">
												<div class="name">微信扫码群发器</div>
												<div class="state">扫码群发小助手，一天广告发遍几个城市</div>
											</div>
										</router-link>
										<div class="select">
											<i class="sp sp-vip-exclusive"></i>
										</div>
									</li> -->
									<li class="list" v-on:click="handleDownApp()">
										<a>
											<div class="logo"><img src="~assets/images/exhibit-02.png" alt=""></div>
											<div class="box">
												<div class="name">展业H5工具</div>
												<div class="state">音乐相册制作，非好友可参与聊天</div>
											</div>
										</a>
										<div class="select">
											<i class="sp sp-vip-exclusive"></i>
										</div>
									</li>
									<li class="list" v-on:click="handleDownApp()">
										<a>
											<div class="logo"><img src="~assets/images/exhibit-03.png" alt=""></div>
											<div class="box">
												<div class="name">展业视频</div>
												<div class="state">视频可插播编辑文字、广告</div>
											</div>
										</a>
										<div class="select">
											<i class="sp sp-vip-exclusive"></i>
										</div>
									</li>
									<li class="list" v-on:click="handleDownApp()">
										<a>
											<div class="logo"><img src="~assets/images/exhibit-04.png" alt=""></div>
											<div class="box">
												<div class="name">一键推文</div>
												<div class="state">火爆文章、新闻，插入展业广告显示</div>
											</div>
										</a>
										<div class="select">
											<i class="sp sp-vip-exclusive"></i>
										</div>
									</li>
									<li class="list" v-on:click="handleDownApp()">
										<!-- <router-link :to="{ name: 'tool.SelfdomMap' }"> -->
										<a>
											<div class="logo"><img src="~assets/images/exhibit-05.png" alt=""></div>
											<div class="box">
												<div class="name">个性趣图</div>
												<div class="state">生成好玩的趣图、提高朋友圈收视率</div>
											</div>
										</a>
									</li>
              	</ul>
            </div>
          </div>
        </div>
      </scroller>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>
