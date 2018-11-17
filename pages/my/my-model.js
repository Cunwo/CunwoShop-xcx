import { Base } from '../../utils/base.js'

class MyModel extends Base {

  //构造函数
  constructor() {
    super();
  }

  getUserApiInfo(data, callback) {
    var param = {
      url: 'user/get_user_info_vo.do',
      type: 'post',
      data: data,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

}

//因为要import，就要在这里export
export { MyModel };