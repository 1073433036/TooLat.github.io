 <template>
  <div class="my-car-page">
    <app-header title="车辆违章详情"></app-header>
    <scroller>
      <div class="wrapper">
        <div class="car-break-list">
          <div class="title">
            <div class="time">{{carInfo.time}}</div>
          </div>
          <div class="conter">
            <div class="conter-tit">{{carInfo.location}}</div>
            <p class="detail">{{carInfo.reason}}</p>
          </div>
          <div class="bottom-btn">
            <ul>
              <li>
                <span class="blue">扣</span>{{carInfo.actual_degree}}
              </li>
              <li>
                <span class="yellow">罚</span>{{carInfo.count}}
              </li>
              <li>
                <span class="red">滞</span>{{carInfo.latefine}}
              </li>
            </ul>
          </div>
          <div class="code">
            <p>违章代码：{{carInfo.violation_id}}</p>
            <p>处罚决定书编号：{{carInfo.violation_id}}</p>
          </div>
        </div>
      </div>

       <div class="car-break-map">
          <div id="allmap"></div>
        </div>
      <!-- <div class="immediately">
        <button @click="handleIllegal">立即办理</button>
      </div> -->
    </scroller>
  </div>
</template>
<!-- <template>


</template> -->

<script>
  import Index from './index.js';
  export default Index;
</script>
