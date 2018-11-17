//index.js
//获取应用实例
var app = getApp()


import {
  ToPayOrderModel
} from 'to-pay-order-model.js'
var toPay = new ToPayOrderModel();

Page({
  data: {
    productList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    totalPrice: 0,
    ShippingPrice: 0,
    allGoodsAndShippingPrice: 0,
    productJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    curAddressData: {},
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null,// 当前选择使用的优惠券array1
    array: ['快递', 'EMS', '平邮'],
  },

  onLoad: function(e) {
    var that = this;
    that.setData({
      isNeedLogistics: 1, //显示收货地址标识
      orderType: e.orderType //
    });

  },

  onShow: function() {

    console.log("aaaaa")
    //初始化收货地址
    var that = this;


    var shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');

      console.log("购物车信息" + shopCarInfoMem.shopList)

      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      productList: shopList,
    });

    that.initShippingAddress();



  },


  createOrder: function(e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = ""; // 备注信息
    if (e) {
      remark = e.detail.value.remark; // 备注信息
    }
    console.log("收货地址")
    console.log(that.data.curAddressData)
    var data = {
      productJsonStr: JSON.stringify(that.data.productList),
      shippingId: that.data.curAddressData ? that.data.curAddressData.id : null,
      //shippingId: 45,
      remark: remark  , //备注
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请先设置您的收货地址！',
          showCancel: false
        })
        return;
      }
    }
    if (that.data.curCoupon) {
      data.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      //创建订单（仅计算价格）
      data.calculate = "true";
    }

    console.log("111111111111")

    toPay.createOrder1(data, (res) => {


      console.log("啊啊啊啊")

      wx.hideLoading();
      if (res.status != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }

      if (e && "buyNow" != that.data.orderType) {
        // 清空购物车数据
        wx.removeStorageSync('shopCarInfo');
      }

      if (!e) {
        that.setData({
          isNeedLogistics: res.data.orderInfo.needLogistics,
          totalPrice: res.data.orderInfo.payment,
          allGoodsAndShippingPrice: res.data.orderInfo.postage + res.data.orderInfo.payment,
          shippingPrice: res.data.orderInfo.postage ,
          yunPrice: res.data.orderInfo.postage ,
          allGoodsAndYunPrice: res.data.orderInfo.payment + res.data.orderInfo.postage
        });
        //that.getMyCoupons();
        return;
      }



      // 下单成功，跳转到订单管理界面
      wx.redirectTo({
        url: "/pages/order-list/index"
      });
    })
  },



  initShippingAddress: function() {
    var that = this;
    toPay.getDefaultShipping(app.globalData.token, (res) => {
      console.log("这里啊")
      console.log(res.data)
      if (res.status == 0) {
        console.log("这里啊2")
        that.setData({
          curAddressData: res.data
        },()=>{
          that.createOrder()
        });
        console.log(that.data.curAddressData)
      } else {
        that.setData({
          curAddressData: null
        }, () => {
          that.createOrder()
        });
      }

    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  addAddress: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function() {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  getMyCoupons: function() {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: app.globalData.token,
        status: 0
      },
      success: function(res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndShippingPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function(e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  }
})