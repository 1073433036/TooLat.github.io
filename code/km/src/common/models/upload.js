import axios from 'axios';

class Upload {

  // 上传图片
  async uploadImage (data) {
    return await axios
    .post('/user/public/upload_image', data)
    .then(res => res);
  }

  // 识别身份证接口
  async identityInfo (data) {
    return await axios
    .post('/home/index/identity_info', data)
    .then(res => res);
  }

}

export default new Upload();