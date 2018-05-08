<template>
  <div class="task-add-page">
    <app-header title="我要发布"></app-header>
    <div class="nav">
      <div class="inner">
        <div class="left">
          <i class="sp sp-horn"></i>
        </div>
        <div class="right">
          <p>请认真填写您的信息，上传的资料越多，可以更准确的为您匹对信贷经理，提高成功率。 带*号项目必填。</p>
        </div>
      </div>
    </div>
    <scroller>
      <div class="wrapper">
        <div class="controller">
          <form class="form-group" ref="form" @submit.prevent="handleSumbit">
            <div class="input-group">
              <div class="input-item">
                <i class="sp sp-task-name"></i>
                <span>姓名<em>*</em></span>
                <div class="right">
                  <input vd-required
                    v-model="formData.name"
                    type="text"
                    vd-notify='{
                      "text": "姓名不能为空",
                      "patt": "姓名格式不正确"
                    }'
                    placeholder="输入姓名">
                </div>
                <i class="sp sp-right"></i>
              </div>
              <div class="input-item">
                <i class="sp sp-task-unit"></i>
                <span>所在单位<em>*</em></span>
                <div class="right">
                  <input vd-required
                    v-model="formData.company"
                    type="text"
                    vd-notify='{
                      "text": "所在单位不能为空",
                      "patt": "所在单位格式不正确"
                    }'
                    placeholder="输入所在单位">
                </div>
                <i class="sp sp-right"></i>
              </div>
              <div class="input-item">
                <i class="sp sp-task-mobile"></i>
                <span>手机号码<em>*</em></span>
                <div class="right">
                  <input vd-required
                    vd-validate
                    vd-type="phone"
                    v-model="formData.phone"
                    type="text"
                    vd-notify='{
                      "text": "请输入11位手机号码",
                      "patt": "手机号码格式不正确"
                    }'
                    placeholder="请输入11位手机号码">
                </div>
                <i class="sp sp-right"></i>
              </div>
              <div class="input-item">
                <i class="sp sp-task-age"></i>
                <span>年龄<em>*</em></span>
                <div class="right">
                  <input vd-required
                    v-model="formData.age"
                    type="text"
                    vd-notify='{
                      "text": "年龄不能为空",
                      "patt": "年龄格式不正确"
                    }'
                    placeholder="输入年龄">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-money"></i>
                <span>贷款金额<em>*</em></span>
                <div class="right">
                  <input vd-required
                    v-model="formData.amount"
                    type="text"
                    vd-notify='{
                      "text": "贷款金额不能为空",
                      "patt": "贷款金额格式不正确"
                    }'
                    placeholder="输入贷款金额">
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBotSelectChange('repay_date_limit')">
                <i class="sp sp-task-time"></i>
                <span>还款期限<em>*</em></span>
                <div class="right">
                  <span>{{ formData.repay_date_limit.name || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

            </div>

            <div class="input-group">
              <div class="input-item">
                <i class="sp sp-task-marry"></i>
                <span>婚姻状况</span>
                <div class="right">
                  <Radio v-model="formData.is_marry" :dataList="formTemp.is_marry"></Radio>
                </div>
              </div>

              <div class="input-item" v-on:click="handleCityShowChange()">
                <i class="sp sp-task-city"></i>
                <span>所在城市</span>
                <div class="right">
                  <span>{{ city.region_name }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('company_type')">
                <i class="sp sp-task-nature"></i>
                <span>公司性质</span>
                <div class="right">
                  <span>{{ formData.company_type.name || '请选择'}}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-time"></i>
                <span>工作年限</span>
                <div class="right">
                  <input v-model="formData.work_age"
                    type="text"
                    placeholder="请输入工作年限">
                  </div>
                  <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-money"></i>
                <span>工资金额</span>
                <div class="right">
                  <input v-model="formData.salary"
                    type="text"
                    placeholder="请输入工资金额">
                  </div>
                  <i class="sp sp-right"></i>
              </div>

              <div class="input-item">
                <i class="sp sp-task-gjj"></i>
                <span>公积金年限</span>
                <div class="right">
                  <input v-model="formData.public_fund_age"
                    type="text"
                    placeholder="请输入公积金年限">
                  </div>
                  <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('ss_card')">
                <i class="sp sp-task-social"></i>
                <span>社保缴纳</span>
                <div class="right">
                  <span>{{ formData.ss_card.name || '请上传' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('salary_get_type')">
                <i class="sp sp-task-money-02"></i>
                <span>工资发放形式</span>
                <div class="right">
                  <span>{{ formData.salary_get_type.name || '请选择' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('driving_license')">
                <i class="sp sp-task-car"></i>
                <span>名下车产</span>
                <div class="right">
                  <span>{{ formData.driving_license.name || '请上传' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('family_assets')">
                <i class="sp sp-task-house"></i>
                <span>家庭房产</span>
                <div class="right">
                  <span>{{ formData.family_assets.name || '请上传' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <div class="input-item" v-on:click="handleBombBoxChange('public_bill')">
                <i class="sp sp-task-payment"></i>
                <span>公用事业缴费单</span>
                <div class="right">
                  <span>{{ formData.public_bill.name || '请上传' }}</span>
                </div>
                <i class="sp sp-right"></i>
              </div>

              <!-- <div class="input-item w280">
                <i class="sp sp-task-txl"></i>
                <span>近3个月的手机通讯录</span>
                <div class="right">
                  <input vd-required
                    v-model="formData.money"
                    type="text"
                    vd-notify='{
                      "text": "公用事业缴费单不能为空",
                      "patt": "公用事业缴费单格式不正确"
                    }'
                    placeholder="请上传">
                  </div>
                  <i class="sp sp-right"></i>
              </div> -->

            </div>

            <div class="button-item">
              <button type="submit" class="btn" :class="{ transit: active }" :disabled="!active">提交</button>
            </div>
          </form>
        </div>
      </div>
    </scroller>

    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex">

      <li v-show="'ss_card' === formIndex" class="item">
        有社保并上传社保卡
        <Cropper :imgShow="false" class="cropper-abs"></Cropper>
        <input type="file" class="upload" accept="image/*" @change="upload($event, '有社保并已上传社保卡')">
      </li>

      <li v-show="'driving_license' === formIndex" class="item">
        有车并上传行驶证
        <Cropper :imgShow="false" class="cropper-abs"></Cropper>
        <input type="file" class="upload" accept="image/*" @change="upload($event, '有车并已上传行驶证')">
      </li>

      <li v-show="'family_assets' === formIndex" class="item">
        有房并上传房产证
        <Cropper :imgShow="false" class="cropper-abs"></Cropper>
        <input type="file" class="upload" accept="image/*" @change="upload($event, '有房并已上传房产证')">
      </li>

      <li v-show="'public_bill' === formIndex" class="item">
        有公共事业缴费单并上传
        <Cropper :imgShow="false" class="cropper-abs"></Cropper>
        <input type="file" class="upload" accept="image/*" @change="upload($event, '有公共事业缴费单并已上传')">
      </li>

    </BombBox>


    <CityList></CityList>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>