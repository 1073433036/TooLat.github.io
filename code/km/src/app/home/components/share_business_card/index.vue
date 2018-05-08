<template>
	<div class="user-business-page">
		<app-header :title="formData.name + '的卡盟V金服微名片'"></app-header>
		<scroller ref="myscroller">
			<div class="wrapper">
				<div class="container">
					<div class="user-info">
						<div class="head">
							<div class="avatar">
								<img v-if="formData.avatar" :src="formData.avatar">
								<img v-else src="~assets/images/avatar.png" @click="perfect">
							</div>
							<div class="info">
								<h3 class="name">
									<i class="sp sp-task-name"></i>
									<span class="nick">{{ formData.name }}</span>
								</h3>
								<div class="tag">
									<span>信贷经理</span>
									<i v-if="2 == formData.sex" class="sp sp-girl"></i>
                  <i v-if="1 == formData.sex" class="sp sp-male"></i>
									<span v-if="formData.age" class="age">{{ formData.age }}</span>
								</div>
							</div>
						</div>

						<div class="body">
							<div class="item">
									<i class="sp sp-mobile"></i>
									<span v-if="formData.phone">{{ formData.phone }}</span>
									<span v-else class="text" @click="perfect">待完善</span>
							</div>
							<div class="item">
									<i class="sp sp-location-01"></i>
									<span v-if="formData.hometown">{{ formData.hometown }}</span>
									<span v-else class="text" @click="perfect">待完善</span>
							</div>
						</div>
					</div>

					<div class="content">
						<div class="company">
							<div class="item name">
								<i class="sp sp-business-01"></i>
								<span v-if="formData.company">所在单位： {{ formData.company }}</span>
                <span v-else>所在单位：<span class="text" @click="perfect">待完善</span></span>
							</div>
							<div class="item">
								<div class="profile">
									<i class="sp sp-business-02"></i>
									<span>公司介绍</span>
								</div>
								<div class="introduce on" :class="{ much:isMuch }">
									<span class="text" v-if="formData.company_desc">{{formData.company_desc}}</span>
									<span v-else class="complete">待完善</span>
									<span class="many" @click="many" v-show="more">（更多）</span>
								</div>
								<div class="photo">
									<ul class="list">
										<li v-show="0 < formData.company_images.length" class="photo-item" v-for="(item, index) in formData.company_images" :key="index" v-on:click.stop="scalePhoto(item)">
											<img :src="item">
										</li>
                    <li v-show="0 >= formData.company_images.length" v-for="item in 4" class="photo-item no-border" @click="perfect">
                      <img src="~assets/images/uploading-02.png">
                    </li>
									</ul>
								</div>
							</div>
						</div>

						<div class="title" @click="isMore = true">
							<span>更多资料</span>
							<i class="icon icon-enter"></i>
						</div>

						<div class="item" v-show="isMore">
							<i class="sp sp-business-03"></i>
							<span>血型</span>
							<em v-if="formData.blood_type">{{ formData.blood_type }}血型</em>
              <em v-else class="text" @click="perfect">待完善</em>
							<!-- <em v-else class="text" @click="perfect">待完善</em> -->
						</div>
						<div class="item" v-show="isMore">
							<i class="sp sp-business-04"></i>
							<span>家乡</span>
							<em v-if="formData.hometown">{{ formData.hometown }}</em>
              <em v-else class="text" @click="perfect">待完善</em>
							<!-- <em v-else class="text" @click="perfect">待完善</em> -->
						</div>
					</div>
				</div>
			</div>
		</scroller>
		<div class="foot">
			<div class="head">
				<img v-if="formData.avatar" :src="formData.avatar">
				<img v-else src="~assets/images/avatar.png" @click="perfect">
			</div>
			<div class="info">共计2000多人与你共享</div>
			<div class="download">
				<a href="https://itunes.apple.com/us/app/%E5%8D%A1%E7%9B%9F%E9%87%91%E6%9C%8D-lite/id1335439711?mt=8&uo=4">立即下载</a>
			</div>
		</div>
		<div class="layer" v-show="isShare">
			<div class="mask" @click="isShare = false"></div>
			<div class="share-image">
				<img src="~assets/images/creditcard-share-btn.png" alt="">
			</div>
		</div>
		<div v-show="isShowCompanyImg" class="scalePhoto" v-on:click.stop="chooseFixed">
			<div class="content-img">
				<img :src="photoSrc" alt="">
			</div>
		</div>
	</div>
</template>

<script>
	import Index from './index.js';
	export default Index;
</script>