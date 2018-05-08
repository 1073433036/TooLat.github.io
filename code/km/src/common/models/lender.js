import axios from 'axios';

class Lender {

  // 信贷列表
  async list (data) {
    return await axios
    .get('/lender/list', data)
    .then(res => res);
  }

  // 信贷详情
  async show (data) {
    return await axios
    .get('/lender/show', data)
    .then(res => res);
  }

  // 申请人列表
  async nameList (data) {
    return await axios
    .get('/lender/name_list', data)
    .then(res => res);
  }

  // 信贷申请
  async create (data) {
    return await axios
    .post('/lender/create', data)
    .then(res => res);
  }

  // 快捷申请
  async reapply (data) {
    return await axios
    .post('/lender/reapply', data)
    .then(res => res);
  }

  //信用卡办卡进度查询
  async creditCardQuery (data) {
    return await axios
    .post('/user/credit_card_examine/query', data)
    .then(res => res);
  }

  //极验验证码
  async getCaptchaFromService (data) {
    let url = '/home/geetest/index';
    return await axios
    .get(url, data);
  }

  async sendGeettestUrl (url) {
    return await axios
    .get(url);
	}

	// 删除申请人
  async delete (data) {
    return await axios
    .post('/lender/apply_delete', data)
    .then(res => res);
  }

  // 宜人贷额度申请
  async shareApply (data) {
    return await axios
    .get('/lender/yyd_apply', data)
    .then(res => res);
  }
  // 宜人消息推送
  async sendMsg (data) {
    return await axios
    .get('/lender/yyd_send_msg', data)
    .then(res => res);
  }
}

export default new Lender();