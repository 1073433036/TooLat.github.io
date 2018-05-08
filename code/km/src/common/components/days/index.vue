<template>
  <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
    <div class="days-page" v-show="show">
      <div class="layer">
        <div class="inner">
          <div class="head">
            <div class="left">
              <span v-on:click.prevent="dismiss()">取消</span>
            </div>
            <div class="title">设置日期</div>
            <div class="right">
              <a class="item" :class="getSelectClass()" v-on:click.prevent="handelSelectChange()"><i class="circle"></i><span>全选</span>/<span>反选</span></a>
            </div>
          </div>

          <div class="body" ref="body">
            <div class="month" v-for="(month, index) in date">
              <div>{{ index }}月</div>
              <ul class="list">
                <li v-for="item in month"
                    :data-day="item.key"
                    v-on:click="handelDayClick($event, item.key)"
                    class="item">{{ item.name}}日
                </li>
              </ul>
            </div>
          </div>
          <a class="btn ok" v-on:click.prevent="submit()">确定</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
