

 <template>
   <div class="Insurance_a">
     <!-- <app-header title="保险"></app-header> -->
        <div>
          <div class="search">
            <p class="search_content">
              <i class='search_icon'></i>
              <input type="text" placeholder="搜索产品">
              <span class="message" @click="message"><i class="msg_icon"></i>消息</span>
            </p>

          </div>
           <div class="banner" ref="swiperRoot">
             <div class="swiper-wrapper" >
                <div class="swiper-slide">
                  <img src="~assets/images/ad_1.jpg" class="swiper-cgb" alt="">
                </div> 
                <div class="swiper-slide">
                  <img src="~assets/images/insurance/banner.jpg" alt="">
                </div>
                <div class="swiper-slide">
                  <img src="~assets/images/ad_1.jpg" class="swiper-cgb" alt="">
                </div>
             </div>
             <div class="swiper-pagination"></div>
           </div>
        </div>
         <div class="Ins_nav">
            <nav>
                <p v-for="(item,$index) in arr" @click="toggle($index)" :class="{active:$index==active}">{{item}}</p>
            </nav>
        </div>
         <div class="Ins_wrap">
          <scroller>
           <ul class="Ins_list" >
             <li v-for="(item,index) in Inslist" @click="InsDetails" >
                 <div class="Ins_img"> 
                   <img :src="item.thumb" alt="">
                 </div>
                 <div class="Ins_info">

                   <dl>
                     <dt><span class="choiceness">精选</span>{{item.name}}</dt>
                     <dd v-for="tag in gettags(item.tags)">{{tag}}</dd>
                   </dl>
                 </div>
                 <div class="go_path">
                   <span class="btn">&gt;</span>
                 </div>
             </li>
           </ul>
          </scroller>
         </div>


   </div>
 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
