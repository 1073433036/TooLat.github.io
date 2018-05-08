import axios from 'axios';

class Advertise {
  //栏目分类列表
  async categoriesType (data) {
    return await axios
    .get('/portal/categories', {
      params: data
    });
  }

  //该分类文章列表
  async articleList (data) {
    return await axios
    .get('/portal/lists', {
      params: data
    });
  }

  //文章详细内容
  async articleDetail (data) {
    return await axios
    .get('/portal/show', {
      params: data
    });
  }

  //文章评论
  async articleComments (data) {
    return await axios
    .get('/portal/comment_list', {
      params: data
    });
  }

  //点赞
  async postLike (data) {
    return await axios
    .post('/portal/like', data);
  }

  //发布文章评论
  async commentArticle (data) {
    return await axios
    .post('/portal/create_comment', data);
  }

  //上传发布文章
  async uploadArticle (data) {
    return await axios
    .post('/portal/articles', data);
  }

  //七牛上传认证
  async uploadToken () {
    return await axios
    .get('/home/index/upload_token');
  }


  // 个人文章删除
  async deletePost (data) {
    return await axios
    .post('/portal/articles/delete_post', data);
  }

  // 我的文章数据统计
  async myPostData (data) {
    return await axios
    .get('/portal/articles/my_post_data', data);
  }

}

export default new Advertise();