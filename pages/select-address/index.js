import {
  SelectAddressModel
} from 'select-address-model.js'
var selectAddress = new SelectAddressModel();

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList: [],
    defaultShippingId : 0 
  },

  selectTap: function(e) {
    var id = e.currentTarget.dataset.id;
    
    var data = {
      token: app.globalData.token,
      defaultShippingId: id,
    }

    selectAddress.updateShippingAddress(data, (res) => {
      wx.navigateBack({})
    })

  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function() {
    console.log('onLoad')
  },

  onShow: function() {
    this.initShippingAddress();
  },

  initShippingAddress: function() {
    var that = this;
    selectAddress.getShippingList((res) => {
      if (res.status == 0) {
        that.setData({
          addressList: res.data
        });
      } else if (res.status == 700) {
        that.setData({
          addressList: null
        });
      }
    })

    selectAddress.getUserInfoVo((res) => {
      if (res.status == 0) {
        that.setData({
          defaultShippingId : res.data.defaultShippingId
        });
      }
    })
  }
})