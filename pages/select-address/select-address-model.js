import { Base } from '../../utils/base.js'

class SelectAddressModel extends Base {

  //构造函数
  constructor() {
    super();
  }

  getShippingList( callback) {
    var param = {
      url: 'shipping/list.do',
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  getUserInfoVo(callback) {
    var param = {
      url: 'user/get_user_info_vo.do',
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }


  updateShippingAddress(data, callback) {
    var param = {
      url: 'user/save.do',
      data: data,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

}

//因为要import，就要在这里export
export { SelectAddressModel };