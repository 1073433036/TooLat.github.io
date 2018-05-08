import axios from 'axios';

class Portal {

  // 文章列表
  async list (data) {
    return await axios
    .get('/portal/lists', data)
    .then(res => res);
  }

  // 文章详情
  async show (data) {
    return await axios
    .get('/portal/show', data)
    .then(res => res);
  }

  // 文章点赞
  async like (data) {
    return await axios
    .post('/portal/like', data)
    .then(res => res);
  }

  // 分类列表
  async categories (data) {
    return await axios
    .get('/portal/categories', data)
    .then(res => res);
  }
}

export default new Portal();