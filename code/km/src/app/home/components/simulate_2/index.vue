<template>
  <div class="simulate2-page">
    <app-header title="测试办卡"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="controller">

          <div class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>职业</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.job"
                      :key="index"
                      :class="{ act: item.value === formData.job }"
                      class="btn-item"
                      v-on:click="formData.job = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>单位性质</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.company_nature"
                      :key="index"
                      :class="{ act: item.value === formData.company_nature }"
                      class="btn-item"
                      v-on:click="formData.company_nature = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item wrap">
                <div class="left">
                  <span>职务</span>
                </div>
                <div class="right">
                  <div class="btn-gourp">
                    <a v-for="(item, index) in formTemp.duties"
                      :key="index"
                      :class="{ act: item.value === formData.duties }"
                      class="btn-item"
                      v-on:click="formData.duties = item.value">{{ item.name }}</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="block">
            <ul class="list">
              <li class="item">
                <div class="left">
                  <span>单位名称</span>
                </div>
                <div class="right">
                  <div class="input">
                    <input type="text" v-model="formData.company_name" class="width" placeholder="请填写单位名称">
                  </div>
                </div>
              </li>

              <li class="item">
                <div class="left">
                  <span>单位地址</span>
                </div>
                <div class="right">
                  <div class="select-group">
                    <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'prov' })">
                      <span>{{ formData.companyProv.region_name }}</span>
                      <i class="sp sp-right"></i>
                    </div>
                    <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'city' })">
                      <span>{{ formData.companyCity.region_name }}</span>
                      <i class="sp sp-right"></i>
                    </div>
                    <div class="select-item" v-on:click="handleChangeAddres({ id: cityId, name: 'area' })">
                      <span>{{ formData.companyArea.region_name }}</span>
                      <i class="sp sp-right"></i>
                    </div>
                  </div>
                  <div class="input">
                    <input type="text" v-model="formData.company_address" placeholder="请填写详细地址，如：xx路xx街道xx号">
                  </div>
                </div>
              </li>

              <li class="item">
                <div class="left">
                  <span>就职时间</span>
                </div>
                <div class="right">
                  <div class="start">
                    <div class="input" v-on:click="handleDateChange('job_time')">
                      <input type="text" class="right" v-model="formData.job_time" readonly placeholder="请选择开始时间">
                    </div>
                    <i class="sp sp-right"></i>
                  </div>

                  <div class="end">
                    <div class="input" v-on:click="handleDateChange('job_time_end')">
                      <input type="text" class="right" v-model="formData.job_time_end" readonly placeholder="请选择结束时间">
                    </div>
                    <i class="sp sp-right"></i>
                  </div>
                </div>
              </li>

            </ul>
          </div>

          <div class="button-item">
            <button type="button" class="btn" v-on:click="handleSumbit()">下一步</button>
          </div>

        </div>
      </div>
    </scroller>

    <Selecter v-on:itemClick="dismiss" :change="prov">
      <ul class="list">
        <li v-for="(item, index) in formTemp.address" class="item" v-on:click="handelClick(item)">{{ item.region_name }}</li>
      </ul>
    </Selecter>

    <Dates v-on:onDateClick="handelDateClick" :show="isShow" :today="isToday"></Dates>

  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>