<template>
  <div id="emerg-event">
    <main class="emerg-event-main" v-loading="loading">
      <header class="emerg-event-header">
        <span v-text="disaster.title || ''"></span>
        <i class="el-icon-close" @click.stop="closePopup(false)"></i>
      </header>
      <section class="emerg-event-wrapper">
        <ul>
          <li v-for="(val, key) in attrs" :key="key">
            <a>{{val}}：</a>
            <span>{{disaster[key] || '--'}}</span>
          </li>
          <li>
            <a>发生地点：</a>
            <span>{{disaster.info.address || '--'}}</span>
          </li>
          <li v-if="eventMembers.length">
            <a>联动人员：</a>
            <div v-for="(item, index) in eventMembers" :key="index" v-text="item.name" class="emerg-event-member"></div>
          </li>
          <li v-if="eventDynamics.length">
            <a>事件动态</a>
            <div class="emerg-event-dynamics">
              <div class="emerg-event-dynamic" v-for="(item, index) in eventDynamics" :key="index">
                <span>{{item.ddatetime}}</span>
                <div class="dynamic-detail">
                  <div class="dynamic-images" v-if="item.info.pics && item.info.pics.length" >
                    <img :src="item.info.abstract.url" @click.stop="showDynamicImages(item.info)"/>
                    <a class="images-sum">{{item.info.pics.length}}</a>
                  </div>
                  <span>
                    <a style="color:#11a9f5">{{item.name}}</a><br>
                    {{item.info.state || ''}}<br>
                    {{item.info.describes || ''}}
                  </span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </main>
    <transition name="fade">
      <ImageView v-if="isShowDynamicImage" :images="dynamicImages" :closeViewer="closeDynamicImageView" />
    </transition>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component, Prop } from 'vue-property-decorator'
  import { EmergEvent, EventDynamic, EventMember } from '../../../interface/EmergEvent'
  import EmergEventHttp from '../../../util/EmergEventHttp'
  import ImageView from './ImageView.vue'

  @Component({
    components: {
      ImageView
    }
  })
  export default class DisasterAuditing extends Vue {
    @Prop()
    disaster: EmergEvent
    @Prop()
    closePopup: Function

    loading: boolean = false
    attrs: any = {
      title: '事件名称',
      describes: '事件描述',
      ddatetime: '发生时间'
    }
    eventDynamics: EventDynamic[] = []
    eventMembers: EventMember[] = []
    dynamicImages: string[] = []
    isShowDynamicImage: boolean = false

    async mounted(): Promise<void> {
      console.log(this.disaster);
      this.loading = true;
      let eventId = this.disaster.liandongid;
      await Promise.all([this.getEventDynamics(eventId), this.getEventMembers(eventId)]);
      this.loading = false;
    }

    showDynamicImages(info: any): void {
      this.dynamicImages = info.pics.map(el => el.url);
      this.isShowDynamicImage = true;
    }

    closeDynamicImageView(): void {
      this.isShowDynamicImage = false;
    }

    async getEventDynamics(eventId: number): Promise<void> {
      let emergEventHttp = new EmergEventHttp();
      let data: EventDynamic[] = await emergEventHttp.getEventDynamics(eventId);
      data.forEach(el => {
        el.info = typeof el.info === 'string' ? JSON.parse(el.info) : {};
        el.ddatetime = moment(el.ddatetime).format('YYYY-MM-DD HH:mm');
      });
      this.eventDynamics = data;
      console.log(data);
      emergEventHttp = null;
    }

    async getEventMembers(eventId: number): Promise<void> {
      let emergEventHttp = new EmergEventHttp();
      let data: EventMember[] = await emergEventHttp.getEventMembers(eventId);
      console.log(data);
      this.eventMembers = data;
      emergEventHttp = null;
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../styles/theme.scss';

  #emerg-event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    overflow-y: auto;
    z-index: 999;
    @include scrollStyle;
    .emerg-event-main {
      width: 800px;
      position: relative;
      margin: 0 auto;
      top: 50%;
      transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      margin-bottom: 20px;
      .emerg-event-header {
        width: 100%;
        height: 40px;
        position: relative;
        background-color: $themeColor;
        line-height: 40px;
        >span {
          height: 100%;
          position: relative;
          display: inline-block;
          padding-left: 20px;
          font-size: 14px;
          color: white;
        }
        >i {
          width: 40px;
          height: 40px;
          top: 0;
          right: 0;
          position: absolute;
          line-height: 40px;
          text-align: center;
          font-size: 16px;
          color: white;
          cursor: pointer;
        }
      }
      .emerg-event-wrapper {
        width: calc(100% - 40px);
        position: relative;
        padding: 10px 20px;
        background-color: white;
        >ul {
          width: 100%;
          position: relative;
          display: block;
          font-size: 0;
          >li {
            width: 100%;
            position: relative;
            display: inline-block;
            margin: 10px 0;
            border-bottom: 1px solid #f5f5f5; /*no*/
            &:last-of-type {
              border-bottom: none;
            }
            >a {
              width: 80px;
              height: 30px;
              position: relative;
              display: inline-block;
              vertical-align: top;
              line-height: 30px;
              font-size: 14px;
            }
            >span {
              width: calc(100% - 90px);
              position: relative;
              display: inline-block;
              vertical-align: top;
              padding-left: 10px;
              line-height: 30px;
              font-size: 14px;
            }
            .emerg-event-member {
              height: 30px;
              position: relative;
              display: inline-block;
              vertical-align: top;
              margin-right: 10px;
              line-height: 30px;
              font-size: 14px;
              color: $themeColor;
              cursor: pointer;
              &:first-of-type {
                margin-left: 10px;
              }
              &:hover {
                text-decoration: underline;
              }
            }
            .emerg-event-dynamics {
              width: 100%;
              max-height: 300px;
              position: relative;
              margin-top: 5px;
              overflow-y: auto;
              @include scrollStyle;
              .emerg-event-dynamic {
                width: calc(100% - 20px);
                position: relative;
                margin-bottom: 10px;
                padding-left: 20px;
                box-sizing: border-box;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                &::before {
                  content: '';
                  position: absolute;
                  width: 2px;
                  height: calc(100% - 4px);
                  left: 10px;
                  top: 4px;
                  background-color: grey;
                }
                >span {
                  width: 100%;
                  position: relative;
                  display: block;
                  line-height: 20px;
                  font-size: 12px;
                  &::before {
                    content: '';
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    left: -15px;
                    top: 4px;
                    background-color: grey;
                    border-radius: 100%;
                  }
                }
                .dynamic-detail {
                  width: calc(100% - 20px);
                  position: relative;
                  margin: 10px 0;
                  padding: 10px;
                  border-radius: 4px;
                  background-color: #ddd;
                  .dynamic-images {
                    height: 60px;
                    position: relative;
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 10px;
                    border: 1px solid #ddd; /*no*/
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    &:hover {
                      border: 1px solid white; /*no*/
                    }
                    >img {
                      width: auto;
                      height: 100%;
                      display: block;
                      cursor: pointer;
                    }
                    >a {
                      display: block;
                      position: absolute;
                      top: 0;
                      right: 0;
                      padding: 0 5px;
                      line-height: 20px;
                      font-size: 12px;
                      background-color: rgba(0, 0, 0, .5);
                      color: white;
                    }
                  }
                  >span {
                    position: relative;
                    display: inline-block;
                    font-size: 14px;
                    line-height: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
</style>
