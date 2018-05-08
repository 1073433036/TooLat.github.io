<template>
  <div class="moneycode-page">
    <app-header title="收款码"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="container">
          <div class="box wechat">
            <div class="title">微信扫一扫，向我付款</div>
            <div class="text">付款二维码只在生成后的24小时内有效，同一个付款码不可重复使用，记得及时付款哦！</div>
            <div class="code">
              <div class="image">
                <img src="~assets/images/pay-code.png" alt="">
              </div>
            </div>
            <div class="money">￥10.00</div>
            <a href="/assets/images/pay-code.c7e9b978.png" download="/assets/images/pay-code.png" class="save">保存图片</a>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>