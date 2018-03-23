import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './CreatearticlePopup.html?style=./CreatearticlePopup.scss'

@WithRender
@Component
export default class CreatearticlePopup extends Vue {
  @Getter('systemStore/articleViewHolder_global') articleViewHolder_global    
  @Action('systemStore/changeArticleViewHolder_global') changeArticleViewHolder_global
  
  
}