<template lang="pug">
main#typh-download(v-drag="{handle: '.draggable'}")
    header.draggable
      h1 台风gif下载
      span(@click="toggleTyphDownloadPopup_global(false)")
        svg(width="8" height="8")
          path(d="M 0,0 L 8,8 M 8,0 L 0,8" stroke="white" stroke-width="1px")
    section.option-wraper.cf
      div
        a 经度(左)
        input(typh="number" v-model="left"
          v-bind:class="{'error-box': !isLeftComplete}"
          @focus="clearErrorBox('isLeftComplete')")  
      div
        a 经度(右)
        input(typh="number" v-model="right"
          v-bind:class="{'error-box': !isRightComplete}"
          @focus="clearErrorBox('isRightComplete')")
      div
        a 纬度(上)
        input(typh="number" v-model="top" 
          v-bind:class="{'error-box': !isTopComplete}"
          @focus="clearErrorBox('isTopComplete')")
      div
        a 纬度(下)
        input(typh="number" v-model="bottom" 
          v-bind:class="{'error-box': !isBottomComplete}"
          @focus="clearErrorBox('isBottomComplete')")
      div
        a 帧率(ms)
        input(typh="number" v-model="factor")
      div
        span(@click="submit") 生成gif
    section.result-panel.cf
      span.result-indicator(:style="{color: success ? '#1bad3a' : '#FF7070'}") {{genText}}
      div.preview(:class="{'befor-gen-btn': !isGenerated}" @click="downloadGif") 下载gif
      div.download-btn(:class="{'befor-gen-btn': !isGenerated}" @click="previewGif") 预览
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const modelRegion = {
  left: 97.4,
  right: 128.84,
  top: 33.76,
  bottom: 11.2
}
export default {
  data() {
    return {
      isGenerated: false,
      genText: '',
      genTextInterval: null,
      beforeGen: true,
      top: 33.76,
      isTopComplete: true,
      bottom: 11.2,
      isBottomComplete: true,
      left: 97.4,
      isLeftComplete: true,
      right: 128.84,
      isRightComplete: true,
      factor: 41,
      optionTipDisplay: false,
      success: false
    }
  },
  computed: {
    ...mapGetters([
      'dateTime'
    ])

  },
  methods: {
    ...mapActions([
      'toggleTyphDownloadPopup_global'
    ]),
    submit() {
      if (!this.optionValidating()) return

      this.genText = '生成中.....'
      let count = 5
      this.genTextInterval = setInterval(() => {
        console.log('heheh')
        let text = ''
        if (count == 5)
          count = 1

        for (let i = 0; i < count; i++) {
          text += '.'
        }

        count++
        this.genText = '生成中' + text
      }, 800)
      let params = {
        datetime: this.dateTime.Format('yyyyMMddHHmm00'),
        left: this.left,
        right: this.right,
        top: this.top,
        bottom: this.bottom,
        gifDelay: this.factor
      }
      this.$http.jsonp('http://10.148.83.228:1995/JmDcs/stormTide/createGif', { params })
        .then(res => {
          clearInterval(this.genTextInterval)
        })
        .catch(() => {
          clearInterval(this.genTextInterval)
          this.genText = '生成失败'
          this.success = false
        })
    },
    optionValidating() {
      let validateting = []

      if (this.top != '' && this.top <= modelRegion.top) {
        validateting.push(1)
      } else {
        this.isTopComplete = false
      }

      if (this.bottom != '' && this.bottom >= modelRegion.bottom) {
        validateting.push(1)
      } else {
        this.isBottomComplete = false
      }

      if (this.left != '' && this.left >= modelRegion.left) {
        validateting.push(1)
      } else {
        this.isLeftComplete = false
      }

      if (this.right != '' && this.right <= modelRegion.right) {
        validateting.push(1)
      } else {
        this.isRightComplete = false
      }

      if (validateting.length == 4) return true

      this.displayErrorMsg = true
      return false
    },
    clearErrorBox(target) {
      this[target] = true
    },
    previewGif() {
      // if (this.success !== true) return
      console.info('preview gif!')
      let background = document.createElement('div'),
        img = document.createElement('img')

      background.addEventListener('click', closePreviewGifPanel)

      background.classList = 'preview-gif'
      background.appendChild(img)
      img.src = 'http://10.148.83.228:1995/JmDcs/stormTide/getGif'

      document.body.appendChild(background)

      function closePreviewGifPanel() {
        let target = document.querySelector('.preview-gif')
        target.parentNode.removeChild(target)
      }
    },
    downloadGif() {
      // if (this.success !== true) return
      let aLink = document.createElement('a')
      aLink.download = '风暴潮演示.gif'
      aLink.href = 'http://10.148.83.228:1995/JmDcs/stormTide/getGif'
      aLink.click()
    }
  }

}
</script>

