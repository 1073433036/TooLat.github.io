import Highcharts from 'highcharts';

export const setRainChart = (ele, xArr, values, title) => {
  return new Highcharts.Chart({
    chart: {
      renderTo: ele,
      style: {
        fontFamily: 'Microsoft YaHei'
      }
    },
    title: {
      text: title,
      style: {
        fontSize: "14px"
      }
    },
    exporting: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: xArr,
      tickInterval: 10
    },
    yAxis: {
      min: 0,
      title: {
        text: '降雨量 (mm)'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} mm</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 1,
      shared: true,
      useHTML: true
    },
    plotOptions: {
      area: {
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2,
          states: {
            hover: {
              enabled: true
            }
          }
        }
      }
    },
    series: [{
      name: '累计雨量',
      type: 'area',
      data: values.stat,
      color: '#90ed7d'
    }, {
      name: '逐小时雨量',
      type: 'column',
      data: values.point
    }]
  });
}

export const renderRainChart = (ele, xArr, data, title) => {
  return new Highcharts.Chart({
    chart: {
      renderTo: ele,
      style: {
        fontFamily: 'Microsoft YaHei'
      },
      type: 'column'
    },
    title: {
      text: title,
      style: {
        fontSize: "14px"
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} mm</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 1,
      shared: true,
      useHTML: true
    },
    xAxis: {
      categories: xArr
    },
    yAxis: {
      min: 0,
      title: {
        text: '降雨量 (mm)'
      }
    },
    series: [{
      name: '降雨量',
      data,
    }]
  });
}

export const renderTorrentChart = (ele, xArr, data, title) => {
  return new Highcharts.Chart({
    chart: {
      renderTo: ele,
      style: {
        fontFamily: 'Microsoft YaHei'
      }
    },
    title: {
      text: title,
      style: {
        fontSize: "14px"
      }
    },
    exporting: {
      enabled: true
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: xArr
    },
    yAxis: {
      min: 0,
      title: {
        text: '降雨量 (mm)'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column:{
        borderWidth: 0,
        dataLabels:{
          enabled:true, // dataLabels设为true
          style:{
            color:'#7cb5ec',
            textOutline: 'none'
          }
        }
      }
    },
    series: [{
      name: '雨量阈值',
      type: 'spline',
      data: data.threshold,
      color: '#ea6b6b',
      marker: {
        enabled: false
      },
      dashStyle: 'shortdot'
    }, {
      name: '降雨量',
      type: 'column',
      data: data.rain
    }]
  });
}
