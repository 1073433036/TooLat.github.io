<template>
   <div class="apply-mask"  v-if="freeze" >
      <div class="inner"  v-if="freezes">
        <div class="head">
          <span>冻结提示</span>
          <i class="sp sp-close" v-on:click="freezes = false"></i>
        </div>
        <div class="body">
          <p>{{ freezesMsg }}</p>
        </div>
        <div class="foot">
          <div class="btn-group">
            <a class="btn-item close" v-on:click="freezes = false">确定</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        props: {
          freeze: {
            type: Boolean,
            default: false,
          },
          freezesMsg: {
            type: String,
            default: ''
          }
        },
        data(){
          return{
            freezes:true
          }
        },
    };
</script>

<style lang="scss" scoped>
  @import "~assets/styles/_bootstrap";
.FreezeDialog{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255,255,255,0.1);

}
.apply-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1003;

  &:before {
    position: fixed;
    display: block;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: ' ';
    background: rgba(0, 0, 0, .3);
    z-index: 999;
  }

  .inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: rem(640px);
    background: #fff;
    z-index: 999;
    border-radius: rem(10px);
    overflow: hidden;
    background: #fff;
    transform: translate(-50%, -50%);
    width: 80%;
    height: auto;

    .head {
      width: 100%;
      height: rem(100px);
      line-height: rem(100px);
      text-align: center;
      background: linear-gradient(to bottom, #f9f9f9, #e9e9e9);

      > span {
        font-size: rem(30px);
        color: #333;
      }

      > i {
        position: absolute;
        top: 0;
        bottom: 0;
        right: rem(30px);
        margin: auto 0;
      }
    }

    .body {
      padding: rem(45px);

      > p {
        font-size: rem(24px);
        line-height: rem(50px);
      }
    }

    .foot {
      padding-bottom: rem(40px);

      .btn-group {
        text-align: center;

        .btn-item {
          display: inline-block;
          margin: 0 rem(20px);
          width: rem(238px);
          height: rem(64px);
          text-indent: -9999px;

          &.close {
            background: url('~assets/images/card-apply-btn-colse.jpg') no-repeat;
            background-size: 100%;
          }

          &.ok {
            background: url('~assets/images/card-apply-btn-ok.jpg') no-repeat;
            background-size: 100%;
          }
        }

      }
    }
  }

}

</style>
