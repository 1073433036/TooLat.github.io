import moment from 'moment'

//任意经纬度模式预报时间转换
export default function (st, et) {
  let starttime: number | string = new Date(st).getTime(),
      endtime: number | string = new Date(et).getTime();
  let timeInt = (endtime - starttime) / 3600000

  starttime -= (8*3600000 + 12*3600000);

  const hour = new Date(starttime).getHours();
  starttime = `${moment(new Date(starttime)).format("YYYY-MM-DD")} ${hour > 11 ? '12' : '00'}:00:00`;
  endtime = new Date(starttime.replace(/-/g, '/')).getTime() + timeInt * 3600000
  endtime = moment(new Date(endtime)).format("YYYY-MM-DD HH:00:00");

  return {
    starttime,
    endtime
  };
}