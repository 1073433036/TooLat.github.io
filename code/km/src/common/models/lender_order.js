import axios from 'axios';

class LenderOrder {

  // 申请成为信贷经理
  async managerApply (data) {
    return await axios
    .post('/lender_order/manager_apply', data)
    .then(res => res);
  }

}

export default new LenderOrder();