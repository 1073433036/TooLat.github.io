<template>
  <main id="DisasterInformationReport">
    <section class="Report_main" ref="Report_main">
      <ul v-scroll="scrollFn" ref="UL">
        <li :id="item.id"
            class="Report_main_1"
            ref="a"
            v-for="(item,key) in mainList"
            :key="key">
          <component :is="item.component"
                     @submitFunction="submitFunction"
                     :submitFlag="submitFlag"></component>
        </li>
        <li class="submitButoon" ref="buton">
          <el-button type="primary" @click="submitForms">提交</el-button>
        </li>
      </ul>
    </section>
    <span id="Report_line" ref="Report_line" :style="{'transform':`translateY(${scorllTop}px)`}"></span>
    <aside class="Report_list">
      <ul class="Report_list_ul_1">
        <li v-for="(item,key) in mainList"
            :key="key"
            :class="{'current':item.flag}"
            @click="clickHref(key)">
          <a :href="item.href">{{item.value}}</a>
        </li>
      </ul>
      <div class="listddBtn" @click="clickAddBtn" v-if="addLists.length>0">
        <i class="el-icon-plus" style="color: #11A9F5"></i>
      </div>
      <transition name="fade">
        <ul class="typeList" v-if="typeListFlag">
          <li v-for="(item,key) in addLists"
              :key="key"
              @click="selectValue(item)">{{item.value}}</li>
        </ul>
      </transition>
    </aside>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component } from 'vue-property-decorator'
  import reportFrom1 from './DisasterInformationReportForm1.vue'
  import reportFrom2 from './DisasterInformationReportForm2.vue'
  import reportFrom3 from './DisasterInformationReportForm3.vue'
  import reportFrom4 from './DisasterInformationReportForm4.vue'
  import reportFrom5 from './DisasterInformationReportForm5.vue'
  import reportFrom6 from './DisasterInformationReportForm6.vue'
  import DisasterService from '../../../util/DisasterService'
  import Disaster from '../../../interface/Disaster'
  let DisasterHttps=new DisasterService()
  let boxHeight:number=0,allHeight:number=0,scrollHeight:number=0,scrollHeight_line:number=0,heightLists:any=[],anchorFlag:boolean=false
  @Component({
    components:{
      reportFrom1,
      reportFrom2,
      reportFrom3,
      reportFrom4,
      reportFrom5,
      reportFrom6,
    }
  })
  export default class DisasterInformationReport extends Vue {
    scorllTop:number=1
    scrollScale:number=1
    typeListFlag:boolean=false
    mainList:Array<{ id:string, href:string, value:string, flag:boolean, component:Object}>=[
      {
        id:'a',
        href:'#a',
        value:'灾情基本信息',
        flag:true,
        component:reportFrom1,
      },
      {
        id:'b',
        href:'#b',
        value:'灾情基本损失',
        flag:false,
        component:reportFrom2,
      },
    ]
    addLists:Array<{ id:string, href:string, value:string, flag:boolean, component:Object}>=[
      {
        id:'c',
        href:'#c',
        value:'水文水力损失',
        flag:false,
        component:reportFrom3
      },
      {
        id:'d',
        href:'#d',
        value:'农业林业渔业',
        flag:false,
        component:reportFrom4
      },
      {
        id:'e',
        href:'#e',
        value:'电力通讯牧业',
        flag:false,
        component:reportFrom5
      },
      {
        id:'f',
        href:'#f',
        value:'交通其他影响',
        flag:false,
        component:reportFrom6
      },
    ]
    submitFlag:number=0
    formDataFlag:boolean=true
    formData:Disaster={
      disaster: '',
      disasterStatus: '',
      releaseUnit:  '',
      releaseTime:  '',
      reportMan: ''
    }
    params:Disaster={
      disaster: '',
      disasterStatus: '',
      releaseUnit:  '',
      releaseTime:  '',
      reportMan: '',
    }

    //滚动事件
    scrollFn(event:Event):void{
      this.scorllTop=this.$refs.UL['scrollTop']/this.scrollScale
      if(anchorFlag){
        return
      }
      heightLists.forEach((k,j)=>{
        if(this.$refs.UL['scrollTop']>=(k-70)){
          this.mainList.forEach((v,i)=>{
            v.flag=false
            if(i==j){
              v.flag=true
            }
          })
        }
      })
    }

    //点击锚点
    clickHref(key:number):void{
      anchorFlag=true
      this.mainList.forEach((v,i)=>{
        v.flag=false
        if(i==key){
          v.flag=true
        }
      })
      let time:any=setTimeout(()=>{
        anchorFlag=false
        clearTimeout(time)
        time=null
      },100)
    }

    //获取各表单旳值
    submitFunction(val:any):void{
      if(val==false){
        this.formDataFlag=false
      }
      for(let key in val){
        this.formData[key]=val[key]
      }
    }

    //点击添加按钮
    clickAddBtn():void{
      this.typeListFlag=!this.typeListFlag
    }

    //点击选择添加的值
    selectValue(item:{ id:string, href:string, value:string, flag:boolean, component:string}):void{
      this.typeListFlag=!this.typeListFlag
      this.mainList.push(item)
      let arr:any=[]
      this.addLists.forEach(v=>{
        if(v.id!=item.id){
          arr.push(v)
        }
      })
      this.addLists=arr
      setTimeout(()=>{
        this.componentMoveScale()
      },200)
    }

    //点击提交表单按钮
    submitForms():void{
      this.submitFlag++
      setTimeout(async ()=>{
        if(this.formDataFlag==false){
          this.formDataFlag=true
          return
        }
        let fd=<any>new FormData()
        for(let key in this.formData){
          if(key=='files'){
            this.formData[key].forEach(v=>{
              fd.append(key, v)
            })
          }else {
            fd.append(key, this.formData[key])
          }
        }
        await Vue['prototype']['$confirm']('是否提交灾情报告', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          await DisasterHttps.reportDisaster(fd).then(res=>{
            if(res['result']=="S_OK"){
              Vue['prototype']['$message']({
                duration:2000,
                showClose: true,
                type: 'success',
                message: '灾情已提交'
              });
            }
          })
        }).catch(()=>{
          this.formData={
            disaster: '',
            disasterStatus: '',
            releaseUnit:  '',
            releaseTime:  '',
            reportMan: ''
          }
          return
        })
      },300)
    }

    //计算蓝色线条移动的比例
    componentMoveScale():void{
      boxHeight=this.$refs.Report_main['offsetHeight']-30
      allHeight=0;
      heightLists=[]
      for(let i=0; i<this.$refs.a['length'];i++){
        allHeight+=this.$refs.a[i]['offsetHeight']
        heightLists.push(this.$refs.a[i]['offsetTop'])
      }
      allHeight+=this.$refs.buton['offsetHeight']
      scrollHeight=allHeight-boxHeight
      scrollHeight_line=boxHeight-this.$refs.Report_line['offsetHeight']
      if(scrollHeight>0){
        this.scrollScale=scrollHeight/scrollHeight_line
      }else {
        this.scrollScale=0
      }
    }


    mounted(){
      this.componentMoveScale()
      let  resizeFun=()=> {
        if(this.$refs.Report_main){
          this.componentMoveScale()
        }else{
          window.removeEventListener('resize',resizeFun)
        }
      }
      window.addEventListener('resize',resizeFun)
    }
  }
