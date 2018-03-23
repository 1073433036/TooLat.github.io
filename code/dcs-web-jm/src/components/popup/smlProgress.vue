<template lang="pug">
main#smlProgress
  ul(v-for="(el, index) in progressStepData"
    v-bind:class="[(progressingStep === index && failedStep !== index) ? 'progressing' : '' , (progressingStep < index && failedStep !== index) ? 'pre-progress' : '', progressingStep > index ? 'progressed' : '', failedStep === index ? 'failed-step' : '']")
    li
      em
      a(v-text="progressingStep === index ? (failedStep === index ? el.error : el.progressing) : (progressingStep > index ? el.sucs : el.waiting)")
      li(v-if="!(index == 3)")

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      progressStepData: [
        {
          waiting: '等待提交',
          progressing: '等待提交',
          error: null,
          sucs: '等待提交'
        },
        {
          waiting: '上传提交',
          progressing: '正在提交',
          error: '提交失败',
          sucs: '提交成功'
        },
        {
          waiting: '模型计算',
          progressing: '正在计算',
          error: '计算失败',
          sucs: '计算成功'
        },
        {
          waiting: '结果反馈',
          progressing: '计算结果',
          error: '计算失败',
          sucs: '影响城镇'
        }
      ]
    }
  },
  props: ['progressingStep', 'failedStep']
}
</script>

<style lang="scss">
main#smlProgress {
  width: 120px;
  float: left;
  background-color: #fff;
  height: 450px;
  padding: 20px 0;
  border-bottom-left-radius: 4px;
  >ul {
    text-align: center;
    li:nth-child(1) {
      box-sizing: border-box;
      border-radius: 50%;
      border-width: 2px;
      border-style: solid;
      height: 70px;
      width: 70px;
      margin: 0 20px;
      text-align: center;
      position: relative;
      a {
        line-height: 66px;
        height: 66px;
        display: block;
      }
      em {
        position: absolute;
        top: -3px;
        left: -3px;
        width: 74px;
        height: 74px;
      }
    }
    li:nth-child(2) {
      margin: 18px 0;
      height: 20px;
      width: 3px;
      transform: translateX(53.5px);
      background-color: #eeeeee;
    }
  }
}

.pre-progress {
  li:nth-child(1) {
    border-color: #eeeeee;
    a {
      color: #cbcbcb;
    }
  }
}

.progressing {
  li:nth-child(1) {
    border-color: #eeeeee;
  }
  a {
    color: #cbcbcb;
  }
  em {
    background-image: url('../../assets/smlLoading.png');
    background-repeat: no-repeat;
    background-position: center center;
    animation: loading 1.5s infinite linear;
  }
}

.progressed {
  li:nth-child(1) {
    border-color: #c9e7ff;
    a {
      color: #299dff;
    }
  }
  li:nth-child(2) {
    background-color: #299dff !important;
  }
}

.failed-step {
  li:nth-child(1) {
    border-color: #ff9c9c;
    a {
      color: #ff9c9c;
    }
  }
}

@keyframes loading {
  from {
    transform: rotateZ(0deg)
  }
  to {
    transform: rotateZ(360deg)
  }
}
</style>
