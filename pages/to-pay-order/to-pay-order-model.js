import { Base } from '../../utils/base.js'

class ToPayOrderModel extends Base {

  //构造函数
  constructor() {
    super();
  }


  createOrder1(params , callback) {
    var param = {
      url: 'order/create.do' ,
      data : params ,
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

  getDefaultShipping(token, callback) {
    var param = {
      url: 'shipping/get.do',
      data: token ,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }



}

//因为要import，就要在这里export
export { ToPayOrderModel };