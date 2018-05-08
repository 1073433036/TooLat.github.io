

 <template>
   <div class=" message_Center">
     <app-header title="消息中心"></app-header>
       <scroller>
         <div class="message_Center_wrap">
           <ul class="message_Center_list">
              <li>
               <div class="list">
                 <p class="title">印度申请承办2032年奥运会！组委会希望中国能继续承办</p>
                  <img src="~assets/images/insurance/insurance_msg_center.png" alt="">
                  <p class="msg_bottom">
                    <span class="msg_time">45分钟前</span> |
                    <span class="browse"><i class="browse_icon"></i>646546</span>
                    <span class="more">查看详情 &gt;</span>
                  </p>
               </div>
              </li> 
              <li>
               <div class="list">
                 <p class="title">印度申请承办2032年奥运会！组委会希望中国能继续承办</p>
                  <img src="~assets/images/insurance/insurance_msg_center.png" alt="">
                  <p class="msg_bottom">
                    <span class="msg_time">45分钟前</span> |
                    <span class="browse"><i class="browse_icon"></i>646546</span>
                    <span class="more">查看详情 &gt;</span>
                  </p>
               </div>
              </li> 
         <!--      
              <li v-for="item in messageList">
                <p class="title">{{title}}</p>
                 <img :src="item.img" alt="">
                 <p class="msg_bottom">
                   <span class="msg_time">{{item.time}}</span> |
                   <span class="browse"><i class="browse_icon"></i>{{item.num}}</span>
                   <span class="more">查看详情 &gt;</span>
                 </p>
              </li> -->

           
           </ul>
         </div>

       </scroller>

   </div>
 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
