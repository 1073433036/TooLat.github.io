import axios from 'axios';

class NameCard {

  // 名片详情
  async show (data) {
    return await axios
    .get('/user/name_card/show', data)
    .then(res => res);
  }

}

export default new NameCard();