const app = getApp()

import {
  Config
} from '../utils/config.js'

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  request(params) {
    var url = this.baseRequestUrl + params.url;
    //如果没有传type默认设置为get
    if (!params.type) {
      params.type = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        // 'content-type':'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync('token'),
        Cookie: "JSESSIONID=" + wx.getStorageSync('Cookie'),
      },
      success: function(res) {
        // if(params.sCallBack){
        //   params.sCallBack(res);
        // }
        //和上面一个意思的简洁写法
        params.sCallback && params.sCallback(res.data);
      },
      fail: function(err) {

      }
    })
  }



  javarequest(params) {
    var that = this;
   // var url = 'http://localhost:8080/' + app.globalData.subDomain + "/"+params.url;
    var url = app.globalData.apiDomain + app.globalData.subDomain + "/" + params.url;
    //如果没有传type默认设置为get
    if (!params.type) {
      params.type = 'POST';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/x-www-form-urlencoded;;charset=utf-8',
        //'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
        'appid': 'wx66ab99b6761189a0',
        // Cookie: "JSESSIONID=" + wx.getStorageSync('Cookie'),
      },
      success: function(res) {
       
        //和上面一个意思的简洁写法
        // if (res.header['Set-Cookie'] != null) {
        //   wx.setStorageSync('Cookie', res.header['Set-Cookie'].split(";")[0].split("=")[1]);
        // }

        //登陆
        if (res.data.status == 10) {
          that.doLogin();
        }

        params.sCallback && params.sCallback(res.data);
      },
      fail: function(err) {

      }
    })
  }

  // 最新商品
  getProductsData(keyword, categoryId, categoryIds , pageNum, pageSize, orderBy, callback) {
    var param = {
      url: 'product/list.do',
      data : {
        pageNum :pageNum ,
        pageSize: pageSize ,
        keyword: keyword ,
        categoryId: categoryId ,
        categoryIds: categoryIds,
        orderBy: orderBy
      },
      type : 'post',
      sCallback: function (data) {
        callback && callback(data);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(param);
  }

  doLogin(doLoginCallback) {
    var that = this
    wx.login({
      success: function(res) {
        var code = res.code;
        console.log('小程序code');
        console.log(code);
        that.doLoginByCode(code, (res) => {
          console.log("base里的doLogin")
          console.log("登陆信息");
          console.log(res);
          wx.setStorageSync('token', res.data.userToken);
          wx.setStorageSync('baseInfo', res.data);
          doLoginCallback && doLoginCallback(res);
        });;
      }
    })
  }


  doLoginByCode(code, callback) {
    var params = {
      url: '/user/login_by_code.do',
      type: 'post',
      data: {
        identityType: "xcx",
        identifier: code
      },
      sCallback: function(res) {
        
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);

  }


  updateUserInfo(callback) {

    var data = {
      nickname: app.globalData.userInfo.nickName,
      sex: app.globalData.userInfo.gender,
      language: app.globalData.userInfo.language,
      province: app.globalData.userInfo.province,
      country: app.globalData.userInfo.country,
      avatarUrl: app.globalData.userInfo.country
    }

    var params = {
      url: '/user/save.do',
      type: 'post',
      data: data,
      sCallback: function(res) {
        callback && callback(res);
      }
    }
    //这里继承了，可以直接用
    this.javarequest(params);
  }



  // 获得元素上绑定的值
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };
}

export {
  Base
};