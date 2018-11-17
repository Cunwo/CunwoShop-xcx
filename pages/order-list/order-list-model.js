var wxpay = require('../../utils/pay.js')
import { Base } from '../../utils/base.js'

class OrderListModel extends Base {

  //构造函数
  constructor() {
    super();
  }

  getOrderStatistics(token, callback) {
    var param = {
      url: 'order/statistics.do',
      type: 'post',
      data: token,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  getOrderList(token, callback) {
    var param = {
      url: 'order/list.do',
      type: 'post',
      data: token,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  cancelOrder(data, callback) {
    var param = {
      url: 'order/cancel.do',
      type: 'post',
      data: data,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  wxpay(app, money, orderId, orderNo , toPage, callback){

    let remark = "在线充值";
    let nextAction = {};
    if (orderId != 0) {
      remark = "支付订单 ：" + orderId;
      nextAction = { type: 0, id: orderId };
    }

    var data = {
      token: app.globalData.token,
      money: money,
      remark: remark,
      payName: "在线支付",
      nextAction: nextAction
    }

    var payData = {
      token: app.globalData.token,
      money: money,
      remark: remark,
      payName: "在线支付",
      nextAction: nextAction ,
      orderNo : orderNo ,
      orderId : orderId
    }

    var param = {
      url: 'pay/wxpay.do',
      type: 'post',
      data: payData,
      sCallback: function (data) {
        console.log("支付结果"+data)
        callback && callback(data);
      }
    };
    this.javarequest(param);

  }

}

//因为要import，就要在这里export
export { OrderListModel };