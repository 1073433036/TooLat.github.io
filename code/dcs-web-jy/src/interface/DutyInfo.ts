export default interface Duty {
  id?: number,
  dutydate: string,               //值班日期
  leader: string,                 //值班领导
  cheif: string,                  //首席岗
  captain_day: string,            //白天领班
  short_impending: string,        //短临
  audit: string,                  //审核
  captain_night: string,          //夜间领班
  emergency_day: string,          //应急白班
  cheif_service: string,          //服务首席
  onbusiness: string,             //出差
  vacation: string,               //休假
  vice_day: string,               //白天副班
  vice_night: string,             //夜间副班
  office: string,                 //办公班
  consultation: string,           //会商
  remark: string                  //备注
}