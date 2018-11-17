var wxpay = require('../../utils/pay.js')
var app = getApp()

import {
  OrderListModel
} from 'order-list-model.js'
var orderList = new OrderListModel();


Page({
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    currentType: 10,
    currentTap: 0,
    tabClass: ["", "", "", "", ""],
    //支付参数
    timeStamp: '',
    nonceStr: '',
    package: '',
    signType: 'MD5',
    paySign: '',
  },
  statusTap: function(e) {

    var currentTap;
    if (e.currentTarget.dataset.index == 0) {
      var curType = 10;
      currentTap = 0;
    } else if (e.currentTarget.dataset.index == 1) {
      var curType = 20;
      currentTap = 1;
    } else if (e.currentTarget.dataset.index == 2) {
      var curType = 40;
      currentTap = 2;
    } else if (e.currentTarget.dataset.index == 3) {
      var curType = 70;
      currentTap = 3;
    } else if (e.currentTarget.dataset.index == 4) {
      var curType = 50;
      currentTap = 4;
    }



    this.data.currentType = curType
    console.log(curType)
    this.setData({
      currentType: curType,
      currentTap: currentTap
    });
    this.onShow();
  },
  orderDetail: function(e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function(e) {
    var that = this;


    var orderId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();

          var data = {
            // token: app.globalData.token,
            orderId: orderId
          };

          orderList.cancelOrder(data, (res) => {
            // wx.setStorageSync('Cookie', res.header['Set-Cookie'].split(";")[0].split("=")[1]);
            wx.hideLoading();
            if (res.status == 0) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  toPayTap: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var orderNo = e.currentTarget.dataset.no;
    console.log(orderId)
    var money = e.currentTarget.dataset.money;


    orderList.wxpay(app, money, orderId, orderNo, "/pages/order-list/index", (res) => {
      if (res.status == 0) {
        // 发起支付
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: 'MD5',
          paySign: res.data.paySign,
          fail: function (aaa) {
            wx.showToast({ title: '支付失败:' + aaa })
          },
          success: function () {
            wx.showToast({ title: '支付成功' })
            wx.redirectTo({
              url: "/pages/order-list/index"
            });
          }
        })
      }
      else if (res.status == 10) {
        orderList.doLogin((doLoginRes) => {
          console.log("订单页的doLogin")
          console.log(doLoginRes);
          //登陆成功
          if (doLoginRes.status == 0) {
            //再次发送支付请求
            orderList.wxpay(app, money, orderId, "/pages/order-list/index", (res) => {
              if (res.status == 0) {
                // 发起支付
                wx.requestPayment({
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  fail: function (aaa) {
                    wx.showToast({ title: '支付失败:' + aaa })
                  },
                  success: function () {
                    wx.showToast({ title: '支付成功' })
                    wx.redirectTo({
                      url: "/pages/order-list/index"
                    });
                  }
                })
              }
            })
          }
        });
      }
      else {
        wx.showToast({ title: '服务器忙' + res.data.code + res.data.msg })
      }
    })


    // wx.request({
    //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
    //   data: {
    //     token: app.globalData.token
    //   },
    //   success: function(res) {
    //     if (res.data.code == 0) {
    //       // res.data.data.balance
    //       money = money - res.data.data.balance;
    //       if (money <= 0) {
    //         // 直接使用余额支付
    //         wx.request({
    //           url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
    //           method: 'POST',
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //           },
    //           data: {
    //             token: app.globalData.token,
    //             orderId: orderId
    //           },
    //           success: function(res2) {
    //             that.onShow();
    //           }
    //         })
    //       } else {
    //         console.log("在这里")

    //       }
    //     } else {
    //       wx.showModal({
    //         title: '错误',
    //         content: '无法获取用户资金信息',
    //         showCancel: false
    //       })
    //     }
    //   }
    // })
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },

  //获取订单的静态信息
  getOrderStatistics: function() {
    var that = this;

    orderList.getOrderStatistics(app.globalData.token, (res) => {
      var tabClass = that.data.tabClass;
      //未支付
      if (res.data.NO_PAY > 0) {
        tabClass[0] = "red-dot"
      } else {
        tabClass[0] = ""
      }
      //已付款
      if (res.data.PAID > 0) {
        tabClass[1] = "red-dot"
      } else {
        tabClass[1] = ""
      }
      //已发货
      if (res.data.SHIPPED > 0) {
        tabClass[2] = "red-dot"
      } else {
        tabClass[2] = ""
      }
      //未评价
      if (res.data.ORDER_NO_REPUTATION > 0) {
        tabClass[3] = "red-dot"
      } else {
        tabClass[3] = ""
      }
      //已完成
      if (res.data.ORDER_SUCCESS > 0) {
        //tabClass[4] = "red-dot"
      } else {
        //tabClass[4] = ""
      }

      that.setData({
        tabClass: tabClass,
      });

    })

  },



  onShow: function() {
    // 获取订单列表
    wx.showLoading();
    var that = this;
    var postData = {
      token: app.globalData.token
    };
    postData.orderStatus = that.data.currentType;



    this.getOrderStatistics();


    orderList.getOrderList(postData, (res) => {
      // wx.setStorageSync('Cookie', res.header['Set-Cookie'].split(";")[0].split("=")[1]);
      wx.hideLoading();
      if (res.status == 0) {
        that.setData({
          orderList: res.data.list,
          logisticsMap: {},
          goodsMap: res.data.list
        });
      } else {
        this.setData({
          orderList: null,
          logisticsMap: {},
          goodsMap: {}
        });
      }
    })

  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  }
})