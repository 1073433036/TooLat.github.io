<template>
  <div class="selfdom_map_detail-page">
    <app-header title="个性趣图">
    	<div class="slot" slot="right">
    		<span class="right" v-if=" $route.path == '/tool/selfdom_map_detail' ">
    			<router-link :to="{ name: 'tool.CompileMessage' }">编辑</router-link>
    		</span>
    	</div>
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
            	<div class="photo">
            		<div class="box">
            			<div class="title">急需用钱，快速放款5000-10W</div>
            			<div class="info">
            				<div class="left">
            					<div class="code">
            						<img src="~assets/images/code-00.png" alt="">
            					</div>
            				</div>
            				<div class="right">
            					<div class="name">韩经理</div>
            					<div class="phone">
            						<i class="sp sp-phone-01"></i>
            						<span>13512345678</span>
            					</div>
            					<div class="wechat">
            						<i class="sp sp-wechat-01"></i>
            						<span>hantai123</span>
            					</div>
            				</div>
            			</div>
            		</div>
            	</div>
            </div>
            <div class="bottom">
          		<div class="download">下载</div>
          		<div class="share">分享</div>
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