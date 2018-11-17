//app.js
App({
  onLaunch: function() {
    var that = this;


    wx.login({
      success: function(res) {
        var code = res.code;
        console.log("执行登陆")
        wx.request({
          url: that.globalData.apiDomain + that.globalData.subDomain + '/user/login_by_code.do',
          data: {
            identityType: "xcx",
            identifier: code
          },
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          success: function(res) {
            console.log("啊啊啊啊")
            console.log(res)
            wx.setStorageSync('token', res.data.data.userToken);
            wx.setStorageSync('baseInfo', res.data.data);
          },
        })
      }
    })

  },



  sendTempleMsg: function(orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type: 0,
        module: 'order',
        business_id: orderId,
        trigger: trigger,
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        //console.log('*********************');
        //console.log(res.data);
        //console.log('*********************');
      }
    })
  },
  sendTempleMsgImmediately: function(template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + that.globalData.subDomain + '/template-msg/put',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token: that.globalData.token,
        type: 0,
        module: 'immediately',
        template_id: template_id,
        form_id: form_id,
        url: page,
        postJsonString: postJsonString
      },
      success: (res) => {
        console.log(res.data);
      }
    })
  },

  globalData: {
    userInfo: null,
    //apiDomain: "http://127.0.0.1:8080/",
    //subDomain: "linjoiny", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
    apiDomain: "https://api.test.kuolei.com/",
    subDomain: "abc", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
    version: "2.0",
    shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
  }
  /*
  根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒；
  1、/pages/to-pay-order/index.js 中已添加关闭订单、商家发货后提醒消费者；
  2、/pages/order-details/index.js 中已添加用户确认收货后提供用户参与评价；评价后提醒消费者好评奖励积分已到账；
  3、请自行修改上面几处的模板消息ID，参数为您自己的变量设置即可。  
   */
})