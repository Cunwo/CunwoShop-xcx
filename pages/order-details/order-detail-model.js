import {
  Base
} from '../../utils/base.js';

class OrderDetails extends Base {
  constructor() {
    super();
  }


  getOrderDetail(orderId, callback) {
    var param = {
      url: 'order/detail.do',
      type: 'post',
      data: {
        "orderId": orderId
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }



  deliveryOrder(orderId, callback) {
    var param = {
      url: 'order/delivery.do',
      type: 'post',
      data: {
        "orderId": orderId
      },
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  reputation(data, callback) {
    var param = {
      url: 'order/reputation.do',
      type: 'post',
      data: data ,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }




}

export {
  OrderDetails
};