<template>
  <div class="general_page">
		<div class="wrapper">
			<div class="controller">
				<div class="risks">主险</div>
				<div class="normal">
					<ul class="list">
						<li class="item">
							<div class="vehicle">机动车损失保险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">机动车第三者责任保险</div>
							<div class="right">
								<div class="insure-val" v-on:click.stop="handleInsureNumClick($event, 1)">20万</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">司机责任险</div>
							<div class="right">
								<div class="insure-val" v-on:click.stop="handleInsureNumClick($event, 1)">1万</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">乘客责任险</div>
							<div class="right">
								<div class="insure-val" v-on:click.stop="handleInsureNumClick($event, 2)">1万/1座</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">机动车全车盗抢保险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="glass">玻璃单独破碎险</div>
							<div class="no-insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
						</li>
						<li class="item">
							<div class="vehicle">自燃损失险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">车身划痕损失险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">发动机涉水损失险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="glass">机动车损失保险无法找到第三方特约险</div>
							<div class="no-insure"  v-on:click.stop="handleInsureClick($event)">不投保</div>
						</li>
						<li class="item">
							<div class="glass">指定专修厂险</div>
							<div class="no-insure"  v-on:click.stop="handleInsureClick($event)">不投保</div>
						</li>
						<li class="item">
							<div class="vehicle">车上货物责任险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">精神损害抚慰金责任险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<div class="label">
											<label class="checkbox-wrappe">
	                      <span class="checkbox checkbox-checked">
	                        <span class="checkbox-inner"></span>
	                      </span>
	                    </label>
	                    <span>不计免赔</span>
										</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="box">
					<div class="tallage">交强险/车船税</div>
					<ul class="list">
						<li class="item">
							<div class="name">交强险</div>
							<div class="buy">购买</div>
						</li>
						<li class="item">
							<div class="name">车船税</div>
							<div class="buy">代缴</div>
						</li>
					</ul>
				</div>
				<div class="box">
					<div class="tallage">保险生成日期</div>
					<ul class="list">
						<li class="item">
							<div class="name">商业险</div>
							<div class="buy">
								<input type="text" placeholder="2017-12-30">
							</div>
						</li>
						<li class="item">
							<div class="name">交强险</div>
							<div class="buy">
								<input type="text" placeholder="2017-12-30">
							</div>
						</li>
					</ul>
				</div>
				<div class="btn">开始报价</div>
			</div>
  	</div>
  	<!-- <Popup1 :popupTxt="['投保', '不投保']"></Popup1> -->
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>