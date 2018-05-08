<template>
  <div class="simulate1-page">
    <app-header title="测试办卡">
			<div class="slot" slot="right" v-if=" $route.path == '/simulate/1' ">
        <router-link :to="{ name: 'home.NewbieGuide' }">
          <span class="icon">
            <i class="sp sp-query"></i>
            <span>新手指南</span>
          </span>
        </router-link>
      </div>
		</app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <div class="banner">
            <img src="~assets/images/simulate-banner.jpg">
          </div>
					<div class="tip">
						<i class="icon icon-horn"></i>
						<div class="notice">
            	<div class="marquee">卡盟金服信贷流量服务平台：模拟办卡是结合2017年各大银行信用卡审批大数据，根据您的资质条件模拟评估。切莫相信中介收取前期包装下的大额卡。模拟结果仅供参考，一切以银行实际下卡为准！代理商--推荐客户办卡前可以测试一下，正确选择银行提高下卡率</div>
          	</div>
					</div>
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="block">
              <ul class="list">
                <li class="item">
                  <div class="left">
                    <span>姓名</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input vd-required
                        v-model="formData.name"
                        vd-notify='{
                          "text": "真实姓名不能为空"
                        }'
                        type="text"
                        class="width"
                        placeholder="请填写真实姓名">
                    </div>
                    <div class="tips">{{ formData.name | pinyin }}</div>
                  </div>
                </li>

                <li class="item">
                  <div class="left">
                    <span>性别</span>
                  </div>
                  <div class="right">
                    <div class="input radio">
                      <Radio v-model="formData.sex" :dataList="formTemp.sex"></Radio>
                      <input vd-required
                        v-model="formData.sex"
                        vd-notify='{
                          "text": "请选择性别"
                        }'
                        type="text"
                        class="width"
                        placeholder="请选择性别">
                    </div>
                  </div>
                </li>

                <li class="item">
                  <div class="left">
                    <span>出生年月日</span>
                  </div>
                  <div class="right">
                    <div class="input" v-on:click="handleDateChange('birthday')">
                      <input vd-required
                        vd-validate
                        vd-type="date"
                        v-model="formData.birthday"
                        vd-notify='{
                          "text": "请选择出生年月日",
                          "patt": "出生年月日格式不正确"
                        }'
                        type="text"
                        class="right"
                        readonly
                        placeholder="请选择">
                    </div>
                    <i class="sp sp-right"></i>
                  </div>
                </li>

                <li class="item">
                  <div class="left">
                    <span>身份证号</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input v-show="0 !== formData.id_card_valid" v-model="formData.id_card_valid"
                        type="text"
                        class="width"
                        :disabled="formData.validity"
                        :placeholder="!formData.validity ? '请填写' : ''">
                    </div>
                    <!-- <div class="btn-gourp">
                      <a class="btn-item"
                        :class="{ act: formData.validity }"
                        v-on:click="formData.validity = !formData.validity; formData.id_card_valid=''">长期有效</a>
                    </div> -->
                  </div>
                </li>

                <li class="item">
                  <div class="left">
                    <span>工作年限</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input vd-required
                        vd-validate
                        vd-type="integer"
                        v-model="formData.work_time"
                        vd-notify='{
                          "text": "请输入工作年限",
                          "patt": "工作年限格式不正确"
                        }'
                        type="text"
                        class="width w_80"
                        placeholder="请填写">
                    </div>
                    <div class="tips inherit">年</div>
                  </div>
                </li>

                <li class="item">
                  <div class="left">
                    <span>现住址</span>
                  </div>
                  <div class="right">
                    <div class="select-group">
                      <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'prov' })">
                        <span>{{ formData.prov.region_name || '请选择省' }}</span>
                        <i class="sp sp-right"></i>
                      </div>
                      <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'city' })">
                        <span>{{ formData.city.region_name || '请选择市' }}</span>
                        <i class="sp sp-right"></i>
                      </div>
                     <!--  <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'area' })">
                        <span>{{ formData.area.region_name }}</span>
                        <i class="sp sp-right"></i>
                      </div> -->
                    </div>
                    <div class="input">
                      <input type="text" v-model="formData.address" placeholder="请填写详细地址,如：xx路xx街道xx号">
                    </div>
                  </div>
                </li>

              </ul>
            </div>

            <div class="block">
              <ul class="list">
                <li class="item wrap">
                  <div class="left">
                    <span>婚姻状况</span>
                  </div>
                  <div class="right">
                    <div class="btn-gourp">
                      <a v-for="(item, index) in formTemp.marriage"
                        :key="index"
                        :class="{ act: item.value === formData.marriage }"
                        class="btn-item"
                        v-on:click="formData.marriage = item.value">{{ item.name }}</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="block">
              <ul class="list">
                <li class="item wrap">
                  <div class="left">
                    <span>教育程度</span>
                  </div>
                  <div class="right">
                    <div class="btn-gourp">
                      <a v-for="(item, index) in formTemp.educationa"
                        :key="index"
                        :class="{ act: item.value === formData.educationa }"
                        class="btn-item"
                        v-on:click="formData.educationa = item.value">{{ item.name }}</a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div class="block">
              <ul class="list">
                <li class="item wrap">
                  <div class="left">
                    <span>住宅状况</span>
                  </div>
                  <div class="right">
                    <div class="btn-gourp">
                      <a v-for="(item, index) in formTemp.house"
                        :key="index"
                        :class="{ act: item.value === formData.house }"
                        class="btn-item"
                        v-on:click="formData.house = item.value">{{ item.name }}</a>
                    </div>
                  </div>
                </li>

                <li v-show="1 === formData.house || 2 === formData.house" class="item">
                  <div class="left">
                    <span>房产估值</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input type="text" v-model="formData.house_money" class="width" placeholder="请输入数值">
                    </div>
                    <div class="tips">万</div>
                  </div>
                </li>

                <li v-show="1 === formData.house || 2 === formData.house" class="item">
                  <div class="left">
                    <span>购房时限</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input type="text" v-model="formData.house_time" class="width" placeholder="请输入数值">
                    </div>
                    <div class="tips">月</div>
                  </div>
                </li>

              </ul>
            </div>

            <div class="block">
              <ul class="list">
                <li class="item wrap">
                  <div class="left">
                    <span>车辆信息</span>
                  </div>
                  <div class="right">
                    <div class="btn-gourp">
                      <a v-for="(item, index) in formTemp.car"
                        :key="index"
                        :class="{ act: item.value === formData.car }"
                        class="btn-item"
                        v-on:click="formData.car = item.value">{{ item.name }}</a>
                    </div>
                  </div>
                </li>

                <li v-show="1 === formData.car || 2 === formData.car" class="item">
                  <div class="left">
                    <span>车辆估值</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input type="text" v-model="formData.car_money" class="width" placeholder="请输入数值">
                    </div>
                    <div class="tips">万</div>
                  </div>
                </li>

                <li v-show="1 === formData.car || 2 === formData.car" class="item">
                  <div class="left">
                    <span>购车时限</span>
                  </div>
                  <div class="right">
                    <div class="input">
                      <input type="text" v-model="formData.car_time" class="width" placeholder="请输入数值">
                    </div>
                    <div class="tips">月</div>
                  </div>
                </li>

              </ul>
            </div>

            <div class="button-item">
              <button type="submit" class="btn">下一步</button>
            </div>

          </form>

        </div>
      </div>
    </scroller>

    <Selecter v-on:itemClick="dismiss" :change="prov">
      <ul class="list">
        <li v-for="(item, index) in formTemp.address" class="item" v-on:click="handelClick(item)">{{ item.region_name }}</li>
      </ul>
    </Selecter>

    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="false"></Dates>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
