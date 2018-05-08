

 <template>
   <div class="InsuranceList">
       <scroller>
         <div class="InsuranceList_wrap">
            <img src="~assets/images/insurance/ins_detail.png" alt="">
            <div class="Details_content">
              <div class="specialty" >
                <span class="headline">产品特色:</span>
                <p class="specialty_content_list">
                  <span >紧急救援保障全</span>
                  <span>紧急救援保障全</span>
                  <span>紧急救援保障全</span>
                </p>
                </div>
                <div class="Details_content_list">
                  <p class="list"><span>适用人群：</span>前往欧洲及申根国家旅游的人</p>
                  <p class="list"><span>保障年龄：</span>前往欧洲及申根</p>
                  <p class="list"><span>保障期限：</span>前往欧洲及申根国家</p>
                </div>
            </div>
            <div class="Insurance_cost">
              <p><span>￥353454.00</span>&nbsp;起</p>
              <p>推广费20%</p>
              <p>约<span>￥353454.00</span></p>
            </div>
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
            <div class="foot"></div>
         </div>
       </scroller>

      <div class="information_insure">
         <p class="price"><span>￥354.00</span>&nbsp;起</p>
         <p class="account" @click="handlePremiumClick('accounts')">(点击核算保费)</p>
         <p class="insure" @click="insure"><span>立即投保</span></p>
      </div>
      <accountinPremium v-on:onChildClick="accountinPremiumClick" :title="botTitle" :show="Showa" :formData="formTemp[formIndex]" :formIndex="formIndex"></accountinPremium>
   </div>

 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
