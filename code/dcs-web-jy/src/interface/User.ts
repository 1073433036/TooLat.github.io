export default interface User {
  username: string   //用户名
  password: string   //密码
  department: string  //所属部门
  role: 'unlogin' | 'ordinary' | 'admin' | 'commander' | 'rescuer'  //角色: 普通用户 | 管理员 | 指挥员 | 救援人员
  realname: string  //真实姓名
  phone: string  //联系手机
}