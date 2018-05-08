<template>
  <div class="send_site_page">
    <app-header title="收件地址">
			<div class="slot" slot="right" @click="add = true">
				<span class="right" v-if="$route.path == '/insurance/send_site'">新增</span>
			</div>
    </app-header>
      <scroller ref="my_scroller"
        :on-refresh="refresh">
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list" @click="amend">
										<div class="info">
											<span class="name">赵四</span>
											<span class="phone">130****3215</span>
										</div>
										<div class="location">广州市白云区江夏红枫创意园7栋2楼</div>
										<i class="sp sp-right"></i>
									</li>
									<li class="list" @click="amend">
										<div class="info">
											<span class="name">赵四</span>
											<span class="phone">130****3215</span>
										</div>
										<div class="location">广州市白云区江夏红枫创意园7栋2楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼楼</div>
										<i class="sp sp-right"></i>
									</li>
              	</ul>
            </div>
          </div>
        </div>
      </scroller>
			<AddSite v-model="add"></AddSite>
			<DeleteSite v-model="modification"></DeleteSite>
  </div>
</template>

<script>
import Index from "./index.js";
export default Index;
</script>