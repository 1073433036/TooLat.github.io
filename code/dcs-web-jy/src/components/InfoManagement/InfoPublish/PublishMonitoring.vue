<template>
  <main id="PublishMonitoring">
    <div class="PublishMonitoring_top">
      <!--左上角信息-->
      <div class="PublishMonitoring_top_left"  v-loading="loading.top_left">
        <div class="publishReport_j">
          <p class="statusMonitoring_title" style="margin-bottom: 10px">
            发布次数统计
          </p>
          <section class="publishReport_j_main">
            <ul class="publishReport_j_type">
              <li v-for="(item,key) in eventType">
                <span>{{item.label}}</span>
                <span>{{item.number}}</span>
              </li>
            </ul>
            <div class="publishReport_j_arrows">
              <span></span>
            </div>
            <div class="publishReport_j_blue">
              <span>{{publishNumber}}</span><br>
              <span>自然灾害</span>
            </div>
            <div class="publishReport_j_arrows">
              <span></span>
              <div class="text">发布平均用时3秒</div>
            </div>
            <div class="publishReport_j_trench">
              <ul >
                <li v-for="(item,key) in channelInfos" :key="key">
                  <span>{{item.label}}</span>
                  <span>{{item.number}}</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      <!--右上角信息-->
      <div class="PublishMonitoring_top_right" v-loading="loading.top_left">
        <p class="statusMonitoring_title">最近发布</p>
        <ul class="newPublish">
          <li v-for="(item,key) in nowPublic" :key="key" v-if="key<6">
            <div class="newPublish_li_top">
              <span class="indexNumber">{{key+1}}</span>
              <!--<img src="" alt="">-->
              <div class="newPublish_text">
                <p class="newPublish_text_title">气象灾害-{{item.typeWarn}}</p>
                <p class="newPublish_text_main">自然灾害 {{item.time}} 发布</p>
              </div>
            </div>
            <div class="newPublish_li_bottom">
              <span></span>
              <ul>
                <li>
                <p><i class="el-icon-check"></i></p>
                <p>预警录入</p>
              </li>
                <li>
                  <p><i class="el-icon-check"></i></p>
                  <p>预警提交</p>
                </li>
                <li>
                  <p>
                    <i v-if="item.state!=1" class="el-icon-check"></i>
                    <i v-else style="background: #11A9F5;color: white;box-shadow: 0 1px 10px #11A9F5">3</i>
                  </p>
                  <p>预警审核</p>
                </li>
                <li>
                  <p>
                    <i v-if="item.state!=1" class="el-icon-check"></i>
                    <i v-if="item.state==1" style="background: white;color: #11A9F5">4</i>
                  </p>
                  <p>预警发布</p>
                </li>
                <li>
                  <p>
                    <i v-if="item.state!=2" style="background: white;color: #11A9F5">5</i>
                    <i v-if="item.state==2"class="el-icon-check"></i>
                  </p>
                  <p>发布完成</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="PublishMonitoring_bottom" v-loading="loading.bottom">
      <div class="statusMonitoring">
        <p class="statusMonitoring_title" style="margin-bottom: 5px">
          发布渠道状态
        </p>
        <!--<ul class="statusMonitoring_main">
          <li>
            <span>微博</span>
            <span :style="{background:'#13B5B1'}">正常</span>
          </li>
        </ul>-->
        <div class="channelInfos">
          <ul v-for="(item,key) in interfaceStatus" :key="key">
            <li><i class="el-icon-warning"></i> {{item.label}}接口状态</li>
            <li>
              <table class="channelInfos_table" border="1" width="100%" cellspacing="0" borderColor="#dfe4ed">
                <tr>
                  <td>接口地址</td>
                  <td>服务状态</td>
                  <td>最新监控时间</td>
                </tr>
                <tr>
                  <td style="width: 60%">{{item.interfaceAddress}}</td>
                  <td style="width: 20%">{{item.status?'正常':'异常'}}</td>
                  <td style="width: 20%">{{item.time}}</td>
                </tr>
              </table>
            </li>
          </ul>
        </div>
      </div>
     <!-- <header class="PublishMonitoring_record">
        <span v-for="item in  titleText">{{item}}</span>
      </header>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item name="1" style="border-left:5px solid blue;">
          <template slot="title">
            <div class="publishNumber">
              <span v-for="item in  publicNumberData">{{item}}</span>
            </div>
          </template>
          <div class="">与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div class="">在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          <div class="">
            <ul>
              <li></li>
            </ul>
          </div>
        </el-collapse-item>

        <el-collapse-item name="2" style="border-left:5px solid red;">
          <template slot="title">
            <div class="publishNumber">
              <span v-for="item in  publicNumberData">{{item}}</span>
            </div>
          </template>
          <div class="">控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
      </el-collapse>-->
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import moment from 'moment'
  import { Component,Prop,Watch } from 'vue-property-decorator'
  import infoPublishHttp from '../../../util/InfoPublishHttp'
  let InfoPublishHttp = new infoPublishHttp()
  @Component({
    components:{

    }
  })
  export default class PublishMonitoring extends Vue {
    loading:{ top_left:boolean, top_right:boolean, bottom:boolean }={top_left:true, top_right:true, bottom:true}
    titleText:string[]=['预警发布次数','已上传预警','上传成功','上传错误','成功率','平均用时']
    publicNumberData:any=['省突平台','10','7','3','1','89%','3s']
    nowPublic:any=[]
    activeNames:string=''
    channelInfos:any= {
      ftpNum: {
        number: 0,
        label: 'FTP'
      },
      nativeMessageNum: {
        number: 0,
        label: '本地短信'
      },
      proMessageNum: {
        number: 0,
        label: '省突渠道'
      },
      faxNum: {
        number: 0,
        label: '传真'
      },
      weiBoNum: {
        number: 0,
        label: '微博'
      },
      weiXinNum: {
        number: 0,
        label: '微信'
      },
    }
    interfaceStatus:any= {
      ftpUlr: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: 'FTP'
      },
      nativeMessageUrl: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: '本地短信'
      },
      proMessageUrl: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: '省突渠道'
      },
      faxUrl: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: '传真'
      },
      weiBoUrl: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: '微博'
      },
      weiXinUrl: {
        interfaceAddress: '',//接口地址
        time: '',//最新监控时间
        status: '',//接口状态
        label: '微信'
      },
    }
    eventType:{label:string,number:number}[]=[]
    publishNumber:number=0
    //渠道监控的数据请求
    async getInterfaceData(){
      let res  = await InfoPublishHttp.getMonitoringData()
      for(let key in this.channelInfos){
        this.channelInfos[key].number=res[key]
      }
      for(let key in this.interfaceStatus){
        this.interfaceStatus[key].interfaceAddress=res[key]
        this.interfaceStatus[key].time=res['time']
        let ar = key.replace('Url','')
        this.interfaceStatus[key].status=res[ar]
      }
      this.loading.bottom=false
    }
    async initPubulishMontoring(){
      let res1 = await InfoPublishHttp.getMsgByCondition({})
      let res2 = (await InfoPublishHttp.getWarningTemplates())[0]['warnType'].split('，')
      res2.forEach(v=>{
        this.eventType.push( {
          label:v,
          number:0
        })
      })
      res1.forEach(v=>{
        if(v.state!=0){
          this.nowPublic.push(v)
        }
        this.eventType.forEach(k=>{
          if(v.typeWarn.indexOf(k.label)!=-1){
            k.number++
          }
        })
      })
      this.eventType.forEach(k=>{
        this.publishNumber+=k.number
      })
      this.loading.top_left=false
    }
    mounted(){
      this.getInterfaceData()
      this.initPubulishMontoring()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/theme.scss';
#PublishMonitoring{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  @include scrollStyle;
  .PublishMonitoring_top{
    width: 100%;
    height: 440px;
    box-sizing: border-box;
    margin-bottom: 10px;
    .PublishMonitoring_top_left{
      float: left;
      width: 960px;
      background: white;
      height: 100%;
      box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
      box-sizing: border-box;
      padding:20px 0px 10px 20px;
      overflow: hidden;
      overflow-y: auto;
      @include scrollStyle;
      .publishReport_j{
        overflow: hidden;
      }
      .publishReport_j_main{
        .publishReport_j_type{
          padding-left: 0px;
          overflow: hidden;
          text-align: center;
          li{
            width: 80px;
            height: 62px;
            margin-top: 10px;
            box-sizing: border-box;
            border:1px solid #D2D4DB;
            text-align: center;
            margin-right: 10px;
            color: #575757;
            display: inline-block;
            span{
              display: block;
            }
            span:first-of-type{
              height: 24px;
              border-bottom: 1px solid #D2D4DB;
              line-height: 24px;
            }
            span:last-of-type{
              height: 35px;
              line-height: 35px;
              font-size: 22px;
              font-weight: bolder;
            }
          }
        }
        .publishReport_j_arrows{
          height: 48px;
          width: 100%;
          position: relative;
          span{
            position: absolute;
            width: 16px;
            height: 26px;
            left: 50%;
            top: 50%;
            margin-left: -16px;
            margin-top: -13px;
            background-image: url("../../../assets/imgs/infoManage/home_arrow.png");
            background-repeat: no-repeat;
            background-size: 16px 26px;
          }
          .text{
            height: 48px;
            line-height: 48px;
            position: absolute;
            left: calc(50% + 30px);
            top: 0px;
          }
        }
        .publishReport_j_blue{
          width: 440px;
          height: 50px;
          background:#eaf4f9;
          margin-left: 240px;
          text-align: center;
          span:first-of-type{
            line-height: 30px;
            color: #11A9F5;
            font-size: 28px;
            font-weight: bolder;
          }
          span:last-of-type{
            line-height: 20px;
          }
        }
        .publishReport_j_trench{
          width: 100%;
          height: 62px;
          position: relative;
          ul{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            margin: auto;
            overflow: hidden;
            height: 62px;
            width: 540px;
            li{
              float: left;
              width: 80px;
              height: 62px;
              box-sizing: border-box;
              border:1px solid #D2D4DB;
              text-align: center;
              margin-right: 10px;
              color: #575757;
              span{
                display: block;
              }
              span:first-of-type{
                height: 24px;
                border-bottom: 1px solid #D2D4DB;
                line-height: 24px;
              }
              span:last-of-type{
                height: 35px;
                line-height: 35px;
                font-size: 22px;
                font-weight: bolder;
              }
            }
            li:last-of-type{
              margin-right: 0px;
            }
          }
        }
      }
    }
    .PublishMonitoring_top_right{
      float: left;
      width:calc(100% - 971px);
      margin-left: 10px;
      background: white;
      height: 100%;
      box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
      box-sizing: border-box;
      padding: 20px;
      overflow-y: auto;
      @include scrollStyle;
      .newPublish{
        overflow: hidden;
        li{
          .newPublish_li_top{
            overflow: hidden;
            .indexNumber{
              float: left;
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              box-sizing: border-box;
              border: 1px solid #D2D4DB;/*no*/
              font-size: 12px;
              margin-right: 15px;
            }
            img{
              float: left;
              width: 40px;
              height: 50px;
              margin-right: 10px;
            }
            .newPublish_text{
              float: left;
              height: 50px;
              width: 300px;
              overflow: hidden;
              .newPublish_text_title{
                width: 300px;
                line-height: 20px;
                overflow: hidden;
                font-weight: bolder;
              }
              .newPublish_text_main{
                width: 300px;
                line-height: 30px;
                overflow: hidden;
              }
            }
          }
          .newPublish_li_bottom{
            position: relative;
            overflow: hidden;
            width: 100%;
            margin-top: 5px;
            height: 60px;
            ul{
              position: absolute;
              width: 100%;
              left: 0;
              top: 0;
              z-index: 10;
              li{
                float: left;
                width: 20%;
                min-width: 50px;/*no*/
                overflow: hidden;
                text-align: center;
                p:first-of-type{
                  i{
                    width: 20px;
                    height: 20px;
                    border: 1px solid #11a9f5;
                    color: #11a9f5;
                    box-sizing: border-box;
                    background: white;
                    line-height: 20px;
                    text-align: center;
                    border-radius: 100%;
                    display: inline-block;
                    font-style:normal
                  }
                }
                p:last-of-type{
                  line-height: 25px;
                }
              }
              li:last-of-type{
                margin-right: 0px;
              }
            }
            >span{
              position: absolute;
              width: 80%;
              height: 1px;/*no*/
              background: #000000;
              left: 10%;
              top: 10px;
              z-index: 3;
            }
          }
        }
      }
    }
  }
  .PublishMonitoring_bottom{
    width: 100%;
    height:calc(100% - 450px);
    background: white;
    box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
    overflow: hidden;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
    @include scrollStyle;
   /* .PublishMonitoring_record{
      height: 60px;
      line-height: 60px;
      >span{
        float: left;
        height: 60px;
        text-align: center;
        width: calc(100% / 8);
      }
      span:first-of-type{
        margin-left: calc(100% / 8);
      }
    }
    .publishNumber{
      >span{
        float: left;
        text-align: center;
        width: calc(100% / 8);
      }
      span:first-of-type{
        text-align: left;
        text-indent: 10px;
      }
    }*/
    .statusMonitoring{
      overflow: hidden;
      margin-bottom: 10px;
      .statusMonitoring_main{
        margin-top: 10px;
        overflow: hidden;
        li{
          float: left;
          margin-right: 20px;
          margin-bottom: 10px;
          span{
            padding: 5px 10px;
            overflow: hidden;
            box-sizing: border-box;
            float: left;
          }
          span:first-of-type{
            border:1px solid #D2D4DB;
          }
          span:last-of-type{
            border:1px solid #D2D4DB;
            border-left: 0px;
            color: white;
          }
        }
      }
      .channelInfos{
        padding-left: 20px;
        ul{
          li:first-of-type{
            font-size: 14px;/*no*/
            line-height: 36px;
            height: 36px;
            color: #11a9f5;
            .el-icon-warning{
              color: #11a9f5;
            }
          }
          li:nth-of-type(2){
            .channelInfos_table{
              border-color: #dfe4ed;
              tr{
                border-color: #dfe4ed;
                td{
                  border-color: #dfe4ed;
                  padding: 10px 15px;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
  .statusMonitoring_title{
    height: 26px;/*no*/
    border-left:4px solid #11A9F5 ;/*no*/
    text-indent: 15px;/*no*/
    line-height: 27px;/*no*/
    font-size: 14px;/*no*/
    font-weight: bold;/*no*/
    margin-bottom: 17px;
  }
}
</style>
