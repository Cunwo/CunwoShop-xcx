import {Base} from '../../utils/base.js'

class Search extends Base{
  constructor(){
    super()
  }




  // 最新商品
  getProductsData(data  , callback) {
    console.log("aaaaaa")
    var param = {
      url: 'product/list.do',
      data : data , 
      type : 'POST',
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(param);
  }



}

export { Search}