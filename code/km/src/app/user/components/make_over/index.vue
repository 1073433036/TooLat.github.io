<template>
  <div class="make_over">
    <app-header title="积分转让">
			<div class="slot" slot="right">
				<span class="right" v-if="$route.path == '/user/make_over'">
					<router-link :to="{ name: 'user.MakeOverRecord' }">转让记录</router-link>
				</span>
			</div>
    </app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="main">
						<ul class="item">
							<li class="list">
								<div class="course">
									<i class="sp sp-integral"></i>
									<span class="info">当前积分：</span>
									<div class="number">{{ formTemp.info.integral }}</div>
								</div>
							</li>
							<li class="list">
								<div class="course">
									<i class="sp sp-make-over-02"></i>
									<span class="info">转让积分：</span>
									<div class="number">
										<input type="text"
                      v-model.trim="formData.integral"
                      placeholder="请输入你要转让的积分数">
									</div>
								</div>
							</li>
							<li class="list">
								<div class="course">
									<i class="sp sp-custodian"></i>
									<span class="info">受让人：</span>
									<div class="number">
										<input type="text"
                      v-model.trim="formData.to_user_id"
                      placeholder="请输入受让人手机号码">
									</div>
								</div>
							</li>
							<!-- <li class="list">
                <div class="course">
                  <i class="sp sp-code"></i>
                  <span class="info">验证码：</span>
                  <div class="number">
                    <input type="text" placeholder="请输入验证码">
                  </div>
                  <div class="code">
                    <router-link :to="{}">验证码</router-link>
                  </div>
                </div>
              </li> -->
          	</ul>
            <div class="submit">
              <a href="javascript:" @click="submit">确认</a>
            </div>
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