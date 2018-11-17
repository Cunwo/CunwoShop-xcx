import { Base } from '../../utils/base.js'

class Model extends Base {

  //构造函数
  constructor() {
    super();
  }

  //获得公告
  getNoticeDetail(noticeId, callback) {
    var params = {
      url: 'notice/detail.do?noticeId=' + noticeId,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);
  }

}

//因为要import，就要在这里export
export { Model };