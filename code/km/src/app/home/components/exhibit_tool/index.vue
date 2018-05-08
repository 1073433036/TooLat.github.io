<template>
  <div class="card_insurance">
    <app-header title="展业工具">
    </app-header>
      <scroller ref="my_scroller"
        :on-refresh="refresh">
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list">
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
									</li>
									<li class="list">
										<a v-on:click="$toast('近期即将开放')">
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
									<li class="list">
										<a v-on:click="hint">
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
									<li class="list">
										<router-link :to="{}">
											<div class="logo"><img src="~assets/images/exhibit-04.png" alt=""></div>
											<div class="box">
												<div class="name">一键推文</div>
												<div class="state">火爆文章、新闻，插入展业广告显示</div>
											</div>
										</router-link>
										<div class="select">
											<i class="sp sp-vip-exclusive"></i>
										</div>
									</li>
									<li class="list">
										<router-link :to="{}">
											<div class="logo"><img src="~assets/images/exhibit-05.png" alt=""></div>
											<div class="box">
												<div class="name">个性趣图</div>
												<div class="state">生成好玩的趣图、提高朋友圈收视率</div>
											</div>
										</router-link>
									</li>
									<li class="list">
										<a v-on:click="$toast('近期即将开放')">
											<div class="logo"><img src="~assets/images/exhibit-06.png" alt=""></div>
											<div class="box">
												<div class="name">行业爆料资料库</div>
												<div class="state">平台会有，真实有效视频，图片，朋友圈造势</div>
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