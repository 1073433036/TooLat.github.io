import axios from 'axios'
import qs from 'qs'
import { ResponseLite } from '../interface/Response'
import UserInfo from '../interface/UserInfo'

export default class UserInfoHttp {
  constructor(){}
  private _prefixUrl: string = 'http://10.148.83.86:8080' //请求路径根地址


  //用户登录
  async userLogin(account: string, password: string): Promise<any> {
    try {
      let url: string = this._prefixUrl + `/JYTY/user/login`;
      let params = qs.stringify({ account, password }, { encode: false });
      let res: any = await axios.post(url, params);
      return res.data.result === 'S_OK' ? res.data.tagObject : [];
    }
    catch {
      throw '用户登录失败，请检查登录接口';
    }
  }

  //用户信息查询
  async selectUsersInfo(params: any|{}): Promise<any> {
    let url: string = this._prefixUrl + `/JYTY/user/select/less`;
    let res: any = await axios.post(url, qs.stringify(params));
    return res.data.result === 'S_OK' ? res.data.tagObject : [];
  }

  //新增用户add
  async addUsersInfo(params: UserInfo): Promise<any> {
    let url: string = this._prefixUrl + `/JYTY/user/register`;
    let res: any = await axios.post(url, qs.stringify(params));
    return res.data.description;
  }

  //修改用户信息
  async editUsersInfo(params: UserInfo): Promise<any> {
    let url: string = this._prefixUrl + `/JYTY/user/modify/info`;
    let res: any = await axios.post(url, qs.stringify(params));
    return res.data.description;
  }

  //修改用户权限信息
  async editUserPower(params:{userId:string,role:string,permission:string}):Promise<boolean>{
    let url = this._prefixUrl+`/JYTY/user/modify/role`
    try {
      let res = await axios.post(url,qs.stringify(params),{
        headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      })
      return res.data.result==='S_OK'?true:false
    }catch (e){
      return false
    }
  }
  //删除用户
  async deleUsers(params: { userIds: string[] }): Promise<boolean> {
    let url: string = this._prefixUrl + `/JYTY/user/delete`;
    let res: any = await axios({
      method:'post',
      url,
      data: params,
      headers: {'Content-Type': 'application/json'}
    });
    return res.data.result === 'S_OK';
  }

  //查找用户权限信息
  async searchUserJurisdiction(params:{ rid?:number, role?:string, place?:string, cname?:string }={}){
    let url = this._prefixUrl + `/JYTY/role/select`
    try {
      let res:any = await axios.post(url,qs.stringify(params))
      return res.data.result === 'S_OK'? res.data.tagObject: false
    }catch (e){
      return false
    }
  }
}
