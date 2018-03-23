import Vue from 'vue'
Vue.directive('blur', {
  inserted: function (el,binding) {
    var cb = binding.value
    el.addEventListener('blur',function(e){
      cb(el)
    })
  }
})
