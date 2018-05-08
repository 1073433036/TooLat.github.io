<template>
  <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
    <div class="everyday-total" :value="value" v-show="visible">
      <div class="header">
        <a href="javascript:" class="back" @click="cancel"></a>
        <div class="nav-group">
          <div class="nav-item" :class="{ active: 0 === day }" v-on:click="handleClick(0)">每日业绩</div>
          <!-- <div class="nav-item" :class="{ active: 7 === day }" v-on:click="handleClick(7)">七日业绩</div> -->
        </div>
      </div>
      <scroller>
        <div class="body">
          <div class="count">
            <ul class="list">
              <li class="item">
                <i class="sp sp-count-01"></i>
                <div class="info">
                  <h2 class="name">当日新增锁粉人数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.new }}人</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-02"></i>
                <div class="info">
                  <h2 class="name">当日新增高级会员人数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.new_gjhy }}人</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-02"></i>
                <div class="info">
                  <h2 class="name">当日新增保险专员人数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.new_zy }}人</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-02"></i>
                <div class="info">
                  <h2 class="name">当日新增保险经理人人数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.new_jl }}人</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-03"></i>
                <div class="info">
                  <h2 class="name">当日申请张数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.card }}张</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-03"></i>
                <div class="info">
                  <h2 class="name">当日车险办理单数</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.cx }}单</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-04"></i>
                <div class="info">
                  <h2 class="name">当日团队无卡支付金额</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.wkzf }}元</span>
                </div>
              </li>

              <li class="item">
                <i class="sp sp-count-05"></i>
                <div class="info">
                  <h2 class="name">当日智能养卡金额</h2>
                </div>
                <div class="right">
                  <span>{{ formTemp.list.znyk }}元</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </scroller>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>