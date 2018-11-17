import { Base } from '../../utils/base.js'

class GoodsDetailModel extends Base {

  //构造函数
  constructor() {
    super();
  }


  getDetailInfo(id, callback) {
    var param = {
      url: 'product/detail.do?productId=' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }
  getProductPriceInfo(productId, propertyChildIds, callback) {
    var param = {
      url: 'product/price.do?productId=' + productId + '&propertyChildIds=' + propertyChildIds,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

}

//因为要import，就要在这里export
export { GoodsDetailModel };