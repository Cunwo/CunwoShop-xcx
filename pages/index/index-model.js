import { Base } from '../../utils/base.js'

class Model extends Base {

  //构造函数
  constructor() {
    super();
  }

  //获得公告
  getNoticeData(pageNum, pageSize, callback) {
    var params = {
      url: 'notice/list.do?pageNum=' + pageNum + '&pageSize=' + pageSize,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);
  }


  

  //获得轮播图数据
  getBannerData(bannerId, callback) {
    var params = {
      url: 'banner/list.do?bannerId=' + bannerId,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);
  }

  //获得分类数据
  getCategoryData(categoryId, callback) {
    var params = {
      url: 'category/get_category.do?categoryId=' + categoryId,
      sCallback: function (res) {
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);
  }

  //首页主题
  getThemeData(callback) {
    var param = {
      url: 'theme?ids=1,2,3',
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    //这里继承了，可以直接用
    this.request(param);
  }

  // 最新商品
  getProductsData(keyword, categoryId, pageNum, pageSize, orderBy, callback) {


    var param = {
     // url: 'product/list.do?pageNum=' + pageNum + '&pageSize=' + pageSize + '&keyword=' + keyword + '&categoryId=' + categoryId + '&orderBy=' + orderBy ,
      url: 'product/list.do',
      data: {
        keyword: keyword,
      //  categoryId: categoryId,
        categoryIds: categoryId,
        pageNum: pageNum,
        pageSize: pageSize,
        orderBy: orderBy
      },
      type: 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(param);
  }

}

//因为要import，就要在这里export
export { Model };