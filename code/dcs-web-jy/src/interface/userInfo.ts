export default interface UserInfo {
  userid?:string
  name: string,
  nick: string,
  phone: string,
  password?: any,
  department: string,
  role: any,
  account: string,
  image?: string,
  office: string,
  state?: any,
  dr_count?: any,
  roles?: {
    app_linkage_command: boolean,
    rs_audit: boolean,
    role_modify: boolean,
    rs_entry: boolean,
    rs_t_manager: boolean,
    d_r_audit: boolean,
    rs_c_manager: boolean,
    app_live_broadcast: boolean
  }
}
