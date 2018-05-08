import axios from 'axios';

class Friend {

  // 好友列表 同行圈列表
  async list (data) {
    return await axios
    .get('/user/friend/list', data)
    .then(res => res);
  }

  // 找同行
  async peerList (data) {
    return await axios
    .get('/user/peer/list', data)
    .then(res => res);
  }

  // 同行详细
  async info (data) {
    return await axios
    .get('/user/peer/info', data)
    .then(res => res);
  }

  // 申请添加好友
  async apply (data) {
    return await axios
    .post('/user/friend/apply', data)
    .then(res => res);
  }

  // 好友申请列表
  async applyList (data) {
    return await axios
    .get('/user/friend/apply_list', data)
    .then(res => res);
  }

  // 拒绝添加好友（删除申请）
  async disagree (data) {
    return await axios
    .post('/user/friend/disagree', data)
    .then(res => res);
  }

  // 同意添加好友
  async agree (data) {
    return await axios
    .post('/user/friend/agree', data)
    .then(res => res);
  }


}

export default new Friend();