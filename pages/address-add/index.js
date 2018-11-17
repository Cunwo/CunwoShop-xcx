var commonCityData = require('../../utils/city.js')


import {
  AddressAddModel
} from 'address-add-model.js'
var addressAdd = new AddressAddModel();

//获取应用实例
var app = getApp()
Page({
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0,
    region: ['北京市', '北京市', '东城区'],

  },
  bindCancel: function() {
    wx.navigateBack({})
  },

  //点击保存的时候
  bindSave: function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }




    var apiAddOrUpdate = "add.do";
    var apiAddid = that.data.id;
    if (apiAddid) {
      apiAddOrUpdate = "update.do";
    } else {
      apiAddid = 0;
    }

    var data = {
      token: app.globalData.token,
      id: apiAddid,
      receiverName: linkMan,
      receiverProvince: that.data.region[0],
      receiverCity: that.data.region[1],
      receiverDistrict: that.data.region[2],
      receiverAddress: address,
      receiverPhone: mobile,
      receiverZip: code,
      isDefault: 1
    }

    addressAdd.addOrUpdateShippingAddress(data, apiAddOrUpdate, (res) => {
      if (res.status != 0) {
        // 登录错误 
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: res.data.msg,
          showCancel: false
        })
        return;
      }
      // 跳转到结算页面
      wx.navigateBack({})
    })

  },



  initCityData: function(level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }

  },


  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },


  onLoad: function(e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    if (id) {
      // 初始化原数据
      wx.showLoading();
      addressAdd.getAddressDetail(id, (res) => {
        wx.hideLoading();
        if (res.status == 0) {
          that.setData({
            id: id,
            addressData: res.data,
            selProvince: res.data.receiverProvince,
            selCity: res.data.receiverCity,
            selDistrict: res.data.receiverDistrict,
            region: [res.data.receiverProvince, res.data.receiverCity, res.data.receiverDistrict]
          });
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: '无法获取快递地址数据',
            showCancel: false
          })
        }
      })
    }
  },
  deleteAddress: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function(res) {
        if (res.confirm) {
          addressAdd.delShippingAddress(id, (res) => {
            wx.navigateBack({})
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx: function() {
    let that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
        that.setData({
          wxaddress: res,
          region: [res.provinceName, res.cityName, res.countyName]
        });
      }
    })
  }
})