let host = window.location.host
let flag = host === '113.108.192.98:8080' || host === '10.12.12.84:8080'

let baseUrl = (flag ? ('http://' + host) : 'http://10.148.83.228:8922') + '/dataunit/'
let swanUrl = baseUrl + 'temporary/renderTemporaryData?datetime={datetime}&type={type}&element={element}&time={time}&level={level}&top={top}&bottom={bottom}&left={left}&right={right}&width={width}&height={height}'
let suffixUrl = 'datetime={datetime}&top={top}&bottom={bottom}&left={left}&right={right}&width={width}&height={height}'
let colorBarUrl = (flag ? ('http://' + host) : 'http://10.148.83.228:8922') + '/other/colortable/renderColorTable?name={el}&tip=&offset=0&width=400&height=24&horizontal=true'

export default {
  qpe1: swanUrl.replace('{type}', 'swan').replace('{element}', 'qpe').replace('{time}', '0').replace('{level}', '0'),
  mtop: swanUrl.replace('{type}', 'swan').replace('{element}', 'mtop').replace('{time}', '0').replace('{level}', '0'),
  mcr: swanUrl.replace('{type}', 'swan').replace('{element}', 'mcr').replace('{time}', '0').replace('{level}', '0'),
  mvil: swanUrl.replace('{type}', 'swan').replace('{element}', 'mvil').replace('{time}', '0').replace('{level}', '0'),
  cappi1: swanUrl.replace('{type}', 'swan').replace('{element}', 'cappi').replace('{time}', '0').replace('{level}', '1'),
  cappi3: swanUrl.replace('{type}', 'swan').replace('{element}', 'cappi').replace('{time}', '0').replace('{level}', '3'),
  cappi5: swanUrl.replace('{type}', 'swan').replace('{element}', 'cappi').replace('{time}', '0').replace('{level}', '5'),
  stmtra: baseUrl + 'stmtra/renderStmtra?' + suffixUrl,
  titan: baseUrl + 'titan/renderTitan?' + suffixUrl,
  qpeColorBar: colorBarUrl.replace('{el}', 'rain'),
  mtopColorBar: colorBarUrl.replace('{el}', 'mtop'),
  mcrColorBar: colorBarUrl.replace('{el}', 'mcr'),
  mvilColorBar: colorBarUrl.replace('{el}', 'mvil'),
  cappiColorBar: colorBarUrl.replace('{el}', 'cappi'),
}
