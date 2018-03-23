import Vue from 'vue'

Vue.directive('tip', {
  inserted(el, binding) {
    let tipText = binding.value
    let tipEl = document.createElement('span')
    let elWidth = tipText.length * 12 + 8,
      elHeight = 20
    tipEl.innerText = tipText
    tipEl.style.textAlign = 'center'
    tipEl.style.fontSize = '12px'
    tipEl.style.display = 'inline-block'
    tipEl.style.padding = '4px'
    tipEl.style.color = 'rgb(58,56,56)'
    tipEl.style.border = 'solid 1px #6d6c6c'
    tipEl.style.zIndex = '999'
    tipEl.style.position = 'absolute'
    tipEl.style.backgroundColor = 'white'
    tipEl.style.whiteSpace = 'nowrap'
    tipEl.style.lineHeight = '12px'
    tipEl.style.transition = 'opacity .1s ease-in'
    tipEl.style.opacity = '0'
    tipEl.style.boxShadow = '1px 1px 5px 0px #403a3a'
    tipEl.id = 'toolTip'

    let appendChildDelay: any = null
    let posX,
      posY
    let winWidth = document.body.clientWidth,
      windHeight = document.body.clientHeight,
      daleyDelete: any = null

    el.addEventListener('mouseover', ($event) => {

      el.addEventListener('mousemove', setPosByMouseMove)

      appendChildDelay = setTimeout(() => {
        el.removeEventListener('mousemove', setPosByMouseMove)
        document.body.appendChild(tipEl)
        appendChildDelay = null
        setTimeout(() => {
          tipEl.style.opacity = '1'
        }, 0)
      }, 700)
      daleyDelete = setTimeout(() => {
        if (document.querySelector('#toolTip'))
          document.body.removeChild(tipEl)
        el.removeEventListener('mousemove', setPosByMouseMove)
      }, 3000)
    })
    el.addEventListener('mouseout', () => {
      clearTimeout(daleyDelete)
      if (appendChildDelay) {
        clearTimeout(appendChildDelay)
        el.removeEventListener('mousemove', setPosByMouseMove)
      }
      if (document.querySelector('#toolTip'))
        document.body.removeChild(tipEl)
    })
    function setPosByMouseMove(e: MouseEvent) {
      posX = e.clientX
      posY = e.clientY + 20
      tipEl.style.top = posY + 'px'
      tipEl.style.left = posX + 'px'
    }
  }
})