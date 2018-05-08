import axios from 'axios';

class Increase {
  //用户信息
  async userInfo () {
    return await axios
    .get('/profile/get');
  }

  // 提额秘籍
  async categories (data) {
    return await axios
    .get('/portal/categories', data)
    .then(res => res);
	}
  // 提额秘籍列表
  async list (data) {
    return await axios
    .get('/portal/lists', data)
    .then(res => res);
	}
  // 提额秘籍详情
  async show (data) {
    return await axios
    .get('/portal/show', data)
    .then(res => res);
	}
  // 点赞
  async like (data) {
    return await axios
    .post('/portal/like', data)
    .then(res => res);
	}
  // 发布
  async save (data) {
    return await axios
    .post('/portal/articles', data)
    .then(res => res);
	}

	// 宜人贷申请步骤
	async getListsG () {
		return await axios.get('/portal/listsG');
	}

}

export default new Increase();