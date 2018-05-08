<template>
  <div class="compile_message-page">
    <app-header title="编辑信息">
    	<div class="slot" slot="right">
    		<span class="right" v-if=" $route.path == '/tool/compile_message' ">保存</span>
    	</div>
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
            	<form>
            		<div class="box">
            			<div class="name">联系人</div>
            			<input type="text" placeholder="请输入联系人姓名">
            		</div>
            		<div class="box">
            			<div class="name">联系电话</div>
            			<input type="text" placeholder="请输入联系人联系电话">
            		</div>
            		<div class="box">
            			<div class="name">微信号码</div>
            			<input type="text" placeholder="请输入微信号码">
            		</div>
            		<div class="info">
            			<div class="serve">服务简介</div>
            			<textarea placeholder="请简单介绍您所提供的服务内容"></textarea>
            		</div>
            		<div class="uploading-box">
            			<div class="serve">上传二维码</div>
            			<div class="input-box">
            				<div class="input">
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
            		</div>
            	</form>
            </div>
          </div>
        </div>
      </scroller>
      <cropper v-on:uploadFileClose="fileClose"></cropper>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>