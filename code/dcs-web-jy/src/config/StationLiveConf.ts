export class StationConf {
  static getColorLevel (type, val) {
    if (!val) val = 0
    if (type === 'temp' || type === 'tempdaymax' || type === 'tempdaymin') {      // temp
      if (val >= 40) return 'rgb(163, 9, 2)'
      else if (val >= 38) return 'rgb(183, 17, 2)'
      else if (val >= 36) return 'rgb(202, 30, 2)'
      else if (val >= 34) return 'rgb(223, 46, 2)'
      else if (val >= 32) return 'rgb(242, 65, 0)'
      else if (val >= 30) return 'rgb(252, 130, 0)'
      else if (val >= 28) return 'rgb(255, 195, 0)'
      else if (val >= 26) return 'rgb(255, 240, 0)'
      else if (val >= 24) return 'rgb(243, 238, 3)'
      else if (val >= 22) return 'rgb(185, 218, 4)'
      else if (val >= 20) return 'rgb(78, 202, 2)'
      else if (val >= 18) return 'rgb(15, 192, 13)'
      else if (val >= 16) return 'rgb(0, 207, 85)'
      else if (val >= 14) return 'rgb(1, 220, 186)'
      else if (val >= 12) return 'rgb(0, 201, 243)'
      else if (val >= 10) return 'rgb(9, 171, 218)'
      else if (val >= 8) return 'rgb(23, 95, 193)'
      else if (val >= 6) return 'rgb(43, 50, 155)'
      else if (val >= 4) return 'rgb(75, 18, 160)'
      else if (val >= 2) return 'rgb(112, 38, 176)'
      else if (val >= 0) return 'rgb(150, 61, 188)'
      else if (val >= -1) return 'rgb(169, 75, 192)'
      else if (val >= -5) return 'rgb(219, 118, 223)'
      else return 'rgb(253, 178, 253)'
    }
    else if (type === 'ps') {       // mslp
      if (val >= 1500) return 'rgb(2, 5, 0)'
      else if (val >= 1450) return 'rgb(10, 19, 0)'
      else if (val >= 1400) return 'rgb(25, 45, 1)'
      else if (val >= 1350) return 'rgb(40, 71, 3)'
      else if (val >= 1300) return 'rgb(55, 97, 5)'
      else if (val >= 1250) return 'rgb(70, 123, 6)'
      else if (val >= 1200) return 'rgb(85, 150, 8)'
      else if (val >= 1150) return 'rgb(100, 176, 10)'
      else if (val >= 1100) return 'rgb(115, 198, 11)'
      else if (val >= 1050) return 'rgb(128, 174, 11)'
      else if (val >= 1000) return 'rgb(141, 149, 11)'
      else if (val >= 950) return 'rgb(155, 124, 11)'
      else if (val >= 900) return 'rgb(168, 99, 10)'
      else if (val >= 850) return 'rgb(182, 75, 10)'
      else if (val >= 800) return 'rgb(195, 50, 10)'
      else if (val >= 750) return 'rgb(209, 25, 10)'
      else if (val >= 700) return 'rgb(201, 16, 9)'
      else if (val >= 650) return 'rgb(182, 14, 7)'
      else return 'rgb(164, 13, 6)'
    }
    else if (type === 'rh') {       // rh
      if (val >= 100) return 'rgb(0, 96, 255)'
      else if (val >= 95) return 'rgb(126, 151, 255)'
      else if (val >= 90) return 'rgb(143, 179, 255)'
      else if (val >= 80) return 'rgb(172, 230, 230)'
      else if (val >= 70) return 'rgb(124, 243, 65)'
      else if (val >= 60) return 'rgb(229, 232, 0)'
      else if (val >= 40) return 'rgb(255, 197, 0)'
      else if (val >= 20) return 'rgb(255, 124, 0)'
      else return 'rgb(255, 24, 0)'
    }
    else if (type === 'wd3smaxdf') {        // wind
      if (val >= 40) return 'rgb(94, 0, 94)'
      else if (val >= 38) return 'rgb(158, 0, 158)'
      else if (val >= 36) return 'rgb(223, 0, 223)'
      else if (val >= 34) return 'rgb(255, 0, 204)'
      else if (val >= 32) return 'rgb(255, 0, 102)'
      else if (val >= 30) return 'rgb(255, 0, 0)'
      else if (val >= 28) return 'rgb(247, 94, 0)'
      else if (val >= 26) return 'rgb(238, 187, 0)'
      else if (val >= 24) return 'rgb(187, 228, 10)'
      else if (val >= 22) return 'rgb(94, 216, 31)'
      else if (val >= 20) return 'rgb(0, 204, 51)'
      else if (val >= 18) return 'rgb(14, 181, 133)'
      else if (val >= 16) return 'rgb(29, 158, 214)'
      else if (val >= 14) return 'rgb(66, 161, 255)'
      else if (val >= 12) return 'rgb(125, 190, 255)'
      else return 'rgb(172, 202, 232)'
    }
    else if (type === 'rfhour' || type === 'rfday') {       // rain
      if (val >= 100) return 'rgb(165, 0, 10)'
      else if (val >= 75) return 'rgb(255, 0, 0)'
      else if (val >= 50) return 'rgb(255, 50, 0)'
      else if (val >= 45) return 'rgb(255, 96, 0)'
      else if (val >= 40) return 'rgb(255, 192, 60)'
      else if (val >= 35) return 'rgb(255, 232, 120)'
      else if (val >= 30) return 'rgb(226, 220, 116)'
      else if (val >= 25) return 'rgb(30, 180, 30)'
      else if (val >= 20) return 'rgb(55, 210, 60)'
      else if (val >= 15) return 'rgb(80, 240, 80)'
      else if (val >= 10) return 'rgb(150, 245, 140)'
      else if (val >= 5) return 'rgb(169, 214, 161)'
      else if (val >= 4) return 'rgb(30, 140, 200)'
      else if (val >= 3) return 'rgb(60, 170, 230)'
      else if (val >= 2) return 'rgb(75, 180, 240)'
      else if (val >= 1) return 'rgb(130, 210, 255)'
      else return 'rgb(162, 224, 239)'
    }
  }
}