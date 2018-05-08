<template>
  <div class="card_insurance">
    <app-header title="保险公司">
    </app-header>
      <scroller ref="my_scroller"
        :on-refresh="refresh">
        <div class="wrapper">
          <div class="controller">
            <div class="main">
								<ul class="item">
									<li class="list">
										<div class="logo"><img src="~assets/images/yc.png" alt=""></div>
										<div class="name">永诚财险</div>
										<div class="select">
											<label class="radio">
												<span class="radio-inner"></span>
												<input type="radio" class="radio-input">
												<span class="sta">否</span>
											</label>
											<!-- <label class="radio radio-checked"> -->
												<!-- <div class="radio-group">
													<input type="radio" id="radio-h1" name="housenum1" class="radio-h">
													<span class="circle-radio">
														<em class="hook"></em>
													</span>
												</div> -->
											<!-- </label> -->
										</div>
									</li>
									<li class="list">
										<div class="logo"><img src="~assets/images/pa.png" alt=""></div>
										<div class="name">平安财险</div>
										<div class="select">
											<div class="radio-group">
                    <input type="radio" id="radio-h2" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                  </div>
										</div>
									</li>
									<li class="list">
										<div class="logo"><img src="~assets/images/zj.png" alt=""></div>
										<div class="name">紫金财险</div>
										<div class="select">
											<div class="radio-group">
                    <input type="radio" id="radio-h3" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                  </div>
										</div>
									</li>
									<li class="list">
										<div class="logo"><img src="~assets/images/ta.png" alt=""></div>
										<div class="name">天安财险</div>
										<div class="select">
											<div class="radio-group">
                    <input type="radio" id="radio-h4" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                  </div>
										</div>
									</li>
									<li class="list">
										<div class="logo"><img src="~assets/images/yc.png" alt=""></div>
										<div class="name">天安财险</div>
										<div class="select">
											<div class="radio-group">
                    <input type="radio" id="radio-h5" name="housenum1" class="radio-h">
                    <span class="circle-radio">
                      <em class="hook"></em>
                    </span>
                  </div>
										</div>
									</li>
              	</ul>
								<div class="btn active">确认</div>
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