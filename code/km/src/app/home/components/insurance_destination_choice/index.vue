

 <template>
   <div class="insuranceDestinationChoice">
      <app-header title="目的地选择">
      </app-header>
      <p class="confirm" @click="confirm">确定</p>
      <ul class="destination_list">
       <li v-for="(item, index) in Destinationlist" class="item"
           :key="index"
           v-on:click="handleItemChange(item)"
           :class="{ active: item.value === city.value }">
            <p class="name">
              <span class="pay_type"> {{ item.name }}</span>
           </p>
           <p class="price">
             <i class="select"></i>
           </p>
         </li>
       </ul>
      </ul>
   </div>
 </template>

 <script>
 import Index from "./index.js";
 export default Index;
 </script>