</script>

<style lang="scss" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to{
    opacity: 0
  }
  #DisasterInformationReport {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    background-clip: content-box;
    height: 100%;
    padding-left: 60px;
    .Report_main{
      height: 100%;
      width:75%;
      float: left;
      overflow: hidden;
      box-sizing: border-box;
      padding-top: 10px;
      ul{
        background: white;
        height: 100%;
        width:calc(100%) ;
        padding-right: 40px;
        overflow-y: auto;
        .Report_main_1{
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .submitButoon{
          height: 100px;
          padding-left: 20px;
          text-align: center;
          width: 700px;
          margin-top: 20px;
        }
      }

    }
    #Report_line{
      position: absolute;
      width: 4px;/*no*/
      height: 200px;
      right: 25%;
      top: 20px;
      background: #11A9F5;
      transition: all .3s linear;
    }
    .Report_list{
      box-sizing: border-box;
      padding-top: 20px;
      width: 25%;
      height: 100%;
      padding-left: 20px;
      float: left;
      overflow: visible;
      font-family: "Microsoft YaHei";
      font-size: 14px;/*no*/
      line-height: 30px;/*no*/
      .Report_list_ul_1{
        margin-bottom: 50px;/*no*/
        li{
          height: 30px;/*no*/
          line-height: 30px;/*no*/
          color: #575757;
        }
        li.current{
          color: #11a9f5;
          font-weight: bold;
        }
      }
      .listddBtn{
        width: 100px;/*no*/
        height: 30px;/*no*/
        border: 1px solid #11A9F5;/*no*/
        color: #11A9F5;
        line-height: 30px;/*no*/
        text-align: center;
      }
      .typeList{
        margin-top: 5px;/*no*/
        font-size: 12px;/*no*/
        width: 100px;/*no*/
        box-shadow: 0px 0px 10px #cccccc;/*no*/
        li{
          cursor: pointer;
          height: 30px;/*no*/
          line-height: 30px;/*no*/
          text-align: center;
          color: #575757;
          transition: all .5s;
        }
        li:hover{
          transition: all .5s;
          color: #11A9F5;
        }
      }
    }
  }
  a{
    color: inherit;
    font-size: inherit;
    width: inherit;
    height: inherit;
    display: block;
  }
</style>
