let host = window.location.host
let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'

let dataunitUrl = (flag ? ('http://' + host) : 'http://10.148.83.228:8922') + '/dataunit/'
let swanUrl = dataunitUrl + 'station/renderStationData?datetime={datetime}&element={element}&types[]={type}&top=25&bottom={bottom}&left={left}&right={right}&width={width}&height={height}'

export default {
  rfday: swanUrl.replace('{element}', 'rfday').replace('{type}', 'B').replace('{width}', '900').replace('{height}', '500'),
  rfhour: swanUrl.replace('{element}', 'rfhour').replace('{type}', 'B').replace('{width}', '900').replace('{height}', '500'),
}
