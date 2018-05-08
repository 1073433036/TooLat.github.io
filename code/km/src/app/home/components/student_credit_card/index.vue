

 <template>
   <div class="studentCreditCard">
     <app-header title="校园卡申请"></app-header>
       <scroller>
         <div class="stu_ad" ref="swiperRoot">
           <div class="swiper-wrapper" @click="goCGB">
              <div class="swiper-slide">
                <img src="~assets/images/ad.png" alt="">
              </div>
              <div class="swiper-slide">
                <img src="~assets/images/ad_1.jpg" class="swiper-cgb" alt="">
              </div>
           </div>
           <div class="swiper-pagination"></div>
         </div>

         <div class="aplly_wrap">
           <div class="aplly_title font30"><i class="title_icon"></i><span>最新推荐</span><span class="narrate"  @click="bankDetails">解说  &gt;</span> </div>
           <ul class="aplly_list">
             <li v-for="bankitem in banklist" @click="goapply(bankitem)">
                 <div class="bank_img">
                   <img :src="bankitem.thumb" alt="">
                 </div>
                 <div class="bank_info">
                   <dl>
                     <dt>{{bankitem.name}}</dt>
                     <dd v-for="tag in gettags(bankitem.tags)"><i class="tagflag"></i>{{tag}}</dd>
                   </dl>
                   <span class="qrcode_btn" @click.stop="showCardShare(bankitem.bank_id)">二维码</span>
                 </div>
                 <div class="goapply">
                   <span class="apply_btn">去申请</span>
                   <span class="share_btn" @click.stop="handleShareClick(bankitem.bank_id)">分享</span>
                 </div>
             </li>
           </ul>
         </div>


         <!-- <div class="remark_wrap">
            <div class="aplly_title font30"><i class="title_icon"></i>备注说明</div>
            <p>1、校园卡业务不纳入业绩考核 </p>
            <p>2、校园卡业务佣金55元下卡首刷后月结</p>
            <p>3、实习会员推广校园卡业务没有佣金</p>
         </div> -->

         <div class="text">
           <p>备注：</p>
           <p>1. 非目标院校大学生切勿通过填写目标院校名称、地址等套叠方式申请，学籍核对错误除无法申请外亦将造成其他不良影;</p>
           <p>2. 目标大学生客户通过自己的设备填写信息提交申请，切勿多人通过同一设备申请;</p>
           <p>3. 部分大学一年级新生（参考入学时间3个月）存在学籍上传延迟的情况，建议通过线下办理。</p>
         </div>

       </scroller>

       <get-sp-share :id="shareId" :shareHolder="shareHolder"></get-sp-share>

       <notify-popup :content="notifyMsg" :isNotice="isNoticeShow" :noticeTime="noticeTime" @toggleNotify="toggleNotifyFn"></notify-popup>

       <div class="layer" v-show="isShare">
         <div class="mask" @click="isShare = false"></div>
         <div class="share-image" @click="isShare = false">
           <img src="~assets/images/creditcard-share-btn.png">
         </div>
       </div>
   </div>
 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
