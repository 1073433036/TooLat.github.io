
/**
  * 用法：在实例里面
  * this.$rules.phone(13800138000);
  */

export default {
  // 邮箱
  email (value) {
    let pattern = /^([a-z0-9\+\_\-]+)(\.[a-z0-9\+\_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 手机号码
  phone (value) {
    let pattern = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },


  // 手机号码段
  checkPhone (value) {
    let arr   = '170|171|178|188|183|187|147|198|182|166';
    let split = arr.split('|');
    if (-1 !== split.indexOf(value)) {
      return true;
    }
    return false;
  },

  // 密码
  password (value) {
    let pattern = /^(\S){6,12}$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 身份证
  identity (value) {
    let pattern = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 银行卡
  bank (value) {
    let pattern = /^(\d{16,19})$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 信用卡
  creditCard (value) {
    let pattern = /^(\d{15,19})$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 储蓄银行卡
  depositBank (value) {
    let pattern = /^(\d{19})$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 验证码
  smsCode (value) {
    let pattern = /^[0-9]{6}$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },


  // 金额
  money (value) {
    let pattern = /^(([1-9]{1}\d*.)|((\d){1,2})|([0]{1}\d*.))(\.(\d){1,2})?$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 日期
  date (value) {
    let pattern = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 正整数
  integer (value) {
    let pattern = /^\+?[1-9][0-9]*$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },

  // 车牌号码
  vehicleNumber (value) {
    let pattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/;
    if (value) {
      return pattern.test(value) || false;
    }
    return pattern;
  },
};