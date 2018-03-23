import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './AddClass.html?style=./AddClass.scss'

@WithRender
@Component
export default class AddClass extends Vue {
  @Prop() closeFn

  classOpt = [
    {
      name: '人工增雨',
      isSelected: false,
      sub:[
        {
          name: '人工影响降雨落水区',
          isSelected: false,
          value: 'rain'
        },
        {
          name: '森林城市防灭火、降温',
          isSelected: false,
          value: 'firedown'
        },
        {
          name: '改善空气质量',
          isSelected: false,
          value: 'quantity'
        }
      ]
    },
    {
      name: '短临降水',
      isSelected: false,
      sub:[
        {
          name: '人工影响降雨落水区',
          isSelected: false,
          value: 'rain'
        },
        {
          name: '森林城市防灭火、降温',
          isSelected: false,
          value: 'firedown'
        },
        {
          name: '改善空气质量',
          isSelected: false,
          value: 'quantity'
        }
      ]
    }
  ]
  elementSelected: string = ''

  toggleOpt(item, name){
    if (name) {
      for(let opt of this.classOpt) {
        for(let subOpt of opt.sub){
          subOpt.isSelected = false
        }
      }
      item.isSelected = !item.isSelected
    } else {
      for(let opt of this.classOpt){
        if(opt.name === item.name) opt.isSelected = !opt.isSelected
        else opt.isSelected = false
        // opt.isSelected = opt.name === item.name ? !opt.isSelected : false
      }
    }
    // if (item.value && item.isSelected)
    //   this.elementSelected = item.value
  }
}