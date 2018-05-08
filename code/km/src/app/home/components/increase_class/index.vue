<template>
  <div class="increase-class">
    <app-header title="提额培训班">
			<div class="slot" slot="right">
				<span class="right" v-if=" $route.path == '/increase_class' ">
					<router-link :to="{ name: 'home.IncreaseIssue' }">
							发布
						<i class="sp sp-issue"></i>
					</router-link>
				</span>
			</div>
		</app-header>
      <scroller>
        <div class="wrapper">
          <div class="controller">
            <div class="photo">
              <img src="~assets/images/tie_peixunban01.jpg" alt="">
            </div>
            <div class="main">
              <ul class="list">
                <li class="item" v-for="item in formTemp.increaseData" v-on:click.stop="goToThePage(item)">
                  <div class="content-group">
                    <img :src="item.more.thumbnail">
                    <span class="name">{{item.name}}</span>
                    <i class="sp sp-right"></i>
                  </div>
                </li>
              </ul>
            </div>
            <div class="photo-logo">
              <img src="~assets/images/no-data.png" alt="">
            </div>
          </div>
        </div>
      </scroller>
      <div class="member-box" v-show="isShow">
        <div class="member">
          <span class="abolish" @click="countermand()">取消</span>
          <span class="commissioner">成为专员</span>
        </div>
      </div>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>