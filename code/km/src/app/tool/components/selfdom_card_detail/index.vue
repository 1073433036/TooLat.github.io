<template>
  <div class="selfdom_card_detail-page">
    <app-header title="展业名片">
    	<div class="slot" slot="right">
    		<span class="right" v-if=" $route.path == '/tool/selfdom_card_detail' ">
    			<router-link :to="{ name: 'tool.CompileMessage' }">编辑</router-link>
    		</span>
    	</div>
    </app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="main">
              <ul class="list">
                <li class="item">
                  <div class="info">
                    <div class="left">
                      <div class="name">韩经理</div>
                      <div class="phone">
                      <i class="sp sp-phone-02"></i>
                        <span>13512345678</span>
                      </div>
                      <div class="wechat">
                        <i class="sp sp-wechat-02"></i>
                        <span>13512345678</span>
                      </div>
                    </div>
                    <div class="right">
                      <img src="~assets/images/wechat-code.jpg" alt="" />
                    </div>
                  </div>
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