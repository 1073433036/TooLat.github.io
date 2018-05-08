<template>
	<transition name="fade">
		<div v-if="Active" class="dialog" :class="[CustomClass, { active: Active }]">
			<div class="content" v-bind:style="{ width: width }">
		    <div class="head">
		    	<h3>{{ Title }}</h3>
		    </div>
		    <div class="main">
		    	<p :class="IsAlign" v-if="Msg">{{ Msg }}</p>
		    	<div class="info-html" v-html="InfoHtml"></div>
		    </div>
		    <div class="foot">
		      <button v-for="(item, index) in listsData"
            :key="index"
		      	class="dialog-item"
		      	@click="handleDialog(item)"
		      	:class="[{ item: 1 < listsData.length }, item.class]">{{ item.msg }}</button>
		    </div>
			</div>
	  </div>
	</transition>
</template>

<script>
  import Index from './index.js';
  export default Index;
</script>
