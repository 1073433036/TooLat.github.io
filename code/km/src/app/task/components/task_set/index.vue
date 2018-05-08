<template>
  <div class="task-set-page">
    <app-header title="设置推送"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
              <ul class="list custom">

                <li class="item">
                  <a v-on:click="handleCityShowChange()">
                    <div class="left">
                      <span>所在城市</span>
                    </div>
                    <div class="right">
                      <span>{{ city.region_name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBotSelectChange('money')">
                    <div class="left">
                      <span>贷款额度</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.money.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBotSelectChange('loanterm')">
                    <div class="left">
                      <span>贷款期限</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.loanterm.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBombBoxChange('wages')">
                    <div class="left">
                      <span>工资发放形式</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.wages.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBombBoxChange('loanType')">
                    <div class="left">
                      <span>贷款方式</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.loanType.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBombBoxChange('social')">
                    <div class="left">
                      <span>社保缴纳要求</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.social.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>

                <li class="item">
                  <a v-on:click="handleBombBoxChange('gjj')">
                    <div class="left">
                      <span>公积金要求</span>
                    </div>
                    <div class="right">
                      <span>{{ formData.gjj.name }}</span>
                    </div>
                    <i class="sp sp-right"></i>
                  </a>
                </li>
              </ul>

              <div class="btn">
                <button @click="save()">保存</button>
              </div>
        </div>
      </div>
    </scroller>

    <CityList></CityList>
    <BotSelect v-on:onChildClick="botSelectClick"
      :title="botTitle"
      :show="isShow"
      :formData="formTemp[formIndex]"
      :formIndex="formIndex"></BotSelect>

    <BombBox v-on:bombClick="handleBomb" :show="bombShow" :formData="formTemp[formIndex]" :formIndex="formIndex"></BombBox>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>