<template>
  <main id =InfoManageMent>
    <common-header :headerTitle="headerTitle"></common-header>
    <section class="InfoManageMain">
      <div class="InfoManageMain_left">
        <ul>
            <li class="InfoManageType"
                :class="{'InfoManageType_current':item.flag&&!item.secondTypeFlag,'InfoManageType_current_1':item.flag&&item.secondTypeFlag}"
                @click.stop="showCurrentComponent(item)"
                v-for="(item,index) in InfoManageTypes" :key="index">
              <a>{{item.name}}<em v-if="item.flag&&!item.secondTypeFlag"></em>
                <!--<em v-if="item.flag&&item.label==='infoPublish'"></em>-->
              </a>
              <ul class="InfoManageSecondType"
                  :class="item.flag&&item.secondTypeFlag?item['secondTypeClass']:''">
                <li v-for="(item_1,index_1) in InfoManageTypes[index].secondType"
                    :key="index_1"
                    @click.stop="showSecondCurrentComponent(InfoManageTypes[index].secondType,item_1)"
                    :class="{'current':item_1.flag}">
                  <router-link :to="{ path: item_1.label }">
                    {{item_1.name}}
                    <em v-if="item_1.flag"></em>
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="InfoManageType"></li>
        </ul>
      </div>
      <div class="InfoManageMain_right">
        <router-view></router-view>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Getter } from 'vuex-class'
  import { Component,Watch } from 'vue-property-decorator'
  import CommonHeader from '../CommonComponents/CommonHeader.vue'
  @Component({
    components: {
      CommonHeader,
    },
  })
  export default class InfoManageMent extends Vue {
    headerTitle:string='揭阳市综合信息管理系统'
    InfoManageTypes:Object={
      'usersInfoManage':{
        name:'用户信息管理',
        label:'UsersInfoManage',
        flag:false,
        secondTypeFlag:false,
        secondTypeClass:'DisInfAnima',
        secondType: []
      },
      'MeteorologicalDisasters':{
        name:'灾害风险管理',
        label:'MeteorologicalDisasters',
        flag:false,
        secondTypeFlag:true,
        secondTypeClass:'MetDisAnima',
        secondType: {
            'Waterlogging':{
              name:'内涝信息管理',
              label:'MeteorologicalDisastersWaterlogging',
              flag:false
            },
            'Typhoon': {
              name:'台风信息管理',
              label:'MeteorologicalDisastersTyphoon',
              flag:false
            },
            'MountainTorrents':{
              name:'山洪信息管理',
              label:'MeteorologicalDisastersMountainTorrents',
              flag:false
            },
            'GeologicalDisaster': {
              name:'地质灾害信息管理',
              label:'MeteorologicalDisastersGeologicalDisaster',
              flag:false
            }
          }
      },
      'infoPublish':{
        name:'信息发布管理',
        label:'infoPublish',
        flag:false,
        secondTypeFlag:true,
        secondTypeClass:'infoPubAnima',
        secondType: {
          'publishMonitoring':{
            name:'发布监控',
            label:'PublishMonitoring',
            flag:false
          },
          'retrievalStatistical':{
            name:'检索统计',
            label:'RetrievalStatistical',
            flag:false
          },
          'groupManagement':{
            name:'短信管理',
            label:'GroupManagement',
            flag:false
          },
          'templateManagement':{
            name:'模板管理',
            label:'TemplateManagement',
            flag:false
          },
        }
      },
      'DisasterRelief':{
        name:'应急资源管理',
        label:'DisasterRelief',
        flag:false,
        secondTypeFlag:false,
        secondTypeClass:'DisRelAnima',
        secondType:[]
      },
      'DisasterInformation':{
        name:'灾情信息管理',
        label:'DisasterInformation',
        flag:false,
        secondTypeFlag:false,
        secondTypeClass:'DisInfAnima',
        secondType: []
      },
      'contingencyPlanManage':{
        name:'应急预案管理',
        label:'contingencyPlanManage',
        flag:false,
        secondTypeFlag:false,
        secondTypeClass:'DisInfAnima',
        secondType: []
      },

    }
    //点击一级菜单
    showCurrentComponent(item:any):void{
      if(item.secondTypeFlag){
        for(let key in this.InfoManageTypes){
          if(this.InfoManageTypes[key].secondTypeFlag){
            if(item.label==this.InfoManageTypes[key].label){
              item.flag=! item.flag
            }else {
              this.InfoManageTypes[key].flag=false
            }
          }
        }
      }
      else {
        for(let key in this.InfoManageTypes){
          if(this.InfoManageTypes[key].secondTypeFlag){
            if(item.label==this.InfoManageTypes[key].label){
              item.flag=! item.flag
            }else {
              this.InfoManageTypes[key].flag=false
              for (let key_ in this.InfoManageTypes[key].secondType){
                let obj_=this.InfoManageTypes[key].secondType[key_]
                obj_.flag=false
              }
            }
          }else {
            let obj = this.InfoManageTypes[key]
            if(item.label==obj.label){
              item.flag=true
              this.$router.push(item.label)
            }
            else {
              obj.flag=false
            }
          }
        }
      }
    }
    //点击显示二级菜单
    showSecondCurrentComponent(items:object,item_1:any){
      for(let key_ in this.InfoManageTypes){
        let obj_=this.InfoManageTypes[key_]
        if(!obj_.secondTypeFlag ){
          obj_.flag=false
        }else {
          for (let key_ in obj_.secondType){
            let obj=obj_.secondType[key_]
            obj.flag=false
          }
        }

      }
      for(let key in items){
        let obj = items[key]
        if(obj.label==item_1.label){
          if(!item_1.flag){
            item_1.flag=!item_1.flag
          }
        }else {
          obj.flag=false
        }
      }
    }
    mounted(){
      let routeNamr = this.$route.path;
      for(let key in this.InfoManageTypes){
        let obj = this.InfoManageTypes[key]
        if(obj.secondTypeFlag){
          for(let key_ in obj.secondType){
            let obj_=obj.secondType[key_]
            if(routeNamr.indexOf(obj_.label)>0){
              obj.flag=true
              obj_.flag=true
            }
          }
        }else {
          if(routeNamr.indexOf(obj.label)>0){
            obj.flag=true
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import '../../styles/theme.scss';
#InfoManageMent{
  width:100%;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: #eff4f8;
  position: relative;
  .InfoManageMain{
    width: 100%;
    position: relative;
    top: 0px;
    padding-top: 50px;
    left: 0px;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    .InfoManageMain_left{
      padding-top: 1px;
      background-color: white;
      float: left;
      width: 250px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      height:100%;
      box-shadow: 1px 0px 6px rgba(137, 137, 137, 0.25);
      overflow-y: auto;
      @include scrollStyle;
      >ul{
        overflow: hidden;
      }
      .InfoManageType{
        min-height: 70px;
        width: 100%;
        font-size: 16px;
        color: #677888;
        text-indent: 32px;
        cursor: pointer;
        overflow: hidden;
        a{
          height: 70px;
          width: 100%;
          line-height: 70px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          display: block;
          padding-right: 32px;
          overflow: hidden;
          position: relative;
          em{
            position: absolute;
            width: 8px;
            height: 14px;
            top: 28px;
            right: 24px;
            background-image: url("../../assets/imgs/infoManage/home_jiantou.png");
            background-repeat:no-repeat;
            -webkit-background-size: 8px 14px;
            background-size: 8px 14px;
            background-position: center;
          }
        }
        .InfoManageSecondType{
          color: #677888;
          font-size: 14px;
          height: 0;
          transition: all .4s;
          overflow: hidden;
          li{
            a{
              text-indent: 50px;
              height: 50px;
              line-height: 50px;
              display: block;
              position: relative;
              em{
                position: absolute;
                width: 8px;
                height: 14px;
                top: 17px;
                right: 24px;
                background-image: url("../../assets/imgs/infoManage/home_jiantou.png");
                background-repeat:no-repeat;
                -webkit-background-size: 8px 14px;
                background-size: 8px 14px;
                background-position: center;
              }
            }
          }
        }
      }
      .InfoManageType_current,.InfoManageSecondType li.current{
        background-color: #f6f6f6;
        color: #11a9f5;
      }
      .InfoManageType_current_1{
        background-color: #f6f6f6;
        /*color: #fff;*/
        color: #11a9f5;
      }
      .InfoManageType a:hover,.InfoManageSecondType li:hover{
        background-color: #f6f6f6;
        color: #11a9f5;
      }
      .InfoManageType .InfoManageType_current_1:hover{
        background-color: #f6f6f6;
        color: #11a9f5;
      }
      .back-home{
        position: absolute;
        height: 60px;
        bottom: 0px;
        left:0px;
        background: white;
        box-shadow: 0px 0px 6px rgba(137, 137, 137, 0.25);
        padding-right: 10px;
        span{
          float: left;
          height: 60px;
          line-height:60px;
          cursor: pointer;
          display: inline-block;
        }
        .back_home_ico{
          width: 60px;
          height: 60px;
          background-color: #11a9f5;
          background-repeat: no-repeat;
          background-position: center;
          background-size: 29px;
          background-image: url("../../assets/imgs/infoManage/home_home.png");
        }
        .back_home_text{
          font-size: 14px;
          color: #989898;
          margin-left:10px;
        }
      }
    }
    .InfoManageMain_right{
      position: relative;
      float: left;
      width: calc(100% - 250px);
      height: 100%;
      box-sizing: border-box;
      padding: 20px 50px 0px 20px;
      background-clip: content-box;
      /*overflow-y: auto;
      overflow-x: hidden;*/
      overflow: hidden;
    }
  }
}
  a{
    color: inherit;
  }
  a:active{
    color: inherit;
  }

#InfoManageMent{
  .InfoManageMain {
    .InfoManageMain_left{
      .InfoManageType {
        .InfoManageSecondType.MetDisAnima{
          height: 200px;
          transition: all .4s .2s;
        }
        .infoPubAnima{
          height: 200px;
          transition: all .4s .2s;
        }
        .DisRelAnima{
          height: 200px;
          transition: all .4s .2s;
        }
        .DisInfAnima{
          height: 200px;
          transition: all .4s .2s;
        }
      }
    }
  }
}
</style>



