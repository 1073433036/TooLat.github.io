<template>
	<div class="insurance-page">
		<app-header title="无痕扫码">
		</app-header>
		<scroller>
			<div class="wrapper">
				<div class="controller">
					<div class="main">
						<div class="photo">
							<img src="~assets/images/traceless.png" alt="">
						</div>
						<div class="info">
							<div class="left">
								<a href="http://a.fenxiangshuo.com/" class="indent">
									<i class="sp sp-scan-code"></i>
									<span>登录1</span>
								</a>
							</div>
							<div class="right">
								<a href="http://a.fenxiangshuo.com/" class="indent">
									<i class="sp sp-scan-code"></i>
									<span>登录2</span>
								</a>
							</div>
						</div>
						<div class="box">
							<ul class="list">
								<li class="item">
									<div class="top">
										<i class="sp sp-course"></i>
										<span>新手指南</span>
									</div>
									<div class="content">
										<div class="video" v-on:click.stop="payVideo">
											<img src="~assets/images/video.png" alt="">
											<div class="mask-layer">
												<div class="play"><i class="sp sp-play"></i></div>
											</div>
										</div>
										<div class="hint">
											<div class="title">温馨提示：</div>
											<div class="text">新手可先观看扫码流程视频，以便您的方便操作，帮助您快速熟悉无痕扫码群发的流程！</div>
										</div>
									</div>
									<video v-show="isPlayVideo" ref="video" src="http://kmimage.wifizx.cc/caozuo.mp4" @click.stop="pauseVideo"></video>
								</li>
							</ul>
						</div>
						<div class="accounts">
							<div class="user">
								<span>帐号：</span>
								<span>扫码群发1</span>
								<span>扫码群发2</span>
							</div>
							<div class="user">
								<span>统一密码：</span>
								<span>111111</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</scroller>
		<form ref="form" action="http://a.fenxiangshuo.com/shop/sj/main.do" v-show="hiddenForm">
			<input type="text" v-model="account">
			<input type="password" v-model="password">
		</form>
		<div class="iframe" v-show="hiddenForm">
			<iframe ref="iframe" name="iframe1" src="http://a.fenxiangshuo.com/shop/sj/login.do" frameborder="0"></iframe>
		</div>
	</div>
</template>

<script>
	import Index from './index.js';
	export default Index;
</script>