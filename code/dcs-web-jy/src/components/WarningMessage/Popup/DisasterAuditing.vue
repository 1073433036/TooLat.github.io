<template>
  <div id="disaster-auditing-popup">
    <div class="disaster-auditing-main">
      <div class="disaster-auditing-header">
        <span>灾情审核-{{disaster.name || ''}}</span>
        <i class="el-icon-close" @click.stop="closePopup(false)"></i>
      </div>
      <div class="disaster-auditing-wrapper">
        <ul>
          <li v-for="(val, key) in attrs" :key="key">
            <a>{{val}}：</a>
            <span>{{disaster[key] || ''}}</span>
          </li>
          <li v-if="filesPath.length || imagesPath.length">
            <a>{{filesPath.length ? '上传附件：' : '灾情实景图'}}</a>
            <div class="disaster-files-wrapper" v-if="filesPath.length">
              <a v-for="item in filesPath" :key="item.name" :href="item.url" :download="item.name">{{item.name}}</a>
            </div>
            <div class="disaster-images-wrapper" v-else>
              <img v-for="(item, index) in imagesPath" :key="item.name" :src="item.url" @click.stop="toggleImageViewer(index)"/>
            </div>
          </li>
          <li class="disaster-auditing-btns">
            <el-button type="primary" icon="el-icon-circle-check-outline" 
              size="small" style="width: 80px" @click.stop="disasterAuditing('passcheck')">通过</el-button>
            <el-button type="danger" icon="el-icon-circle-close-outline" 
              size="small" style="width: 80px" @click.stop="disasterAuditing('unpasscheck')">不通过</el-button>
          </li>
        </ul>
      </div>
    </div>
    <transition name="fade">
      <ImageView v-if="isShowImagesView" :images="imagesData" :showIndex="imageIndex" :closeViewer="toggleImageViewer"/>
    </transition>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'
  import Disaster from '../../../interface/Disaster'
  import DisasterService from '../../../util/DisasterService'
  import ImageView from './ImageView.vue'

  @Component({
    components: {
      ImageView
    }
  })
  export default class DisasterAuditing extends Vue {
    @Prop()
    disaster: Disaster
    @Prop()
    closePopup: Function

    imagesPath: {name: string, url: string}[] = []
    filesPath: {name: string, url: string}[] = []
    isShowImagesView: boolean = false
    imageIndex: number = 0

    attrs: any = {
      name: '事件名称',
      remarks: '事件描述',
      starttime: '发生时间',
      address: '发生地点',
      disaster: '灾害类型',
      secondDisaster: '二级灾害',
      influenceDesc: '影响描述'
    }

    get imagesData(): string[] {
      return this.imagesPath.length ? this.imagesPath.map(el => el.url) : [];
    }

    mounted(): void {
      let sourcePaths: any = this.disaster.sourcePath;
      if(!sourcePaths)
        return;
      sourcePaths = JSON.parse(sourcePaths);
      if (sourcePaths.length) {
        let sourceName: string[] = this.disaster.sourceName.split(',');
        let files: string[] = sourceName.filter(el => el.indexOf('.png') === -1);
        if(files.length) {
          sourceName.forEach((el: string, index: number) => {
            this.filesPath.push({
              name: el,
              url: typeof sourcePaths === 'number' && sourcePaths[index].indexOf(el) >= 0 
                ? sourcePaths[index] 
                : sourcePaths[index].url
            });
          });
        } else {
          sourceName.forEach((el: string, index: number) => {
            this.imagesPath.push({
              name: el,
              url: typeof sourcePaths === 'number' && sourcePaths[index].indexOf(el) >= 0 
                ? sourcePaths[index] 
                : sourcePaths[index].url
            });
          });
        }
      }
    }

    toggleImageViewer(index?: number): void {
      this.imageIndex = index ? index : 0;
      this.isShowImagesView = !this.isShowImagesView;
    }

    async disasterAuditing(status: string): Promise<void> {
      let disaService = new DisasterService();
      let data: boolean = await disaService.upInfoDisasterById({
        ...this.disaster,
        ...{auditStatus: status}
      });
      if(data) {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
        this.closePopup(false);
      } else {
        this.$message({
          type: 'error',
          message: '提交失败'
        });
      }
      disaService = null;
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../../styles/theme.scss';

  #disaster-auditing-popup {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    overflow-y: auto;
    z-index: 99;
    @include scrollStyle;
    .disaster-auditing-main {
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
      .disaster-auditing-header {
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
      .disaster-auditing-wrapper {
        width: calc(100% - 40px);
        position: relative;
        padding: 10px 20px;
        background-color: white;
        >ul {
          width: 100%;
          position: relative;
          display: block;
          font-size: 0;
          li {
            width: 100%;
            position: relative;
            display: inline-block;
            margin: 10px 0;
            border-bottom: 1px solid #f5f5f5; /*no*/
            &:nth-last-of-type(2),
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
            .disaster-images-wrapper {
              width: 100%;
              max-height: 182px;
              position: relative;
              overflow-y: auto;
              @include scrollStyle;
              >img {
                width: 100px;
                height: 80px;
                display: inline-block;
                margin-right: 15px;
                margin-bottom: 10px;
                cursor: pointer;
              }
            }
            .disaster-files-wrapper {
              width: calc(100% - 130px);
              position: relative;
              display: inline-block;
              vertical-align: top;
              padding-left: 10px;
              &:first-of-type {   
                padding-left: 0;
              }
              >a {
                height: 30px;
                display: inline-block;
                vertical-align: top;
                line-height: 30px;
                margin: 0 10px;
                color: $themeColor;
                font-size: 14px;
                cursor: pointer;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          li.disaster-auditing-btns {
            margin-top: 20px;
            text-align: center;
            
          }
        }
      }
    }
  }
</style>
