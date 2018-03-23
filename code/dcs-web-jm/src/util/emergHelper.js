export class EmergResponse {
  constructor($http, regionConfig) {
    this._$http = $http;
    this._regionConfig = regionConfig;
    this._urlStore = {
      baseUrl: 'http://10.148.83.228:1995/JmDcs/',
      styLanded: 'selection/last/24h/sty/landed',                      //检测24小时内，是否有强台风以上登陆所在市
      tyLanded: 'selection/last/24h/ty/landed',                        //检测24小时内，是否有台风登陆所在市
      tsLanded_48: 'selection/last/48h/ts/landed',                     //检测48小时内，是否有热带风暴或强热带风暴登陆所在市
      tsLanded_72: 'selection/last/72h/ts/landed',                     //检测72小时内，是否有热带风暴或强热带风暴登陆所在市
      styWind: 'selection/last/24h/sty/windOverLevel8',                //检测24小时内，是否有强台风影响所在市，导致8级以上大风
      tyWind: 'selection/last/24h/ty/windOverLevel8',                  //检测24小时内，是否有台风影响所在市，导致8级以上大风
      tsWind_48: 'selection/last/48h/ts/windOverLevel8',               //检测48小时内，是否有热带风暴或强热带风暴影响所在市,导致8级以上大风
      tsWind_72: 'selection/last/72h/ts/windOverLevel8',               //检测72小时内，是否有热带风暴或强热带风暴影响所在市,导致8级以上大风
      rainPast: 'selection/last/n_days/rain/heavier_than_x',           //检测过去n天内，雨量是否超过x个单位
      rainFore: 'selection/forecast/n_days/rain/heavier_than_x',       //检测未来n天内，雨量是否超过x个单位
      maxTempPast: 'selection/last/n_days/max_temp/higher_than_x',     //检测过去n天内，每日的最高温度是否超过x个单位
      maxTempFore: 'selection/forecast/n_days/max_temp/higher_than_x', //检测未来n天内，每日的最高温度是否超过x个单位
      minTempPast: 'selection/last/n_days/min_temp/lower_than_x',      //检测过去n天内，每日的最低温度是否低于x个单位
      minTempFore: 'selection/forecast/n_days/min_temp/lower_than_x',  //检测未来n天内，每日的最低温度是否低于x个单位
      avgTempPast: 'selection/last/n_days/avg_temp/lower_than_x',      //检测过去n天内，每日的平均温度是否超过x个单位
      avgTempFore: 'selection/forecast/n_days/avg_temp/lower_than_x',  //检测未来n天内，每日的平均温度是否超过x个单位
    };
    this._descConfig = {
      tyRed: '预计未来24小时内将有强台风以上级别的热带气旋登陆或有8级以上大风和大暴雨严重影响我市',
      tyOrange: '预计未来24小时内将有台风以上级别的热带气旋登陆或有8级以上大风和大暴雨严重影响我市',
      tyYellow: '预计未来48小时内将有热带风暴以上级别的热带气旋登陆或有8级以上大风和大暴雨严重影响我市',
      tyBlue: '预计未来72小时内将有热带风暴以上级别的热带气旋登陆或有8级以上大风和大暴雨严重影响我市',
      styLanded: '预计未来24小时内将有强台风以上级别的热带气旋登陆我市',
      tyLanded: '预计未来24小时内将有台风以上级别的热带气旋登陆我市',
      tsLanded_48: '预计未来48小时内将有热带风暴以上级别的热带气旋登陆我市',
      tsLanded_72: '预计未来72小时内将有热带风暴以上级别的热带气旋登陆我市',
      styWind: '预计未来24小时内将有强台风以上级别的热带气旋带来8级以上大风或大暴雨严重影响我市',
      tyWind: '预计未来24小时内将有台风以上级别的热带气旋带来8级以上大风或大暴雨严重影响我市',
      tsWind_48: '预计未来48小时内将有热带风暴以上级别的热带气旋带来8级以上大风或大暴雨严重影响我市',
      tsWind_72: '预计未来72小时内将有热带风暴以上级别的热带气旋带来8级以上大风或大暴雨严重影响我市',
    };
    this._countyName = {
      "蓬江": '蓬江区',
      "江海": '江海区',
      "新会": '新会区',
      "恩平": '恩平市',
      "开平": '开平市',
      "台山": '台山市',
      "鹤山": '鹤山市'
    };
    this._rainfall = {
      'T': 250,  //特大暴雨
      'L': 100,  //大暴雨
      'M': 50    //暴雨
    }
  }

  async typhoonMonitor() {
    let $http = this._$http,
        urlStore = this._urlStore,
        descConf = this._descConfig,
        regionConf = this._regionConfig;

    try {
      const reqAttrs = ['styLanded', 'tyLanded', 'tsLanded_48', 'tsLanded_72', 'styWind', 'tyWind', 'tsWind_48', 'tsWind_72'];

      let promises = reqAttrs.map((attr) => $http.jsonp(`${urlStore.baseUrl}${urlStore[attr]}?cityId=${regionConf.cityId}`));
      let responses = [];
      for(let promise of promises) {
        responses.push(await promise);
      }

      let emergMsgs = {
        red: { hasEmerg: false, msg: '' },
        orange: { hasEmerg: false, msg: '' },
        yellow: { hasEmerg: false, msg: '' },
        blue: { hasEmerg: false, msg: '' }
      };
      reqAttrs.forEach((attr, index) => {
        let response = responses[index];
        let data = response.data;
        if(data === true || data === 'true') {
          if(attr === 'styLanded' || attr === 'styWind') {
            emergMsgs.red.hasEmerg = true;
            emergMsgs.red.msg = (attr === 'styWind' && emergMsgs.red.msg.length) ? descConf.tyRed : descConf[attr];
          }
          else if(attr === 'tyLanded' || attr === 'tyWind') {
            emergMsgs.orange.hasEmerg = true;
            emergMsgs.orange.msg = (attr === 'tyWind' && emergMsgs.orange.msg.length) ? descConf.tyOrange : descConf[attr];
          }
          else if(attr === 'tsLanded_48' || attr === 'tsWind_48') {
            emergMsgs.yellow.hasEmerg = true;
            emergMsgs.yellow.msg = (attr === 'tyWind' && emergMsgs.yellow.msg.length) ? descConf.tyYellow : descConf[attr];
          }
          else if(attr === 'tsLanded_72' || attr === 'tsWind_72') {
            emergMsgs.blue.hasEmerg = true;
            emergMsgs.blue.msg = (attr === 'tyWind' && emergMsgs.blue.msg.length) ? descConf.tyBlue : descConf[attr];
          }
        }
      });
      return emergMsgs;
    }
    catch(err) {
      console.error(err);
    }
  }

  async rainMonitor() {
    try {
      let rainfall = this._rainfall;
      let responses = await this._getRainResponses([
        ['past', 1, rainfall.T],      //过去24小时哪些市（区）出现特大暴雨
        ['past', 1, rainfall.L],      //过去24小时哪些市（区）出现大暴雨
        ['fore', 1, rainfall.M/3],      //预计未来24小时哪些市（区）将出现暴雨以上降水
        ['fore', 1, rainfall.L/3]       //预计未来24小时哪些市（区）将出现大暴雨降水
      ]);

      let countyArray = this._getCountyArray(responses);

      let emergResult = {
        red: this.rainMonitorRed([countyArray[0], countyArray[1], countyArray[3]]),
        orange: this.rainMonitorOrange(countyArray),
        yellow: this.rainMonitorYellow([countyArray[1], countyArray[2], countyArray[3]]),
        blue: this.rainMonitorBlue(countyArray[3])
      }

      return emergResult;
    }
    catch(err) {
      console.log(err);
    }
  }

  async maxTempMonitor() {
    try {
      let responses = await this._getTempResponse('max', [
        ['past', 2, 37],     //哪些市（区）已经连续2天出现37℃以上高温天气
        ['past', 2, 39],     //哪些市（区）已经连续2天出现39℃以上高温天气
        ['past', 2, 35],     //哪些市（区）已经连续2天出现35℃以上高温天气
        ['fore', 2, 37],     //哪些市（区）仍将持续2天以上37℃以上高温天气
        ['fore', 2, 35]      //哪些市（区）仍将持续2天以上35℃以上高温天气
      ]);
      let countyArray = this._getCountyArray(responses);

      let emergResult = {
        red: this.maxTempRed([countyArray[0], countyArray[1], countyArray[3]]),
        orange: this.maxTempOrange([countyArray[0], countyArray[3]]),
        yellow: this.maxTempYellow([countyArray[2], countyArray[0], countyArray[4]]),
        blue: this.maxTempBlue([countyArray[2], countyArray[4]])
      };

      return emergResult;
    }
    catch(err) {
      console.log('failed to get maxTemp monitor results');
    }
  }

  async minTempMonitor() {
    try {
      let responsesMin = await this._getTempResponse('min', [
        ['past', 1, 3],     //哪些市（区）最低气温已降至3℃或以下
        ['past', 1, 0],     //哪些市（区）出现0℃以下低温
        ['past', 1, 5],     //哪些市（区）最低气温已降至5℃或以下
        ['fore', 2, 3],     //哪些市（区）3℃以下低温天气仍将持续2天以上
        ['fore', 2, 5]      //哪些市（区）5℃以下低温天气将持续2天以上
      ]);
      let responsesAvg = await this._getTempResponse('avg', [
        ['past', 3, 10],    //哪些市（区）已连续3天日平均气温降至10℃或以下
        ['fore', 3, 10]     //哪些市（区）日平均气温低于10℃的天气将持续3天以上
      ]);
      let countyArrayMin = this._getCountyArray(responsesMin),
          countyArrayAvg = this._getCountyArray(responsesAvg);

      let emergResult = {
        red: this.minTempRed([countyArrayMin[0], countyArrayMin[1], countyArrayMin[3]]),
        orange: this.minTempOrange([countyArrayMin[2], countyArrayMin[0], countyArrayMin[4]]),
        yellow: this.minTempYellow([countyArrayMin[2], countyArrayMin[4]]),
        blue: this.minTempBlue(countyArrayAvg)
      };

      return emergResult;
    }
    catch(err) {
      console.log('failed to get maxTemp monitor results');
    }
  }

  async _getTempResponse(type, arr) {
    let responses = [];
    for(let p of arr) {
      let promise = this._getTempPromise(type, ...p);
      responses.push(promise);
    }
    return responses;
  }

  async _getRainResponses(arr) {
    let responses = [];
    for(let p of arr) {
      let promise = this._getRainPromise(...p);
      responses.push(await promise);
    }
    return responses;
  }

  /*  暴雨Ⅰ级预警监控,
   *  判别条件：
   *  过去24小时全市三分之一以上市（区）出现特大暴雨，
   *  或三分之二以上市（区）出现大暴雨，并造成严重影响，
   *  且预计未来24小时上述地区仍将出现暴雨以上降水。
   */
  rainMonitorRed(countyArray) {
    let countyName = this._countyName;
    let hasEmerg = true,
        emergMsg = '';

    let countyArr1 = countyArray[0],
        countyArr2 = countyArray[1],
        countyArr3 = countyArray[2];

    if(!countyArr1.length && !countyArr2.length || !countyArr3.length)
      return { hasEmerg, emergMsg };

    hasEmerg = true;
    let sum = Object.keys(countyName).length;
    if(countyArr1.length/sum >= 1/3) {
      for(let ct of countyArr1) {
        if(!countyArr3.includes(ct))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `过去24小时全市三分之一以上市(区)(包括${countyArr1.join("，")})出现特大暴雨`;
    }
    if(countyArr2.length >= 2/3) {
      for(let ct of countyArr2) {
        if(!countyArr3.includes(ct))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg += `${emergMsg === '' ? '过去24小时全市' : '，和'}三分之二以上市(区)(包括${countyArr1.join("，")})出现大暴雨,并造成严重影响`;
    }
    if(hasEmerg && emergMsg !== '')
      emergMsg += '，且预计未来24小时上述地区仍将出现暴雨以上降水。';

    return { hasEmerg, emergMsg };
  }

  /*  暴雨Ⅱ级预警监控,
   *  判别条件：
   *  过去24小时全市1个以上市（区）出现特大暴雨，
   *  或二分之一以上市（区）出现大暴雨，并造成严重影响，
   *  且预计未来24小时上述地区仍将出现暴雨以上降水；
   *  或者预计未来24小时全市有三分之二以上市（区）将出现大暴雨降水
   */
  rainMonitorOrange(countyArray) {
    let countyName = this._countyName;
    let hasEmerg = true,
        emergMsg = '';

    let countyArr1 = countyArray[0],
        countyArr2 = countyArray[1],
        countyArr3 = countyArray[2],
        countyArr4 = countyArray[3];

    if((!countyArr1.length && !countyArr2.length) || (!countyArr3.length && !countyArr4.length))
      return { hasEmerg, emergMsg };

    hasEmerg = true;
    let hasTwoPart = countyArr4.length/Object.keys(countyName).length >= 2/3;   //是否未来24小时全市有三分之二以上市（区）将出现大暴雨降水
    if(countyArr1.length >= 1) {
      for(let ct of countyArr1) {
        if(!countyArr3.includes(ct) && !hasTwoPart)
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `过去24小时全市1个以上市(区)(包括${countyArr1.join("，")})出现特大暴雨`;
    }

    if(countyArr2.length >= 0.5) {
      for(let ct of countyArr2) {
        if(!countyArr3.includes(ct) && !hasTwoPart)
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg += `${emergMsg === '' ? '过去24小时全市' : '，或'}二分之一以上市(区)(包括${countyArr1.join("，")})出现大暴雨,并造成严重影响`;
    }

    if(hasEmerg && emergMsg !== '') {
      emergMsg += '，且预计未来24小时上述地区仍将出现暴雨以上降水';
      if(hasTwoPart)
        emergMsg += `，未来24小时全市有三分之二以上市(区)(包括${countyArr4.join('，')})将出现大暴雨降水。`;
    }

    return { hasEmerg, emergMsg };
  }

  /*  暴雨Ⅲ级预警监控,
   *  判别条件：
   *  过去24小时全市三分之一以上市（区）出现大暴雨天气，
   *  且预计未来24小时上述地区仍将出现暴雨天气；
   *  或者预计未来24小时全市有二分之一以上市（区）将出现大暴雨降水
   */
  rainMonitorYellow(countyArray) {
    let countyName = this._countyName;
    let hasEmerg = false,
        emergMsg = '';

    let countyArr1 = countyArray[0],
        countyArr2 = countyArray[1],
        countyArr3 = countyArray[2];

    if(!countyArr1.length || (!countyArr2.length && !countyArr3.length))
      return { hasEmerg, emergMsg };

    hasEmerg = true;
    let sum = Object.keys(countyName).length;
    let hasOneThird = countyArr1.length/sum >= 1/3,   //是否过去24小时全市三分之一以上市（区）出现大暴雨天气
        hasHalf = countyArr3.length/sum >= 0.5;

    if(hasOneThird) {
      emergMsg += `过去24小时全市三分之一以上市(区)(包括${countyArr1.join("，")})出现大暴雨天气`;
      for(let ct of countyArr1) {
        if(!countyArr2.includes(ct) && !hasHalf)
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg += `，且预计未来24小时上述地区仍将出现暴雨天气`;
    } else {
      return false;
    }

    if(hasEmerg && hasHalf) {
      emergMsg += `，预计未来24小时全市有二分之一以上市(区)(包括${countyArr3.join('，')})将出现大暴雨降水`;
    }

    return { hasEmerg, emergMsg };
  }

  /*  暴雨Ⅳ级预警监控,
   *  判别条件：
   *  预计未来24小时全市有三分之一以上市（区）将出现大暴雨降水
   */
  rainMonitorBlue(countyArray) {
    if(!countyArray.length || countyArray.length/Object.keys(this._countyName).length < 1/3)
      return { hasEmerg: false, emergMsg: '' };
    else
      return { hasEmerg: true, emergMsg: '预计未来24小时全市有三分之一以上市（区）将出现大暴雨降水' };
  }

  /*  高温Ⅰ级预警监控,
   *  判别条件：
   *  全市三分之二以上市（区）已经连续2天出现37℃以上高温天气，
   *  且1个市（区）出现39℃以上高温，
   *  预计上述地区37℃以上高温天气仍将持续（2天）
   */
  maxTempRed(countyArray) {
    let countyName = this._countyName;
    let hasEmerg = false,
        emergMsg = '';

    let past37 = countyArray[0],
        past39 = countyArray[1],
        fst37 = countyArray[2];

    let sum = Object.keys(countyName).length;
    if(past37.length/sum >= 2/3 && past39.length > 0 && fst37.length) {
      hasEmerg = true;
      for(let name of past37) {
        if(!fst37.includes(name))
          hasEmerg = false;
      }
      if(hasEmerg) {
        emergMsg = `全市三分之二以上市(区)(包括${past37.join('，')})已经连续2天出现37℃以上高温天气，
            且1个以上市(区)(包括${past39.join('，')})出现39℃以上高温，预计上述地区37℃以上高温天气仍将持续。`;
      }
    }

    return { hasEmerg, emergMsg };
  }

  /*  高温Ⅱ级预警监控,
   *  判别条件：
   *  全市三分之二以上市（区）已经连续2天出现37℃以上高温天气，
   *  预计上述地区37℃以上高温天气仍将持续（2天）
   */
  maxTempOrange(countyArray) {
    let hasEmerg = false,
        emergMsg = '';

    let past37 = countyArray[0],
        fst37 = countyArray[1];

    let sum = Object.keys(this._countyName).length;
    if(past37.length/sum >= 2/3 && fst37.length) {
      hasEmerg = true;
      for(let name of past37) {
        if(!fst37.includes(name))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `全市三分之二以上市(区)(包括${past37.join('，')})已经连续2天出现37℃以上高温天气，预计上述地区37℃以上高温天气仍将持续。`;
    }

    return { hasEmerg, emergMsg };
  }

  /*  高温Ⅲ级预警监控,
   *  判别条件：
   *  全市全部市（区）已经连续2天出现35℃以上高温，
   *  且三分之一以上市（区）出现37℃以上高温，
   *  预计全市35℃以上的高温天气将持续2天以上
   */
  maxTempYellow(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past35 = countyArray[0],
        past37 = countyArray[1],
        fst35 = countyArray[2];

    let sum = Object.keys(this._countyName).length;
    if(past35.length >= sum && past37/sum >= 1/3 && fst35.length >= sum) {
      hasEmerg = true;
      emergMsg = `全市全部市（区）已经连续2天出现35℃以上高温，
          且三分之一以上市(区)(包括${past37.join('，')})出现37℃以上高温，预计全市35℃以上的高温天气将持续2天以上`;
    }
    return { hasEmerg, emergMsg };
  }

  /*  高温Ⅳ级预警监控,
   *  判别条件：
   *  全市全部市（区）已经连续2天出现35℃以上高温，
   *  预计全市35℃以上的高温天气将持续2天以上。
   */
  maxTempBlue(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past35 = countyArray[0],
        fst35 = countyArray[1];
    let countySum = Object.keys(this._countyName).length;
    if(past35.length >= countySum && fst35.length >= countySum) {
      hasEmerg = true;
      emergMsg = '全市全部市（区）已经连续2天出现35℃以上高温，预计全市35℃以上的高温天气将持续2天以上。';
    }
    return { hasEmerg, emergMsg };
  }

  /*  寒冷Ⅰ级预警监控,
   *  判别条件：
   *  全市三分之二以上市（区）最低气温已降至3℃或以下，
   *  且1个市（区）出现0℃以下低温，
   *  预计上述地区3℃以下低温天气仍将持续。
   */
  minTempRed(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past3 = countyArray[0],
        past0 = countyArray[1],
        fst3 = countyArray[2];

    let countySum = Object.keys(this._countyName).length;
    if(past3.length/countySum >= 2/3 && past0.length && fst3.length) {
      hasEmerg = true;
      for(let name of past3) {
        if(!fst3.includes(name))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `全市三分之二以上市(区)(包括${past3.join('，')})最低气温已降至3℃或以下，
            且1个以上市(区)(包括${past0.join('，')})出现0℃以下低温，预计上述地区3℃以下低温天气仍将持续。`;
    }
    return { hasEmerg, emergMsg };
  }

  /*  寒冷Ⅱ级预警监控,
   *  判别条件：
   *  全市全部市（区）最低气温已降至5℃或以下，
   *  且1个市（区）出现3℃以下低温，
   *  预计上述地区5℃以下低温天气将持续2天以上。
   */
  minTempOrange(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past5 = countyArray[0],
        past3 = countyArray[1],
        fst5 = countyArray[2];
    let countySum = Object.keys(this._countyName).length;
    if(past5.length >= countySum && past3.length && fst5.length >= countySum) {
      hasEmerg = true;
      emergMsg = `全市全部市（区）最低气温已降至5℃或以下，且1个以上市(区)(包括${past3.join('，')})出现3℃以下低温，
          预计上述地区5℃以下低温天气将持续2天以上。`;
    }

    return { hasEmerg, emergMsg };
  }

  /*  寒冷Ⅲ级预警监控,
   *  判别条件：
   *  全市三分之二以上市（区）最低气温已降至5℃或以下，
   *  预计上述地区5℃以下低温天气将持续2天以上。
   */
  minTempYellow(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past5 = countyArray[0],
        fst5 = countyArray[1];
    let countySum = Object.keys(this._countyName).length;
    if(past5.length/countySum >= 2/3 && fst5.length) {
      hasEmerg = true;
      for(let name of past5) {
        if(!fst5.includes(name))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `全市三分之二以上市(区)(包括${past5.join('，')})最低气温已降至5℃或以下，预计上述地区5℃以下低温天气将持续2天以上。`;
    }
    return { hasEmerg, emergMsg };
  }

  /*  寒冷Ⅳ级预警监控,
   *  判别条件：
   *  全市三分之二以上市（区）已连续3天日平均气温降至10℃或以下，
   *  预计上述地区日平均气温低于10℃的天气将持续3天以上。
   */
  minTempBlue(countyArray) {
    let hasEmerg = false,
        emergMsg = '';
    let past10 = countyArray[0],
        fst10 = countyArray[1];
    let countySum = Object.keys(this._countyName).length;
    if(past10.length/countySum >= 2/3 && fst10.length) {
      hasEmerg = true;
      for(let name of past10) {
        if(!fst10.includes(name))
          hasEmerg = false;
      }
      if(hasEmerg)
        emergMsg = `全市三分之二以上市(区)(包括${past10.join('，')})已连续3天日平均气温降至10℃或以下，预计上述地区日平均气温低于10℃的天气将持续3天以上。`;
    }
    return { hasEmerg, emergMsg };
  }

  _getTempPromise(tempType, type, n, x) {
    const urlStore = this._urlStore;
    let subUrl;
    if(tempType === 'max') {
      subUrl = type === 'past' ? urlStore.maxTempPast : urlStore.maxTempFore;
    } else if(tempType === 'min') {
      subUrl = type === 'past' ? urlStore.minTempPast : urlStore.minTempFore;
    } else {
      subUrl = type === 'past' ? urlStore.avgTempPast : urlStore.avgTempFore;
    }
    return this._$http.jsonp(`${urlStore.baseUrl}${subUrl}?n=${n}&x=${x}`);
  }

  _getRainPromise(type, n, x) {
    const urlStore = this._urlStore;
    return this._$http.jsonp(`${urlStore.baseUrl}${type === 'past' ? urlStore.rainPast : urlStore.rainFore}?n=${n}&x=${x}`);
  }

  _getCountyArray(responses) {
    let countyName = this._countyName;
    let arrSet = [];
    for(let res of responses) {
      arrSet.push([]);
    }
    responses.forEach((res, index) => {
      let data = res.data;
      if(this._isObject(data)) {
        for(let i in data) {
          data[i] && arrSet[index].push(countyName[i]);
        }
      }
    });

    return arrSet;
  }

  _isObject(obj) {
    return Object.prototype.toString.call(obj).indexOf('Object') >= 0;
  }
}
