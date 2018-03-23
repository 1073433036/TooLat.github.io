<template>
  <main id="MessageMonitor">
    <div class="info cf">
      <div class="text">部门单位</div>
      <div class="val">
        <select v-model="depSelect">
          <option value="all">请选择</option>
          <option v-for="el in depsList" :key="el.id" :value="el.id">{{ el.id }}</option>
        </select>
      </div>
    </div>

    <!-- <div class="info cf">
      <div class="text">选择分类</div>
      <div class="val">
        <select v-model="classSelect">
          <option value="all">请选择</option>
          <option v-for="el in classList" :key="el.id" :value="el.id">{{ el.id }}</option>
        </select>
      </div>
    </div> -->

    <div class="info cf">
      <div class="text">模糊搜索</div>
      <div class="val">
        <div class="query">
          <select class="min" v-model="queryType">
            <option value="name">人名</option>
            <option value="label">标签</option>
          </select>
          <input v-model="queryString" type="text">
        </div>
      </div>
    </div>
    <div class="primary-btn" @click="search">搜索</div>

    <div class="search-panel" v-if="isSearchPanelOn">
      <div class="header">
        <span class="result">搜索结果</span>
        <span class="send" @click="massText">群发短信</span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th><i></i>姓名</th>
              <th>手机号码</th>
              <th>部门</th>
              <th>分类</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="el in smsLists" :key="el.key">
              <td><i></i>{{ el.name }}</td>
              <td>{{ el.phone }}</td>
              <td>{{ el.department }}</td>
              <td>{{ el.category }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div class="bottom cf">
        <div class="btn-wrapper cf">
          <div :class="['prev', {enabled: currentPage !== 1,disabled: currentPage === 1}]"
              :title="currentPage === 1 ? '已是第一页' : '上一页'"
              @click="changePage('prev')"></div>
          <div :class="['next', {enabled: !isLastPage,disabled: isLastPage}]"
              :title="isLastPage ? '已是最后一页' : '下一页'"
              @click="changePage('next')"></div>
        </div>
        <span class="page">{{ startIndex + ' - ' + lastIndex + ' of ' + showInfo.length }}</span>
      </div> -->
    </div>

    <!-- <div class="history-panel decision-popup" v-if="isHistoryPanelOn" v-drag>
      <header>
        <span>历史信息</span>
        <a @click="isHistoryPanelOn = false"></a>
      </header>
      <div class="content">
        <div class="user">肖彦祖 13511112222</div>
        <div class="tabs">
          <div class="classify" @mouseenter="isClassifyPanelOn = true"
              @mouseleave="isClassifyPanelOn = false">
            <span>分类</span>
            <div class="inner-popup" v-if="isClassifyPanelOn">
              <ul>
                <li :class="{on: classifySelected === 'accept'}"
                    @click="toggleClassify('accept')">接收消息</li>
                <li :class="{on: classifySelected === 'send'}"
                    @click="toggleClassify('send')">发送消息</li>
                <li :class="{on: classifySelected === 'all'}"
                    @click="toggleClassify('all')">同时显示</li>
              </ul>
            </div>
          </div>
          <div class="sort">
            <span>排序</span>
            <i class="up"></i>
            <i class="down"></i>
          </div>
        </div>
        <div class="msg-wrapper scroll-bar">
          <ul>
            <li v-for="(el, index) in historyMessage" :key="index">
              <div :class="['head', {on: el.selected}]" @click="el.selected = !el.selected">
                <span class="name">{{ el.name }}</span>
                <span class="time">{{ el.time }}</span>
                <i :class="{on: el.selected}"></i>
              </div>
              <div class="info" v-show="el.selected">{{ el.msg }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div> -->

    <div class="send-panel decision-popup" v-if="isSendMsgPanelOn" v-drag>
      <header>
        <span>发送消息</span>
        <a @click="isSendMsgPanelOn = false"></a>
      </header>
      <div class="content">
        <div class="accept">
          接收人：<span class="user">{{ '1;2' }}</span>
        </div>
        <textarea v-model="messageString" placeholder="请输入发布内容"></textarea>
        <div class="primary-btn" @click="searchMsg">发送</div>
      </div>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class MessageMonitor extends Vue {
    @Getter('systemStore/userInfo_global') userInfoGlobal   // this.userInfoGlobal.nick
    depSelect: string = 'all'
    depsList: any[] = []
    classSelect: string = 'all'
    classList: any[] = []
    queryType: string = 'name'
    queryString: string = ''
    isSearchPanelOn: boolean = true
    smsLists: any[] = [
      { id: 0, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 1, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 2, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 3, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 4, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 5, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 6, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 7, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 8, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 9, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 10, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 11, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 12, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
      { id: 13, phone: '18316022606', name: '周海清', department: '镇政府', category: '渔船回港管理' },
    ]

    isHistoryPanelOn: boolean = true
    isClassifyPanelOn: boolean = false
    classifySelected: 'accept' | 'send' | 'all' = 'all'
    historyMessage: any[] = [
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动', selected: true },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
      { name: '平台发送', time: '2017-11-09 15:41', msg: '预案启动预案启动',selected: false },
    ]

    isSendMsgPanelOn: boolean = false
    messageString: string = ''

    search() {
      this.isSearchPanelOn = true
    }

    massText() {
      this.isSendMsgPanelOn = true
    }

    // 历史信息
    toggleClassify(type: 'accept' | 'send' | 'all') {
      this.classifySelected = type
      this.isClassifyPanelOn = false
    }

    // 发送消息
    searchMsg() {
      if (!this.messageString) {
        Vue['prototype']['$message']({ type: 'warning', message: '请输入发布内容' })
        return
      }
      let res
      if (res)
        Vue['prototype']['$message']({ type: 'error', message: '发布成功' })
      else
        Vue['prototype']['$message']({ type: 'success', message: '发布失败' })
    }
  }
</script>

<style lang='scss' scoped>
@import '../../../../styles/theme.scss';
#MessageMonitor {
  >.info {
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    >.text {
      float: left;
      width: 23%;
    }
    >.val {
      float: left;
      width: 77%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .red { color: #f00; }
      >select {
        box-sizing: border-box;
        padding-left: 10px;
        width: 210px;
        height: 30px;
        color: #666;
        font-size: 12px;
        background: #f5f5f5;
        border: none;
        outline: none;
      }
      >.query {
        position: relative;
        width: 210px;
        height: 30px;
        select.min {
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          padding-left: 2px;
          width: 70px;
          height: 30px;
          color: #666;
          font-size: 12px;
          background: #f5f5f5;
          border: 1px solid #ccc;
          border-right: none;
          outline: none;
        }
        input[type="text"] {
          position: absolute;
          top: 0;
          left: 70px;
          box-sizing: border-box;
          width: 140px;
          height: 30px;
          padding: 0 10px;
          border: 1px solid #ccc;
          border-left: none;
        }
      }
    }
  }
  >.primary-btn {
    margin: 10px 130px 0;
  }
  .history-panel {
    position: absolute;
    left: 390px;
    top: 0;
    width: 300px;
    .content {
      padding: 10px;
      .user {
        font-weight: bold;
      }
      .tabs {
        position: relative;
        height: 30px;
        line-height: 30px;
        .classify {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 100%;
          cursor: pointer;
          span {
            color: $themeColor;
          }
          &::after {
            position: absolute;
            top: 10px;
            left: 60px;
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 6px solid #aaa;
          }
          .inner-popup {
            z-index: 1;
            position: absolute;
            top: 24px;
            left: 0;
            width: 80px;
            box-sizing: border-box;
            background: #fff;
            border: 1px solid #bbb;
            ul {
              li {
                height: 24px;
                line-height: 24px;
                text-align: center;
                &.on, &:hover {
                  background: $themeColor;
                  color: #fff;
                }
              }
            }
          }
        }
        .sort {
          position: absolute;
          top: 0;
          left: 120px;
          width: 60px;
          height: 100%;
          span {
            color: $themeColor;
          }
          i {
            position: absolute;
            left: 44px;
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            cursor: pointer;
          }
          i.up {
            top: 7px;
            border-bottom: 6px solid #aaa;
            &:hover { border-bottom: 6px solid $themeColor; }
          }
          i.down {
            top: 17px;
            border-top: 6px solid #aaa;
            &:hover { border-top: 6px solid $themeColor; }
          }
        }
      }
      .msg-wrapper {
        max-height: 300px;
        overflow: auto;
        ul {
          li {
            .head {
              position: relative;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              border-bottom: 1px solid #ccc;
              &.on { border-bottom: 1px solid #fff; }
              .name {
                position: absolute;
                top: 0;
                left: 0;
              }
              .time {
                position: absolute;
                top: 0;
                left: 120px;
              }
              i {
                position: absolute;
                top: 10px;
                right: 7px;
                display: inline-block;
                width: 6px;
                height: 9px;
                transform: rotate(-90deg);
                background: url(~Img/DecisionCommand/extend.png) no-repeat calc(200% / 3) 0 / 400% 100%;
                &.on {
                  background: url(~Img/DecisionCommand/extend.png) no-repeat 0 0 / 400% 100%;
                }
              }
            }
            .info {
              padding: 5px;
              background: #f2f2f2;
            }
            &:last-child .head { border-bottom: 1px solid #fff; }
          }
        }
      }
    }
  }
  .send-panel {
    position: absolute;
    left: -310px;
    top: 0;
    width: 300px;
    .content {
      padding: 10px;
      .accept {
        line-height: 22px;
        .user { color: $themeColor; }
      }
      textarea {
        margin-top: 10px;
        box-sizing: border-box;
        padding: 10px 15px;
        width: 100%;
        height: 100px;
        color: #777;
        border-color: #d8dce5;
      }
      >.primary-btn {
        margin: 10px 105px 0;
      }
    }
  }
}


#MessageMonitor {
  .search-panel {
    margin-top: 10px;
    padding: 5px 10px;
    background: #f5f5f5;
    .header {
      height: 24px;
      line-height: 24px;
      .result {
        font-weight: bold;
      }
      .send {
        float: right;
        color: $themeColor;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .table-wrapper {
      min-height: 276px;
      table {
        width: 100%;
        thead {
          tr {
            th {
              line-height: 24px;
              text-align: center;
              border-top: 1px dashed #d8dce5;
              border-right: 1px dashed #d8dce5;
              border-bottom: 1px dashed #d8dce5;
              &:first-child { border-left: 1px dashed #d8dce5; }
            }
          }
        }
        tbody {
          tr {
            cursor: pointer;
            border-left: 1px dashed #d8dce5;
            border-right: 1px dashed #d8dce5;
            border-bottom: 1px dashed #d8dce5;
            &:hover, &.on { background: rgb(245, 245, 245); }
            td {
              color: #5a5e66;
              line-height: 24px;
              text-align: center;
              border-right: 1px dashed #d8dce5;
              &:last-child { border-right: none }
            }
          }
        }
      }
    }
    .bottom {
      margin: 10px 0;
      .page {
        float: right;
        margin-right: 15px;
        color: #989898;
      }
      .btn-wrapper {
        float: right;
        .prev, .next {
          float: left;
          width: 8px;
          height: 14px;
          cursor: pointer;
          &.disabled {
            cursor: not-allowed;;
          }
        }
        .prev {
          margin-right: 50px;
          background: url(~Img/DecisionCommand/prev_next.png) no-repeat 0 0 / 200% 200%;
          &.enabled {
            &:hover { background: url(~Img/DecisionCommand/prev_next.png) no-repeat 0 100% / 200% 200%; }
          }
        }
        .next {
          background: url(~Img/DecisionCommand/prev_next.png) no-repeat 100% 0 / 200% 200%;
          &.enabled {
            &:hover { background: url(~Img/DecisionCommand/prev_next.png) no-repeat 100% 100% / 200% 200%; }
          }
        }
      }
    }
  }
}
</style>