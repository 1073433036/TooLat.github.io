<template>
  <main class="Intelligent">
    <app-header title="添加信用卡"></app-header>
    <scroller ref="myscroller">
      <section class="basic_info_-wrapper">
        <form class="info_box" ref="form" @submit.prevent="handleSumbit">
          <ul class="info">
            <li class="detail_list" >
              <em class="name"></em>
              <span class="people">姓名</span>
                <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.name">
              <div class="arrow"></div>
            </li>
            <li class="detail_list" >
              <em class="identfy"></em>
              <span class="people">身份证号</span>
               <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.id_number">
              <div class="arrow"></div>
            </li>

            <li class="detail_list"  >
              <em class="code"></em>
              <span class="people">信用卡号</span>
                <input type="text"
                class="input-item"
                placeholder="请输入"
                v-model="userInfo.card_code">
              <div class="arrow"></div>
            </li>
          </ul>
        </form>
        <button class="btn" :class="{ 'on': active }" :disabled="!active" @click = "next">下一步</button>
      </section>
    </scroller>
  </main>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