<style lang="scss" scoped>
main#typh-download {
  top: 0px;
  position: absolute;
  left: 290px;
  width: 280px;
  header {
    cursor: move;
    border-radius: 4px 4px 0 0;
    position: relative;
    height: 30px;
    background-color: #263B5C;
    h1 {
      font-size: 12px;
      color: white;
      line-height: 30px;
      padding-left: 10px;
      margin: 0;
      letter-spacing: 1px;
    }
    span {
      cursor: pointer;
      border-top-right-radius: 4px;
      width: 30px;
      height: 30px;
      display: block;
      position: absolute;
      right: 0px;
      top: 0px;
      &:hover {
        background-color: #1c3252;
      }
      svg {
        padding: 11px;
      }
    }
  }
}

section.option-wraper {
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 10px 10px 10px;
  div {
    float: left;
    margin-top: 20px;
    &:nth-child(even) {
      margin-left: 20px;
    }
    a {
      display: block;
      color: #546a90;
      font-weight: bold;
      font-size: 12px;
    }
    input {
      padding-left: 10px;
      width: 120px;
      height: 24px;
      margin-top: 10px;
      box-sizing: border-box;
      border: solid 1px #d7d7d7;
      border-radius: 4px;
    }
    span {
      height: 30px;
      width: 80px;
      color: #299dff;
      box-sizing: border-box;
      text-align: center;
      line-height: 29px;
      border-radius: 4px;
      border: solid 1px #4cafff;
      margin: 20px 0 0 40px;
      display: block;
      cursor: pointer;
      &:hover {
        background-color: #4cafff;
        color: white;
      }
    }
  }
}

section.result-panel {
  background-color: #fff;
  border-top: solid 1px #d7d7d7;
  border-radius: 0 0 4px 4px;
  padding: 10px;
  span {
    float: left;
    font-size: 12px;
    margin-top: 9px;
  }
  div {
    float: right;
    font-size: 12px;
    color: #299dff;
    height: 30px;
    margin-left: 10px;
    cursor: pointer;
  }
  div.preview {
    width: 80px;
    text-align: center;
    line-height: 29px;
    box-sizing: border-box;
    border: solid 1px #4cafff;
    border-radius: 4px;
    &:hover {
      background-color: #4cafff;
      color: white;
    }
  }
  div.download-btn {
    margin-top: 8px;
    height: 12px;
    text-decoration: underline;
  }
}

.befor-gen-btn {
  color: #b3b3b3 !important;
  border-color: #d7d7d7 !important;
  background-color: #fff !important;
}

.error-msg {
  padding: 0 10px;
  background-color: #fff;
  border-radius: 0 0 4px;
}
</style>
<style lang="scss">
div.preview-gif {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, .4);
  z-index: 999;
  img {
    width: 80%;
    height: 80%;
    margin: 5% 10%;
  }
  span {
    position: absolute;
    display: block;
    top: 20px;
    right: 20px;
    color: wheat;
    font-size: 26px;
    cursor: pointer;
  }
}
</style>