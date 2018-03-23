<template>
  <main class="CommonTable">
    <header>
      <span class="name">搜索</span>
      <input type="text" v-model="keyString" placeholder="请输入搜索信息">
    </header>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="(th, key) in thead" :key="key">{{ th.text }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(el, index) in currentInfo" v-if="currentInfo.length">
            <tr :key="el.id" @click="checkDetail(el)" :class="['normal', {on: infoSelected === el.id}]">
              <td v-for="(th, key) in thead" :key="key" :class="th.type">
                {{ el[key] ? el[key] : '---' }}
              </td>
            </tr>
            <tr :key="'_' + index" v-if="infoSelected === el.id" class="extended on">
              <td colspan="3">
                <ul class="cf">
                  <li class="cf" v-for="(name, key) in detailExtended" :key="key"
                      :title="name + '： ' + (el[key] ? el[key] : '---')">
                    <span class="desc">{{ name }}</span>
                    <span class="val">{{ el[key] ? el[key] : '---' }}</span>
                  </li>
                </ul>
              </td>
            </tr>
          </template>
          <tr class="no-result" v-if="!currentInfo.length">
            <td :colspan="Object.keys(thead).length" rowspan="2">无</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bottom cf">
      <div class="btn-wrapper cf">
        <div :class="['prev', {enabled: currentPage !== 1,disabled: currentPage === 1}]"
            :title="currentPage === 1 ? '已是第一页' : '上一页'"
            @click="changePage('prev')"></div>
        <div :class="['next', {enabled: !isLastPage,disabled: isLastPage}]"
            :title="isLastPage ? '已是最后一页' : '下一页'"
            @click="changePage('next')"></div>
      </div>
      <span class="page">{{ startIndex + ' - ' + lastIndex + ' of ' + showInfo.length }}</span>
    </div>
  </main>
</template>

<script lang='ts'>
  import Vue from 'vue'
  import { Component, Watch, Prop } from 'vue-property-decorator'
  import { Getter, Action } from 'vuex-class'

  @Component
  export default class CommonTable extends Vue {
    @Prop() info
    @Prop() thead
    @Prop() detailExtended
    @Prop({ default: 10 }) pageSize
    showInfo: any[] = []
    currentInfo: any[] = []
    currentPage: number = 1
    keyString: string = ''
    infoSelected: number | null = null
    get startIndex() {
      if (this.showInfo.length) return (this.currentPage - 1) * this.pageSize + 1
      else return 0
    }
    get lastIndex() {
      if (this.currentPage * this.pageSize > this.showInfo.length) return this.showInfo.length
      else return this.currentPage * this.pageSize
    }
    get isLastPage() {
      return this.pageSize * this.currentPage >= this.showInfo.length
    }

    mounted() {
      this.showInfo = this.info
      this.currentInfo = this.showInfo.slice(0, this.pageSize)
    }

    @Watch('currentPage')
    oncurrentPageChanged (val: number, oldVal: number) {
      this.currentInfo = this.showInfo.slice((val - 1) * this.pageSize, val * this.pageSize)
    }

    changePage(type: 'prev' | 'next') {
      if (type === 'prev') {
        if (this.currentPage === 1) return
        this.currentPage--
      } else {
        if (this.isLastPage) return
        this.currentPage++
      }
    }

    @Watch('keyString')
    onkeyStringChanged (val: string, oldVal: string) {
      if (val) {
        this.showInfo = []
        let reg = new RegExp(val)
        for (let el of this.info) {
          for (let key in this.thead) {
            if (reg.test(el[key])) {
              this.showInfo.push(el)
              break
            }
          }
        }
      } else {
        this.showInfo = this.info
      }
      this.currentPage = 1
      this.currentInfo = this.showInfo.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }

    checkDetail(el) {
      if (this.detailExtended)
        this.infoSelected = this.infoSelected === el.id ? null : el.id
    }
  }
</script>

<style lang='scss' scoped>
.CommonTable {
  header {
    margin: 5px 0 10px;
    .name {
      margin: 0 10px 0 5px;
    }
    input[type="text"] {
      padding: 0 10px;
      width: 190px;
      height: 28px;
      border: 1px solid #d8dce5;
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
          &.normal td {
            min-width: 50px;
            color: #5a5e66;
            line-height: 24px;
            text-align: center;
            border-right: 1px dashed #d8dce5;
            &.center { text-align: center; }
            &.left {
              text-align: left;
              text-indent: 10px;
            }
            &:last-child { border-right: none; }
          }
          &.no-result td {
            line-height: 32px;
            text-align: center;
          }
          &.extended {
            cursor: default;
            td {
              padding: 10px;
              ul {
                width: 100%;
                li {
                  float: left;
                  width: 50%;
                  height: 20px;
                  line-height: 20px;
                  span {
                    float: left;
                    display: inline-block;
                    padding: 0 5px;
                    width: calc(50% - 10px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                  .desc {
                    color: #1c1c1c;
                  }
                  .val {
                    color: #575757;
                  }
                }
              }
            }
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
</style>
