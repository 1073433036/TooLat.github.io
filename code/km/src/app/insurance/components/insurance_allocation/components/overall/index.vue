<template>
  <div class="overall-page">
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
										<label class="label" for="radio-b1">
											<input type="checkbox" id="radio-b1" name="insurance1" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b2">
											<input type="checkbox" id="radio-b2" name="insurance2" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b3">
											<input type="checkbox" id="radio-b3" name="insurance3" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="vehicle">乘客责任险</div>
							<div class="right">
								<div class="insure-val" v-on:click.stop="handleInsureNumClick($event, 2)">1万/座</div>
								<div class="select">
									<div class="radio-group">
										<label class="label" for="radio-b4">
											<input type="checkbox" id="radio-b4" name="insurance4" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b5">
											<input type="checkbox" id="radio-b5" name="insurance5" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="glass">玻璃单独破碎险</div>
							<div class="no-insure">国产玻璃</div>
						</li>
						<li class="item">
							<div class="vehicle">自燃损失险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<label class="label" for="radio-b6">
											<input type="checkbox" id="radio-b6" name="insurance6" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b7">
											<input type="checkbox" id="radio-b7" name="insurance7" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b8">
											<input type="checkbox" id="radio-b8" name="insurance8" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
									</div>
								</div>
							</div>
						</li>
						<li class="item">
							<div class="glass">机动车损失保险无法找到第三方特约险</div>
							<div class="no-insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
						</li>
						<li class="item">
							<div class="glass">指定专修厂险</div>
							<div class="no-insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
						</li>
						<li class="item">
							<div class="vehicle">车上货物责任险</div>
							<div class="right">
								<div class="insure" v-on:click.stop="handleInsureClick($event)">不投保</div>
								<div class="select">
									<div class="radio-group">
										<label class="label" for="radio-b9">
											<input type="checkbox" id="radio-b9" name="insurance9" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
										<label class="label" for="radio-b10">
											<input type="checkbox" id="radio-b10" name="insurance10" class="radio-h">
											<span class="circle-radio">
												<em class="hook"></em>
											</span>
											<span>不计免赔</span>
										</label>
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
							<div class="buy">2017-12-30</div>
						</li>
						<li class="item">
							<div class="name">交强险</div>
							<div class="buy">2017-12-30</div>
						</li>
					</ul>
				</div>
				<div class="btn">开始报价</div>
			</div>
  	</div>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>