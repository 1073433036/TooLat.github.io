import Vue from 'vue'
Vue.directive('scroll', {
  inserted: function (el,binding) {
    var cb = binding.value
    el.addEventListener('scroll',function(e){
      cb(e)
    })
  }
})
