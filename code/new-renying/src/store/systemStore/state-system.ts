import {

} from '../mutation-types'

export class State {
  userInfo: any = {}
  subMenu: any[] = []  


  productViewHolder: any = {}
  articleViewHolder: any = {
    id: null,
    type: null
  }
  isClosingPopup: boolean = false
}
