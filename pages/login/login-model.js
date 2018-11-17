import { Base } from '../../utils/base.js'

class Login extends Base {

  //构造函数
  constructor() {
    super();
  }

  login(token, callback) {
    var param = {
      url: 'user/login_by_code.do',
      type: 'post',
      data: token,
      sCallback: function (data) {
     
        callback && callback(data);
      }
    };
    this.javarequest(param);
  }

}

//因为要import，就要在这里export
export { Login };