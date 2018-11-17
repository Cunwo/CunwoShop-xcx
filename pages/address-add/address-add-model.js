import { Base } from '../../utils/base.js'

class AddressAddModel extends Base {

  //构造函数
  constructor() {
    super();
  }


  getAddressDetail(shippingId, callback) {
    var param = {
      url: 'shipping/get.do?shippingId='+shippingId,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }
  
  addOrUpdateShippingAddress(resdata, apiAddOrUpdate, callback) {
    var param = {
      url: 'shipping/' + apiAddOrUpdate ,
      data: resdata ,
      type : 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  delShippingAddress(id,  callback) {
    var param = {
      url: 'shipping/del.do?shippingId= ' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }



}

//因为要import，就要在这里export
export { AddressAddModel };