import UserInfo from '../../interface/UserInfo'
import Bound from '../../interface/Bound'

export class State {
  cityId: number = 15
  cityName: string = '揭阳'
  countyId: number = 0
  countyName: string = ''
  title: string = '揭阳市智慧应急决策指挥平台'
  bounds: Bound = {
    top: 23.778412,
    bottom: 22.889303,
    left: 115.601105,
    right: 116.6293
  }

  /*
  * 用户信息
  */
  userInfo: any = {}
}
