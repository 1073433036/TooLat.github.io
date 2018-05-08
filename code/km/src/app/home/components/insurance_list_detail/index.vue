

 <template>
   <div class="InsuranceListDetails">
       <app-header title="保险详情"></app-header>
       <scroller>
         <div class="InsuranceListDetails_wrap">
          <div class="Insurance_nav">
              <div class="nav-group">
                <div class="item" :class="{ active:index == num}"  @click="switchState(index)"  v-for="(item,index) in tabContents" >
                  <p class="title">{{item}}</p>
                </div>
              </div>
              <div class="Insurance_guarantee" v-for='(itemCon,index) in tabContents' v-show=" index == num">
                <div class="guarantee_list"  >
                  <p class=" list list_title">意外伤害保障{{itemCon}}</p>
                  <p class="list" @click="showDetail(index)">意外伤害 <span class="price">30万</span><i class="down"></i></p>
                  <p class="list_detail" v-show="isShow">{{itemCon}}保障被保险人在保险期间，如发生意外事故自发生意外至180日起，保险将承担以下责任：一，难舍难分开始那个那个你干啥呢</p>
                </div>
                <div class="medical_list">
                  <p class=" list list_title">医疗保障{{itemCon}}</p>
                  <p class="list">意外伤害{{itemCon}}<span class="price">30万</span><i class="down"></i></p>
                </div>

              </div>
          </div>
            <div class="Insuranc_introduction">
              <p class="title">产品介绍</p>
              <div class="content">
                <p>1，你是个is那个女生美工都卖给你还没回话顾客们购买吼吼吼。</p>
                <p>2，客户退款还没给发货吗十年后会开门的黑名单</p>
                <p>3，客户退款还没给发货吗十年后会开门的黑名单</p>
              </div>
            </div>
            <div class="foot"></div>
         </div>

       </scroller>
      
      <div class="information_insure">
         <p class="price"><span>￥354.00</span>&nbsp;起</p>
         <p class="account">(推广费￥15.00)</p>
         <p class="insure" @click="insure"><span>立即投保</span></p>
       </div>
   </div>
 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
