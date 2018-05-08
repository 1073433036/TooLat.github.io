<template>
  <div class="increase-issue">
    <app-header title="发布">
      <div class="slot" slot="right">
        <span class="right" v-if=" $route.path == '/increase_issue' ">
          <!-- <router-link :to="{ name: 'home.IssueDetail' }">预览</router-link> -->
          <div v-on:click.stop="goThePage">预览</div>
        </span>
      </div>
    </app-header>
      <scroller>
        <div class="wrapper" v-show="!isShow">
					<div class="main">
						<h3 class="title">标题</h3>
						<input type="text" class="compile" v-model="title" placeholder="点击编辑标题">
					</div>
					<div class="txt">
						<h3 class="title">正文</h3>
						<ul class="textbox">
							<li class="list" v-for="(item,index) in form" :key="index">
								<span class="sp sp-close" @click="delText(index)"></span>
								<div class="uploading">
									<div class="avatar">
										<img v-if="imgUrl" :src="imgUrl" alt="">
										<img v-else src="~assets/images/uploading-01.png" alt="">
									</div>
									<input type="file"
                      class="input"
                      name="image"
                      accept="image/*"
                      ref="file"
                      v-on:change="setImage"/>
								</div>
								<div class="box" @click="addCharacter(index)">{{item.text || '点击添加文字'}}
									<input type="text" class="add-text" placeholder="点击添加文字">
								</div>
							</li>
						</ul>
						<span class="sp sp-add add" @click="addText()"></span>
					</div>
        </div>
      </scroller>
			<div class="increase-detail" v-show="isShow">
				<app-header title="编辑文章">
					<div class="slot" slot="right">
						<span class="right" v-if=" $route.path == '/increase_issue' " @click="handleTest()">完成
						</span>
					</div>
				</app-header>
				<div class="main">
					<textarea class="text" value="" placeholder="不超过5000字" v-model="txt"></textarea>
				</div>
			</div>
			<BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
			<cropper v-on:uploadFileClose="fileClose"></cropper>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>