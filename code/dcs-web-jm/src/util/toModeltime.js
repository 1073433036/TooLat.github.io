//任意经纬度模式预报时间转换
export default function (st, et) {
  let starttime = new Date(st).getTime(),
      endtime = new Date(et).getTime();

  starttime -= (8*3600000 + 12*3600000);

  const hour = new Date(starttime).getHours();
  starttime = `${new Date(starttime).Format("yyyy-MM-dd")} ${hour > 11 ? '12' : '00'}:00:00`;
  endtime = new Date(endtime - 8*3600000).Format("yyyy-MM-dd HH:00:00");

  return {
    starttime,
    endtime
  };
}
